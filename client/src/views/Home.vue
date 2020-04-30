<template>
    <div class="home">
        <div class="container">
            <el-row :gutter="20">
                <el-col :span="6" class="tree">
                    <el-scrollbar style="height:800px;" wrapStyle="overflow-x:hidden;">
                        <el-tree 
                            :data="data"
                            node-key="id"
                            :props="defaultProps"
                            accordion
                            @node-click="handleNodeClick"
                            :render-content="renderContent"
                            ref="tree"
                            class="sidebar">
                        </el-tree>
                    </el-scrollbar>
                </el-col>
                <el-col :span="9">
                    <div class="title" @click="resetData" v-bind:style="{cursor:'pointer' }">{{field}} Field</div>
                    <div id="main" class="chart"></div>
                </el-col>
                <el-col :span="9" class="card">
                    <el-scrollbar style="height:800px;" wrapStyle="overflow-x:hidden;">
                        <el-card class="box-card" shadow="never">
                        <div slot="header" class="clearfix">
                            <span>{{click_node.name}}</span>
                        </div>
                        <div v-for="(value, name, index) in click_node" :key="index" class="text item">
                            <div v-if="name !== 'name' && name !== 'id' && name !== 'num' && name !== 'itemStyle' && name !== 'symbolSize' && name !== 'label' && name !== 'lable' && name !== 'source' && name !== 'target' && name !== 'field' && name !=='draggable' && name !=='category' && name !=='type' && name !=='value'" >
                                <span v-bind:style="{ fontWeight:'bold' }">{{name + ':' }}</span> {{value }} 
                            </div>                         
                        </div>
                        </el-card>
                    </el-scrollbar>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
