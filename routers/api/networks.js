const express = require('express');
const router = express.Router();
const Neode = require('neode');
const uri = require('../../config/store').neo4j.URL;
const username = require('../../config/store').neo4j.USER;
const password = require('../../config/store').neo4j.PASSWORD;
const instance = new Neode(uri, username, password);
const Network = require('../../models/Network');
const User = require('../../models/User');
const passport = require('passport');
const fs = require('fs');
const readline = require('readline');
const pathLib = require("path");
const xlsx = require('node-xlsx');
let {PythonShell} = require('python-shell');
const pythonPath = 'D:/PycharmProjects/relation_extraction/v1.1.py'
// const sleep = require()

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

function writeCSV(filename, text) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, text, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(console.log('写入完成'))
        });
 
    })
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
                node.label = singleRecord.get(0).labels[0];
            }
            if(field === 'test') {
                node.label = 'Person';
            }
            nodes.push(node);
        } 
        let links = [];
        instance.cypher('MATCH (n {field:$field})-[r {field:$field}]->(m {field:$field}) RETURN n,r,m', {field: field})
        .then(result => { 
            for(let item of result.records){
                let link = {};
                const node1 = item.get(0);
                const relation = item.get(1);
                const node2 = item.get(2);
                if (field === 'Nursing') {
                    link.field = relation.properties.field;
                    link.label = relation.properties.label;
                    link.type = relation.properties.type;
                    link.diagnosis = relation.properties.diagnosis;
                    link.id = relation.properties.id;
                    link.source = node1.properties.id;
                    link.target = node2.properties.id;
                }else if(field === 'test'){
                    link.field = relation.properties.field;
                    link.source = node1.properties.id;
                    link.target = node2.properties.id;
                    link.label = "IS_FRIENDS_WITH";
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
    }).catch(err => {
        return res.status(400).json("获取数据失败");
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
                        link.label = "IS_FRIENDS_WITH";
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
                if(isEdit) {
                    // edit the existed network 
                    instance.cypher(`MATCH (p1)-[r {field: $field}]-(p2)  RETURN r`, {field: field})
                    .then(result =>{
                        instance.cypher(`MATCH(p {field: $field}) DETACH DELETE p`, {field: field})
                        .then(result =>{
                            Network.findOneAndRemove({field: field})
                            .then(network => {
                                // console.log('删除成功');
                            })
                            .catch(err => {
                                res.status(404).json(err);
                            });
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
                            for(let key in nodes){
                                instance.cypher(`UNWIND $nodes AS properties CREATE (n:${key}) SET n = properties RETURN n`, {nodes: nodes[key] })
                                .then(result =>{
                                    Num = Num + 1;
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
                                                instance.cypher(`UNWIND $links AS link MATCH (a ) MATCH (b) WHERE  a.field=$field AND b.field=$field AND a.id=link.source AND b.id=link.target  CREATE (a)-[:${key} {id: link.id, field: $field}]->(b)`,
                                                    { links: links[key], field: field})
                                                .then(result =>{
                                                    Num = Num + 1;
                                                    if(Num === nodesSize + linksSize){
                                                        for(let key in links){
                                                            for(let item of links[key]){
                                                                instance.cypher(`MATCH (a)-[n:${key}{id:$id, field: $field}]-(b)  SET n = $props RETURN n.name`, {
                                                                    id: item.id,
                                                                    field: field,
                                                                    props: item.propery
                                                                })
                                                                .then(result =>{
                                                                })
                                                                .catch(err => {
                                                                    res.status(404).json(err);
                                                                })
                                                            }
                                                        }
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
                    })
                    .catch(err => {
                        res.status(404).json(err);
                    })
                    })
                    .catch(err => {
                        res.status(404).json(err);
                    })
                    
                    
                }else{
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
                    for(let key in nodes){
                        instance.cypher(`UNWIND $nodes AS properties CREATE (n:${key}) SET n = properties RETURN n`, {nodes: nodes[key] })
                        .then(result =>{
                            Num = Num + 1;
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
                                        instance.cypher(`UNWIND $links AS link MATCH (a ) MATCH (b) WHERE  a.field=$field AND b.field=$field AND a.id=link.source AND b.id=link.target  CREATE (a)-[:${key} {id: link.id, field: $field}]->(b)`,
                                            { links: links[key], field: field})
                                        .then(result =>{
                                            Num = Num + 1;
                                            if(Num === nodesSize + linksSize){
                                                for(let key in links){
                                                    for(let item of links[key]){
                                                        instance.cypher(`MATCH (a)-[n:${key}{id:$id, field: $field}]-(b)  SET n = $props RETURN n.name`, {
                                                            id: item.id,
                                                            props: item.propery,
                                                            field: field
                                                        })
                                                        .then(result =>{
                                                        })
                                                        .catch(err => {
                                                            res.status(404).json(err);
                                                        })
                                                    }
                                                }
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
                }
                
               
        })
                
})


/**
 * @route get /api/networks/v1/:id
 * @description find some items whose username property is id
 * @access private
 */
router.get('/v1/:id', (req, res) => {
    const id = req.params.id;
    Network.find({username: id})
    .then(networks => {
        res.json({networks: networks})
    });
    
})


/**
 * @route delete /api/networks/:id
 * @description delete one network assigned by id 
 * @access private
 */
router.post('/delete/', (req, res) => {
    const data = req.body;
    const id = data.id;
    const field = data.field;
    // console.log(req.body);
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
 * @route get /api/networks/nodes/name
 * @description find all nodes' name
 * @access public
 */
router.get('/nodes/name/:field', (req, res) => {
    const field = req.params.field;
    instance.cypher(`MATCH (a) WHERE a.field = $field RETURN a.name`, {field: field
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

/**
 * @route get /api/networks/v1/file
 * @description upload file
 * @access public
 */
router.post('/v1/file/', (req, res) => {
	var fi = req.files[0];
	var originalName = fi.originalname;
    const filename = originalName.split('.')[0];
    fs.rename(fi.path, fi.path.split('\\')[0]+'\\'+originalName, function(err){
        if (!err) {
            const fileType = originalName.split('.')[1]
            const path = './upload/'+originalName;
            if (filename.includes('-')) {
                const labels = filename.split('-');
                let sourceLabel = labels[0];
                let relationLabel = labels[1];
                let targetLabel = labels[2];
                let links = [];
                let property = [];
                if (fileType === 'csv') {
                    fs.readFile(path,function(err,data){
                        if(err){
                            console.log(err);
                        }else{
                            const fileData = data.toString().split('\r\n');
                            for(let i=0; i<fileData.length-1; i++) {
                                if(i !== 0) {
                                    let link = {};
                                    let value = fileData[i].split(',');
                                    for(let i in property) {
                                        link[property[i]] = String(value[i]);
                                    } 
                                    link.label = relationLabel;
                                    links.push(link);
                                } else {
                                    
                                    property = fileData[i].split(',');
                                }
                            }
                            res.json({
                                type: 'link',
                                label: [sourceLabel, targetLabel],
                                data: links
                            })
                        }
                    });
                    
                    // let input = fs.createReadStream(path)
                    // const rl = readline.createInterface({
                    //     input: input
                    // });
                    // let index = 0;
                    // rl.on('line', (line) => {
                    //     if (index === 0) {
                    //         property = line.split(',');
                    //     } else {
                    //         let link = {};
                    //         let value = line.split(',');
                    //         for(let i in property) {
                    //             link[property[i]] = String(value[i]);
                    //         } 
                    //         link.label = relationLabel;
                    //         links.push(link);
                    //     }
                    // });
                    // rl.on('close', (line) => {
                    //     console.log(links)
                    //     res.json({
                    //         type: 'link',
                    //         label: [sourceLabel, targetLabel],
                    //         data: links
                    //     })
                    // });
                } else if (fileType === 'xlsx'){
                    var sheets = xlsx.parse(path);
                    const label = filename;
                    sheets.forEach(function(sheet){
                        const data = sheet['data'];
                        for(let rowId in data){
                            let row = data[rowId];
                            if(rowId === '0') {
                                for(let item of row) {
                                    property.push(item)
                                }
                            } else {
                                let link = {};
                                for(let i in property) {
                                    link[property[i]] = String(row[i]);
                                } 
                                link.label = relationLabel;
                                links.push(link);
                            }
                        }
                        res.json({
                            type: 'link',
                            label: [sourceLabel, targetLabel],
                            data: links
                        })
                        
                    });
                }
                
            } else {
                if (fileType === 'csv') {
                    fs.readFile(path,function(err,data){
                        if(err){
                            console.log(err);
                        }else{
                            let property = [];
                            let nodes = [];
                            let label = filename;
                            const fileData = data.toString().split('\r\n');
                            for(let i=0; i<fileData.length-1; i++) {
                                if(i !== 0) {
                                    let node = {};
                                    let value = fileData[i].split(',');
                                    for(let i in property) {
                                        node[property[i]] = String(value[i]);
                                    } 
                                    node.label = label;
                                    nodes.push(node);
                                } else {
                                    property = fileData[i].split(',');
                                }
                            }
                            res.json({
                                type: 'node',
                                data: nodes
                            })
                        }
                    });
                } else {
                    var sheets = xlsx.parse('./upload/'+originalName);
                    const label = filename;
                    sheets.forEach(function(sheet){
                        const data = sheet['data'];
                        let property = [];
                        let nodes = []
                        for(let rowId in data){
                            let row = data[rowId];
                            if(rowId === '0') {
                                for(let item of row) {
                                    property.push(item)
                                }
                            } else {
                                let node = {};
                                for(let i in property) {
                                    node[property[i]] = String(row[i]);
                                } 
                                node.label = label;
                                nodes.push(node);
                            }
                        }
                        res.json({
                            type: 'node',
                            data: nodes
                        })
                    });
                }
                
            }
            fs.unlink('./upload/'+originalName, function(err) {
                if (err) {
                    return console.error(err);
                }
            });
        } else {
            res.json({
                status: 500,
                message: '上传失败'
            })
        }
    });
    
}),

/**
 * @route get /api/networks/v1/test
 * @description add network
 * @access public
 */
router.get('/v1/test/test', (req, res) => {
	User.findOne({identity: 'admin'}).then( user => {
        console.log('user:', user)
        // const network = new Network({
        //     username: user.id,
        //     field: 'Nursing',
        //     numOfNodes: 482,
        //     numOfLinks: 3341,
        //     time: new Date(),
        // })
        Network.find().then(network => res.json(network))
        // network.save().then(network => res.json(network))
    })
    // Network.deleteOne({'_id': '5e8bd977b9a04f5cb8e6ac7b'}).then(network => {
    //     console.log(network)
    // })
}),

/**
 * @route get /api/networks/v1/test/admin-network/
 * @description add network
 * @access public
 */
router.get('/v1/test/admin-network/', (req, res) => {
	User.findOne({identity: 'admin'}).then(user => {
        Network.find({username: user.id}).then(networks => {
            // console.log(networks)
            let adminNetworks = [];
            for(let network of networks) {
                adminNetworks.push(network.field);
            }
            res.json({
                adminNetworks: adminNetworks
            })
        })
    })
}),

/**
 * @route get /api/networks/v1/test/admin-network/
 * @description add network
 * @access public
 */
router.get('/v1/test/export/:field', async (req, res) => {
    const field = req.params.field;
    let nodes = [];
    let nodeResult = await instance.cypher('MATCH (p {field: {field}}) RETURN p', {field: field})
    .catch(error => console.log('获取节点失败', error));
    for(let item of nodeResult.records){
        const singleRecord = item;
        let node = singleRecord.get(0).properties;
        if(field === 'Nursing') {
            node.label = singleRecord.get(0).labels[0];
        }
        if(field === 'test') {
            node.label = 'Person';
        }
        nodes.push(node);
    } 
    let links = [];
    let linkResult = await instance.cypher('MATCH (n {field:$field})-[r {field:$field}]->(m {field:$field}) RETURN n,r,m', {field: field})
    .catch(error => console.log('获取关系失败', error));
    for(let item of linkResult.records){
        let link = {};
        const node1 = item.get(0);
        const relation = item.get(1);
        const node2 = item.get(2);
        if (field === 'Nursing') {
            link.field = relation.properties.field;
            link.label = relation.properties.label;
            link.type = relation.properties.type;
            link.diagnosis = relation.properties.diagnosis;
            link.id = relation.properties.id;
            link.source = node1.properties.id;
            link.target = node2.properties.id;
        }else if(field === 'test'){
            link.field = relation.properties.field;
            link.source = node1.properties.id;
            link.target = node2.properties.id;
            link.label = "IS_FRIENDS_WITH";
        }else {
            link = relation.properties;
        }
        links.push(link);
    } 
    
    let nodeTypes = {};
    let linkTypes = {};
    for(let node of nodes) {
        if(!nodeTypes.hasOwnProperty(node.label)){
            nodeTypes[node.label] = Object.keys(node);
        }
    }
    for(let link of links) {
        if(!linkTypes.hasOwnProperty(link.label)){
            linkTypes[link.label] = Object.keys(link);
        }
    }
    // 数据写入csv文件
    let resultData = {};
    for (let type in nodeTypes) {
        let propertyName = nodeTypes[type].reduce((a, b) => a + ',' + b)+'\n';
        for(let node of nodes) {
            let propertyValue = '';
            for(let name of nodeTypes[type]) {
                propertyValue += node[name] +','
            }
            propertyValue = propertyValue.slice(0, propertyValue.length-1)
            propertyName += propertyValue+'\n'
        }
        resultData[type+'.csv'] = propertyName;
        // writeCSV('./export/'+type+'.csv', propertyName)
    }
    for (let type in linkTypes) {
        let propertyName = linkTypes[type].reduce((a, b) => a + ',' + b)+'\n';
        for(let link of links) {
            let propertyValue = '';
            for(let name of linkTypes[type]) {
                propertyValue += link[name] +','
            }
            propertyValue = propertyValue.slice(0, propertyValue.length-1)
            propertyName += propertyValue+'\n'
        }
        resultData[type+'.csv'] = propertyName;
        // writeCSV('./export/'+type+'.csv',propertyName)
    }
    res.json({
        data: resultData
    })
}),


module.exports = router;