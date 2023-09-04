<template>
	<view>
		<view class="qrcode">
			<canvas :style="{width:size+ 'px', height:size+ 'px', background:bgc}" canvas-id="couponQrcode"></canvas>
		</view>
	</view>
</template>

<script>
	const qrCode = require('./weapp-qrcode.js')
	export default {
		data() {
			return {
				bgc: 'rgba(200, 200, 200, 0.1)', //测试画布是否与内容相同大小
				canvasQrPath: this.qrPath, //
				level: '',
				qiniuToken: ''
			}
		},

		props: {
			text: {
				type: String,
				default: 'hello'
			},
			size: {
				type: Number,
				default: 200
			},
			quality: {
				type: String,
				default: 'L' //二维码质量L/M/Q/H
			},
			colorDark: {
				type: String,
				default: '#000000'
			},
			colorLight: {
				type: String,
				default: '#ffffff'
			},
			qrPath: {
				type: String,
				default: ''
			}
		},
		// 在实例挂载完成后被立即调用
		mounted() { //兼容非动态取值(二维码为固定内容)
			setTimeout(() => {
				this.couponQrCode()
			}, 1500)
			this.getQiniuToken()
		},
		watch: {
			text(newVal, oldVal) { //监测到text值发生改变时重新绘制
				console.log('最新值是：' + newVal, "原来的值是：" + oldVal);
				this.couponQrCode()
			}
		},
		methods: {
			// 二维码生成工具
			async couponQrCode() {
				var that = this;
				if (this.quality == 'L') {
					this.level = qrCode.CorrectLevel.L
				} else if (this.quality == 'M') {
					this.level = qrCode.CorrectLevel.M
				} else if (this.quality == 'Q') {
					this.level = qrCode.CorrectLevel.Q
				} else if (this.quality == 'H') {
					this.level = qrCode.CorrectLevel.H
				} else {
					this.level = qrCode.CorrectLevel.L
				}
				new qrCode('couponQrcode', {
					text: this.text,
					width: this.size,
					height: this.size,
					showLoading: true, // 是否显示loading
					loadingText: '二维码生成中', // loading文字
					colorDark: this.colorDark, //二维码暗部颜色
					colorLight: this.colorLight, //二维码亮部颜色
					correctLevel: this.level, //二维码质量L/M/Q/H
					usingIn: this //在自定义组件下，第二个参数传入组件实例this
				})
				// 把当前画布指定区域的内容导出生成图片，并返回文件路径。
				uni.canvasToTempFilePath({
					canvasId: 'couponQrcode',
					quality: 1,
					complete: (res) => {
						console.log('图片地址', res.tempFilePath)
						this.canvasQrPath = res.tempFilePath
						console.log('二维码生成图片地址', this.canvasQrPath)
						this.uploadQiniu(this.canvasQrPath)
						this.$emit('update:qrPath', this.canvasQrPath)
					}
				}, this);

				console.log('绘制完成');
			},
			/* 获取七牛云token */
			getQiniuToken() {
				let that = this
				that.request({
					url: that.config.getQiniuToken
				}).then(res => {
					console.log(res)
					that.qiniuToken = res.data.data.qiNiuToken
				})
			},
			/* 上传七牛云 */
			async uploadQiniu(imgPath) {
				let that = this
				// 生成32位随机码
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxPos = chars.length
				var key
				for (let i = 0; i < 32; i++) {
					key += chars.charAt(Math.floor(Math.random() * maxPos))
				}
				var promise = new Promise((resolve, reject) => {
					wx.uploadFile({
						url: that.config.uploadUrl,
						name: 'file',
						filePath: imgPath,
						header: {
							"Content-Type": "multipart/form-data"
						},
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: function(res) {
							console.log('上传成功', res)
							// 图片上传成功之后，返回画布渲染完成状态
							let pic = 'https://qiaokun.yuepong.com/' + JSON.parse(res.data).key
							console.log('生成二维码完成', pic)
							that.$emit('canvasQrcode', pic)
							var promise = new Promise((resolve, reject) => {
								setTimeout(() => {
									resolve(pic)
								}, 1500)
							})
							return promise
							uni.hideLoading()
						},
						fail: function(err) {
							console.log('上传失败', err)
							uni.showToast({
								title: '图片上传失败，请重新操作',
								icon: 'none'
							})
						}
					})
				})
				return promise
			},
		}
	}
</script>

<style>
	.qrcode {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>