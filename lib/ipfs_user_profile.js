const fsPromise   = require('fs/promises')
//
const IPFSManageFiles = require('./ipfs_manage_files')
const {insert_by_pref, addError} = require('./utils.js')

class IPFSProfiles extends IPFSManageFiles {
    //
    constructor(conf) {
        super(conf)
        this.from_cid = conf.template_source_as_cid
        this.template_input_sources = conf.template_input_sources
        this.service_dir = `copious.world`
        if ( (conf.service_dir !== undefined) && (typeof conf.service_dir === 'string') ) {
            this.service_dir = conf.service_dir
        }
    }
  
    // get_default_contact_from_manifest
    //
    async get_default_contact_from_manifest(cid) {  /// user cid
      let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${cid}`
      let manifest_path = `${profile_path}/manifest`
      let manifest_obj = this.get_json_from_file(manifest_path)
      return manifest_obj
    }
  
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  
    // get_user_spool
    //
    async get_user_spool(user_cid,btype,offset,count) {
      let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${user_cid}`
      let spool_path = `${profile_path}/spool`
      let spool_files = await this.get_dir_entries(spool_path,offset,count)
      return spool_files
    }
  
    // get_user_topics
    //
    async get_user_topics(user_cid,btype,offset,count) {
      let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${user_cid}`
      let topics_path = `${profile_path}/topic_spool`
      let topics_files = await this.get_dir_entries(topics_path,offset,count)
      return topics_files
    }
  
    // get_spool_files
    //
    async get_spool_files(user_cid,spool_name,btype,offset,count) {
      let files = []
      if ( spool_name === 'spool' ) {
        files = await this.get_user_spool(user_cid,btype,offset,count)
      } else {
        files = await this.get_user_topics(user_cid,btype,offset,count)
      }
    
      // make sure the files are in decreasing data order
      files.sort((f1,f2) => {
        let d1 = new Date(f1.name)
        let d2 = new Date(f2.name)
        let i1 = d1.getTime()
        let i2 = d1.getTime()
        return (i2 - i1)
      })
    
      let message_list = []
      for ( let file of files ) {
        let f_cid = file.cid
        let fdata = await this.get_complete_file_from_cid(f_cid)
        message_list.push(fdata)
      }
    
      return(message_list)
    }
    
  
    // add_message_to_user_directory
    // message is in any state of encryption, determined by the sender
    // subdir ... one of spool, topic_spool
    async add_message_to_user_directory(cid,subdir,message) {
        let btype = message.business
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        let dir_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${cid}/${subdir}/`
        return await this.add_date_bearing_message_to_timestamp_dir(dir_path,message)
    }

    async add_profile_message(body,subdir) {
        let message = body.message
        let user_info = body.reciever
        let cid = await this.add_profile_file(user_info)

        // the receiver will need some of the personal information from the message.
        message.name = body.name
        message.user_cid = cid
        message.business = user_info.business
        if ( user_info.public_key ) {
            message.public_key = user_info.public_key
        }

        let m_cid = this.add_message_to_user_directory(cid,subdir,message)
        return(m_cid)
    }
  
    //
    //  add_contact_template_file
    async add_contact_template_file(default_contact_page_path,form_link) {
        let fpath = this.template_input_sources + '/' + form_link
        let data = ''
        if ( (this.from_cid !== undefined) && !(this.from_cid) ) {  // a local directory
            data = (await fsPromise.readFile(fpath)).toString()
        } else if (this.from_cid !== undefined) {                   // a file stored in IPFS and we have the cid
            data = await this.get_complete_file_from_cid(this.from_cid)
        } else return(false)
        //
        let fdata = await this.update_file_in_ipfs(default_contact_page_path,data)
        return fdata.cid
    }
    
