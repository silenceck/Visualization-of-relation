<template>
    <div class="home">
        <div class="container">
            <el-row :gutter="20">
                <el-col :span="6" class="tree">
                    <el-scrollbar style="height:800px;" wrapStyle="overflow-x:hidden;">
                        <el-tree 
                            :data="data"
                            node-key="id"
                            :props="defaultProps"
                            accordion
                            @node-click="handleNodeClick"
                            :render-content="renderContent"
                            ref="tree"
                            class="sidebar">
                        </el-tree>
                    </el-scrollbar>
                </el-col>
                <el-col :span="9">
                    <div class="title" @click="resetData" v-bind:style="{cursor:'pointer' }">{{field}} Field</div>
                    <div id="main" class="chart"></div>
                </el-col>
                <el-col :span="9" class="card">
                    <el-scrollbar style="height:800px;" wrapStyle="overflow-x:hidden;">
                        <el-card class="box-card" shadow="never">
                        <div slot="header" class="clearfix">
                            <span>{{click_node.name}}</span>
                        </div>
                        <div v-for="(value, name, index) in click_node" :key="index" class="text item">
                            <div v-if="name !== 'name' && name !== 'id' && name !== 'num' && name !== 'itemStyle' && name !== 'symbolSize' && name !== 'label' && name !== 'lable' && name !== 'source' && name !== 'target' && name !== 'field' && name !=='draggable' && name !=='category' && name !=='type' && name !=='value'" >
                                <span v-bind:style="{ fontWeight:'bold' }">{{name + ':' }}</span> {{value }} 
                            </div>                         
                        </div>
                        </el-card>
                    </el-scrollbar>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
