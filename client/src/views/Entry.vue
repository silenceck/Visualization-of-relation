<template>
    <div class="entry">
        <div id="main" class="chart"></div>
    </div>
</template>

<script>
export default {
    name: 'entry',
    components: {},
    data(){
        return {
            graphData: [],
        }
    },
    mounted: function() {
        this.getGraphData();
    },
    methods: {
        getGraphData() {
            let colorList = [[
                '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                '#1e90ff', '#ff6347', '#7b68ee', '#d0648a', '#ffd700',
                '#6b8e23', '#4ea397', '#3cb371', '#b8860b', '#7bd9a5'
                ],
                [
                '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
                ],
                [
                '#55efc4', '#d63031', '#74b9ff', '#a29bfe', '#ffeaa7',
                '#fab1a0', '#ff7675', '#fd79a8', '#81ecec', '#f7f1e3', 
                '#485460', '#765005', '#e75840', '#26ccd8', '#3685fe', 
                '#9977ef', '#f5616f', '#f7b13f', '#f9e264', '#50c48f'
            ]][2];
            let myChart = this.$echarts.init(document.getElementById('main'));
                const option = {
                    backgroundColor: '#fff',
                    tooltip: {},
                    animationDurationUpdate: function(idx) {
                        return idx * 50;
                    },
                    animationEasingUpdate: 'bounceIn',
                    color: ['#fff', '#fff', '#fff'],
                    series: [{
                        type: 'graph',
                        layout: 'force',
                        force: {
                            repulsion: 500,
                            edgeLength: 10
                        },
                        roam: true,
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 16
                                },
                            }
                        },
                        data: this.graphData,
                        cursor: 'pointer'
                            
                        
                    }]
                }
                myChart.setOption(option);
                const that = this;
                myChart.on('click', function (params) {
                if (params.componentType === 'markPoint') {
                    if (params.seriesIndex === 5) {
                    }
                }
                else if (params.componentType === 'series') {
                    if (params.seriesType === 'graph') {
                        if (params.dataType === 'node') {
                            const field = params.data.name;
                            that.$store.dispatch('setIndex', 'index');
                            that.$router.push({path:'/home',query: {field: field}});
                        }
                        
                    }
                }
            });
            this.$api.network.getAdminNetwork().then(res => {
                const adminNetworks = res.data.adminNetworks;
                this.$emit('passAdminField', adminNetworks);
                const size = adminNetworks.length;
                for(let index in  adminNetworks) {
                    this.graphData.push({
                        "name": adminNetworks[index],
                        "symbolSize": Math.floor((Math.random()*100)+50),
                        "draggable": true,
                        "itemStyle": {
                            "normal": {
                                "shadowBlur": 100,
                                "shadowColor": colorList[index],
                                "color": colorList[index]
                            }
                        }
                    })
                }
                const option = {
                    series: [{
                        type: 'graph',
                        layout: 'force',
                        force: {
                            repulsion: 500,
                            edgeLength: 10
                        },
                        roam: true,
                        data: this.graphData,
                    }]
                }
                myChart.setOption(option);
            })
            
        },
    }
}
</script>

<style scoped>
.chart {
    margin-left: 25%;
    height: 680px;
    width: 800px;
}

</style>


