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
            console.log("App Launch => ", res.data)
            this.setUser(res.data)
          }
      })
      this.requestUserPlanData({uid: this.user.uid, token:this.user.token})
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
