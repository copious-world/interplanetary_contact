const fsPromise = require('fs/promises')
const fs = require('fs')
const fastify = require('fastify')
const fastify_cors = require('fastify-cors')

const app = fastify()
//


//
//
const IPFSProfiles = require('./lib/ipfs_user_profile')

var g_ipfs_profiles = false

//// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// 

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

const conf_file = process.argv[2]  ?  process.argv[2] :  "contact-service.conf"
const crypto_conf = 'desk_app.config'

const config = fs.readFileSync(conf_file).toString()
const conf = JSON.parse(config)
// would crash if the config is bad... required.
//
// CONFIG PARAMETERS
//const g_streamer_port = conf.port
let g_port = conf.port
let g_prune_timeout = null;


//
let pdir = conf.play_dir
if ( pdir && (typeof pdir === 'string') && pdir[pdir.length - 1] !== '/' ) pdir += '/'

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

//let g_ctypo_M = new CryptoManager(crypto_conf)




app.register(fastify_cors, {
  origin : (origin, cb) => {
      if(/localhost/.test(origin)){
        //  Request from localhost will pass
        cb(null, true)
        return
      }
      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed"))
    }
})




app.get('/',(req, res) => {
  const stream = fs.createReadStream('./original_text/contact_style_1.html')
  res.type('text/html').send(stream)
})


// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

