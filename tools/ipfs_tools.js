







// add publically available templates, which may later be customized and be stored in user repositories
//
async function add_template_file(file_name,btype) {
    let ipfs = this.ipfs
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
  let ipfs = this.ipfs
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


