//

const fs          = require('fs');
const fsPromise   = require('fs/promises')
const path        = require('path')
//
//


const { CryptoManager } = require('./crypto_manager.js')
const { IpfsWriter } = require('./ipfs_deliver.js')

const IPFS = require('ipfs');            // using the IPFS protocol to store data via the local gateway
//
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

const conf_file = process.argv[2]  ?  process.argv[2] :  "contact-service.conf"
const crypto_conf = 'desk_app.config'

const config = fs.readFileSync(conf_file).toString()
const conf = JSON.parse(config)
// would crash if the config is bad... required.
//
// CONFIG PARAMETERS
g_streamer_port = conf.port
let g_input_sources = conf.source_dir
//
let pdir = conf.play_dir
if ( pdir && (typeof pdir === 'string') && pdir[pdir.length - 1] !== '/' ) pdir += '/'

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

let g_ctypo_M = new CryptoManager(crypto_conf)

// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

var g_service_ipfs = false
let g_ipfs_sender = false

async function init_ipfs(cnfg) {
  let container_dir = cnfg.ipfs.repo_location
  if ( container_dir == undefined ) {
    container_dir =  __dirname + "/repos"
  }

  let subdir = cnfg.ipfs.dir
  if ( subdir[0] != '/' ) subdir = ('/' + subdir)
  let repo_dir = container_dir + subdir
  console.log(repo_dir)
  let node = await IPFS.create({
      repo: repo_dir,
      config: {
        Addresses: {
          Swarm: [
            `/ip4/0.0.0.0/tcp/${cnfg.ipfs.swarm_tcp}`,
            `/ip4/127.0.0.1/tcp/${cnfg.ipfs.swarm_ws}/ws`
          ],
          API: `/ip4/127.0.0.1/tcp/${cnfg.ipfs.api_port}`,
          Gateway: `/ip4/127.0.0.1/tcp/${cnfg.ipfs.tcp_gateway}`
        }
      }
    })

    const version = await node.version()
    console.log('Version:', version.version)

    g_service_ipfs = node
}


async function application_initialization(ipfs) {
  //await ipfs.files.mkdir('/copious.world/grand_profile_repository/templates',{ 'parents' : true })
  //await ipfs.files.mkdir('/copious.world/grand_business_repository/templates',{ 'parents' : true })
  //await ipfs.files.mkdir('/copious.world/grand_profile_repository/apps',{ 'parents' : true })
  //await ipfs.files.mkdir('/copious.world/grand_business_repository/apps',{ 'parents' : true })
  //
  let stats = await ipfs.files.stat('/copious.world/')
  console.dir(stats)
  
  for await (const file of ipfs.files.ls('/copious.world/grand_profile_repository')) {
    console.log(file.name)
  }
  for await (const file of ipfs.files.ls('/copious.world/grand_business_repository')) {
    console.log(file.name)
  }
}


async function add_template_file(file_name,btype) {
  let ipfs = g_service_ipfs
  let fpath = './' + g_input_sources + '/' + file_name
  let data = (await fsPromise.readFile(fpath)).toString()
  if ( Array.isArray(btype) ) {
    for ( let biz_t of btype ) {
      let output = `/copious.world/grand_${biz_t}_repository/templates/`
      output += file_name
      await ipfs.files.write(output, new TextEncoder().encode(data), { 'create' : true })
    }
  } else {
    let output = `/copious.world/grand_${btype}_repository/templates`
    output += file_name
    await ipfs.files.write(output, new TextEncoder().encode(data), { 'create' : true })
  }
}



async function get_template_file(file_name,btype) {
  let ipfs = g_service_ipfs
  let fpath = './' + g_input_sources + '/' + file_name
  let data_list = []
  if ( Array.isArray(btype) ) {
    for ( let biz_t of btype ) {
      let input = `/copious.world/grand_${biz_t}_repository/templates/`
      input += file_name
      const chunks = []
      for await (const chunk of ipfs.files.read(input)) {
        chunks.push(chunk)
      }
      
      data_list.push(Buffer.concat(chunks))
    }
  } else {
    let input = `/copious.world/grand_${btype}_repository/templates`
    const chunks = []
    for await (const chunk of ipfs.files.read(input)) {
      chunks.push(chunk)
    }
    data_list.push(Buffer.concat(chunks))
  }
  data_list = data_list.map(datum => {
    return datum.toString()
  })
  return data_list
}


// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
// -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------


(async () => {
  await init_ipfs(conf)
  g_ipfs_sender = new IpfsWriter(g_service_ipfs,g_ctypo_M)
  await application_initialization(g_service_ipfs)
  //await add_template_file("constact_style_1.html",["business","profile"])
  let data_list = await get_template_file("constact_style_1.html",["business","profile"])

  for ( let str of data_list ) {
    console.log(str.substr(0,40))
  }
})()

