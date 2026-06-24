import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {
  DataAnalysis, User, Document, Bell,
  UserFilled, ArrowDown, Plus, Search,
} from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

for (const component of [DataAnalysis, User, Document, Bell, UserFilled, ArrowDown, Plus, Search]) {
  app.component(component.name, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
