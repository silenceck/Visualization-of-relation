<template>
    <div class="myNetworks">
        <el-table
            :data="tableData"
            style="width: 100%; fontSize: 18px;"
            :header-cell-style="headerStyle"
            :cell-style='headerStyle'>
                <el-table-column
                    prop="field"
                    label="Field"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="numOfNodes"
                    label="Number of nodes"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="numOfLinks"
                    label="Number of edges"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="Creation time"
                    width="200">
                </el-table-column>
                <el-table-column
                label="Operation"
                width="360">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleLook(scope.$index, scope.row)" type='primary' class="button">View</el-button>
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)" type='success' class="button">Edit</el-button>
                        <el-button
                        size="mini"
                        @click="handleExport(scope.$index, scope.row)" type='info' class="button">Export</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)" class="button">Delete</el-button>
                    </template>
                </el-table-column>
        </el-table>
        <el-row>
        <el-col>
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
    name: 'myNetworks',
    components: { 
    },
    data(){
        return {
            headerStyle: {textAlign: 'center'},
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
    mounted: function(){
        this.getNetwork();
    },
    methods: {
        getNetwork: function(){
            const id = this.$store.getters.user.id;
            this.$api.network.getNetworkByUser(id)
            .then(res => {
                const networks = res.data.networks;
                for(let network of networks) {
                    const date = new Date(network.time);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    network.time = year + '/' + month + '/' + day; 
                }
                this.allTableData = networks;
                this.filterTableData = networks;
                this.setPaginations();
            });
        },
        setPaginations () {
            this.paginations.total = this.allTableData.length
            this.paginations.page_index = 1
            this.paginations.page_size = 10
            this.tableData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size
            })
        },
        handleSizeChange (page_size) { 
            this.paginations.page_index = 1
            this.paginations.page_size = page_size
            this.tableData = this.allTableData.filter((item, index) => {
                return index < page_size
            })
        },
        handleCurrentChange (page) { 
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
        handleLook (index, row) {
            this.$store.dispatch('setIndex', 'index');
            this.$router.push({path:'/home',query: {field: row.field}});
        },
        handleEdit (index, row) {
            this.$store.dispatch('setIndex', 'create_chart');
            this.$router.push({path:'/create_chart',query: {field: row.field}});
        },
        handleDelete(index, row){
            const id = row._id;
            this.$api.network.deleteNetwork({field:row.field,id: id})
            .then(res => {
                this.allTableData = this.allTableData.filter(item => {
                    return item._id !== id
                });
                this.filterTableData = this.filterTableData.filter(item => {
                    return item._id !== id
                });
                this.setPaginations();
            })
        },
        handleExport(index, row){
            const field = row.field;
            this.$api.network.exportNetwork(field)
            .then(res => {
                const fileData = res.data.data;
                for(let fileName in fileData) {
                    const blob = new Blob(['\ufeff' + fileData[fileName]], {type: 'text/csv,charset=UTF-8'}); 
                    const csvUrl = URL.createObjectURL(blob); 
                    let link = document.createElement('a'); 
                    link.download = fileName; 
                    link.href = csvUrl;
                    link.click();
                }
            })
        }
    }
}
</script>

<style scoped>
.pagination {
    margin-left: 5px;
}
.button {
    font-size: 18px;
}
</style>

