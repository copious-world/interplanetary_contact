

// check Geeks for Geeks
function bin_search(el, arr, _cmp) {  // for searching by score
    //
    let start = 0
    let end = (arr.length-1);
    //
    while ( start <= end ){
        let mid = Math.floor((start + end)/2);
        let cval = _cmp(arr[mid],el)
        if ( cval > 0 ) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    if ( start >= arr.length ) return -1;
    return(start)
  }
  
  
  function addError(errObj) {
  
  }
  
  function insert_by_pref(list,object) {
      let pos = bin_search(object, list, (o1,o2) => {
        return( o1.preference - o2.preference )
      }) 
  
      if ( pos < 0 ) {
        this.stored_data.push(ref)
    } else {
        this.stored_data.splice(pos,0,object)
    }
  
  }
  
  

module.exports = {
    'insert_by_pref' : insert_by_pref,
    'bin_search' : bin_search,
    'addError' : addError
}