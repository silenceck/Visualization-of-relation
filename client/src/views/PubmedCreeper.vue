<template>
    <div class="pubmedCreeper"> 
        <div class="keyword"> 
            <el-input v-model="key1"  class="key1" placeholder="keyword1"></el-input>
            <transition name="slide-fade1">
                <span v-if='ifshow' class="blackspace" ></span>  
            </transition>
            <transition name="slide-fade2">
                <span v-if='ifLeftShow'> <img src="../assets/left.png"></span>    
            </transition>
            <transition name="slide-fade3">
                <span v-if='ifRightShow'> <img src="../assets/right.png"></span>
            </transition>
            <!-- <span  class="line1" :style="line1Style"></span>
            <span  class="line2" :style="line2Style"></span> -->
            <el-input v-model="key2"  class="key2" placeholder="keyword2" :style="keyword2Style"></el-input> 
            <el-button @click="submit" class="btn">确定</el-button>
            <!-- <el-button @click="reset" class="btn1">重置</el-button> -->
            <el-button @click="save" class="btn1">保存</el-button>
        </div>
        <el-input
            type="textarea"
            :rows="5"
            placeholder=""
            v-model="textarea" 
            class="textarea">
        </el-input>            
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
            ifLeftShow: false,
            ifRightShow: false,
            label: 2,
            line1Style: {},
            line2Style: {},
            blackspaceStyle: {},
            keyword2Style: {},
            key1: '',
            key2: '',
            sentences: [],
            textarea: '',
        }
    },
    computed: {
        
    },
    mounted: function(){ 

    },
    methods: {
        submit: function(){
            if(this.key1 !== '' && this.key2 !== '' && this.textarea !== ''){
                const key1 = this.key1;
                const key2 = this.key2;
                const text = this.textarea;
                if(!text.includes(key1) || !text.includes(key2)){
                    this.$message.error('关键词不在文本中！！！');
                    return 0;
                }
                const data = {
                    key1: key1,
                    key2: key2,
                    text: text,
                }
                this.$http.post(`/api/texts/`, data)
                .then( res => {
                    const data = JSON.parse(res.data.pop())
                    const label = data.relation;
                    this.relation_label = label;
                    const sens = data.data;
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
                            // this.line1Style = { 
                            //     transform: 'translateX(100%)',
                            //     transition: '1s',
                            // }
                            this.ifRightShow = true;
                            break;
                        case 2:
                            // this.line2Style = {
                            //     transform: 'translateX(-100%)',
                            //     transition: '1s',
                            // }
                            this.ifLeftShow = true;
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
        },
        save: function() {
            const isAuthenticated = this.$store.getters.isAuthenticated;
            if(isAuthenticated){
                if(this.sentences.length == 0){
                    this.$message({
                        message: '提取结果为空',
                        type: 'warning'
                    });
                }else{
                    const text = {
                        name: this.$store.getters.user.name,
                        key1: this.key1,
                        key2: this.key2,
                        relation: this.relation_label,
                        sens: this.sentences,
                    }
                    console.log(text);
                    this.$http.post('/api/texts/v1/', text)
                        .then(res => {
                            this.$message({
                                message: '保存成功！！！',
                                type: 'success'
                            });
                        })
                }
                
            }else {
                this.$message({
                    message: '用户未登录！！！',
                    type: 'warning'
                });
                this.$router.push('/login');
            }
            
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
    margin-left: 25%;
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
.textarea {
    width: 50%;
    margin-top: 10px;
    margin-left: 25%;
    margin-bottom: 10px;
}
</style>
