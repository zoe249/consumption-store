<script>
	export default {
		globalData: {
			recipeId: ''
		},
		onLaunch: function() {
			console.log('App Launch')
			// 版本更新
			this.versionUpdate()
		},
		onShow: function() {
			console.log('App Show')
			// 获取版本号
			let accountInfo = uni.getAccountInfoSync();
			let edition = accountInfo.miniProgram.version
			console.log('版本号', edition)

			if (edition != uni.getStorageSync('edition')) {
				// 版本更新
				this.versionUpdate()
				uni.setStorageSync('edition', edition)
			}
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 版本更新
			versionUpdate() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log('是否有更新:', res.hasUpdate)
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function(res2) {
							uni.showModal({
								title: '更新提示',
								content: '发现新版本，是否重启应用?',
								cancelColor: '#eeeeee',
								confirmColor: '#FF0000',
								success(res2) {
									if (res2.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate();
									}
								}
							});
						});
					}
				});
				updateManager.onUpdateFailed(function(res) {
					// 新的版本下载失败
					uni.showModal({
						title: '提示',
						content: '检查到有新版本，但下载失败，请检查网络设置',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
<style>
	@import "/posterFont/fonts/fonts.css";
	@import "/static/css/animate.css";

	page {
		background-color: #F4F4F4;
	}

	.price {
		color: #F2AB99;
	}
</style>
