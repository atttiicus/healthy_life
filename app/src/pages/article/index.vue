<template>
  <view class="page">

    <!-- 搜索栏 -->
    <view class="bg-white px-4 py-3 flex items-center gap-3"
          style="box-shadow:0 1px 4px rgba(0,0,0,.04)">
      <view class="flex-1 flex items-center gap-2 bg-[#f3f4f6] rounded-xl px-3 py-2">
        <text class="text-[#9ca3af]">🔍</text>
        <input
          class="flex-1 text-sm text-[#374151] bg-transparent"
          :value="inputKey === '请输入相关文章关键字' ? '' : inputKey"
          @input="onInputKey"
          placeholder="搜索文章关键词"
          placeholder-style="color:#9ca3af"
        />
      </view>
      <view class="bg-[#10b981] rounded-xl px-4 py-2" @tap.stop="searchArticle">
        <text class="text-white text-sm font-medium">搜索</text>
      </view>
    </view>

    <!-- 返回全部 -->
    <view v-if="!isShow" class="px-4 pt-3">
      <view class="bg-[#ecfdf5] rounded-xl px-4 py-2 inline-flex items-center gap-1"
            @tap.stop="showAllArticles">
        <text class="text-[#059669] text-sm">← 显示全部文章</text>
      </view>
    </view>

    <!-- 文章列表 -->
    <scroll-view scroll-y="true" lower-threshold="50" @scrolltolower="onScrollToLower"
                 style="height:calc(100vh - 56px)">
      <view class="p-4 flex flex-col gap-3 pb-20">
        <view
          v-for="item in articleList" :key="item.aid"
          class="card overflow-hidden"
          style="box-shadow:0 2px 8px rgba(0,0,0,.05)"
          @tap.stop="enterArticle(item.content, item.title)"
        >
          <image
            :src="img_url_prefix + item.image"
            style="width:100%;height:160px;display:block;object-fit:cover"
            mode="aspectFill"
          />
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
          <text class="text-4xl block mb-3">📭</text>
          <text class="text-sm text-[#9ca3af]">暂无文章</text>
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
      isShow: true,
      img_url_prefix: 'http://192.168.8.102:9999/project/HL/static/',
      articleList: [],
      inputKey: '请输入相关文章关键字',
    }
  },
  computed: { ...mapState(['articles']) },
  onLoad() {
    uni.request({
      url: '/api/article/all', method: 'GET',
      success: (res) => {
        if (res.data.data) {
          this.articleList = res.data.data.result
          this.setArticles(res.data.data.result)
        }
      },
    })
  },
  methods: {
    ...mapMutations(['setArticles']),
    onInputKey(e) { this.inputKey = e.detail.value },
    formatDate(d) { return d ? d.slice(0, 10) : '' },
    enterArticle(contUrl, contTitle) {
      uni.navigateTo({
        url: `/pages/article/content?contUrl=${contUrl}&title=${contTitle}`,
        fail: () => uni.showToast({ title: '参数异常', icon: 'error' }),
      })
    },
    searchArticle() {
      const key = String(this.inputKey)
      if (!key || /^\d+$/.test(key)) {
        uni.showToast({ title: '请输入合法关键字', icon: 'error' }); return
      }
      uni.request({
        url: `/api/article/title/${key}`, method: 'GET',
        success: (res) => {
          const list = res.data?.data?.result
          if (list?.length) {
            this.articleList = list
            this.isShow = false
            uni.showToast({ title: '检索成功', icon: 'success' })
          } else {
            uni.showToast({ title: '无相关文章', icon: 'error' })
          }
        },
      })
    },
    showAllArticles() {
      if (this.articles) { this.isShow = true; this.articleList = this.articles }
    },
    onScrollToLower() {},
  },
}
</script>

<style scoped></style>
