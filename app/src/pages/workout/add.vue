<template>
  <view class="min-h-screen bg-[#f5f7fa] pb-8">

    <!-- 顶部渐变头 -->
    <view class="px-5 pt-10 pb-14"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-white font-bold block" style="font-size:22px">记录运动</text>
      <text class="text-sm block mt-1" style="color:rgba(255,255,255,.7)">
        选择运动类型，填写本次数据
      </text>
    </view>

    <view class="px-4 -mt-6 flex flex-col gap-4">

      <!-- 运动类型选择宫格 -->
      <view class="card p-4">
        <text class="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-3">
          运动类型 *
        </text>
        <view class="grid grid-cols-3 gap-3">
          <view
            v-for="t in typeList" :key="t.key"
            class="flex flex-col items-center justify-center rounded-xl py-3 gap-1"
            :style="selectedType === t.key
              ? `background:${t.bg};border:2px solid ${t.color}`
              : 'background:#f9fafb;border:1px solid #f3f4f6'"
            @tap="selectedType = t.key"
          >
            <van-icon :name="t.icon" size="24"
                      :color="selectedType === t.key ? t.color : '#9ca3af'" />
            <text class="text-xs"
                  :style="{ color: selectedType === t.key ? t.color : '#9ca3af',
                            fontWeight: selectedType === t.key ? '600' : '400' }">
              {{ t.label }}
            </text>
          </view>
        </view>
      </view>

      <!-- 基础字段 -->
      <view class="card overflow-hidden">
        <view class="px-4 pt-4 pb-2">
          <text class="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">基础信息</text>
        </view>

        <view class="field-row">
          <view class="field-icon-wrap">
            <van-icon name="clock-o" size="18" color="var(--icon-primary)" />
          </view>
          <text class="field-label">时长 *</text>
          <input class="field-input" type="number" v-model="form.duration"
                 placeholder="分钟" placeholder-style="color:#c4c9d4" />
          <text class="field-unit">min</text>
        </view>
        <view class="divider-line" />

        <view class="field-row">
          <view class="field-icon-wrap">
            <van-icon name="fire-o" size="18" color="var(--icon-primary)" />
          </view>
          <text class="field-label">卡路里</text>
          <input class="field-input" type="number" v-model="form.calories"
                 placeholder="选填" placeholder-style="color:#c4c9d4" />
          <text class="field-unit">kcal</text>
        </view>
        <view class="divider-line" />

        <view class="field-row" @tap="showDatePicker = true">
          <view class="field-icon-wrap">
            <van-icon name="calendar-o" size="18" color="var(--icon-primary)" />
          </view>
          <text class="field-label">日期</text>
          <text class="field-input text-right"
                :style="{ color: form.started_at ? '#1f2937' : '#c4c9d4' }">
            {{ form.started_at || '请选择日期' }}
          </text>
        </view>
        <view class="divider-line" />

        <view class="field-row">
          <view class="field-icon-wrap">
            <van-icon name="edit" size="18" color="var(--icon-primary)" />
          </view>
          <text class="field-label">备注</text>
          <input class="field-input" type="text" v-model="form.notes"
                 placeholder="选填" placeholder-style="color:#c4c9d4" />
        </view>
      </view>

      <!-- 扩展字段（跑步/骑行专属） -->
      <view v-if="isDistanceType" class="card overflow-hidden">
        <view class="px-4 pt-4 pb-2">
          <text class="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
            {{ selectedType === 'running' ? '跑步' : '骑行' }}详情
          </text>
        </view>

        <view class="field-row">
          <view class="field-icon-wrap">
            <van-icon name="location-o" size="18" color="var(--icon-primary)" />
          </view>
          <text class="field-label">距离</text>
          <input class="field-input" type="digit" v-model="form.distance"
                 placeholder="选填" placeholder-style="color:#c4c9d4" />
          <text class="field-unit">km</text>
        </view>
        <view class="divider-line" />

        <view class="field-row">
          <view class="field-icon-wrap">
            <van-icon name="orders-o" size="18" color="var(--icon-primary)" />
          </view>
          <text class="field-label">配速</text>
          <input class="field-input" type="text" v-model="form.avg_pace"
                 placeholder="如 06:30" placeholder-style="color:#c4c9d4" />
          <text class="field-unit">min/km</text>
        </view>
        <view class="divider-line" />

        <view class="field-row">
          <view class="field-icon-wrap">
            <van-icon name="like-o" size="18" color="var(--icon-primary)" />
          </view>
          <text class="field-label">心率</text>
          <input class="field-input" type="number" v-model="form.avg_heart_rate"
                 placeholder="选填" placeholder-style="color:#c4c9d4" />
          <text class="field-unit">bpm</text>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view
        class="h-12 rounded-xl flex items-center justify-center mt-2"
        style="background:linear-gradient(135deg,#10b981,#059669)"
        @tap="onSubmit"
      >
        <text class="text-white font-semibold text-sm">保存运动记录</text>
      </view>

    </view>

    <!-- 日期选择器 -->
    <van-popup v-model="showDatePicker" position="bottom">
      <van-datetime-picker
        type="date"
        :value="pickerDate"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>

  </view>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'

