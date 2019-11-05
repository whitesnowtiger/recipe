# recipe


This is my online class project, JavaScript Complete Course 2019 by Jonas Schmedtmann. I got APIs from www.food2fork.com.  BABEL was used to convert ES6/ESNext to ES5. WebPack was used to bundle all modules.

![](/dist/img/recipe.png)

The dist folder has CSS file and img folder.  The index.html file is created and updated by Webpack.  The SRC folder has all the JavaScript files.  UI controllers are in View folder.  Action controllers such as getting info from fork2fork.com, storing user's likes, calculating the ingredients, etc... are in Model folder.  The index.js is the app controller that calls the UI and action contollers to control whole app.  'base.js' is for selecting classes using querySelector.  'config.js' is for your key and proxy info. 
