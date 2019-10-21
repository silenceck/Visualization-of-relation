<template>
    <div class="add">        
        <div class="nodeAndRelationship">
            <el-input v-model="node1_label" placeholder="节点1标签"></el-input> ---- <el-input v-model="relation_label" placeholder="关系"></el-input> --->
            <el-input v-model="node2_label" placeholder="节点2标签"></el-input>
        </div>
        <div class="propery">
            <!-- <el-tooltip content="增加属性列" placement="bottom" effect="light" @click="add_element">
                <i class="el-icon-plus"></i>
            </el-tooltip> -->
            <el-button class="add_btn" @click="add_propery">
                添加属性列
            </el-button>
            <div class="table">
                <div class="node1">
                    节点一 
                    <span class="n1_pro" v-for='i in node1' :key="i.name+`node1`+iter_num">
                        <el-input v-model="i.name" placeholder="属性名"></el-input> : <el-input v-model="i.value" placeholder="属性值"></el-input>  &#12288;
                    </span>
                </div>
                <div class="relation">
                    关系&#12288; 
                    <span class="res_pro" v-for='i in relation' :key="i.name+`relation`+iter_num">
                        <el-input v-model="i.name" placeholder="属性名"></el-input> : <el-input v-model="i.value" placeholder="属性值"></el-input>  &#12288;
                    </span>
                </div>
                <div class="node2">
                    节点二 
                    <span class="n2_pro" v-for='i in node2' :key="i.name+`node2`+iter_num">
                        <el-input v-model="i.name" placeholder="属性名"></el-input> : <el-input v-model="i.value" placeholder="属性值"></el-input> &#12288;
                    </span>
                </div>
                <el-button class="add_btn" @click="add_element">
                    添加元素
                </el-button>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            id: 1,
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
            
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);  
        },
        add_propery(){
            if (this.iter_num < 3) {
                this.iter_num += 1;
                this.node1.push({
                    name: "",
                    value: "",
                });
                this.relation.push({
                    name: "",
                    value: "",
                });
                this.node2.push({
                    name: "",
                    value: "",
                });
            }           
        },
        delete_element(){

        },
        add_element: function(){
            if(this.node1_label !== null){
                const node = {
                    label: this.node1_label,
                    id: this.id,
                }
                for(let i of this.node1){
                    const name = i.name;
                    const value = i.value;
                    node[name] = value;
                }
                this.id = this.id + 1;
                this.$store.dispatch('addNode', node);
                // console.log(this.$store.getters.newChart);
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
    width: 100px;
}
.nodeAndRelationship  {
    margin-top: 2px;
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