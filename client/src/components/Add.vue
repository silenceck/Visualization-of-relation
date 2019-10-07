<template>
    <div class="add">        
        <div class="nodeAndRelationship">
            节点1:<el-input v-model="node1" placeholder="请输入节点1标签"></el-input> --- <el-input v-model="relation" placeholder="请输入内容"></el-input> --->
            节点2:<el-input v-model="node2" placeholder="请输入节点2标签"></el-input>
            
            <el-tooltip content="添加属性" placement="bottom" effect="light">
                <i class="el-icon-plus"></i>
            </el-tooltip>
        </div>
        <div class="propery">
            <el-tooltip content="添加属性" placement="bottom" effect="light">
                <i class="el-icon-plus"></i>
            </el-tooltip>
            <div class="table">
                节点1 <el-input v-model="node1_pro" placeholder="属性名"></el-input>:<el-input v-model="node1" placeholder="属性值"></el-input>
                关系 <el-input v-model="relation_pro" placeholder="属性名"></el-input>:<el-input v-model="node1" placeholder="属性值"></el-input>
                节点2 <el-input v-model="node2_pro" placeholder="属性名"></el-input>:<el-input v-model="node1" placeholder="属性值"></el-input>

            </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            activeIndex: '1',
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);  
        }
    }
}
</script>

<style scoped>
.el-menu-demo {
    height: 80px;
}
.search_container {   
    height: 80px;
    line-height: 80px;
    font-size: 18px;
}
.search_container .el-button {
    margin-left: 4px;
    background: #a6282f;
    border: 1px solid #a6282f;
}
.search_container >>> .el-input__inner {
    border: 1px solid #a6282f;
}
.index1.el-menu-item {
    height: 80px;
    line-height: 80px;
    font-size: 18px;

}
.index.el-menu-item {
    height: 80px;
    line-height: 80px;
    font-size: 18px;

}
.index2.el-menu-item {
    border-color: #ffffff;
    line-height: 80px;
    font-size: 18px;
}
.logo-container {
  line-height: 60px;
  min-width: 400px;
}
.logo {
  color:#ffffff;
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
</style>