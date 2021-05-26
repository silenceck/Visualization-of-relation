<template>
    <div class="home">
        <div class="container">
            <el-row :gutter="20" class="row">               
                <el-col :span='12' class="col1">  
                    <span v-bind:style="{cursor:'pointer'}"> 
                        <i  @click="undo" id="undo" class="icon el-icon-refresh-left" >undo</i>
                        <i  style="marginLeft: 40px;" @click="redo" id="redo" class="icon el-icon-refresh-right" >redo</i>
                    </span>
                    <div id="main" class="chart"></div> 
                </el-col>
                <el-col :span='12' class="col2">
                    &#12288;&#12288;&#12288;&#12288;
                    <div class="rightArea">
                        
                        <el-dialog title="Add Model" :visible.sync="dialogFormVisible"  width="30%" top="25vh" :before-close="handleFormClose">
                                    <div class="dialog">Pattern Name</div> 
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
                            style="width: 780px;fontSize: 18px;">
                            <el-table-column
                                prop="number"
                                label="ID"
                                width="240">
                            </el-table-column>
                            <el-table-column
                                prop="concept"
                                label="Pattern"
                                width="240">
                            </el-table-column>
                            <el-table-column
                            label="Operation"
                            width="240">
                                <template slot-scope="scope">
                                    <el-button
                                    size="medium"
                                    @click="addEntity(scope.$index, scope.row)" class="button1" icon="el-icon-plus">Add entity</el-button>
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
                            :total="paginations.total"
                            >
                        </el-pagination>
                        </div>
                        
                        <el-button  class="button" @click="dialogQueryVisible = true" v-if="queryLabel === false" icon="el-icon-search">Query&#12288;</el-button> 
                        <el-button  class="button" @click="quitQuery" v-if="queryLabel === true" icon="el-icon-close">Exit Query</el-button>
                        <el-button  class="button" @click="dialogNetworkVisible = true" icon="el-icon-check">Save</el-button>
                        <el-divider></el-divider>
                        <div>
                            <el-button  @click="dialogFormVisible = true" class="button" icon="el-icon-plus">Add Pattern</el-button>
                            <el-button  @click="dialogRelationVisible = true" class="button" icon="el-icon-plus">Add Relation</el-button>
                            <el-upload
                                class="upload-demo"
                                ref="upload"
                                :action="uploadUrl"
                                :on-success="uploadSuccess"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :file-list="fileList"
                                :before-upload="beforeUpload"
                                :auto-upload=false>
                                <el-button slot="trigger"  class="button" icon="el-icon-folder-opened">Select File</el-button>
                                <el-button style="margin-left: 10px; fontSize: 18px;"   @click="submitUpload" icon="el-icon-upload">Upload</el-button>
                            </el-upload>
                        </div>
                        <el-dialog title="Add Instance" :visible.sync="dialogEntityVisible"  width="30%" top="25vh" :before-close="handleClose">
                                        <div class="dialog">Instance Tpye: {{entity.label}}</div> 
                                        <div class="dialog" v-for='i in entityProperty' :key="i.key+`property`">
                                            {{i.name}} <el-input v-model="i.value" class="dialog"></el-input> 
                                        </div>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogEntityVisible = false;entityProperty = [];">Cancel</el-button>
                                <el-button type="primary" @click="addNode">OK</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="Add Relation" :visible.sync="dialogRelationVisible"  width="30%" top="25vh" :before-close="handleRelationClose">
                            <div class="dialog">Relation Name</div> 
                            <el-input style="width:202px" v-model="relationType"></el-input> 
                            <div class="dialog">Source Name</div> 
                            <!-- <el-input class="dialog" v-model="sourceNodeName"></el-input>  -->
                            <el-autocomplete
                                class="dialog"
                                v-model="sourceNodeName"
                                :fetch-suggestions="querySearchNode"
                                :trigger-on-focus="false"
                                >
                            </el-autocomplete>
                            <div class="dialog">Target Name</div> 
                            <!-- <el-input class="dialog" v-model="targetNodeName"></el-input>  -->
                            <el-autocomplete
                                class="dialog"
                                v-model="targetNodeName"
                                :fetch-suggestions="querySearchNode"
                                :trigger-on-focus="false"
                                >
                            </el-autocomplete>
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
                                <div class="dialog" v-for='i in showinfoDetail' :key="i.name+`showinfo`">
                                    <div v-if=" i.name !== 'field'&& i.name !== 'id'&& i.name !== 'type'">
                                        <span class="dialog">{{i.name}}</span>  <el-input v-model="i.value" class="dialog" ></el-input> 
                                        <!-- :disabled="i.name === 'label' && i.value !== 'undefined'" -->
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
                                    <el-col :span='12'>
                                        <el-autocomplete
                                            class="query"
                                            v-model="querySourceLabel"
                                            :fetch-suggestions="querySearch"
                                            placeholder="source_label"
                                            :trigger-on-focus="false"
                                            >
                                        </el-autocomplete>
                                        <!-- <el-input v-model="querySourceLabel" class="query" placeholder="source_label"></el-input> -->
                                        <span class="n1_pro" v-for='i in sourceNodeProperty' :key="i.key+`node1`">
                                            <div ><el-input class="n1_pro" v-model="i.name" placeholder="name" ></el-input> : <el-input class="n1_pro" v-model="i.value" placeholder="value" ></el-input>  &#12288;</div>
                                        </span>
                                    </el-col>
                                    <!-- <el-col :span='8'>
                                        <el-input v-model="queryRelationLabel" placeholder="relation_label" type="hidden"></el-input>
                                    </el-col> -->
                                    <el-col :span='12'>
                                        <el-autocomplete
                                            class="query"
                                            v-model="queryTargetLabel"
                                            :fetch-suggestions="querySearch"
                                            placeholder="target_label"
                                            :trigger-on-focus="false"
                                            >
                                        </el-autocomplete>
                                        <!-- <el-input v-model="queryTargetLabel" class="query" placeholder="target_label"></el-input> -->
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
                        <div class="showinfo">
                            <el-row>
                                <el-col :span="17">
                                    <el-scrollbar style="width:560px;height:40px" wrapStyle="overflow-x:hidden;">
                                        <span style="width:100px" v-for=" (val, key) in showinfo" :key="key"><span  v-bind:style="{ fontWeight:'bold', lineHeight:'40px' }">{{key}}:{{val}}</span> &#12288; </span> 
                                    </el-scrollbar>
                                </el-col>
                                <el-col :span="7">
                                    <span class="updateAndDelete" v-if="showinfo !== null"> <el-button class="update" @click="dialogUpdateVisible = true" icon="el-icon-edit">Update</el-button><el-button class="delete" @click="delete_element(showinfo)" icon="el-icon-delete">Delete</el-button></span>
                                </el-col>
                            </el-row>
                            
                            
                            
                        </div>
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
            type: '', // Pattern type
            relationType: 'causes',
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
            queryLabel: false, // Determines whether the current mode is  query mode
            queryNodes: [],
            queryLinks: [],
            fileList: [],
            graphHistory: [{nodes: [], links: []}], // graph photo
            graphQueryHistory: [], // query mode graph photo
            currentIndex: 0, // graph photo index
            currentQueryIndex: -1, // // query mode graph photo index
            uploadUrl: 'http://localhost:8080/api/networks/file',
            isDisabled: false,
        }
    },
    mounted: function(){
        const field = this.$route.query.field;
        const relationData = this.$route.params.RelationData; // The causality extracts the data 
        this.$emit('finish-adding', '') // set showinfo to be null
        if(field){
            this.isEdit = true;
            this.$api.network.getFieldNetwork(field)
            .then(res => {
                const newChart = res.data;
                this.field = field;
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
            })
        }
        this.getChartData();
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
                        label: 'undefined',
                        type: 'undefined',
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
                        label: 'undefined',
                        type: 'undefined',
                    })
                    targetId = String(this.nodeId);
                    this.nodeId += 1;
                } else  {
                    targetId = this.nodes.find(element => element.name === relation.keyword2).id;
                }
                if (relation.relation === 1) {
                    this.links.push({
                        source: sourceId,
                        target: targetId,
                        id: String(this.linkId),
                        label: 'casues',
                    })
                } else if (relation.relation === 2) {
                    this.links.push({
                        source: targetId,
                        target: sourceId,
                        id: String(this.linkId),
                        label: 'casues',
                    })
                } 
                this.linkId += 1;
            }
        }
    },
    beforeRouteLeave(to, form, next) {
        this.$store.dispatch('setNewChart', {nodes:[], links: []});
        next()
    },
    methods: {
        getChartData: function(){
            let myChart = this.$echarts.init(document.getElementById('main'));
            const option = {
                title: {
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                legend: [{
                    data: [],
                    textStyle: { 
                        fontSize: 18
                    }

                }],
                animation: false,
                series : [
                    {
                        type: 'graph',
                        layout: 'force',
                        data: [],
                        links: [],
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 18
                                },
                            }
                        },
                        force: {
                            repulsion: 800
                        },
                        edgeSymbol:'arrow',
                        edgeSymbolSize: [0, 8],
                        edgeLabel: {
                            normal: {
                                show: false,
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
                    if (params.seriesIndex === 5) {
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
                this.showinfo = null;
            }else{
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
                this.$api.network.addNetwork(data)
                .then(res => {
                    this.$message({
                        message: "graph created successfully",
                        type: "success"
                    })
                    // this.nodes = [];
                    // this.links = [];
                    // this.isEdit = false;
                    // this.field = '';
                    // this.concepts = [];
                    // this.showinfo = null;
                    // this.nodeId = 0;
                    // this.linkId = 0;
                    // this.conceptTabelData = [];
                    this.$emit('finish-adding', '') // set showinfo to be ''
                    });
                
            }else{
                this.$message({
                    message: 'User not logged in！！！',
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
                            const label1 = item.label;
                            let info = {};
                            for(let info of this.showinfoDetail) {
                                item[info.name] = info.value;
                            }
                            const label2 = item.label;
                            if (label1 !== label2) {
                                let concept = {};
                                concept.type = label2;
                                concept.property = ['name'];
                                if(this.concepts.find(item => item.type === label2)) {
                                    
                                } else {
                                    this.concepts.push(concept);
                                    this.allTableData.push({
                                        number: this.conceptNum,
                                        concept: label2,
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
                                    this.setPaginations();
                                }
                            
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
                }
            }
        },
        updateCancel: function() {
            this.dialogUpdateVisible = false;
        },
        handleUpdateClose: function() {
            this.updateCancel();
        },
        // query
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
                this.$api.network.queryNetwork(str)
                .then(res => {
                    const data = {
                        nodes: res.data.data.nodes,
                        links: res.data.data.links,
                    }
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
            if(!extension && !extension2) {
                this.$message({
                    message: 'Uploaded file can only be CSV, XLSX format!!',
                    type: 'warning'
                });
                return false;
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`The current limit is 3 files, this time it is selected ${files.length} files，chose ${files.length + fileList.length} files`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`Sure to remove ${ file.name }？`);
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
        // Pagination
        setPaginations () {
            this.paginations.total = this.allTableData.length
            this.paginations.page_index = 1
            this.paginations.page_size = 5
            // 设置默认分页数据
            this.conceptTabelData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size
            })
        },
        // Control the amount of data displayed on a page
        handleSizeChange (page_size) { 
            this.paginations.page_index = 1
            this.paginations.page_size = page_size
            this.conceptTabelData = this.allTableData.filter((item, index) => {
                return index < page_size
            })
        },
        handleCurrentChange (page) { 
            let tables = []
            let index = this.paginations.page_size * (page - 1)
            let nums = this.paginations.page_size * page
            for (let i = index; i < nums; i++) {
                if (this.allTableData[i]) {
                tables.push(this.allTableData[i])
                }
            }
            this.conceptTabelData = tables
        },
        putRecord(history, record, queryModel) {
            if (queryModel) {
                if (this.currentQueryIndex < history.length - 1) {
                    history.splice(this.currentQueryIndex+1, history.length-this.currentQueryIndex-1);
                }
                this.currentQueryIndex += 1;
            } else {
                if (this.currentIndex < history.length - 1) {
                    history.splice(this.currentIndex+1, history.length-this.currentIndex-1);
                }
                this.currentIndex += 1;
            }
            history.push(this.deepClone(record));
        },
        undo() {
            if (this.queryLabel === true && this.currentQueryIndex > 0) {
                this.queryNodes = this.deepClone(this.graphQueryHistory[this.currentQueryIndex-1].nodes);
                this.queryLinks = this.deepClone(this.graphQueryHistory[this.currentQueryIndex-1].links);
                this.currentQueryIndex -= 1;
                this.showinfo = null;
            } else if (this.queryLabel === false && this.currentIndex > 0) {
                this.nodes = this.deepClone(this.graphHistory[this.currentIndex-1].nodes);
                this.links = this.deepClone(this.graphHistory[this.currentIndex-1].links);
                this.currentIndex -= 1;
                this.showinfo = null;
            }
        },
        redo() {
            if (this.queryLabel === true && this.currentQueryIndex < this.graphQueryHistory.length-1) {
                this.queryNodes = this.deepClone(this.graphQueryHistory[this.currentQueryIndex+1].nodes);
                this.queryLinks = this.deepClone(this.graphQueryHistory[this.currentQueryIndex+1].links);
                this.currentQueryIndex += 1;
                this.showinfo = null;
            } else if (this.queryLabel === false && this.currentIndex < this.graphHistory.length-1) {
                this.nodes = this.deepClone(this.graphHistory[this.currentIndex+1].nodes);
                this.links = this.deepClone(this.graphHistory[this.currentIndex+1].links);
                this.currentIndex += 1;
                this.showinfo = null;
            }
        },
        deepClone (obj) {
            let _tmp = JSON.stringify(obj); // Converts the object to json string form
            let result = JSON.parse(_tmp); // Converts json string to the object
            return result;
        },
        setChartNodeData(nodes) {
            let myChart = this.$echarts.init(document.getElementById('main'));
                var types = [];
                var categories = [];
                nodes.map(node => {
                    if(!types.includes(node.label)){
                        types.push(node.label);
                    }
                })
                for (var i = 0; i < types.length; i++) {
                    categories[i] = {
                        name: types[i],
                    };
                }
                nodes.forEach(function (node) {
                    node.draggable = true,
                    node.category = types.findIndex((element) => element === node.label);
                });
                const option = {
                    legend: [{
                            data: categories.map(function (a) {
                                return a.name;
                            })
                        }],
                    series: {
                        type: 'graph',
                        categories: categories,
                        data: nodes,
                    }
                }
                myChart.setOption(option);
        },
        setChartLinkData(links) {
            let myChart = this.$echarts.init(document.getElementById('main'));
            let length = links.length;
            links.forEach(function (link) {
                link.value = link.label;
            })
            const option = {
                series: {
                    type: 'graph',
                    links: links,
                }
            }
            myChart.setOption(option);
        },
        returnType(x){
            x.value = x.type
            return x; 
        },
        returnName(x){
            x.value = x.name
            return x; 
        },
        querySearch(queryString, cb) {
            var concepts = this.concepts.map(this.returnType);
            var results = queryString ? concepts.filter(this.createFilter(queryString)) : concepts;
            cb(results);
        },
        querySearchNode(queryString, cb) {
            var nodes = this.nodes.map(this.returnName);
            var results = queryString ? nodes.filter(this.createFilter(queryString)) : nodes;
            cb(results);
        },
        createFilter(queryString) {
            return (concepts) => {
            return (concepts.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },

    },
    watch: {
        nodes: {
            handler: function(val, oldVal){
                if (this.queryLabel === true) {
                    return;
                }
                this.setChartNodeData(this.nodes);
            },
            deep: true,
        },
        links: {
            handler: function(val, oldVal){
                if (this.queryLabel === true) {
                    return;
                }
                this.setChartLinkData(this.links);
            },
            deep: true,
        },
        queryNodes: {
            handler: function(val, oldVal){
                this.setChartNodeData(this.queryNodes);
            },
            deep: true,
        },
        queryLinks: {
            handler: function(val, oldVal){
                this.setChartLinkData(this.queryLinks);
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
.button {
    font-size: 18px;
    margin-top: 15px;
}
.button1 {
    font-size: 18px;
}
.btn {
    display: inline-block;
    text-align: right;
}
.showinfo {
    margin-top: 50px;
    margin-left: 144px;
    padding-top: 1px;
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
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s ease;
}
.pagination {
    font-size: 24px;
}
.updateAndDelete .el-button {
    height: 38px;
    
}
</style>