/**
 * 开发模式 Mock
 * 直接向 Vuex store 注入 mock 数据，无需后端启动
 * 同时拦截写操作请求（update / add），防止控制台报错
 * 仅在 NODE_ENV=development 时生效
 */
import store from '../store'

// ─── Mock 数据 ─────────────────────────────────────────────────────────────

export const MOCK_USER = {
  uid: 1,
  account: '18322223333',
  user_name: 'Mock 用户',
  email: 'mock@example.com',
  age: 25,
  sex: '男',
  height: '175',
  weight: '65',
  token: 'mock-token-dev-123456',
}

export const MOCK_PLAN = {
  pid: 1,
  uid: 1,
  weight: '65',
  exerciseTime: '40',
  step_target: 10000,
  calorie: '2000',
  sleepTime: '07:30',
  bloodPressure: '120/80',
  bmi: '22',
  heartRate: '72',
}

export const MOCK_TODAY_DATA = {
  did: 1,
  uid: 1,
  weight: '65',
  calorie: 1200,
  stepNum: 6800,
  exerciseTime: 25,
  sleepTime: '07:20',
  foods: '米饭,鸡蛋,牛奶,苹果',
}

export const MOCK_ARTICLES = [
  {
    aid: 1, type: 1,
    title: '"打鼾像唱歌"可能并不是睡得香',
    content: '阻塞性睡眠呼吸暂停是一种病理损伤，主要问题出现在上气道，与心血管、代谢、认知等密切相关。',
    author: '科技日报', image: '1.jpg',
    updated_at: '2024-01-21T15:00:00.000Z',
  },
  {
    aid: 2, type: 2,
    title: '腊八粥怎么做更有营养？',
    content: '腊八粥由多样食材熬制而成，谷类、豆类、干果三大类搭配最佳，家庭制作时选料大有讲究。',
    author: '北京青年报', image: '5.jpg',
    updated_at: '2024-01-17T15:02:00.000Z',
  },
  {
    aid: 3, type: 2,
    title: '世界流感日，防控需做好',
    content: '进入11月，秋冬季气温变化幅度较大，是流感等各类呼吸道传染病的高发期，接种疫苗可有效预防。',
    author: '新华社', image: '2.jpg',
    updated_at: '2023-11-11T15:03:00.000Z',
  },
  {
    aid: 4, type: 2,
    title: '统筹医疗资源 方便群众就医',
    content: '各地要科学统筹医疗资源，落实分级诊疗制度，提高一般性感染的诊疗能力和重症识别转诊效率。',
    author: '光明日报', image: '4.jpg',
    updated_at: '2023-11-27T15:05:00.000Z',
  },
  {
    aid: 5, type: 1,
    title: '心梗急救如何畅通"快车道"',
    content: '我国每年发生急性心梗患者约100万人，45岁以下发病率上升，抓住"黄金120分钟"是关键。',
    author: '健康日报', image: '3.jpg',
    updated_at: '2024-01-21T15:06:00.000Z',
  },
]

// ─── 请求拦截（写操作 mock 响应，防止报错）──────────────────────────────────

const ok = data => ({ data: { code: 20000, data, message: 'SUCCESS' }, statusCode: 200 })

// 生成最近7天的历史数据（mock）
function genMockHistory() {
  const sleeps  = ['07:15', '06:30', '07:10', '06:50', '07:35', '06:55', '07:20']
  const steps   = [7200, 5400, 8100, 6300, 9200, 7800, 6800]
  const calories= [1800, 2100, 1950, 2200, 1750, 2050, 1200]
  return sleeps.map((s, i) => ({
    ...MOCK_TODAY_DATA,
    did: i + 1,
    sleepTime:    s,
    stepNum:      steps[i],
    calorie:      calories[i],
    created_at:   new Date(Date.now() - (6 - i) * 86400000).toISOString(),
    updated_at:   new Date(Date.now() - (6 - i) * 86400000).toISOString(),
  }))
}

