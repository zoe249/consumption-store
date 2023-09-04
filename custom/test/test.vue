<template>
	<view>
		<img :src="src" alt="">
		<button @click="open">替换</button>
		<button @click="save">完成</button>
		<u-popup :show="show" @close="close" @open="open" mode="bottom">
			<view>
				<button @click="takePhoto">拍摄</button>
				<button @click="chooseImage">从图库选择</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'https://cdn.uviewui.com/uview/album/1.jpg',
				show: false
			}
		},
		methods: {
			open() {
				this.show = true
			},
			close() {
				this.show = false
			},
			takePhoto() {
				let that = this
				const ctx = uni.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: (res) => {
						// 这里是赋值的是临时文件路径
						that.src = res.tempImagePath
						// 可以走一遍七牛，拿到线上的地址 比如 https://qiaokun..../key
						// that.src = https://qiaokun..../key
						that.close()
					}
				});
			},
			chooseImage() {
				let that = this
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(JSON.stringify(res.tempFilePaths));
						console.log(res.tempFilePaths)
						// 这里赋值的是临时文件
						that.src = res.tempFilePaths[0]
						// 可以走一遍七牛，拿到线上的地址 比如 https://qiaokun..../key
						// that.src = https://qiaokun..../key
						that.close()
					}
				});
			},
			// 处理保存
			save() {
				// 这里调用接口
				// 你要设置的图像路径地址 this.src https://qiaokun..../key
				// 调用设置接口
			}
		}
	}
</script>

<style>

</style>
