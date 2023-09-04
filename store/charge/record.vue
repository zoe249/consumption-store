<template>
	<view class="stream-record">
		<view class="income-tab">
			<u-tabs :list="list" :scrollable="false" lineColor="#F2AB99" :activeStyle="{ color: '#F2AB99' }" :current="current"
			 @change="changeType"></u-tabs>
		</view>
		<view class="computed-box" :class="type == 2 ? 'income-computed-box' : ''" @click="openCalculatorShow">
			<view class="computed-result">{{priceResult}}</view>
			<view v-if="priceProcessState">{{priceProcess}}</view>
		</view>
		<view class="add-stream-box">
			<view class="add-box" @click="openClassifyShow">
				<view class="add-icon">
					<image :src="imgUrl + 'fenlei.png'" mode="widthFix"></image>
					<view>分类</view>
				</view>
				<view>{{classify}} > {{subClassify}}</view>
			</view>
			<view class="add-box" @click="openAccountShow">
				<view class="add-icon">
					<image :src="imgUrl + 'zhanghu.png'" mode="widthFix"></image>
					<view>账户</view>
				</view>
				<view>{{account}}</view>
			</view>
			<view class="add-box" @click="openTimeShow">
				<view class="add-icon">
					<image :src="imgUrl + 'time.png'" mode="widthFix"></image>
					<view>时间</view>
				</view>
				<view>{{timeDate}}</view>
			</view>
			<view class="add-box">
				<view class="add-icon">
					<image :src="imgUrl + 'chengyuan.png'" mode="widthFix"></image>
					<view>成员</view>
				</view>
				<view>{{userInfo.phone}}</view>
			</view>
			<view class="remark-box">
				<view class="add-icon">
					<image :src="imgUrl + 'beizhu.png'" mode="widthFix"></image>
					<view>备注</view>
				</view>
				<view class="remark-desc">
					<textarea placeholder="请输入备注" v-model="remark" :auto-height="true"></textarea>
				</view>
			</view>
			<view class="upload-img-box">
				<view class="add-icon">
					<image :src="imgUrl + 'tupian.png'" mode="widthFix"></image>
					<view>图片上传</view>
				</view>
				<view class="upload-img" @click="chooseStreamIng" :class="streamImg === '' ? '' : 'stream-img'">
					<block v-if="streamImg === ''">
						<image :src="imgUrl + 'addAvatar.png'"></image>
					</block>
					<block v-else>
						<image :src="streamImg" mode=""></image>
					</block>
				</view>
			</view>
		</view>
		<view class="add-btn-box" :class="disabledState ? 'disabled-btn' : ''">
			<block v-if="!editStream">
				<view class="again-add" @click="addMore">
					<image :src="imgUrl + 'addAvatar.png'"></image>
					<view>再记一笔</view>
				</view>
				<view class="finish-btn" @click="verifyStreamIng">完成</view>
			</block>
			<block v-if="editStream">
				<view class="again-add" @click="deleteEditStream">删除</view>
				<view class="finish-btn" @click="saveEditStream">保存</view>
			</block>
		</view>

		<!-- 数字键盘 -->
		<view class="calculator-box">
			<u-popup :show="calculatorShow" mode="bottom" @close="closeCalculatorShow" :overlayOpacity="0">
				<yp-calculator ref="calculator" @closeCalculatorPopup="closeCalculatorShow" @computedProcess="computedProcess"
				 @computedResult="computedResult" @affirmComputed="affirmComputed"></yp-calculator>
			</u-popup>
		</view>


		<!-- 分类 -->
		<u-popup :show="classifyShow" @close="closeClassifyShow" round="10rpx" mode="bottom">
			<view>
				<view class="close-box" @click="closeClassifyShow">
					<u-icon name="close" color="#999" size="20"></u-icon>
				</view>
				<scroll-view scroll-y="true" class="classify-scroll">
					<view class="classify-cont">
						<view v-for="(item, index) in historyClassifyList" :key="index">
							<view class="classify-name-box">
								<view class="classify-name">
									<image :src="imgUrl + 'time.png'" mode="widthFix"></image>
									<view>最近使用</view>
								</view>
							</view>
							<view class="sub-classify-box">
								<view v-for="(sitem, sidx) in item.itemList" :key="sidx" class="sub-classify" @click="selectClassify(item, sitem, sidx)"
								 :class="classOfAccountsCode == sitem.code ? 'active-classify' : ''">{{sitem.className}}
								</view>
							</view>
						</view>
						<view v-for="(item, index) in classifyList" :key="index">
							<view class="classify-name-box">
								<view class="classify-name">
									<image :src="item.icon" mode="widthFix"></image>
									<view>{{item.name}}</view>
								</view>
								<view class="add-img" @click="openAddClassify(item)">
									<u-icon name="plus" color="#fff" size="12"></u-icon>
								</view>
							</view>
							<view class="sub-classify-box">
								<view v-for="(sitem, sidx) in item.itemList" :key="sidx" class="sub-classify" @click="selectClassify(item, sitem, sidx)"
								 @longpress="openDeleteClassify" :class="classOfAccountsCode == sitem.code ? 'active-classify' : ''">{{sitem.name}}
									<view class="delete-element" v-if="deleteShow" @click.stop="deleteClassify(index, sidx, sitem)">
										<u-icon name="close" color="#fff" size="12"></u-icon>
									</view>
								</view>
							</view>
						</view>
						<view class="classify-save" v-if="deleteShow" @click="saveDeleteClassify">保存</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<!-- 添加分类 -->
		<u-modal :show="addClassifyShow" @confirm="addClassify" @cancel="cancelAddClassify" :showCancelButton="true"
		 confirmColor="#F2AB99">
			<u-input v-model="classifyName" placeholder="请输入二级分类名称" placeholderStyle="text-align: center; color: #ccc;">
			</u-input>
		</u-modal>

		<!-- 账户 -->
		<u-popup :show="accountShow" @close="closeAccountShow" round="10rpx" mode="bottom">
			<view>
				<view class="close-box" @click="closeAccountShow">
					<u-icon name="close" color="#999" size="20"></u-icon>
				</view>
				<view class="account-box">
					<block v-for="(item, index) in accountList" :key="index">
						<view class="account-name">{{item.name}}</view>
						<view class="sub-account-box" v-for="(sitem, sidx) in item.slist" :key="sidx" @click="selectAccount(sitem)">
							<image :src="imgUrl + sitem.icon" mode="widthFix"></image>
							<view class="sub-account">{{sitem.name}}</view>
						</view>
					</block>
				</view>
			</view>
		</u-popup>

		<!-- 选择时间 -->
		<u-datetime-picker :show="calendarShow" :minDate="0" v-model="timeValue" mode="date" :closeOnClickOverlay="true"
		 @confirm="confirmTime" @cancel="cancleTimeShow" @close="cancleTimeShow"></u-datetime-picker>
	</view>
