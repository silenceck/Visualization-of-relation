<template>
    <div class="index">
        <HeaderNav @passKeyword='getKeyword'></HeaderNav>
        <div class="rightContainer">
          <router-view :keyword="keyword"></router-view>
        </div>
    </div>
</template>

<script>
import HeaderNav from '../components/HeaderNav1.vue'
export default {
    name: 'index1',
    data() {
      return {
        keyword: '', //search content
      }
    },
    components: { 
        HeaderNav,
    },
    methods: {
      getKeyword(keyword){
        console.log('index:', keyword);
        this.keyword = keyword;
      }
    }
}
</script>

<style scoped>
.index{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/* .rightContainer{
  position: relative;
  top:0;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 71px);
  overflow: auto;
} */
</style>

