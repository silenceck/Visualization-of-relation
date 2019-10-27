<template>
    <div class="add">
        <el-row :gutter="24">
            <el-col class="node" :span="12">
                <div class="title">节点 &#12288;</div>
                <div class="node_label"> 
                    <el-input v-model="node_label" placeholder="Node_label"></el-input>  &#12288;
                </div>
                <div class="n1_pro" v-for='i in node' :key="i.key+`node`">
                    <el-input v-model="i.name" placeholder="name"></el-input> : <el-input v-model="i.value" placeholder="value"></el-input>  &#12288;
                </div>
                
                
            </el-col>
            <el-col class="relation" :span="12">
                <div class="title">&#12288; 关系</div>
                <div class="relation_label"> 
                    <el-input v-model="source_id" placeholder="source_id"></el-input>--
                    <el-input v-model="relation_label" placeholder="Link_label"></el-input> -> 
                    <el-input v-model="target_id" placeholder="target_id"></el-input>
                </div>
                <div class="res_pro" v-for='i in relation' :key="i.key+`relation`">
                    <el-input v-model="i.name" placeholder="name"></el-input> : <el-input v-model="i.value" placeholder="value"></el-input>  &#12288;
                </div>
            </el-col>
        </el-row>
        <div>
            <el-button class="add_btn" @click="add_element">
                添加节点
            </el-button>
            <el-button class="add_btn" @click="add_propery">
                添加属性列
            </el-button>
        </div>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            iter_num: 1,
            node_label:'',
            relation_label:'',
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
        }
    },
    methods: {
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
    }


}
</script>

<style scoped>
.el-input {
    width: 100px;
}
</style>