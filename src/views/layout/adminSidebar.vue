<template>
  <div class="sidebar">
      <ul class="sidebar-tree">
        <template v-for="(first) in Menus">
              <router-link tag="li" class="sidebar-item" :to="{name:second.menuUrl}" v-for="(second,secondIndex) in first.children" :key="secondIndex">
                <a href="javascript:void(0)" class="item-content">
                <i :class="second.icon"></i>
                <span class="item-text">{{second.name}}</span>
                <i></i>
                </a>
              </router-link>
        </template>
      </ul>
  </div>
</template>
<script>
export default {
  name: 'adminSideBar',
  data: function() {
    let env = this.$store.state.env
    return {
      open: true,
      activeItem: 0,
      Menus: [
        {
          id: 1,
          name: '活动管理-' + (env ? '测试' : '正式'),
          menuUrl: null,
          children: [
            {
              id: 10,
              name: '添加活动',
              menuUrl: 'addactivity',
              icon: 'el-icon-plus'
            },
            {
              id: 11,
              name: '活动组管理',
              menuUrl: 'activegroup',
              icon: 'icon-group'
            },
            // {
            //   id: 12,
            //   name: '活动管理',
            //   menuUrl: 'activelist'
            // },
            // {
            //   id: 13,
            //   name: '礼包管理',
            //   menuUrl: 'giftlist'
            // },
            {
              id: 14,
              name: '获奖查询',
              menuUrl: 'query',
              icon:'el-icon-refresh'
            },
            {
              id: 15,
              name: '活动工具',
              menuUrl: 'tools',
              icon: 'el-icon-setting'
            }
          ]
        }
      ]
    }
  }
}
</script>