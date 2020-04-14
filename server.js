const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const obj= multer({dest: 'upload/'});
let {PythonShell} = require('python-shell');
const path = require('./config/store').relationExtractionPath;
const passport = require('passport');
const neo4j_driver = require('neo4j-driver');
const users = require('./routers/api/users');
const texts = require('./routers/api/texts');
const networks = require('./routers/api/networks');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// expressWs(app);
// DB config
const db = require('./config/store').mongooseURL;
const uri = require('./config/store').neo4j.URL;
const username = require('./config/store').neo4j.USER;
const password = require('./config/store').neo4j.PASSWORD;

// connect to db 
mongoose.connect(db)
    .then(() => console.log('mongoDB connected'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(obj.any());
app.use(passport.initialize());
require('./config/passport')(passport);

const port = process.env.PORT || 5000;

app.use('/api/users', users);
app.use('/api/texts', texts);
app.use('/api/networks', networks);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    socket.on('text data', function(msg){
        const data = JSON.parse(msg)
        let pyshell = new PythonShell(path);
        let keywords = ''
        for(let item of data.keywords) {
            keywords += item + '-';
        }
        keywords[keywords.length-1] = ''
        let result = [];
        pyshell.send(JSON.stringify({ keywords: keywords.slice(0, keywords.length-1), text: data.text }));
        pyshell.on('message', function (message) {
            result.push(message);
        });
        pyshell.end(function (err,code,signal) {
            if (err) console.log(err);
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
            console.log(result);
            io.emit('res message', result);
        })
        console.log('message: ' + msg);
        
    });
});

http.listen(port, () => {
    console.log(`Server listening at port ${port}`);
})