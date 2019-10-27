<template>
    <div class="add">        
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
            <el-button class="add_btn" @click="add_element">
                添加元素
            </el-button>
            <el-button class="add_btn" @click="add_propery">
                添加属性列
            </el-button>
        </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
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
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);  
        },
        add_propery(){
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
                this.node_label = '';
                for(let i of this.node){
                    i.name = '';
                    i.value = '';
                }
            }
            if(this.relation_label !== "" && this.source_id !== "" && this.target !== ""){
                const link = {
                    id: String(this.link_id),
                    name: this.relation_label,
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
                this.source_id = '';
                this.relation_label = '';
                this.target = '';
                for(let i of this.relation){
                    i.name = '';
                    i.value = '';
                }
            }
            // for(let i in this.node1){

            // }
            // if(node2_label !== null){
            //     this.node2_label = node2_label;
            // }
            
        }

    }
}
</script>

<style scoped>
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