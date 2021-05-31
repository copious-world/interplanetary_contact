const fsPromise   = require('fs/promises')
//
const IPFSManageFiles = require('./ipfs_manage_files')

class IPFSProfilesPars extends IPFSManageFiles {
    //
    constructor(conf) {
        //
        super(conf)
        //
        this.from_cid = conf.template_source_as_cid
        this.template_input_sources = conf.template_input_sources
        this.service_dir = `copious.world`
        if ( (conf.service_dir !== undefined) && (typeof conf.service_dir === 'string') ) {
            this.service_dir = conf.service_dir
        }
        //
        this.default_contact_form = conf.default_contact_form
        this.default_contact_map = conf.default_contact_map
    }
  
    // get_manifest
    //
    async get_manifest(u_cid,btype) {  /// user cid
      let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${u_cid}`
      let manifest_path = `${profile_path}/manifest`
      let manifest_obj = this.get_json_from_file(manifest_path)
      return manifest_obj
    }
  

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    // get_user_spool
    //
    async get_user_spool(user_cid,btype,offset,count) {
      let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${user_cid}`
      let spool_path = `${profile_path}/spool`
      let spool_files = await this.get_dir_entries(spool_path,false,offset,count)
      return spool_files
    }
  
    // get_user_topics
    //
    async get_user_topics(user_cid,btype,offset,count) {
      let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${user_cid}`
      let topics_path = `${profile_path}/topic_spool`
      let topics_files = await this.get_dir_entries(topics_path,false,offset,count)
      return topics_files
    }

    async get_user_category(user_cid,spool_name,btype,offset,count) {
        try {
            let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${user_cid}`
            let spool_path = `${profile_path}/${spool_name}`
            let cat_files = await this.get_dir_entries(spool_path,false,offset,count)
            return cat_files    
        } catch (e) {}
        return []
    }
    
    get_user_path(user_cid,btype) {
        let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${user_cid}`
        return profile_path
    }
  
    // get_spool_files
    //
    async get_spool_files(user_cid,spool_name,btype,offset,count) {
      let files = []
      if ( spool_name === 'spool' ) {
        files = await this.get_user_spool(user_cid,btype,offset,count)
      } else if ( spool_name === 'topics' ) {
        files = await this.get_user_topics(user_cid,btype,offset,count)
      } else {
        files = await this.get_user_category(user_cid,spool_name,btype,offset,count)
      }
    
      // make sure the files are in decreasing data order
      files.sort((f1,f2) => {
        let d1 = new Date(f1.file)
        let d2 = new Date(f2.file)
        let i1 = d1.getTime()
        let i2 = d2.getTime()
        return (i2 - i1)
      })
    
      let message_list = []
      let cid_list = []
      for ( let file_dscr of files ) {
        let f_cid = file_dscr.cid
        try {
            let fdata = await this.get_complete_file_from_cid(f_cid)
            message_list.push(fdata)
            cid_list.push(f_cid)    
        } catch(e){}
      }
    
      return([message_list,cid_list])
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

    //
    //  add_contact_template_file
    async add_contact_template_file(users_default_contact_page_path,form_link) {
        let data = form_link.html  // default is to assume that someone is a contact form that is ready to go
        // otherwise, require that there is some sort of file spec (an override of the previous condition)
        if ( (form_link.from_file !== undefined) && form_link.from_file ) {   // a local directory
            data = (await fsPromise.readFile(form_link.from_file)).toString()
        } else if (form_link.from_cid !== undefined) {                   // a file stored in IPFS and we have the cid
            data = await this.get_complete_file_from_cid(form_link.from_cid)
        }
        //  users_default_contact_page_path
        //  write the file containing the user's choice of contact form to the user directory
        let fdata = await this.update_file_in_ipfs(users_default_contact_page_path,data)
        return fdata.cid
    }


    //
    // make_profile_directories
    //
    //          make one of two directories and initialize the assets belonging to the user 
    //          1) clear directory (minimal)  2) crypto directory (identity with public key) (minimal=false)
    //
    async make_profile_directories(cid,profile_data,btype,clear_cid,default_clear_contact_cid) {
        //
        // Directory for the user... top level
        let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${cid}`
        let profile_dir = await this.create_dir(profile_path)
        //
        // These are the user messages 
        let spool_path = `${profile_path}/spool`
        let spool_dir = await this.create_dir(spool_path)
        //
        // a file containing user contacts... this is kept encrypted (crypto ops done on client)
        let contact_file = false
        if ( (clear_cid !== false) ) {
            let contacts_path = `${profile_path}/contacts`
            contact_file = await this.update_file_in_ipfs(contacts_path,'{}')
        }
        //
        // these are user messages targeted for topics (allowed publications, even advertising)
        let topics_spool_path = `${profile_path}/topic_spool`
        let topic_dir = await this.create_dir(topics_spool_path)
        //
        // a file containing user topics... this is kept encrypted (crypto ops done on client)
        let topic_file = false
        if ( (clear_cid !== false) ) {
            let topics_path = `${profile_path}/topics`
            topic_file = await this.update_file_in_ipfs(topics_path,'{}')
        }
        //
        // this is a directory where custom contact pages are stored...
        let contact_pages_dir = false
        if ( (clear_cid !== false) ) {
            let contact_pages_path = `${profile_path}/contact_forms`
            contact_pages_dir = await this.create_dir(contact_pages_path)
        }
        //
        // The manifest contains addresses of contact pages and keeps track of preferences.
        if ( (clear_cid !== false) ) {
            //
            let manifest = {
                "default_contact_form" : default_clear_contact_cid,    // a template CID (composition done at the interface),
                "clear_cid" : clear_cid,
                "custom_contact_forms" : {},
                "sorted_cids" : [ default_clear_contact_cid ], 
                "max_preference" : 1.0,
                "op_history" : []     // the last N Ops (N ... to be configured)
            }
            //
            let dcc_cid = default_clear_contact_cid
            manifest.custom_contact_forms[dcc_cid] = {
                                                        "encrypted" : false,
                                                        "preference" : 1.0,
                                                        "wrapped_key" : false,
                                                        "info" : "default contact form : service provision "
                                                }
            manifest = JSON.stringify(manifest)
            //
            let manifest_path = `${profile_path}/manifest`
            let manifest_file = await this.update_file_in_ipfs(manifest_path,manifest)
            //
    // Finally, (CRYPTO DIR) return the directory access information to the user (facing client)
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
            // MINIMAL (CLEAR) store a default contact form to be used for introductions.... return CID
            let default_contact_page_path = `${profile_path}/contact_form`   // whoever knows the clear CID of a user can get the default form
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
    async add_profile(profile_data) {
        //
        let btype = profile_data.business
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        //
        let storable_profile = Object.assign({},profile_data)
        if ( storable_profile.form_link !== undefined) delete storable_profile.form_link
        if ( storable_profile.answer_message !== undefined) delete storable_profile.answer_message      // this just gets added later when messages are sent...
        if ( storable_profile.cid !== undefined) delete storable_profile.cid
        //
        let save_pkey = storable_profile.public_key  // not included in the clear version..
        let save_psigner_key = storable_profile.signer_public_key
        //
        delete storable_profile.public_key
        //
        // make the clear directory -- has to be made first
        let clear_cid = await this.add_profile_file(storable_profile)
        let contact_cid =   await this.make_profile_directories(clear_cid,profile_data,btype,false)
        //
        storable_profile.public_key = save_pkey
        storable_profile.signer_public_key = save_psigner_key
        storable_profile.clear_cid = clear_cid
        let cid = await this.add_profile_file(storable_profile)
        let dir_data =      await this.make_profile_directories(cid,      profile_data,btype,clear_cid,contact_cid)
        //
        return ([cid,clear_cid,dir_data])      // ipfs entry...
    }
    
    // ---- 
        
}
  

class IPFSProfiles extends IPFSProfilesPars {
    //
    constructor(conf) {
        super(conf)
    }

    async add_profile_message(body,subdir) {   // subdir is one of 'spool' or 'topic_spool'
        let message = body.message
        let user_info = body.receiver
        let receiver_cid = await this.add_profile_file(user_info)  // recover the cid, not required to be known by sener
        // the receiver will need some of the personal information from the message.
        let m_cid = await this.add_message_to_user_directory(receiver_cid,subdir,message)
        return(m_cid)
    }

    async get_cid_spool_files(user_cid,body) {
        let spool_name = "spool"
        if ( typeof body.spool !== 'boolean' ) {
            spool_name = body.spool
        } else {
            spool_name = body.spool ? "spool" : "topics"
        }
        
        let btype = body.business
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        let offset = (body.start === undefined) ?  body.offset : body.start
        let count = body.count
        return await this.get_spool_files(user_cid,spool_name,btype,offset,count)
    }

    async get_spool_files_body(body) {
        let user_cid = body.cid
        return await this.get_cid_spool_files(user_cid,body)
    }

    async remove_messages(user_cid,btype,message_list) {
        //
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        //
        let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${user_cid}`
        let spool_path = `${profile_path}/spool`
        for ( let f_name of message_list ) {
            await this.remove_file(spool_path,f_name)
        }
    }

    async move_messages_to_dir(user_cid,dst_cid,btype,src_dir,parameter,message_list) {
        //
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        let profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${user_cid}`
        let spool_path = `${profile_path}/${src_dir}`
        //
        profile_path = `/${this.service_dir}/grand_${btype}_repository/profiles/${dst_cid}`
        let cat_path = `${profile_path}/${parameter}`
        //

        try {
            let dir_type = await this.path_is_dir(cat_path)
            if ( !dir_type ) {
                await this.ipfs.files.rm(cat_path)
            }
        } catch(e) {}

        let entries = await this.get_dir_entries(spool_path,false,0,100)
        console.dir(entries)

        for ( let entry of entries ) {
            let fname = entry.file
            let f_cid = entry.cid
            let do_move = (message_list.indexOf(f_cid) >= 0)
            if ( do_move ) {
                let e_path = `${spool_path}/${fname}`
                try {
                    let recat_path = `${cat_path}/${fname}`
                    await this.move_file(e_path,recat_path)
                } catch(e) {}    
            }
        }
        //
        //for ( let f_name of message_list ) {
        //    await this.move_file(spool_path,cat_path,f_name)
        //}
        //
    }

    //
    async get_default_user_clear_contact_form(body) {
        let user_cid = await this.add_profile_file(body.user_info)
        let manifest = await this.get_manifest(user_cid)
        let contact_cid = manifest.default_contact_form;
        return contact_cid
    }


    async get_default_contact_page_user_path(body) {
        let user_cid = body.cid
        let btype = body.business
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        let u_path = this.get_user_path(user_cid,btype)
        let c_path = `${u_path}/contact_form`
        let cid = this.get_cid_from_path(c_path)
        return cid
    }

    // the chosen contact form
    //
    async get_default_cid_clear_contact_form(body) {
        let user_cid = body.cid
        let manifest = await this.get_manifest(user_cid)
        let contact_cid = manifest.default_contact_form;
        return contact_cid
    }

    //
    async fetch_user_cid_manifest(body) {
        let user_cid = body.cid
        let manifest = await this.get_manifest(user_cid)
        return manifest
    }
    
    //
    async fetch_cid_manifest(body) {
        let m_cid = body.cid
        let manifest = await this.get_complete_file_from_cid(m_cid)
        return manifest
    }
    //
    async fetch_cid_contacts(body) {
        let contacts_cid = body.cid
        let contact_file = await this.get_complete_file_from_cid(contacts_cid)
        return contact_file
    }
    //
    async fetch_cid_topic_file(body) {
        let topics_cid = body.cid
        let topics_file = await this.get_complete_file_from_cid(topics_cid)
        return topics_file
    }

    // contacts file  (stored encrypted)
    //
    async get_cid_selected_contact_file(body,res_stream) {
        let a_path = body.path
        if ( a_path.include('contact_forms') ) {
            let p_cid = this.get_cid_from_path(a_path)
            await this.stream_file_from_cid(p_cid,res_stream)    
        } else {
            res_stream.end("no such path")
        }
    }

    async get_user_dir(user_info) {
        let user_cid = user_info.cid
        let btype = user_info.business
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        let u_path = this.get_user_path(user_cid,btype)
        let tree = await this.get_dir_recursive(u_path)
        return tree
    }

    async write_to_profile_path(body,asset) {
        let user_cid = body.cid
        let btype = body.business
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        let profile_path = this.get_user_path(user_cid,btype)
        let asset_path = `${profile_path}/${asset}`
        let contents = body.contents
        //
        let asset_file = await this.update_file_in_ipfs(asset_path,contents)
        return asset_file.cid
    }

    async output_default_contact(btype,manifest_string) {
        try {
            let btype = body.business
            if ( typeof btype === 'boolean'  ) {
                btype = btype ? "business" : "profile"
            }
            let manifest_obj = JSON.parse(manifest_string)
            //
            let profile_path = this.get_user_path(manifest_obj.clear_cid,btype)
            let c_path = `${profile_path}/contact_form`
            let form_link = {
                "from_cid" : manifest_obj.default_contact_form
            }
            await this.add_contact_template_file(c_path,form_link)

        } catch (e) {}
    }

    async add_template_data(name,biz_t,data) {
        let t_path = `/${this.service_dir}/grand_${biz_t}_repository/templates/${name}`
        let file = await this.update_file_in_ipfs(t_path,data) 
        return file.cid
    }
    

    async get_template_data(name,biz_t) {
        let t_path = `/${this.service_dir}/grand_${biz_t}_repository/templates/${name}`
        let cid = await this.get_cid_from_path(t_path)
        let t_file_data = await this.get_complete_file_from_cid(cid) 
        return t_file_data
    }

    async get_template_cid(name,biz_t) {
        let t_path = `/${this.service_dir}/grand_${biz_t}_repository/templates/${name}`
        let cid = await this.get_cid_from_path(t_path)
        return cid
    }

    async get_template_files(btype,category,offset,count) {
        let data_list = []
        if ( Array.isArray(btype) ) {
            for ( let biz_t of btype ) {
                let t_path = `/${this.service_dir}/grand_${biz_t}_repository/templates`
                let list_list_el = await this.get_dir_entries(t_path,category,offset,count)
                data_list = data_list.concat(list_list_el)
            }
        } else {
            let t_path = `/${this.service_dir}/grand_${btype}_repository/templates`
            let list_list_el = await this.get_dir_entries(t_path,category,offset,count)
            data_list = list_list_el
        }
        return data_list
    }

}


module.exports = IPFSProfiles