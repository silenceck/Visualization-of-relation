<template>
    <div class="info">
        <el-input
            type="textarea"
            :rows="5"
            placeholder=""
            v-model="textarea" 
            class="textarea">
        </el-input>
        <div class="keywords">
            <el-input v-model="key1" placeholder="keyword1" class="key1"></el-input> 
            <el-input v-model="key2" placeholder="keyword2" class="key2"></el-input> 
            <el-button @click="submit">确定</el-button>
        </div>
        <div id="main" class="chart"></div>

    </div>
</template>

<script>
export default {
    name: "textRelation",
    data(){
        return{
            textarea: '',
            key1: '',
            key2: '',
            nodes: [],
            links: [],
        }
    },
    mounted: function(){
        this.getChartData();
    },
    methods: {
        getChartData: function(){
        },
        submit: function() {
            if(this.key1 !== '' && this.key2 !== '' && this.text !== ''){
                const text = this.textarea;
                const key1 = this.key1;
                const key2 = this.key2;
                const data = {
                    key1: key1,
                    key2: key2,
                    text: text,
                }
                this.$http.post('/api/texts/', data)
                .then( res => {
                    const relation_label = res.data.pop();
                    const node1 = {id: "1", name: this.key1};
                    const node2 = {id: "2", name: this.key2};
                    this.nodes.push(node1);
                    this.nodes.push(node2);
                    switch(relation_label){
                        case '0':
                            break;
                        case '1':
                            this.links.push({id: "0", name: null, source: node1.id, target: node2.id});
                            break;
                        case '2':
                            this.links.push({id: "0", name: null, source: node2.id, target: node1.id});
                            break;
                        case '3':
                            break;
                    };
                    let myChart = this.$echarts.init(document.getElementById('main'));
                    var categories = [];
                    for (var i = 0; i < 9; i++) {
                        categories[i] = {
                            name: '类目' + i
                        };
                    }         
                    this.nodes.forEach(function (node) {
                        node.itemStyle = null;
                        node.symbolSize = 10;
                        node.value = node.symbolSize;
                        node.x = node.y = null;
                        node.draggable = true;
                    });
                    const option = {
                        title: {
                            top: 'bottom',
                            left: 'right'
                        },
                        tooltip: {},
                        
                        animation: false,
                        series : [
                            {
                                type: 'graph',
                                layout: 'force',
                                data: this.nodes,
                                links: this.links,
                                categories: categories,
                                roam: true,
                                label: {
                                    normal: {
                                        position: 'right'
                                    }
                                },
                                force: {
                                    repulsion: 100,
                                    gravity: 0.3,
                                }
                            }
                        ]
                    };
                    myChart.setOption(option);
                })
                
            }else{
                this.$message.error('输入框不能为空！！！');
            }
        }
    }


}
</script>script

<style scoped>
.textarea {
    margin-top: 5%;
    width: 40%;
    margin-left: 27%;
}
.el-input {
    margin-top: 10px;
    width: 120px;
    text-align: center;
}
.key1 {
    margin-left: 27%;
}
.key2 {
    padding: 10px;
}
.chart {
    margin-left: 27%;
    height: 480px;
    width: 40%;
    border: 2px solid #a6282f;
    
}
</style>
