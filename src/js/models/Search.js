//export default 'I am an exported string.';
import axios from 'axios';
import { key, proxy } from '../config';

export default class Search{
    constructor(query) {
        this.query = query;

    }

    async getResults() {
    
        //const proxy = 'https://crossorigin.me/';
        //const proxy1 = 'https://cors-anywhere.herokuapp.com/';
        
        //const key = '0b0d877bce468000318b82e6c8abf005';
    
        try {
    
        //const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
        const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
       
        this.result = res.data.recipes;
        //console.log(this.result);
        } catch(error) {
            alert(error);
        }
    }
  
}
//getResults('kimchi');