</template>

<script>
	import ypCalculator from '@/components/yp-calculator/yp-calculator.vue'
	import date from '@/common/js/date.js'
	import rpn from '@/common/js/computed.js'
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				list: [{
					name: '支出'
				}, {
					name: '收入'
				}],
				current: 0,
				priceResult: '0.00',
				priceProcess: '',
				priceProcessState: true,
				calculatorShow: false, // 键盘
				classifyShow: false, // 分类
				addClassifyShow: false,
				classifyName: '',
				classify: '',
				subClassify: '',
				classifyList: [],
				accountShow: false, // 账户
				accountList: [{
					name: '现金账户',
					slist: [{
						name: '现金',
						icon: 'xianjin.png',
						value: 1
					}]
				}, {
					name: '虚拟账户',
					slist: [{
						name: '微信',
						icon: 'weChatPay.png',
						value: 2
					}, {
						name: '支付宝',
						icon: 'alipay.png',
						value: 3
					}, {
						name: '银行卡',
						icon: 'cardPay.png',
						value: 4
					}]
				}],
				accountsType: 0,
				account: '',
				calendarShow: false, // 时间
				timeValue: 0,
				timeDate: '',
				timeDateValue: '',
				deleteShow: false,
				type: 1, // 1支出2收入
				parentCode: '',
				userInfo: {},
				classOfAccountsCode: '', // 二级分类code
				remark: '',
				qiniuToken: '',
				streamImg: '',
				picture: '',
				deleteClassifyList: [],
				streamId: '',
				editStream: false,
				addMoreState: false,
				resultState: false,
				i: 0,
				item: {},
				sitem: {},
				index: 0,
				idx: 0,
				disabledState: false,
				historyClassifyList: []
			}
		},
		components: {
			ypCalculator
		},
		onLoad(options) {
			this.storeId = uni.getStorageSync('storeInfo').id
			this.userInfo = uni.getStorageSync('userInfo')
			let time = new Date()
			this.timeValue = time.getTime()
			this.timeDate = date.parseTime(this.timeValue, "{y}-{m}-{d}")
			this.timeDateValue = date.parseTime(this.timeValue, "{y}-{m}-{d} {h}:{i}")
			this.streamId = options.streamId
			this.disabledState = false
			this.accountsType = uni.getStorageSync('accountType')
			if (this.accountsType == 1) {
				this.account = '现金'
			} else if (this.accountsType == 2) {
				this.account = '微信'
			} else if (this.accountsType == 3) {
				this.account = '支付宝'
			} else if (this.accountsType == 4) {
				this.account = '银行卡'
			} else {
				this.accountsType = ''
				this.account = ''
			}
			if (options.sitem != undefined) {
				this.sitem = JSON.parse(options.sitem)
				this.item = JSON.parse(options.item)
				this.idx = options.idx
				this.index = options.index
			}
			if (this.streamId != undefined) {
				this.editStream = true
				this.getStreamInfo()
			} else {
				this.getHistoryClassify()
				this.getClassifyList()
			}
			this.getQiniuToken()
		},
		watch: {
			remark() {
				if (this.remark.length > 200) {
					uni.showToast({
						title: '商品特色描述不可超过200个字',
						icon: 'none'
					})
					setTimeout(() => {
						this.remark = this.remark.substring(0, 200)
					}, 10)
				}
			},
			priceProcess() {
				let result = rpn.calCommonExp(this.priceProcess)
				if (this.priceProcess !== '') {
					if (parseFloat(result) > 0) {
						this.priceResult = result
					} else if (result == undefined) {
						this.priceResult = '0.00'
					} else {
						this.priceResult = rpn.calCommonExp(this.priceProcess.slice(0, -1))
					}
				}
			},
			priceResult() {
				if (this.priceResult == 0) {
					this.priceProcess = ''
					this.priceProcessState = true
					this.calculatorShow = true
					this.$refs.calculator.resetData()
					this.resultState = false
					this.i = 0
				}
			}
		},
		methods: {
			changeType(e) {
				if (e.index == 0) {
					// 支出
					this.type = 1
				} else if (e.index == 1) {
					// 收入
					this.type = 2
				}
				this.classOfAccountsCode = ''
				this.classify = ''
				this.subClassify = ''
				this.historyClassifyList = []
				this.getHistoryClassify()
				this.getClassifyList()
			},
			openCalculatorShow() {
				this.priceProcess = ''
				this.priceProcessState = true
				this.calculatorShow = true
				this.$refs.calculator.resetData()
				this.resultState = false
				this.i = 0
			},
			closeCalculatorShow() {
				this.calculatorShow = false
			},
			computedProcess(e) {
				this.priceProcess = e
			},
			computedResult(e) {
				if (!this.resultState) {
					this.priceResult = e === '' ? '0.00' : e
				}
			},
			affirmComputed() {
				this.i++
				let result = rpn.calCommonExp(this.priceProcess)
				if (this.priceProcess !== '') {
					if (parseFloat(result) > 0) {
						this.priceResult = result
					} else if (result == undefined) {
						this.priceResult = '0.00'
					} else {
						this.priceResult = rpn.calCommonExp(this.priceProcess.slice(0, -1))
					}
				}
				if (this.i == 0) {
					// 无计算过程，第一次点击隐藏键盘
					this.calculatorShow = false
				} else if (this.i == 1) {
					// 第一次点击，计算过程隐藏
					this.priceProcessState = false
				} else if (this.i == 2) {
					// 隐藏键盘
					this.calculatorShow = false
				}
			},
			openClassifyShow() {
				this.classifyShow = true
				this.deleteShow = false
			},
			closeClassifyShow() {
				this.classifyShow = false
			},
			/* 选择烘焙分类 */
			selectClassify(item, sitem, sidx) {
				console.log(item)
				if (item.name == undefined) {
					// 最近使用
					this.classify = item.itemList[sidx].parentName
					this.subClassify = item.itemList[sidx].className
					this.classOfAccountsCode = item.itemList[sidx].classOfAccountId
				} else {
					this.classify = item.name
					this.subClassify = sitem.name
					this.classOfAccountsCode = sitem.code
				}
				this.classifyShow = false
			},
			openAccountShow() {
				this.accountShow = true
			},
			closeAccountShow() {
				this.accountShow = false
			},
			/* 选择账户 */
			selectAccount(item) {
				this.account = item.name
				this.accountsType = item.value
				this.accountShow = false
			},
			cancelAddClassify() {
				this.addClassifyShow = false
			},
			openTimeShow() {
				this.calendarShow = true
			},
			cancleTimeShow() {
				this.calendarShow = false
			},
			/* 打开删除分类 */
			openDeleteClassify() {
				this.deleteShow = true
			},
			openAddClassify(item) {
				this.classifyName = ''
				this.parentCode = item.code
				this.classifyShow = false
				this.addClassifyShow = true
			},
			/* 获取分类列表 */
			getClassifyList() {
				let that = this
				that.classifyList = []
				that.request({
					url: `${that.config.operateClassify}?storeId=${that.storeId}&type=${that.type}`
				}).then(res => {
					console.log('分类列表', res)
					const data = res.data.data
					that.classifyList = data
				})
			},
			/* 添加分类 */
			addClassify() {
				let that = this
				that.request({
					url: that.config.operateClassify,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						type: that.type,
						name: that.classifyName,
						icon: '',
						parentCode: that.parentCode
					}
				}).then(res => {
					if (res.data.code == '200000') {
						uni.showToast({
							title: '添加成功',
							icon: 'none'
						})
						that.getClassifyList()
						that.classifyShow = true
						that.addClassifyShow = false
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			confirmTime(e) {
				this.timeValue = e.value
				this.timeDate = date.parseTime(e.value, "{y}-{m}-{d}")
				let time = new Date()
				let hour
				let minutes
				if (time.getHours() < 10) {
					hour = '0' + time.getHours()
				} else {
					hour = time.getHours()
				}
				if (time.getMinutes() < 10) {
					minutes = '0' + time.getMinutes()
				} else {
					minutes = time.getMinutes()
				}
				this.timeDateValue = `${this.timeDate} ${hour}:${minutes}`
				this.calendarShow = false
			},
			/* 再记一笔 */
			addMore() {
				this.addMoreState = true
				this.verifyStreamIng()
			},
			verifyStreamIng() {
				if (this.classOfAccountsCode == '') {
					uni.showToast({
						title: '请选择收支分类',
						icon: 'none'
					})
				} else if (this.accountsType == '') {
					uni.showToast({
						title: '请选择收支账户',
						icon: 'none'
					})
				} else {
					if (this.streamImg === '') {
						this.saveAccountStream()
					} else {
						this.uploadFilePromise()
					}
				}
			},
			/* 添加流水 */
			saveAccountStream() {
				let that = this
				that.disabledState = true
				that.request({
					url: that.config.accountStream,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						storeId: that.storeId,
						amount: that.priceResult,
						currency: '',
						units: '',
						accountTitle: that.type,
						classOfAccountsCode: that.classOfAccountsCode,
						accountsType: that.accountsType,
						time: that.timeDateValue,
						bookkeeper: that.userInfo.phone,
						remark: that.remark,
						picture: that.picture
					}
				}).then(res => {
					if (res.data.code == '200000') {
						uni.setStorageSync('accountType', that.accountsType)
						uni.showToast({
							title: '添加成功',
							icon: 'none'
						})
						if (that.addMoreState) {
							// 再记一笔
							that.priceResult = '0.00'
							that.classOfAccountsCode = ''
							that.accountsType = ''
							let time = new Date()
							this.timeValue = time.getTime()
							this.timeDate = date.parseTime(this.timeValue, "{y}-{m}-{d}")
							this.timeDateValue = date.parseTime(this.timeValue, "{y}-{m}-{d} {h}:{i}")
							that.remark = ''
							that.picture = ''
							that.classify = ''
							that.subClassify = ''
							that.addMoreState = false
							that.disabledState = false
							that.accountsType = uni.getStorageSync('accountType')
							if (that.accountsType == 1) {
								that.account = '现金'
							} else if (that.accountsType == 2) {
								that.account = '微信'
							} else if (that.accountsType == 3) {
								that.account = '支付宝'
							} else if (that.accountsType == 4) {
								that.account = '银行卡'
							} else {
								that.accountsType = ''
								that.account = ''
							}
							that.historyClassifyList = []
							that.getHistoryClassify()
						} else {
							setTimeout(() => {
								uni.navigateBack()
								that.disabledState = false
							}, 2000)
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取七牛云token */
			getQiniuToken() {
				let that = this
				that.request({
					url: that.config.getQiniuToken
				}).then(res => {
					that.qiniuToken = res.data.data.qiNiuToken
				})
			},
			/* 选择图片 */
			chooseStreamIng() {
				let that = this
				uni.chooseImage({
					count: 1,
					success: function(res) {
						console.log(res.tempFilePaths)
						that.streamImg = res.tempFilePaths[0]
					}
				})
			},
			/* 上传图片 */
			uploadFilePromise() {
				let that = this
				uni.showToast({
					title: '上传中',
					icon: 'loading'
				})
				// 生成32位随机码
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxPos = chars.length
				var key
				for (let i = 0; i < 32; i++) {
					key += chars.charAt(Math.floor(Math.random() * maxPos))
				}
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.config.uploadUrl,
						filePath: that.streamImg,
						header: {
							"Content-Type": "multipart/form-data"
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken,
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							that.picture = 'https://qiaokun.yuepong.com/' + data.key
							that.saveAccountStream()
						},
						fail(err) {
							console.log('上传失败', err)
						}
					})
				})
			},
			/* 删除分类 */
			deleteClassify(index, idx, item) {
				this.classifyList[index].itemList.splice(idx, 1)
				this.deleteClassifyList.push(item.code)
			},
			/* 保存删除原料 */
			saveDeleteClassify() {
				let that = this
				uni.showModal({
					content: '删除分类后，也会删除其下流水，是否继续删除',
					success: function(res) {
						if (res.confirm) {
							that.request({
								url: that.config.operateClassify,
								method: 'DELETE',
								header: {
									'Content-Type': 'application/json',
									'Transaction-No': new Date().getTime()
								},
								data: {
									codeList: that.deleteClassifyList
								}
							}).then(res => {
								console.log('删除分类', res)
								if (res.data.code == '200000') {
									uni.showToast({
										title: '删除成功',
										icon: 'none'
									})
									setTimeout(() => {
										that.getClassifyList()
										that.deleteShow = false
									}, 1000)
								} else {
									uni.showToast({
										title: res.data.detail,
										icon: 'none'
									})
								}
							})
						}
					}
				})
			},
			/* 获取流水详情 */
			getStreamInfo() {
				let that = this
				let time = new Date()
				that.request({
					url: `${that.config.accountStream}/${that.streamId}`
				}).then(res => {
					console.log('流水详情', res)
					const data = res.data.data
					that.accountsType = data.accountsType
					if (data.accountsType == 1) {
						that.account = '现金'
					} else if (data.accountsType == 2) {
						that.account = '微信'
					} else if (data.accountsType == 3) {
						that.account = '支付宝'
					} else if (data.accountsType == 4) {
						that.account = '银行卡'
					}
					that.priceResult = data.amount
					that.timeDate = data.time
					that.timeDateValue = `${data.time} ${time.getHours()}:${time.getMinutes()}`
					that.remark = data.remark
					that.classify = data.parentClassOfAccountsCodeName
					that.subClassify = data.classOfAccountsCodeName
					uni.getImageInfo({
						src: data.picture,
						success: (image) => {
							that.streamImg = image.path
						},
						fail: (err) => {
							uni.hideLoading()
						}
					})
					that.type = data.accountTitle
					if (data.accountTitle == 1) {
						that.current = 0
					} else if (data.accountTitle == 2) {
						that.current = 1
					}
					that.classOfAccountsCode = data.classOfAccountsCode
					that.getHistoryClassify()
					that.getClassifyList()
				})
			},
			/* 修改账目流水 */
			saveEditStream() {
				let that = this
				that.request({
					url: `${that.config.accountStream}/${that.streamId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						amount: that.priceResult,
						currency: '',
						units: '',
						accountTitle: that.type,
						classOfAccountsCode: that.classOfAccountsCode,
						accountsType: that.accountsType,
						time: that.timeDateValue,
						bookkeeper: that.userInfo.phone,
						remark: that.remark,
						picture: that.picture
					}
				}).then(res => {
					console.log('修改账目流水', res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(() => {
							var pages = getCurrentPages()
							var prevPage = pages[pages.length - 2]
							let streamInfo = {
								item: that.item,
								sitem: that.sitem,
								index: that.index,
								idx: that.idx
							}
							prevPage.$vm.streamInfo = streamInfo
							uni.navigateBack()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 删除账目流水 */
			deleteEditStream() {
				let that = this
				that.request({
					url: `${that.config.accountStream}/${that.streamId}`,
					method: 'DELETE',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					console.log('删除账目流水', res)
					if (res.data.code == '200000') {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						setTimeout(() => {
							var pages = getCurrentPages()
							var prevPage = pages[pages.length - 2]
							let streamInfo = {
								item: that.item,
								sitem: that.sitem,
								index: that.index,
								idx: that.idx
							}
							prevPage.$vm.streamInfo = streamInfo
							uni.navigateBack()
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 获取使用过的分类列表 */
			getHistoryClassify() {
				let that = this
				that.request({
					url: that.config.historyClassify,
					data: {
						storeId: that.storeId,
						type: that.type
					}
				}).then(res => {
					console.log('最近使用', res)
					const data = res.data.data
					if (data.length != 0) {
						that.historyClassifyList.push({
							itemList: data
						})
						that.subClassify = data[0].className
						that.classOfAccountsCode = data[0].classOfAccountId
						that.classify = data[0].parentName
					}
				})
			}
		}
	}
</script>

<style scoped>
	.income-tab {
		background-color: #fff;
	}

	.computed-box {
		margin: 0 24rpx;
		padding: 40rpx 0;
		font-size: 28rpx;
		color: #999;
		border-bottom: 6rpx solid #62B279;
	}

	.income-computed-box {
		border-color: #dd5b33;
	}

	.computed-result {
		color: #62B279;
		font-size: 60rpx;
		margin-bottom: 20rpx;
		font-weight: 600;
	}

	.income-computed-box .computed-result {
		color: #dd5b33;
	}

	.add-stream-box {
		background-color: #fff;
		margin: 0 24rpx;
		border-radius: 0 0 10rpx 10rpx;
		font-size: 28rpx;
		color: #999;
		padding: 0 20rpx;
	}

	.add-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 10rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 28rpx;
		color: #999;
	}

	.add-icon {
		display: flex;
		align-items: center;
	}

	.add-icon image {
		width: 30rpx;
		height: auto;
		display: block;
		margin-right: 6rpx;
	}

	.close-box {
		height: 80rpx;
		background-color: #F4F4F4;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0 24rpx 0 0;
		overflow: hidden;
	}

	.classify-cont {
		margin: 0 24rpx;
	}

	.classify-scroll {
		max-height: 800rpx;
	}

	.classify-name-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 20rpx 0;
		font-size: 28rpx;
		color: #333;
	}

	.classify-name {
		display: flex;
		align-items: center;
	}

	.classify-name image {
		width: 36rpx;
		height: auto;
		display: block;
		margin-right: 12rpx;
	}

	.add-img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 10rpx;
		background-color: #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sub-classify-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.sub-classify {
		width: 156rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		background-color: #F4F4F4;
		border: 1rpx solid #D1DCE1;
		color: #999;
		text-align: center;
		font-size: 24rpx;
		margin: 0 20rpx 20rpx 0;
		position: relative;
	}

	.sub-classify:nth-child(4n) {
		margin-right: 0;
	}

	.active-classify {
		color: #F2AB99;
		background-color: #FCEEEB;
		border-color: #F2AB99;
	}

	.delete-element {
		position: absolute;
		right: -15rpx;
		top: -15rpx;
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		background-color: #333;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.classify-save {
		margin: 20rpx 0;
		width: 400rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		border-radius: 10rpx;
		background-color: #F2AB99;
		margin: 0 auto 40rpx;
		display: block;
	}

	.account-box {
		padding: 30rpx 24rpx 0;
		font-size: 28rpx;
	}

	.account-name {
		color: #333;
		padding-bottom: 30rpx;
		font-weight: 600;
	}

	.sub-account-box {
		display: flex;
		align-items: center;
		color: #999;
		padding-bottom: 30rpx;
	}

	.sub-account-box image {
		width: 46rpx;
		height: auto;
		display: block;
		margin-right: 10rpx;
	}

	.remark-box {
		border-bottom: 1rpx solid #eee;
	}

	.upload-img-box,
	.remark-box {
		padding: 26rpx 10rpx;
		font-size: 28rpx;
		color: #999;
	}

	.remark-desc {
		margin: 30rpx 0 0;
	}

	.upload-img {
		width: 200rpx;
		height: 200rpx;
		border-radius: 10rpx;
		background-color: #F8F8F8;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 30rpx;
	}

	.upload-img image {
		width: 40rpx;
		height: 40rpx;
	}

	.stream-img image {
		width: 200rpx;
		height: 200rpx;
	}

	.add-btn-box {
		display: flex;
		align-items: center;
		margin: 40rpx 24rpx;
	}

	.disabled-btn {
		pointer-events: none;
	}

	.again-add,
	.finish-btn {
		width: 344rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #F2AB99;
		font-size: 28rpx;
		border: 1rpx solid #F2AB99;
		border-radius: 50rpx;
	}

	.again-add {
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: unset;
	}

	.again-add image {
		width: 26rpx;
		height: 26rpx;
		display: block;
		margin-right: 8rpx;
	}

	.finish-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}

	.stream-record>>>.u-popup__content {
		overflow: hidden;
	}

	.calculator-box>>>.u-popup__content {
		background-color: unset !important;
	}
</style>
