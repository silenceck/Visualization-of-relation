<template>
    <div class="header">        
        <el-row class="header-nav">
            <el-col :span="4" class="logo_container">
                <div style="color:#ffffff">dsfa</div>
            </el-col>
            <el-col :span="3" class="search_container">
                <el-autocomplete
                    class="inline-input"
                    v-model="searchData"
                    :fetch-suggestions="querySearch"
                    placeholder="Enter the search content"
                    :trigger-on-focus="false"
                    :disabled='isDisabled'>
                </el-autocomplete>
            </el-col>
            <el-col :span="2" class="search_container">
                <el-button type="primary" icon="el-icon-search" @click="search" >Search</el-button>
            </el-col>            
            <el-col :span="10" class="nav_container">
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#ffffff"
                    text-color="#a6282f"
                    active-text-color="#a6282f"
                    :router=true>
                    <el-menu-item index="index" class="index1">Home</el-menu-item>
                    <el-menu-item index="create_chart" class="index">Graph Construction </el-menu-item>
                    <el-menu-item index="relation_extraction" class="index" >Causality Extraction</el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="5">
                <div v-if="username === null" class="login" ><span @click="login" v-bind:style="{cursor:'pointer', marginRight:'30px' }" >Sign in</span></div>
                <div v-else class="username">
                    <div class="right-menu">
                        <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
                            <div class="avatar-wrapper">
                                {{username}}
                            <i class="el-icon-caret-bottom" />
                            </div>
                            <el-dropdown-menu slot="dropdown" class="user-dropdown">
                                <el-dropdown-item command="info">
                                    <span >Personal Center</span>
                                </el-dropdown-item>
                                <el-dropdown-item divided command="logout">
                                    <span style="display:block;">Sign out</span>
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
    props: [
        'field',
        'adminField',
    ],
    data() {
        return {
            searchData: '',
            keywordData: null,
            isDisabled: false,
        };
    },
    watch: {
        field(val, oldVal){
            if(val !== ''){
                this.getAllNodesName();
            }
        },
        adminField(val, oldVal){
            let fieldData = [];
            let temp  = JSON.parse(JSON.stringify(val));
            temp = temp.sort(function(a,b){return a.localeCompare(b)});
            for (let item of temp) {
                fieldData.push({value: item})
            }
            this.keywordData = fieldData;
        },
        activeIndex(val, oldVal) {
            if (val !== 'index') {
                this.searchData = '';
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }
        }
        
    },
    computed:{
        username(){
            if(this.$store.getters.user.name) {
                return this.$store.getters.user.name;
            } else {
                return null;
            }
        },
        activeIndex(){
            if(this.$store.getters.index) {
                return this.$store.getters.index;
            }
        }
    },
    mounted(){
        if(this.field !== '') {
            this.getAllNodesName();
        }
        if (localStorage.eleToken) {
            this.$api.user.getCurrentUser()
            .then(res => {
            })
            .catch(err => {
                localStorage.removeItem("eleToken");
                this.$store.dispatch("clearCurrentState");
            })
        }
        
    },
    methods: {
        handleSelect(key, keyPath) {
            this.$store.dispatch('setIndex', key);
        },
        search(){
            if (this.$route.path === '/index') {
                this.$store.dispatch('setIndex', 'index');
                this.$router.push({path:'/home',query: {field: this.searchData}});
                this.searchData = ''
            } else {
                this.$emit('passKeyword', this.searchData);
                this.searchData = '';
            }
            
        },
        getAllNodesName: function (){
            // only find all nodes in Nursing field, you can find other field by changing the network.js
            let data = [];
            this.$api.network.getNodename(this.field)
            .then(res => {
                let nodesData = []; 
                const data = res.data.data.sort(function(a,b){return a.localeCompare(b)});
                for(let item of data) {
                    nodesData.push({value:item})
                }
                this.keywordData = nodesData;
            })
        },
        querySearch(queryString, cb) {
            var keywordData = this.keywordData;
            var results = queryString ? keywordData.filter(this.createFilter(queryString)) : keywordData;
            cb(results);
        },
        createFilter(queryString) {
            return (keywordData) => {
            return (keywordData.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        login() {
            this.$router.push('/login');
        },
        logout(){
            localStorage.removeItem("eleToken");
            this.$store.dispatch("clearCurrentState");
            this.$store.dispatch('setIndex', 'index');
            this.$router.push('/index')
            this.username = null;
        },
        info() {
            this.$router.push('/profile');
        },
        changeIndex() {
            this.activeIndex = String(Math.floor((Math.random()*3)+1));
        },
        handleCommand(command) {
            if(command === 'info') {
                this.info();
            } else if (command === 'logout') {
                this.logout();
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
.el-menu-demo {
    height: 80px;
}
.inline-input {
    font-size: 18px;
}
.search_container {   
    height: 80px;
    line-height: 80px;
    font-size: 18px;
}
.search_container .el-button {
    margin-left: 4px;
    font-size: 18px;
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
.el-menu--horizontal>.el-submenu .el-submenu__title {
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
    text-align: right;
    margin-right: 5px;
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
    line-height: 80px;
    margin-right: 30px;
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