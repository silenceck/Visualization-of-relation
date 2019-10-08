<template>
    <div class="search">
        <div class="nodeAndRelationship">
            <el-button class="add_btn" @click="add_propery">
                添加属性列
            </el-button>
            <div class="node1">
                节点一 <el-input v-model="node1_label" placeholder="节点1标签"></el-input> &#12288;
                <span class="n1_pro" v-for='i in node1' :key="i.name+`node1`+iter_num">
                    <el-input v-model="i.name" placeholder="属性名"></el-input> : <el-input v-model="i.value" placeholder="属性值"></el-input>  &#12288;
                </span>
            </div> 
            <div class="relation">
                关系&#12288; <el-input v-model="relation_label" placeholder="关系"></el-input> &#12288;
                <span class="res_pro" v-for='i in relation' :key="i.name+`relation`+iter_num">
                    <el-input v-model="i.name" placeholder="属性名"></el-input> : <el-input v-model="i.value" placeholder="属性值"></el-input>  &#12288;
                </span>
            </div>
            <div class="node2">
                节点二 <el-input v-model="node2_label" placeholder="节点2标签"></el-input> &#12288;
                <span class="n2_pro" v-for='i in node2' :key="i.name+`node2`+iter_num">
                    <el-input v-model="i.name" placeholder="属性名"></el-input> : <el-input v-model="i.value" placeholder="属性值"></el-input> &#12288;
                </span>
            </div>
            <el-button class="add_btn" @click="add_element">
                查询元素
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            iter_num: 1,
            node1_label:'',
            relation_label:'',
            node2_label:'',
            node1: [
                {
                    name: "",
                    value: "",
                }
            ],
            relation: [
                {
                    name: "",
                    value: "",
                }
            ],
            node2: [
                {
                    name: "",
                    value: "",
                }
            ],
        }
    },
    methods: {
        add_propery(){
            if (this.iter_num < 7) {
                this.iter_num += 1;
                if (this.node1_label !== '') {
                    this.node1.push({
                        name: "",
                        value: "",
                    });
                }
                if (this.relation_label !== '') {
                    this.relation.push({
                        name: "",
                        value: "",
                    });
                }              
                if (this.node2_label !== '') {
                    this.node2.push({
                        name: "",
                        value: "",
                    });
                }
            }           
        },
    }
}
</script>


<style scoped>
.el-input {
    width: 100px;
}
.add_btn {
    margin-top: 10px;
}
.table {
    margin-top: 10px;
}
.node1 {
    margin-top: 10px;
}
.relation {
    margin-top: 10px;
}
.node2 {
    margin-top: 10px;
}
</style>

