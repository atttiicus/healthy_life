<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
    data() {
        return {
        }
    },
    computed:{
      ...mapState(["user"])
    },
    methods: {
      ...mapMutations(["setUser"]),
      ...mapActions(['requestUserPlanData'])
    },
		onLaunch: function() {
      uni.getStorage({
          key: "user_data",
          success: (res) => {
            const u = res.data
            // JWT 格式为 xxx.yyy.zzz，mock token 不符合此格式，直接清除
            const isValidJwt = u && u.token && u.token.split('.').length === 3
            if (!isValidJwt) {
              uni.removeStorageSync('user_data')
              return
            }
            this.setUser(u)
            this.requestUserPlanData(u.token)
          }
      })
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
    created() {

    },
	}
</script>

<style>
:root {
  --primary: #10b981;
  --primary-dark: #059669;
  --bg-page: #f5f7fa;
}
page {
  background-color: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
}
* { box-sizing: border-box; }
</style>
