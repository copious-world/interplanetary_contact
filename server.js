const fsPromise = require('fs/promises')
const fs = require('fs')
const fastify = require('fastify')
const fastify_cors = require('fastify-cors')

const app = fastify()
//



function instantiate(contact_file,data,encoded_fields) {
    for ( let ky in data ) {
        let symbol = `{{${ky}}}`
        let value = data[ky]
        if ( encoded_fields.indexOf(ky) >= 0 ) {
            value = encodeURIComponent(value)
        }  
        while ( contact_file.indexOf(symbol) > 0 ) {
            contact_file = contact_file.replace(symbol,value)
        }
    }
    return(contact_file)
}



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



let g_port = 6111
let g_prune_timeout = null;


app.get('/',(req, res) => {
    const stream = fs.createReadStream('./original_text/contact_style_1.html')
    res.type('text/html').send(stream)
})




app.post('/contact_form/business',(req, res) => {
    //res.send("THIS SERVER IS WORKING")
    //
    let input = __dirname + '/original_text/contact_style_1.json'
    const stream = fs.createReadStream(input)
    res.type('application/json').send(stream)

})



app.post('/contact_form/profile',(req, res) => {
    //
    let input = __dirname + '/original_text/contact_style_1.json'
    const stream = fs.createReadStream(input)
    res.type('application/json').send(stream)

})



app.post('/add/profile',async (req, res) => {
    //
    let ipfs_identity =  {
        "cid" : "9w7u97w987we987w9er9wr",
        "dir" : "ldfls/profile/where+it+all+is"
    }
    console.dir(req.body)

    let form_link = req.body.form_link
    let filename = __dirname + `/original_text/${form_link}`
    let contact_file = await fsPromise.readFile(filename)
    contact_file = contact_file.toString()
    //
    let encoded_fields = [ 'name', 'DOB', 'place_of_origin', 'cool_public_info' ]
    contact_file = instantiate(contact_file,req.body,encoded_fields)
    //
    //
    let name = encodeURIComponent(req.body.name)
    let outfile = __dirname + `/test/${name}_${form_link}`
console.log(outfile)
    await fsPromise.writeFile(outfile,contact_file)
    //
    res.type('application/json').send(ipfs_identity)
})


app.post('/add/business',(req, res) => {
    //
    let ipfs_identity = {
        "cid" : "9w7u97w987we987w9er9wr",
        "dir" : "ldfls/business/where+it+all+is"
    }
    console.dir(req.body)
    //
    res.type('application/json').send(ipfs_identity)
})

/*
<div class="item" style="text-align: center;vertical-align: middle;width: 30%;display:inline;">
    <div class="art_container" >
        {{user_image_or_art}}
    </div>
</div>
<intput id="profile-owner-name" type="hidden" value="{{name}}" />
<intput id="profile-owner-DOB" type="hidden" value="{{DOB}}" />
<intput id="profile-owner-place_of_origin" type="hidden" value="{{place_of_origin}}" />
<intput id="profile-owner-cool_public_info" type="hidden" value="{{cool_public_info}}" />
<intput id="profile-owner-public_key" type="hidden" value="{{public_key}}" />
*/


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
