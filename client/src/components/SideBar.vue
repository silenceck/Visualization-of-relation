<template>
    <el-row class="menu_page">
        <el-col>
            <el-menu 
                class="el-menu-vertical-demo"
                background-color="#FFFFFF"
                text-color="#5a5a5a"
                active-text-color="#409eff">
                    <template v-for="item in items" >
                            <router-link  :to="item.path" :key="item.path">
                                <el-menu-item :index="item.path">
                                    <i :class="'fa fa-margin ' + item.icon" ></i>
                                    <span slot="title" > {{item.name}}</span>
                                </el-menu-item>
                            </router-link>
                    </template>
            </el-menu>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        name: "siderBar",
        data(){
            return {
                items: [
                    {
                        icon: "fa-money",
                        name: "Personal info",
                        path: 'info',
                    },
                    {
                        icon: "fa-asterisk",
                        name: "Relational graph",
                        path: 'my_network',
                    },
                ]
            }
        },
        computed: {
            user(){
                return this.$store.getters.user;
        }
    },
    }
</script>
<style scoped>
.menu_page {
  min-height: 100%;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}
.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}

</style>