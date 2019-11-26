const express = require('express');
const router = express.Router();
const Neode = require('neode');
const uri = require('../../config/store').neo4j.URL;
const username = require('../../config/store').neo4j.USER;
const password = require('../../config/store').neo4j.PASSWORD;
const instance = new Neode(uri, username, password);

function deteleObject(obj) {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
            return (Number(a) - Number(b));
        });
        var str = '';
        for (var j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }
    uniques = uniques;
    return uniques;
}


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


router.get('/v1/query', (req, res) => {
    // const condition = {
    //     label: {
    //         node1: 'Person',
    //         node2: '',
    //         relation: 'IS_FRIENDS_WITH',
    //     },
    //     propery: {
    //         node1: {
    //             name: 'Fameuil',
    //             field: 'test',
    //         },
    //         node2: {
    //             name: 'Tholomyes',
    //             field: 'test',
    //         },
    //         relation: {
    //             field: 'test',
    //         },
    //     }
    // }
    const condition = JSON.parse(req.query.data);
    const label = condition.label;
    const propery = condition.propery;
    let node1Propery = JSON.stringify(propery.node1);
    let node2Propery = JSON.stringify(propery.node2);
    let relationPropery = JSON.stringify(propery.relation);
    // 由于cypher查询语句不能直接接收json字符串，需要去除json字符串中key的双引号
    if(node1Propery.indexOf(",") == -1){
        node1Propery = node1Propery.replace(/{"/gi, '{').replace(/":/gi, ':');
    }else{
        node1Propery = node1Propery.replace(/{"/gi, '{').replace(/,"/gi, ',').replace(/":/gi, ':');
    }
    if(node2Propery.indexOf(",") == -1){
        node2Propery = node2Propery.replace(/{"/gi, '{').replace(/":/gi, ':');
    }else{
        node2Propery = node2Propery.replace(/{"/gi, '{').replace(/,"/gi, ',').replace(/":/gi, ':');
    }
    if(relationPropery.indexOf(",") == -1){
        relationPropery = relationPropery.replace(/{"/gi, '{').replace(/":/gi, ':');
    }else{
        relationPropery = relationPropery.replace(/{"/gi, '{').replace(/,"/gi, ',').replace(/":/gi, ':');
    }
    let nodes = new Set();
    let links = new Set();
    if(label.relation === ''){
        if(label.node1 !== '' && label.node2 !== ''){
            instance.cypher(`match p=(a: ${label.node1} ${node1Propery})-[*]->(b: ${label.node2} ${node2Propery}) return p`, {
            }).then(result => {
                let paths = [];
                for(let item of result.records){
                    paths.push(item['_fields'][0]);
                    for(let segment of item['_fields'][0]['segments']){
                        let fromNode = segment.start.properties;
                        fromNode.label = segment.start.labels[0];
                        let toNode = segment.end.properties;
                        toNode.label = segment.end.labels[0];
                        nodes.add(fromNode);
                        nodes.add(toNode);
                        let link = segment.relationship.properties;
                        link.type = segment.relationship.type;
                        link.source = fromNode.id;
                        link.target = toNode.id;
                        links.add(link);
                    }
                }
                res.json({
                    data: {
                        paths: paths,
                        nodes: deteleObject(Array.from(nodes)), // set转数组 + 去除数组中的重复对象
                        links: deteleObject(Array.from(links)),
                    }
                });
            })
        }else if(label.node1 !== '' || label.node2 !== ''){
            const nodeLabel = label.node1 !== ''?label.node1:label.node2;
            const propery = label.node1 !== ''?node1Propery:node2Propery;
            instance.cypher(`MATCH p=(a:${nodeLabel} ${propery})-[]->(b) RETURN p`)
            .then(result => {
                let paths = [];
                for(let item of result.records){
                    paths.push(item['_fields'][0]);
                    for(let segment of item['_fields'][0]['segments']){
                        let fromNode = segment.start.properties;
                        fromNode.label = segment.start.labels[0];
                        let toNode = segment.end.properties;
                        toNode.label = segment.end.labels[0];
                        nodes.add(fromNode);
                        nodes.add(toNode);
                        let link = segment.relationship.properties;
                        link.type = segment.relationship.type;
                        link.source = fromNode.id;
                        link.target = toNode.id;
                        links.add(link);
                    }
                }
                res.json({
                    data: {
                        paths: paths,
                        nodes: deteleObject(Array.from(nodes)), // set转数组
                        links: deteleObject(Array.from(links)),
                    }
                });
            })
        }
    }else{
        if(label.node1 !== '' && label.node2 !== ''){
            instance.cypher(`match (a: ${label.node1} ${node1Propery})-[r:${label.relation} ${relationPropery}]->(b: ${label.node2} ${node2Propery}) return a,r,b`, {
            }).then(result => {
                const record = result.records.get(0)['_fields'];
                let fromNode = record.get(0).properties;
                fromNode.label = record.get(0).labels[0];
                let toNode = record.get(2).properties;
                toNode.label = record.get(2).labels[0];
                let link = record.get(1).properties;
                link.type = record.get(1).type;
                link.source = fromNode.id;
                link.target = toNode.id;
                nodes.add(fromNode);
                nodes.add(toNode);
                links.add(link);
                res.json({
                    data: {
                        paths: [],
                        nodes: deteleObject(Array.from(nodes)), // set转数组 + 去除数组中的重复对象
                        links: deteleObject(Array.from(links)),
                    }
                });
            })
        }else if(label.node1 !== ''){
            instance.cypher(`match (a: ${label.node1} ${node1Propery})-[r:${label.relation} ${relationPropery}]->(b) return a,r,b`, {
            }).then(result => {
                let paths = [];
                for(let item of result.records){
                    let fromNode = item['_fields'][0].properties;
                    fromNode.label = item['_fields'][0].labels[0];
                    let toNode = item['_fields'][2].properties;
                    toNode.label = item['_fields'][2].labels[0];
                    let link = item['_fields'][1].properties;
                    link.type = item['_fields'][1].type;
                    link.source = fromNode.id;
                    link.target = toNode.id;
                    nodes.add(fromNode);
                    nodes.add(toNode);
                    links.add(link);
                }
                res.json({
                    data: {
                        paths: paths,
                        nodes: deteleObject(Array.from(nodes)), // set转数组
                        links: deteleObject(Array.from(links)),
                    }
                });
            })
        }else{
            instance.cypher(`match (a)-[r:${label.relation} ${relationPropery}]->(b: ${label.node2} ${node2Propery}) return a,r,b`, {
            }).then(result => {
                let paths = [];
                for(let item of result.records){
                    let fromNode = item['_fields'][0].properties;
                    fromNode.label = item['_fields'][0].labels[0];
                    let toNode = item['_fields'][2].properties;
                    toNode.label = item['_fields'][2].labels[0];
                    let link = item['_fields'][1].properties;
                    link.type = item['_fields'][1].type;
                    link.source = fromNode.id;
                    link.target = toNode.id;
                    nodes.add(fromNode);
                    nodes.add(toNode);
                    links.add(link);
                }
                res.json({
                    data: {
                        paths: paths,
                        nodes: deteleObject(Array.from(nodes)), // set转数组
                        links: deteleObject(Array.from(links)),
                    }
                });
            })
        }
    }
})

module.exports = router;