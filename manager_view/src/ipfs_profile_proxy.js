
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
const CONTACTS = 'contacts'
const MANIFEST  = 'manifest'
const TOPICS = 'topics'

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
let g_search_table = {}
let g_when_table = {}
let g_all_keys = []

let g_prune_timeout = null

const TIMEOUT_THRESHHOLD = 4*60*60


var alert_error = (msg) => {
    alert(msg)
    console.log(new Error("stack"))
}

export function set_alert_error_handler(fn) {
    if ( typeof fn === 'function' ) {
        alert_error = fn
    }
}


// got this from somewhere
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


function gen_unique_id() {
    let ky = uuidv4()
    while ( g_all_keys.indexOf(ky) >= 0 ) ky = uuidv4()
    return ky
}

var g_profile_port = '6111'
function correct_server(srvr) {
    srvr = srvr.replace('5111','6111')   /// CHANGE ...
    return srvr
}



// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
// ASSETS


async function fetch_asset(topics_cid,user_cid,btype,asset) {  // specifically from this user
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    
    let data_stem = `get-asset/${asset}`
    let sp = '//'
    let post_data = {
        "btype" : btype,
        "user_cid" : user_cid,
        "cid" : topics_cid
    }
    let search_result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( search_result ) {
        if ( search_result.status === "OK" ) {
            let data = search_result[asset];
            if ( typeof data === 'string' ) {
                let decryptor = window.user_decryption(user_cid,asset)      // user user cid to get the decryptor...
                if ( decryptor !== undefined ) {
                    try {
                        data = decryptor(data)
                    } catch (e) {
                    }
                }
                if ( data ) {
                    try {
                        let data_obj = JSON.parse(data)
                        return data_obj
                    } catch (e) {
                        return [false,data]
                    }
                }    
            } else {
                return data
            }
        }
    } else {
        return [false,search_result]
    }
}


export async function fetch_contacts(contacts_cid,user_cid,btype) {  // specifically from this user
    return await fetch_asset(contacts_cid,user_cid,btype,CONTACTS)
}

export async function fetch_manifest(manifest_cid,user_cid,btype) {  // specifically from this user
    return await fetch_asset(manifest_cid,user_cid,btype,MANIFEST)
}

export async function fetch_topicst(topics_cid,user_cid,btype) {  // specifically from this user
    return await fetch_asset(topics_cid,user_cid,btype,TOPICS)
}


// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
// ASSETS


async function update_asset_to_ipfs(asset,user_cid,is_business,contents) {
    let srver = location.host
    srver = correct_server(srver)
    //
    if ( typeof contents !== 'string' ) {
        contents = JSON.stringify(contents)
    }
    let encryptor = window.user_encryption(user_cid,asset)
    let encoded_contents = contents
    if ( encryptor !== undefined ) {
        encoded_contents = encryptor(contents)
    }
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = `put-asset/${asset}`
    let sp = '//'
    let post_data = {
        "cid" : user_cid,
        "business" : is_business,
        "contents" : encoded_contents
    }
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        return result.update_cid
    }
    return false
}


export async function update_contacts_to_ipfs(user_cid,is_business,contents) {
    return await update_asset_to_ipfs(CONTACTS,user_cid,is_business,contents)
}

export async function update_manifest_to_ipfs(user_cid,is_business,contents) {
    return await update_asset_to_ipfs(MANIFEST,user_cid,is_business,contents)
}

export async function update_topics_to_ipfs(user_cid,is_business,contents) {
    return await update_asset_to_ipfs(TOPICS,user_cid,is_business,contents)
}

// // contact page
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

//
// fetch_contact_page
//
export async function fetch_contact_page(user_cid,business,asset,contact_cid) {  // specifically from this user
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = `get-contact-page/${asset}`     // asset as parameter
    let sp = '//'

    let post_data = {
        "cid" : contact_cid,     //
        "business" : business
    }
    let search_result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( search_result ) {
        let contact = search_result.contact;
        let decryptor = window.user_decryption(user_cid,asset)
        if ( decryptor !== undefined ) {
            try {
                contact = decryptor(contact)
            } catch (e) {
            }
        }
        if ( contact ) {
            if ( typeof contact === "string" ) {
                let data_obj = JSON.parse(contact)
                try {
                    return data_obj
                } catch (e) {
                }
            } else {
                return contact
            }
        }
    }
    return false
}

// // 
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

