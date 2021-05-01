

const fastify = require('fastify')

const app = fastify()
//






app.get('/',(req, res) => {
    const stream = fs.createReadStream('./test/index.html')
    res.type('text/html').send(stream)
})




app.post('/business',(req, res) => {
    const stream = fs.createReadStream('./test/index.html')
    res.type('text/html').send(stream)
    //res.send("THIS SERVER IS WORKING")

  console.log(req.body)
  console.log(req.query)
  //console.log(request.params)
  console.log(req.headers)
  console.log(req.raw)
  console.log(req.id)
  console.log(req.ip)
  console.log(req.ips)
  console.log(req.hostname)
  console.log(req.protocol)

})



app.post('/profile',(req, res) => {
    const stream = fs.createReadStream('./test/index.html')
    res.type('text/html').send(stream)
    //res.send("THIS SERVER IS WORKING")

  console.log(req.body)
  console.log(req.query)
  //console.log(request.params)
  console.log(req.headers)
  console.log(req.raw)
  console.log(req.id)
  console.log(req.ip)
  console.log(req.ips)
  console.log(req.hostname)
  console.log(req.protocol)

})




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
            preprocess.exit(0)
    });
}

// Handle ^C
process.on('SIGINT', () => {
    console.log("shutting down")
    if ( g_prune_timeout !== null ) {
        clearInterval(g_prune_timeout)
    }
    shutdown()
});