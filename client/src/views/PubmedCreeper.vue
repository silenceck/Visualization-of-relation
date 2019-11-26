<template>
    <div class="pubmedCreeper"> 
        <div class="keyword"> 
            <el-input v-model="key1"  class="key1" placeholder="keyword1"></el-input>
            <transition name="slide-fade">
                <span  v-if='ifshow' class="blackspace" ></span>      
            </transition>
            <span  class="line1" :style="line1Style"></span>
            <span  class="line2" :style="line2Style"></span>
            <el-input v-model="key2"  class="key2" placeholder="keyword2" :style="keyword2Style"></el-input> 
            <el-button @click="submit" class="btn">确定</el-button>
            <el-button @click="reset" class="btn1">重置</el-button>
        </div>            
        <div class="text">
             <el-table
            :data="sentences"
            style="width: 100%">
                <el-table-column
                    prop="label"
                    label="#"
                    width="80">
                </el-table-column>           
                <el-table-column
                    prop="text"
                    label="关系句"
                    width="800">
                </el-table-column>
            </el-table>
        </div>
        <div class="result">

        </div>
    </div>
</template>

<script>
export default {
    name: "pubmedCreeper",
    data(){
        return{
            relation_label: null,
            ifshow: false,
            label: 2,
            line1Style: {},
            line2Style: {},
            blackspaceStyle: {},
            keyword2Style: {},
            key1: '',
            key2: '',
            sentences: [],
        }
    },
    computed: {
        
    },
    mounted: function(){ 

    },
    methods: {
        submit: function(){
            // this.ifshow = !this.ifshow;
            if(this.key1 !== '' && this.key2 !== '' ){
                // const key1 = this.key1;
                // const key2 = this.key2;
                const key1 = JSON.stringify({
                    node1: 'sadf',
                    node2: '123'
                })
                this.$http.get(`/api/texts/?key1=${key1}&key2=${key1}`)
                .then( res => {
                    // console.log(res.data);
                    const label = res.data.relation;
                    this.relation_label = label;
                    const sens = res.data.data;
                    let tmp = [];
                    for(let i in sens){
                        tmp.push({
                            label: i,
                            text: sens[i]
                        })
                    }
                    this.sentences = tmp;
                    switch(label){
                        case 0:
                            break;
                        case 1:
                            this.line1Style = { 
                                transform: 'translateX(100%)',
                                transition: '1s',
                            }
                            break;
                        case 2:
                            this.line2Style = {
                                transform: 'translateX(-100%)',
                                transition: '1s',
                            }
                            break;
                        case 3:
                            this.ifshow = true;
                            break;
                    };
                })
            }else{
                this.$message.error('输入框不能为空！！！');
            }
        },
        reset: function () {
            this.key1 = '';
            this.key2 = '';
            if(this.relation_label === 1){
                this.line1Style = { 
                    transform: 'translateX(0%)',
                }
            }else if(this.relation_label === 2){
                this.line2Style = {
                    transform: 'translateX(0%)',
                }
            }else if(this.relation_label === 3){
                this.ifshow = false;
            }
            this.sentences = [];
        }
    }
}
</script>script

<style scoped>
.line1{
    z-index: 80;
    position:absolute;
    display: inline-block;
    overflow: hidden;
    top: 161px;
    left: 600px;
    width: 120px;
    height: 2px;
    background-color: rgb(0, 0, 0);
}
.line2{
    z-index: 80;
    position:absolute;
    display: inline-block;
    overflow: hidden;
    top: 161px;
    left: 840px;
    width: 120px;
    height: 2px;
    background-color: rgb(0, 0, 0);
}
.blackspace {
    display: inline-block;
    overflow: hidden;
    width: 120px;
    height: 2px;
    background-color: rgb(0, 0, 0);
}
.el-input {
    z-index:100;
    margin-top: 60px;
    width: 120px;
    text-align: center;
}
.key1 {
    margin-left: 600px;
}
.key2 {
    position:absolute;
    left: 840px;
}
.btn {
    position:absolute;
    left: 1000px;
    margin-top: 60px;
}
.btn1 {
    position:absolute;
    left: 1080px;
    margin-top: 60px;
}
.text {
    margin-left: 600px;
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  /* transform: translateX(10px); */
  opacity: 0;
}
</style>
