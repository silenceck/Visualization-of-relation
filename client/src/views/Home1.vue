<template>
    <div class="home">
        <div class="container">
            <h1 class="title">护理领域</h1>
            <div id="main" style="width: 600px;height:400px;"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'home1',
    data(){
        return {

        }
    },
    mounted: function() {
        let myChart = this.$echarts.init(document.getElementById('main'));
        const PATH = '../assets/les-miserables.gexf';
        myChart.showLoading();
        this.$axios.get(PATH, function (xml) {
            console.log('PATH');
            myChart.hideLoading();
            var graph = this.$echarts.dataTool.gexf.parse(xml);
            var categories = [];
            for (var i = 0; i < 9; i++) {
                categories[i] = {
                    name: '类目' + i
                };
            }
            graph.nodes.forEach(function (node) {
                node.itemStyle = null;
                node.value = node.symbolSize;
                node.symbolSize /= 1.5;
                node.label = {
                    normal: {
                        show: node.symbolSize > 30
                    }
                };
                node.category = node.attributes.modularity_class;
            });
        let chartData = this.dataEChart();
        let chartLink = this.linkEChart();
        var option = {
            title: {
                text: 'Les Miserables',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            legend: [{
                selectedMode: 'single',
                data: chartData.map(function (a) {
                    return a.name;
                })
            }],
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            series : [
                {
                    name: 'Les Miserables',
                    type: 'graph',
                    layout: 'none',
                    data: chartData,
                    links: chartLink,
                    categories: categories,
                    roam: true,
                    focusNodeAdjacency: true,
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1,
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    },
                    label: {
                        position: 'right',
                        formatter: '{b}'
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.3
                    },
                    emphasis: {
                        lineStyle: {
                            width: 10
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
        }, 'xml');
    }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  background: url(../assets/showcase.png) no-repeat;
  background-size: 100% 100%;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
}
.title {
  font-size: 30px;
}
.lead {
  margin-top: 50px;
  font-size: 22px;
}
</style>

