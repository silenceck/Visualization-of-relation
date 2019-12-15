<template>
    <div class="myNetworks">
        <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="field"
                    label="领域"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="numOfNodes"
                    label="节点数目"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="numOfLinks"
                    label="关系数目"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="创建时间"
                    width="240">
                </el-table-column>
                <el-table-column
                label="操作"
                width="180">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        // this.setPaginations();
        this.getNetwork();
    },
    methods: {
        getNetwork: function(){
            const username = this.$store.getters.user.name;
            this.$http.get(`/api/networks/v1/${username}`)
            .then(res => {
                const networks = res.data.networks;
                this.allTableData = networks;
                this.filterTableData = networks;
                this.setPaginations()
            });
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
        handleEdit (index, row) {
            this.$router.push({path:'/2',query: {field: row.field}});
        },
        handleDelete(index, row){
            
        }
    }
}
</script>

<style scoped>

</style>

