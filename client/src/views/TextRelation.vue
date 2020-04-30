<template>
    <div class="pubmedCreeper"> 
        <div class="keyword"> 
            <el-row :gutter='20' class="row1">
                <el-col :span="18">
                    <div class="keywords">
                        <el-scrollbar style="height:100%;" wrapStyle="overflow-x:hidden;">
                            <span v-for="keyword in keywords" :key="keyword" >
                                <span class="keyword-view-item">
                                    {{keyword}}  <span class="icon" @click="deleteKeyword(keyword)" > <i class="el-icon-close" style="font-size: 3px;"></i> </span>
                                </span>
                            </span>
                        </el-scrollbar>
                    </div>
                </el-col>
                <el-col :span="6">
                    <el-button class="keyBtn" @click="dialogKeywordVisible = true" >Add Keyword</el-button>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :span="18">
                    <el-input
                        type="textarea"
                        :rows="12"
                        placeholder=""
                        v-model="textarea" 
                        class="textarea">
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button @click="submit" class="keyBtn1">Extract causality </el-button>
                </el-col>
            </el-row>
            <el-dialog title="Confirm Keyword" :visible.sync="dialogKeywordVisible"  width="30%" top="25vh" >
                <el-input class="dialog" v-model="words" style="width: 100%"></el-input> 
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogKeywordVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="addKeyword">OK</el-button>
                </div>
            </el-dialog>
        </div>
        <el-row :gutter='20'>
                <el-col :span="18">
                    <div class="tabel">
            <div class="text">
                <el-table
                    :data="tableData"
                    :header-cell-style="headerStyle"
                    :cell-style='headerStyle'
                    style="width: 100%">
                        <el-table-column
                            prop="num"
                            label="#"
                            width="80">
                        </el-table-column>           
                        <el-table-column
                            prop="keyword1"
                            label="Keyword1"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="keyword2"
                            label="Keyword2"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="relation"
                            label="Type(1:cause relation, 2:caused relation, 3: related relation, 0: no relation)"
                            width="560">
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
            </div>
            </el-col>
            <el-col :span="6">
                <el-button @click="edit" class="keyBtn">Edit causal graph</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import io from 'socket.io-client'
