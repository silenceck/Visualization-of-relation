<template>
    <div class="index">
        <el-scrollbar style="height:100%;" wrapStyle="overflow-x:hidden;">
          <HeaderNav @passKeyword='getKeyword' :field='field' :adminField='adminField'></HeaderNav>
            <div class="rightContainer">
              <router-view :keyword="keyword" @passField='getField' @passAdminField='getAdminField'></router-view>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import HeaderNav from '../components/HeaderNav1.vue'
export default {
    name: 'index1',
    data() {
      return {
        keyword: '', //search content
        field: '',
        adminField: [],
      }
    },
    components: { 
        HeaderNav,
    },
    methods: {
      getKeyword(keyword){
        this.keyword = keyword;
      },
      getField(field){
        this.field = field;
      },
      getAdminField(fields) {
        this.adminField = fields;
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

