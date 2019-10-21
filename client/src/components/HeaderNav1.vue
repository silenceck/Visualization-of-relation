<template>
    <div class="header">        
        <el-row class="header-nav">
            <el-col :span="6" class="logo_container">
                <!-- <img src="../assets/logo.png" class="logo" alt=""> -->
                <div style="color:#ffffff">dsfa</div>
            </el-col>
            <el-col :span="3" class="search_container">
                <el-input v-model="search_data" placeholder="请输入内容" ></el-input>
            </el-col>
            <el-col :span="2" class="search_container">
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </el-col>            
            <el-col :span="8" class="nav_container">
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#ffffff"
                    text-color="#a6282f"
                    active-text-color="#a6282f"
                    router=true>
                    <!-- <el-menu-item index="0" class="logo" ><img src="../assets/logo.png" alt=""></el-menu-item> -->                        
                    <el-menu-item index="1" class="index1">首页</el-menu-item>
                    <el-menu-item index="2" class="index">构建关系网络</el-menu-item>
                    <!-- <el-submenu index="2" class="index">
                        <template slot="title">构建关系网络</template>
                        <el-menu-item index="2-1">选项1</el-menu-item>
                        <el-menu-item index="2-2">选项2</el-menu-item>
                        <el-menu-item index="2-3">选项3</el-menu-item>
                    </el-submenu> -->
                    <el-menu-item index="3" class="index" >文本关系提取</el-menu-item>
                    <el-menu-item index="4" class="index" >注册</el-menu-item>
                    <el-menu-item index="5" class="index" >登录</el-menu-item>            
                </el-menu>
            </el-col>
        </el-row>
        
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
            // console.log(key, keyPath);  
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