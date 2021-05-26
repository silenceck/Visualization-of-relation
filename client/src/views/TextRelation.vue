<template>
    <div class="pubmedCreeper"> 
        <div class="keyword"> 
            <el-row :gutter='20' class="row1">
                <el-col :span="4" class="keyBtn">
                    <div class="text_intro">Keyword &nbsp; <i class="el-icon-right"></i></div>
                </el-col>
                <el-col :span="14">
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
                <el-col :span="6" class="keyBtn">
                    <el-button  @click="dialogKeywordVisible = true" >Add keyword</el-button>
                </el-col>
            </el-row>
            <el-row :gutter='20' >
                <el-col :span="4" class="keyBtn">
                    <div class="text_intro1">Text &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; <i class="el-icon-right"></i></div>
                </el-col>
                <el-tabs class="delete-border" :style="selfstyle" v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="Input text" name="first" >
                        
                        <el-col :span="18">
                            <el-input
                                type="textarea"
                                :rows="8"
                                placeholder=""
                                v-model="textarea" 
                                class="textarea">
                            </el-input>
                        </el-col>
                        <el-col :span="6" class="keyBtn1">
                            <el-button  @click="submit" >Extract causality </el-button>
                        </el-col>
                    </el-tab-pane>
                    <el-tab-pane label="Upload file" name="second" class="textInput">
                        <el-input type=file name=file1 id="file_input"  v-model='filename' style="display:none"  v-on:change="changeValue"></el-input>
                        <el-input type="text" class="filename" readonly="readonly" name="abc" v-model='textname' > </el-input>
                        <el-button  @click="clickInput" size="small" type="primary" style="margin-left: 10px; margin-top: 10px; fontSize: 18px;" icon="el-icon-folder-opened">Select File</el-button>
                        <el-button id="my_button" style="margin-top: 10px;margin-left: 10px; fontSize: 18px;" size="small" type="success" @click="submitUpload" icon="el-icon-upload">Upload</el-button>
                    </el-tab-pane>
                </el-tabs>
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
                <el-col :span="4" class="keyBtn">
                    <div class="text_intro">Causality &nbsp; <i class="el-icon-right"></i></div>
                </el-col>
                <el-col :span="14">
                    <div class="tabel">
            <div class="text">
                <el-table
                    :data="tableData"
                    :header-cell-style="headerStyle"
                    :cell-style='headerStyle'
                    style="width: 100%;fontSize: 18px;">
                        <el-table-column
                            prop="num"
                            label="#"
                            width="80">
                        </el-table-column>           
                        <el-table-column
                            prop="keyword1"
                            label="Cause"
                            width="400">
                        </el-table-column>
                        <el-table-column
                            prop="keyword2"
                            label="Effect"
                            width="400">
                        </el-table-column>
                        <!-- <el-table-column
                            prop="relation"
                            label="1:cause 2:caused"
                            width="360">
                        </el-table-column> -->
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
            <el-col :span="6" class="keyBtn2" >
                <el-button @click="edit" >Edit causal graph</el-button>
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
            selfstyle: {marginLeft: "2%",marginRight: "15%"},
            activeName: 'first',
            filename: '',
            textname:'',
            uploader: null,
            relation_label: null,
            ifshow: false,
            ifLeftShow: false,
            ifRightShow: false,
            label: 2,
            keywords: [],
            words: '',
            dialogKeywordVisible: false,
            line1Style: {},
            line2Style: {},
            blackspaceStyle: {},
            keyword2Style: {},
            key1: '',
            key2: '',
            sentences: [],
            textarea: "",
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
            uploadUrl: 'http://localhost:8080/api/texts/file',
            headerStyle: {textAlign: 'center'},
        }
    },
    mounted: function(){ 
        this.socket = io.connect(this.serverAddress);
        var SocketIOFileUpload = require('socketio-file-upload');
        this.uploader = new SocketIOFileUpload(this.socket);
        
        this.uploader.listenOnSubmit(document.getElementById("my_button"), document.getElementById("file_input"));
        const relationData = this.$store.getters.relationData;
        if (relationData.length === 0) {
            this.tableData = relationData;
            this.allTableData = this.tableData;
            this.filterTableData = this.tableData;
            this.setPaginations();
            this.$store.dispatch('setRelationData', []);
        }
        
    },
    destroyed() {
        this.socket.close()
    },
    methods: {
        submit: function(){ 
            if(this.textarea !== ''){
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
                    that.allTableData = [];
                    that.num = 1;
                    for(let key in data) {
                        let keywordPair = key.split('-');
                        if (data[key] === 2) {
                            let tmp = keywordPair[0];
                            keywordPair[0] = keywordPair[1];
                            keywordPair[1] = tmp;
                        }
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
            const that = this
            this.uploader.addEventListener("start", function(event){
                event.file.meta.keyword = that.keywords.join("-");
            });
            this.words = ''
        },
        edit() {
            this.$store.dispatch('setIndex', 'create_chart');
            this.$router.push({name:'create_chart', params: {RelationData: this.allTableData}});
        },
        notify() {
            this.$notify({
                title: 'success',
                message: 'Causality extraction completed',
                type: 'success'
            });
        },
        // upload
        submitUpload() {
            // this.$refs.upload.submit();
            const that = this;
            this.socket.on('file message', function(msg){
                that.notify();
                const data = JSON.parse(msg.pop());
                let tableData = [];
                let num = 1;
                that.tableData = [];
                that.num = 1;
                for(let key in data) {
                    let keywordPair = key.split('-');
                    if (data[key] === 2) {
                        let tmp = keywordPair[0];
                        keywordPair[0] = keywordPair[1];
                        keywordPair[1] = tmp;
                    }
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
                that.textname = '';
            });
        },
        beforeUpload(file) {
            var testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'txt'
            if(!extension) {
                this.$message({
                    message: 'Uploaded file can only be txt format!!',
                    type: 'warning'
                });
                return false;
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`The current limit is 3 files, this time it is selected ${files.length} files，chose ${files.length + fileList.length} files`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`Sure to remove ${ file.name }？`);
        },
        uploadSuccess(response, file, fileList) {
            this.fileList = [];
            if (response.type === 'node' ) {
                const nodes = response.data;
                for( let node of nodes) {
                    node.id = String(this.nodeId);
                    node.type = node.label;
                    this.nodes.push(node);
                    this.nodeId += 1;
                }
                let node = nodes[0];
                let concept = {};
                if(!this.conceptTabelData.find(item => item.concept === node.label)) {
                    concept.type = node.label;
                    let propertyName = [];
                    for(let property in node) {
                        if(property !== 'draggable' && property !== 'field' && property !== 'id' && property !== 'category' && property !== 'type' && property !== 'label') {
                            propertyName.push(property);
                        }
                    }
                    concept.property = propertyName;
                    this.concepts.push(concept);
                    this.allTableData.push({
                        number: this.conceptNum,
                        concept: concept.type,
                    }) 
                    this.conceptNum += 1;
                    this.setPaginations();
                }
            } else {
                const links = response.data;
                const labels = response.label;
                for( let link of links) {
                    const source_node = this.nodes.find(element => element.name === link.sourceName);
                    const target_node = this.nodes.find(element => element.name === link.targetName);
                    if (source_node && target_node) {
                        delete link.sourceName;
                        delete link.targetName;
                        link.id = String(this.linkId);
                        link.source = source_node.id;
                        link.target = target_node.id;
                        this.links.push(link);
                        this.linkId += 1;
                    }
                }
            }
            // this.allTableData = this.conceptTabelData;
            // this.filterTableData = this.conceptTabelData;
            // this.setPaginations();
        },
        clickInput() {
            document.getElementById('file_input').click()
        },
        changeValue() {
            const filename = this.filename.split('\\')
            this.textname =filename[filename.length - 1]
        },
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}
</script>

<style>
.textInput .el-input {
    margin-left: 10px;
    margin-top: 100px;
    width: 250px;
}
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
.textarea .el-textarea__inner {
    font-size: 20px;
    width: 1000px;
    height: 200px;
    margin-top: 20px;
}
.pagination {
    margin-left: 5%;
}
.keyBtn .el-button {
    margin-top: 90px;
    font-size: 20px;
}
.keyBtn1 .el-button  {
    margin-left: 138px;
    margin-top: 170px;
    font-size: 20px;
}
.keyBtn2 .el-button {
    margin-top: 10px;
    font-size: 20px;
}
.keywords {
    width: 1000px;
    height: 100px;
    margin-top: 20px;
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
    font-size: 20px;
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
    /* margin-left: 20%; */
    width: 1000px;
}
.keyword {
    margin-top: 30px;
}
.el-tab-pane {
    height: 300px;
    
}
.delete-border .el-tabs__nav-wrap::after{
    height: 0;
}
.delete-border .el-tabs__item {
    font-size: 20px;
}
.text_intro {
    margin-top: 50px;
    text-align:center;
    font-size: 30px;
    color: rgb(166, 40, 47);
}

.text_intro1 {
    margin-top: 150px;
    text-align:center;
    font-size: 30px;
    color: rgb(166, 40, 47);
}
.filename .el-input__inner {
    font-size: 18px;
}

</style>
