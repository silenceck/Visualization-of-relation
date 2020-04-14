<template>
    <div class="add">     
        <div class="field">
            Field:&#12288;<el-input v-model="field" ></el-input>
        </div>   
        <div class="propery">
            <el-row :gutter="24">
                <el-col class="node" :span="8">
                    <div class="title"> 节点 &#12288;</div>
                    <div class="node_label"> 
                        <el-input v-model="node_label" placeholder="node_label" :disabled="updateLable && showinfo.type === 'node'"></el-input>  &#12288;
                    </div>
                    <div class="n1_pro" v-for='i in node' :key="i.key+`node`">
                        <el-input v-model="i.name" placeholder="name"></el-input> : <el-input v-model="i.value" placeholder="value"></el-input>  &#12288;
                    </div>
                </el-col>
                <el-col class="relation" :span="12">
                    <div class="title">&#12288; 关系</div>
                    <div class="relation_label" > 
                        <el-input v-model="source_id" placeholder="source" :disabled="updateLable  && showinfo.type === 'link'"></el-input>--
                        <el-input v-model="relation_label" placeholder="link_label" :disabled="updateLable  && showinfo.type === 'link'"></el-input> --
                        <el-input v-model="target_id" placeholder="target" :disabled="updateLable  && showinfo.type === 'link'"></el-input>
                    </div>
                    <div class="res_pro" v-for='i in relation' :key="i.key+`relation`">
                        <el-input v-model="i.name" placeholder="name"></el-input> : <el-input v-model="i.value" placeholder="value"></el-input>  &#12288;
                    </div>
                </el-col>
            </el-row>
        <div class="btn">
            &#12288;
            <el-button class="add_btn" v-show="updateLable === false" @click="add_element" >
                添加元素
            </el-button>
            <el-button class="add_btn" @click="add_propery">  
                添加属性列
            </el-button>
            <el-button class="add_btn" v-show="updateLable === true" @click="update_element" >
                更新元素
            </el-button>
            <el-button class="add_btn" v-show="updateLable === false" @click="add_network" >
                生成网络
            </el-button>
        </div>
        </div>

    </div>
