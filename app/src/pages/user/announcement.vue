<template>
  <view class="min-h-screen bg-[#f5f7fa]">

    <!-- 顶部渐变头 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <view class="flex items-center gap-3 mb-1">
        <van-icon name="bullhorn-o" size="22" color="rgba(255,255,255,.9)" />
        <text class="text-white font-bold" style="font-size:24px">官方公告</text>
      </view>
      <text class="text-sm" style="color:rgba(255,255,255,.7)">系统更新与重要通知</text>
    </view>

    <view class="px-4 -mt-8 flex flex-col gap-3 pb-8">

      <view v-for="item in announcements" :key="item.id" class="card p-4">

        <!-- 公告头部 -->
        <view class="flex items-center gap-2 mb-3">
          <view class="w-2 h-2 rounded-full flex-shrink-0"
                :style="{ background: item.tagColor }"></view>
          <text class="flex-1 text-sm font-semibold text-[#1f2937]">{{ item.title }}</text>
          <view class="px-2 py-0.5 rounded-full"
                :style="{ background: item.tagBg }">
            <text class="text-xs font-medium" :style="{ color: item.tagColor }">
              {{ item.tag }}
            </text>
          </view>
        </view>

        <!-- 内容行 -->
        <view v-for="(line, i) in item.lines" :key="i"
              class="flex items-start gap-2 mb-1.5">
          <van-icon :name="line.icon" size="12"
                    :color="line.color" class="mt-0.5 flex-shrink-0" />
          <text class="text-xs text-[#6b7280] leading-relaxed flex-1">{{ line.text }}</text>
        </view>

        <!-- 底部元信息 -->
        <view class="flex items-center justify-between mt-3 pt-3"
              style="border-top:1px solid #f3f4f6">
          <text class="text-xs text-[#9ca3af]">{{ item.date }}</text>
          <text class="text-xs text-[#9ca3af]">{{ item.author }}</text>
        </view>

      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      announcements: [
        {
          id: 1,
          title: 'V1.0.3 更新公告',
          tag: 'NEW',
          tagColor: '#10b981',
          tagBg: '#d1fae5',
          date: '2024-01-28',
          author: '管理员',
          lines: [
            { icon: 'add-o',     color: '#10b981', text: '文章添加模糊检索功能' },
            { icon: 'add-o',     color: '#10b981', text: '增强食物识别' },
            { icon: 'warning-o', color: '#f97316', text: '修复数据上传校验问题' },
            { icon: 'warning-o', color: '#f97316', text: '修改部分文本' },
            { icon: 'warning-o', color: '#f97316', text: '修复部分遗留问题' },
          ],
        },
        {
          id: 2,
          title: '1月26日 BUG 修复',
          tag: 'FIX',
          tagColor: '#f97316',
          tagBg: '#fff7ed',
          date: '2024-01-26',
          author: '管理员',
          lines: [
            { icon: 'warning-o', color: '#f97316', text: '修复若干已知问题，提升应用稳定性' },
          ],
        },
      ],
    }
  },
}
</script>

<style scoped></style>
