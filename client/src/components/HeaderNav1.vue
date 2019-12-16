<template>
    <div class="header">        
        <el-row class="header-nav">
            <el-col :span="6" class="logo_container">
                <!-- <img src="../assets/logo.png" class="logo" alt=""> -->
                <div style="color:#ffffff">dsfa</div>
            </el-col>
            <el-col :span="3" class="search_container">
                <el-input v-model="searchData" placeholder="请输入内容" ></el-input>
            </el-col>
            <el-col :span="2" class="search_container">
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </el-col>            
            <el-col :span="5" class="nav_container">
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#ffffff"
                    text-color="#a6282f"
                    active-text-color="#a6282f"
                    :router=true>
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
                              
                </el-menu>
            </el-col>
            <el-col :span="8">
                <div v-if="username === null" class="login"><router-link to="/login">登录</router-link></div>
                <div v-if="username !== null" class="username">
                    <div class="right-menu">
                        <el-dropdown class="avatar-container" trigger="click">
                            <div class="avatar-wrapper">
                                {{username}}
                            <i class="el-icon-caret-bottom" />
                            </div>
                            <el-dropdown-menu slot="dropdown" class="user-dropdown">
                            <router-link to="/profile">
                                <el-dropdown-item>
                                    个人中心
                                </el-dropdown-item>
                            </router-link>
                            <el-dropdown-item divided>
                                <span style="display:block;" @click="logout">退出</span>
                            </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeIndex: '1',
            searchData: '',
            // isLogin: false,
            // username: null,
        };
    },
    computed:{
        username(){
            return this.$store.getters.user.name;
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            // console.log(key, keyPath);  
        },
        logout(){

        }
    }
}
</script>

<style lang="scss" scoped>
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
.login {
    height: 80px;
    line-height: 80px;
    font-size: 18px;
    text-align: center;
    color: #a6282f;
}
.username {
    height: 80px;
    line-height: 80px;
    font-size: 18px;
    text-align: center;
}
.right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
}

.avatar-wrapper {
    font-size: 20px;
    cursor: pointer;
}
</style>