

const CONTACTS = 'contacts'
const MANIFEST  = 'manifest'
const TOPICS = 'topics'

// ----
let g_search_table = {}
let g_when_table = {}
let g_all_keys = []

let g_prune_timeout = null

const TIMEOUT_THRESHHOLD = 4*60*60


var alert_error = (msg) => {
    alert(msg)
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


async function fetch_asset(topics_cid,user_cid,asset) {  // specifically from this user
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    
    let data_stem = '/get-asset/${asset}'
    let sp = '//'
    let post_data = {
        "cid" : topics_cid
    }
    let search_result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( search_result ) {
        let data = search_result.data;
        let decryptor = window.user_decryption(user_cid,asset)
        if ( decryptor !== undefined ) {
            try {
                data = decryptor(data)
            } catch (e) {
            }
        }
        if ( data ) {
            let data_obj = JSON.parse(data)
            try {
                return data_obj
            } catch (e) {
            }
        }
    }
}


export async function fetch_contacts(contacts_cid,user_cid) {  // specifically from this user
    return await fetch_asset(contacts_cid,user_cid,CONTACTS)
}

export async function fetch_manifest(manifest_cid,user_cid) {  // specifically from this user
    return await fetch_asset(manifest_cid,user_cid,MANIFEST)
}

export async function fetch_manifest(topics_cid,user_cid) {  // specifically from this user
    return await fetch_asset(topics_cid,user_cid,TOPICS)
}


// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
// ASSETS


async function update_asset_to_ipfs(asset,user_cid,is_business,contents) {
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let encryptor = window.user_encryption(user_cid,asset)
    let encoded_contents = contents
    if ( encryptor !== undefined ) {
        encoded_contents = encryptor(contents)
    }
    //
    let data_stem = '/put-asset/${asset}'
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


export async function fetch_contact_page(asset,contact_cid) {  // specifically from this user
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    if ( contact_cid !== undefined ) {
        asset = 'cid'
    }
    let data_stem = '/get-contact-page/${asset}'
    let sp = '//'

    let post_data = {
        "cid" : contact_cid
    }
    let search_result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( search_result ) {
        let data = search_result.data;
        let decryptor = window.user_decryption(user_cid,asset)
        if ( decryptor !== undefined ) {
            try {
                data = decryptor(data)
            } catch (e) {
            }
        }
        if ( data ) {
            let data_obj = JSON.parse(data)
            try {
                return data_obj
            } catch (e) {
            }
        }
    }
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
    if ( user_info.cid !== undefined ) {        // remove reference to a cid when adding a new profile...
        delete user_info.cid
    }
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = '/add/profile'
    let sp = '//'
    let post_data = user_info
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let ipfs_identity = result.data
        // "id" : cid with key,
        // "clear_id" : cid without key,
        // "dir_data" : user directory structure
        u_info.cid = ipfs_identity.id
        await store_identity(ipfs_identity,u_info)
        return true
    }
    return false
}


export async function get_dir(user_info,clear) {
    //
    for ( let field of g_user_fields ) {
        if ( user_info[field] === undefined ) {
            if ( (field ===  "public_key")  && !(clear) ) {
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
    let data_stem = '/dir'
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
            if ( (field ===  "public_key")  && !(clear) ) {
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
    for ( let field of g_user_fields ) {
        if ( recipient_info[field] === undefined ) {
            if ( (field ===  "public_key")  && clear ) {
                delete recipient_info.public_key
                continue
            }
            alert_error("undefined field " + field)
            return
        }
    }

    let sendable_message = {}
    sendable_message.when = Date.now()
    sendable_message.date = (new Date(message.when)).toISOString()

    if ( clear ) {
        sendable_message = message
    }

    message.name = user_info.name
    message.user_cid = user_info.cid
    message.public_key = recipient_info.public_key

    if ( !clear ) {
        let key_to_wrap = window.key_wrapper(user_info)
        if ( key_to_wrap === undefined ) {
            alert_error("could not get key ")
            return
        } else {
            sendable_message.message = JSON.stringify(message)
            let encryptor = window.user_encryption(user_cid,"message")
            let encoded_contents = sendable_message.message 
            if ( encryptor !== undefined ) {
                encoded_contents = encryptor(contents)
            }
            sendable_message.message = encoded_contents
            sendable_message.wrapped_key = key_wrapper(key_to_wrap,recipient_info.public_key)
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
        "receiver" : recipient_info,
        "message" : sendable_message
    }
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let m_cid = result.message_cid
        return m_cid
    }
    return false
}


export async function send_message(recipient_info,user_info,message) {
    let m_path = '/send/message'
    let result = await send_kind_of_message(m_path,recipient_info,user_info,message,false)
    return result
}


export async function send_introduction(recipient_info,user_info,message) {
    let m_path = '/send/introduction'
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

async function get_spool_files(user_info,spool_select,offset,count) {
    //
    let cid = user_info.cid
    if ( cid === undefined ) return false
    //
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = '/get-spool'
    let sp = '//'
    let post_data = {
        'cid' : cid,
        'spool' : spool_select,
        'business' : user_info.business,
        'offset' : offset,
        'count' : count
    }
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let messages = result.data
        try {
            messages = JSON.parse(messages)
            return messages
        } catch (e) {}
    }
    return false
}


export async function get_message_files(user_info,offset,count) {
    return get_spool_files(user_info,true,offset,count)
}

export async function get_topic_files(user_info,offset,count) {
    return get_spool_files(user_info,false,offset,count)
}


// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
//
//  PUBLIC TEMPLATES AVAILABLE FROM DESIGNERS....
//

export async function get_template_list(offset,count,category) {
    //
    if ( category === undefined ) {
        category = 'any'
    }
    //
    let cid = user_info.cid
    if ( cid === undefined ) return false
    //
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = '/template-list/${category}'
    let sp = '//'
    let post_data = {
        'category' : category,
        'business' : user_info.business,
        'start' : offset,
        'count' : count
    }
    let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data)
    if ( result.status === "OK" ) {
        let t_list = result.data
        try {
            t_list = JSON.parse(t_list)
            return t_list
        } catch (e) {}
    }
    return false
}


export async function get_contact_template(template_cid) {
    //
    let data_stem = '/get/template/${template_cid}'
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

export async function put_contact_template(name,data) {
    //
    let srver = location.host
    srver = correct_server(srver)
    //
    let prot = location.protocol  // prot for (prot)ocol
    let data_stem = '/put/template/${template_cid}'
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

