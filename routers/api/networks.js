const express = require('express');
const router = express.Router();
const Neode = require('neode');
const uri = require('../../config/store').neo4j.URL;
const username = require('../../config/store').neo4j.USER;
const password = require('../../config/store').neo4j.PASSWORD;
const instance = new Neode(uri, username, password);
const Network = require('../../models/Network');
const passport = require('passport');

// 去除数组中的重复对象, set中相同的对象但是内存地址并不同
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

// 需要去除json字符串中key的双引号
function deleteQuotationMark(obj) {
    let propery = JSON.stringify(obj);
    if(propery.indexOf(",") == -1){
        propery = propery.replace(/{"/gi, '{').replace(/":/gi, ':');
    }else{
        propery = propery.replace(/{"/gi, '{').replace(/,"/gi, ',').replace(/":/gi, ':');
    }
    return propery;
}


/**
 * @route get /api/networks/:field
 * @description 获取指定field的network
 * @access public
 */
router.get('/:field', (req, res) =>{
    const field = req.params.field;
    let nodes = [];
    instance.cypher('MATCH (p {field: {field}}) RETURN p', {field: field})
    .then(result => { 
        for(let item of result.records){
            const singleRecord = item;
            let node = singleRecord.get(0).properties;
            if(field === 'Nursing') {
                node.lable = singleRecord.get(0).labels[0];
            }
            nodes.push(node);
        } 
        return res
    }).then(result => {
        let links = [];
        instance.cypher('MATCH (n {field:$field})-[r {field:$field}]->(m {field:$field}) RETURN n,r,m', {field: field})
        .then(result => { 
            for(let item of result.records){
                let link = {};
                const node1 = item.get(0);
                const relation = item.get(1);
                const node2 = item.get(2);
                if (field === 'Nursing' || field === 'test') {
                    link.field = relation.properties.field;
                    link.label = relation.properties.label;
                    link.type = relation.properties.type;
                    link.diagnosis = relation.properties.diagnosis;
                    link.id = relation.properties.id;
                    link.source = node1.properties.id;
                    link.target = node2.properties.id;
                }else {
                    link = relation.properties;
                }
                links.push(link);
            } 
            res.json({
                nodes: nodes,
                links: links,
            })
        });

        
    });
    
});


/**
 * @route get /api/networks/v1/query
 * @description according to different query conditions to search nodes and links 
 * @access public
 */
router.get('/v1/query', (req, res) => {
    const condition = JSON.parse(req.query.data);
    const label = condition.label;
    const propery = condition.propery;
    let node1Propery = deleteQuotationMark(propery.node1);
    let node2Propery = deleteQuotationMark(propery.node2);
    let relationPropery = deleteQuotationMark(propery.relation);
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
                        nodes: deteleObject(Array.from(nodes)), 
                        links: deteleObject(Array.from(links)),
                    }
                });
            })
        }else if(label.node1 !== ''){
            const nodeLabel = label.node1;
            const propery = node1Propery;
            instance.cypher(`MATCH p=(a:${nodeLabel} ${propery})-[]->(b) RETURN p`) //
            .then(result => {
                let paths = [];
                // res.json(result.records);
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
        }else{
            const nodeLabel = label.node2;
            const propery = node2Propery;
            instance.cypher(`MATCH p=(a)-[]->(b:${nodeLabel} ${propery}) RETURN p`)
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
                if(result.records.length !== 0){
                    const record = result.records[0]['_fields'];
                    let fromNode = record[0].properties;
                    fromNode.label = record[0].labels[0];
                    let toNode = record[2].properties;
                    toNode.label = record[2].labels[0];
                    let link = record[1].properties;
                    link.type = record[1].type;
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
                }else {
                    res.json({
                        data: {
                            paths: [],
                            nodes: [],
                            links: [],
                        }
                    })
                }
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
        }else if(label.node2 !== ''){
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
        }else{
            instance.cypher(`match (a)-[r:${label.relation} ${relationPropery}]->(b) return a,r,b`, {
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


/**
 * @route post /api/networks/
 * @description add new network
 * @access private
 */
router.post('/', (req, res) => {
    const data = req.body;
    const nodes = data.nodes;
    const links = data.links;
    const user = data.user;
    const field = data.field; 
    const isEdit = data.isEdit;
    Network.findOne({field: field})
        .then(network => {
            if(network && !isEdit){  // 
                res.status(400).json(`${field}领域已存在`);
            }else {
                console.log('isEdit:', isEdit);
                if(isEdit) {
                    // edit the existed network 
                    instance.cypher(`MATCH (p1)-[r {field: $field}]-(p2)  DELETE r`, {field: field})
                    .then(result =>{
                        
                    })
                    .catch(err => {
                        res.status(404).json(err);
                    })
                    instance.cypher(`MATCH(p {field: $field}) DETACH DELETE p`, {field: field})
                    .then(result =>{
                        
                    })
                    .catch(err => {
                        res.status(404).json(err);
                    })
                    Network.findOneAndRemove({field: field})
                    .then(network => {
                        console.log('删除成功');
                    })
                    .catch(err => {
                        res.status(404).json(err);
                    });
                }
                // nodes and links are classified by the label of node and link.
                const linksSize = Object.getOwnPropertyNames(links).length;    
                const nodesSize = Object.getOwnPropertyNames(nodes).length;
                let nodesNum = 0; 
                for(let key in nodes){
                    let item = nodes[key];
                    nodesNum += item.length; 
                }
                let linksNum = 0; 
                for(let key in links){
                    let item = links[key];
                    linksNum += item.length; 
                }
                let Num = 0;
                console.log('nodeNum, linkNum:', nodesNum, linksNum);
                for(let key in nodes){
                    instance.cypher(`UNWIND $nodes AS properties CREATE (n:${key}) SET n = properties RETURN n`, {nodes: nodes[key] })
                    .then(result =>{
                        Num = Num + 1;
                        console.log("addnode Num:", Num);
                        if(Num === nodesSize){
                            if(linksSize === 0) {
                                const network = new Network({
                                    username: user.id,
                                    field: field,
                                    numOfNodes: nodesNum,
                                    numOfLinks: linksNum,
                                    time: new Date(),
                                })
                                network.save().then(network => {
                                    res.json({
                                        message: "success"
                                    })
                                }).catch(err => {
                                    res.status(404).json(err);
                                })
                            }else {
                                for(let key in links){
                                    instance.cypher(`UNWIND $links AS link MATCH (a { id: link.source, field: $field }) MATCH (b {id: link.target, field: $field }) MERGE (a)-[:${key} {id: link.id}]->(b)`,
                                        { links: links[key], field: field})
                                    .then(result =>{
                                        Num = Num + 1;
                                        console.log("addlink Num:", Num);
                                        if(Num === nodesSize + linksSize){
                                            for(let key in links){
                                                for(let item of links[key]){
                                                    instance.cypher(`MATCH (a)-[n:${key}{id:$id}]-(b)  SET n = $props RETURN n.name`, {
                                                        id: item.id,
                                                        props: item.propery
                                                    })
                                                    .then(result =>{
                                                    })
                                                    .catch(err => {
                                                        res.status(404).json(err);
                                                    })
                                                }
                                            }
                                            console.log('key:', key);
                                            const network = new Network({
                                                username: user.id,
                                                field: field,
                                                numOfNodes: nodesNum,
                                                numOfLinks: linksNum,
                                                time: new Date(),
                                            })
                                            network.save().then(network => {
                                                res.json({
                                                    message: "success"
                                                })
                                            }).catch(err => {
                                                res.status(404).json(err);
                                            })
                                            
                                        }
                                    })
                                    .catch(err => {
                                        res.status(404).json(err);
                                    })
                                }
                                // set properies of relationships
                                
                            }
                        }
                    })
                    .catch(err => {
                        res.status(404).json(err);
                    })
                }
                
                
            }
        })
                
})


/**
 * @route get /api/networks/v1/:username
 * @description find some items whose name property is username
 * @access private
 */
router.get('/v1/:id', (req, res) => {
    const id = req.params.id;
    // const network = new Network({
    //     username: username,
    //     field: 'test',
    //     numOfNodes: 77,
    //     numOfLinks: 254,
    //     time: new Date(),
    // })
    // network.save().then().catch(err => {
    //     console.log(err);
    // });
    // Network.find()
    Network.find()
    .then(networks => {
        res.json({networks: networks})
    });
    
})


/**
 * @route delete /api/networks/:id
 * @description delte one network assigned by id 
 * @access private
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Network.deleteOne({
        _id: id
    }).then(result => {
        res.json({
            message: "success"
        })
    }).catch(err => {
        console.log(err);
    })
})


/**
 * @route get /api/networks/name
 * @description find all nodes' name
 * @access public
 */
router.get('/nodes/name', (req, res) => {
    instance.cypher(`MATCH (a) WHERE a.field = 'Nursing' RETURN a.name`, {
    }).then(result => {
        const data = [];
        const recodes = result.records;
        if(recodes.length !== 0){
            for(let item of recodes){
                data.push(item['_fields'][0])
            }
        }
        res.json({
            data: data
        })
    })
    
})
module.exports = router;