const WRITE_ROUTES = [
  { test: url => url.includes('/data/history'), handle: () => ok(genMockHistory()) },
  { test: url => url.includes('/data/add'),    handle: () => ok(MOCK_TODAY_DATA) },
  { test: url => url.includes('/data/update'), handle: () => ok(MOCK_TODAY_DATA) },
  { test: url => url.includes('/plan/set'),    handle: () => ok(MOCK_PLAN)       },
  { test: url => url.includes('/user/update'), handle: () => ok({ update_number: 1 }) },
  { test: url => url.includes('/user/login'),  handle: () => ok(MOCK_USER)       },
  { test: url => url.includes('/user/register'), handle: () => ok(MOCK_USER)     },
  {
    test: url => url.includes('/gnews/top-headlines') || url.includes('gnews.io'),
    handle: () => ({
      data: {
        status: 'ok',
        totalResults: MOCK_ARTICLES.length,
        articles: MOCK_ARTICLES.map(a => ({
          title:       a.title,
          description: a.content.slice(0, 80) + '...',
          url:         'https://jiankang.cctv.com/',
          urlToImage:  null,
          author:      a.author,
          publishedAt: a.updated_at,
          source:      { name: a.author },
        })),
      },
    }),
  },
  {
    test: url => url.includes('/gnews/search'),
    handle: url => {
      const q = decodeURIComponent((url.split('q=')[1] || '').split('&')[0])
      const filtered = MOCK_ARTICLES.filter(a => a.title.includes(q))
      return {
        data: {
          status: 'ok',
          totalResults: filtered.length,
          articles: filtered.map(a => ({
            title:       a.title,
            description: a.content.slice(0, 80) + '...',
            url:         'https://jiankang.cctv.com/',
            urlToImage:  null,
            author:      a.author,
            publishedAt: a.updated_at,
            source:      { name: a.author },
          })),
        },
      }
    },
  },
]

function installInterceptor() {
  uni.addInterceptor('request', {
    invoke(args) {
      const url = String(args.url || '')
      const route = WRITE_ROUTES.find(r => r.test(url))
      if (!route) return

      const originalSuccess = args.success
      const originalFail    = args.fail
      let settled = false

      const settle = (mockRes) => {
        if (settled) return
        settled = true
        console.log('[Mock]', url)
        setTimeout(() => { originalSuccess && originalSuccess(mockRes) }, 60)
      }

      // 拦截 fail（网络错误）
      args.fail = () => settle(route.handle(url))

      // 拦截 success（代理错误，如 502/HTML 响应）
      args.success = (res) => {
        const isValidApi = res.statusCode >= 200 && res.statusCode < 500
          && res.data && typeof res.data === 'object'
          && res.data.code !== undefined
        if (isValidApi) {
          originalFail && originalFail  // noop
          originalSuccess && originalSuccess(res)
        } else {
          settle(route.handle(url))
        }
      }
    },
  })
}

// ─── 主入口 ─────────────────────────────────────────────────────────────────

export function installMock() {
  if (process.env.NODE_ENV !== 'development') return

  // 1. 直接向 store 注入 mock 数据（不依赖任何请求）
  const storedUser = uni.getStorageSync('user_data')
  const useRealUser = storedUser && storedUser.uid

  if (!useRealUser) {
    store.commit('setUser', MOCK_USER)
    uni.setStorageSync('user_data', MOCK_USER)
    console.log('[Mock] 注入 mock 用户:', MOCK_USER.user_name)
  }

  store.commit('setUserPlanData', MOCK_PLAN)
  store.commit('setCurrentData',  MOCK_TODAY_DATA)
  store.commit('setArticles',     MOCK_ARTICLES)
  console.log('[Mock] 已注入 mock 数据（用户/计划/今日/文章）')

  // 2. 安装写操作拦截器（update/add 等操作有 mock 响应）
  installInterceptor()
}
