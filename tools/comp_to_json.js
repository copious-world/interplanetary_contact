

const fs = require('fs')

if ( process.argv.length < 3 ) {
    console.log("too few arguments")
    console.log("usage: node comp_to_json <input component>.html <output_comp>.json")
}



let data = fs.readFileSync(process.argv[2]).toString()

if ( data ) {
    data = data.split('<script>')
    let html = data[0]
    html = html.trim()
    html = encodeURIComponent(html)

    let script = data[1]
    script = script.replace('</script>')
    script = script.trim()
    script = encodeURIComponent(script)

    let json = {
        "html" : html,
        "script" : script
    }

    fs.writeFileSync(process.argv[3],JSON.stringify(json))

}