export default {
    name: "pubmedCreeper",
    data(){
        return{
            relation_label: null,
            ifshow: false,
            ifLeftShow: false,
            ifRightShow: false,
            label: 2,
            keywords: ["alcohol", "depression", "diabetes", "heart disease", "heart rate", "hypertension", "stroke", "cancer", "smoke", "heart attack", "systolic blood pressure", "eyesight", "height"],
            words: '',
            dialogKeywordVisible: false,
            line1Style: {},
            line2Style: {},
            blackspaceStyle: {},
            keyword2Style: {},
            key1: '',
            key2: '',
            sentences: [],
            textarea: "Hazardous users of alcohol and smokers had 3.1 respectively 3.0 times higher risk for depression (p = 0.001 respectively 0.003). Life satisfaction and happiness were associated with a lower risk of depression, while hazardous alcohol drinking and poor sleep quality were related to a higher risk of depression. At 6 weeks after discharge, patients completed standardized measures for 5 risk factors (pain intensity, depression, posttraumatic stress disorder, alcohol abuse, and tobacco use) and 4 protective factors (resilience, social support, self-efficacy for return to usual activity, and self-efficacy for managing the financial demands of recovery). Our data revealed that depression proneness confers vulnerability to alcohol, emulating patterns of alcohol dependence seen in human addicts, and that depression resilience to a large extent protects from the development of AUD-like phenotypes. Increased formaldehyde (FA) and up-regulation of semicarbazide-sensitive amine oxidase, which forms FA from methylamine, have been implicated in disorders such as cerebrovascular disorders, alcohol abuse, diabetes and Alzheimer's disease.  Mortality was significantly increased for all malignant tumours, oesophageal cancer, bowel cancer, liver cancer, lung cancer, alcoholism, ischaemic heart disease, non-malignant respiratory diseases, liver cirrhosis, external causes and suicides. Prominent primary diagnosis subgroups included asphyxia and respiratory failure (15.2%), traumatic brain injury and skull fractures (11.3%), acute myocardial infarction and ischemic heart disease (10.9%), poisonings and drug and alcohol disorders (6.7%), dysrhythmias (6.7%), hemorrhagic and nonhemorrhagic stroke (5.9%), acute heart failure and cardiomyopathies (5.6%), pneumonia and aspiration (4.9%), and sepsis, septicemia, and septic shock (3.2%). A physiological correlate of emotional regulation is autonomic flexibility, emotional dysregulation in men who misuse alcohol being correlated with reduced parasympathetic activation to control heart rate variability during stress and/or conflict situations.  Subjective alcohol craving and heart rate variability were recorded across the task.  The content encompasses heavy alcohol consumption, depression, diabetes, folic acid intake, hypertension, normal weight, recommended physical activity, current smoking, unwanted pregnancy, and use of contraception. In this study, the causal effect of alcohol intake on hypertension in 2,011 men and women from the Ansan-Ansung cohort was estimated using an instrumental variable (IV) approach, with both a phenotypic and genotypic instrument for alcohol intake: alcohol flushing and the rs671 genotype (in the alcohol dehydrogenase 2 [ALDH2] gene), respectively. A significant association was observed between alcoholic intoxication and mesenteric ischemia (aHR, 5.21; 95% CI, 4.36-6.23; P<.0001) after adjustment for age, sex, and comorbidity history of hypertension, hyperlipidemia, diabetes, atrial fibrillation, stroke, heart failure, chronic renal disease, ischemic heart disease, chronic obstructive pulmonary disease, and cirrhosis. VTE prophylaxis was negatively associated with smoking, alcohol, warfarin in the past 30 days, and primary diagnoses of stroke, infectious disease, or inflammatory bowel disease.  Although crude mortality rates of the most important causes of death (such as cardiovascular diseases or cancer) have declined between 2010 and 2014, crude mortality rates of drug- and alcohol-induced causes of death have increased. To assess changes in metabolic risk factors and cancer-related growth factors associated with short-term abstinence from alcohol. The purpose of this study was to examine relationships among menopausal symptoms, depression, and quality of life and to identify the factors affecting the quality of life in premenopausal women with breast cancer. In HF patients the symptom burden is similar to cancer patients, but patients with advanced HF, in comparison to advanced cancer patients, have a greater number of physical symptoms, worse depression status and lower spiritual well-being. In the decade since their discovery, the PH domain leucine-rich repeat protein phosphatases (PHLPP) have emerged as critical regulators of cellular homeostasis, and their dysregulation is associated with various pathophysiologies, ranging from cancer to degenerative diseases, such as diabetes and heart disease. By the end of its first 10 years, the agency was funding ten projects in clinical trials, including work in heart disease and cancer, HIV/AIDS and Type 1 diabetes. Several beneﬁcial pharmacological properties of this plant such as anti-oxidant, anti-bacterial, anti-histaminic, anti-hypertensive, hypoglycemic, anti-fungal, anti-inﬂammatory, anti-cancer and immunomodulatory effects were reported and different therapeutic properties such as reliving bronchial asthma, jaundice, hydrophobia, paralysis, conjunctivitis, piles, skin diseases, anorexia, headache, dysentery, infections, obesity, back pain, hypertension and gastrointestinal problems, have been described for the seeds of N. sativa and its oil. The results were controversial with regards to using the QuantiFERON test for the diagnosis of TB according to the study population (ethnic group, bacillus Calmette-Gurin vaccine use) and according to the state of the immune system of the people studied (human immunodeficiency virus immunosuppression in cancer medication, hypertension). We recently showed that nonsteroidal anti-inflammatory drugs (NSAIDs) are able to inhibit the lung tumors induced by cigarette smoke, either mainstream (MCS) or environmental (ECS), in female mice. We reviewed 87 epidemiological studies relating environmental tobacco smoke (ETS) exposure to risk of cancer other than lung or breast in never smoking adults. This community-based cohort included 12554 participants in the Kailun study, who were free of myocardial infarction, stroke, arrhythmia, and cancer. 16 studies that provided estimates for mortality due to all cause, all cancer, upper aerodigestive tract (UADT) cancer, stomach cancer, cervical cancer, ischaemic heart disease (IHD) and stroke were included.",
            tableData: [
            ],
            num: 1,
            allTableData: [],
            filterTableData: [],
            paginations: {
                page_index: 1, // 当前位于哪一页
                total: 0, // 总数
                page_size: 5, // 一页显示多少条
                page_sizes: [5,10], // 每页显示多少条
                layout: 'total,sizes,prev,pager,next,jumper' //翻页属性
            },
            socket: null,
            serverAddress: 'http://localhost:5000',
            headerStyle: {textAlign: 'center'},
        }
    },
    mounted: function(){ 
        const relationData = this.$store.getters.relationData;
        if (relationData.length === 0) {
            this.tableData = relationData;
            this.allTableData = this.tableData;
            this.filterTableData = this.tableData;
            this.setPaginations();
            this.$store.dispatch('setRelationData', []);
        }
    },
    methods: {
        submit: function(){ 
            this.socket = io.connect(this.serverAddress);          
            if(this.keywords.length > 0 && this.textarea !== ''){
                const keywords = this.keywords;
                const text = this.textarea;
                const data = {
                    keywords: keywords,
                    text: text,
                }
                this.socket.emit('text data', JSON.stringify(data));
                const that = this;
                this.socket.on('res message', function(msg){
                    that.notify();
                    const data = JSON.parse(msg.pop());
                    let tableData = [];
                    let num = 1;
                    for(let key in data) {
                        let keywordPair = key.split('-');
                        if (that.tableData) {
                            that.tableData.push({
                                num: that.num,
                                keyword1: keywordPair[0],
                                keyword2: keywordPair[1],
                                relation: data[key],
                            })
                            that.num += 1;
                        } else {
                            tableData.push({
                                num: that.num,
                                keyword1: keywordPair[0],
                                keyword2: keywordPair[1],
                                relation: data[key],
                            })
                            num += 1;
                        }
                    }
                    if (that.tableData) {
                        that.$store.dispatch('setRelationData', that.tableData);
                        that.allTableData = that.tableData;
                        that.filterTableData = that.tableData;
                        that.setPaginations();
                    } else {
                        that.$store.dispatch('setRelationData', tableData);
                    }
                    that.socket.close();
                });
            }else{
                this.$message.error('The input box cannot be empty！！！');
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
        // save function is not used
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
            this.paginations.page_size = 5
            // Set the default paging data
            this.tableData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size
            })
        },
        // Control the amount of data displayed on a page
        handleSizeChange (page_size) { 
            this.paginations.page_index = 1
            this.paginations.page_size = page_size
            this.tableData = this.allTableData.filter((item, index) => {
                return index < page_size
            })
        },
        // Paging jump
        handleCurrentChange (page) { 
            let tables = []
            let index = this.paginations.page_size * (page - 1)
            let nums = this.paginations.page_size * page
            for (let i = index; i < nums; i++) {
                if (this.allTableData[i]) {
                tables.push(this.allTableData[i])
                }
            }
            this.tableData = tables
        },
        deleteKeyword(keyword) {
            this.keywords = this.keywords.filter(element => element !== keyword);
        },
        addKeyword() {
            this.dialogKeywordVisible = false;
            const temp = this.words.trim().split(/,+/);
            for(let item of temp) {
                if(!this.keywords.includes(item)) {
                    this.keywords.push(item);
                }
            }
            this.words = ''
        },
        edit() {
            this.$store.dispatch('setIndex', 'create_chart');
            this.$router.push({name:'create_chart', params: {RelationData: this.tableData}});
        },
        notify() {
            this.$notify({
                title: 'success',
                message: 'Causality extraction completed',
                type: 'success'
            });
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
.key1 {
    margin-left: 600px;
}
.key2 {
    position:absolute;
    left: 840px;
}
.btn {
    /* position:absolute; */
    /* left: 1000px; */
    margin-left: 10px;
    margin-top: 10px;
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
    width: 1000px;
    height: 200px;
    margin-top: 20px;
    margin-left: 25%;
    margin-bottom: 40px;
    font-size: 16px;
}
.pagination {
    margin-left: 5%;
}
.chart {
    margin-left: 5%;
    width: 800px;
    height: 600px;
}
.keyBtn {
    margin-left: 10px;
    margin-top: 85px;
}
.keyBtn1 {
    margin-left: 10px;
    margin-top: 260px;
}
.keywords {
    width: 1000px;
    height: 100px;
    margin-top: 20px;
    margin-left: 25%;
    border: 1px solid #d8dce5;
}
.keyword-view-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 16px;
    margin-left: 5px;
    margin-top: 4px;
}
.icon {
    width: 16px;
    height: 16px;
    vertical-align: 2px;
    border-radius: 50%;
    text-align: center;
    -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
    transition: all .3s cubic-bezier(.645,.045,.355,1);
    -webkit-transform-origin: 100% 50%;
    transform-origin: 100% 50%;
}
.icon:hover {
    background-color: rgb(223, 214, 214);
}
.tabel {
    margin-top: 50px;
    margin-left: 25%;
    width: 1000px;
}
.keyword {
    margin-top: 30px;
}
</style>
