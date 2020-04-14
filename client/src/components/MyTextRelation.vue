<template>
    <div class="myNetworks">
        <el-table
            :data="tableData"
            style="width: 100%;"
            max-height="600">
                <el-table-column
                    prop="content"
                    label="文本"
                    width="400">
                </el-table-column>
                <el-table-column
                    prop="keyword1"
                    label="关键词1"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="relation"
                    label="关系类型"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="keyword2"
                    label="关键词2"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="创建时间"
                    width="180">
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
        this.getTexts();
    },
    methods: {
        getTexts: function(){
            const username = this.$store.getters.user.name;
            this.$http.get(`/api/texts/v1/${username}`)
            .then(res => {
                const texts = res.data.texts;
                for(let text of texts) {
                    const date = new Date(text.time);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    text.time = year + '/' + month + '/' + day; 
                }
                this.allTableData = texts;
                this.filterTableData = texts;
                this.setPaginations();
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
    }
}
</script>

<style scoped>
.pagination {
    margin-left: 5px;
}
</style>

