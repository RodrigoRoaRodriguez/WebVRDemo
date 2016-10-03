## How to install

1. Go to the folder in the terminal and run `npm install`, _this installs dependencies_.
2. Run `npm start`, _this starts a local webpack dev-server_
3. Open your browser and go to <http://localhost:8080>

Hello, you are right. The fault was on my end. I did a clean install in a new computer and it did not prompt me for any these. After some experimentation I realized that this had to do with an astray `.babelrc` dotfile that had somehow ended up in my folder. Therefore, I apologize for wasting your time.  

## Acknowledgments

I want to than [@fazeaction](https://github.com/fazeaction/) for the [webpack-threejs-boilerplate](https://github.com/fazeaction/webpack-threejs-boilerplate), on which I based this project.
