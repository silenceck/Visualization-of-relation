const express = require('express');
const router = express.Router();
const passport = require('passport');
const Text = require('../../models/Text');
let {PythonShell} = require('python-shell');
const path = 'C:/Users/会议室/PycharmProjects/relation_extraction/v1.1.py'

router.post('/', (req, res) => {
    const data = req.body;
    result = [];
    
    let pyshell = new PythonShell(path);
    pyshell.send(JSON.stringify({ key1: data.key1, key2: data.key2, text: data.text }));
    pyshell.on('message', function (message) {
      result.push(message)
    });
    pyshell.end(function (err,code,signal) {
      if (err) return res.status(400).json("错误");;
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
      res.json(result);
    });
    
})

module.exports = router;