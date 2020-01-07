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
        <el-row :gutter="20">
            <el-col :span="10"><div id="main" class="chart"></div></el-col>
            <el-col :span="14">
                <div class="text">
                    <el-table
                    :data="tableData"
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
                        <el-table-column
                            prop="relation"
                            label="关系类型"
                            width="180">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="paginations.page_index"
                    :page-sizes="paginations.page_sizes"
                    :page-size="paginations.page_size"
                    :layout="paginations.layout"
                    :total="paginations.total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
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
            tableData: [],
            allTableData: [],
            filterTableData: [],
            paginations: {
                page_index: 1, // 当前位于哪一页
                total: 0, // 总数
                page_size: 5, // 一页显示多少条
                page_sizes: [5,10], // 每页显示多少条
                layout: 'total,sizes,prev,pager,next,jumper' //翻页属性
            },
        }
    },
    computed: {
        
    },
    mounted: function(){ 
        let myChart = this.$echarts.init(document.getElementById('main'));
        const option = {
                        title: {
                        text: 'relation pie',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        left: 'center',
                        top: 'bottom',
                        data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    series: [
                        {
                            name: '面积模式',
                            type: 'pie',
                            radius: [30, 110],
                            center: ['50%', '50%'],
                            roseType: 'area',
                            data: []
                        }
                    ]
        };
        myChart.setOption(option);
    },
    methods: {
        submit: function(){
            this.key1 = this.key1.trim();
            this.key2 = this.key2.trim();
            // this.textarea = this.textarea.trim();
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
                    const relation_type = {
                        cause_relation: 1,
                        is_caused_relation: 2,
                        exist_relation: 3,
                        no_relation: 0,
                    }
                    const relation_data = [];
                    for(let type in sens){
                        for(let i in sens[type]){
                            tmp.push({
                                label: Number(i)+1,
                                text: sens[type][i],
                                relation: relation_type[type]
                            })
                        }
                        if(sens[type].length !== 0){
                            const relation_num = {};
                            relation_num.value = sens[type].length;
                            if(type === 'cause_relation'){
                                relation_num.name = '->';
                            }else if(type === 'is_caused_relation'){
                                relation_num.name = '<-';
                            }else if(type === 'exist_relation'){
                                relation_num.name = '--';
                            }else if(type === 'no_relation'){
                                relation_num.name = '<>';
                            }
                            relation_data.push(relation_num);
                        }
                    }
                    console.log(relation_data);
                    this.sentences = tmp;
                    switch(label){
                        case 0:
                            break;
                        case 1:
                            this.ifRightShow = true;
                            break;
                        case 2:
                            this.ifLeftShow = true;
                            break;
                        case 3:
                            this.ifshow = true;
                            break;
                    };
                    let myChart = this.$echarts.init(document.getElementById('main'));
                    const option = {
                        series: [
                           {
                               data: relation_data.sort(function (a, b) { return a.value - b.value; }),
                           },
                        ],
                        
                    }
                    myChart.setOption(option);
                    this.allTableData = this.sentences;
                    this.filterTableData = this.sentences;
                    this.setPaginations();
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
            
        },
        setPaginations () {
            this.paginations.total = this.allTableData.length
            this.paginations.page_index = 1
            this.paginations.page_size = 10
            // 设置默认分页数据
            this.tableData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size
            })
        },
        handleSizeChange (page_size) { // 控制一页显示的数据量
            this.paginations.page_index = 1
            this.paginations.page_size = page_size
            this.tableData = this.allTableData.filter((item, index) => {
                return index < page_size
            })
        },
        handleCurrentChange (page) { // 分页跳转
            let tables = []
            // 当前页前面有多少数据
            let index = this.paginations.page_size * (page - 1)
            let nums = this.paginations.page_size * page
            for (let i = index; i < nums; i++) {
                if (this.allTableData[i]) {
                tables.push(this.allTableData[i])
                }
            }
            this.tableData = tables
        },
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
    margin-left: 5%;
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
.pagination {
    margin-left: 5%;
}
.chart {
    margin-left: 5%;
    width: 800px;
    height: 600px;
}
</style>