/*
    "name" : "Just Stew",
    "DOB" : "07/11/20",
    "place_of_origin" : "Lucky,Kentuky", 
    "cool_public_info" : "We are nice guys around here.", 
    "business" : "profile",
    "public_key" : '345345

*/
let g_user_fields = [ "name", "DOB", "place_of_origin", "cool_public_info", "business", "public_key" ]
app.post('/add/profile',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let storable_profile = req.body
  for ( let fld of g_user_fields ) {
    if ( storable_profile[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  //
  let cids = await g_ipfs_profiles.add_profile(storable_profile)
  //
  let ipfs_identity = {
    "id" : cids[0],
    "clear_id" : cids[1],
    "dir_data" : JSON.stringify(cids[2])
  }
  //
  res.type('application/json').send({ "status" : "OK", "data" : ipfs_identity })
  //
})


app.post('/get/user-cid',async (req, res) => {
  let body = req.body
  let cid =  await g_ipfs_profiles.add_profile_file(body)
  res.type('application/json').send({ "status" : "OK", "cid" : cid })
})


app.post('/dir',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let body = req.body
  let tree = await g_ipfs_profiles.get_user_dir(body)
  res.type('application/json').send({ "status" : "OK", "data" : JSON.stringify(tree) })
  //
})

/*
let body = {
    "receiver" : {
      "name" : "Just Stew",
      "DOB" : "07/11/20",
      "place_of_origin" : "Lucky,Kentuky", 
      "cool_public_info" : "We are nice guys around here.", 
      "business" : "profile"  
    },
    "message" : {   // recipient info...
      "name": 'Hans Solo', 
      "user_cid" : "4504385938",
      "subject" : "Darth Vadier Attacks",
      "readers" : "joe,jane,harry",
      "date" : Date.now(),
      "business" : false, 
      "public_key" : true,
      "wrapped_key" : false,
      "encoding" : "uri",
      "message" : encodeURIComponent("this is a big message with <b>HTML IN IT</b>")
    }
  }
*/

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------


let g_message_fields = ["name", "user_cid", "subject", "readers", "date", "when", "business", "public_key", "wrapped_key", "encoding","message"]
app.post('/send/message',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let body = req.body
  let message = body.message
  for ( let fld of g_message_fields ) {
    if ( message[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  let receiver = body.receiver
  for ( let fld of g_user_fields ) {
    if ( receiver[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  //
  let message_cid = g_ipfs_profiles.add_profile_message(body,"spool")
  res.type('application/json').send({ "status" : "OK", "message_cid" : message_cid })
})


app.post('/send/introduction',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let body = req.body
  let message = body.message
  for ( let fld of g_message_fields ) {
    if ( message[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  let receiver = body.receiver
  for ( let fld of g_user_fields ) {
    if ( fld === "public_key"  || fld === "wrapped_key" ) {  // neither key is used in establishing the identity of the recipient
      receiver[fld] !== undefined
      delete receiver[fld]
      continue;
    }
    if ( receiver[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  //
  let message_cid = g_ipfs_profiles.add_profile_message(body,"spool")
  res.type('application/json').send({ "status" : "OK", "message_cid" : message_cid })
})


app.post('/send/topic',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let body = req.body
  let message = body.message
  for ( let fld of g_message_fields ) {
    if ( message[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  //
  let topic_cid = g_ipfs_profiles.add_profile_message(body,"topic_spool")
  res.type('application/json').send({ "status" : "OK", "topic_cid" : topic_cid })
})


app.post('/send/topic_offer',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let body = req.body
  let message = body.message
  for ( let fld of g_message_fields ) {
    if ( fld === "public_key"  || fld === "wrapped_key" ) {
      message[fld] !== undefined
      delete message[fld]
      continue;
    }
    if ( message[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  let receiver = body.receiver
  for ( let fld of g_user_fields ) {
    if ( receiver[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  //
  let offer_template_cid = g_ipfs_profiles.write_to_profile_path(body,"topic_spool")
  body.template_cid = offer_template_cid
  delete body.contents
  //
  let topic_cid = g_ipfs_profiles.add_profile_message(body,"topic_spool")
  res.type('application/json').send({ "status" : "OK", "topic_cid" : topic_cid })
})




// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------


// get messages or topics from the spool file....
app.post('/get-spool',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let body = req.body
  let answer = { "status" : "error", "reason" : "unidentified spool" }
  //
  let messages = ""
  if ( body.cid !== undefined ) {
    messages = await g_ipfs_profiles.get_spool_files_body(body)
    answer = { "status" : "OK", "data" : messages }
  }
  //
  res.type('application/json').send(answer)
})

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

app.post('/get-asset/:asset',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let body = req.body
  let asset = req.params.asset
  //
  let answer = { "status" : "error", "reason" : "unidentified asset" }
  switch ( asset ) {
    case "contacts" : {
      let file_data = await g_ipfs_profiles.fetch_cid_contacts(body)
      answer = { "status" : "OK", "contacts" : file_data }
      break;
    }
    case "topics" : {
      let file_data = await g_ipfs_profiles.fetch_cid_topic_file(body)
      answer = { "status" : "OK", "topics" : file_data }
      break;
    }
    case "manifest" : {
      //let user_cid = body.user_cid
      //let btype = body.b_type ? "business" : "profile"
      let file_data = await g_ipfs_profiles.fetch_cid_manifest(body)
      answer = { "status" : "OK", "manifest" : file_data }
      break;
    }
  }
  res.type('application/json').send(answer)
})


app.post('/get-contact-page/:asset',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let body = req.body
  let asset = req.params.asset
  let answer = { "status" : "error", "reason" : "unidentified asset" }
  if ( asset !== "cid" ) {
    let cid = false
    if ( asset !== "default" ) {
      cid = g_ipfs_profiles.default_contact_map[asset]  // service provides different introduction types. (service is a curator)
      if ( cid === undefined ) {
        cid = g_ipfs_profiles.default_contact_form
      }
    } else {
      cid = g_ipfs_profiles.default_contact_form
    }
    let contact_file = this.get_complete_file_from_cid(cid)
    answer = { "status" : "OK", "contact" : contact_file }
  } else if ( asset === 'cid' ) {
    let cid = body.cid // from the manifest (by way of previous introduction (at least) from the recipient)
    let contact_file = this.get_complete_file_from_cid(cid)
    answer = { "status" : "OK", "contact" : contact_file }
  }
  res.type('application/json').send(answer)
})


// contacts -- one encrypted file containing contacts (people/entities with whom you share public keys)
// topics -- one encrypted file containing contacts (entities and concepts from which you will accept publications)
// manifest -- describes customized contact forms that you keep. The list provides information that you send to people you want messages from.
// contact_forms -- contact forms or templates that will be in the manifest... (writing to this requires a manifest update)
var g_asset_typtes = [ "contacts", "topics", "manifest", "contact_forms"]
app.post('/put-asset/:asset',async (req, res) => {
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let body = req.body
  let message = body.message
  for ( let fld of g_message_fields ) {
    if ( message[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  let receiver = body.receiver
  for ( let fld of g_user_fields ) {
    if ( receiver[fld] === undefined ) {
      res.type('application/json').send({ "status" : "fail", "reason" : "missing fields"})
      return
    }
  }
  let asset = req.params.asset
  if ( g_asset_typtes.indexOf(asset) < 0 ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "unknown asset"})
    return
  }
  //
  let update_cid = await g_ipfs_profiles.write_to_profile_path(body,asset)
  res.type('application/json').send({ "status" : "OK", "update_cid" : update_cid, "asset" : asset })
  //
})


// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
// TEMPLATES

// Template searching...  Template Management
app.post('/template-list/:narrow_search',async (req, res) => {  // narrow search by category.
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let category = req.params.narrow_search
  let body = req.body
  let btype = body.business_types   // may be an array or just a string
  let start = body.start
  let count = body.count
  let t_list
  if ( category === 'any' ) {
    t_list = await g_ipfs_profiles.get_template_files(btype,false,start,count)
  } else {
    t_list = await g_ipfs_profiles.get_template_files(btype,category,start,count)
  }
  res.type('application/json').send({ "status" : "OK", "templates" : t_list })
})


app.get('/get/template/:cid',async (req, res) => {  // narrow search by category.
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let a_cid = req.params.cid
  let template_obj = await g_ipfs_profiles.get_json_from_cid(a_cid)
  res.type('application/json').send({ "status" : "OK", "template" : template_obj })
})


app.post('/put/template',async (req, res) => {  // narrow search by category.
  //
  if ( !(g_ipfs_profiles) ) {
    res.type('application/json').send({ "status" : "fail", "reason" : "not initialized"})
    return
  }
  //
  let template_name = req.body.name 
  let template_data = req.body.uri_encoded_json
  let t_cid = await g_ipfs_profiles.add_template_json(template_name,template_data)
  res.type('application/json').send({ "status" : "OK", "template_cid" : t_cid })
})

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
//// //// ////  ////  ////  ////  ////  ////  ////  ////  ////  ////  //// 
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

async function main() {
  let ipfs_profiles = new IPFSProfiles(conf)
  await ipfs_profiles.init_ipfs(conf)
  g_ipfs_profiles = ipfs_profiles
}


/*
  //
  let storable_profile = {
    "name" : "Just Stew",
    "DOB" : "07/11/20",
    "place_of_origin" : "Lucky,Kentuky", 
    "cool_public_info" : "We are nice guys around here.", 
    "business" : "profile",
    "public_key" : '3453453535354543543534efa879d79ef79ab987'
  }
  //
  let cids = await ipfs_profiles.add_profile(storable_profile)
  for ( let cid of cids ) {
    console.log(cid)
  }
  //

  let body = {
    "receiver" : {
      "name" : "Just Stew",
      "DOB" : "07/11/20",
      "place_of_origin" : "Lucky,Kentuky", 
      "cool_public_info" : "We are nice guys around here.", 
      "business" : "profile"  
    },
    "message" : {   // recipient info...
      "name": 'Hans Solo', 
      "user_cid" : "4504385938",
      "subject" : "Darth Vadier Attacks",
      "readers" : "joe,jane,harry",
      "date" : Date.now(),
      "business" : false, 
      "public_key" : true,
      "wrapped_key" : false,
      "encoding" : "uri",
      "message" : encodeURIComponent("this is a big message with <b>HTML IN IT</b>")
    }
  }

  let message_cid = ipfs_profiles.add_profile_message(body,"spool")
  console.log(message_cid)

  let topic_cid = ipfs_profiles.add_profile_message(body,"topic_spool")
  console.log(topic_cid)
*/

main()



//
const start = async () => {
  try {
      console.log(`listening on port: ${g_port}`)
      await app.listen(g_port)
  } catch (err) {
      app.log.error(err)
      process.exit(1)
  }
}


// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
// ---- ---- ---- ---- RUN  ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
// // // 
//
start()
//
// ---- ---- ---- ---- SHUTDOWN  ---- ---- ---- ---- ---- ---- ---- ----
// Do graceful shutdown
function shutdown() {
  console.log('graceful shutdown express');
  app.close(()  => {
      process.exit(0)
  });
}

// Handle ^C
process.on('SIGINT', () => {
  console.log("shutting down")
  if ( (g_prune_timeout !== undefined) && (g_prune_timeout !== null) ) {
      clearInterval(g_prune_timeout)
  }
  shutdown()
});
