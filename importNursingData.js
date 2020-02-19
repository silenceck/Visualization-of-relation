var xlsx = require('node-xlsx');

// 解析得到文档中的所有 sheet
var sheets = xlsx.parse('./excel/nic.xlsx');
let intervention_nodes = [];
let num = 0;
// 遍历 sheet
sheets.forEach(function(sheet){
    // 读取每行内容
    for(var rowId in sheet['data']){
        if (rowId !== '0'){
            const intervention = {};
            var row=sheet['data'][rowId];
            intervention.field = 'Nursing';
            intervention.id = num;
            intervention.name = row[0].trim();
            intervention.num = row[1].trim();
            intervention.definition = row[3].trim();
            intervention.activities = row[4].trim();
            intervention_nodes.push(intervention);
            num = num + 1;
        }
    }
});
let outcome_nodes = [];
sheets = xlsx.parse('./excel/noc.xlsx');
// 遍历 sheet
sheets.forEach(function(sheet){
    // 读取每行内容
    for(var rowId in sheet['data']){
        if(rowId !== '0'){
            const outcome = {};
            var row=sheet['data'][rowId];
            outcome.id = num;
            outcome.field = 'Nursing';
            outcome.name = row[0].trim();
            outcome.Definition = row[1].trim();
            outcome.Domain = row[2].trim();
            outcome.Class = row[3].trim();
            outcome.Label = row[4].trim();
            outcome.Indicator = row[5].trim();
            outcome_nodes.push(outcome);
            num = num + 1;
        }
    }
});
// sheets = xlsx.parse('./excel/noc_nic.xlsx');
// let links = []; 
// // 遍历 sheet
// sheets.forEach(function(sheet){
//     // 读取每行内容
//     for(var rowId in sheet['data']){
//         if(rowId !== '0'){
//             var row=sheet['data'][rowId];
//             if(!row[4]){
//                 continue;
//             }
//             const indicators = row[4].split(',');
//             for(let item of indicators){
//                 const outcome = outcome_nodes.find(node => { if(node.name) return row[2] === node.name});
//                 if(!outcome){
//                     break;
//                 }
//                 const intervention = intervention_nodes.find(node => { if(node.name) return item === node.name});
//                 if(intervention){
//                     const source = intervention.id;
//                     const target = outcome.id;
//                     const link = {};
//                     link.field = 'Nursing';
//                     link.label = 'intervent';
//                     link.source = source;
//                     link.target = target;
//                     links.push(link);
//                 }
//             }
//         }
//     }
// });

// console.log(links.length);
// console.log('intervention:', intervention_nodes);
// console.log('outcome:', outcome_nodes);
// console.log('links:', links);
