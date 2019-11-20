<template>
  <!-- <el-dialog custom-class="my-dialog" top="15%" :visible="true" size="tiny" :close-on-click-modal="false" :beforeClose="closeModal" @close="closeModal"> -->
    <div class="my-dialog">
    <h5 class="form-title" slot="title">添加活动组</h5>
    <el-form ref="form" :model="form" label-width="100px" label-position="left" class="my-dialog-form">
      <el-form-item label="活动组名称:">
        <el-input v-model="form.title" class="form-input" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="所属游戏:">
        <el-select v-model="form.appId" class="form-input">
          <el-option v-for="(item,index) in appList" :key="index" :label="item.appName" :value="item.appId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addGroup">添加活动组</el-button>
        <el-button type="default" size="small" @click="closeModal">取消</el-button>
    </div>
  </div>
</template>
<script>
import services from "@/services";
export default {
  name: "active-group-add",
  data() {
    return {
      form: {
        title: "",
        appId: null
      }
    };
  },
  computed: {
    appList() {
      return this.$store.state.appList;
    }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    checkParams() {
      if (!this.form.title) {
        this.$message({
          message: "请输入活动名称",
          type: "warning"
        });
        return false;
      } else if (this.form.appId === null) {
        this.$message({
          message: "请选择所属游戏",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    addGroup() {
      if (!this.checkParams()) return;
      else {
        let params = {
          actInfo: JSON.stringify({
            title: this.form.title, // 活动组名称
            appId: this.form.appId // 所属游戏
          })
        };
        services.activity.updateGroup(params).then(data => {
          if (data.code == 200) {
            this.$notify({
              message: "活动组添加成功!",
              type: "success"
            });
            this.$emit("close");
            this.$emit("getActivityGroup");
          } else {
            this.$notify({
              message: data.state,
              type: "warning"
            });
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// .form-input {
//    width: 290px;
// }

// .form-num-input {
//   width: 80px;
//   margin-left: 5px;
// }

// .form-tip-desc {
//   font-size: 10px;
//   color: #bbb;
//   display: block;
//   line-height: 20px;
// }

// .row-item {
//   padding: 5px 0;
//   display: block;
//   margin: 0;
// }
</style>
