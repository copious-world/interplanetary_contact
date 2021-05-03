const fs          = require('fs');
//
//
const IPFSProfiles = require('./lib/ipfs_user_profile')

//// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// 

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

const conf_file = process.argv[2]  ?  process.argv[2] :  "contact-service.conf"
const crypto_conf = 'desk_app.config'

const config = fs.readFileSync(conf_file).toString()
const conf = JSON.parse(config)
// would crash if the config is bad... required.
//
// CONFIG PARAMETERS
const g_streamer_port = conf.port
//
let pdir = conf.play_dir
if ( pdir && (typeof pdir === 'string') && pdir[pdir.length - 1] !== '/' ) pdir += '/'

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

//let g_ctypo_M = new CryptoManager(crypto_conf)

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
//// //// ////  ////  ////  ////  ////  ////  ////  ////  ////  ////  //// 
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

async function main() {
  //
  let ipfs_profiles = new IPFSProfiles(conf)
  await ipfs_profiles.init_ipfs(conf)
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
    "message" : {
      "subject" : "Darth Vadier Attacks",
      "readers" : "joe,jane,harry",
      "when" : Date.now(),
      "wrapped_key" : false,
      "encoding" : "uri",
      "message" : encodeURIComponent("this is a big message with <b>HTML IN IT</b>")
    }
  }

  let message_cid = ipfs_profiles.add_profile_message(body,"spool")
}

main()