let g_user_fields = ["name", "DOB", "place_of_origin", "cool_public_info", "business", "public_key"]
// not checking for "cid" for most cases...
export async function add_profile(u_info) {
    let user_info = Object.assign(u_info)
    //
    for ( let field of g_user_fields ) {
        if ( user_info[field] === undefined ) {
            if ( field ===  "public_key" ) {
                let p_key = get_user_public_wrapper_key(`${user_info.name}-${user_info.DOB}`)   // out of DB (index.html)
                if ( p_key ) {
                    user_info[field] = p_key
                    continue
                }
            }
            alert_error("undefined field " + field)
            return
        }
    }
    if ( user_info.cid !== undefined ) {        // remove reference to a cid when adding a new profile...
        delete user_info.cid
    }
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = 'add/profile'
    let sp = '//'
    let post_data = user_info
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let ipfs_identity = result.data
        if ( typeof ipfs_identity.dir_data === 'string' ) {
            ipfs_identity.dir_data = JSON.parse(ipfs_identity.dir_data)
        }
        // "id" : cid with key,
        // "clear_id" : cid without key,
        // "dir_data" : user directory structure
        u_info.cid = ipfs_identity.id
        await store_user(u_info,ipfs_identity)
        return true
    }
    return false
}


export async function fetch_contact_cid(someones_info,clear) {  // a user,, not the owner of the manifest, most likely a recipients
    let user_info = Object.assign({},someones_info) 
    for ( let field of g_user_fields ) {
        if ( user_info[field] === undefined ) {
            if ( (field === "public_key") && clear ) {
                delete user_info.public_key
                continue;
            }
            alert_error("undefined field " + field)
            return
        }
    }
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = 'get/user-cid'
    let sp = '//'
    let post_data = user_info
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let cid = result.cid
        return cid
    }
    return false
}


export async function fetch_contact_info(cid) {  // a user,, not the owner of the manifest, most likely a recipients
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = 'get/user-info'
    let sp = '//'
    let post_data = {
        "cid" : cid
    }
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let user_info = result.user_info
        return user_info
    }
    return false
}




export async function get_dir(user_info,clear) {
    //
    for ( let field of g_user_fields ) {
        if ( user_info[field] === undefined ) {
            if ( (field === "public_key")  && !(clear) ) {
                let p_key = get_user_public_wrapper_key(`${user_info.name}-${user_info.DOB}`)
                if ( p_key ) {
                    user_info[field] = p_key
                    continue
                }
            }
            alert_error("undefined field " + field)
            return
        }
    }
    //
    if ( clear ) {
        delete user_info.public_key 
    }
    //
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = 'dir'
    let sp = '//'
    let post_data = user_info
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let dir_tree = result.data
        try {
            dir_tree = JSON.parse(dir_tree)
            return dir_tree
        } catch (e) {}
    }
    return false
}

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

let g_message_fields = ["name", "user_cid", "subject", "readers", "date", "when", "business", "public_key", "wrapped_key", "encoding","message"]
async function send_kind_of_message(m_path,recipient_info,user_info,message,clear) {
    //
    for ( let field of g_user_fields ) {
        if ( user_info[field] === undefined ) {
            // public_key is the public wrapper key (asymmetric)
            if ( field ===  "public_key" ) {  // always send the wrapper key (although not a wrapped_key) especially for an introduction
                let p_key = get_user_public_wrapper_key(`${user_info.name}-${user_info.DOB}`)
                if ( p_key ) {
                    user_info[field] = p_key
                    continue
                }
            }
            alert_error("undefined field " + field)
            return
        }
    }
    //
    let recipient = Object.assign({},recipient_info)
    for ( let field of g_user_fields ) {
        if ( (field === "wrapped_key")  && clear ) {     // when wrapping a key use the recipients public wrapper key
            delete recipient_info.wrapped_key            // delete wrapped key from messages that are introductions, etc. It won't be used
            continue
        }
        if ( recipient[field] === undefined ) {
            alert_error("undefined field " + field)
            return
        }
    }

    let sendable_message = {}
                                                        // the recipient will wrap key with this (so refresh his memory)
    if ( clear ) {
        sendable_message = message
        // the id of the clear directory ignores the key.
        // the identity of established contact messages requires the public (so it stays for not clear)
        delete recipient.public_key  // this has to do with the identiy and the directory where introductions go.
    } else  {
        //
        sendable_message.when = Date.now()
        sendable_message.date = (new Date(sendable_message.when)).toISOString()
        //
        let user_cid = user_info.cid
        //
        sendable_message.name = user_info.name       // from
        sendable_message.user_cid = user_cid    // cid of from
        sendable_message.public_key = user_info.public_key  // basically says we know the recipient (we have talked)
        //
        let key_to_wrap = window.gen_cipher_key(user_info)
        if ( key_to_wrap === undefined || !(key_to_wrap) ) {
            alert_error("could not get key ")
            alert("no cipher key")
            return
        } else {
            sendable_message.message = JSON.stringify(message)
            let encryptor = window.user_encryption(user_cid,"message")
            let encoded_contents = sendable_message.message 
            if ( encryptor !== undefined ) {
                encoded_contents = encryptor(encoded_contents,key_to_wrap)
            }
            sendable_message.message = encoded_contents
            sendable_message.wrapped_key = window.key_wrapper(key_to_wrap,recipient.public_key)
            //
            sendable_message.subject = message.subject
            sendable_message.readers = message.subject
            sendable_message.business = message.business
        }
    }
    //
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = m_path
    let sp = '//'
    let post_data = {
        "receiver" : recipient,
        "message" : sendable_message
    }
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let m_cid = result.message_cid
        return m_cid
    }
    return false
}

