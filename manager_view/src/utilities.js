



function subst(str,value,match_list) {
    for ( let mm of match_list ) {
        str = str.replace(mm[0],value)
    }
    return str
}


class ContactVar {

    constructor(id,mfield) {
        this.id = id
        this.access_method = 'innerHTML'  // or innerHTML
        this.message_value = ''
        this.message_field = mfield
        this.match_list = false
    }

    add_matches(op_key,matches) {
        this.match_list = matches
        if ( op_key ) {
            this.access_method = op_key.substr(op_key.lastIndexOf('-') + 1)
            this.access_method = this.access_method.replace('}}','')    
        } // else don't change the access method...
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

    set_el_html(txt) {
        let domel = document.getElementById(this.id)
        if ( domel ) domel.innerHTML = txt
    }
}


export function cvar_factory(id,mfield) {
    let cvar = new ContactVar(id,mfield)
    return cvar
}


var g_var_descr_regex  = new RegExp('{{([A-Za-z0-9\#\_\-]+)}}','g');
//
export function unload_html_vars(html) {
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
export function subst_vars_app_ids(html,html_vars,ccvars) {
    for ( let ky in html_vars ) {
        let hyph = ky.lastIndexOf('-') + 1
        if ( hyph > 0 ) {
            let hyph1 = ky.indexOf('-') + 1
            if ( hyph1 === hyph ) {
                let cvar = ccvars[ky]
                if ( cvar ) {
                    cvar.add_matches(false,html_vars[ky])
                    html = cvar.subst(html)
                }    
            } else {
                let match_key = ky.substr(0,hyph)
                let cvar = ccvars[match_key]
                if ( cvar ) {
                    cvar.add_matches(ky,html_vars[ky])
                    html = cvar.subst(html)
                }    
            }
        }
    }
    return html
}


export function clear_char(str,char) {
    let split_up = str.split(char)
    let back_together = split_up.join('')
    return back_together
}