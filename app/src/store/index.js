import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        user: { },
        articles: [],
        currentData:{},
        userPlanData: {},
    },
    mutations: {
        setUser: (state, newVal)=> {
            state.user = newVal
        },
        setArticles: (state, newVal) => {
            state.articles = newVal
        },
        setCurrentData:(state, newVal)=>{
            state.currentData = newVal
        },
        setUserPlanData:(state, newVal) => {
            state.userPlanData = newVal
        }
    },
    actions: {
        /**
         * 用户登录处理函数, 登录成功后将登录态保存到状态中心,
         * 并将登录态保持到缓存中
         * */
        userLogin: (context, newVal) => {
            return new Promise((resolve, reject) => {
                uni.request({
                    url: '/api/user/login',
                    method: "POST",
                    data: {
                        account: newVal._account,
                        password: newVal._password,
                    },
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'xmlhttprequest'
                    },
                    success: (res) => {
                        if (res.data.data) {
                            context.commit("setUser", res.data.data)
                            uni.setStorageSync("user_data", res.data.data)
                            context.dispatch('requestUserPlanData', res.data.data.token)
                            resolve(res.data.data)
                        } else {
                            reject(res.data)
                        }
                    },
                    fail: () => reject(new Error('网络请求失败，请检查网络连接'))
                })
            })
        },
        /**
         * 获取全部文章集合函数
         * */
        requestArticleList: (content) => {
            uni.request({
                url: "/api/article/all",
                method: "GET",
                success: (res) => {
                    if(res.data.data) {
                        content.commit("setArticles", res.data.data.result)
                    }
                }
            })
        },
        /**
         * 请求用户健康计划数据，token 从 JWT 中间件获取 uid，无需手动传递
         * */
        requestUserPlanData: (content, token) => {
            if (!token) return
            uni.request({
                url: '/api/plan/get',
                method: 'GET',
                header: { token },
                success: (res) => {
                    if (res.data.data) {
                        content.commit("setUserPlanData", res.data.data)
                    }
                }
            })
        }
    },
    getters: {
        getUser: (state) => state.user,
        getArticle: () => {},

        // 综合健康评分（满分 100）
        healthScore: (state) => {
            const cd   = state.currentData
            const pd   = state.userPlanData
            const user = state.user
            if (!cd || JSON.stringify(cd) === '{}') return 0
            let s = 0
            const w = Number(cd.weight) || Number(user.weight)
            const h = Number(user.height)
            if (w && h) {
                const bmi = w / Math.pow(h / 100, 2)
                s += bmi >= 18.5 && bmi < 25 ? 25 : bmi >= 25 && bmi < 30 ? 12 : 5
            } else { s += 15 }
            const calPct = pd.calorie
                ? (Number(cd.calorie) || 0) / Number(pd.calorie) * 100 : 80
            s += calPct >= 80 && calPct <= 110 ? 20 : calPct > 110 ? 8 : 12
            const stepPct = pd.step_target
                ? (Number(cd.stepNum) || 0) / Number(pd.step_target) * 100 : 50
            s += Math.round(Math.min(stepPct, 100) / 100 * 20)
            const exPct = pd.exerciseTime
                ? (Number(cd.exerciseTime) || 0) / Number(pd.exerciseTime) * 100 : 50
            s += Math.round(Math.min(exPct, 100) / 100 * 20)
            if (cd.sleepTime) {
                const [hh, mm] = cd.sleepTime.split(':').map(Number)
                const mins = hh * 60 + (mm || 0)
                s += mins >= 360 && mins <= 540 ? 15 : mins >= 300 ? 8 : 3
            } else { s += 10 }
            return Math.min(100, s)
        },

        // 评分等级徽标
        scoreBadge: (_, getters) => {
            const s = getters.healthScore
            if (s >= 90) return { label: '优秀', color: '#10b981', bg: '#d1fae5', desc: '健康状况非常好，请继续保持！' }
            if (s >= 75) return { label: '良好', color: '#3b82f6', bg: '#dbeafe', desc: '整体状况良好，注意保持睡眠与运动规律。' }
            if (s >= 60) return { label: '中等', color: '#f97316', bg: '#fff7ed', desc: '建议注意体重管理、规律运动，晚上11点前入睡。' }
            return { label: '较差', color: '#ef4444', bg: '#fee2e2', desc: '健康状况需要关注，请合理安排饮食、增加运动，注意休息。' }
        },

        // 健康建议
        healthAdvice: (state) => {
            const cd = state.currentData || {}
            const pd = state.userPlanData || {}
            const tips = []
            const calPct  = pd.calorie   ? (Number(cd.calorie)   || 0) / Number(pd.calorie)   * 100 : 0
            const stepPct = pd.step_target ? (Number(cd.stepNum)   || 0) / Number(pd.step_target) * 100 : 0
            const exPct   = pd.exerciseTime ? (Number(cd.exerciseTime) || 0) / Number(pd.exerciseTime) * 100 : 0
            if (calPct > 110)
                tips.push({ icon: 'warning-o',   color: 'var(--icon-warning)', bg: '#fff7ed', text: '今日卡路里摄入已超标，建议减少高热量食物，适当增加有氧运动。' })
            else if (calPct < 50 && calPct > 0)
                tips.push({ icon: 'fire-o',      color: 'var(--icon-amber)',   bg: '#fef9c3', text: '今日卡路里摄入不足，营养摄入过少不利于健康，请注意合理饮食。' })
            else if (calPct >= 80 && calPct <= 110)
                tips.push({ icon: 'good-job-o',  color: 'var(--icon-primary)', bg: '#f0fdf4', text: '卡路里摄入处于合理范围，继续保持均衡饮食。' })
            if (stepPct < 60 && pd.step_target)
                tips.push({ icon: 'todo-list-o', color: 'var(--icon-warning)', bg: '#fff7ed', text: `今日步数还差 ${Math.max(0, Number(pd.step_target) - (Number(cd.stepNum) || 0))} 步，饭后散步是个好习惯。` })
            if (exPct < 50 && pd.exerciseTime)
                tips.push({ icon: 'clock-o',     color: 'var(--icon-amber)',   bg: '#fef9c3', text: '今日运动时间不足目标的一半，适量运动有助于改善新陈代谢。' })
            if (cd.sleepTime) {
                const [h, m] = cd.sleepTime.split(':').map(Number)
                const mins = h * 60 + (m || 0)
                if (mins < 360)
                    tips.push({ icon: 'clock-o', color: 'var(--icon-purple)', bg: '#f5f3ff', text: '昨夜睡眠不足 6 小时，建议今晚 22:30 前入睡，保证充足休息。' })
                else if (mins >= 420 && mins <= 540)
                    tips.push({ icon: 'star-o',  color: 'var(--icon-primary)', bg: '#f0fdf4', text: '睡眠时长良好，保持规律作息有助于身心健康。' })
            }
            return tips.slice(0, 3)
        },
    }
})
export default store