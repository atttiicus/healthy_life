<template>
  <!-- 遮罩层 -->
  <div class="mask" :class="{ show: visible }" @tap.self="closeDialog">
    <!-- 弹窗主体：从底部滑入 -->
    <div class="sheet" :class="{ show: visible }">

      <!-- 头部 -->
      <div class="sheet-header">
        <div class="sheet-handle"></div>
        <div class="sheet-title">今日数据更新</div>
        <div class="sheet-close" @tap.stop="closeDialog">✕</div>
      </div>

      <!-- 字段列表 -->
      <div class="field-list">

        <div class="field-item" v-for="item in fields" :key="item.key">
          <div class="field-left">
            <span class="field-icon">{{ item.icon }}</span>
            <div class="field-info">
              <span class="field-label">{{ item.label }}</span>
              <input
                class="field-input"
                :type="item.type || 'number'"
                :placeholder="item.placeholder"
                v-model="day_data[item.key]"
              />
            </div>
          </div>
          <div class="field-plan">
            <span class="plan-label">目标</span>
            <span class="plan-value">{{ item.plan }}</span>
          </div>
        </div>

      </div>

      <!-- 提示 -->
      <div class="tips-box">
        <span class="tip">睡眠格式：HH:MM（如 07:30）</span>
        <span class="tip">数值无需输入单位</span>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-btn" @tap.stop="updateDayDate">更新今日数据</div>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'DialogDayData',
  props: ['isShowCommonDialog'],
  data() {
    return {
      visible: false,
      day_data: {
        weight: null,
        calorie: null,
        step_num: null,
        exercise_time: null,
        sleep_time: null,
        foods: null,
      },
    }
  },
  computed: {
    ...mapState(['user', 'currentData', 'userPlanData']),
    fields() {
      return [
        { key: 'weight',        icon: '⚖️',  label: '体重',       placeholder: '今日体重 (kg)',    plan: (this.userPlanData.weight       || '—') + ' KG'  },
        { key: 'calorie',       icon: '🔥',  label: '卡路里',     placeholder: '今日摄入卡路里',    plan: (this.userPlanData.calorie      || '—') + ' 卡'  },
        { key: 'step_num',      icon: '🏃',  label: '步数',       placeholder: '今日运动步数',      plan: (this.userPlanData.kilometre    || '—') + ' 步'  },
        { key: 'exercise_time', icon: '⏱',  label: '有氧运动',   placeholder: '今日有氧运动(分钟)', plan: (this.userPlanData.exerciseTime || '—') + ' min' },
        { key: 'sleep_time',    icon: '😴',  label: '睡眠时长',   placeholder: '格式 HH:MM', type: 'text', plan: (this.userPlanData.sleepTime    || '—')         },
      ]
    },
  },
  watch: {
    isShowCommonDialog(val) {
      // 下一帧触发动画
      if (val) this.$nextTick(() => { this.visible = true })
      else this.visible = false
    },
  },
  created() {
    if (this.currentData.did) {
      this.day_data.calorie       = this.currentData.calorie
      this.day_data.step_num      = this.currentData.stepNum
      this.day_data.sleep_time    = this.currentData.sleepTime
      this.day_data.exercise_time = this.currentData.exerciseTime
      this.day_data.foods         = this.currentData.foods
      this.day_data.weight        = this.currentData.weight
    }
    // 挂载后触发入场动画
    this.$nextTick(() => { this.visible = true })
  },
  methods: {
    ...mapMutations(['setCurrentData']),
    closeDialog() {
      this.visible = false
      setTimeout(() => {
        this.$emit('UpdateDialogDayDataState', false)
      }, 300)
    },
    updateDayDate() {
      if (!this.inspectDayData()) return
      this.disposeDayData()
      const { uid, token } = this.user
      uni.request({
        method: 'GET',
        url: `/api/data/add?uid=${uid}&calorie=${this.day_data.calorie}&sleepTime=${this.day_data.sleep_time}&stepNum=${this.day_data.step_num}&exerciseTime=${this.day_data.exercise_time}&weight=${this.day_data.weight}`,
        header: { token },
        success: (res) => {
          if (res.data.data) {
            this.setCurrentData(res.data.data)
            uni.showToast({ title: '更新成功', icon: 'success' })
            this.closeDialog()
          }
        },
      })
    },
    inspectDayData() {
      if (!/^(([01]?[0-9]|2[0-3]):[0-5][0-9])$/.test(this.day_data.sleep_time)) {
        uni.showToast({ title: '睡眠格式应为 HH:MM', icon: 'error' })
        return false
      }
      return true
    },
    disposeDayData() {
      if (!this.day_data.calorie)  this.day_data.calorie  = 0
      if (!this.day_data.step_num) this.day_data.step_num = 0
    },
  },
}
</script>

<style scoped>
/* 遮罩 */
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  transition: background 0.3s ease;
  pointer-events: none;
}
.mask.show {
  background: rgba(0, 0, 0, 0.45);
  pointer-events: auto;
}

/* 底部卡片 */
.sheet {
  width: 100%;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 0 0 env(safe-area-inset-bottom, 16px);
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  max-height: 88vh;
  overflow-y: auto;
}
.sheet.show {
  transform: translateY(0);
}

/* 头部 */
.sheet-header {
  display: flex;
  align-items: center;
  padding: 12px 16px 16px;
  position: relative;
}
.sheet-handle {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
}
.sheet-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  margin-top: 8px;
}
.sheet-close {
  width: 28px;
  height: 28px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
  cursor: pointer;
}

/* 字段列表 */
.field-list {
  padding: 0 16px;
}
.field-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}
.field-item:last-child { border-bottom: none; }

.field-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}
.field-icon {
  width: 36px;
  height: 36px;
  background: #f0fdf4;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.field-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.field-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}
.field-input {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 10px;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
}
.field-input:focus {
  border-color: #10b981;
  background: #fff;
}

/* 规划值 */
.field-plan {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  margin-left: 12px;
  flex-shrink: 0;
}
.plan-label {
  font-size: 10px;
  color: #9ca3af;
}
.plan-value {
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
}

/* 提示 */
.tips-box {
  margin: 8px 16px 0;
  background: #f9fafb;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tip {
  font-size: 11px;
  color: #9ca3af;
}

/* 提交按钮 */
.submit-btn {
  margin: 16px 16px 8px;
  height: 48px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.submit-btn:active {
  opacity: 0.85;
}
</style>
