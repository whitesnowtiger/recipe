/*
import num from './test';
const x = 23;
console.log(`I imported ${num} from another module called test.js!  Variable x is ${x}`);


import str from './models/Search';

//import {add as a, multiply as m, ID} from './views/searchView';

import * as searchView from './views/searchView';

//console.log(`Using imported functions! ${a(ID, 2)} and ${m(3,5)}, ${str}`);

console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3,5)}, ${str}`);


//0b0d877bce468000318b82e6c8abf005
//https://www.food2fork.com/api/search

import axios from 'axios';

async function getResults(query) {
    
    //const proxy = 'https://crossorigin.me/';
    //const proxy1 = 'https://cors-anywhere.herokuapp.com/';
    
    const key = '0b0d877bce468000318b82e6c8abf005';

    try {

    const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = res.data.recipes;
    console.log(recipes);
    } catch(error) {
        alert(error);
    }
}
getResults('kimchi');
 
*/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';







/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */


const state = {};
//window.state = state;

//Search Controller
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();  
    //const query = 'pizza';  

    //console.log(query);
    if(query) {
        //2) new search object and add to state
        state.search = new Search(query);

        //3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
        //4) Search for recipes
        await state.search.getResults();  //returns promise
        //console.log(state.search.result);

        //5) Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    } catch (err) {
        alert('Something wrong with the search...');
        //console.log(err);
        clearLoader();
    }
}

};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();   
    controlSearch(); 
});

/*
//for testing
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch(); 
});
*/

//const search = new Search('pizza');
//console.log(search);
//search.getResults();

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, gotoPage);
        //console.log(gotoPage);
    }
    
});

//Recipe Controller
/*
const r = new Recipe(46956);
r.getRecipe();
console.log(r);
*/


const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');   //window.lcoation is entire url
    //console.log(id);

    if (id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);  

        //highlight selected search
        //if(state.search) {
           // searchView.highlightSelected(id);
        //}
        //Create new recipe object
            state.recipe = new Recipe(id);

            //for testing
           // window.r = state.recipe;

        try {
        //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

        //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

        //Render recipe 
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );

       } catch(error) {
           console.log(error);
            alert('Error processing recipe!');
       }
    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//List Controller

const controlList = () => {
    //Create a new list if there is none yet

    if(!state.list) state.list = new List();

    //Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient );
        listView.renderItem(item);
        
    });
    //console.log(state.list);

}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemId;
    
    
    //Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
                                            
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

    //Handle the count update
    } else if(e.target.matches('.shopping__count-value')) {
                       
        const val = parseFloat(e.target.value, 10);
        if(val>0) {
        state.list.updateCount(id, val);
        }
    }
});


//Like Controller
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;

    //User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Toggle the like button
        likesView.toggleLikeBtn(true);
        //Add like to UI list
        likesView.renderLike(newLike);
        //console.log(state.likes);

        //User has liked the current recipe already
    } else {
        //Remove like from the state
        state.likes.deleteLike(currentID);

        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove like from the list
        likesView.deleteLike(currentID);
       // console.log(state.likes);


    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    //window.l = new List();

    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like)); 
});




// Handling recipe button clicks

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrese, .btn-decrease *')) { // .btn-descrease * = any child
        //Decrease button is clicked
        if(state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        } 
    } else if( e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping list
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')){
        //Like Controller
        controlLike();
    }

    //console.log(state.recipe);
});








