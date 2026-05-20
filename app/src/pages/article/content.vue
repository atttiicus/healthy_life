<template>
  <view style="width:100%;height:100vh">
    <iframe :src="textUrl" style="width:100%;height:100%;border:none"></iframe>
  </view>
</template>

<script>
export default {
  data() {
    return {
      textUrl: 'https://jiankang.cctv.com/2023/12/18/ARTI2hNZkGTXrG2ybqu1JKOF231218.shtml',
    }
  },
  onLoad(query) {
    this.textUrl = decodeURIComponent(query.contUrl || '')
    uni.setNavigationBarTitle({ title: decodeURIComponent(query.title || '健康文章') })
  },
}
</script>

<style scoped></style>
