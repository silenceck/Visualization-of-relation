const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const obj= multer({dest: 'upload/'});
let {PythonShell} = require('python-shell');
const path = require('./config/store').relationExtractionPath;
const pythonPath =  require('./config/store').pythonPath;
const passport = require('passport');
const users = require('./routers/api/users');
const texts = require('./routers/api/texts');
const graphs = require('./routers/api/graphs');
const app = express();
var siofu = require("socketio-file-upload");
app.use(siofu.router)
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const db = require('./config/store').mongooseURL;
const port = process.env.PORT || 5000;
const spawn = require("child_process").spawn;
const fs = require('fs');
mongoose.connect(db ,{useNewUrlParser:true, useUnifiedTopology: true})
    .then(() => console.log('mongoDB connected'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(obj.any());
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/texts', texts);
app.use('/api/graphs', graphs);

// websocket
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    socket.on('text data', function(msg){
        const data = JSON.parse(msg)       
        let keywords = data.keywords.join("-")
        var options = {
            pythonPath: pythonPath  
        };
        let pyshell = new PythonShell(path, options);
        let result = [];
        pyshell.send(JSON.stringify({ keywords: keywords, text: data.text }));
        console.log(msg)
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
        
    });
    var uploader = new siofu();
    uploader.dir = "./upload1/";
    uploader.listen(socket);
    uploader.on("saved", function(event){
        console.log(event.file)
        // event.file.name
        fs.readFile('./upload1/'+ event.file.name, 'utf8', function(err, data){
            text = data 
            let keywords = ''
            if (event.file.meta.hasOwnProperty("keyword")) 
                keywords = event.file.meta.keyword
            console.log('data: ' + data)
            var options = {
                pythonPath: pythonPath 
            };
            let pyshell = new PythonShell(path, options);
            let result = [];
            pyshell.send(JSON.stringify({ keywords: keywords, text: text }));
            
            pyshell.on('message', function (message) {
                result.push(message);
            });
            pyshell.end(function (err,code,signal) {
                if (err) console.log(err);
                console.log('The exit code was: ' + code);
                console.log('The exit signal was: ' + signal);
                console.log('finished');
                console.log(result);
                fs.unlink('./upload1/' + event.file.name, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                io.emit('file message', result);
            })
           
            
        })
        
    })
});

http.listen(port, () => {
    console.log(`Server listening at port ${port}`);
})