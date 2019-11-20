<template>
  <div class="content">
    <transition name="fade-in">
     <router-view class="views"></router-view>
     </transition>
  </div>
</template>
<script>
export default {
  name: 'adminContent'
}
</script>