</template>
<script>
export default {
    props: [
    //   'showinfo',
      'updateLable',
    ],
    data() {
        return {
            fromPath: '',
            field: '',
            node_id: 0,
            link_id: 0,
            iter_num: 1,
            node_label: '',
            source_id: '',
            relation_label: '',
            target_id: '',
            node: [
                {
                    name: "",
                    value: "",
                    key: 1,
                }
            ],
            relation: [
                {
                    name: "",
                    value: "",
                    key: 1,
                }
            ],
            nodes: [],  // newly added nodes
            links: [],  // newly added links
            isEdit: false,  // whether it is jumping from the edit page 
            newEditNodes: [], 
            newEditLinks: [],
            showinfo: '',
        };
    },
    mounted: function(){
        console.log('newChart:', this.$store.getters.newChart);
        const field = this.$route.query.field;
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
                this.node_id = min + 1;
                min = 0;
                newChart.links.forEach(element => {
                    if(Number(element.id) > min) {
                        min = Number(element.id);
                    }
                });
                this.link_id = min + 1;
                this.$store.dispatch('setNewChart', newChart);
                this.$store.dispatch('setField', field);
            })
        }
        // console.log(this.fromPath); 
        // if (this.fromPath === '/search'){
        //     console.log(this.fromPath);
            // this.$emit('search', '');
        // }
        
    },
    beforeRouteEnter(to, from, next){
        next(vm =>{
            vm.fromPath = from.path;
            if(from.path === '/search') {
                vm.$emit('search', '');
                vm.isEdit = true;
            }
        })
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);  
        },
        add_propery: function(){
            // 清空节点属性
            // this.node_label = '';
            // for(let i of this.node){
            //     i.name = '';
            //     i.value = '';
            // }
            // this.relation = [
            //     {
            //         name: "a",
            //         value: "a",
            //         key: 1,
            //     }
            // ]
            if (this.iter_num < 3) {
                this.iter_num += 1;
                this.node.push({
                    name: "",
                    value: "",
                    key: this.iter_num,
                });
                this.relation.push({
                    name: "",
                    value: "",
                    key: this.iter_num,
                });
            }           
        },
        add_element: function(){
            // all nodes and links need to have name propery
            if(this.node_label !== "" && this.relation_label === ""){
                const node = {
                    label: this.node_label,
                    id: String(this.node_id),
                }
                for(let i of this.node){
                    const name = i.name;
                    const value = i.value;
                    if(name !== "" && value !== ''){
                        node[name] = value;
                    }
                    // else {
                    //     this.$message.error('属性内容不能为空！！！');
                    //     return;
                    // }
                }
                for(let item of this.nodes) {
                    if(item.name === node.name) {
                        this.$message.error('节点名称重复！！！');
                        return;
                    }
                }
                this.node_id = this.node_id + 1;
                this.$store.dispatch('addNode', node);
                this.nodes.push(node);
                // this.node_label = '';
                // for(let i of this.node){
                //     i.name = '';
                //     i.value = '';
                // }
            }
            // source_id and target_id represent name property
            if(this.relation_label !== "" && this.source_id !== "" && this.target_id !== ""){
                const nodes = this.$store.getters.newChart.nodes
                const source_node = nodes.find(element => element.name === this.source_id);
                const target_node = nodes.find(element => element.name === this.target_id);
                if(!source_node){
                    this.$message.error('源节点不存在！！！');
                    return;
                }
                if(!target_node){
                    this.$message.error('目标节点不存在！！！');
                    return;
                }
                if(source_node.name === target_node.name) {
                    this.$message.error('源节点和目标节点不能是同一个节点！！！');
                    return;
                }
                const link = {
                    id: String(this.link_id),
                    label: this.relation_label,
                    source: source_node.id,
                    target: target_node.id,
                }
                for(let i of this.relation){
                    const name = i.name;
                    const value = i.value;
                    if(name !== "" && value !== ''){
                        link[name] = value;
                    }
                    // else {
                    //     this.$message.error('属性内容不能为空！！！');
                    //     return;
                    // }
                }
                this.link_id = this.link_id + 1;
                this.$store.dispatch('addLink', link);
                this.links.push(link);
                this.source_id = '';
                this.relation_label = '';
                this.target_id = '';
                for(let i of this.relation){
                    i.name = '';
                    i.value = '';
                }
            }
        },
        update_element: function(){
            if(this.showinfo){
                if(this.showinfo.type === "node"){    
                    for(let item of this.$store.getters.newChart.nodes){
                        if(item.id === this.showinfo.id){
                            let info = {};
                            info.field = this.showinfo.field;
                            info.label = this.showinfo.label;
                            info.id = this.showinfo.id;
                            info.type = this.showinfo.type;
                            for(let i in this.node){
                                info[this.node[i].name] = this.node[i].value;
                            }
                            this.$store.dispatch('updateNode', info);
                            this.$emit('update', this.$store.getters.newChart.nodes, info); // 由于数组中的对象属性的变化watch检测不到,使用emit从子组件向父组件传递数据
                            this.node = [
                                {
                                    name: "",
                                    value: "",
                                    key: 1,
                                }
                            ];
                            this.node_label = '';
                        }
                    }                                  
                }else{
                    for(let item of this.$store.getters.newChart.links){
                        if(item.id === this.showinfo.id){
                            let info = {};
                            info.field = this.showinfo.field;
                            info.label = this.showinfo.label;
                            info.value = info.label;
                            info.id = this.showinfo.id;
                            info.source = this.showinfo.source;
                            info.target = this.showinfo.target;
                            info.type = this.showinfo.type;
                            for(let i in this.relation){
                                info[this.relation[i].name] = this.relation[i].value;
                            }
                            this.$store.dispatch('updateLink', info);
                            this.$emit('update', this.$store.getters.newChart.links, info); // 由于数组中的对象属性的变化watch检测不到,使用emit从子组件向父组件传递数据
                            this.relation = [
                                {
                                    name: "",
                                    value: "",
                                    key: 1,
                                }
                            ];
                            this.source_id = '';
                            this.relation_label = '';
                            this.target_id = '';
                        }
                    } 
                }
            }
        },
        add_network: function(){
            if(this.field === '' ) {
                this.$message({
                    message: '生成网络之前请确定field',
                    type: 'warning'
                });
                return ;
            }
            const isAuthenticated = this.$store.getters.isAuthenticated;
            if(isAuthenticated){
                const chartData = this.$store.getters.newChart;
                let nodes = chartData.nodes;
                let links = chartData.links;
                // const field = this.$route.query.field;
                // if(field !== null){
                //     nodes = this.nodes;
                //     links = this.links;
                // }
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
                }
                console.log(nodes, newNodes);
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
                console.log('add_network:', data, chartData);
                this.$http.post('/api/networks/', data)
                .then(res => {
                    this.$message({
                        message: "网络生成成功",
                        type: "success"
                    })
                    this.$store.dispatch('setNewChart', {nodes:[], links: []});
                    this.nodes = [];
                    this.links = [];
                    this.isEdit = false;
                    this.field = '';
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
        edit_property: function(showinfo) {
            // if(this.updateLable === true){
               this.showinfo = showinfo;
               this.iter_num = 1;
               if(this.showinfo){
                if(this.showinfo.type === "node"){
                    this.node_label = this.showinfo.label;
                    this.node = [];
                    for(let key in this.showinfo){
                        if(key !== 'id' && key !== 'label' && key !== 'field' && key !== 'type' ){
                            this.iter_num += 1;
                            this.node.push({
                                name: key,
                                value: this.showinfo[key],
                                key: this.iter_num
                            })
                        }
                    }
                    this.relation = [
                        {
                            name: "",
                            value: "",
                            key: 1,
                        }
                    ];
                    this.source_id = '';
                    this.relation_label = '';
                    this.target_id = '';
                }else{
                    this.source_id = this.showinfo.source;
                    this.relation_label = this.showinfo.label;
                    this.target_id = this.showinfo.target;
                    this.relation = [];
                    for(let key in this.showinfo){
                        if(key !== 'source' && key !== 'target' && key !== 'id' && key !== 'label' && key !== 'field' && key !== 'type'){
                            this.iter_num += 1;
                            this.relation.push({
                                name: key,
                                value: this.showinfo[key],
                                key: this.iter_num
                            })
                        }
                    }
                    this.node = [
                        {
                            name: "",
                            value: "",
                            key: 1,
                        }
                    ];
                    this.node_label = '';
                }
            }
        //    }
        },
        
    },
    
}
</script>

<style scoped>
.field {
    margin-left: 250px;
}
.el-input {
    margin-top: 10px;
    width: 100px;
    text-align: center;
}
.nodeAndRelationship  {
    margin-top: 2px;
}
.add_btn {
    margin-top: 30px;
}
.table {
    margin-top: 10px;
}
.node {
    margin-top: 10px;
}
.relation {
    margin-top: 10px;
}
.node_label {
    text-align: center;
    margin-top: 10px;
}
.relation_label {
    text-align: center;
    margin-top: 10px;
}
.n1_pro {
    text-align: center;
}
.res_pro {
    text-align: center;
}
.title {
    text-align: center;
}


</style>