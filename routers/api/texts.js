const express = require('express');
const router = express.Router();
const Text = require('../../models/Text');
let {PythonShell} = require('python-shell');
const path = require('../../config/store').relationExtractionPath;

/**
 * @route post /api/text/extract-relation
 * @description extract relatin of the text 
 * @access public
 */ 
router.post('/extract-relation', (req, res) => {
    const data = req.body;
    let keywords = ''
    for(let item of data.keywords) {
        keywords += item + '-';
    }
    keywords[keywords.length-1] = ''
    let result = [];
    let pyshell = new PythonShell(path);
    pyshell.send(JSON.stringify({ keywords: keywords.slice(0, keywords.length-1), text: data.text }));
    pyshell.on('message', function (message) {
      result.push(message);
    });
    pyshell.end(function (err,code,signal) {
      if (err) return res.status(500).json(err);
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
      res.json({
          data: result
      });
    })
})


/**
 * @route post /api/texts/v1/
 * @description save the text 
 * @access private
 */
router.post('/', (req, res) => {
    const data = req.body;
    const texts = [];
    for(let item of data.sens){
        const text = new Text({
            username: data.name,
            content: item.text,
            keyword1: data.key1,
            keyword2: data.key2,
            relation: data.relation,
        });
        texts.push(text);
    }
    Text.insertMany(texts)
        .then(result => {
            res.json({
                message: "success",
                data: data,
            })
        }).catch(err => {
            console.log(err);
        })
})


/**
 * @route get /api/texts/v1/:name
 * @description find texts by specfying name  
 * @access private
 */
router.get('/:name', (req, res) => {
    const name = req.params.name;
    Text.find({username: name}) 
    .then(texts => {
        res.json({
            message: 'success',
            texts: texts
        })
    });
})
module.exports = router;