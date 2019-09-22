<template>
    <div class="index">
        <HeaderNav></HeaderNav>
        <SideBar></SideBar>
        <div class="rightContainer">
          <router-view></router-view>
        </div>
    </div>
</template>

<script>
import HeaderNav from '../components/HeaderNav'
import SideBar from '../components/SideBar'
export default {
    name: 'index',
    components: { 
        HeaderNav,
        SideBar,
    }
}
</script>

<style scoped>
.index{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightContainer{
  position: relative;
  top:0;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 71px);
  overflow: auto;
}
</style>

