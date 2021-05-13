

class Toppers {

    constructor(max_fill) {
        this.max_fill = max_fill
        this.map = {}
        this.sorted = []
        this.max_score = -Infinity;
        this.lowest_score =  -Infinity;
    }


    update(id,score) {
        //
        if ( score < this.lowest_score ) return;
        //
        if ( score >= this.max_score ) {
            if ( this.map[id] === undefined ) {
                this.map[id] = [score,0]
                this.sorted.unshift(id)
                if ( this.sorted.length > this.max_fill ) {
                    let del_id = this.sorted.pop()
                    delete this.map[del_id]
                }
            } else {
                let [old_score,index] = this.map[id]  // size of array does not change
                this.sorted.splice(index,1)
                this.sorted.unshift(id)
                this.map[id][0] = score
            }
            let min_id = this.sorted[this.sorted.length-1]
            this.lowest_score = this.map[min_id][0]
            for ( let i = 0; i < this.sorted.length; i++ ) {
                let sid = this.sorted[i]
                this.map[sid][1] = i
            }
        } else {
            if ( this.map[id] === undefined ) {
                let j = bin_search(this.sorted,score,(id1,id2) => {
                    let score1 = this.map[id1][0]
                    let score2 = this.map[id2][0]
                    return(score1 - score2)
                 })
                this.sorted.splice(j,0,id)
                if ( this.sorted.length > this.max_fill ) {
                    let del_id = this.sorted.pop()
                    delete this.map[del_id]
                }
                this.map[id] = [score,j]
                let min_id = this.sorted[this.sorted.length-1]
                this.lowest_score = this.map[min_id][0]    
                for ( let i = j; i < this.sorted.length; i++ ) {
                    let sid = this.sorted[i]
                    this.map[sid][1] = i       
                }    
            } else {
                let [old_score,index] = this.map[id]  // size of array does not change
                this.map[id][0] = score
                let j = index-1
                while ( j > 0 ) {
                    let pid = this.sorted[j]
                    let p_score = this.map[pid][0]
                    if ( p_score < score ) {
                        this.map[pid][1] = index
                        this.sorted[index] = pid
                        index = j
                        this.sorted[j] = id
                        j--
                    } else break
                }
                this.map[id][1] = j+1
            }
        }
    }
}


const MAX_TOPPERS = 50
function pre_many_sums(long_list) {  // long enough (not worrying about a generator at the moment)
    // list el { "id" : "substance", "value" : 1.0 }  // like this
    let accumulator_map = {}
    let toppers = new Toppers(MAX_TOPPERS)

    for ( let el of long_list ) {
        if ( accumulator_map[el.id] === undefined ) { accumulator_map[el.id] = 0.0 }
        let score = accumulator_map[el.id]
        score += el.value
        accumulator_map[el.id] += score
        toppers.update(el.id,score)
    }
}
