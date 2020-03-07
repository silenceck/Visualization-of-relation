<template>
    <div class="home">
        <div class="container">
            <el-row :gutter="20" class="row">               
                <el-col :span='12' class="col1">  
                    <div id="main" class="chart"></div> 
                </el-col>
                <el-col :span='12' class="col2">
                    &#12288;&#12288;&#12288;&#12288;
                    <router-link to="/add"><i class="el-icon-plus"></i></router-link> &#12288; |  &#12288;
                    <router-link to="/search"><i class="el-icon-search"></i></router-link>
                    <div class="add_search" >
                        <router-view :showinfo="showinfo" :updateLable="updateLable" v-on:update="receive" v-on:search="searchData" ref="add" @finish-adding='setShowinfo'></router-view>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="showinfo"><span v-for=" (val, key) in showinfo" :key="key"> &#12288;<span v-bind:style="{ fontWeight:'bold' }">{{key}}:</span>{{val}} </span> <span class="btn" v-if="showinfo !== null"> <el-button class="update" @click="update_element(showinfo)">更新</el-button><el-button class="delete" @click="delete_element(showinfo)">删除</el-button></span></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    name: 'create_chart',
    data() {
        return {
            showinfo: null, // transmit showinfo to Child components namely Add.vue
            updateLable: false, // transmit updateLable to Child components namely Add.vue 
        }
    },
    mounted: function(){
        this.getChartData()
    },
    computed: {
        nodes(){
            return this.$store.getters.newChart.nodes
        },
        links(){
            return this.$store.getters.newChart.links
        },
    },
    methods: {
        getChartData: function(){
            let myChart = this.$echarts.init(document.getElementById('main'));
            // var categories = [];
            // for (var i = 0; i < 9; i++) {
            //     categories[i] = {
            //         name: '类目' + i
            //     };
            // }
            // this.nodes = [];
            
            // this.links = [
                //     {id: "0", name: null, source: "1", target: "0", lineStyle: {}},
                //     {id: "1", name: null, source: "2", target: "0", lineStyle: {}},
                //     {id: "2", name: null, source: "3", target: "0", lineStyle: {}},
                //     {id: "3", name: null, source: "3", target: "2", lineStyle: {}},
                //     {id: "4", name: null, source: "4", target: "0", lineStyle: {}},
                //     {id: "5", name: null, source: "5", target: "0", lineStyle: {}},
                //     {id: "6", name: null, source: "6", target: "0", lineStyle: {}},
                //     {id: "7", name: null, source: "7", target: "0", lineStyle: {}},
                //     {id: "8", name: null, source: "8", target: "0", lineStyle: {}},
                //     {id: "9", name: null, source: "9", target: "0", lineStyle: {}},
                //     {id: "13", name: null, source: "11", target: "0", lineStyle: {}},
                //     {id: null, name: null, source: "11", target: "2", lineStyle: {}},
                //     {id: "11", name: null, source: "11", target: "3", lineStyle: {}},
                //     {id: "10", name: null, source: "11", target: "10", lineStyle: {}},
                //     {id: "14", name: null, source: "12", target: "11", lineStyle: {}},
                //     {id: "15", name: null, source: "13", target: "11", lineStyle: {}},
                //     {id: "16", name: null, source: "14", target: "11", lineStyle: {}},
                //     {id: "17", name: null, source: "15", target: "11", lineStyle: {}},
                //     {id: "18", name: null, source: "17", target: "16", lineStyle: {}},
                //     {id: "19", name: null, source: "18", target: "16", lineStyle: {}},
                //     {id: "20", name: null, source: "18", target: "17", lineStyle: {}},
                //     {id: "21", name: null, source: "19", target: "16", lineStyle: {}},
                //     {id: "22", name: null, source: "19", target: "17", lineStyle: {}},
                //     {id: "23", name: null, source: "19", target: "18", lineStyle: {}},
                //     {id: "24", name: null, source: "20", target: "16", lineStyle: {}},
                //     {id: "25", name: null, source: "20", target: "17", lineStyle: {}},
                //     {id: "26", name: null, source: "20", target: "18", lineStyle: {}},
                //     {id: "27", name: null, source: "20", target: "19", lineStyle: {}},
                //     {id: "28", name: null, source: "21", target: "16", lineStyle: {}},
                //     {id: "29", name: null, source: "21", target: "17", lineStyle: {}},
                //     {id: "30", name: null, source: "21", target: "18", lineStyle: {}},
                //     {id: "31", name: null, source: "21", target: "19", lineStyle: {}},
                //     {id: "32", name: null, source: "21", target: "20", lineStyle: {}},
                //     {id: "33", name: null, source: "22", target: "16", lineStyle: {}},
                //     {id: "34", name: null, source: "22", target: "17", lineStyle: {}},
                //     {id: "35", name: null, source: "22", target: "18", lineStyle: {}},
                //     {id: "36", name: null, source: "22", target: "19", lineStyle: {}},
                //     {id: "37", name: null, source: "22", target: "20", lineStyle: {}},
                //     {id: "38", name: null, source: "22", target: "21", lineStyle: {}},
                //     {id: "47", name: null, source: "23", target: "11", lineStyle: {}},
                //     {id: "46", name: null, source: "23", target: "12", lineStyle: {}},
                //     {id: "39", name: null, source: "23", target: "16", lineStyle: {}},
                //     {id: "40", name: null, source: "23", target: "17", lineStyle: {}},
                //     {id: "41", name: null, source: "23", target: "18", lineStyle: {}},
                //     {id: "42", name: null, source: "23", target: "19", lineStyle: {}},
                //     {id: "43", name: null, source: "23", target: "20", lineStyle: {}},
                //     {id: "44", name: null, source: "23", target: "21", lineStyle: {}},
                //     {id: "45", name: null, source: "23", target: "22", lineStyle: {}},
                //     {id: null, name: null, source: "24", target: "11", lineStyle: {}},
                //     {id: "48", name: null, source: "24", target: "23", lineStyle: {}},
                //     {id: "52", name: null, source: "25", target: "11", lineStyle: {}},
                //     {id: "51", name: null, source: "25", target: "23", lineStyle: {}},
                //     {id: "50", name: null, source: "25", target: "24", lineStyle: {}},
                //     {id: null, name: null, source: "26", target: "11", lineStyle: {}},
                //     {id: null, name: null, source: "26", target: "16", lineStyle: {}},
                //     {id: "53", name: null, source: "26", target: "24", lineStyle: {}},
                //     {id: "56", name: null, source: "26", target: "25", lineStyle: {}},
                //     {id: "57", name: null, source: "27", target: "11", lineStyle: {}},
                //     {id: "58", name: null, source: "27", target: "23", lineStyle: {}},
                //     {id: null, name: null, source: "27", target: "24", lineStyle: {}},
                //     {id: "59", name: null, source: "27", target: "25", lineStyle: {}},
                //     {id: "61", name: null, source: "27", target: "26", lineStyle: {}},
                //     {id: "62", name: null, source: "28", target: "11", lineStyle: {}},
                //     {id: "63", name: null, source: "28", target: "27", lineStyle: {}},
                //     {id: "66", name: null, source: "29", target: "11", lineStyle: {}},
                //     {id: "64", name: null, source: "29", target: "23", lineStyle: {}},
                //     {id: "65", name: null, source: "29", target: "27", lineStyle: {}},
                //     {id: "67", name: null, source: "30", target: "23", lineStyle: {}},
                //     {id: null, name: null, source: "31", target: "11", lineStyle: {}},
                //     {id: null, name: null, source: "31", target: "23", lineStyle: {}},
                //     {id: null, name: null, source: "31", target: "27", lineStyle: {}},
                //     {id: "68", name: null, source: "31", target: "30", lineStyle: {}},
                //     {id: "72", name: null, source: "32", target: "11", lineStyle: {}},
                //     {id: "73", name: null, source: "33", target: "11", lineStyle: {}},
                //     {id: "74", name: null, source: "33", target: "27", lineStyle: {}},
                //     {id: "75", name: null, source: "34", target: "11", lineStyle: {}},
                //     {id: "76", name: null, source: "34", target: "29", lineStyle: {}},
                //     {id: "77", name: null, source: "35", target: "11", lineStyle: {}},
                //     {id: null, name: null, source: "35", target: "29", lineStyle: {}},
                //     {id: "78", name: null, source: "35", target: "34", lineStyle: {}},
                //     {id: "82", name: null, source: "36", target: "11", lineStyle: {}},
                //     {id: "83", name: null, source: "36", target: "29", lineStyle: {}},
                //     {id: "80", name: null, source: "36", target: "34", lineStyle: {}},
                //     {id: "81", name: null, source: "36", target: "35", lineStyle: {}},
                //     {id: "87", name: null, source: "37", target: "11", lineStyle: {}},
                //     {id: "88", name: null, source: "37", target: "29", lineStyle: {}},
                //     {id: "84", name: null, source: "37", target: "34", lineStyle: {}},
                //     {id: "85", name: null, source: "37", target: "35", lineStyle: {}},
                //     {id: "86", name: null, source: "37", target: "36", lineStyle: {}},
                //     {id: "93", name: null, source: "38", target: "11", lineStyle: {}},
                //     {id: "94", name: null, source: "38", target: "29", lineStyle: {}},
                //     {id: "89", name: null, source: "38", target: "34", lineStyle: {}},
                //     {id: "90", name: null, source: "38", target: "35", lineStyle: {}},
                //     {id: "91", name: null, source: "38", target: "36", lineStyle: {}},
                //     {id: "92", name: null, source: "38", target: "37", lineStyle: {}},
                //     {id: "95", name: null, source: "39", target: "25", lineStyle: {}},
                //     {id: "96", name: null, source: "40", target: "25", lineStyle: {}},
                //     {id: "97", name: null, source: "41", target: "24", lineStyle: {}},
                //     {id: "98", name: null, source: "41", target: "25", lineStyle: {}},
                //     {id: "101", name: null, source: "42", target: "24", lineStyle: {}},
                //     {id: "100", name: null, source: "42", target: "25", lineStyle: {}},
                //     {id: "99", name: null, source: "42", target: "41", lineStyle: {}},
                //     {id: "102", name: null, source: "43", target: "11", lineStyle: {}},
                //     {id: "103", name: null, source: "43", target: "26", lineStyle: {}},
                //     {id: "104", name: null, source: "43", target: "27", lineStyle: {}},
                //     {id: null, name: null, source: "44", target: "11", lineStyle: {}},
                //     {id: "105", name: null, source: "44", target: "28", lineStyle: {}},
                //     {id: "107", name: null, source: "45", target: "28", lineStyle: {}},
                //     {id: "108", name: null, source: "47", target: "46", lineStyle: {}},
                //     {id: "112", name: null, source: "48", target: "11", lineStyle: {}},
                //     {id: "110", name: null, source: "48", target: "25", lineStyle: {}},
                //     {id: "111", name: null, source: "48", target: "27", lineStyle: {}},
                //     {id: "109", name: null, source: "48", target: "47", lineStyle: {}},
                //     {id: null, name: null, source: "49", target: "11", lineStyle: {}},
                //     {id: "113", name: null, source: "49", target: "26", lineStyle: {}},
                //     {id: null, name: null, source: "50", target: "24", lineStyle: {}},
                //     {id: "115", name: null, source: "50", target: "49", lineStyle: {}},
                //     {id: "119", name: null, source: "51", target: "11", lineStyle: {}},
                //     {id: "118", name: null, source: "51", target: "26", lineStyle: {}},
                //     {id: "117", name: null, source: "51", target: "49", lineStyle: {}},
                //     {id: null, name: null, source: "52", target: "39", lineStyle: {}},
                //     {id: "120", name: null, source: "52", target: "51", lineStyle: {}},
                //     {id: "122", name: null, source: "53", target: "51", lineStyle: {}},
                //     {id: "125", name: null, source: "54", target: "26", lineStyle: {}},
                //     {id: "124", name: null, source: "54", target: "49", lineStyle: {}},
                //     {id: "123", name: null, source: "54", target: "51", lineStyle: {}},
                //     {id: "131", name: null, source: "55", target: "11", lineStyle: {}},
                //     {id: "132", name: null, source: "55", target: "16", lineStyle: {}},
                //     {id: "133", name: null, source: "55", target: "25", lineStyle: {}},
                //     {id: null, name: null, source: "55", target: "26", lineStyle: {}},
                //     {id: "128", name: null, source: "55", target: "39", lineStyle: {}},
                //     {id: "134", name: null, source: "55", target: "41", lineStyle: {}},
                //     {id: "135", name: null, source: "55", target: "48", lineStyle: {}},
                //     {id: "127", name: null, source: "55", target: "49", lineStyle: {}},
                //     {id: "126", name: null, source: "55", target: "51", lineStyle: {}},
                //     {id: "129", name: null, source: "55", target: "54", lineStyle: {}},
                //     {id: "136", name: null, source: "56", target: "49", lineStyle: {}},
                //     {id: "137", name: null, source: "56", target: "55", lineStyle: {}},
                //     {id: null, name: null, source: "57", target: "41", lineStyle: {}},
                //     {id: null, name: null, source: "57", target: "48", lineStyle: {}},
                //     {id: "138", name: null, source: "57", target: "55", lineStyle: {}},
                //     {id: "145", name: null, source: "58", target: "11", lineStyle: {}},
                //     {id: null, name: null, source: "58", target: "27", lineStyle: {}},
                //     {id: "142", name: null, source: "58", target: "48", lineStyle: {}},
                //     {id: "141", name: null, source: "58", target: "55", lineStyle: {}},
                //     {id: "144", name: null, source: "58", target: "57", lineStyle: {}},
                //     {id: "148", name: null, source: "59", target: "48", lineStyle: {}},
                //     {id: "147", name: null, source: "59", target: "55", lineStyle: {}},
                //     {id: null, name: null, source: "59", target: "57", lineStyle: {}},
                //     {id: "146", name: null, source: "59", target: "58", lineStyle: {}},
                //     {id: "150", name: null, source: "60", target: "48", lineStyle: {}},
                //     {id: "151", name: null, source: "60", target: "58", lineStyle: {}},
                //     {id: "152", name: null, source: "60", target: "59", lineStyle: {}},
                //     {id: "153", name: null, source: "61", target: "48", lineStyle: {}},
                //     {id: "158", name: null, source: "61", target: "55", lineStyle: {}},
                //     {id: "157", name: null, source: "61", target: "57", lineStyle: {}},
                //     {id: "154", name: null, source: "61", target: "58", lineStyle: {}},
                //     {id: "156", name: null, source: "61", target: "59", lineStyle: {}},
                //     {id: "155", name: null, source: "61", target: "60", lineStyle: {}},
                //     {id: "164", name: null, source: "62", target: "41", lineStyle: {}},
                //     {id: "162", name: null, source: "62", target: "48", lineStyle: {}},
                //     {id: "159", name: null, source: "62", target: "55", lineStyle: {}},
                //     {id: null, name: null, source: "62", target: "57", lineStyle: {}},
                //     {id: "160", name: null, source: "62", target: "58", lineStyle: {}},
                //     {id: "161", name: null, source: "62", target: "59", lineStyle: {}},
                //     {id: null, name: null, source: "62", target: "60", lineStyle: {}},
                //     {id: "165", name: null, source: "62", target: "61", lineStyle: {}},
                //     {id: null, name: null, source: "63", target: "48", lineStyle: {}},
                //     {id: "174", name: null, source: "63", target: "55", lineStyle: {}},
                //     {id: null, name: null, source: "63", target: "57", lineStyle: {}},
                //     {id: null, name: null, source: "63", target: "58", lineStyle: {}},
                //     {id: "167", name: null, source: "63", target: "59", lineStyle: {}},
                //     {id: null, name: null, source: "63", target: "60", lineStyle: {}},
                //     {id: "172", name: null, source: "63", target: "61", lineStyle: {}},
                //     {id: "169", name: null, source: "63", target: "62", lineStyle: {}},
                //     {id: "184", name: null, source: "64", target: "11", lineStyle: {}},
                //     {id: null, name: null, source: "64", target: "48", lineStyle: {}},
                //     {id: "175", name: null, source: "64", target: "55", lineStyle: {}},
                //     {id: "183", name: null, source: "64", target: "57", lineStyle: {}},
                //     {id: "179", name: null, source: "64", target: "58", lineStyle: {}},
                //     {id: "182", name: null, source: "64", target: "59", lineStyle: {}},
                //     {id: "181", name: null, source: "64", target: "60", lineStyle: {}},
                //     {id: "180", name: null, source: "64", target: "61", lineStyle: {}},
                //     {id: "176", name: null, source: "64", target: "62", lineStyle: {}},
                //     {id: "178", name: null, source: "64", target: "63", lineStyle: {}},
                //     {id: "187", name: null, source: "65", target: "48", lineStyle: {}},
                //     {id: "194", name: null, source: "65", target: "55", lineStyle: {}},
                //     {id: "193", name: null, source: "65", target: "57", lineStyle: {}},
                //     {id: null, name: null, source: "65", target: "58", lineStyle: {}},
                //     {id: "192", name: null, source: "65", target: "59", lineStyle: {}},
                //     {id: null, name: null, source: "65", target: "60", lineStyle: {}},
                //     {id: "190", name: null, source: "65", target: "61", lineStyle: {}},
                //     {id: "188", name: null, source: "65", target: "62", lineStyle: {}},
                //     {id: "185", name: null, source: "65", target: "63", lineStyle: {}},
                //     {id: "186", name: null, source: "65", target: "64", lineStyle: {}},
                //     {id: "200", name: null, source: "66", target: "48", lineStyle: {}},
                //     {id: "196", name: null, source: "66", target: "58", lineStyle: {}},
                //     {id: "197", name: null, source: "66", target: "59", lineStyle: {}},
                //     {id: "203", name: null, source: "66", target: "60", lineStyle: {}},
                //     {id: "202", name: null, source: "66", target: "61", lineStyle: {}},
                //     {id: "198", name: null, source: "66", target: "62", lineStyle: {}},
                //     {id: "201", name: null, source: "66", target: "63", lineStyle: {}},
                //     {id: "195", name: null, source: "66", target: "64", lineStyle: {}},
                //     {id: "199", name: null, source: "66", target: "65", lineStyle: {}},
                //     {id: "204", name: null, source: "67", target: "57", lineStyle: {}},
                //     {id: null, name: null, source: "68", target: "11", lineStyle: {}},
                //     {id: null, name: null, source: "68", target: "24", lineStyle: {}},
                //     {id: "205", name: null, source: "68", target: "25", lineStyle: {}},
                //     {id: "208", name: null, source: "68", target: "27", lineStyle: {}},
                //     {id: null, name: null, source: "68", target: "41", lineStyle: {}},
                //     {id: "209", name: null, source: "68", target: "48", lineStyle: {}},
                //     {id: "213", name: null, source: "69", target: "11", lineStyle: {}},
                //     {id: "214", name: null, source: "69", target: "24", lineStyle: {}},
                //     {id: "211", name: null, source: "69", target: "25", lineStyle: {}},
                //     {id: null, name: null, source: "69", target: "27", lineStyle: {}},
                //     {id: "217", name: null, source: "69", target: "41", lineStyle: {}},
                //     {id: "216", name: null, source: "69", target: "48", lineStyle: {}},
                //     {id: "212", name: null, source: "69", target: "68", lineStyle: {}},
                //     {id: "221", name: null, source: "70", target: "11", lineStyle: {}},
                //     {id: "222", name: null, source: "70", target: "24", lineStyle: {}},
                //     {id: "218", name: null, source: "70", target: "25", lineStyle: {}},
                //     {id: "223", name: null, source: "70", target: "27", lineStyle: {}},
                //     {id: "224", name: null, source: "70", target: "41", lineStyle: {}},
                //     {id: "225", name: null, source: "70", target: "58", lineStyle: {}},
                //     {id: "220", name: null, source: "70", target: "68", lineStyle: {}},
                //     {id: "219", name: null, source: "70", target: "69", lineStyle: {}},
                //     {id: "230", name: null, source: "71", target: "11", lineStyle: {}},
                //     {id: "233", name: null, source: "71", target: "25", lineStyle: {}},
                //     {id: "226", name: null, source: "71", target: "27", lineStyle: {}},
                //     {id: "232", name: null, source: "71", target: "41", lineStyle: {}},
                //     {id: null, name: null, source: "71", target: "48", lineStyle: {}},
                //     {id: "228", name: null, source: "71", target: "68", lineStyle: {}},
                //     {id: "227", name: null, source: "71", target: "69", lineStyle: {}},
                //     {id: "229", name: null, source: "71", target: "70", lineStyle: {}},
                //     {id: "236", name: null, source: "72", target: "11", lineStyle: {}},
                //     {id: "234", name: null, source: "72", target: "26", lineStyle: {}},
                //     {id: "235", name: null, source: "72", target: "27", lineStyle: {}},
                //     {id: "237", name: null, source: "73", target: "48", lineStyle: {}},
                //     {id: "238", name: null, source: "74", target: "48", lineStyle: {}},
                //     {id: "239", name: null, source: "74", target: "73", lineStyle: {}},
                //     {id: "242", name: null, source: "75", target: "25", lineStyle: {}},
                //     {id: "244", name: null, source: "75", target: "41", lineStyle: {}},
                //     {id: null, name: null, source: "75", target: "48", lineStyle: {}},
                //     {id: "241", name: null, source: "75", target: "68", lineStyle: {}},
                //     {id: "240", name: null, source: "75", target: "69", lineStyle: {}},
                //     {id: "245", name: null, source: "75", target: "70", lineStyle: {}},
                //     {id: "246", name: null, source: "75", target: "71", lineStyle: {}},
                //     {id: "252", name: null, source: "76", target: "48", lineStyle: {}},
                //     {id: "253", name: null, source: "76", target: "58", lineStyle: {}},
                //     {id: "251", name: null, source: "76", target: "62", lineStyle: {}},
                //     {id: "250", name: null, source: "76", target: "63", lineStyle: {}},
                //     {id: "247", name: null, source: "76", target: "64", lineStyle: {}},
                //     {id: "248", name: null, source: "76", target: "65", lineStyle: {}},
                //     {id: "249", name: null, source: "76", target: "66", lineStyle: {}},
                // ]
            // this.nodes.forEach(function (node) {
            //     node.itemStyle = null;
            //     node.symbolSize = 10;
            //     node.value = node.symbolSize;
            //     // node.category = node.attributes.modularity_class;
            //     // Use random x, y
            //     node.x = node.y = null;
            //     node.draggable = true;
            // });
            const option = {
                title: {
                    // text: 'Les Miserables',
                    // subtext: 'Default layout',
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                legend: [{
                    // selectedMode: 'single',
                    data: []
                }],
                animation: false,
                series : [
                    {
                        // name: 'Les Miserables',
                        type: 'graph',
                        layout: 'force',
                        data: [],
                        links: [],
                        // categories: categories,
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 12
                                },
                            }
                        },
                        force: {
                            repulsion: 1000
                        },
                        edgeSymbolSize: [4, 50],
                        edgeLabel: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 10
                                },
                                formatter: "{c}"
                            }
                        },
                        roam: true,
                        symbolSize: 45,
                        focusNodeAdjacency: true,
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 1,
                                curveness: 0
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
            const that = this;
            myChart.on('click', function (params) {
                if (params.componentType === 'markPoint') {
                    // 点击到了 markPoint 上
                    if (params.seriesIndex === 5) {
                        // 点击到了 index 为 5 的 series 的 markPoint 上。
                    }
                }
                else if (params.componentType === 'series') {
                    if (params.seriesType === 'graph') {
                        if (params.dataType === 'edge') {
                            that.showinfo = params.data;
                            that.showinfo.type = 'link';
                            delete that.showinfo.emphasis;
                            delete that.showinfo.value;
                        }
                        else {
                            that.showinfo = params.data;
                            that.showinfo.type = 'node';
                            delete that.showinfo.emphasis;
                            delete that.showinfo.category;
                            delete that.showinfo.draggable;
                        }
                    }
                }
            });
        },
        delete_element: function(showinfo){
            if(showinfo.type == 'node'){
                this.$store.dispatch('deleteNode', showinfo);
                this.showinfo = null;
            }else{
                this.$store.dispatch('deleteLink', showinfo);
                this.showinfo = null;
            }
        },
        update_element: function(showinfo){
            this.updateLable = true;
            this.$refs.add.edit_property(this.showinfo);
        },
        receive: function(elements, showinfo){
            if(showinfo.type === 'node'){
                this.showinfo = showinfo;
                this.updateLable = false; 
            }else {
                this.showinfo = showinfo;
                this.updateLable = false;
            }
            let myChart = this.$echarts.init(document.getElementById('main'));
            const chartData = this.$store.getters.newChart;
            const option = {
                series : [
                    {
                        data: chartData.nodes,
                        links: chartData.links,
                    }
                ]
            };
            myChart.setOption(option);
        },
        searchData: function(data){
            if(this.showinfo !== null){
                this.showinfo = null;
            }
            if(data === '') {
                data = this.$store.getters.newChart;
                console.log('data:', data)
            }
            let myChart = this.$echarts.init(document.getElementById('main'));
            var types = [];
            var categories = [];
            data.nodes.map(node => {
                if(!types.includes(node.label)){
                    types.push(node.label);
                }
            })
            for (var i = 0; i < types.length; i++) {
                categories[i] = {
                    name: types[i],
                };
            }
            data.nodes.forEach(function (node) {
                // node.itemStyle = null;
                // node.symbolSize = Math.random()*40 + 1;
                // node.label = {
                //     normal: {
                //         // show: node.name.length > 10
                //         show: false
                //     }
                // };
                node.draggable = true,
                node.category = types.findIndex((element) => element === node.label);
            });
            const option = {
                legend: [{
                    // selectedMode: 'single',
                    data: categories.map(function (a) {
                        return a.name;
                    })
                }],
                series : [
                    {
                        categories: categories,
                        data: data.nodes,
                        links: data.links,
                    }
                ]
            };
            myChart.setOption(option);
        },
        setShowinfo: function(data) {
            this.showinfo = null;
        }
    },
    watch: {
        nodes: {
            handler: function(val, oldVal){
                let myChart = this.$echarts.init(document.getElementById('main'));
                var types = [];
                var categories = [];
                this.nodes.map(node => {
                    if(!types.includes(node.label)){
                        types.push(node.label);
                    }
                })
                for (var i = 0; i < types.length; i++) {
                    categories[i] = {
                        name: types[i],
                    };
                }
                this.nodes.forEach(function (node) {
                    node.draggable = true,
                    node.category = types.findIndex((element) => element === node.label);
                });
                const option = {
                    legend: [{
                            // selectedMode: 'single',
                            data: categories.map(function (a) {
                                return a.name;
                            })
                        }],
                    series: {
                        type: 'graph',
                        categories: categories,
                        data: this.nodes,
                    }
                }
                myChart.setOption(option);
            },
            deep: true,
        },
        links: {
            handler: function(val, oldVal){
                let myChart = this.$echarts.init(document.getElementById('main'));
                this.links.forEach(function (link) {
                    link.value = link.label;
                });
                const option = {
                    series: {
                        type: 'graph',
                        links: this.links,
                    }
                }
                myChart.setOption(option);
            },
            deep: true,
        },
        
        
    }
}
</script>
<style scoped>
.row {
    top: 100px;
}
.add_search {
    margin-top: 80px;
    padding-left: 10%;
}
.chart {
    /* position: absolute; */
    margin-left: 144px;
    height: 680px;
    width: 800px;
    border: 2px solid #a6282f;
    border-bottom: 1px solid rgb(220, 223, 230);
}
.update {
    text-align: right;
}
.btn {
    display: inline-block;
    text-align: right;
}
.showinfo {
    margin-top: 100px;
    margin-left: 144px;
    padding-top: 1px;
    /* padding-left: 1px; */
    width: 800px;
    height: 40px;
    border: 2px solid #a6282f;
    border-top: 0px;
}
.el-icon-plus {
    margin-left: 30%;
    margin-top: 30px;
    color: #a6282f;
}
.el-icon-search {
    color: #a6282f;
}
.title {
  font-size: 30px;
}
.lead {
  margin-top: 50px;
  font-size: 22px;
}
</style>