export default {
    name: 'home1',
    props: [
        'keyword',
    ],
    data(){
        return {
            data: [{
                    id: 1,
                    label: 'Nursing',
                    children: [
                        {
                            id: 4,
                            label: 'Diagnosis',
                            children: [
                                {
                                    id: 'A4',
                                    label: 'A',
                                    children: [],
                                },
                                {
                                    id: 'B4',
                                    label: 'B',
                                    children: [],
                                },
                                {
                                    id: 'C4',
                                    label: 'C',
                                    children: [],
                                },
                                {
                                    id: 'D4',
                                    label: 'D',
                                    children: [],
                                },
                                {
                                    id: 'E4',
                                    label: 'E',
                                    children: [],
                                },
                                {
                                    id: 'F4',
                                    label: 'F',
                                    children: [],
                                },
                                {
                                    id: 'G4',
                                    label: 'G',
                                    children: [],
                                },
                                {
                                    id: 'H4',
                                    label: 'H',
                                    children: [],
                                },
                                {
                                    id: 'J4',
                                    label: 'J',
                                    children: [],
                                },{
                                    id: 'K4',
                                    label: 'K',
                                    children: [],
                                },
                                {
                                    id: 'L4',
                                    label: 'L',
                                    children: [],
                                },
                                {
                                    id: 'M4',
                                    label: 'M',
                                    children: [],
                                },
                                {
                                    id: 'N4',
                                    label: 'N',
                                    children: [],
                                },
                                {
                                    id: 'P4',
                                    label: 'P',
                                    children: [],
                                },
                                {
                                    id: 'Q4',
                                    label: 'Q',
                                    children: [],
                                },
                                {
                                    id: 'R4',
                                    label: 'R',
                                    children: [],
                                },
                                {
                                    id: 'S4',
                                    label: 'S',
                                    children: [],
                                },
                                {
                                    id: 'T4',
                                    label: 'T',
                                    children: [],
                                },
                                {
                                    id: 'W4',
                                    label: 'W',
                                    children: [],
                                },
                                {
                                    id: 'X4',
                                    label: 'X',
                                    children: [],
                                },
                                {
                                    id: 'Y4',
                                    label: 'Y',
                                    children: [],
                                },
                                {
                                    id: 'Z4',
                                    label: 'Z',
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 2,
                            label: 'Intervention',
                            children: [
                                {
                                    id: 'A2',
                                    label: 'A',
                                    children: [],
                                },
                                {
                                    id: 'B2',
                                    label: 'B',
                                    children: [],
                                },
                                {
                                    id: 'C2',
                                    label: 'C',
                                    children: [],
                                },
                                {
                                    id: 'D2',
                                    label: 'D',
                                    children: [],
                                },
                                {
                                    id: 'E2',
                                    label: 'E',
                                    children: [],
                                },
                                {
                                    id: 'F2',
                                    label: 'F',
                                    children: [],
                                },
                                {
                                    id: 'G2',
                                    label: 'G',
                                    children: [],
                                },
                                {
                                    id: 'H2',
                                    label: 'H',
                                    children: [],
                                },
                                {
                                    id: 'J2',
                                    label: 'J',
                                    children: [],
                                },{
                                    id: 'K2',
                                    label: 'K',
                                    children: [],
                                },
                                {
                                    id: 'L2',
                                    label: 'L',
                                    children: [],
                                },
                                {
                                    id: 'M2',
                                    label: 'M',
                                    children: [],
                                },
                                {
                                    id: 'N2',
                                    label: 'N',
                                    children: [],
                                },
                                {
                                    id: 'P2',
                                    label: 'P',
                                    children: [],
                                },
                                {
                                    id: 'Q2',
                                    label: 'Q',
                                    children: [],
                                },
                                {
                                    id: 'R2',
                                    label: 'R',
                                    children: [],
                                },
                                {
                                    id: 'S2',
                                    label: 'S',
                                    children: [],
                                },
                                {
                                    id: 'T2',
                                    label: 'T',
                                    children: [],
                                },
                                {
                                    id: 'W2',
                                    label: 'W',
                                    children: [],
                                },
                                {
                                    id: 'X2',
                                    label: 'X',
                                    children: [],
                                },
                                {
                                    id: 'Y2',
                                    label: 'Y',
                                    children: [],
                                },
                                {
                                    id: 'Z2',
                                    label: 'Z',
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 3,
                            label: 'Outcome',
                            children: [
                                {
                                    id: 'A3',
                                    label: 'A',
                                    children: [],
                                },
                                {
                                    id: 'B3',
                                    label: 'B',
                                    children: [],
                                },
                                {
                                    id: 'C3',
                                    label: 'C',
                                    children: [],
                                },
                                {
                                    id: 'D3',
                                    label: 'D',
                                    children: [],
                                },
                                {
                                    id: 'E3',
                                    label: 'E',
                                    children: [],
                                },
                                {
                                    id: 'F3',
                                    label: 'F',
                                    children: [],
                                },
                                {
                                    id: 'G3',
                                    label: 'G',
                                    children: [],
                                },
                                {
                                    id: 'H3',
                                    label: 'H',
                                    children: [],
                                },
                                {
                                    id: 'J3',
                                    label: 'J',
                                    children: [],
                                },{
                                    id: 'K3',
                                    label: 'K',
                                    children: [],
                                },
                                {
                                    id: 'L3',
                                    label: 'L',
                                    children: [],
                                },
                                {
                                    id: 'M3',
                                    label: 'M',
                                    children: [],
                                },
                                {
                                    id: 'N3',
                                    label: 'N',
                                    children: [],
                                },
                                {
                                    id: 'P3',
                                    label: 'P',
                                    children: [],
                                },
                                {
                                    id: 'Q3',
                                    label: 'Q',
                                    children: [],
                                },
                                {
                                    id: 'R3',
                                    label: 'R',
                                    children: [],
                                },
                                {
                                    id: 'S3',
                                    label: 'S',
                                    children: [],
                                },
                                {
                                    id: 'T3',
                                    label: 'T',
                                    children: [],
                                },
                                {
                                    id: 'W3',
                                    label: 'W',
                                    children: [],
                                },
                                {
                                    id: 'X3',
                                    label: 'X',
                                    children: [],
                                },
                                {
                                    id: 'Y3',
                                    label: 'Y',
                                    children: [],
                                },
                                {
                                    id: 'Z3',
                                    label: 'Z',
                                    children: [],
                                },
                            ],
                        },
                        
                    ]
                }, 
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            nodes: [
                // {field: "test", id: "0", name: "Myriel", itemStyle: null, symbolSize: 19.12381, x: -266.82776},
                // {field: "test", id: "1", name: "Napoleon", itemStyle: null, symbolSize: 2.6666666666666665, x: -418.08344},
                // {field: "test", id: "2", name: "MlleBaptistine", itemStyle: null, symbolSize: 6.323809333333333, x: -212.76357},
                // {field: "test", id: "3", name: "MmeMagloire", itemStyle: null, symbolSize: 6.323809333333333, x: -242.82404},
                // {field: "test", id: "4", name: "CountessDeLo", itemStyle: null, symbolSize: 2.6666666666666665, x: -379.30386},
                // {field: "test", id: "5", name: "Geborand", itemStyle: null, symbolSize: 2.6666666666666665, x: -417.26337},
                // {field: "test", id: "6", name: "Champtercier", itemStyle: null, symbolSize: 2.6666666666666665, x: -332.6012},
                // {field: "test", id: "7", name: "Cravatte", itemStyle: null, symbolSize: 2.6666666666666665, x: -382.69568},
                // {field: "test", id: "8", name: "Count", itemStyle: null, symbolSize: 2.6666666666666665, x: -320.384},
                // {field: "test", id: "9", name: "OldMan", itemStyle: null, symbolSize: 2.6666666666666665, x: -344.39832},
                // {field: "test", id: "10", name: "Labarre", itemStyle: null, symbolSize: 2.6666666666666665, x: -89.34107},
                // {field: "test", id: "11", name: "Valjean", itemStyle: null, symbolSize: 66.66666666666667, x: -87.93029},
                // {field: "test", id: "12", name: "Marguerite", itemStyle: null, symbolSize: 4.495239333333333, x: -339.77908},
                // {field: "test", id: "13", name: "MmeDeR", itemStyle: null, symbolSize: 2.6666666666666665, x: -194.31313},
                // {field: "test", id: "14", name: "Isabeau", itemStyle: null, symbolSize: 2.6666666666666665, x: -158.05168},
                // {field: "test", id: "15", name: "Gervais", itemStyle: null, symbolSize: 2.6666666666666665, x: -127.701546},
                // {field: "test", id: "16", name: "Tholomyes", itemStyle: null, symbolSize: 17.295237333333333, x: -385.2226},
                // {field: "test", id: "17", name: "Listolier", itemStyle: null, symbolSize: 13.638097333333334, x: -516.55884},
                // {field: "test", id: "18", name: "Fameuil", itemStyle: null, symbolSize: 13.638097333333334, x: -464.79382},
                // {field: "test", id: "19", name: "Blacheville", itemStyle: null, symbolSize: 13.638097333333334, x: -515.1624},
                // {field: "test", id: "20", name: "Favourite", itemStyle: null, symbolSize: 13.638097333333334, x: -408.12122},
                // {field: "test", id: "21", name: "Dahlia", itemStyle: null, symbolSize: 13.638097333333334, x: -456.44113},
                // {field: "test", id: "22", name: "Zephine", itemStyle: null, symbolSize: 13.638097333333334, x: -459.1107},
                // {field: "test", id: "23", name: "Fantine", itemStyle: null, symbolSize: 28.266666666666666, x: -313.42786},
                // {field: "test", id: "24", name: "MmeThenardier", itemStyle: null, symbolSize: 20.95238266666667, x: 4.6313396},
                // {field: "test", id: "25", name: "Thenardier", itemStyle: null, symbolSize: 30.095235333333335, x: 82.80825},
                // {field: "test", id: "26", name: "Cosette", itemStyle: null, symbolSize: 20.95238266666667, x: 78.64646},
                // {field: "test", id: "27", name: "Javert", itemStyle: null, symbolSize: 31.923806666666668, x: -81.46074},
                // {field: "test", id: "28", name: "Fauchelevent", itemStyle: null, symbolSize: 8.152382000000001, x: -225.73984},
                // {field: "test", id: "29", name: "Bamatabois", itemStyle: null, symbolSize: 15.466666666666667, x: -385.6842},
                // {field: "test", id: "30", name: "Perpetue", itemStyle: null, symbolSize: 4.495239333333333, x: -403.92447},
                // {field: "test", id: "31", name: "Simplice", itemStyle: null, symbolSize: 8.152382000000001, x: -281.4253},
                // {field: "test", id: "32", name: "Scaufflaire", itemStyle: null, symbolSize: 2.6666666666666665, x: -122.41348},
                // {field: "test", id: "33", name: "Woman1", itemStyle: null, symbolSize: 4.495239333333333, x: -234.6001},
                // {field: "test", id: "34", name: "Judge", itemStyle: null, symbolSize: 11.809524666666666, x: -387.84915},
                // {field: "test", id: "35", name: "Champmathieu", itemStyle: null, symbolSize: 11.809524666666666, x: -338.2307},
                // {field: "test", id: "36", name: "Brevet", itemStyle: null, symbolSize: 11.809524666666666, x: -453.26874},
                // {field: "test", id: "37", name: "Chenildieu", itemStyle: null, symbolSize: 11.809524666666666, x: -386.44904},
                // {field: "test", id: "38", name: "Cochepaille", itemStyle: null, symbolSize: 11.809524666666666, x: -446.7876},
                // {field: "test", id: "39", name: "Pontmercy", itemStyle: null, symbolSize: 6.323809333333333, x: 336.49738},
                // {field: "test", id: "40", name: "Boulatruelle", itemStyle: null, symbolSize: 2.6666666666666665, x: 29.187843},
                // {field: "test", id: "41", name: "Eponine", itemStyle: null, symbolSize: 20.95238266666667, x: 238.36697},
                // {field: "test", id: "42", name: "Anzelma", itemStyle: null, symbolSize: 6.323809333333333, x: 189.69513},
                // {field: "test", id: "43", name: "Woman2", itemStyle: null, symbolSize: 6.323809333333333, x: -187.00418},
                // {field: "test", id: "44", name: "MotherInnocent", itemStyle: null, symbolSize: 4.495239333333333, x: -252.99521},
                // {field: "test", id: "45", name: "Gribier", itemStyle: null, symbolSize: 2.6666666666666665, x: -296.07935},
                // {field: "test", id: "46", name: "Jondrette", itemStyle: null, symbolSize: 2.6666666666666665, x: 550.3201},
                // {field: "test", id: "47", name: "MmeBurgon", itemStyle: null, symbolSize: 4.495239333333333, x: 488.13535},
                // {field: "test", id: "48", name: "Gavroche", itemStyle: null, symbolSize: 41.06667066666667, x: 387.89572},
                // {field: "test", id: "49", name: "Gillenormand", itemStyle: null, symbolSize: 13.638097333333334, x: 126.4831},
                // {field: "test", id: "50", name: "Magnon", itemStyle: null, symbolSize: 4.495239333333333, x: 127.07365},
                // {field: "test", id: "51", name: "MlleGillenormand", itemStyle: null, symbolSize: 13.638097333333334, x: 162.63559},
                // {field: "test", id: "52", name: "MmePontmercy", itemStyle: null, symbolSize: 4.495239333333333, x: 353.66415},
                // {field: "test", id: "53", name: "MlleVaubois", itemStyle: null, symbolSize: 2.6666666666666665, x: 165.43939},
                // {field: "test", id: "54", name: "LtGillenormand", itemStyle: null, symbolSize: 8.152382000000001, x: 137.69348},
                // {field: "test", id: "55", name: "Marius", itemStyle: null, symbolSize: 35.58095333333333, x: 206.44687},
                // {field: "test", id: "56", name: "BaronessT", itemStyle: null, symbolSize: 4.495239333333333, x: 194.82993},
                // {field: "test", id: "57", name: "Mabeuf", itemStyle: null, symbolSize: 20.95238266666667, x: 597.6618},
                // {field: "test", id: "58", name: "Enjolras", itemStyle: null, symbolSize: 28.266666666666666, x: 355.78366},
                // {field: "test", id: "59", name: "Combeferre", itemStyle: null, symbolSize: 20.95238266666667, x: 515.2961},
                // {field: "test", id: "60", name: "Prouvaire", itemStyle: null, symbolSize: 17.295237333333333, x: 614.29285},
                // {field: "test", id: "61", name: "Feuilly", itemStyle: null, symbolSize: 20.95238266666667, x: 550.1917},
                // {field: "test", id: "62", name: "Courfeyrac", itemStyle: null, symbolSize: 24.609526666666667, x: 436.17184},
                // {field: "test", id: "63", name: "Bahorel", itemStyle: null, symbolSize: 22.780953333333333, x: 602.55225},
                // {field: "test", id: "64", name: "Bossuet", itemStyle: null, symbolSize: 24.609526666666667, x: 455.81955},
                // {field: "test", id: "65", name: "Joly", itemStyle: null, symbolSize: 22.780953333333333, x: 516.40784},
                // {field: "test", id: "66", name: "Grantaire", itemStyle: null, symbolSize: 19.12381, x: 646.4313},
                // {field: "test", id: "67", name: "MotherPlutarch", itemStyle: null, symbolSize: 2.6666666666666665, x: 668.9568},
                // {field: "test", id: "68", name: "Gueulemer", itemStyle: null, symbolSize: 19.12381, x: 78.4799},
                // {field: "test", id: "69", name: "Babet", itemStyle: null, symbolSize: 19.12381, x: 150.35959},
                // {field: "test", id: "70", name: "Claquesous", itemStyle: null, symbolSize: 19.12381, x: 137.3717},
                // {field: "test", id: "71", name: "Montparnasse", itemStyle: null, symbolSize: 17.295237333333333, x: 234.87747},
                // {field: "test", id: "72", name: "Toussaint", itemStyle: null, symbolSize: 6.323809333333333, x: 40.942253},
                // {field: "test", id: "73", name: "Child1", itemStyle: null, symbolSize: 4.495239333333333, x: 437.939},
                // {field: "test", id: "74", name: "Child2", itemStyle: null, symbolSize: 4.495239333333333, x: 466.04922},
                // {field: "test", id: "75", name: "Brujon", itemStyle: null, symbolSize: 13.638097333333334, x: 238.79364},
                // {field: "test", id: "76", name: "MmeHucheloup", itemStyle: null, symbolSize: 13.638097333333334, x: 712.18353},
            ],
            links: [
                // {id: "0", name: null, source: "1", target: "0", lineStyle: {}},
                // {id: "1", name: null, source: "2", target: "0", lineStyle: {}},
                // {id: "2", name: null, source: "3", target: "0", lineStyle: {}},
                // {id: "3", name: null, source: "3", target: "2", lineStyle: {}},
                // {id: "4", name: null, source: "4", target: "0", lineStyle: {}},
                // {id: "5", name: null, source: "5", target: "0", lineStyle: {}},
                // {id: "6", name: null, source: "6", target: "0", lineStyle: {}},
                // {id: "7", name: null, source: "7", target: "0", lineStyle: {}},
                // {id: "8", name: null, source: "8", target: "0", lineStyle: {}},
                // {id: "9", name: null, source: "9", target: "0", lineStyle: {}},
                // {id: "13", name: null, source: "11", target: "0", lineStyle: {}},
                // {id: null, name: null, source: "11", target: "2", lineStyle: {}},
                // {id: "11", name: null, source: "11", target: "3", lineStyle: {}},
                // {id: "10", name: null, source: "11", target: "10", lineStyle: {}},
                // {id: "14", name: null, source: "12", target: "11", lineStyle: {}},
                // {id: "15", name: null, source: "13", target: "11", lineStyle: {}},
                // {id: "16", name: null, source: "14", target: "11", lineStyle: {}},
                // {id: "17", name: null, source: "15", target: "11", lineStyle: {}},
                // {id: "18", name: null, source: "17", target: "16", lineStyle: {}},
                // {id: "19", name: null, source: "18", target: "16", lineStyle: {}},
                // {id: "20", name: null, source: "18", target: "17", lineStyle: {}},
                // {id: "21", name: null, source: "19", target: "16", lineStyle: {}},
                // {id: "22", name: null, source: "19", target: "17", lineStyle: {}},
                // {id: "23", name: null, source: "19", target: "18", lineStyle: {}},
                // {id: "24", name: null, source: "20", target: "16", lineStyle: {}},
                // {id: "25", name: null, source: "20", target: "17", lineStyle: {}},
                // {id: "26", name: null, source: "20", target: "18", lineStyle: {}},
                // {id: "27", name: null, source: "20", target: "19", lineStyle: {}},
                // {id: "28", name: null, source: "21", target: "16", lineStyle: {}},
                // {id: "29", name: null, source: "21", target: "17", lineStyle: {}},
                // {id: "30", name: null, source: "21", target: "18", lineStyle: {}},
                // {id: "31", name: null, source: "21", target: "19", lineStyle: {}},
                // {id: "32", name: null, source: "21", target: "20", lineStyle: {}},
                // {id: "33", name: null, source: "22", target: "16", lineStyle: {}},
                // {id: "34", name: null, source: "22", target: "17", lineStyle: {}},
                // {id: "35", name: null, source: "22", target: "18", lineStyle: {}},
                // {id: "36", name: null, source: "22", target: "19", lineStyle: {}},
                // {id: "37", name: null, source: "22", target: "20", lineStyle: {}},
                // {id: "38", name: null, source: "22", target: "21", lineStyle: {}},
                // {id: "47", name: null, source: "23", target: "11", lineStyle: {}},
                // {id: "46", name: null, source: "23", target: "12", lineStyle: {}},
                // {id: "39", name: null, source: "23", target: "16", lineStyle: {}},
                // {id: "40", name: null, source: "23", target: "17", lineStyle: {}},
                // {id: "41", name: null, source: "23", target: "18", lineStyle: {}},
                // {id: "42", name: null, source: "23", target: "19", lineStyle: {}},
                // {id: "43", name: null, source: "23", target: "20", lineStyle: {}},
                // {id: "44", name: null, source: "23", target: "21", lineStyle: {}},
                // {id: "45", name: null, source: "23", target: "22", lineStyle: {}},
                // {id: null, name: null, source: "24", target: "11", lineStyle: {}},
                // {id: "48", name: null, source: "24", target: "23", lineStyle: {}},
                // {id: "52", name: null, source: "25", target: "11", lineStyle: {}},
                // {id: "51", name: null, source: "25", target: "23", lineStyle: {}},
                // {id: "50", name: null, source: "25", target: "24", lineStyle: {}},
                // {id: null, name: null, source: "26", target: "11", lineStyle: {}},
                // {id: null, name: null, source: "26", target: "16", lineStyle: {}},
                // {id: "53", name: null, source: "26", target: "24", lineStyle: {}},
                // {id: "56", name: null, source: "26", target: "25", lineStyle: {}},
                // {id: "57", name: null, source: "27", target: "11", lineStyle: {}},
                // {id: "58", name: null, source: "27", target: "23", lineStyle: {}},
                // {id: null, name: null, source: "27", target: "24", lineStyle: {}},
                // {id: "59", name: null, source: "27", target: "25", lineStyle: {}},
                // {id: "61", name: null, source: "27", target: "26", lineStyle: {}},
                // {id: "62", name: null, source: "28", target: "11", lineStyle: {}},
                // {id: "63", name: null, source: "28", target: "27", lineStyle: {}},
                // {id: "66", name: null, source: "29", target: "11", lineStyle: {}},
                // {id: "64", name: null, source: "29", target: "23", lineStyle: {}},
                // {id: "65", name: null, source: "29", target: "27", lineStyle: {}},
                // {id: "67", name: null, source: "30", target: "23", lineStyle: {}},
                // {id: null, name: null, source: "31", target: "11", lineStyle: {}},
                // {id: null, name: null, source: "31", target: "23", lineStyle: {}},
                // {id: null, name: null, source: "31", target: "27", lineStyle: {}},
                // {id: "68", name: null, source: "31", target: "30", lineStyle: {}},
                // {id: "72", name: null, source: "32", target: "11", lineStyle: {}},
                // {id: "73", name: null, source: "33", target: "11", lineStyle: {}},
                // {id: "74", name: null, source: "33", target: "27", lineStyle: {}},
                // {id: "75", name: null, source: "34", target: "11", lineStyle: {}},
                // {id: "76", name: null, source: "34", target: "29", lineStyle: {}},
                // {id: "77", name: null, source: "35", target: "11", lineStyle: {}},
                // {id: null, name: null, source: "35", target: "29", lineStyle: {}},
                // {id: "78", name: null, source: "35", target: "34", lineStyle: {}},
                // {id: "82", name: null, source: "36", target: "11", lineStyle: {}},
                // {id: "83", name: null, source: "36", target: "29", lineStyle: {}},
                // {id: "80", name: null, source: "36", target: "34", lineStyle: {}},
                // {id: "81", name: null, source: "36", target: "35", lineStyle: {}},
                // {id: "87", name: null, source: "37", target: "11", lineStyle: {}},
                // {id: "88", name: null, source: "37", target: "29", lineStyle: {}},
                // {id: "84", name: null, source: "37", target: "34", lineStyle: {}},
                // {id: "85", name: null, source: "37", target: "35", lineStyle: {}},
                // {id: "86", name: null, source: "37", target: "36", lineStyle: {}},
                // {id: "93", name: null, source: "38", target: "11", lineStyle: {}},
                // {id: "94", name: null, source: "38", target: "29", lineStyle: {}},
                // {id: "89", name: null, source: "38", target: "34", lineStyle: {}},
                // {id: "90", name: null, source: "38", target: "35", lineStyle: {}},
                // {id: "91", name: null, source: "38", target: "36", lineStyle: {}},
                // {id: "92", name: null, source: "38", target: "37", lineStyle: {}},
                // {id: "95", name: null, source: "39", target: "25", lineStyle: {}},
                // {id: "96", name: null, source: "40", target: "25", lineStyle: {}},
                // {id: "97", name: null, source: "41", target: "24", lineStyle: {}},
                // {id: "98", name: null, source: "41", target: "25", lineStyle: {}},
                // {id: "101", name: null, source: "42", target: "24", lineStyle: {}},
                // {id: "100", name: null, source: "42", target: "25", lineStyle: {}},
                // {id: "99", name: null, source: "42", target: "41", lineStyle: {}},
                // {id: "102", name: null, source: "43", target: "11", lineStyle: {}},
                // {id: "103", name: null, source: "43", target: "26", lineStyle: {}},
                // {id: "104", name: null, source: "43", target: "27", lineStyle: {}},
                // {id: null, name: null, source: "44", target: "11", lineStyle: {}},
                // {id: "105", name: null, source: "44", target: "28", lineStyle: {}},
                // {id: "107", name: null, source: "45", target: "28", lineStyle: {}},
                // {id: "108", name: null, source: "47", target: "46", lineStyle: {}},
                // {id: "112", name: null, source: "48", target: "11", lineStyle: {}},
                // {id: "110", name: null, source: "48", target: "25", lineStyle: {}},
                // {id: "111", name: null, source: "48", target: "27", lineStyle: {}},
                // {id: "109", name: null, source: "48", target: "47", lineStyle: {}},
                // {id: null, name: null, source: "49", target: "11", lineStyle: {}},
                // {id: "113", name: null, source: "49", target: "26", lineStyle: {}},
                // {id: null, name: null, source: "50", target: "24", lineStyle: {}},
                // {id: "115", name: null, source: "50", target: "49", lineStyle: {}},
                // {id: "119", name: null, source: "51", target: "11", lineStyle: {}},
                // {id: "118", name: null, source: "51", target: "26", lineStyle: {}},
                // {id: "117", name: null, source: "51", target: "49", lineStyle: {}},
                // {id: null, name: null, source: "52", target: "39", lineStyle: {}},
                // {id: "120", name: null, source: "52", target: "51", lineStyle: {}},
                // {id: "122", name: null, source: "53", target: "51", lineStyle: {}},
                // {id: "125", name: null, source: "54", target: "26", lineStyle: {}},
                // {id: "124", name: null, source: "54", target: "49", lineStyle: {}},
                // {id: "123", name: null, source: "54", target: "51", lineStyle: {}},
                // {id: "131", name: null, source: "55", target: "11", lineStyle: {}},
                // {id: "132", name: null, source: "55", target: "16", lineStyle: {}},
                // {id: "133", name: null, source: "55", target: "25", lineStyle: {}},
                // {id: null, name: null, source: "55", target: "26", lineStyle: {}},
                // {id: "128", name: null, source: "55", target: "39", lineStyle: {}},
                // {id: "134", name: null, source: "55", target: "41", lineStyle: {}},
                // {id: "135", name: null, source: "55", target: "48", lineStyle: {}},
                // {id: "127", name: null, source: "55", target: "49", lineStyle: {}},
                // {id: "126", name: null, source: "55", target: "51", lineStyle: {}},
                // {id: "129", name: null, source: "55", target: "54", lineStyle: {}},
                // {id: "136", name: null, source: "56", target: "49", lineStyle: {}},
                // {id: "137", name: null, source: "56", target: "55", lineStyle: {}},
                // {id: null, name: null, source: "57", target: "41", lineStyle: {}},
                // {id: null, name: null, source: "57", target: "48", lineStyle: {}},
                // {id: "138", name: null, source: "57", target: "55", lineStyle: {}},
                // {id: "145", name: null, source: "58", target: "11", lineStyle: {}},
                // {id: null, name: null, source: "58", target: "27", lineStyle: {}},
                // {id: "142", name: null, source: "58", target: "48", lineStyle: {}},
                // {id: "141", name: null, source: "58", target: "55", lineStyle: {}},
                // {id: "144", name: null, source: "58", target: "57", lineStyle: {}},
                // {id: "148", name: null, source: "59", target: "48", lineStyle: {}},
                // {id: "147", name: null, source: "59", target: "55", lineStyle: {}},
                // {id: null, name: null, source: "59", target: "57", lineStyle: {}},
                // {id: "146", name: null, source: "59", target: "58", lineStyle: {}},
                // {id: "150", name: null, source: "60", target: "48", lineStyle: {}},
                // {id: "151", name: null, source: "60", target: "58", lineStyle: {}},
                // {id: "152", name: null, source: "60", target: "59", lineStyle: {}},
                // {id: "153", name: null, source: "61", target: "48", lineStyle: {}},
                // {id: "158", name: null, source: "61", target: "55", lineStyle: {}},
                // {id: "157", name: null, source: "61", target: "57", lineStyle: {}},
                // {id: "154", name: null, source: "61", target: "58", lineStyle: {}},
                // {id: "156", name: null, source: "61", target: "59", lineStyle: {}},
                // {id: "155", name: null, source: "61", target: "60", lineStyle: {}},
                // {id: "164", name: null, source: "62", target: "41", lineStyle: {}},
                // {id: "162", name: null, source: "62", target: "48", lineStyle: {}},
                // {id: "159", name: null, source: "62", target: "55", lineStyle: {}},
                // {id: null, name: null, source: "62", target: "57", lineStyle: {}},
                // {id: "160", name: null, source: "62", target: "58", lineStyle: {}},
                // {id: "161", name: null, source: "62", target: "59", lineStyle: {}},
                // {id: null, name: null, source: "62", target: "60", lineStyle: {}},
                // {id: "165", name: null, source: "62", target: "61", lineStyle: {}},
                // {id: null, name: null, source: "63", target: "48", lineStyle: {}},
                // {id: "174", name: null, source: "63", target: "55", lineStyle: {}},
                // {id: null, name: null, source: "63", target: "57", lineStyle: {}},
                // {id: null, name: null, source: "63", target: "58", lineStyle: {}},
                // {id: "167", name: null, source: "63", target: "59", lineStyle: {}},
                // {id: null, name: null, source: "63", target: "60", lineStyle: {}},
                // {id: "172", name: null, source: "63", target: "61", lineStyle: {}},
                // {id: "169", name: null, source: "63", target: "62", lineStyle: {}},
                // {id: "184", name: null, source: "64", target: "11", lineStyle: {}},
                // {id: null, name: null, source: "64", target: "48", lineStyle: {}},
                // {id: "175", name: null, source: "64", target: "55", lineStyle: {}},
                // {id: "183", name: null, source: "64", target: "57", lineStyle: {}},
                // {id: "179", name: null, source: "64", target: "58", lineStyle: {}},
                // {id: "182", name: null, source: "64", target: "59", lineStyle: {}},
                // {id: "181", name: null, source: "64", target: "60", lineStyle: {}},
                // {id: "180", name: null, source: "64", target: "61", lineStyle: {}},
                // {id: "176", name: null, source: "64", target: "62", lineStyle: {}},
                // {id: "178", name: null, source: "64", target: "63", lineStyle: {}},
                // {id: "187", name: null, source: "65", target: "48", lineStyle: {}},
                // {id: "194", name: null, source: "65", target: "55", lineStyle: {}},
                // {id: "193", name: null, source: "65", target: "57", lineStyle: {}},
                // {id: null, name: null, source: "65", target: "58", lineStyle: {}},
                // {id: "192", name: null, source: "65", target: "59", lineStyle: {}},
                // {id: null, name: null, source: "65", target: "60", lineStyle: {}},
                // {id: "190", name: null, source: "65", target: "61", lineStyle: {}},
                // {id: "188", name: null, source: "65", target: "62", lineStyle: {}},
                // {id: "185", name: null, source: "65", target: "63", lineStyle: {}},
                // {id: "186", name: null, source: "65", target: "64", lineStyle: {}},
                // {id: "200", name: null, source: "66", target: "48", lineStyle: {}},
                // {id: "196", name: null, source: "66", target: "58", lineStyle: {}},
                // {id: "197", name: null, source: "66", target: "59", lineStyle: {}},
                // {id: "203", name: null, source: "66", target: "60", lineStyle: {}},
                // {id: "202", name: null, source: "66", target: "61", lineStyle: {}},
                // {id: "198", name: null, source: "66", target: "62", lineStyle: {}},
                // {id: "201", name: null, source: "66", target: "63", lineStyle: {}},
                // {id: "195", name: null, source: "66", target: "64", lineStyle: {}},
                // {id: "199", name: null, source: "66", target: "65", lineStyle: {}},
                // {id: "204", name: null, source: "67", target: "57", lineStyle: {}},
                // {id: null, name: null, source: "68", target: "11", lineStyle: {}},
                // {id: null, name: null, source: "68", target: "24", lineStyle: {}},
                // {id: "205", name: null, source: "68", target: "25", lineStyle: {}},
                // {id: "208", name: null, source: "68", target: "27", lineStyle: {}},
                // {id: null, name: null, source: "68", target: "41", lineStyle: {}},
                // {id: "209", name: null, source: "68", target: "48", lineStyle: {}},
                // {id: "213", name: null, source: "69", target: "11", lineStyle: {}},
                // {id: "214", name: null, source: "69", target: "24", lineStyle: {}},
                // {id: "211", name: null, source: "69", target: "25", lineStyle: {}},
                // {id: null, name: null, source: "69", target: "27", lineStyle: {}},
                // {id: "217", name: null, source: "69", target: "41", lineStyle: {}},
                // {id: "216", name: null, source: "69", target: "48", lineStyle: {}},
                // {id: "212", name: null, source: "69", target: "68", lineStyle: {}},
                // {id: "221", name: null, source: "70", target: "11", lineStyle: {}},
                // {id: "222", name: null, source: "70", target: "24", lineStyle: {}},
                // {id: "218", name: null, source: "70", target: "25", lineStyle: {}},
                // {id: "223", name: null, source: "70", target: "27", lineStyle: {}},
                // {id: "224", name: null, source: "70", target: "41", lineStyle: {}},
                // {id: "225", name: null, source: "70", target: "58", lineStyle: {}},
                // {id: "220", name: null, source: "70", target: "68", lineStyle: {}},
                // {id: "219", name: null, source: "70", target: "69", lineStyle: {}},
                // {id: "230", name: null, source: "71", target: "11", lineStyle: {}},
                // {id: "233", name: null, source: "71", target: "25", lineStyle: {}},
                // {id: "226", name: null, source: "71", target: "27", lineStyle: {}},
                // {id: "232", name: null, source: "71", target: "41", lineStyle: {}},
                // {id: null, name: null, source: "71", target: "48", lineStyle: {}},
                // {id: "228", name: null, source: "71", target: "68", lineStyle: {}},
                // {id: "227", name: null, source: "71", target: "69", lineStyle: {}},
                // {id: "229", name: null, source: "71", target: "70", lineStyle: {}},
                // {id: "236", name: null, source: "72", target: "11", lineStyle: {}},
                // {id: "234", name: null, source: "72", target: "26", lineStyle: {}},
                // {id: "235", name: null, source: "72", target: "27", lineStyle: {}},
                // {id: "237", name: null, source: "73", target: "48", lineStyle: {}},
                // {id: "238", name: null, source: "74", target: "48", lineStyle: {}},
                // {id: "239", name: null, source: "74", target: "73", lineStyle: {}},
                // {id: "242", name: null, source: "75", target: "25", lineStyle: {}},
                // {id: "244", name: null, source: "75", target: "41", lineStyle: {}},
                // {id: null, name: null, source: "75", target: "48", lineStyle: {}},
                // {id: "241", name: null, source: "75", target: "68", lineStyle: {}},
                // {id: "240", name: null, source: "75", target: "69", lineStyle: {}},
                // {id: "245", name: null, source: "75", target: "70", lineStyle: {}},
                // {id: "246", name: null, source: "75", target: "71", lineStyle: {}},
                // {id: "252", name: null, source: "76", target: "48", lineStyle: {}},
                // {id: "253", name: null, source: "76", target: "58", lineStyle: {}},
                // {id: "251", name: null, source: "76", target: "62", lineStyle: {}},
                // {id: "250", name: null, source: "76", target: "63", lineStyle: {}},
                // {id: "247", name: null, source: "76", target: "64", lineStyle: {}},
                // {id: "248", name: null, source: "76", target: "65", lineStyle: {}},
                // {id: "249", name: null, source: "76", target: "66", lineStyle: {}},
            ],
            partNodes: [],
            partLinks: [],
            seleted_node: { 

            },
            seleted_link: {

            },
            click_node: {

            },
            field: ''
        }
    },
    mounted: function() {
        let field = this.$route.query.field;
        if (!field) {
            field = 'Nursing'
        } 
        this.field = field;
        this.$emit('passField', this.field);
        this.getChartData(field);
    },
    methods: {
        getChartData: function(field){
            this.$http.get(`api/networks/${field}`)
            .then(res => {
                let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                this.nodes = res.data.nodes;
                this.links = res.data.links;
                console.log(this.nodes, this.links);
                let nodeTypes = [];
                if (field === 'Nursing') {
                    let outcomeNodes = {A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[],K:[],L:[],M:[],N:[],O:[],P:[],Q:[],R:[],S:[],T:[],U:[],V:[],W:[],X:[],Y:[],Z:[]};
                    let InterventionNodes = {A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[],K:[],L:[],M:[],N:[],O:[],P:[],Q:[],R:[],S:[],T:[],U:[],V:[],W:[],X:[],Y:[],Z:[]};
                    let Diagnosis = {A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[],K:[],L:[],M:[],N:[],O:[],P:[],Q:[],R:[],S:[],T:[],U:[],V:[],W:[],X:[],Y:[],Z:[]};
                    nodeTypes = ['Intervention', 'Outcome']
                    for(let node of this.nodes){
                        const char = node.name.trim()[0];
                        char = char.toUpperCase();
                        if(node.label === 'Intervention'){
                            node.type = node.label;
                            if(!InterventionNodes[char]){
                                break;
                            }
                            InterventionNodes[char].push({label:node.name});
                        }else if(node.label === 'Outcome') {
                            node.type = node.label;
                            if(!outcomeNodes[char]){
                                break;
                            }
                            outcomeNodes[char].push({label:node.name});
                        }
                    }
                    let temDiagnosis = [];
                    for(let link of this.links) {
                        link.value = link.diagnosis;
                        if(!temDiagnosis.includes(link.diagnosis)){
                            temDiagnosis.push(link.diagnosis);
                        }
                    }
                    for(let diagnosis of temDiagnosis){
                        const char = diagnosis.trim()[0];
                        char = char.toUpperCase();
                        Diagnosis[char].push({label: diagnosis});
                    }
                    for(let key in InterventionNodes){
                        InterventionNodes[key] = InterventionNodes[key].sort(function(a,b){return a['label'].localeCompare(b['label'])}); // in alphabetical order
                        this.$refs.tree.updateKeyChildren(key+'2', InterventionNodes[key]);
                    }
                    for(let key in outcomeNodes){
                        outcomeNodes[key] = outcomeNodes[key].sort(function(a,b){return a['label'].localeCompare(b['label'])});
                        this.$refs.tree.updateKeyChildren(key+'3', outcomeNodes[key]);
                    }
                    for(let key in Diagnosis){
                        Diagnosis[key] = Diagnosis[key].sort(function(a,b){return a['label'].localeCompare(b['label'])});
                        this.$refs.tree.updateKeyChildren(key+'4', Diagnosis[key]);
                    }
                } else {
                    this.data = [
                        {
                          id: 1,
                          label: field,
                          children:  []
                        }
                    ]
                    for(let node of this.nodes) {
                        if(!nodeTypes.includes(node.label)){
                            nodeTypes.push(node.label);
                        }
                    }
                    for(let link of this.links) {
                        link.type = link.label;
                    }
                    for(let type of nodeTypes) {
                        let index = 2;
                        let temp = []
                        for(let i = 0; i <26; i++){
                            temp.push({
                                id: alphabet[i] + String(index),
                                label: alphabet[i],
                                children: [],
                            })
                        }
                        this.data[0].children.push(
                            {
                                id: String(index),
                                label: type,
                                children: temp,
                            }
                        )
                    }
                    // update nodeTree in the left side 
                    let nodeTree = {};
                    for(let type of nodeTypes) {
                        nodeTree[type] = {A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[],K:[],L:[],M:[],N:[],O:[],P:[],Q:[],R:[],S:[],T:[],U:[],V:[],W:[],X:[],Y:[],Z:[]}
                    }
                    for(let node of this.nodes){
                        const char = node.name.trim()[0];
                        char = char.toUpperCase();
                        for(let type of nodeTypes) {
                            if(node.label === type) {
                                nodeTree[type][char].push({label:node.name});
                            }
                        }
                    }
                    for(let type of nodeTypes) {
                        let index = 2;
                        for(let key in nodeTree[type]) {
                            nodeTree[type][key] = nodeTree[type][key].sort(function(a,b){return a['label'].localeCompare(b['label'])});
                        }
                        for(let i = 0; i <26; i++) {
                            this.data[0].children[nodeTypes.indexOf(type)].children[i].children = nodeTree[type][alphabet[i]]
                        }
                        index += 1;
                    }
                }
                let myChart = this.$echarts.init(document.getElementById('main'));
                var categories = [];
                var types = nodeTypes;
                for (var i = 0; i < types.length; i++) {
                    categories[i] = {
                        name: types[i],
                    };
                }
                this.nodes.forEach(function (node) {
                    node.itemStyle = null;
                    node.symbolSize = Math.random()*40 + 1;
                    node.type = node.label;
                    node.label = {
                        normal: {
                            // show: node.name.length > 10
                            show: false
                        }
                    };
                    node.category = types.findIndex((element) => element === node.type);
                    
                });
                // Because the number of nodes is large, we select part of the nodes to show
                if (this.links.length > 50) {
                    this.partLinks = this.links.slice(0, 50);
                    let ids = [];
                    for(let item of this.partLinks){
                        if(!ids.find(element => element === item.source)){
                            ids.push(item.source);
                        }
                        if(!ids.find(element => element === item.target)){
                            ids.push(item.target);
                        }
                    }
                    this.partNodes = this.nodes.filter(element =>  ids.indexOf(element.id) !== -1);
                } else {
                    this.partLinks = this.links;
                    this.partNodes = this.nodes;
                }
                const option = {
                    title: {
                        top: 'bottom',
                        left: 'right'
                    },
                    legend: [{
                        data: categories.map(function (a) {
                            return a.name;
                        })
                    }],
                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series : [
                        {
                            type: 'graph',
                            layout: 'circular',
                            circular: {
                                rotateLabel: true
                            },
                            data: this.partNodes,
                            links: this.partLinks,
                            categories: categories,
                            roam: false,
                            // label: {
                            //     normal: {
                            //         position: 'right',
                            //         formatter: '{b}'
                            //     }
                            // },
                            lineStyle: {
                                normal: {
                                    color: 'source',
                                    curveness: 0.3
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
                                // 点击到了 graph 的 edge（边）上。
                                const data = params.data
                                const links = that.links.filter( link => { return link.source === data.source && link.target === data.target });
                                that.click_node = links[0];
                                const nodes = that.nodes.filter( node => { return node.id === data.source || node.id === data.target });
                                const option = {
                                    series : [
                                        {         
                                            data: nodes,
                                            links: links,
                                        }
                                    ]
                                };
                                myChart.setOption(option);
                            }
                            else {
                                // 点击到了 graph 的 node（节点）上。
                                const id = params.data.id;
                                const links = that.links.filter( link => { return link.source === id || link.target === id });
                                that.click_node = that.nodes.filter( node => { return node.id === id })[0];
                                let seleted_node = new Set();
                                for(let link in links) {
                                    seleted_node.add(links[link].source);
                                    seleted_node.add(links[link].target); 
                                }
                                
                                const nodes = that.nodes.filter( node => { return seleted_node.has(node.id) });
                                console.log('node:', nodes, links);
                                const option = {
                                    series : [
                                        {         
                                            data: nodes,
                                            links: links,
                                        }
                                    ]
                                };
                                myChart.setOption(option);
                            }
                        }
                    }
                });
            })
        },
        updateChart: function() {
            let myChart = this.$echarts.init(document.getElementById('main'));
            const testNode = [
                { id:'0', name:'0'},
                { id:'1', name:'1'},
                { id:'2', name:'2'},
            ];
            const testLink = [
                {id:'0', name:'0',source:'1', target:'0'},
                {id:'1', name:'2',source:'2', target:'0'},
                {id:'2', name:'1',source:'2', target:'1'},
            ];
            const option = {
                series : [
                    {         
                        // data: this.nodes,
                        // links: this.links,
                        data: testNode,
                        links: testLink,
                    }
                ]
            };
            myChart.setOption(option);
        },
        reduceChartData: function() {
            this.updateChart()
        },
        showSelectedData: function(node) {

        },
        resetData: function(){
            let myChart = this.$echarts.init(document.getElementById('main'));
            const option = {
                series : [
                    {         
                        data: this.partNodes,
                        links: this.partLinks,
                    }
                ]
            };
            myChart.setOption(option);
            this.click_node = {};
        },
        testChartData: function(){
            let myChart = this.$echarts.init(document.getElementById('main'));
            const testLink = [
                {id:'1', name:'1',source:'1', target:'2',lineStyle: {}}
            ];
            const option = {
                series : [
                    {         
                        links: testLink,
                    }
                ]
            };
            myChart.setOption(option);
        },
        handleNodeClick: function(data) {
            const label = data.label;
            let myChart = this.$echarts.init(document.getElementById('main'));
            let diagnosis = [];
            for(let link of this.links) {
                if(!diagnosis.includes(link.diagnosis)) {
                    diagnosis.push(link.diagnosis);
                }
            }
            if(diagnosis.includes(label)) {
                const links = this.links.filter( link => { return link.diagnosis === label });
                let node_id = [];
                for(let link of links) {
                    if(!node_id.includes(link.source)) {
                        node_id.push(link.source);
                    }
                    if(!node_id.includes(link.target)) {
                        node_id.push(link.target);
                    }
                }
                const nodes = this.nodes.filter( node => { return node_id.includes(node.id) });
                this.click_node = links[0];
                const option = {
                    series : [
                        {         
                            data: nodes,
                            links: links,
                        }
                    ]
                };
                myChart.setOption(option);
            }else {
                if(!this.nodes.find(item => item.name === label)) {
                    return;
                }
                const id = this.nodes.find(item => item.name === label).id;               
                const links = this.links.filter( link => { return link.source === id || link.target === id });
                this.click_node = this.nodes.filter( node => { return node.id === id })[0];
                let seleted_node = new Set();
                for(let link in links) {
                    seleted_node.add(links[link].source);
                    seleted_node.add(links[link].target); 
                }
                const nodes = this.nodes.filter( node => { return seleted_node.has(node.id) })
                const option = {
                    series : [
                        {         
                            data: nodes,
                            links: links,
                        }
                    ]
                };
                myChart.setOption(option);
            }
            
        },
        renderContent(h, { node, data, store }) {
            return (
            <span class="custom-tree-node">
                <span>{node.label}</span>
            </span>);
        },
        exitSocket() {
            this.socket.close();
        }

    },
    watch: {
        keyword(val, oldVal){
            if(val !== ''){
                this.handleNodeClick({label: val});
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.chart {
    position: absolute;
    /* left: 30%; */
    top: 100px;
    height: 680px;
    width: 800px;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 60px;
}
.title {
  top: 20px;
  text-align: center;
  font-size: 30px;
  width: 800px;
}
.lead {
  margin-top: 50px;
  font-size: 22px;
}
.card {
    left: 80px;
}
.box-card {
    margin-left: 120px;
    width: 480px;
    height: 100%;
}
// .el-tree>.el-tree-node{display:inline-block;}
// .el-tree {
//     min-width: 100%;
//     display:inline-block;
// }
.el-tree {
    min-width: 100%;
    display: inline-block !important;
}
.el-scrollbar {
    height: 100%;
}

</style>

