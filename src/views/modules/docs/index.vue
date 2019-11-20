<template>
 <div v-once>
   <!--对低开销的静态组件，使用v-once将渲染结果缓存起来-->
  <el-card>
    <div class="markdown-body">
        <markdown></markdown>
    </div>
  </el-card>
  </div>
</template>
<script>
import markdown from './md/doc.md'
// import 'github-markdown-css/github-markdown.css'
export default {
  name: 'docs',
  components: {
    markdown
  }
}
</script>
<style lang="scss">
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  // margin: 0 auto;
  padding: 45px;
}
</style>
