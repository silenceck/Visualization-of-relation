<template>
    <div class="index">
        <el-upload
          class="upload-demo"
          action="http://localhost:8080/api/networks/v1/file"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="30"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary" @click="uploadFile">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="http://localhost:8080/api/networks/v1/file"
          :on-success="uploadSuccess"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
    
</template>

<script>
export default {
    name: 'uploadData',
    data() {
      return {
        keyword: '', //search content
        fileList: [], // :http-request="uploadFile"
        fileData: [],
      }
    },
    methods: {
       submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      uploadSuccess(response, file, fileList) {
        console.log(response.data);
      },
      uploadFile:function(item){
          const form = new FormData()
          form.append('file', item.file)
          this.$http.post('/api/networks/v1/file', form).then(res => {
                console.log('上传成功')
              }).catch(err => {
                console.log(err);
              })
          },
    }
}
</script>

<style scoped>
.index{
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* .rightContainer{
  position: relative;
  top:0;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 71px);
  overflow: auto;
} */
</style>

