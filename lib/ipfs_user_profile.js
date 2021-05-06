const fsPromise   = require('fs/promises')
//
const IPFSManageFiles = require('./ipfs_manage_files')

class IPFSProfilesPars extends IPFSManageFiles {
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
  
    // get_manifest
    //
    async get_manifest(u_cid) {  /// user cid
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
      } else {
        files = await this.get_user_topics(user_cid,btype,offset,count)
      }
    
      // make sure the files are in decreasing data order
      files.sort((f1,f2) => {
        let d1 = new Date(f1.name)
        let d2 = new Date(f2.name)
        let i1 = d1.getTime()
        let i2 = d2.getTime()
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
        let dir_data = await this.make_profile_directories(cid,profile_data,btype,false,contact_cid)
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
        let user_info = body.reciever
        let receiver_cid = await this.add_profile_file(user_info)  // recover the cid, not required to be known by sener
        // the receiver will need some of the personal information from the message.
        let m_cid = await this.add_message_to_user_directory(receiver_cid,subdir,message)
        return(m_cid)
    }

    async get_cid_spool_files(user_cid,body) {
        let spool_name = body.spool ? "spool" : "topics"
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
        return this.get_cid_spool_files(user_cid,body)
    }


    //
    async get_default_user_clear_contact_form(body) {
        let user_cid = await this.add_profile_file(body.user_info)
        let manifest = await this.get_manifest(user_cid)
        let contact_cid = manifest.default_contact_form;
        return contact_cid
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
        let manifest = await this.get_json_from_cid(m_cid)
        return manifest
    }
    //
    async fetch_cid_contacts(body) {
        let contacts_cid = body.cid
        let contact_file = this.get_complete_file_from_cid(contacts_cid)
        return contact_file
    }
    //
    async fetch_cid_topic_file(body) {
        let topics_cid = body.cid
        let topics_file = this.get_complete_file_from_cid(topics_cid)
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
        let btype = body.business
        if ( typeof btype === 'boolean'  ) {
            btype = btype ? "business" : "profile"
        }
        let u_path = this.get_user_path(user_cid,btype)
        let tree = await this.get_dir_recursive(u_path)
        return tree
    }

    async write_to_profile_path(body,asset) {
        let user_cid = body.user_cid
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

    async add_template_json(name,data) {
        let t_path = `/${this.service_dir}/grand_${biz_t}_repository/templates/${name}`
        let file = await this.update_file_in_ipfs(t_path,data) 
        return file.cid
    }
    
    async get_template_files(btype,category,offset,count) {
        let data_list = []
        if ( Array.isArray(btype) ) {
            for ( let biz_t of btype ) {
                let t_path = `/${this.service_dir}/grand_${biz_t}_repository/templates`
                let list_list_el = await this.get_dir_entries(t_path,offset,count)
                if ( category !== false ) {
                    list_list_el = list_list_el.filter(path_el => {
                        let t_path = path_el.file
                        return ( t_path.includes(category) )
                    })
                }    
                data_list.push(list_list_el)
            }
        } else {
            let t_path = `/${this.service_dir}/grand_${btype}_repository/templates`
            let list_list_el = await this.get_dir_entries(t_path,offset,count)
            if ( category !== false ) {
                list_list_el = list_list_el.filter(path_el => {
                    let t_path = path_el.file
                    return ( t_path.includes(category) )
                })
            }    
            data_list.push(list_list_el)
        }
        data_list = data_list.map(datum => {
            return datum.toString()
        })
        return data_list
    }

}


module.exports = IPFSProfiles