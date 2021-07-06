//
const IPFSProfiles = require('./lib/ipfs_user_profile')

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------


let g_user_fields = [ "name", "DOB", "place_of_origin", "cool_public_info", "business", "public_key", "signer_public_key", "biometric" ]
let g_message_fields = ["name", "user_cid", "subject", "readers", "date", "business", "public_key","message"]
let g_private_message_fields = [ "business","date","message","name","nonce","signature","user_cid","version","wrapped_key"]

// contacts -- one encrypted file containing contacts (people/entities with whom you share public keys)
// topics -- one encrypted file containing contacts (entities and concepts from which you will accept publications)
// manifest -- describes customized contact forms that you keep. The list provides information that you send to people you want messages from.
// contact_forms -- contact forms or templates that will be in the manifest... (writing to this requires a manifest update)
let g_asset_typtes = [ "contacts", "topics", "manifest", "contact_forms"]

class IPContact {

  constructor(conf) {
    this.blob_keeper = {}
    this.ipfs_profiles = new IPFSProfiles(conf)    
  }

  async init_ipfs(conf) {
    let ipfs = await this.ipfs_profiles.init_ipfs(conf)
    return ipfs
  }

  async add_profile(storable_profile) {
    if ( !(this.ipfs_profiles) ) {
      return ({ "status" : "fail", "reason" : "not initialized"} )
    }
    try {
      //
      for ( let fld of g_user_fields ) {
        if ( storable_profile[fld] === undefined ) {
          return { "status" : "fail", "reason" : "missing fields"}
        }
      }
      //
      let profile_exists =  await this.ipfs_profiles.check_existence(storable_profile)
      if ( profile_exists || (( storable_profile.ovrerride !== undefined ) && storable_profile.ovrerride) ) {
        return { "status" : "fail", "reason" : "existing profile directory" }
      } else {
        let cids = await this.ipfs_profiles.add_profile(storable_profile)
        //
        let ipfs_identity = {
          "id" : cids[0],       // with public key
          "clear_id" : cids[1], // without public key
          "dir_data" : JSON.stringify(cids[2])
        }
        //
        return { "status" : "OK", "data" : ipfs_identity }
      }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  async get_user_cid(body) {
    if ( !(this.ipfs_profiles) ) { return ({ "status" : "fail", "reason" : "not initialized"}) }
    try {
      let cid =  await this.ipfs_profiles.add_profile_file(body)
      return { "status" : "OK", "cid" : cid }  
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  async get_user_info(body) {
    if ( !(this.ipfs_profiles) ) { return ({ "status" : "fail", "reason" : "not initialized"}) }
    try {
      let cid = body.cid
      if ( cid ) {
        let user_info =  await this.ipfs_profiles.get_json_from_cid(cid)
        if ( user_info ) {
          return { "status" : "OK", "user_info" : user_info }
        }
      }
      return { "status" : "fail", "reason" : "no such user" }  
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  async dir(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let tree = await this.ipfs_profiles.get_user_dir(body)
      return { "status" : "OK", "data" : JSON.stringify(tree) }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  async send_message(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let message = body.message
      for ( let fld of g_private_message_fields ) {
        if ( message[fld] === undefined ) {
          return { "status" : "fail", "reason" : "missing fields"}
        }
      }
      let receiver = body.receiver
      for ( let fld of g_user_fields ) {
        if ( receiver[fld] === undefined ) {
          return { "status" : "fail", "reason" : "missing fields"}
        }
      }
      for ( let fld in receiver ) {   // use just the field required to establish identity
        if ( g_user_fields.indexOf(fld) < 0 ) {
          if ( fld === "clear_cid" ) continue
          delete receiver[fld]
        }
      }
      //
      let message_cid = await this.ipfs_profiles.add_profile_message(body,"spool")
      return { "status" : "OK", "message_cid" : message_cid }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }


  async send_introduction(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    //
    try {
      let message = body.message
      for ( let fld of g_message_fields ) {
        if ( message[fld] === undefined ) {
          return { "status" : "fail", "reason" : "missing fields"}
        }
      }
      let receiver = {}   // recipient fields that are used to get a cid for the user ... find spool directory
      for ( let fld of g_user_fields ) {
        if ( fld === "public_key"  || fld === "signer_public_key" || fld === "biometric" ) {
          // this record translates into a cid... the clear version does not use other key information
          continue;
        }
        if ( body.receiver[fld] === undefined ) {
          return { "status" : "fail", "reason" : "missing fields"}
        }
        receiver[fld] = body.receiver[fld]
      }
      //
      body.receiver = receiver
      let message_cid = await this.ipfs_profiles.add_profile_message(body,"spool")
      return { "status" : "OK", "message_cid" : message_cid }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
    //
  }


  async send_introduction_cid(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    //
    try {
      let message = body.message
      for ( let fld of g_message_fields ) {
        if ( message[fld] === undefined ) {
          return { "status" : "fail", "reason" : "missing fields"}
        }
      }
      let message_cid = await this.ipfs_profiles.add_profile_message_cid(body,"spool")
      return { "status" : "OK", "message_cid" : message_cid }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
    //
  }


  async send_topic(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let message = body.message
      for ( let fld of g_message_fields ) {
        if ( message[fld] === undefined ) {
          return { "status" : "fail", "reason" : "missing fields"}
        }
      }
      //
      let topic_cid = await this.ipfs_profiles.add_profile_message(body,"topic_spool")
      return { "status" : "OK", "message_cid" : topic_cid }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  async send_topic_offer(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    //
    for ( let fld of g_message_fields ) {
      if ( fld === "public_key"  || fld === "wrapped_key" ) {
        message[fld] !== undefined
        delete message[fld]
        continue;
      }
      if ( message[fld] === undefined ) {
        return { "status" : "fail", "reason" : "missing fields"}
      }
    }
    let receiver = body.receiver
    for ( let fld of g_user_fields ) {
      if ( receiver[fld] === undefined ) {
        return { "status" : "fail", "reason" : "missing fields"}
      }
    }
    //
    let offer_template_cid = await this.ipfs_profiles.write_to_profile_path(body,"topic_spool")
    body.template_cid = offer_template_cid
    delete body.contents
    //
    let topic_cid = await this.ipfs_profiles.add_profile_message(body,"topic_spool")
    return { "status" : "OK", "message_cid" : topic_cid }
  }


  // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------


// get messages or topics from the spool file....
  async get_spool(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let answer = { "status" : "error", "reason" : "unidentified spool" }
      if ( body.cid !== undefined ) {
        let [messages,cid_list] = await this.ipfs_profiles.get_spool_files_body(body)
        answer = { "status" : "OK", "data" : messages, "cid_list" : cid_list }
      }
      return answer
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }


  // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
  // get messages or topics from the spool file....
  async get_asset(body,asset) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let answer = { "status" : "error", "reason" : "unidentified asset" }
      switch ( asset ) {
        case "contacts" : {
          let file_data = await this.ipfs_profiles.fetch_cid_contacts(body)
          answer = { "status" : "OK", "contacts" : file_data }
          break;
        }
        case "topics" : {
          let file_data = await this.ipfs_profiles.fetch_cid_topic_file(body)
          answer = { "status" : "OK", "topics" : file_data }
          break;
        }
        case "manifest" : {
          //let user_cid = body.user_cid
          //let btype = body.b_type ? "business" : "profile"
          let file_data = await this.ipfs_profiles.fetch_cid_manifest(body)
          answer = { "status" : "OK", "manifest" : file_data }
          break;
        }
      }
      return answer
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }


  // get messages or topics from the spool file....
  async get_contact_page(body,asset) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let answer = { "status" : "error", "reason" : "unidentified asset" }
      if ( asset !== "cid" ) {
        let cid = false
        if ( asset !== "default" ) {
          cid = this.ipfs_profiles.default_contact_map[asset]  // service provides different introduction types. (service is a curator)
          if ( cid === undefined ) {
            cid = this.ipfs_profiles.default_contact_form
          }
        } else {    // asset === "default"
          try {
            cid = await this.ipfs_profiles.get_default_contact_page_user_path(body)
          } catch (e) {}
          if ( !(cid) ) {
            cid = this.ipfs_profiles.default_contact_form
          }
        }
        let contact_file = await this.ipfs_profiles.get_complete_file_from_cid(cid)
        answer = { "status" : "OK", "contact" : contact_file }
      } else if ( asset === 'cid' ) {
        let cid = body.cid // from the manifest (by way of previous introduction (at least) from the recipient)
        let contact_file = await this.ipfs_profiles.get_complete_file_from_cid(cid)
        answer = { "status" : "OK", "contact" : contact_file }
      }
      return answer
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  async put_asset(body,asset) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      if ( g_asset_typtes.indexOf(asset) < 0 ) {
        return { "status" : "fail", "reason" : "unknown asset"}
      }
      if ( asset === 'manifest' ) {
        await this.ipfs_profiles.output_default_contact(body.business,body.contents)
      }
      //
      let update_cid = await this.ipfs_profiles.write_to_profile_path(body,asset)
      return { "status" : "OK", "update_cid" : update_cid, "asset" : asset }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }


  async put_asset(body,operation) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let biz_t = body.business
      let parameter = body.param
      let user_cid = body.user_cid
      let dst_cid = body.dst_cid
      let message_list = body.message_list.split(',')
      //
      let src_dir = 'spool'
      if ( body.source_category ) {
        src_dir = body.source_category
      }
      switch ( operation ) {
        case 'delete' : {
          await this.ipfs_profiles.remove_messages(user_cid,biz_t,message_list)
          break;
        }
        case 'move' : {
          await this.ipfs_profiles.move_messages_to_dir(user_cid,dst_cid,biz_t,src_dir,parameter,message_list)
          break;
        }
      }
      return { "status" : "OK" }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
 
  async get_json_cid(a_cid) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let jobj = await this.ipfs_profiles.get_json_from_cid(a_cid)
      if ( jobj ) {
        return { "status" : "OK", "json_str" : jobj }
      } else {
        return { "status" : "fail", "reason" : "no file data"}
      } 
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }
  
  // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
  // BLOB
  async put_blob(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let file_name = body.name 
      let tstamp = body.tstamp
      //
      let key = file_name + '-' + tstamp
      let blob_holder = this.blob_keeper[key]
      if ( blob_holder === undefined ) {
        blob_holder = Object.assign({},body)
        this.blob_keeper[key] = blob_holder
      } else {
        blob_holder.chunk += body.chunk
      }
      //
      if ( body.end ) {
        delete blob_holder.end
        delete blob_holder.offset
        delete this.blob_keeper[key]
        let blob_descr = JSON.stringify(blob_holder)
        let cid = await this.ipfs_profiles.add_data(blob_descr)
        return { "status" : "OK", "end_of_data" : true, "cid" : cid }
      } else {
        return { "status" : "OK", "end_of_data" : false }
      }
  
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  //
  async get_blob(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let cid = body.cid
      if ( cid ) {
        let output = await this.ipfs_profiles.get_complete_file_from_cid(cid)
        let blob_holder = JSON.parse(output)
        let chunked = blob_holder.chunk
        return { "status" : "OK", "end_of_data" : true, "data" : chunked }
      } else {
        return { "status" : "fail", "reason" : "bad parameter"}
      }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
  // TEMPLATES

  async template_list(body,category) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized" } }
    try {
      let btype = body.business_types   // may be an array or just a 
      if ( typeof btype === 'string' ) {
        if ( btype !== "profile" ) {
          btype = "business"
        }
      } else {
        btype = ( btype === undefined || btype === false ) ? "profile" : "business"
      }
      //
      let start = body.start
      let count = body.count
      let t_list
      if ( category === 'any' ) {
        t_list = await this.ipfs_profiles.get_template_files(btype,false,start,count)
      } else {
        t_list = await this.ipfs_profiles.get_template_files(btype,category,start,count)
      }
      t_list = JSON.stringify(t_list)
      return { "status" : "OK", "templates" : t_list }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }


  async get_template_cid(a_cid) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let template_obj = await this.ipfs_profiles.get_json_from_cid(a_cid)
      if ( template_obj ) {
        return { "status" : "OK", "template" : template_obj }
      } else {
        return { "status" : "fail", "reason" : "no template"}
      }    
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  async get_template_name(biz_t,a_file) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let template_obj = await this.ipfs_profiles.get_template_data(a_file,biz_t)
      return { "status" : "OK", "template" : template_obj }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

  
  async get_template_cid_from_name(biz_t,a_file) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let cid = await this.ipfs_profiles.get_template_cid(a_file,biz_t)
      return { "status" : "OK", "cid" : cid }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }


  async put_template(body) {
    if ( !(this.ipfs_profiles) ) { return { "status" : "fail", "reason" : "not initialized"} }
    try {
      let template_name = body.name 
      let template_data = body.uri_encoded_json
      template_data = decodeURIComponent(template_data)  // assume it is encoded...
      let btype = body.b_type ? "business" : "profile"
      let t_cid = await this.ipfs_profiles.add_template_data(template_name,btype,template_data)
      return { "status" : "OK", "template_cid" : t_cid }
    } catch (e) {
      console.error(e)
      return { "status" : "fail", "reason" : "server error"}
    }
  }

}


module.exports = IPContact