/*
if ( !(introduction) && encrypting ) {
    if ( encrypting ) {
        message = {
            "name" : active_identity.user_info.name,
            "user_cid" : active_identity.cid
        }
        let [wrapped, aes_key] = get_wrapped_aes_key(public_key)  // recipient's public wrapper key
        message.wrapped_key = wrapped
        message.ctext = get_encipherd_message(JSON.stringify(message_object),aes_key)
    }
}
*/


export async function send_message(recipient_info,user_info,message) {
    let m_path = 'send/message'
    let result = await send_kind_of_message(m_path,recipient_info,user_info,message,false)
    return result
}


export async function send_introduction(recipient_info,user_info,message) {
    let m_path = 'send/introduction'
    let result = await send_kind_of_message(m_path,recipient_info,user_info,message,true)
    return result
}


export async function send_topic(recipient_info,user_info,message) {
    let m_path = '/send/topic'
    let result = await send_kind_of_message(m_path,recipient_info,user_info,message,false)
    return result
}


export async function send_topic_offer(recipient_info,user_info,message) {
    let m_path = '/send/topic_offer'
    let result = await send_kind_of_message(m_path,recipient_info,user_info,message,true)
    return result
}

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

async function* message_decryptor(messages,identity) {
    let priv_key = identity.priv_key
    for ( let message of messages ) {
        let wrapped_key = message.wrapped_key
        try {
            message.message = await window.decipher_message(message.message,wrapped_key,priv_key)
            yield message    
        } catch (e) {}
    }
}

async function clarify_message(messages,identity) {
    let clear_messages = []
    try {
        for await (let message of message_decryptor(messages,identity) ) {
            try {
                let cmessage = JSON.parse(message)
                clear_messages.push(cmessage)
            } catch (e) {
                clear_messages.push(message)
            }
        }
    } catch (e) {
        console.log('caught', e)
    }
    return(clear_messages)
}


async function get_spool_files(identity,spool_select,clear,offset,count) {
    //
    let cid = identity.cid
    if ( clear ) {
        cid = identity.clear_cid
    }
    if ( cid === undefined ) return false
    //
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = 'get-spool'
    let sp = '//'
    let post_data = {
        'cid' : cid,
        'spool' : spool_select,  // false for introduction
        'business' : identity.user_info.business,
        'offset' : offset,
        'count' : count
    }
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let messages = result.data
        try {
            if ( Array.isArray(messages) ) {
                messages = messages.map(msg => {
                    if ( typeof msg === "string" ) {
                        try {
                            let obj = JSON.parse(msg)
                            return obj
                        } catch(e) {
                            return msg
                        }
                    }
                })
            } else if ( typeof messages === 'string' ) {
                messages = JSON.parse(messages)
            }
            if ( !clear ) {
                messages = await clarify_message(messages,identity)
            }
            return messages
        } catch (e) {}
    }
    return false
}


export async function get_message_files(identity,offset,count) {
    let expected_messages = await get_spool_files(identity,true,false,offset,count)
    let solicitations = await get_spool_files(identity,true,true,offset,count)
    return [expected_messages,solicitations]
}

export async function get_topic_files(identity,offset,count) {
    let expected_messages = await get_spool_files(identity,false,false,offset,count)
    let solicitations = await get_spool_files(identity,false,true,offset,count)
    return [expected_messages,solicitations]
}


// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
//
//  PUBLIC TEMPLATES AVAILABLE FROM DESIGNERS....
//


