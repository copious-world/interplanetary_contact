



function subst(str,value,match_list) {
    for ( let mm of match_list ) {
        str = str.replace(mm[0],value)
    }
    return str
}


class ContactVar {

    constructor(id,mfield) {
        this.id = id
        this.access_method = 'value'  // or innerHTML
        this.message_value = ''
        this.message_field = mfield
        this.match_list = false
    }

    add_matches(op_key,matches) {
        this.match_list = matches
        this.access_method = op_key.substr(op_key.lastIndexOf('-') + 1)
        this.access_method = this.access_method.replace('}}','')
    }

    subst(str) {
        str = subst(str,this.id,this.match_list)
        return str
    }

    extract_value() {
        let domel = document.getElementById(this.id)
        let value = ""
        if ( this.access_method === "value" ) {
            value = domel.value
        } else {
            value = domel.innerHTML
        }
        return(value)
    }
}


export function cvar_factory(id,mfield) {
    let cvar = new ContactVar(id,mfield)
    return cvar
}


var g_var_descr_regex  = new RegExp('{{([A-Za-z0-9\#\_\-]+)}}','g');
//
function unload_html_vars(html) {
    const matches = html.matchAll(g_var_descr_regex);
    let v_map = {}
    for ( const match of matches ) {
        if ( match ) {
            let key = match[0]
            if ( v_map[key] === undefined ) {
                v_map[key] = []
            }
            v_map[key].push(match)
        }
    }
    return v_map
}


// // 
export function subst_vars_app_ids(uenc_html) {
    let html = decodeURIComponent(uenc_html)
    let html_vars = unload_html_vars(html)
    for ( let ky in html_vars ) {
        let hyph = ky.lastIndexOf('-') + 1
        if ( hyph > 0 ) {
            let match_key = ky.substr(0,hyph)
            let cvar = conmmon_contact_vars[match_key]
            if ( cvar ) {
                cvar.add_matches(ky,html_vars[ky])
                html = cvar.subst(html)
            }
        } else {
            html = subst(html,cform_var_supply[ky],html_vars[ky])
        }
    }
    return html
}

