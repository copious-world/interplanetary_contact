//
const IPFS      = require('ipfs');            // using the IPFS protocol to store data via the local gateway
//


class IPFSManageFiles {

    constructor(conf) {
        this.ipfs = false
    }

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

    //  init_ipfs
    async init_ipfs(cnfg) {
        //
        let container_dir = cnfg.ipfs.repo_location
        if ( container_dir == undefined ) {
            let repo_container = require.main.path
            container_dir =  repo_container + "/repos"
        }
        //
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

        this.ipfs = node
    }


    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    //
    async add_profile_file(storable_profile) {
        let storage_str = JSON.stringify(storable_profile)
        const clear_file = await this.ipfs.add(storage_str)   // information that will not change about the user
        let clear_cid = clear_file.cid.toString()
        return clear_cid
    }

    

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    async remove_cid(u_path,mcid) {
        for await ( const file of this.ipfs.ls(mcid)) {
            let fname = file.name
            if ( fname ) {
                let fpath = `${u_path}/${fname}`
                await this.ipfs.rm(fpath)
            }
        }
    }


    async move_cid(u_path,dst_path,mcid) {
        for await ( const file of this.ipfs.ls(mcid)) {
            let fname = file.name
            if ( fname ) {
                let fpath = `${u_path}/${fname}`
                let to_path = `${dst_path}/${fname}`
                await this.ipfs.mv(fpath,to_path,{"parents" : true})
            }
        }
    }


    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    async stream_file_from_cid(cid,outstream){
        let ipfs = this.ipfs
        for await ( const chunk of ipfs.cat(cid) ) {
            outstream.write(chunk)
        }
    }

    async get_complete_file_from_cid(cid) {
        let ipfs = this.ipfs
        let chunks = []
        for await ( const chunk of ipfs.cat(cid) ) {
            chunks.push(chunk)
        }
        let buff = Buffer.concat(chunks)
        let data = buff.toString()
        return data
    }

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

    async update_file_in_ipfs(path,new_data) {
        let ipfs = this.ipfs
        try {
            let tstfile = await ipfs.files.stat(path)
            console.dir(tstfile.cid.toString())
            await ipfs.files.rm(path)
        } catch(e) {
            console.dir(e)
            console.log("adding new file")
        }
        //
        await ipfs.files.write(path, new TextEncoder().encode(new_data), { 'create' : true })
        let file = await ipfs.files.stat(path)
    console.dir(file.cid.toString())
        let message = {
            "file" : file.name,
            "cid" : file.cid.toString(),   /// new cid
            "size" : file.size
        }
        return message
    }

    async create_dir(dir_path) {
        let ipfs = this.ipfs
        try {
            await ipfs.files.mkdir(dir_path,{ 'parents' : false })
        } catch (e) {
        }
        let file = await ipfs.files.stat(dir_path)
        let message = {
            "file" : file.name,
            "cid" : file.cid.toString(),   /// new cid
            "size" : file.size
        }
        return message
    }
    
    async get_cid_from_path(a_path) {
        let ipfs = this.ipfs
        try {
            let file = await ipfs.files.stat(a_path)
            let cid = file.cid.toString()
            return cid    
        } catch(e) {}
        return false
    }

    async get_json_from_file(a_path) {
        let a_cid = await this.get_cid_from_path(a_path)
        let data = await this.get_complete_file_from_cid(a_cid)
        try {
            let obj = JSON.parse(data)
            return obj
        } catch (e) {
        }
        return false
    }

    async get_json_from_cid(a_cid) {
        let data = await this.get_complete_file_from_cid(a_cid)
        try {
            let obj = JSON.parse(data)
            return obj
        } catch (e) {
        }
        return false
    }

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

    async get_dir_entries(a_path,category,offset,count) {
        let ipfs = this.ipfs
        //
        let file_list = []
        let counter = 0;
        //
        for await (const file of ipfs.files.ls(a_path)) {
            let file_dscr = {
                "file" : file.name,
                "cid" : file.cid.toString(),
                "size" : file.size
            }
            if ( (offset !== undefined) && (counter < offset) ) continue
            if ( category !== false ) {
                let check_name = file.name
                if ( !(check_name.includes(category)) ) {
                    continue
                }
            }
            //
            file_list.push(file_dscr)
            if ( (count !== undefined) && (counter >= count) ) break;
        }
        return file_list
    }

    async add_date_bearing_message_to_timestamp_dir(dir_path,message) {
        //
        let time_stamp = message.when  // from the contact page
        if ( time_stamp === undefined ) {
            time_stamp = Date.now()
        }
        let date = (new Date(time_stamp)).toISOString()
        message.date = date
        //
        let file_path = `${dir_path}/${date}`
        let data = JSON.stringify(message)
        
        let file = await this.update_file_in_ipfs(file_path,data)
        return file.cid
    }

    // 
    async get_dir_recursive(a_path) {
        let ipfs = this.ipfs
        //
        let file_list = []
        //
        for await (const file of ipfs.files.ls(a_path)) {
            let entry = {
                "file" : file.name,
                "type" : file.type,
                "cid" : file.cid.toString(),
                "size" : file.size
            }
            file_list.push(entry)
            if ( file.type === 'directory' ) {
                let c_path = a_path + '/' + file.name
                entry.file_list = this.get_dir_recursive(c_path)
            }
        }
        return file_list
    }


    add_data(blob_holder) {
        let ipfs = this.ipfs
        let file = ipfs.add(blob_holder)
        return file.cid.toString()
    }

}
  


//
module.exports = IPFSManageFiles