    //
    // make_profile_directories
    //
    async make_profile_directories(cid,profile_data,btype,minimal,default_clear_contact_cid) {
        //
        let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${cid}`
        let profile_dir = this.create_dir(profile_path)
        //
        let spool_path = `${profile_path}/spool`
        let spool_dir = await this.create_dir(spool_path)
        //
        let contact_file = false
        if ( !minimal ) {
            let contacts_path = `${profile_path}/contacts`
            contact_file = await this.update_file_in_ipfs(contacts_path,'{}')
        }
        //
        let topics_spool_path = `${profile_path}/topic_spool`
        let topic_dir = await this.create_dir(topics_spool_path)
        //
        let topic_file = false
        if ( !minimal ) {
            let topics_path = `${profile_path}/topics`
            topic_file = await this.update_file_in_ipfs(topics_path,'{}')
        }
        //
        let contact_pages_dir = false
        if ( !minimal ) {
            let contact_pages_path = `${profile_path}/contact_forms`
            contact_pages_dir = await this.update_file_in_ipfs(contact_pages_path,'{}')
        }
        //
        if ( !minimal ) {
            //
            let manifest = {
                "default_contact_form" : default_clear_contact_cid,    // a template CID (composition done at the interface),
                "custom_contact_forms" : [ profile_data.form_link ],
                "max_preference" : 1.0,
                "op_history" : []     // the last N Ops (N ... to be configured)
            }
            manifest = JSON.stringify(manifest)
            //
            let manifest_path = `${profile_path}/manifest`
            let manifest_file = await this.update_file_in_ipfs(manifest_path,manifest)
            //
            let path_data = {
                "dirs" : {
                    "profile" : profile_dir,
                    "spool" : spool_dir,
                    "topics" : topic_dir,
                    "contact_pages" : contact_pages_dir  
                },
                "files" : {
                    "id" : cid,
                    "contacts" : contact_file,
                    "topics" : topic_file,
                    "manifest" : manifest_file
                }
            }
            //
            return(path_data)
        } else {
            let default_contact_page_path = `${profile_path}/contact_form`
            let default_contact_cid = await this.add_contact_template_file(default_contact_page_path,profile_data.form_link)
            return default_contact_cid
        }
    }

 
/*
  let path_data = {
    "dirs" : {
      "profile" : profile_dir,
      "spool" : spool_dir,
      "topics" : topic_dir,
      "contact_pages" : contact_pages_dir  
    },
    "files" : {
      "id" : cid,
      "contacts" : contact_file,
      "topics" : topic_file
    }
  }
*/
    //
    async add_profile_file(storable_profile) {
        let storage_str = JSON.stringify(storable_profile)
        const clear_file = await this.ipfs.add(storage_str)   // information that will not change about the user
        let clear_cid = clear_file.cid.toString()
        return clear_cid
    }

    //
    async add_profile(profile_data) {
        //
        let btype = profile_data.business
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        //
        let storable_profile = Object.assign({},profile_data)
        delete storable_profile.form_link
        delete storable_profile.answer_message      // this just gets added later when messages are sent...
        let save_pkey = storable_profile.public_key
        //
        delete storable_profile.public_key
        //
        // make the clear directory
        let clear_cid = await this.add_profile_file(storable_profile)
        let contact_cid = await this.make_profile_directories(clear_cid,profile_data,btype,true)
        //
        storable_profile.public_key = save_pkey
        let cid = await this.add_profile_file(storable_profile)
        await this.make_profile_directories(cid,profile_data,btype,false,contact_cid)
        //
        return ([cid,clear_cid])      // ipfs entry...
    }
    
    //
    async edit_manifest(cid,old_manifest_cid,op,proceed) {
        //
        let profile_path = `/copious.world/grand_${btype}_repository/profiles/${user_cid}`
        let manifest_path = `${profile_path}/manifest`
        //
        let file = await ipfs.files.stat(manifest_path)
        let manifest_entry = {
            "file" : file.name,
            "cid" : file.cid.toString(),   /// new cid
            "size" : file.size
        }
        //
        if ( manifest_entry ) {
            let m_cid = manifest_entry.cid
            if ( m_cid !== old_manifest_cid ) {
                addError(new Error("Manifest has been replaced"))
            }
            //
            // proceed with the old manifest CID
            if ( proceed ) {
                let manifest_data = await this.get_complete_file_from_cid(cid)
                try {
                    //
                    let manifest_obj = JSON.parse(manifest_data)
                    if ( op ) {     ///  MANIFEST OPERATIONS
                        //
                        let store_op = Object.assign({},op)
                        store_op.when = Date.now()
                        manifest_obj.op_history.push(store_op)
                        //
                        let cfile_cid = op.cid // a contact form
                        let encrypted = op.encrypted
                        let preference = op.preference
                        switch ( op.cmd ) {
                            case 'add' : {
                                if ( (manifest_obj.max_preference <  preference) && (encrypted == flase) ) {
                                    manifest_obj.default_contact_form = cfile_cid
                                    manifest_obj.max_preference = preference
                                }
                                let b = manifest_obj.custom_contact_forms.some((cfile) => {
                                    return ( cfile.cid === cfile_cid )
                                })
                                if ( b ) {
                                    insert_by_pref(manifest_obj.custom_contact_forms,{
                                    "file" : cfile_cid,
                                    "preference" : preference,
                                    "encrypted" : encrypted
                                    })
                                }
                                //
                                break;
                            }
                            case 'delete' : {
                                let contact_form_list = manifest_obj.custom_contact_forms.filter((cform) => {
                                    return(cform.cid !== cfile_cid)
                                })
                                manifest_obj.custom_contact_forms = contact_form_list // list without the form being discarded
                                // 
                                // try to find a clear text form to replace the default 
                                // if the default is being discarded. If there is not one, then don't replace.. Expect user to search for a better one.
                                if ( cfile_cid == manifest_obj.default_contact_form ) { 
                                    for ( let cform_entry of manifest_obj.custom_contact_forms ) {
                                        if ( cform_entry.encrypted === false ) {
                                            manifest_obj.default_contact_form = cform_entry.cid
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                            case 'update_default' : {   // only apply to the default. Preference is not read
                                manifest_obj.default_contact_form = cfile_cid
                                // if this does not exsist, then insert it...
                                let b = manifest_obj.custom_contact_forms.some((cfile) => {
                                    return ( cfile.cid === cfile_cid )
                                })
                                if ( !b ) {
                                    insert_by_pref(manifest_obj.custom_contact_forms,{
                                    "file" : cfile_cid,
                                    "preference" : preference,
                                    "encrypted" : encrypted
                                    })
                                }
                                break;
                            }
                        }
                    }
                    let manifest = JSON.stringify(manifest_obj)
                    let manifest_cid = await this.update_file_in_ipfs(manifest_path,manifest)
                    return(manifest_cid)
                    //
                } catch (e) {
                    console.dir(e)
                }
            }
            //
        }
        return false
    }
        
}
  


module.exports = IPFSProfiles