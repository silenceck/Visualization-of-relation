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


// const nodes = [
//     {field: "test", id: "0", name: "Myriel", itemStyle: null, symbolSize: 19.12381, x: -266.82776},
//     {field: "test", id: "1", name: "Napoleon", itemStyle: null, symbolSize: 2.6666666666666665, x: -418.08344},
//     {field: "test", id: "2", name: "MlleBaptistine", itemStyle: null, symbolSize: 6.323809333333333, x: -212.76357},
//     {field: "test", id: "3", name: "MmeMagloire", itemStyle: null, symbolSize: 6.323809333333333, x: -242.82404},
//     {field: "test", id: "4", name: "CountessDeLo", itemStyle: null, symbolSize: 2.6666666666666665, x: -379.30386},
//     {field: "test", id: "5", name: "Geborand", itemStyle: null, symbolSize: 2.6666666666666665, x: -417.26337},
//     {field: "test", id: "6", name: "Champtercier", itemStyle: null, symbolSize: 2.6666666666666665, x: -332.6012},
//     {field: "test", id: "7", name: "Cravatte", itemStyle: null, symbolSize: 2.6666666666666665, x: -382.69568},
//     {field: "test", id: "8", name: "Count", itemStyle: null, symbolSize: 2.6666666666666665, x: -320.384},
//     {field: "test", id: "9", name: "OldMan", itemStyle: null, symbolSize: 2.6666666666666665, x: -344.39832},
//     {field: "test", id: "10", name: "Labarre", itemStyle: null, symbolSize: 2.6666666666666665, x: -89.34107},
//     {field: "test", id: "11", name: "Valjean", itemStyle: null, symbolSize: 66.66666666666667, x: -87.93029},
//     {field: "test", id: "12", name: "Marguerite", itemStyle: null, symbolSize: 4.495239333333333, x: -339.77908},
//     {field: "test", id: "13", name: "MmeDeR", itemStyle: null, symbolSize: 2.6666666666666665, x: -194.31313},
//     {field: "test", id: "14", name: "Isabeau", itemStyle: null, symbolSize: 2.6666666666666665, x: -158.05168},
//     {field: "test", id: "15", name: "Gervais", itemStyle: null, symbolSize: 2.6666666666666665, x: -127.701546},
//     {field: "test", id: "16", name: "Tholomyes", itemStyle: null, symbolSize: 17.295237333333333, x: -385.2226},
//     {field: "test", id: "17", name: "Listolier", itemStyle: null, symbolSize: 13.638097333333334, x: -516.55884},
//     {field: "test", id: "18", name: "Fameuil", itemStyle: null, symbolSize: 13.638097333333334, x: -464.79382},
//     {field: "test", id: "19", name: "Blacheville", itemStyle: null, symbolSize: 13.638097333333334, x: -515.1624},
//     {field: "test", id: "20", name: "Favourite", itemStyle: null, symbolSize: 13.638097333333334, x: -408.12122},
//     {field: "test", id: "21", name: "Dahlia", itemStyle: null, symbolSize: 13.638097333333334, x: -456.44113},
//     {field: "test", id: "22", name: "Zephine", itemStyle: null, symbolSize: 13.638097333333334, x: -459.1107},
//     {field: "test", id: "23", name: "Fantine", itemStyle: null, symbolSize: 28.266666666666666, x: -313.42786},
//     {field: "test", id: "24", name: "MmeThenardier", itemStyle: null, symbolSize: 20.95238266666667, x: 4.6313396},
//     {field: "test", id: "25", name: "Thenardier", itemStyle: null, symbolSize: 30.095235333333335, x: 82.80825},
//     {field: "test", id: "26", name: "Cosette", itemStyle: null, symbolSize: 20.95238266666667, x: 78.64646},
//     {field: "test", id: "27", name: "Javert", itemStyle: null, symbolSize: 31.923806666666668, x: -81.46074},
//     {field: "test", id: "28", name: "Fauchelevent", itemStyle: null, symbolSize: 8.152382000000001, x: -225.73984},
//     {field: "test", id: "29", name: "Bamatabois", itemStyle: null, symbolSize: 15.466666666666667, x: -385.6842},
//     {field: "test", id: "30", name: "Perpetue", itemStyle: null, symbolSize: 4.495239333333333, x: -403.92447},
//     {field: "test", id: "31", name: "Simplice", itemStyle: null, symbolSize: 8.152382000000001, x: -281.4253},
//     {field: "test", id: "32", name: "Scaufflaire", itemStyle: null, symbolSize: 2.6666666666666665, x: -122.41348},
//     {field: "test", id: "33", name: "Woman1", itemStyle: null, symbolSize: 4.495239333333333, x: -234.6001},
//     {field: "test", id: "34", name: "Judge", itemStyle: null, symbolSize: 11.809524666666666, x: -387.84915},
//     {field: "test", id: "35", name: "Champmathieu", itemStyle: null, symbolSize: 11.809524666666666, x: -338.2307},
//     {field: "test", id: "36", name: "Brevet", itemStyle: null, symbolSize: 11.809524666666666, x: -453.26874},
//     {field: "test", id: "37", name: "Chenildieu", itemStyle: null, symbolSize: 11.809524666666666, x: -386.44904},
//     {field: "test", id: "38", name: "Cochepaille", itemStyle: null, symbolSize: 11.809524666666666, x: -446.7876},
//     {field: "test", id: "39", name: "Pontmercy", itemStyle: null, symbolSize: 6.323809333333333, x: 336.49738},
//     {field: "test", id: "40", name: "Boulatruelle", itemStyle: null, symbolSize: 2.6666666666666665, x: 29.187843},
//     {field: "test", id: "41", name: "Eponine", itemStyle: null, symbolSize: 20.95238266666667, x: 238.36697},
//     {field: "test", id: "42", name: "Anzelma", itemStyle: null, symbolSize: 6.323809333333333, x: 189.69513},
//     {field: "test", id: "43", name: "Woman2", itemStyle: null, symbolSize: 6.323809333333333, x: -187.00418},
//     {field: "test", id: "44", name: "MotherInnocent", itemStyle: null, symbolSize: 4.495239333333333, x: -252.99521},
//     {field: "test", id: "45", name: "Gribier", itemStyle: null, symbolSize: 2.6666666666666665, x: -296.07935},
//     {field: "test", id: "46", name: "Jondrette", itemStyle: null, symbolSize: 2.6666666666666665, x: 550.3201},
//     {field: "test", id: "47", name: "MmeBurgon", itemStyle: null, symbolSize: 4.495239333333333, x: 488.13535},
//     {field: "test", id: "48", name: "Gavroche", itemStyle: null, symbolSize: 41.06667066666667, x: 387.89572},
//     {field: "test", id: "49", name: "Gillenormand", itemStyle: null, symbolSize: 13.638097333333334, x: 126.4831},
//     {field: "test", id: "50", name: "Magnon", itemStyle: null, symbolSize: 4.495239333333333, x: 127.07365},
//     {field: "test", id: "51", name: "MlleGillenormand", itemStyle: null, symbolSize: 13.638097333333334, x: 162.63559},
//     {field: "test", id: "52", name: "MmePontmercy", itemStyle: null, symbolSize: 4.495239333333333, x: 353.66415},
//     {field: "test", id: "53", name: "MlleVaubois", itemStyle: null, symbolSize: 2.6666666666666665, x: 165.43939},
//     {field: "test", id: "54", name: "LtGillenormand", itemStyle: null, symbolSize: 8.152382000000001, x: 137.69348},
//     {field: "test", id: "55", name: "Marius", itemStyle: null, symbolSize: 35.58095333333333, x: 206.44687},
//     {field: "test", id: "56", name: "BaronessT", itemStyle: null, symbolSize: 4.495239333333333, x: 194.82993},
//     {field: "test", id: "57", name: "Mabeuf", itemStyle: null, symbolSize: 20.95238266666667, x: 597.6618},
//     {field: "test", id: "58", name: "Enjolras", itemStyle: null, symbolSize: 28.266666666666666, x: 355.78366},
//     {field: "test", id: "59", name: "Combeferre", itemStyle: null, symbolSize: 20.95238266666667, x: 515.2961},
//     {field: "test", id: "60", name: "Prouvaire", itemStyle: null, symbolSize: 17.295237333333333, x: 614.29285},
//     {field: "test", id: "61", name: "Feuilly", itemStyle: null, symbolSize: 20.95238266666667, x: 550.1917},
//     {field: "test", id: "62", name: "Courfeyrac", itemStyle: null, symbolSize: 24.609526666666667, x: 436.17184},
//     {field: "test", id: "63", name: "Bahorel", itemStyle: null, symbolSize: 22.780953333333333, x: 602.55225},
//     {field: "test", id: "64", name: "Bossuet", itemStyle: null, symbolSize: 24.609526666666667, x: 455.81955},
//     {field: "test", id: "65", name: "Joly", itemStyle: null, symbolSize: 22.780953333333333, x: 516.40784},
//     {field: "test", id: "66", name: "Grantaire", itemStyle: null, symbolSize: 19.12381, x: 646.4313},
//     {field: "test", id: "67", name: "MotherPlutarch", itemStyle: null, symbolSize: 2.6666666666666665, x: 668.9568},
//     {field: "test", id: "68", name: "Gueulemer", itemStyle: null, symbolSize: 19.12381, x: 78.4799},
//     {field: "test", id: "69", name: "Babet", itemStyle: null, symbolSize: 19.12381, x: 150.35959},
//     {field: "test", id: "70", name: "Claquesous", itemStyle: null, symbolSize: 19.12381, x: 137.3717},
//     {field: "test", id: "71", name: "Montparnasse", itemStyle: null, symbolSize: 17.295237333333333, x: 234.87747},
//     {field: "test", id: "72", name: "Toussaint", itemStyle: null, symbolSize: 6.323809333333333, x: 40.942253},
//     {field: "test", id: "73", name: "Child1", itemStyle: null, symbolSize: 4.495239333333333, x: 437.939},
//     {field: "test", id: "74", name: "Child2", itemStyle: null, symbolSize: 4.495239333333333, x: 466.04922},
//     {field: "test", id: "75", name: "Brujon", itemStyle: null, symbolSize: 13.638097333333334, x: 238.79364},
//     {field: "test", id: "76", name: "MmeHucheloup", itemStyle: null, symbolSize: 13.638097333333334, x: 712.18353},
// ];

