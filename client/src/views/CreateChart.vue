<template>
    <div class="home">
        <div class="container">
            <el-row :gutter="20" class="row">               
                <el-col :span='12' class="col1">  
                    <span v-bind:style="{cursor:'pointer'}"> 
                        <i  @click="undo" id="undo" class="icon el-icon-refresh-left" >undo</i>
                        <i  @click="redo" id="redo" class="icon el-icon-refresh-right" >redo</i>
                    </span>
                    <!-- <span  v-bind:style="{cursor:'pointer' }"> </span> -->
                    <!-- <el-button id="undo" icon="custom-icon el-icon-refresh-left" @click="undo">undo</el-button> -->
                    <div id="main" class="chart"></div> 
                </el-col>
                <el-col :span='12' class="col2">
                    &#12288;&#12288;&#12288;&#12288;
                    <!-- <router-link to="/add"><i class="el-icon-plus"></i></router-link> &#12288; |  &#12288;
                    <router-link to="/search"><i class="el-icon-search"></i></router-link> -->
                    <!-- <div class="add_search" >
                        <router-view :showinfo="showinfo" :updateLable="updateLable" v-on:update="receive" v-on:search="searchData" ref="add" @finish-adding='setShowinfo'></router-view>
                    </div> -->
                    <div class="rightArea">
                        <el-button type="text" @click="dialogFormVisible = true" class="button">Add Model</el-button>
                        <el-button type="text" @click="dialogRelationVisible = true" class="button">Add Relation</el-button>
                        <el-dialog title="Add Model" :visible.sync="dialogFormVisible"  width="30%" top="25vh" :before-close="handleFormClose">
                                    <div class="dialog">Model Name</div> 
                                    <el-input class="dialog" v-model="type"></el-input> 
                                    <div class="dialog">Property</div> 
                                    <div class="dialog" v-for='i in property' :key="i.key+`property`">
                                        <el-input v-model="i.name"></el-input> 
                                    </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button  @click="addProperty">Add Property</el-button>
                            <el-button @click="formCancel">Cancel</el-button>
                            <el-button type="primary" @click="addConcept">OK</el-button>
                        </div>
                        </el-dialog>
                        <el-table
                            :data="conceptTabelData"
                            style="width: 600px;fontSize: 15px;">
                            <el-table-column
                                prop="number"
                                label="ID"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="concept"
                                label="Model"
                                width="180">
                            </el-table-column>
                            <el-table-column
                            label="Operation"
                            width="240">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    @click="addEntity(scope.$index, scope.row)" type='primary' icon="el-icon-plus">Add Instance</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="paginations.page_index"
                            :page-sizes="paginations.page_sizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total">
                        </el-pagination>
                        </div>
                        <el-button type="text" class="button" @click="dialogQueryVisible = true" v-if="queryLabel === false">Query</el-button> &#12288;
                        <el-button type="text" class="button" @click="quitQuery" v-if="queryLabel === true">Exit Query</el-button>
                        <el-button type="text" class="button" @click="dialogNetworkVisible = true">Save</el-button>
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            action="http://localhost:8080/api/networks/v1/file"
                            :on-success="uploadSuccess"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :before-upload="beforeUpload"
                            :auto-upload=false>
                            <el-button slot="trigger" size="small" type="primary" class="button" icon="el-icon-folder-opened">Select File</el-button>
                            <el-button style="margin-left: 10px; fontSize: 16px;" size="small" type="success" @click="submitUpload" icon="el-icon-upload">Upload</el-button>
                        </el-upload>
                        <el-dialog title="Add Instance" :visible.sync="dialogEntityVisible"  width="30%" top="25vh" :before-close="handleClose">
                                <!-- <el-form :model="form"> -->
                                    <!-- <el-form-item label="概念名称" :label-width="formLabelWidth"> -->
                                        <div class="dialog">Instance Tpye: {{entity.label}}</div> 
                                        <!-- <el-input class="dialog" v-model="type"></el-input>  -->
                                        <div class="dialog" v-for='i in entityProperty' :key="i.key+`property`">
                                            {{i.name}} <el-input v-model="i.value" class="dialog"></el-input> 
                                        </div>
                                    <!-- </el-form-item> -->
                                <!-- </el-form> -->
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogEntityVisible = false;entityProperty = [];">Cancel</el-button>
                                <el-button type="primary" @click="addNode">OK</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="Add Relation" :visible.sync="dialogRelationVisible"  width="30%" top="25vh" :before-close="handleRelationClose">
                            <div class="dialog">Relation Name</div> 
                            <el-input class="dialog" v-model="relationType"></el-input> 
                            <div class="dialog">Node1 Name</div> 
                            <el-input class="dialog" v-model="sourceNodeName"></el-input> 
                            <div class="dialog">Node2 Name</div> 
                            <el-input class="dialog" v-model="targetNodeName"></el-input> 
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="RelationCancel">Cancel</el-button>
                                <el-button type="primary" @click="addRelation">Save</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="Confirm Field" :visible.sync="dialogNetworkVisible"  width="30%" top="25vh" >
                            <div class="dialog">Field Name</div>  
                            <el-input class="dialog" v-model="field"></el-input> 
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogNetworkVisible = false">Cancel</el-button>
                                <el-button type="primary" @click="addNetwork">OK</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="Update Element" :visible.sync="dialogUpdateVisible"  width="30%" top="25vh" :before-close="handleUpdateClose"  >
                            <div v-if="showinfo !== null">
                                <!-- <div class="dialog">label:{{showinfo.label}}</div> -->
                                <!-- <el-input class="dialog" v-model="showinfo.label"></el-input> -->
                                <div class="dialog" v-for='i in showinfoDetail' :key="i.name+`showinfo`">
                                    <div v-if=" i.name !== 'field'&& i.name !== 'id'&& i.name !== 'type'">
                                        <span class="dialog">{{i.name}}</span>  <el-input v-model="i.value" class="dialog" :disabled="i.name === 'label'"></el-input>
                                    </div>
                                </div> 
                            </div>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="updateCancel">Cancel</el-button>
                                <el-button type="primary" @click="updateElement">Update</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="Query Element" :visible.sync="dialogQueryVisible"  width="30%" top="25vh" :before-close="handleQueryClose"  >
                            <div>
                                <el-row :gutter="20">
                                    <el-col :span='8'>
                                        <el-input v-model="querySourceLabel" class="query" placeholder="source_label"></el-input>
                                        <span class="n1_pro" v-for='i in sourceNodeProperty' :key="i.key+`node1`">
                                            <div ><el-input class="n1_pro" v-model="i.name" placeholder="name" ></el-input> : <el-input class="n1_pro" v-model="i.value" placeholder="value" ></el-input>  &#12288;</div>
                                        </span>
                                    </el-col>
                                    <el-col :span='8'>
                                        <el-input v-model="queryRelationLabel" class="query" placeholder="relation_label"></el-input>
                                    </el-col>
                                    <el-col :span='8'>
                                        <el-input v-model="queryTargetLabel" class="query" placeholder="target_label"></el-input>
                                        <span class="n1_pro" v-for='i in targetNodeProperty' :key="i.key+`node1`">
                                            <div><el-input class="n1_pro" v-model="i.name" placeholder="name"></el-input> : <el-input class="n1_pro" v-model="i.value" placeholder="value"></el-input>  &#12288;</div>
                                        </span>
                                    </el-col>
                                </el-row>
                            </div>
                            <div slot="footer" class="dialog-footer">
                                <el-button class="add_btn" @click="addQueryProperty">Add Property</el-button>
                                <el-button @click="handleQueryClose">Cancel</el-button>
                                <el-button type="primary" @click="query">Query Element</el-button>
                            </div>
                        </el-dialog>
                    </div> 
                    
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <transition name="slide-fade">
                        <div class="showinfo"><span v-for=" (val, key) in showinfo" :key="key"> &#12288;<span v-bind:style="{ fontWeight:'bold' }">{{key}}:</span>{{val}} </span> <span class="btn" v-if="showinfo !== null"> <el-button class="update" @click="dialogUpdateVisible = true" icon="el-icon-edit">Update</el-button><el-button class="delete" @click="delete_element(showinfo)" icon="el-icon-delete">Delete</el-button></span></div>
                    </transition>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    name: 'create_chart',
    data() {
        return {
            showinfo: null,
            showinfoDetail: [], // transmit showinfo to Child components namely Add.vue
            updateLable: false, // transmit updateLable to Child components namely Add.vue 
            dialogFormVisible: false,
            dialogEntityVisible: false,
            dialogRelationVisible: false,
            dialogNetworkVisible: false,
            dialogUpdateVisible: false,
            dialogQueryVisible: false,
            isEdit: false,
            type: '', // 概念类别
            relationType: '',
            sourceNodeName: '',
            targetNodeName: '',
            concepts: [],
            property: [
                {
                    name: "name",
                    value: '',
                    key: 1,
                }
            ],
            field:'',
            entityProperty: [], 
            conceptNum: 1,
            iter_num: 1,
            entity: {}, // 
            nodeId: 0,
            linkId: 0,
            conceptTabelData: [],
            allTableData: [],
            filterTableData: [],
            paginations: {
                page_index: 1, // 当前位于哪一页
                total: 0, // 总数
                page_size: 5, // 一页显示多少条
                page_sizes: [5,10], // 每页显示多少条
                layout: 'total,sizes,prev,pager,next,jumper' //翻页属性
            },
            nodes: [],
            links: [],
            querySourceLabel: '',
            queryRelationLabel: '',
            queryTargetLabel: '',
            sourceNodeProperty: [],
            // relationProperty: [], 
            targetNodeProperty: [],
            queryNum: 1,
            queryLabel: false, // 判断当前的数据是否是查询结果
            queryNodes: [],
            queryLinks: [],
            fileList: [],
            graphHistory: [{nodes: [], links: []}], // graph快照
            graphQueryHistory: [], // 查询模式graph快照
            currentIndex: 0, // graph快照索引
            currentQueryIndex: -1, // // 查询模式下的graph快照索引
        }
    },
    mounted: function(){
        const field = this.$route.query.field;
        const relationData = this.$route.params.RelationData; // 因果关系提取页面传递的数据
        this.$emit('finish-adding', '') // set showinfo to be null
        if(field){
            this.isEdit = true;
            this.$http.get(`/api/networks/${field}`)
            .then(res => {
                const newChart = res.data;
                this.field = field;
                console.log('edit:', newChart);
                let min = 0;
                newChart.nodes.forEach(element => {
                    if(Number(element.id) > min) {
                        min = Number(element.id);
                    }
                });
                this.nodeId = min + 1;
                min = 0;
                newChart.links.forEach(element => {
                    if(Number(element.id) > min) {
                        min = Number(element.id);
                    }
                });
                this.linkId = min + 1;
                this.nodes = newChart.nodes;
                this.links = newChart.links;
                const record = {nodes: this.nodes, links: this.links};
                this.putRecord(this.graphHistory, record, false)
                // add concept
                for (let node of this.nodes) {
                    let concept = {};
                    if(!this.conceptTabelData.find(item => item.concept === node.label)) {
                        concept.type = node.label;
                        let propertyName = [];
                        for(let property in node) {
                            if(property !== 'draggable' && property !== 'field' && property !== 'id' && property !== 'category' && property !== 'type' && property !== 'label') {
                                propertyName.push(property);
                            }
                        }
                        concept.property = propertyName;
                        this.concepts.push(concept);
                        this.conceptTabelData.push({
                            number: this.conceptNum,
                            concept: concept.type,
                        }) 
                        this.conceptNum += 1;
                        this.allTableData = this.conceptTabelData;
                        this.filterTableData = this.conceptTabelData;
                        this.setPaginations();
                    }
                }
                // this.$store.dispatch('setNewChart', newChart);
                // this.$store.dispatch('setField', field);
            })
        }
        this.getChartData();
        // 
        if(relationData) {
            let node = [];
            for(let relation of relationData) {
                let sourceId = null;
                let targetId = null;
                if(!node.includes(relation.keyword1)){
                    node.push(relation.keyword1);
                    this.nodes.push({
                        name: relation.keyword1,
                        id: String(this.nodeId),
                        label: 'causality',
                        type: 'causality',
                    })
                    sourceId = String(this.nodeId);
                    this.nodeId += 1;
                } else {
                    sourceId = this.nodes.find(element => element.name === relation.keyword1).id;
                }
                if(!node.includes(relation.keyword2)){
                    node.push(relation.keyword2);
                    this.nodes.push({
                        name: relation.keyword2,
                        id: String(this.nodeId),
                        label: 'causality',
                        type: 'causality',
                    })
                    targetId = String(this.nodeId);
                    this.nodeId += 1;
                } else  {
                    targetId = this.nodes.find(element => element.name === relation.keyword2).id;
                }
                let relationType = null;
                if (relation.relation === 1) {
                    relationType = 'casues';
                } else if (relation.relation === 2) {
                    relationType = 'is_caused_by';
                } else if (relation.relation === 3) {
                    relationType = 'is_related_with';
                } else if (relation.relation === 0) {
                    continue;
                }
                this.links.push({
                    source: sourceId,
                    target: targetId,
                    id: String(this.linkId),
                    label: relationType,
                })
                this.linkId += 1;
            }
        }
    },
    // computed: {
    //     currentIndex(){
    //         return this.$store.getters.newChart.nodes
    //     },
    //     links(){
    //         return this.$store.getters.newChart.links
    //     },
    // },
    beforeRouteLeave(to, form, next) {
        this.$store.dispatch('setNewChart', {nodes:[], links: []});
        next()
    },
    methods: {
        getChartData: function(){
            let myChart = this.$echarts.init(document.getElementById('main'));
            const option = {
                title: {
                    // text: 'Les Miserables',
                    // subtext: 'Default layout',
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                legend: [{
                    // selectedMode: 'single',
                    data: []
                }],
                animation: false,
                series : [
                    {
                        // name: 'Les Miserables',
                        type: 'graph',
                        layout: 'force',
                        data: [],
                        links: [],
                        // categories: categories,
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 16
                                },
                            }
                        },
                        force: {
                            repulsion: 1000
                        },
                        edgeSymbol:'arrow',
                        edgeSymbolSize: [0, 8],
                        edgeLabel: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 15
                                },
                                formatter: "{c}"
                            }
                        },
                        roam: true,
                        symbolSize: 45,
                        focusNodeAdjacency: true,
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 1,
                                curveness: 0
                            }
                        },
                        cursor: 'pointer'
                    }
                ]
            };
            myChart.setOption(option);
            const that = this;
            myChart.on('click', function (params) {
                if (params.componentType === 'markPoint') {
                    // 点击到了 markPoint 上
                    if (params.seriesIndex === 5) {
                        // 点击到了 index 为 5 的 series 的 markPoint 上。
                    }
                }
                else if (params.componentType === 'series') {
                    if (params.seriesType === 'graph') {
                        that.showinfoDetail = [];
                        if (params.dataType === 'edge') {
                            that.showinfo = {};
                            if(params.data.field) {
                                that.showinfo.field = params.data.field;
                            }
                            that.showinfo.label = params.data.label;
                            that.showinfo.id = params.data.id;
                            for(let name in params.data) {
                                if(name !== 'field' && name !== 'label' && name !== 'id') {
                                    that.showinfo[name] = params.data[name]
                                }
                            }
                            that.showinfo.type = 'link';
                            delete that.showinfo.emphasis;
                            delete that.showinfo.value;
                            delete that.showinfo.source;
                            delete that.showinfo.target;
                        }
                        else {
                            that.showinfo = {};
                            if(params.data.field) {
                                that.showinfo.field = params.data.field;
                            }
                            that.showinfo.label = params.data.label;
                            that.showinfo.id = params.data.id;
                            for(let name in params.data) {
                                if(name !== 'field' && name !== 'label' && name !== 'id') {
                                    that.showinfo[name] = params.data[name]
                                }
                            }
                            that.showinfo.type = 'node';
                            delete that.showinfo.emphasis;
                            delete that.showinfo.category;
                            delete that.showinfo.draggable;
                            
                        }
                        let temp = [];
                        for(let key in that.showinfo) {
                            temp.push({
                                name: key,
                                value: that.showinfo[key]
                            })
                        }
                        that.showinfoDetail = temp;
                    }
                }
            });
        },
        delete_element: function(showinfo){
            if(showinfo.type === 'node'){
                this.nodes = this.nodes.filter(node => {
                    return node.id !== showinfo.id;
                });
                this.links = this.links.filter(link => {
                    return link.source !== showinfo.id && link.target !== showinfo.id;
                });
                if (this.queryLabel === true) {
                    this.queryNodes = this.queryNodes.filter(node => {
                        return node.id !== showinfo.id;
                    });
                    this.queryLinks = this.queryLinks.filter(link => {
                        return link.source !== showinfo.id && link.target !== showinfo.id;
                    });
                    const record = {nodes: this.queryNodes, links: this.queryLinks};
                    this.putRecord(this.graphQueryHistory, record, true)
                } else {
                    const record = {nodes: this.nodes, links: this.links};
                    this.putRecord(this.graphHistory, record, false)
                }
                // this.$store.dispatch('deleteNode', showinfo);
                this.showinfo = null;
            }else{
                // this.$store.dispatch('deleteLink', showinfo);
                this.links = this.links.filter(link => {
                    return link.id !== showinfo.id;
                });
                if (this.queryLabel === true) {
                    this.queryLinks = this.queryLinks.filter(link => {
                        return link.source !== showinfo.id && link.target !== showinfo.id;
                    });
                    const record = {nodes: this.queryNodes, links: this.queryLinks};
                    this.putRecord(this.graphQueryHistory, record, true)
                } else {
                    const record = {nodes: this.nodes, links: this.links};
                    this.putRecord(this.graphHistory, record, false)
                }
                this.showinfo = null;
            }
        },
        receive: function(elements, showinfo){
            if(showinfo.type === 'node'){
                this.showinfo = showinfo;
                this.updateLable = false; 
            }else {
                this.showinfo = showinfo;
                this.updateLable = false;
            }
            let myChart = this.$echarts.init(document.getElementById('main'));
            const chartData = this.$store.getters.newChart;
            const option = {
                series : [
                    {
                        data: chartData.nodes,
                        links: chartData.links,
                    }
                ]
            };
            myChart.setOption(option);
        },
        searchData: function(data){
            if(this.showinfo !== null){
                this.showinfo = null;
            }
            if(data === '') {
                data = this.$store.getters.newChart;
            }
            let myChart = this.$echarts.init(document.getElementById('main'));
            var types = [];
            var categories = [];
            data.nodes.map(node => {
                if(!types.includes(node.label)){
                    types.push(node.label);
                }
            })
            for (var i = 0; i < types.length; i++) {
                categories[i] = {
                    name: types[i],
                };
            }
            data.nodes.forEach(function (node) {
                // node.itemStyle = null;
                // node.symbolSize = Math.random()*40 + 1;
                // node.label = {
                //     normal: {
                //         // show: node.name.length > 10
                //         show: false
                //     }
                // };
                node.draggable = true,
                node.category = types.findIndex((element) => element === node.label);
            });
            const option = {
                legend: [{
                    // selectedMode: 'single',
                    data: categories.map(function (a) {
                        return a.name;
                    })
                }],
                series : [
                    {
                        categories: categories,
                        data: data.nodes,
                        links: data.links,
                    }
                ]
            };
            myChart.setOption(option);
        },
        setShowinfo: function(data) {
            this.showinfo = null;
        },
        addProperty: function() {
            this.iter_num += 1;
            this.property.push({
                name: "",
                key: this.iter_num,
            });
        },
        addConcept: function() {
            let concept = {};
            concept.type = this.type;
            if (concept.type === '') {
                this.$message.error('Model name cannot be empty！！！');
                return;
            }
            if(this.concepts.find(item => item === this.type)) {
                this.$message.error('Model name is duplicate！！！');
                return;
            }
            let propertyName = [];
            for(let property of this.property) {
                if (property.name === '') {
                    this.$message.error('Property name cannot be empty！！！');
                }
                propertyName.push(property.name);
            }
            this.dialogFormVisible = false;
            concept.property = propertyName;
            this.concepts.push(concept);
            this.allTableData.push({
                number: this.conceptNum,
                concept: this.type,
            }) 
            this.conceptNum += 1;
            this.property = [
                {
                    name: "name",
                    value: '',
                    key: 1,
                }
            ],
            this.iter_num = 1;
            this.type = '';
            // this.allTableData = this.conceptTabelData;
            // this.filterTableData = this.conceptTabelData;
            this.setPaginations();
        },
        addEntity:function (index, row) {
            this.dialogEntityVisible = true;
            this.entity.label = row.concept;
            let concept = this.concepts.find(element => element.type === row.concept);
            for(let i = 0; i<concept.property.length; i++) {
                this.entityProperty.push({
                    name: concept.property[i],
                    value: '',
                    key: i+1,
                })
            }
        },
        addNode: function() {
            let node = {
                label: this.entity.label,
                id: String(this.nodeId),
                type: this.entity.label,
            }
            for(let i of this.entityProperty){
                const name = i.name;
                const value = i.value;
                if(value !== ''){
                    node[name] = value;
                } else {
                    this.$message.error('Property name cannot be empty！！！');
                    return;
                }
            }
            for(let item of this.nodes) {
                if(item.name === node.name) {
                    this.$message.error('Node name is duplicate！！！');
                    return;
                }
            }
            this.dialogEntityVisible = false;
            this.entityProperty = [];
            this.nodeId = this.nodeId + 1;
            this.nodes.push(node);
            if (this.queryLabel === true) {
                this.queryNodes.push(node);
                const record = {nodes: this.queryNodes, links: this.queryLinks};
                this.putRecord(this.graphQueryHistory, record, true)
            } else {
                const record = {nodes: this.nodes, links: this.links};
                this.putRecord(this.graphHistory, record, false)
            }
            
        },
        addRelation: function() {
            const source_node = this.nodes.find(element => element.name === this.sourceNodeName);
            const target_node = this.nodes.find(element => element.name === this.targetNodeName);
            if(!source_node){
                this.$message.error('Source node does not exist！！！');
                return;
            }
            if(!target_node){
                this.$message.error('Target node does not exist！！！');
                return;
            }
            if(source_node.name === target_node.name) {
                this.$message.error('The source node and the target node cannot be the same node！！！');
                return;
            }
            if(this.links.find(element => element.source === source_node.id && element.target === target_node.id)) {
                this.$message.error('Relation between nodes already exist！！！');
                return;
            }
            const link = {
                id: String(this.linkId),
                label: this.relationType,
                source: source_node.id,
                target: target_node.id,
            }
            this.links.push(link);
            if (this.queryLabel === true) {
                this.queryLinks.push(link);
                const record = {nodes: this.queryNodes, links: this.queryLinks};
                this.putRecord(this.graphQueryHistory, record, true)
            } else {
                const record = {nodes: this.nodes, links: this.links};
                this.putRecord(this.graphHistory, record, false)
            }
            this.sourceNodeName = '';
            this.relationType = '';
            this.targetNodeName = '';
            this.dialogRelationVisible = false;
            this.linkId += 1; 
        },
        handleClose: function(done) {
            this.entityProperty = [];
            done();
        },
        formCancel: function() {
            this.dialogFormVisible = false;
            this.property = [
                {
                    name: "name",
                    value: '',
                    key: 1,
                }
            ]
        },
        handleFormClose: function(done) {
            this.property = [
                {
                    name: "name",
                    value: '',
                    key: 1,
                }
            ];
            done();
        },
        RelationCancel: function() {
            this.sourceNodeName = '';
            this.relationType = '';
            this.targetNodeName = '';
            this.dialogRelationVisible = false;
        },
        handleRelationClose: function(done) {
            this.sourceNodeName = '';
            this.relationType = '';
            this.targetNodeName = '';
            this.dialogRelationVisible = false;
            done();
        },
        addNetwork: function() {
            this.dialogNetworkVisible = false;
            const isAuthenticated = this.$store.getters.isAuthenticated;
            if(isAuthenticated){
                let nodes = this.nodes;
                let links = this.links;
                let newNodes = {};
                let newLinks = {};
                for(let node of nodes){
                    node.field = this.field;
                    if(node.label in newNodes){
                        const label = node.label;
                        newNodes[label].push(node);
                    }else{
                        const label = node.label;
                        newNodes[label] = [node];
                    }
                    delete node.draggable;
                    delete node.category;
                }
                for(let link of links){
                    link.field = this.field;
                    if(link.label in newLinks){
                        const temp = {};
                        temp.id = link.id;
                        temp.source = link.source;
                        temp.target = link.target;
                        const label = link.label;
                        delete link.source;
                        delete link.target;
                        temp.propery = link;
                        temp.propery.source = temp.source;
                        temp.propery.target = temp.target;
                        newLinks[label].push(temp);
                    }else{
                        const temp = {};
                        temp.id = link.id;
                        temp.source = link.source;
                        temp.target = link.target;
                        const label = link.label;
                        delete link.source;
                        delete link.target;
                        temp.propery = link;
                        temp.propery.source = temp.source;
                        temp.propery.target = temp.target;
                        newLinks[label] = [temp];
                    }
                }

                const data = {
                    user: this.$store.getters.user,
                    field: this.field,
                    nodes: newNodes,
                    links: newLinks,
                    isEdit: this.isEdit,
                }
                console.log('add_network:', data);
                this.$http.post('/api/networks/', data)
                .then(res => {
                    this.$message({
                        message: "网络生成成功",
                        type: "success"
                    })
                    // this.$store.dispatch('setNewChart', {nodes:[], links: []});
                    this.nodes = [];
                    this.links = [];
                    this.isEdit = false;
                    this.field = '';
                    this.concepts = [];
                    this.showinfo = null;
                    this.nodeId = 0;
                    this.linkId = 0;
                    this.conceptTabelData = [];
                    this.$emit('finish-adding', '') // set showinfo to be ''
                    });
                
            }else{
                this.$message({
                    message: '用户未登录！！！',
                    type: 'warning'
                });
                this.$router.push('/login');
            }
        },
        updateElement: function() {
            this.dialogUpdateVisible = false;
            if(this.showinfo){
                if(this.showinfo.type === "node"){    
                    for(let item of this.nodes){
                        if(item.id === this.showinfo.id){
                            let info = {};
                            for(let info of this.showinfoDetail) {
                                item[info.name] = info.value;
                            }
                            for(let name in item){
                                info[name] = item[name];
                            }
                            this.showinfo = info;
                            delete this.showinfo.emphasis;
                            delete this.showinfo.category;
                            delete this.showinfo.draggable;
                            item.type = item.label;
                        }
                    }
                    
                    if(this.queryLabel === true) {
                        for(let item of this.queryNodes){
                            if(item.id === this.showinfo.id){
                                let info = {};
                                for(let info of this.showinfoDetail) {
                                    item[info.name] = info.value;
                                }
                                for(let name in item){
                                    info[name] = item[name];
                                }
                                this.showinfo = info;
                                delete this.showinfo.emphasis;
                                delete this.showinfo.category;
                                delete this.showinfo.draggable;
                            }
                        } 
                        const record = {nodes: this.queryNodes, links: this.queryLinks};
                        this.putRecord(this.graphQueryHistory, record, true)
                    } else {
                        const record = {nodes: this.nodes, links: this.links};
                        this.putRecord(this.graphHistory, record, false)
                    }
                    // this.showinfoDetail = [];                               
                }else{
                    for(let item of this.links){
                        if(item.id === this.showinfo.id){
                            let info = {};
                            for(let info of this.showinfoDetail) {
                                item[info.name] = info.value;
                            }
                            for(let name in item){
                                info[name] = item[name];
                            }
                            this.showinfo = info;
                            delete this.showinfo.emphasis;
                            delete this.showinfo.value;
                            delete this.showinfo.source;
                            delete this.showinfo.target;
                        }
                    }
                    if (this.queryLabel === true) {
                        for(let item of this.queryLinks){
                            if(item.id === this.showinfo.id){
                                let info = {};
                                for(let info of this.showinfoDetail) {
                                    item[info.name] = info.value;
                                }
                                for(let name in item){
                                    info[name] = item[name];
                                }
                                this.showinfo = info;
                                delete this.showinfo.emphasis;
                                delete this.showinfo.value;
                                delete this.showinfo.source;
                                delete this.showinfo.target;
                            }
                        } 
                        const record = {nodes: this.queryNodes, links: this.queryLinks};
                        this.graphQueryHistory.push(record);
                    } else{
                        const record = {nodes: this.nodes, links: this.links};
                        this.graphHistory.push(record);
                    }
                    // this.showinfoDetail = [];
                }
            }
        },
        updateCancel: function() {
            this.dialogUpdateVisible = false;
            // this.showinfoDetail = [];
        },
        handleUpdateClose: function() {
            this.updateCancel();
        },
        // 查询
        addQueryProperty: function() {
            if (this.queryNum < 3) {
                this.queryNum += 1;
                if (this.querySourceLabel !== '') {
                    this.sourceNodeProperty.push({
                        name: "",
                        value: "",
                        key: this.queryNum
                    });
                }
                if (this.queryTargetLabel !== '') {
                    this.targetNodeProperty.push({
                        name: "",
                        value: "",
                        key: this.queryNum
                    });
                }
            }
        },
        handleQueryClose: function() {
            this.dialogQueryVisible = false;
            this.querySourceLabel = '';
            this.queryRelationLabel = '';
            this.queryTargetLabel = '';
            this.sourceNodeProperty = [];
            this.targetNodeProperty = [];
        },
        query: function() {
            
            this.dialogQueryVisible = false;
            const field = this.field;
            if(this.queryRelationLabel !== '' || this.querySourceLabel !== '' || this.queryTargetLabel !== ''){
                this.queryLabel = true;
                const node1Propery = {field: field};
                const node2Propery = {field: field};
                const relationPropery = {field: field};
                for(let item of this.sourceNodeProperty){
                    if(item.name !== '')
                        node1Propery[item.name] = item.value;
                }
                for(let item of this.targetNodeProperty){
                    if(item.name !== '')
                        node2Propery[item.name] = item.value;

                }
                // for(let item of this.relation){
                //     if(item.name !== '')
                //         relationPropery[item.name] = item.value;
                // }
                const data = {
                    label: {
                        node1: this.querySourceLabel,
                        node2: this.queryTargetLabel,
                        relation: this.queryRelationLabel,
                    },
                    propery: {
                        node1: node1Propery,
                        node2: node2Propery,
                        relation: relationPropery,
                    }
                }
                const str = JSON.stringify(data);
                this.$http.get(`/api/networks/v1/query/?data=${str}`)
                .then(res => {
                    const data = {
                        nodes: res.data.data.nodes,
                        links: res.data.data.links,
                    }
                    console.log('searchData:', data); // Javert Babet Joly Valjean
                    this.queryNodes = data.nodes;
                    this.queryLinks = data.links;
                    const record = {nodes: this.queryNodes, links: this.queryLinks};
                    this.putRecord(this.graphQueryHistory, record, true)
                    this.querySourceLabel = '';
                    this.queryTargetLabel = '';
                    this.queryRelationLabel = '';
                })
            }else{
                this.$message.error('The input box cannot be empty！！！');
            }
        },
        quitQuery: function() {
            this.queryLabel = false;
            let myChart = this.$echarts.init(document.getElementById('main'));
            var types = [];
            var categories = [];
            this.nodes.map(node => {
                if(!types.includes(node.label)){
                    types.push(node.label);
                }
            })
            for (var i = 0; i < types.length; i++) {
                categories[i] = {
                    name: types[i],
                };
            }
            this.nodes.forEach(function (node) {
                node.draggable = true,
                node.category = types.findIndex((element) => element === node.label);
            });
            this.links.forEach(function (link) {
                link.value = link.label;
            });;

            const record = {nodes: this.nodes, links: this.links};
            this.putRecord(this.graphHistory, record, false)
            const option = {
                legend: [{
                        // selectedMode: 'single',
                        data: categories.map(function (a) {
                            return a.name;
                        })
                    }],
                series: {
                    type: 'graph',
                    categories: categories,
                    data: this.nodes,
                    links: this.links,
                }
            }
            myChart.setOption(option);
        },
        // upload file
        submitUpload() {
            this.$refs.upload.submit();
        },
        beforeUpload(file) {
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'csv'
            const extension2 = testmsg === 'xlsx'
            // const isLt2M = file.size / 1024 / 1024 < 10
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 csv、xlsx格式!',
                    type: 'warning'
                });
                return false;
            }
            // if(!isLt2M) {
            //     this.$message({
            //         message: '上传文件大小不能超过 10MB!',
            //         type: 'warning'
            //     });
            // }
            // return (extension || extension2) && isLt2M
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        uploadSuccess(response, file, fileList) {
            this.fileList = [];
            if (response.type === 'node' ) {
                const nodes = response.data;
                for( let node of nodes) {
                    node.id = String(this.nodeId);
                    node.type = node.label;
                    this.nodes.push(node);
                    this.nodeId += 1;
                }
                let node = nodes[0];
                let concept = {};
                if(!this.conceptTabelData.find(item => item.concept === node.label)) {
                    concept.type = node.label;
                    let propertyName = [];
                    for(let property in node) {
                        if(property !== 'draggable' && property !== 'field' && property !== 'id' && property !== 'category' && property !== 'type' && property !== 'label') {
                            propertyName.push(property);
                        }
                    }
                    concept.property = propertyName;
                    this.concepts.push(concept);
                    this.allTableData.push({
                        number: this.conceptNum,
                        concept: concept.type,
                    }) 
                    this.conceptNum += 1;
                    this.setPaginations();
                }
            } else {
                const links = response.data;
                const labels = response.label;
                for( let link of links) {
                    const source_node = this.nodes.find(element => element.name === link.sourceName);
                    const target_node = this.nodes.find(element => element.name === link.targetName);
                    if (source_node && target_node) {
                        delete link.sourceName;
                        delete link.targetName;
                        link.id = String(this.linkId);
                        link.source = source_node.id;
                        link.target = target_node.id;
                        this.links.push(link);
                        this.linkId += 1;
                    }
                }
            }
            // this.allTableData = this.conceptTabelData;
            // this.filterTableData = this.conceptTabelData;
            // this.setPaginations();
        },
        // 分页
        setPaginations () {
            this.paginations.total = this.allTableData.length
            this.paginations.page_index = 1
            this.paginations.page_size = 5
            // 设置默认分页数据
            this.conceptTabelData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size
            })
        },
        handleSizeChange (page_size) { // 控制一页显示的数据量
            this.paginations.page_index = 1
            this.paginations.page_size = page_size
            this.conceptTabelData = this.allTableData.filter((item, index) => {
                return index < page_size
            })
        },
        handleCurrentChange (page) { // 分页跳转
            let tables = []
            // 当前页前面有多少数据
            let index = this.paginations.page_size * (page - 1)
            let nums = this.paginations.page_size * page
            for (let i = index; i < nums; i++) {
                if (this.allTableData[i]) {
                tables.push(this.allTableData[i])
                }
            }
            this.conceptTabelData = tables
        },
        // undo
        // putRecord(graphData) {
        //     this.graphHistory.push(graphData);
        // },
        putRecord(history, record, queryModel) {
            if (queryModel) {
                if (this.currentQueryIndex < history.length - 1) {
                    history.splice(this.currentQueryIndex+1, history.length-this.currentQueryIndex-1);
                }
                this.currentQueryIndex += 1;
            } else {
                // console.log(this.currentIndex, this.graphHistory.length - 1)
                if (this.currentIndex < history.length - 1) {
                    history.splice(this.currentIndex+1, history.length-this.currentIndex-1);
                }
                this.currentIndex += 1;
            }
            history.push(this.deepClone(record));
            console.log('history:', history);
        },
        undo() {
            console.log('this.graphHistory:', this.graphHistory)
            if (this.queryLabel === true && this.currentQueryIndex > 0) {
                // this.graphQueryHistory.pop();
                // if (this.graphQueryHistory.length === 0) {
                //     return;
                // }
                this.queryNodes = this.deepClone(this.graphQueryHistory[this.currentQueryIndex-1].nodes);
                this.queryLinks = this.deepClone(this.graphQueryHistory[this.currentQueryIndex-1].links);
                this.currentQueryIndex -= 1;
                // const record = {nodes: this.queryNodes, links: this.queryLinks};
                // this.putRecord(this.graphQueryHistory, record, true)
                this.showinfo = null;
            } else if (this.queryLabel === false && this.currentIndex > 0) {
                // this.graphHistory.pop();
                // if (this.graphHistory.length === 1) {
                //     var element = document.getElementById('undo');
                //     element.style.color = '#dcdde1'
                //     return;
                // }
                this.nodes = this.deepClone(this.graphHistory[this.currentIndex-1].nodes);
                this.links = this.deepClone(this.graphHistory[this.currentIndex-1].links);
                // const record = {nodes: this.nodes, links: this.links};
                // this.putRecord(this.graphHistory, record, false)
                this.currentIndex -= 1;
                this.showinfo = null;
            }
        },
        redo() {
            if (this.queryLabel === true && this.currentQueryIndex < this.graphQueryHistory.length-1) {
                // this.graphQueryHistory.pop();
                // if (this.graphQueryHistory.length === 0) {
                //     return;
                // }
                this.queryNodes = this.deepClone(this.graphQueryHistory[this.currentQueryIndex+1].nodes);
                this.queryLinks = this.deepClone(this.graphQueryHistory[this.currentQueryIndex+1].links);
                this.currentQueryIndex += 1;
                // const record = {nodes: this.queryNodes, links: this.queryLinks};
                // this.putRecord(this.graphQueryHistory, record, true)
                this.showinfo = null;
            } else if (this.queryLabel === false && this.currentIndex < this.graphHistory.length-1) {
                // this.graphHistory.pop();
                // if (this.graphHistory.length === 1) {
                //     var element = document.getElementById('undo');
                //     element.style.color = '#dcdde1'
                //     return;
                // }
                this.nodes = this.deepClone(this.graphHistory[this.currentIndex+1].nodes);
                this.links = this.deepClone(this.graphHistory[this.currentIndex+1].links);
                // const record = {nodes: this.nodes, links: this.links};
                // this.putRecord(this.graphHistory, record, false)
                this.currentIndex += 1;
                this.showinfo = null;
            }
        },
        deepClone (obj) {
            let _tmp = JSON.stringify(obj);//将对象转换为json字符串形式
            let result = JSON.parse(_tmp);//将转换而来的字符串转换为原生js对象
            return result;
        },
    },
    watch: {
        nodes: {
            handler: function(val, oldVal){
                if (this.queryLabel === true) {
                    return;
                }
                let myChart = this.$echarts.init(document.getElementById('main'));
                var types = [];
                var categories = [];
                this.nodes.map(node => {
                    if(!types.includes(node.label)){
                        types.push(node.label);
                    }
                })
                for (var i = 0; i < types.length; i++) {
                    categories[i] = {
                        name: types[i],
                    };
                }
                this.nodes.forEach(function (node) {
                    node.draggable = true,
                    node.category = types.findIndex((element) => element === node.label);
                });
                const option = {
                    legend: [{
                            // selectedMode: 'single',
                            data: categories.map(function (a) {
                                return a.name;
                            })
                        }],
                    series: {
                        type: 'graph',
                        categories: categories,
                        data: this.nodes,
                    }
                }
                myChart.setOption(option);
            },
            deep: true,
        },
        links: {
            handler: function(val, oldVal){
                if (this.queryLabel === true) {
                    return;
                }
                let myChart = this.$echarts.init(document.getElementById('main'));
                this.links.forEach(function (link) {
                    if (link.label === 'causes') {
                        link.value = ''
                    } else {
                        link.value = link.label;
                    }
                    
                    
                })
                const option = {
                    series: {
                        type: 'graph',
                        links: this.links,
                    }
                }
                myChart.setOption(option);
            },
            deep: true,
        },
        queryNodes: {
            handler: function(val, oldVal){
                let myChart = this.$echarts.init(document.getElementById('main'));
                var types = [];
                var categories = [];
                this.queryNodes.map(node => {
                    if(!types.includes(node.label)){
                        types.push(node.label);
                    }
                })
                for (var i = 0; i < types.length; i++) {
                    categories[i] = {
                        name: types[i],
                    };
                }
                this.queryNodes.forEach(function (node) {
                    node.draggable = true,
                    node.category = types.findIndex((element) => element === node.label);
                });
                const option = {
                    legend: [{
                            // selectedMode: 'single',
                            data: categories.map(function (a) {
                                return a.name;
                            })
                        }],
                    series: {
                        type: 'graph',
                        categories: categories,
                        data: this.queryNodes,
                    }
                }
                myChart.setOption(option);
            },
            deep: true,
        },
        queryLinks: {
            handler: function(val, oldVal){
                let myChart = this.$echarts.init(document.getElementById('main'));
                this.queryLinks.forEach(function (link) {
                    link.value = link.label;
                    
                });
                const option = {
                    series: {
                        type: 'graph',
                        links: this.queryLinks,
                    }
                }
                myChart.setOption(option);
            },
            deep: true,
        },
        currentIndex: function(val, oldVal){
            if (val === 0) {
                let element = document.getElementById('undo');
                element.style.color = '#dcdde1';
                this.isEdit = false;
                this.field = '';
            } else {
                let element = document.getElementById('undo');
                element.style.color = 'black';
            }
            if (this.graphHistory.length - val > 1) {
                let element = document.getElementById('redo');
                element.style.color = 'black';
            } else {
                let element = document.getElementById('redo');
                element.style.color = '#dcdde1';
            }
        },
        currentQueryIndex: function(val, oldVal){
            if (val === 0) {
                let element = document.getElementById('undo');
                element.style.color = '#dcdde1';
            } else {
                let element = document.getElementById('undo');
                element.style.color = 'black';
            }
        },
        querySourceLabel: function(val, oldVal){
            if(val !== '' && oldVal === ''){
                this.sourceNodeProperty.push({
                    name: "",
                    value: "",
                });
            }
            if(val === ''){
                this.sourceNodeProperty = [];
            }
        },
        queryTargetLabel: function (val, oldVal) {
            if (val !== '' && oldVal === '') {
                this.targetNodeProperty.push({
                    name: "",
                    value: "",
                });
            }
            if(val === ''){
                this.targetNodeProperty = [];
            }
        },
    }
}
</script>
<style  scoped>
.row {
    top: 50px;
}
.custom-icon {
    font-size: 2rem;
}
.add_search {
    margin-top: 80px;
    padding-left: 10%;
}
.chart {
    /* position: absolute; */
    margin-left: 144px;
    height: 680px;
    width: 800px;
    border: 2px solid #a6282f;
    border-bottom: 1px solid rgb(220, 223, 230);
}
.rightArea {
    margin-left: 100px;
}
.dialog {
    margin-top: 10px;
}
.query.el-input{
    width: 150px;
    margin-top: 10px;
}
.n1_pro.el-input {
    width: 70px;
    margin-top: 10px;
}
.update {
    text-align: right;
}
.button {
    font-size: 16px;
}
.btn {
    display: inline-block;
    text-align: right;
}
.showinfo {
    margin-top: 50px;
    margin-left: 144px;
    padding-top: 1px;
    /* padding-left: 1px; */
    width: 800px;
    height: 40px;
    border: 2px solid #a6282f;
    border-top: 0px;
}
.el-icon-plus {
    margin-left: 30%;
    margin-top: 30px;
    color: #a6282f;
}
.el-icon-search {
    color: #a6282f;
}
.title {
  font-size: 30px;
}
.lead {
  margin-top: 50px;
  font-size: 22px;
}
.el-icon-refresh-left{
    color: #dcdde1;
    margin-left: 830px;
}
.el-icon-refresh-right{
    color: #dcdde1;
    /* margin-left: 890px; */
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s ease;
}
</style>