const TYPE_CONFIG = {
  running:  { label: '跑步', icon: 'todo-list-o', color: '#f97316', bg: '#fff7ed' },
  cycling:  { label: '骑行', icon: 'exchange',    color: '#3b82f6', bg: '#dbeafe' },
  gym:      { label: '健身', icon: 'fire-o',       color: '#10b981', bg: '#d1fae5' },
  swimming: { label: '游泳', icon: 'like-o',       color: '#06b6d4', bg: '#cffafe' },
  other:    { label: '其他', icon: 'setting-o',    color: '#6b7280', bg: '#f3f4f6' },
}

export default {
  data() {
    return {
      selectedType:   '',
      showDatePicker: false,
      pickerDate:     new Date(),
      minDate:        new Date(2020, 0, 1),
      maxDate:        new Date(),
      form: {
        duration:       '',
        calories:       '',
        started_at:     dayjs().format('YYYY-MM-DD'),
        notes:          '',
        distance:       '',
        avg_pace:       '',
        avg_heart_rate: '',
      },
    }
  },
  computed: {
    ...mapState(['user']),
    typeList() {
      return Object.entries(TYPE_CONFIG).map(([key, val]) => ({ key, ...val }))
    },
    isDistanceType() {
      return this.selectedType === 'running' || this.selectedType === 'cycling'
    },
  },
  methods: {
    onDateConfirm(val) {
      this.form.started_at = dayjs(val).format('YYYY-MM-DD')
      this.pickerDate      = val
      this.showDatePicker  = false
    },
    onSubmit() {
      if (!this.selectedType) {
        uni.showToast({ title: '请选择运动类型', icon: 'none', duration: 2000 }); return
      }
      if (!this.form.duration || Number(this.form.duration) <= 0) {
        uni.showToast({ title: '请填写运动时长', icon: 'none', duration: 2000 }); return
      }

      const data = {
        type:       this.selectedType,
        duration:   Number(this.form.duration),
        started_at: this.form.started_at,
      }
      if (this.form.calories)       data.calories       = Number(this.form.calories)
      if (this.form.notes)          data.notes          = this.form.notes
      if (this.isDistanceType) {
        if (this.form.distance)       data.distance       = Number(this.form.distance)
        if (this.form.avg_pace)       data.avg_pace       = this.form.avg_pace
        if (this.form.avg_heart_rate) data.avg_heart_rate = Number(this.form.avg_heart_rate)
      }

      uni.request({
        url:    '/api/workout/add',
        method: 'POST',
        header: { token: this.user.token, 'content-type': 'application/json' },
        data,
        success: (res) => {
          if (res.data?.code === 20000) {
            uni.showToast({ title: '保存成功', icon: 'none', duration: 1500 })
            setTimeout(() => uni.navigateBack(), 1500)
          } else {
            uni.showToast({ title: res.data?.message || '保存失败', icon: 'none', duration: 2000 })
          }
        },
        fail: () => uni.showToast({ title: '网络请求失败', icon: 'none', duration: 2000 }),
      })
    },
  },
}
</script>

<style scoped>
.field-row {
  display: flex; align-items: center;
  padding: 12px 16px; gap: 12px;
}
.field-icon-wrap {
  width: 34px; height: 34px;
  background: #f0fdf4; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.field-label {
  font-size: 14px; color: #374151; font-weight: 500;
  width: 48px; flex-shrink: 0;
}
.field-input {
  flex: 1; font-size: 14px; color: #111827;
  background: transparent; border: none; outline: none;
  text-align: right;
}
.field-unit {
  font-size: 12px; color: #9ca3af; flex-shrink: 0;
}
.divider-line {
  height: 1px; background: #f3f4f6; margin-left: 62px;
}
</style>
