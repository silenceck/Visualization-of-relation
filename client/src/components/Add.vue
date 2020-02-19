<template>
    <div class="add">     
        <div class="field">
            <el-input v-model="field" placeholder="field"></el-input>
        </div>   
        <div class="propery">
            <el-row :gutter="24">
                <el-col class="node" :span="8">
                    <div class="title"> 节点 &#12288;</div>
                    <div class="node_label"> 
                        <el-input v-model="node_label" placeholder="node_label"></el-input>  &#12288;
                    </div>
                    <div class="n1_pro" v-for='i in node' :key="i.key+`node`">
                        <el-input v-model="i.name" placeholder="name"></el-input> : <el-input v-model="i.value" placeholder="value"></el-input>  &#12288;
                    </div>
                </el-col>
                <el-col class="relation" :span="12">
                    <div class="title">&#12288; 关系</div>
                    <div class="relation_label" > 
                        <el-input v-model="source_id" placeholder="source_id"></el-input>--
                        <el-input v-model="relation_label" placeholder="link_label"></el-input> --
                        <el-input v-model="target_id" placeholder="target_id"></el-input>
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
            <el-button class="add_btn" v-show="updateLable === false" @click="add_propery">
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
      'showinfo',
      'updateLable',
    ],
    data() {
        return {
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
        };
    },
    mounted: function(){
        const field = this.$route.query.field;
        console.log(field);
        if(field !== null){
            this.isEdit = true;
            this.$http.get(`/api/networks/${field}`)
            .then(res => {
                const newChart = res.data;
                this.node_id = newChart.nodes.length;
                this.link_id = newChart.links.length;
                this.$store.dispatch('setNewChart', newChart);
            })
        }
        
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);  
        },
        add_propery: function(){
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
                    }else {
                        this.$message.error('属性内容不能为空！！！');
                        return;
                    }
                }
                this.node_id = this.node_id + 1;
                this.$store.dispatch('addNode', node);
                this.nodes.push(node);
                this.node_label = '';
                for(let i of this.node){
                    i.name = '';
                    i.value = '';
                }
            }
            if(this.relation_label !== "" && this.source_id !== "" && this.target_id !== ""){
                const link = {
                    id: String(this.link_id),
                    label: this.relation_label,
                    source: this.source_id,
                    target: this.target_id,
                }
                for(let i of this.relation){
                    const name = i.name;
                    const value = i.value;
                    if(name !== "" && value !== ''){
                        link[name] = value;
                    }else {
                        this.$message.error('属性内容不能为空！！！');
                        return;
                    }
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
                            info.type = this.showinfo.type;
                            info.id = this.showinfo.id;
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
                            info.type = this.showinfo.type;
                            info.id = this.showinfo.id;
                            info.source = this.showinfo.source;
                            info.target = this.showinfo.target;
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
            const isAuthenticated = this.$store.getters.isAuthenticated;
            if(isAuthenticated){
                const chartData = this.$store.getters.newChart;
                let nodes = chartData.nodes;
                let links = chartData.links;
                const field = this.$route.query.field;
                if(field !== null){
                    nodes = this.nodes;
                    links = this.links;
                }
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
                this.$http.post('/api/networks/', data)
                .then(res => {
                    this.$message({
                        message: "网络生成成功",
                        type: "success"
                    })
                });
                this.nodes = [];
                this.links = [];
                this.isEdit = false;
            }else{
                this.$message({
                    message: '用户未登录！！！',
                    type: 'warning'
                });
                this.$router.push('/login');
            }
        }
    },
    watch: {
        updateLable: function(val, oldVal){
           if(val === true){
               this.iter_num = 1;
               if(this.showinfo){
                if(this.showinfo.type === "node"){
                    this.node_label = this.showinfo.label;
                    this.node = [];
                    for(let key in this.showinfo){
                        this.iter_num += 1;
                        this.node.push({
                            name: key,
                            value: this.showinfo[key],
                            key: this.iter_num
                        })
                    }
                }else{
                    console.log(this.showinfo);
                    this.source_id = this.showinfo.source;
                    this.relation_label = this.showinfo.name;
                    this.target_id = this.showinfo.target;
                    this.relation = [];
                    for(let key in this.showinfo){
                        if(key !== 'source' && key !== 'target' && key !== 'name'){
                            this.iter_num += 1;
                            this.relation.push({
                                name: key,
                                value: this.showinfo[key],
                                key: this.iter_num
                            })
                        }
                    }
                }
            }
           }else{

           } 
        }
    }
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