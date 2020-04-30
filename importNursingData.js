const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "123456"));
const session = driver.session();
const Neode = require('neode');
var xlsx = require('node-xlsx');
// const instance = new Neode(uri, username, password);


// ----------------------insert intervention_nodes into Neo4j----------------------


let sheets = xlsx.parse('./excel/nic.xlsx');
let intervention_nodes = [];
let num = 0;
sheets.forEach(function(sheet){
    for(var rowId in sheet['data']){
        if (rowId !== '0'){
            const intervention = {};
            var row=sheet['data'][rowId];
            intervention.field = 'Nursing';
            intervention.id = num.toString();
            intervention.name = row[0];
            intervention.num = row[1];
            intervention.definition = row[3];
            intervention.activities = row[4];
            intervention_nodes.push(intervention);
            num = num + 1;
        }
    }
});
// let resultPromise = null;
// for(let node of intervention_nodes){   
//     resultPromise = session.run(
//         'CREATE (a:Intervention {field: $field, id: $id, name: $name,  num: $num, definition: $definition, activities: $activities}) RETURN a',
//         {field: node.field, id: node.id, name: node.name, num: node.num, definition: node.definition, activities: node.activities}
//     );    
// }

// ----------------------insert outcome_nodes into Neo4j----------------------
num = 471;
let outcome_nodes = [];
sheets = xlsx.parse('./excel/noc.xlsx');
sheets.forEach(function(sheet){
    for(var rowId in sheet['data']){
        if(rowId !== '0'){
            const outcome = {};
            var row=sheet['data'][rowId];
            outcome.id = num.toString();
            outcome.field = 'Nursing';
            outcome.name = row[0];
            outcome.definition = row[1];
            outcome.domain = row[2];
            outcome.class = row[3];
            outcome.label = row[4];
            outcome.indicator = row[5];
            outcome_nodes.push(outcome);
            num = num + 1;
        }
    }
});
// let resultPromise = null;
// for(let node of outcome_nodes){   
//     resultPromise = session.run(
//         'CREATE (a:Outcome {field: $field, id: $id, name: $name, class: $class, definition: $definition, domain: $domain, label: $label, indicator: $indicator}) RETURN a',
//         {field: node.field, id: node.id, name: node.name, class: node.class, definition: node.definition, domain: node.domain, label: node.label, indicator: node.indicator}
//     );    
// }

// ----------------------insert noc-nic into Neo4j----------------------
sheets = xlsx.parse('./excel/noc_nic.xlsx');
let links = []; 
let int_nodes_id = [];
let out_nodes_id = [];
sheets.forEach(function(sheet){
    for(var rowId in sheet['data']){
        if(rowId !== '0'){
            var row=sheet['data'][rowId];
            if(!row[4]){
                continue;
            }
            const indicators = row[4].split(',');
            for(let item of indicators){
                const outcome = outcome_nodes.find(node => { if(node.name) return row[2] === node.name});
                if(!outcome){
                    break;
                }
                const intervention = intervention_nodes.find(node => { if(node.name) return item === node.name});
                if(intervention){
                    const source = intervention.id;
                    const target = outcome.id;
                    const link = {};
                    if(!int_nodes_id.includes(source)){
                        int_nodes_id.push(source);
                    }
                    if(!out_nodes_id.includes(target)){
                        out_nodes_id.push(target);
                    }
                    
                    link.field = 'Nursing';
                    link.diagnosis = row[1];
                    link.source = source;
                    link.target = target;
                    links.push(link);
                }
            }
        }
    }
});
for(let i = outcome_nodes.length - 1; i >= 0 ; i-- ) {
    if(!out_nodes_id.includes(outcome_nodes[i].id)) {
        outcome_nodes.splice(i, 1);
    }
}
for(let i = intervention_nodes.length - 1; i >= 0 ; i-- ) {
    if(!int_nodes_id.includes(intervention_nodes[i].id)) {
        intervention_nodes.splice(i, 1);
    }
}
let resultPromise = null;
for(let node of intervention_nodes){   
    resultPromise = session.run(
        'CREATE (a:Intervention {field: $field, id: $id, name: $name,  num: $num, definition: $definition, activities: $activities}) RETURN a',
        {field: node.field, id: node.id, name: node.name, num: node.num, definition: node.definition, activities: node.activities}
    );    
}
for(let node of outcome_nodes){   
    resultPromise = session.run(
        'CREATE (a:Outcome {field: $field, id: $id, name: $name, class: $class, definition: $definition, domain: $domain, label: $label, indicator: $indicator}) RETURN a',
        {field: node.field, id: node.id, name: node.name, class: node.class, definition: node.definition, domain: node.domain, label: node.label, indicator: node.indicator}
    );    
}
for(let link of links){
    resultPromise = session.run(
        'MATCH (j:Intervention {id: $node1}) MATCH (m:Outcome {id: $node2}) MERGE (j)-[r:Intervent {field: $field, diagnosis: $diagnosis}]->(m) RETURN j, r, m',
        {node1: link.source, node2: link.target, field: link.field, diagnosis: link.diagnosis}
    );
}

// const label = 'E';
// const links = [
//     {
//         id: "1", source: "1", target: "0", 
//     },
    // {
    //     source: "1", target: "2", 
    // }
// ]
// 批量添加关系
// resultPromise = session.run(
    
    // 'UNWIND $events AS event MERGE (y:Year { year: event.year }) MERGE (y)<-[:IN]-(e:Event { id: event.id })  RETURN e.id AS x ORDER BY x',
    // {
    //     "events" : [ {
    //       "year" : 2014,
    //       "id" : 1
    //     }, {
    //       "year" : 2014,
    //       "id" : 2
    //     } ]
    // }
// );



// 查询节点和关系


// resultPromise = session.run(
//     `MATCH (n:SON { lid: $id }) SET n = $props RETURN n.name`, {
//             id: '3',
//             "props" : {
//               "name" : "Andy",
//               "position" : "Developer"
//             }
          
//     }
// );

// resultPromise.then(result => {
//     session.close();  
//     for(let i in result.records){
//         const singleRecord = result.records[i];
//         const node = singleRecord.get(i);
//         console.log(node.properties.name);
//     } 
//     for(let i in result.records.length)
//         console.log(result.records);
//     driver.close();
//   });