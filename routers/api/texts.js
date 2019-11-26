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
      if (err) return res.status(400).json("错误");
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
      res.json(result);
    });
    
})

router.get('/', (req, res) => {
    const key1 = req.query.key1;
    const key2 = req.query.key2;

    console.log(JSON.parse(key1));
    // let pyshell = new PythonShell(path);
    // pyshell.send(JSON.stringify({ key1: key1, key2: key2}));
    // pyshell.on('message', function (message) {
    //   result.push(message)
    // });
    // pyshell.end(function (err,code,signal) {
    //   if (err) return res.status(400).json("错误");
    //   console.log('The exit code was: ' + code);
    //   console.log('The exit signal was: ' + signal);
    //   console.log('finished');
    //   res.json(result);
    // });
    res.json({
      relation: 1,
      data: [
        'Risky paternal alcohol us.',
        'Risky paternal alcohol us.',
        'Risky paternal alcohol us.',
        'Risky paternal alcohol us.',
      ]
    })



})

module.exports = router;