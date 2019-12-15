<template>
    <div class="profile">
        <div class="sideBar">
            <SideBar></SideBar>
        </div>
        <div class="rightContainer">
            <router-view></router-view> 
        </div>
    </div>
</template>

<script>
import SideBar from '../components/SideBar.vue'
export default {
    name: 'profile',
    components: {
        SideBar,
    },
    data(){
        return {
            
        }
    },
    methods:{
        
    }
}
</script>

<style scoped>
.profile {
    display: flex;
}
.sideBar {
    width: 150px;
    height: 300px;
    margin-left: 25%;
    margin-top: 5%;
}
.rightContainer {
    width: 1000px;
    height: 855px;
    margin-left: 20px;
    margin-top: 5%;
}
</style>


