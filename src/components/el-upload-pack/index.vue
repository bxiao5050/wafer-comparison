<template>
  <el-upload class="upload-demo" name="uploadfile" :headers="headers" :action="requestUrl+'/admin/upload/resource'" style="display:inline;margin-left:30px;"
                :show-file-list="false" :on-progress="uploadProgress" :on-success="uploadSuccess" :before-upload="uploadBefore"
                :on-error="uploadError">
                <el-button type="primary" size="small">上传</el-button>
              </el-upload>
</template>
<script>
export default {
  name: 'upload',
  props: ['item'],
  computed: {
    headers() {
      return {
        Authorization: 'Basic ' + this.$store.state.userCode
      }
    },
    requestUrl() {
      return this.$store.state.requestUrl
    }
  },
  methods: {
    uploadBefore(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 1MB!')
      } else {
        this.loading = this.$loading({
          fullscreen: true,
          customClass: 'my-loading'
        })
      }
      return isLt2M
    },
    //上传成功
    uploadSuccess(res, file) {
      this.loading.close()
      this.$emit('changePercent', 0)
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      this.$emit('responseResource', res.state)
      // this.config.forEach(item => {
      //   if (this.uploadId == item.conditionId == 'ce59f4f3-75c9-472b-bfe7-0280405df206') {
      //     //固定玩家资格配置 资源上传
      //     item.importId = res.state
      //   } else if(this.uploadId == item.conditionId == 'a4ded85d-69e3-4132-90d3-59dadc98312f'){
      //     // 投票 资源上传
      //     item.resourceId = res.state
      //   }
      // })
    },
    //上传失败
    uploadError(res, file) {
      this.loading.close()
      this.$emit('changePercent', 0)
      this.$message.error('上传失败')
    },
    //上传进度事件
    uploadProgress(event, file) {
      let load = event.loaded
      let total = event.total
      this.$emit('changePercent', Number((load / total * 100).toFixed(0)))
      // this.uploadPercent = Number((load / total * 100).toFixed(0));
    }
  }
}
</script>
