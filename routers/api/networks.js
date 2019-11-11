const express = require('express');
const router = express.Router();
const Neode = require('neode');
const uri = require('../../config/store').neo4j.URL;
const username = require('../../config/store').neo4j.USER;
const password = require('../../config/store').neo4j.PASSWORD;
const instance = new Neode(uri, username, password);

router.get('/:field', (req, res) =>{
    const field = req.params.field;
    let nodes = [];
    instance.cypher('MATCH (p {field: {field}}) RETURN p', {field: field})
    .then(result => { 
        for(let item of result.records){
            const singleRecord = item;
            let node = singleRecord.get(0).properties;
            node.lable = singleRecord.get(0).labels[0];
            nodes.push(node);
        } 
        return res
        
    }).then(result => {
        let links = [];
        instance.cypher('MATCH (n)-[r {field:$field}]->(m) RETURN n,r,m', {field: field})
        .then(result => { 
            for(let item of result.records){
                let link = {};
                const node1 = item.get(0);
                const relation = item.get(1);
                const node2 = item.get(2);
                link.field = relation.properties.field;
                link.type = relation.properties.type;
                link.source = node1.properties.id;
                link.target = node2.properties.id;
                links.push(link);
                
            } 
            res.json({
                nodes: nodes,
                links: links,
            })
        });

        
    });
    
});

module.exports = router;