export default {
    name: 'home1',
    props: [
        'keyword',
    ],
    data(){
        return {
            data: [{
                    id: 1,
                    label: 'Nursing',
                    children: [
                        {
                            id: 4,
                            label: 'Diagnosis',
                            children: [
                                {
                                    id: 'A4',
                                    label: 'A',
                                    children: [],
                                },
                                {
                                    id: 'B4',
                                    label: 'B',
                                    children: [],
                                },
                                {
                                    id: 'C4',
                                    label: 'C',
                                    children: [],
                                },
                                {
                                    id: 'D4',
                                    label: 'D',
                                    children: [],
                                },
                                {
                                    id: 'E4',
                                    label: 'E',
                                    children: [],
                                },
                                {
                                    id: 'F4',
                                    label: 'F',
                                    children: [],
                                },
                                {
                                    id: 'G4',
                                    label: 'G',
                                    children: [],
                                },
                                {
                                    id: 'H4',
                                    label: 'H',
                                    children: [],
                                },
                                {
                                    id: 'J4',
                                    label: 'J',
                                    children: [],
                                },{
                                    id: 'K4',
                                    label: 'K',
                                    children: [],
                                },
                                {
                                    id: 'L4',
                                    label: 'L',
                                    children: [],
                                },
                                {
                                    id: 'M4',
                                    label: 'M',
                                    children: [],
                                },
                                {
                                    id: 'N4',
                                    label: 'N',
                                    children: [],
                                },
                                {
                                    id: 'P4',
                                    label: 'P',
                                    children: [],
                                },
                                {
                                    id: 'Q4',
                                    label: 'Q',
                                    children: [],
                                },
                                {
                                    id: 'R4',
                                    label: 'R',
                                    children: [],
                                },
                                {
                                    id: 'S4',
                                    label: 'S',
                                    children: [],
                                },
                                {
                                    id: 'T4',
                                    label: 'T',
                                    children: [],
                                },
                                {
                                    id: 'W4',
                                    label: 'W',
                                    children: [],
                                },
                                {
                                    id: 'X4',
                                    label: 'X',
                                    children: [],
                                },
                                {
                                    id: 'Y4',
                                    label: 'Y',
                                    children: [],
                                },
                                {
                                    id: 'Z4',
                                    label: 'Z',
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 2,
                            label: 'Intervention',
                            children: [
                                {
                                    id: 'A2',
                                    label: 'A',
                                    children: [],
                                },
                                {
                                    id: 'B2',
                                    label: 'B',
                                    children: [],
                                },
                                {
                                    id: 'C2',
                                    label: 'C',
                                    children: [],
                                },
                                {
                                    id: 'D2',
                                    label: 'D',
                                    children: [],
                                },
                                {
                                    id: 'E2',
                                    label: 'E',
                                    children: [],
                                },
                                {
                                    id: 'F2',
                                    label: 'F',
                                    children: [],
                                },
                                {
                                    id: 'G2',
                                    label: 'G',
                                    children: [],
                                },
                                {
                                    id: 'H2',
                                    label: 'H',
                                    children: [],
                                },
                                {
                                    id: 'J2',
                                    label: 'J',
                                    children: [],
                                },{
                                    id: 'K2',
                                    label: 'K',
                                    children: [],
                                },
                                {
                                    id: 'L2',
                                    label: 'L',
                                    children: [],
                                },
                                {
                                    id: 'M2',
                                    label: 'M',
                                    children: [],
                                },
                                {
                                    id: 'N2',
                                    label: 'N',
                                    children: [],
                                },
                                {
                                    id: 'P2',
                                    label: 'P',
                                    children: [],
                                },
                                {
                                    id: 'Q2',
                                    label: 'Q',
                                    children: [],
                                },
                                {
                                    id: 'R2',
                                    label: 'R',
                                    children: [],
                                },
                                {
                                    id: 'S2',
                                    label: 'S',
                                    children: [],
                                },
                                {
                                    id: 'T2',
                                    label: 'T',
                                    children: [],
                                },
                                {
                                    id: 'W2',
                                    label: 'W',
                                    children: [],
                                },
                                {
                                    id: 'X2',
                                    label: 'X',
                                    children: [],
                                },
                                {
                                    id: 'Y2',
                                    label: 'Y',
                                    children: [],
                                },
                                {
                                    id: 'Z2',
                                    label: 'Z',
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 3,
                            label: 'Outcome',
                            children: [
                                {
                                    id: 'A3',
                                    label: 'A',
                                    children: [],
                                },
                                {
                                    id: 'B3',
                                    label: 'B',
                                    children: [],
                                },
                                {
                                    id: 'C3',
                                    label: 'C',
                                    children: [],
                                },
                                {
                                    id: 'D3',
                                    label: 'D',
                                    children: [],
                                },
                                {
                                    id: 'E3',
                                    label: 'E',
                                    children: [],
                                },
                                {
                                    id: 'F3',
                                    label: 'F',
                                    children: [],
                                },
                                {
                                    id: 'G3',
                                    label: 'G',
                                    children: [],
                                },
                                {
                                    id: 'H3',
                                    label: 'H',
                                    children: [],
                                },
                                {
                                    id: 'J3',
                                    label: 'J',
                                    children: [],
                                },{
                                    id: 'K3',
                                    label: 'K',
                                    children: [],
                                },
                                {
                                    id: 'L3',
                                    label: 'L',
                                    children: [],
                                },
                                {
                                    id: 'M3',
                                    label: 'M',
                                    children: [],
                                },
                                {
                                    id: 'N3',
                                    label: 'N',
                                    children: [],
                                },
                                {
                                    id: 'P3',
                                    label: 'P',
                                    children: [],
                                },
                                {
                                    id: 'Q3',
                                    label: 'Q',
                                    children: [],
                                },
                                {
                                    id: 'R3',
                                    label: 'R',
                                    children: [],
                                },
                                {
                                    id: 'S3',
                                    label: 'S',
                                    children: [],
                                },
                                {
                                    id: 'T3',
                                    label: 'T',
                                    children: [],
                                },
                                {
                                    id: 'W3',
                                    label: 'W',
                                    children: [],
                                },
                                {
                                    id: 'X3',
                                    label: 'X',
                                    children: [],
                                },
                                {
                                    id: 'Y3',
                                    label: 'Y',
                                    children: [],
                                },
                                {
                                    id: 'Z3',
                                    label: 'Z',
                                    children: [],
                                },
                            ],
                        },
                        
                    ]
                }, 
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            nodes: [],
            links: [],
            partNodes: [],
            partLinks: [],
            seleted_node: {},
            seleted_link: {},
            click_node: {},
            field: ''
        }
    },
    mounted: function() {
        let field = this.$route.query.field;
        if (!field) {
            field = 'Nursing'
        } 
        this.field = field;
        this.$emit('passField', this.field);
        this.getChartData(field);
    },
    methods: {
        getChartData: function(field){
            this.$api.network.getFieldNetwork(field)
            .then(res => {
                let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                this.nodes = res.data.nodes;
                this.links = res.data.links;
                let nodeTypes = [];
                if (field === 'Nursing') {
                    let outcomeNodes = {A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[],K:[],L:[],M:[],N:[],O:[],P:[],Q:[],R:[],S:[],T:[],U:[],V:[],W:[],X:[],Y:[],Z:[]};
                    let InterventionNodes = {A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[],K:[],L:[],M:[],N:[],O:[],P:[],Q:[],R:[],S:[],T:[],U:[],V:[],W:[],X:[],Y:[],Z:[]};
                    let Diagnosis = {A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[],K:[],L:[],M:[],N:[],O:[],P:[],Q:[],R:[],S:[],T:[],U:[],V:[],W:[],X:[],Y:[],Z:[]};
                    nodeTypes = ['Intervention', 'Outcome']
                    for(let node of this.nodes){
                        const char = node.name.trim()[0];
                        char = char.toUpperCase();
                        if(node.label === 'Intervention'){
                            node.type = node.label;
                            if(!InterventionNodes[char]){
                                break;
                            }
                            InterventionNodes[char].push({label:node.name});
                        }else if(node.label === 'Outcome') {
                            node.type = node.label;
                            if(!outcomeNodes[char]){
                                break;
                            }
                            outcomeNodes[char].push({label:node.name});
                        }
                    }
                    let temDiagnosis = [];
                    for(let link of this.links) {
                        link.value = link.diagnosis;
                        if(!temDiagnosis.includes(link.diagnosis)){
                            temDiagnosis.push(link.diagnosis);
                        }
                    }
                    for(let diagnosis of temDiagnosis){
                        const char = diagnosis.trim()[0];
                        char = char.toUpperCase();
                        Diagnosis[char].push({label: diagnosis});
                    }
                    for(let key in InterventionNodes){
                        InterventionNodes[key] = InterventionNodes[key].sort(function(a,b){return a['label'].localeCompare(b['label'])}); // in alphabetical order
                        this.$refs.tree.updateKeyChildren(key+'2', InterventionNodes[key]);
                    }
                    for(let key in outcomeNodes){
                        outcomeNodes[key] = outcomeNodes[key].sort(function(a,b){return a['label'].localeCompare(b['label'])});
                        this.$refs.tree.updateKeyChildren(key+'3', outcomeNodes[key]);
                    }
                    for(let key in Diagnosis){
                        Diagnosis[key] = Diagnosis[key].sort(function(a,b){return a['label'].localeCompare(b['label'])});
                        this.$refs.tree.updateKeyChildren(key+'4', Diagnosis[key]);
                    }
                } else {
                    this.data = [
                        {
                          id: 1,
                          label: field,
                          children:  []
                        }
                    ]
                    for(let node of this.nodes) {
                        if(!nodeTypes.includes(node.label)){
                            nodeTypes.push(node.label);
                        }
                    }
                    for(let link of this.links) {
                        link.type = link.label;
                        link.value = link.type;
                    }
                    for(let type of nodeTypes) {
                        let index = 2;
                        let temp = []
                        for(let i = 0; i <26; i++){
                            temp.push({
                                id: alphabet[i] + String(index),
                                label: alphabet[i],
                                children: [],
                            })
                        }
                        this.data[0].children.push(
                            {
                                id: String(index),
                                label: type,
                                children: temp,
                            }
                        )
                    }
                    // update nodeTree in the left side 
                    let nodeTree = {};
                    for(let type of nodeTypes) {
                        nodeTree[type] = {A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[],K:[],L:[],M:[],N:[],O:[],P:[],Q:[],R:[],S:[],T:[],U:[],V:[],W:[],X:[],Y:[],Z:[]}
                    }
                    for(let node of this.nodes){
                        const char = node.name.trim()[0];
                        char = char.toUpperCase();
                        for(let type of nodeTypes) {
                            if(node.label === type) {
                                nodeTree[type][char].push({label:node.name});
                            }
                        }
                    }
                    for(let type of nodeTypes) {
                        let index = 2;
                        for(let key in nodeTree[type]) {
                            nodeTree[type][key] = nodeTree[type][key].sort(function(a,b){return a['label'].localeCompare(b['label'])});
                        }
                        for(let i = 0; i <26; i++) {
                            this.data[0].children[nodeTypes.indexOf(type)].children[i].children = nodeTree[type][alphabet[i]]
                        }
                        index += 1;
                    }
                }
                let myChart = this.$echarts.init(document.getElementById('main'));
                var categories = [];
                var types = nodeTypes;
                for (var i = 0; i < types.length; i++) {
                    categories[i] = {
                        name: types[i],
                    };
                }
                this.nodes.forEach(function (node) {
                    node.itemStyle = null;
                    node.symbolSize = Math.random()*40 + 1;
                    node.type = node.label;
                    node.label = {
                        normal: {
                            show: false
                        }
                    };
                    node.category = types.findIndex((element) => element === node.type);
                    
                });
                // Because the number of nodes is large, we select part of the nodes to show
                if (this.links.length > 50) {
                    this.partLinks = this.links.slice(0, 50);
                    let ids = [];
                    for(let item of this.partLinks){
                        if(!ids.find(element => element === item.source)){
                            ids.push(item.source);
                        }
                        if(!ids.find(element => element === item.target)){
                            ids.push(item.target);
                        }
                    }
                    this.partNodes = this.nodes.filter(element =>  ids.indexOf(element.id) !== -1);
                } else {
                    this.partLinks = this.links;
                    this.partNodes = this.nodes;
                }
                const option = {
                    title: {
                        top: 'bottom',
                        left: 'right'
                    },
                    legend: [{
                        data: categories.map(function (a) {
                            return a.name;
                        })
                    }],
                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series : [
                        {
                            type: 'graph',
                            layout: 'circular',
                            circular: {
                                rotateLabel: true
                            },
                            data: this.partNodes,
                            links: this.partLinks,
                            categories: categories,
                            roam: false,
                            lineStyle: {
                                normal: {
                                    color: 'source',
                                    curveness: 0.3
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);
                const that = this;
                myChart.on('click', function (params) {
                    if (params.componentType === 'markPoint') {
                        if (params.seriesIndex === 5) {
                        }
                    }
                    else if (params.componentType === 'series') {
                        if (params.seriesType === 'graph') {
                            if (params.dataType === 'edge') {
                                const data = params.data
                                const links = that.links.filter( link => { return link.source === data.source && link.target === data.target });
                                that.click_node = links[0];
                                const nodes = that.nodes.filter( node => { return node.id === data.source || node.id === data.target });
                                const option = {
                                    series : [
                                        {         
                                            data: nodes,
                                            links: links,
                                        }
                                    ]
                                };
                                myChart.setOption(option);
                            }
                            else {
                                const id = params.data.id;
                                const links = that.links.filter( link => { return link.source === id || link.target === id });
                                that.click_node = that.nodes.filter( node => { return node.id === id })[0];
                                let seleted_node = new Set();
                                for(let link in links) {
                                    seleted_node.add(links[link].source);
                                    seleted_node.add(links[link].target); 
                                }
                                const nodes = that.nodes.filter( node => { return seleted_node.has(node.id) });
                                const option = {
                                    series : [
                                        {         
                                            data: nodes,
                                            links: links,
                                        }
                                    ]
                                };
                                myChart.setOption(option);
                            }
                        }
                    }
                });
            })
        },
        resetData: function(){
            // let myChart = this.$echarts.init(document.getElementById('main'));
            // const option = {
            //     series : [
            //         {         
            //             data: this.partNodes,
            //             links: this.partLinks,
            //         }
            //     ]
            // };
            // myChart.setOption(option);
            this.setChartData(this.partNodes, this.partLinks)
            this.click_node = {};
        },
        handleNodeClick: function(data) {
            const label = data.label;
            // let myChart = this.$echarts.init(document.getElementById('main'));
            let diagnosis = [];
            for(let link of this.links) {
                if(!diagnosis.includes(link.diagnosis)) {
                    diagnosis.push(link.diagnosis);
                }
            }
            if(diagnosis.includes(label)) {
                const links = this.links.filter( link => { return link.diagnosis === label });
                let node_id = [];
                for(let link of links) {
                    if(!node_id.includes(link.source)) {
                        node_id.push(link.source);
                    }
                    if(!node_id.includes(link.target)) {
                        node_id.push(link.target);
                    }
                }
                const nodes = this.nodes.filter( node => { return node_id.includes(node.id) });
                this.click_node = links[0];
                // const option = {
                //     series : [
                //         {         
                //             data: nodes,
                //             links: links,
                //         }
                //     ]
                // };
                // myChart.setOption(option);
                this.setChartData(nodes, links);
            }else {
                if(!this.nodes.find(item => item.name === label)) {
                    return;
                }
                const id = this.nodes.find(item => item.name === label).id;               
                const links = this.links.filter( link => { return link.source === id || link.target === id });
                this.click_node = this.nodes.filter( node => { return node.id === id })[0];
                let seleted_node = new Set();
                for(let link in links) {
                    seleted_node.add(links[link].source);
                    seleted_node.add(links[link].target); 
                }
                const nodes = this.nodes.filter( node => { return seleted_node.has(node.id) })
                // const option = {
                //     series : [
                //         {         
                //             data: nodes,
                //             links: links,
                //         }
                //     ]
                // };
                // myChart.setOption(option);
                this.setChartData(nodes, links);
            }
            
        },
        renderContent(h, { node, data, store }) {
            return (
            <span class="custom-tree-node">
                <span>{node.label}</span>
            </span>);
        },
        setChartData(nodes, links) {
            let myChart = this.$echarts.init(document.getElementById('main'));
            const option = {
                series : [
                    {         
                        data: nodes,
                        links: links,
                    }
                ]
            };
            myChart.setOption(option);
        }
    },
    watch: {
        keyword(val, oldVal){
            if(val !== ''){
                this.handleNodeClick({label: val});
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.chart {
    position: absolute;
    top: 100px;
    height: 680px;
    width: 800px;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 60px;
}
.title {
  top: 20px;
  text-align: center;
  font-size: 30px;
  width: 800px;
}
.lead {
  margin-top: 50px;
  font-size: 22px;
}
.card {
    left: 80px;
}
.box-card {
    margin-left: 120px;
    width: 480px;
    height: 100%;
}
// .el-tree>.el-tree-node{display:inline-block;}
// .el-tree {
//     min-width: 100%;
//     display:inline-block;
// }
.el-tree {
    min-width: 100%;
    display: inline-block !important;
}
.el-scrollbar {
    height: 100%;
}

</style>

