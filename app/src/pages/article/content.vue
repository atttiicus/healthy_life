<template>
  <view style="width:100%;height:100vh;position:relative;background:#fff">

    <!-- 加载中 -->
    <view v-if="loading"
          class="flex flex-col items-center justify-center"
          style="height:100vh">
      <van-loading type="spinner" color="#10b981" size="36" />
      <text class="text-xs text-[#9ca3af] mt-3">文章加载中...</text>
    </view>

    <!-- 加载失败 -->
    <view v-if="hasError"
          class="flex flex-col items-center justify-center px-8"
          style="height:100vh">
      <view class="w-16 h-16 rounded-2xl bg-[#fff7ed] flex items-center justify-center mb-4">
        <van-icon name="warning-o" size="32" color="var(--icon-warning)" />
      </view>
      <text class="text-base font-semibold text-[#374151] mb-2">加载失败</text>
      <text class="text-sm text-[#9ca3af] text-center leading-relaxed mb-6">
        无法加载文章内容，请检查网络后重试
      </text>
      <view class="px-8 py-3 rounded-xl" style="background:#10b981" @tap="reload">
        <text class="text-white text-sm font-medium">重新加载</text>
      </view>
    </view>

    <!-- iframe -->
    <iframe
      v-if="textUrl && !hasError"
      :src="textUrl"
      style="width:100%;height:100%;border:none;display:block"
      @load="onLoad"
      @error="onError"
    />

  </view>
</template>

<script>
export default {
  data() {
    return {
      textUrl:  '',
      loading:  true,
      hasError: false,
    }
  },
  onLoad(query) {
    this.textUrl = decodeURIComponent(query.contUrl || '')
    uni.setNavigationBarTitle({ title: decodeURIComponent(query.title || '健康文章') })
    if (!this.textUrl) {
      this.loading  = false
      this.hasError = true
    }
  },
  methods: {
    onLoad()  { this.loading = false },
    onError() { this.loading = false; this.hasError = true },
    reload()  { this.hasError = false; this.loading = true },
  },
}
</script>

<style scoped></style>