// let resultPromise = null;
// const newNodes = nodes.map( item => JSON.stringify(item));
// 循环create 添加节点
// for(let node of nodes){   
//     resultPromise = session.run(
//         'CREATE (a:Person {field: $field, id: $id, name: $name}) RETURN a',
//         {field: node.field, id: node.id, name: node.name}
//     );    
// }

// 批量插入节点
// for(let item of nodes){
//     delete item.itemStyle;
//     delete item.symbolSize;
//     delete item.x;
// }
// resultPromise = session.run(
//     'UNWIND $nodes AS properties CREATE (n:Intervention) SET n = properties RETURN n',
//     {nodes: intervention_nodes }
// ); 

// const property = {
//     name: "ck", id: "0"
// }
// let newProperty = JSON.stringify(property);

// if(newProperty.indexOf(",") == -1){
//     newProperty = newProperty.replace(/{"/gi, '{').replace(/":/gi, ':');
// }else{
//     newProperty = newProperty.replace(/{"/gi, '{').replace(/,"/gi, ',').replace(/":/gi, ':');
// }
// 添加关系
// const links = [
//     // { label:'ADFAFAHSK', field: 'test',  source: "1", target: "0", id: '1', property: newProperty},
//     {label:'IS_FRIENDS', field: 'test', id: "1",  source: "2", target: "0", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "2", name: null, source: "3", target: "0", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "3", name: null, source: "3", target: "2", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "4", name: null, source: "4", target: "0", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "5", name: null, source: "5", target: "0", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "6", name: null, source: "6", target: "0", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "7", name: null, source: "7", target: "0", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "8", name: null, source: "8", target: "0", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "9", name: null, source: "9", target: "0", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "13", name: null, source: "11", target: "0", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "11", target: "2", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "11", name: null, source: "11", target: "3", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "10", name: null, source: "11", target: "10", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "14", name: null, source: "12", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "15", name: null, source: "13", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "16", name: null, source: "14", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "17", name: null, source: "15", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "18", name: null, source: "17", target: "16", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "19", name: null, source: "18", target: "16", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "20", name: null, source: "18", target: "17", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "21", name: null, source: "19", target: "16", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "22", name: null, source: "19", target: "17", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "23", name: null, source: "19", target: "18", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "24", name: null, source: "20", target: "16", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "25", name: null, source: "20", target: "17", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "26", name: null, source: "20", target: "18", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "27", name: null, source: "20", target: "19", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "28", name: null, source: "21", target: "16", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "29", name: null, source: "21", target: "17", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "30", name: null, source: "21", target: "18", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "31", name: null, source: "21", target: "19", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "32", name: null, source: "21", target: "20", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "33", name: null, source: "22", target: "16", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "34", name: null, source: "22", target: "17", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "35", name: null, source: "22", target: "18", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "36", name: null, source: "22", target: "19", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "37", name: null, source: "22", target: "20", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "38", name: null, source: "22", target: "21", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "47", name: null, source: "23", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "46", name: null, source: "23", target: "12", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "39", name: null, source: "23", target: "16", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "40", name: null, source: "23", target: "17", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "41", name: null, source: "23", target: "18", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "42", name: null, source: "23", target: "19", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "43", name: null, source: "23", target: "20", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "44", name: null, source: "23", target: "21", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "45", name: null, source: "23", target: "22", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "24", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "48", name: null, source: "24", target: "23", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "52", name: null, source: "25", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "51", name: null, source: "25", target: "23", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "50", name: null, source: "25", target: "24", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "26", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "26", target: "16", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "53", name: null, source: "26", target: "24", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "56", name: null, source: "26", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "57", name: null, source: "27", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "58", name: null, source: "27", target: "23", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "27", target: "24", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "59", name: null, source: "27", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "61", name: null, source: "27", target: "26", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "62", name: null, source: "28", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "63", name: null, source: "28", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "66", name: null, source: "29", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "64", name: null, source: "29", target: "23", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "65", name: null, source: "29", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "67", name: null, source: "30", target: "23", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "31", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "31", target: "23", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "31", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "68", name: null, source: "31", target: "30", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "72", name: null, source: "32", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "73", name: null, source: "33", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "74", name: null, source: "33", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "75", name: null, source: "34", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "76", name: null, source: "34", target: "29", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "77", name: null, source: "35", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "35", target: "29", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "78", name: null, source: "35", target: "34", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "82", name: null, source: "36", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "83", name: null, source: "36", target: "29", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "80", name: null, source: "36", target: "34", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "81", name: null, source: "36", target: "35", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "87", name: null, source: "37", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "88", name: null, source: "37", target: "29", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "84", name: null, source: "37", target: "34", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "85", name: null, source: "37", target: "35", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "86", name: null, source: "37", target: "36", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "93", name: null, source: "38", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "94", name: null, source: "38", target: "29", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "89", name: null, source: "38", target: "34", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "90", name: null, source: "38", target: "35", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "91", name: null, source: "38", target: "36", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "92", name: null, source: "38", target: "37", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "95", name: null, source: "39", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "96", name: null, source: "40", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "97", name: null, source: "41", target: "24", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "98", name: null, source: "41", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "101", name: null, source: "42", target: "24", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "100", name: null, source: "42", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "99", name: null, source: "42", target: "41", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "102", name: null, source: "43", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "103", name: null, source: "43", target: "26", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "104", name: null, source: "43", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "44", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "105", name: null, source: "44", target: "28", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "107", name: null, source: "45", target: "28", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "108", name: null, source: "47", target: "46", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "112", name: null, source: "48", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "110", name: null, source: "48", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "111", name: null, source: "48", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "109", name: null, source: "48", target: "47", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "49", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "113", name: null, source: "49", target: "26", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "50", target: "24", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "115", name: null, source: "50", target: "49", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "119", name: null, source: "51", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "118", name: null, source: "51", target: "26", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "117", name: null, source: "51", target: "49", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "52", target: "39", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "120", name: null, source: "52", target: "51", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "122", name: null, source: "53", target: "51", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "125", name: null, source: "54", target: "26", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "124", name: null, source: "54", target: "49", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "123", name: null, source: "54", target: "51", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "131", name: null, source: "55", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "132", name: null, source: "55", target: "16", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "133", name: null, source: "55", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "55", target: "26", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "128", name: null, source: "55", target: "39", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "134", name: null, source: "55", target: "41", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "135", name: null, source: "55", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "127", name: null, source: "55", target: "49", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "126", name: null, source: "55", target: "51", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "129", name: null, source: "55", target: "54", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "136", name: null, source: "56", target: "49", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "137", name: null, source: "56", target: "55", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "57", target: "41", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "57", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "138", name: null, source: "57", target: "55", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "145", name: null, source: "58", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "58", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "142", name: null, source: "58", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "141", name: null, source: "58", target: "55", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "144", name: null, source: "58", target: "57", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "148", name: null, source: "59", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "147", name: null, source: "59", target: "55", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "59", target: "57", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "146", name: null, source: "59", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "150", name: null, source: "60", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "151", name: null, source: "60", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "152", name: null, source: "60", target: "59", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "153", name: null, source: "61", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "158", name: null, source: "61", target: "55", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "157", name: null, source: "61", target: "57", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "154", name: null, source: "61", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "156", name: null, source: "61", target: "59", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "155", name: null, source: "61", target: "60", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "164", name: null, source: "62", target: "41", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "162", name: null, source: "62", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "159", name: null, source: "62", target: "55", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "62", target: "57", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "160", name: null, source: "62", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "161", name: null, source: "62", target: "59", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "62", target: "60", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "165", name: null, source: "62", target: "61", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "63", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "174", name: null, source: "63", target: "55", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "63", target: "57", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "63", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "167", name: null, source: "63", target: "59", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "63", target: "60", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "172", name: null, source: "63", target: "61", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "169", name: null, source: "63", target: "62", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "184", name: null, source: "64", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "64", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "175", name: null, source: "64", target: "55", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "183", name: null, source: "64", target: "57", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "179", name: null, source: "64", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "182", name: null, source: "64", target: "59", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "181", name: null, source: "64", target: "60", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "180", name: null, source: "64", target: "61", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "176", name: null, source: "64", target: "62", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "178", name: null, source: "64", target: "63", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "187", name: null, source: "65", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "194", name: null, source: "65", target: "55", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "193", name: null, source: "65", target: "57", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "65", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "192", name: null, source: "65", target: "59", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "65", target: "60", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "190", name: null, source: "65", target: "61", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "188", name: null, source: "65", target: "62", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "185", name: null, source: "65", target: "63", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "186", name: null, source: "65", target: "64", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "200", name: null, source: "66", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "196", name: null, source: "66", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "197", name: null, source: "66", target: "59", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "203", name: null, source: "66", target: "60", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "202", name: null, source: "66", target: "61", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "198", name: null, source: "66", target: "62", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "201", name: null, source: "66", target: "63", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "195", name: null, source: "66", target: "64", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "199", name: null, source: "66", target: "65", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "204", name: null, source: "67", target: "57", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "68", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "68", target: "24", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "205", name: null, source: "68", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "208", name: null, source: "68", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "68", target: "41", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "209", name: null, source: "68", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "213", name: null, source: "69", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "214", name: null, source: "69", target: "24", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "211", name: null, source: "69", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "69", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "217", name: null, source: "69", target: "41", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "216", name: null, source: "69", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "212", name: null, source: "69", target: "68", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "221", name: null, source: "70", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "222", name: null, source: "70", target: "24", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "218", name: null, source: "70", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "223", name: null, source: "70", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "224", name: null, source: "70", target: "41", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "225", name: null, source: "70", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "220", name: null, source: "70", target: "68", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "219", name: null, source: "70", target: "69", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "230", name: null, source: "71", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "233", name: null, source: "71", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "226", name: null, source: "71", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "232", name: null, source: "71", target: "41", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "71", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "228", name: null, source: "71", target: "68", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "227", name: null, source: "71", target: "69", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "229", name: null, source: "71", target: "70", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "236", name: null, source: "72", target: "11", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "234", name: null, source: "72", target: "26", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "235", name: null, source: "72", target: "27", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "237", name: null, source: "73", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "238", name: null, source: "74", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "239", name: null, source: "74", target: "73", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "242", name: null, source: "75", target: "25", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "244", name: null, source: "75", target: "41", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: null, name: null, source: "75", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "241", name: null, source: "75", target: "68", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "240", name: null, source: "75", target: "69", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "245", name: null, source: "75", target: "70", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "246", name: null, source: "75", target: "71", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "252", name: null, source: "76", target: "48", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "253", name: null, source: "76", target: "58", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "251", name: null, source: "76", target: "62", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "250", name: null, source: "76", target: "63", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "247", name: null, source: "76", target: "64", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "248", name: null, source: "76", target: "65", lineStyle: {}},
//     {label:'IS_FRIENDS', field: 'test', id: "249", name: null, source: "76", target: "66", lineStyle: {}},
// ]; 
// console.log(links.length); 
// for(let link of links){
//     resultPromise = session.run(
//         'MATCH (j:Person {id: $node1}) MATCH (m:Person {id: $node2}) MERGE (j)-[r:IS_FRIENDS_WITH {field: $field}]->(m) RETURN j, r, m',
//         {node1: link.source, node2: link.target, field: link.field}
//     );
// }

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
    // `UNWIND $links AS link MATCH (a { id: link.source, field: $field}) MATCH (b {id:link.target, field: $field}) MERGE (a)-[:${label} {id: link.id}]->(b) ` ,
    // {
    //     "links" : links,
    //     "field": "G3",
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