<template>
  <view class="page">

    <!-- 搜索栏 -->
    <view class="bg-white px-4 py-3 flex items-center gap-3"
          style="box-shadow:0 1px 4px rgba(0,0,0,.04)">
      <view class="flex-1 flex items-center gap-2 bg-[#f3f4f6] rounded-xl px-3 py-2">
        <van-icon name="search" size="16" color="var(--icon-secondary)" />
        <input
          class="flex-1 text-sm text-[#374151] bg-transparent"
          :value="inputKey"
          @input="onInputKey"
          placeholder="搜索健康资讯关键词"
          placeholder-style="color:#9ca3af"
        />
      </view>
      <view class="bg-[#10b981] rounded-xl px-4 py-2" @tap.stop="searchArticle">
        <text class="text-white text-sm font-medium">搜索</text>
      </view>
    </view>
        
    <!-- 返回全部 -->
    <view v-if="isSearchMode" class="px-4 pt-3">
      <view class="bg-[#ecfdf5] rounded-xl px-4 py-2 inline-flex items-center gap-1"
            @tap.stop="showAllArticles">
        <text class="text-[#059669] text-sm">← 显示全部</text>
      </view>
    </view>

    <!-- 加载中：骨架屏 -->
    <view v-if="loading" class="p-4 flex flex-col gap-3">
      <view v-for="i in 4" :key="i" class="card overflow-hidden">
        <view class="bg-[#f3f4f6]" style="height:140px"></view>
        <view class="p-4 flex flex-col gap-2">
          <view class="bg-[#f3f4f6] rounded-full" style="height:14px;width:85%"></view>
          <view class="bg-[#f3f4f6] rounded-full" style="height:12px;width:60%"></view>
          <view class="flex justify-between mt-1">
            <view class="bg-[#f3f4f6] rounded-full" style="height:10px;width:30%"></view>
            <view class="bg-[#f3f4f6] rounded-full" style="height:10px;width:20%"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载失败 -->
    <view v-else-if="hasError" class="flex flex-col items-center justify-center px-8 py-20">
      <view class="w-16 h-16 rounded-2xl bg-[#fff7ed] flex items-center justify-center mb-4">
        <van-icon name="warning-o" size="32" color="var(--icon-warning)" />
      </view>
      <text class="text-base font-semibold text-[#374151] mb-2">加载失败</text>
      <text class="text-sm text-[#9ca3af] text-center leading-relaxed mb-6">
        网络连接异常，请检查网络设置后重试
      </text>
      <view class="px-8 py-3 bg-[#10b981] rounded-xl" @tap="loadArticles">
        <text class="text-white text-sm font-medium">重新加载</text>
      </view>
    </view>

    <!-- 文章列表 -->
    <scroll-view v-else scroll-y="true" lower-threshold="50" @scrolltolower="onScrollToLower"
                 style="height:calc(100vh - 56px)">
      <view class="p-4 flex flex-col gap-3 pb-20">
        <view
          v-for="item in articleList" :key="item.aid"
          class="card overflow-hidden"
          style="box-shadow:0 2px 8px rgba(0,0,0,.05)"
          @tap.stop="enterArticle(item.content, item.title)"
        >
          <image
            v-if="item.image"
            :src="img_prefix + item.image"
            style="width:100%;height:160px;display:block;object-fit:cover"
            mode="aspectFill"
          />
          <view v-else
                class="flex items-center justify-center bg-[#f0fdf4]"
                style="height:100px">
            <van-icon name="newspaper-o" size="32" color="var(--icon-primary)" />
          </view>

          <view class="p-4">
            <text class="text-base font-semibold text-[#1f2937] leading-snug block">
              {{ item.title }}
            </text>
            <view class="flex items-center justify-between mt-2">
              <view class="flex items-center gap-2">
                <view class="tag-green">
                  <text class="text-xs text-[#059669]">健康</text>
                </view>
                <text class="text-xs text-[#9ca3af]">{{ item.author }}</text>
              </view>
              <text class="text-xs text-[#9ca3af]">{{ formatDate(item.updated_at) }}</text>
            </view>
          </view>
        </view>

        <view v-if="!articleList.length" class="text-center py-16">
          <van-empty description="暂无文章" image-size="80" />
        </view>
      </view>
    </scroll-view>

  </view>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      loading:      false,
      hasError:     false,
      isSearchMode: false,
      articleList:  [],
      allArticles:  [],
      inputKey:     '',
      img_prefix:   'http://localhost:2233/static/',
    }
  },
  computed: {
    ...mapState(['articles']),
  },
  onLoad() {
    this.loadArticles()
  },
  methods: {
    ...mapMutations(['setArticles']),

    loadArticles() {
      this.loading  = true
      this.hasError = false
      uni.request({
        url: '/api/article/all',
        method: 'GET',
        success: (res) => {
          if (res.data && res.data.data) {
            const list = res.data.data.result
            this.allArticles = list
            this.articleList = list
            this.setArticles(list)
          } else {
            this.hasError = true
          }
        },
        fail: () => {
          this.hasError = true
        },
        complete: () => {
          this.loading = false
        },
      })
    },

    onInputKey(e) {
      this.inputKey = e.detail.value
    },

    searchArticle() {
      const key = String(this.inputKey).trim()
      if (!key || /^\d+$/.test(key)) {
        uni.showToast({ title: '请输入合法关键词', icon: 'none', duration: 2000 })
        return
      }
      this.loading = true
      uni.request({
        url: `/api/article/title/${key}`,
        method: 'GET',
        success: (res) => {
          const list = res.data?.data?.result
          if (list && list.length) {
            this.articleList  = list
            this.isSearchMode = true
            uni.showToast({ title: '检索成功', icon: 'none', duration: 1500 })
          } else {
            uni.showToast({ title: '无相关文章', icon: 'none', duration: 2000 })
          }
        },
        fail: () => {
          uni.showToast({ title: '搜索失败', icon: 'none' })
        },
        complete: () => {
          this.loading = false
        },
      })
    },

    showAllArticles() {
      this.isSearchMode = false
      this.inputKey     = ''
      this.articleList  = this.allArticles
    },

    enterArticle(contUrl, contTitle) {
      if (!contUrl) return
      uni.navigateTo({
        url: `/pages/article/content?contUrl=${encodeURIComponent(contUrl)}&title=${encodeURIComponent(contTitle)}`,
        fail: () => uni.showToast({ title: '跳转失败', icon: 'none', duration: 2000 }),
      })
    },

    formatDate(d) {
      if (!d) return ''
      return d.slice(0, 10)
    },

    onScrollToLower() {},
  },
}
</script>

<style scoped></style>
