<template>
  <div class="mask" :class="{ show: visible }" @tap.self="closeDialog">
    <div class="sheet" :class="{ show: visible }">

      <!-- 头部 -->
      <div class="sheet-header">
        <div class="sheet-handle"></div>
        <div class="sheet-title">今日数据更新</div>
        <div class="sheet-close" @tap.stop="closeDialog">✕</div>
      </div>

      <!-- 健康指标字段 -->
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

      <!-- 饮食记录：三餐分类 -->
      <div class="meal-section">
        <div class="meal-header">
          <span class="meal-title">🍽 今日饮食记录</span>
          <span class="meal-tip">多项用逗号分隔</span>
        </div>

        <div class="meal-tabs">
          <div
            v-for="meal in meals"
            :key="meal.key"
            :class="['meal-tab', activeMeal === meal.key && 'meal-tab-active']"
            @tap="activeMeal = meal.key"
          >
            {{ meal.label }}
          </div>
        </div>

        <div class="meal-input-wrap">
          <div v-for="meal in meals" :key="meal.key" v-show="activeMeal === meal.key">
            <div class="meal-input-box" @click.stop>
              <div class="meal-input-header">
                <span class="meal-emoji">{{ meal.icon }}</span>
                <span class="meal-input-label">{{ meal.label }}</span>
              </div>
              <textarea
                class="meal-textarea"
                :placeholder="meal.placeholder"
                :value="mealFoods[meal.key]"
                @input="mealFoods[meal.key] = $event.target.value"
                @click.stop
                rows="2"
              />
            </div>
            <div class="meal-tags" v-if="parseFoods(mealFoods[meal.key]).length">
              <span
                v-for="f in parseFoods(mealFoods[meal.key])"
                :key="f"
                class="meal-tag"
              >{{ f }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tips-box">
        <span class="tip">睡眠格式：HH:MM（如 07:30）</span>
        <span class="tip">数值无需输入单位</span>
      </div>

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
      activeMeal: 'breakfast',
      mealFoods: { breakfast: '', lunch: '', dinner: '' },
      day_data: {
        weight: null,
        calorie: null,
        step_num: null,
        exercise_time: null,
        sleep_time: null,
      },
    }
  },
  computed: {
    ...mapState(['user', 'currentData', 'userPlanData']),
    meals() {
      return [
        { key: 'breakfast', label: '早餐', icon: '🌅', placeholder: '如：豆浆,鸡蛋,馒头' },
        { key: 'lunch',     label: '午餐', icon: '☀️', placeholder: '如：米饭,红烧肉,青菜' },
        { key: 'dinner',    label: '晚餐', icon: '🌙', placeholder: '如：面条,西红柿鸡蛋' },
      ]
    },
    fields() {
      return [
        { key: 'weight',        icon: '⚖️', label: '体重',     placeholder: '今日体重 (kg)',     plan: (this.userPlanData.weight       || '—') + ' KG'  },
        { key: 'calorie',       icon: '🔥', label: '卡路里',   placeholder: '今日摄入卡路里(总)', plan: (this.userPlanData.calorie      || '—') + ' 卡'  },
        { key: 'step_num',      icon: '🏃', label: '步数',     placeholder: '今日运动步数',       plan: (this.userPlanData.kilometre    || '—') + ' 步'  },
        { key: 'exercise_time', icon: '⏱', label: '有氧运动', placeholder: '有氧运动时长(分钟)',  plan: (this.userPlanData.exerciseTime || '—') + ' min' },
        { key: 'sleep_time',    icon: '😴', label: '睡眠时长', placeholder: '格式 HH:MM',  type: 'text', plan: this.userPlanData.sleepTime || '—' },
      ]
    },
    // 合并三餐为结构化字符串：早餐:xxx;午餐:xxx;晚餐:xxx
    mergedFoods() {
      const { breakfast, lunch, dinner } = this.mealFoods
      const parts = []
      if (breakfast.trim()) parts.push(`早餐:${breakfast.trim()}`)
      if (lunch.trim())     parts.push(`午餐:${lunch.trim()}`)
      if (dinner.trim())    parts.push(`晚餐:${dinner.trim()}`)
      return parts.join(';')
    },
  },
  watch: {
    isShowCommonDialog(val) {
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
      this.day_data.weight        = this.currentData.weight
      // 解析已有饮食记录回填三餐
      this.parseMealFoods(this.currentData.foods)
    }
    this.$nextTick(() => { this.visible = true })
  },
  methods: {
    ...mapMutations(['setCurrentData']),

    parseFoods(str) {
      if (!str) return []
      return str.split(',').map(s => s.trim()).filter(Boolean)
    },

    // 将 "早餐:xxx;午餐:xxx" 格式回填到 mealFoods
    parseMealFoods(foods) {
      if (!foods) return
      foods.split(';').forEach(part => {
        if (part.startsWith('早餐:')) this.mealFoods.breakfast = part.slice(3)
        else if (part.startsWith('午餐:')) this.mealFoods.lunch    = part.slice(3)
        else if (part.startsWith('晚餐:')) this.mealFoods.dinner   = part.slice(3)
        else {
          // 旧格式（逗号分隔）全放早餐
          if (!this.mealFoods.breakfast) this.mealFoods.breakfast = part
        }
      })
    },

    closeDialog() {
      this.visible = false
      setTimeout(() => { this.$emit('UpdateDialogDayDataState', false) }, 300)
    },

    updateDayDate() {
      if (!this.inspectDayData()) return
      this.disposeDayData()
      const { token } = this.user
      const foods = this.mergedFoods
      uni.request({
        method: 'POST',
        url: '/api/data/add',
        header: { token, 'content-type': 'application/json' },
        data: {
          calorie: this.day_data.calorie,
          sleepTime: this.day_data.sleep_time,
          stepNum: this.day_data.step_num,
          exerciseTime: this.day_data.exercise_time,
          weight: this.day_data.weight,
          foods,
        },
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
.mask {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0); z-index: 999;
  display: flex; align-items: flex-end;
  transition: background .3s ease; pointer-events: none;
}
.mask.show { background: rgba(0,0,0,.45); pointer-events: auto; }

.sheet {
  width: 100%; background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 0 0 env(safe-area-inset-bottom, 16px);
  transform: translateY(100%);
  transition: transform .35s cubic-bezier(.32,.72,0,1);
  max-height: 90vh; overflow-y: auto;
}
.sheet.show { transform: translateY(0); }

.sheet-header {
  display: flex; align-items: center;
  padding: 12px 16px 16px; position: relative;
}
.sheet-handle {
  position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
  width: 36px; height: 4px; background: #e5e7eb; border-radius: 2px;
}
.sheet-title {
  flex: 1; text-align: center;
  font-size: 17px; font-weight: 600; color: #111827; margin-top: 8px;
}
.sheet-close {
  width: 28px; height: 28px; background: #f3f4f6; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: #6b7280; margin-top: 8px; cursor: pointer;
}

.field-list { padding: 0 16px; }
.field-item {
  display: flex; align-items: center;
  padding: 12px 0; border-bottom: 1px solid #f3f4f6;
}
.field-item:last-child { border-bottom: none; }
.field-left { display: flex; align-items: center; gap: 10px; flex: 1; }
.field-icon {
  width: 36px; height: 36px; background: #f0fdf4; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.field-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.field-label { font-size: 12px; color: #6b7280; font-weight: 500; }
.field-input {
  font-size: 15px; font-weight: 500; color: #111827;
  background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px;
  padding: 6px 10px; width: 100%; outline: none;
}
.field-plan { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; margin-left: 12px; flex-shrink: 0; }
.plan-label { font-size: 10px; color: #9ca3af; }
.plan-value { font-size: 13px; font-weight: 600; color: #10b981; }

/* 三餐区域 */
.meal-section {
  margin: 0 16px;
  padding: 14px 0 4px;
  border-top: 1px solid #f3f4f6;
}
.meal-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
}
.meal-title { font-size: 14px; font-weight: 600; color: #374151; }
.meal-tip   { font-size: 11px; color: #9ca3af; }
.meal-tabs  {
  display: flex; gap: 6px; margin-bottom: 12px;
  background: #f3f4f6; border-radius: 10px; padding: 3px;
}
.meal-tab {
  flex: 1; padding: 7px 0; text-align: center; font-size: 13px; color: #6b7280;
  background: transparent; border-radius: 8px; cursor: pointer; border: none;
  transition: all .15s;
}
.meal-tab-active {
  background: #fff; color: #10b981; font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}
.meal-input-box {
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 14px 8px;
  transition: border-color .2s;
}
.meal-input-box:focus-within {
  border-color: #10b981;
  background: #fff;
}
.meal-input-header {
  display: flex; align-items: center; gap: 6px; margin-bottom: 6px;
}
.meal-emoji { font-size: 18px; }
.meal-input-label { font-size: 12px; color: #6b7280; font-weight: 500; }
.meal-textarea {
  width: 100%; min-height: 56px;
  font-size: 15px; color: #111827; line-height: 1.6;
  background: transparent; border: none; outline: none; resize: none;
  font-family: inherit;
}
.meal-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.meal-tag {
  background: #ecfdf5; color: #059669; border-radius: 20px;
  padding: 3px 10px; font-size: 12px;
}

.tips-box {
  margin: 10px 16px 0; background: #f9fafb; border-radius: 10px;
  padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
}
.tip { font-size: 11px; color: #9ca3af; }

.submit-btn {
  margin: 14px 16px 8px; height: 48px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 14px; display: flex; align-items: center;
  justify-content: center; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer;
}
.submit-btn:active { opacity: .85; }
</style>
