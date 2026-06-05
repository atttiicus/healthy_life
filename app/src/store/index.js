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
        getUser: (state)=> {
            return state.user
        },
        getArticle: ( ) =>{

        }
    }
})
export default store