export async function get_template_list(offset,count,category,btype) {
    //
    if ( category === undefined ) {
        category = 'any'
    }
    //
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = `template-list/${category}`
    let sp = '//'
    let post_data = {
        'category' : category,
        'business_types' : btype ? "business" : "profile",
        'start' : offset,
        'count' : count
    }
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let t_list = result.templates
        try {
            t_list = JSON.parse(t_list)
            return t_list
        } catch (e) {}
    }
    return false
}



export async function get_contact_template(template_cid) {
    //
    let data_stem = `get/template-cid/${template_cid}`
    let result = await fetchEndPoint(data_stem,g_profile_port)
    if ( result.status === "OK" ) {
        let contact_template = result.template
        if ( typeof contact_template === "string" ) {
            try {
                contact_template = JSON.parse(contact_template)
                return contact_template
            } catch (e) {}    
        } else {
            return contact_template
        }
    }
    return false
}


export async function get_named_contact_template(template_name,biz) {
    //
    let biz_t = biz ? "business" : "profile"
    let data_stem = `get/template-name/${biz_t}/${template_name}`
    let result = await fetchEndPoint(data_stem,g_profile_port)
    if ( result.status === "OK" ) {
        let contact_template = result.data
        try {
            t_list = JSON.parse(contact_template)
            return contact_template
        } catch (e) {}
    }
    return false
}



export async function get_named_contact_template_cid(template_name,biz) {
    let data_stem = `get/template-cid-from-name/${biz}/${template_name}`
    let result = await fetchEndPoint(data_stem,g_profile_port)
    if ( result.status === "OK" ) {
        let cid = result.cid
        return cid
    }
    return false
}


export async function put_contact_template(name,data) {
    //
    let srver = location.host
    srver = correct_server(srver)
    //
    if ( typeof data !== 'string' ) {
        data = JSON.stringify(data)
    }
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = 'put/template'
    let sp = '//'
    let post_data = {
        'name' : name,
        'uri_encoded_json' : encodeURIComponent(data)
    }
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let t_cid = result.template_cid
        return t_cid
    }
    return false
}

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
//


const CHUNK_SIZE = 1000000
// upload_data_file
export async function upload_data_file(name,blob64) {
    //
    let srver = location.host
    srver = correct_server(srver)
    //
    if ( typeof data !== 'string' ) {
        data = JSON.stringify(data)
    }
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = 'put/blob'
    let sp = '//'
    let len = blob64.length
    let post_data = {
        "name" : name,
        "tstamp" : Date.now(),
        "offset" : i,
        "chunk" : "",
        "end" : false
    }
    for ( let i = 0; i < len; i += CHUNK_SIZE ) {
        let chunk = blob64.substr(i,CHUNK_SIZE)
        post_data.chunk = chunk
        post_data.offset = i
        if ( (i + CHUNK_SIZE ) > len ) {
            post_data.end = true
        }
        let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
        if ( result.status === "OK" ) {
            if ( result.end_of_data ) {
                let f_cid = result.cid
                return f_cid    
            }
        }
    }

    return false
    //
}


// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
//


// dont_store_html
export function dont_store_html(manifest_obj) {
    //
    let cc_forms = manifest_obj.custom_contact_forms
    //
    let cids = []
    let cid_map = {}
    if ( Array.isArray(cc_forms) ) {
        for ( let entry of cc_forms ) {
            delete entry.html;
            let cid = entry.cid
            if ( entry.preference === undefined ) {
                entry.preference = 1.0
            }
            cids.push(entry.cid)
            cid_map[cid] = entry
        }
    } else {
        cid_map = cc_forms
        for ( let cid in cc_forms ) {
            let entry = cc_forms[cid]
            delete entry.html;
            entry.cid = cid
            cids.push(cid)
        }
    }

    manifest_obj.custom_contact_forms = cid_map
    manifest_obj.sorted_cids = cids.sort((a,b) => {
        return(cid_map[a].preference - cid_map[b].preference)
    })
}





/*		MANIFEST EDITING
//
async edit_manifest(user_cid,old_manifest_cid,op,proceed) {
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
        let no_error = true
        proceed = (proceed === undefined) ? false : proceed
        let m_cid = manifest_entry.cid
        if ( m_cid !== old_manifest_cid ) {
            no_error = false
            addError(new Error("Manifest has been replaced"))
        }
        //
        // proceed with the old manifest CID
        if ( proceed || no_error ) {
            let manifest_data = await this.get_complete_file_from_cid(old_manifest_cid)
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
                            if ( (manifest_obj.max_preference <  preference) && (encrypted == false) ) {
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

*/

