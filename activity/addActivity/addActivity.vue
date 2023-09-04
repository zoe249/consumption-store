<template>
	<view class="cont">
		<view class="input-box">
			<view>店铺选择</view>
			<view class="input-right" @click="selectStore">
				<view :style="storeInfo.id == undefined ? style : ''">{{storeName}}</view>
				<image src="../../static/store/setArrow.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="input-box">
			<view>名称</view>
			<view class="input">集卡游戏
				<!-- <input type="text" placeholder="请输入活动名称" :placeholder-style="style" v-model="activityName"> -->
			</view>
		</view>
		<view class="input-box">
			<view>创建人</view>
			<view class="input">{{nickName}}</view>
		</view>
		<view class="input-box">
			<view>时间</view>
			<view class="input-right">
				<!-- <picker mode="date" :value="beginDateTime" @change="confirmBeginTime" @cancel="closeBeginTime">
					<input type="text" placeholder="年-月-日" :disabled="true" :placeholder-style="style"
						v-model="beginDate">
				</picker> -->
				<yp-datetime
					placeholder="年-月-日"
					:defaultValue="beginDateTime"
					start="2000-02-03 02"
					end="2100-10-28 22"
					fields="hour"
					@change="confirmBeginTime" class="select-time"
				></yp-datetime>
				<view class="symbol"> — </view>
				<yp-datetime
					placeholder="年-月-日"
					:defaultValue="endDateTime"
					start="2000-02-03 02"
					end="2100-10-28 22"
					fields="hour"
					@change="confirmEndTime" class="select-time"
				></yp-datetime>
				<!-- <picker mode="date" :value="endDateTime" @change="confirmEndTime" @cancel="closeBeginTime">
					<input type="text" placeholder="年-月-日" :disabled="true" :placeholder-style="style"
						v-model="endDate">
				</picker> -->
			</view>
		</view>
		<view class="input-box">
			<view>抽卡门槛</view>
			<view class="input-right" @click="openSelectValueShow('1')">
				<view v-if="thresholdValue === ''" class="select-box">请选择金额</view>
				<view v-else>{{thresholdValue}}</view>
				<image src="../../static/store/setArrow.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- <view class="input-box">
			<view>规则类型</view>
			<view class="rule-type-box">
				<view v-for="(ruleType, index) in ruleTypeList" :key="index" class="rule-type"
					:class="ruleTypeIdx == index ? 'select-rule-type' : ''"
					@click="selectRuleType(index, ruleType.type)">{{ruleType.name}}</view>
			</view>
		</view>
		<view class="input-box">
			<view>奖励次数</view>
			<view class="input-right" @click="openNumberOfRewardShow('2')">
				<view v-if="numberOfReward == 0" class="select-box">请选择奖励次数</view>
				<view v-else>{{numberOfReward}}次</view>
				<image src="../../static/store/setArrow.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="input-box">
			<view>单笔奖励上限</view>
			<view class="input-right" @click="openUpperLimitShow('3')">
				<view v-if="upperLimit == 0" class="select-box">请选择单笔奖励上限</view>
				<view v-else>{{upperLimit}}次</view>
				<image src="../../static/store/setArrow.png" mode="widthFix"></image>
			</view>
		</view> -->
		<view class="input-box textarea-box">
			<view>描述</view>
			<view class="input textarea">
				<u--textarea v-model="activityDesc" placeholder="请输入活动描述" :placeholderStyle="style"></u--textarea>
			</view>
		</view>
		<view class="input-box">
			<view>卡片种类</view>
			<view class="input-right" @click="openClasstypeShow('4')">
				<view v-if="classtype == 0" class="select-box">请选择卡片种类</view>
				<view v-else>{{classtype}}种</view>
				<image src="../../static/store/setArrow.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="add-card-tip-box">
			<view class="add-card-tip">
				<view class="add-card">添加卡片</view>
				<view class="probability">抽卡概率{{probability}}</view>
			</view>
			<view class="upload-card-box">
				<view v-for="(img, index) in cardList" :key="index" class="upload-card">
					<view class="add-img" v-if="img.cardPicture === ''">
						<u-upload @afterRead="afterRead" name="1" :multiple="false" :maxCount="10" :name="index">
							<view>
								<u-icon name="plus" color="#F2AB99" size="28"></u-icon>
							</view>
						</u-upload>
					</view>
					<view class="upload-cardimg" v-if="img.cardPicture !== ''">
						<image :src="img.cardPicture" mode=""></image>
						<image src="../../static/goods/closeIcon.png" mode="" class="delete-img"
							@click="deletePic(index)"></image>
					</view>
					<view class="add-card-input">
						NO.{{index + 1}}
						<!-- <input type="text" v-model="img.name" :placeholder="'卡片' + (index + 1)"
							:placeholder-style="style"> -->
					</view>
				</view>
			</view>
		</view>
		<view class="add-btn" @tap="$u.throttle(addActivity, 500)">下一步</view>

		<!-- 抽卡门槛 -->
		<u-popup :show="selectValueShow" @close="closeSelectValueShow" :closeable="true">
			<view class="add-title">抽卡门槛</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="thresholdValueValue"
					@change="bindThresholdChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in thresholdValueList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('1')">自定义</view>
				<view @click="confirmThresholdValue">确定</view>
			</view>
		</u-popup>

		<!-- 奖励次数 -->
		<!-- <u-popup :show="numberOfRewardShow" @close="closeNumberOfRewardShow" :closeable="true">
			<view class="add-title">奖励次数</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="numberOfRewardValue"
					@change="bindNumberOfRewardChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in numberOfRewardList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('2')">自定义</view>
				<view @click="confirmNumberOfReward">确定</view>
			</view>
		</u-popup> -->

		<!-- 单笔奖励上限 -->
		<!-- <u-popup :show="upperLimitShow" @close="closeUpperLimitShow" :closeable="true">
			<view class="add-title">单笔奖励上限</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="upperLimitValue" @change="bindUpperLimitChange"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in upperLimitList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('3')">自定义</view>
				<view @click="confirmUpperLimit">确定</view>
			</view>
		</u-popup> -->

		<!-- 卡片种类 -->
		<u-popup :show="classtypeShow" @close="closeClasstypeShow" :closeable="true">
			<view class="add-title">卡片种类</view>
			<view>
				<picker-view :indicator-style="indicatorStyle" :value="classtypeValue" @change="bindClasstypeChange"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item, index) in classtypeList" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="select-btn-box">
				<view class="definition-btn" @click="openDefinitionShow('4')">自定义</view>
				<view @click="confirmClasstype">确定</view>
			</view>
		</u-popup>

		<!-- 自定义输入框 -->
		<u-popup :show="definitionShow" @close="closeDefinitionShow" mode="center" round="10rpx">
			<view class="definition-box">
				<view class="definition-input">
					<input type="text" v-model="definitionValue" placeholder="请输入自定义"
						placeholder-style="color: #ccc; line-height: 60rpx;">
				</view>
				<view class="definition-btn-box">
					<view @click="closeDefinitionShow">取消</view>
					<view class="confirm-btn" @click="confirmDefinition">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import ypDatetime from '@/components/yp-datetime/yp-datetime.vue';
	import date from '@/common/js/date.js' // 引入时间戳转换日期格式组件
	export default {
		data() {
			return {
				style: 'color: #ccc;',
				// ruleTypeList: [{
				// 	name: '一次满足',
				// 	type: 1
				// }, {
				// 	name: '倍增满足',
				// 	type: 2
				// }],
				storeName: '请选择店铺', // 店铺名称
				activityName: '', // 活动名称
				beginDate: '', // 活动开始时间
				beginDateTime: 0,
				endDate: '', // 活动结束时间
				endDateTime: 0,
				thresholdValue: '', // 抽卡门槛金额
				// type: 2, // 规则类型，1-一次满足 2-倍增满足
				// ruleTypeIdx: 1,
				// numberOfReward: 0, // 奖励次数
				// upperLimit: 0, // 单笔奖励上限
				activityDesc: '', // 活动描述
				classtype: 0, // 卡片种类数量
				probability: 0, // 抽卡概率
				cardList: [], // 上传卡片列表
				thresholdValueList: ['18元', '28元', '38元', '48元'], // 抽卡门槛金额列表
				thresholdValueIdx: 0,
				thresholdValueValue: [0],
				indicatorStyle: `height: 70rpx;`,
				selectValueShow: false,
				// numberOfRewardShow: false,
				// upperLimitShow: false,
				classtypeShow: false,
				list: [],
				addTitle: '',
				// numberOfRewardList: ['1', '2', '3', '4', '5'], // 奖励次数列表
				// numberOfRewardValue: [0],
				// numberOfRewardIdx: 0,
				// upperLimitList: ['10'], // 单笔奖励上限列表
				// upperLimitValue: [0],
				// upperLimitIdx: 0,
				classtypeList: ['3', '4', '5', '6'], // 卡片种类列表
				classtypeValue: [0],
				classtypeIdx: 0,
				definitionShow: false, // 自定义弹出框
				definitionType: '',
				definitionValue: '',
				beginShow: false,
				endShow: false,
				storeId: '',
				storeInfo: {},
				fileList1: [],
				nickName: ''
			}
		},
		components: {
			ypDatetime
		},
		onLoad() {
			uni.hideShareMenu()
			// 计算活动默认开始时间（今天的日期）
			// const today = new Date()
			// today.setDate(today.getDate() + 1) // 明天日期
			this.beginDateTime = date.parseTime(Number(new Date()), "{y}-{m}-{d} {h}")
			this.beginDate = date.parseTime(Number(new Date()), "{y}-{m}-{d} {h}:{i}:{m}")
			// 计算活动默认结束时间（三个月后）
			this.nextMonthTime()
			// 抽卡门槛
			this.thresholdValue = this.thresholdValueList[2]
			this.thresholdValueIdx = 2
			this.thresholdValueValue = [2]
			// 奖励次数
			// this.numberOfReward = this.numberOfRewardList[0]
			// 单笔奖励上限
			// this.upperLimit = this.upperLimitList[0]
			// 卡片种类
			this.classtype = this.classtypeList[3]
			this.classtypeIdx = 3
			this.classtypeValue = [3]
			this.probability = this.roundFun(1 / this.classtype, 2)
			this.cardList = []
			for (var i = 0; i < this.classtype; i++) {
				this.cardList.push({
					cardPicture: ''
				})
			}
			this.getQiniuToken()
			// 创建人昵称
			this.nickName = uni.getStorageSync('userInfo').nickname
		},
		onShow() {
			console.log('门店信息', this.storeInfo)
			this.storeName = this.storeInfo.name
			this.storeId = this.storeInfo.id
			this.editActivityDesc()
		},
		methods: {
			editActivityDesc() {
				let storeName
				let typeName
				if (this.storeInfo.id == undefined) {
					storeName = ''
				} else {
					storeName = this.storeName
				}
				// if (this.type == '2') {
				// 	typeName = `，单笔最多可获${this.upperLimit}次抽卡机会`
				// } else {
				// 	typeName = ''
				// }
				console.log('beginDateTime', this.beginDateTime)
				let beginDate = this.beginDateTime.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日')
				let endDate = this.endDateTime.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日')
				this.activityDesc =
					`${beginDate}时 - ${endDate}时单笔消费满${this.thresholdValue}，即可获抽卡机会一次`
			},
			/* 选择规则类型 */
			// selectRuleType(index, type) {
			// 	this.ruleTypeIdx = index
			// 	this.type = type
			// 	this.editActivityDesc()
			// },
			/* 获取七牛云token */
			getQiniuToken() {
				let that = this
				that.request({
					url: that.config.getQiniuToken
				}).then(res => {
					that.qiniuToken = res.data.data.qiNiuToken
				})
			},
			/* 删除图片 */
			deletePic(index) {
				this.cardList[index].cardPicture = ''
			},
			// 新增图片
			async afterRead(event) {
				console.log('上传的图片', event)
				uni.showLoading({
					title: '上传中'
				})
				let index = event.name
				// 新增前删除原图片
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList1`].length
				lists.map((item) => {
					this[`fileList1`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url, index)
					let item = this[`fileList1`][fileListLen]
					this[`fileList1`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url, index) {
				let that = this
				// let leng = this.fullDescList.length - 1
				// 生成32位随机码
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
				var maxPos = chars.length
				var key
				for (let i = 0; i < 32; i++) {
					key += chars.charAt(Math.floor(Math.random() * maxPos))
				}
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.config.uploadUrl, //此处为华东地区，其他地区请查阅文档
						filePath: url,
						header: {
							"Content-Type": "multipart/form-data",
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: (res) => {
							uni.hideLoading()
							let pic = 'https://qiaokun.yuepong.com/' + JSON.parse(res.data).key
							that.cardList[index].cardPicture = pic
							setTimeout(function() {
								uni.hideLoading();
							}, 2000);
							// let data = JSON.parse(res.data)
							// that.key = data.key
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			// 抽卡门槛
			openSelectValueShow() {
				this.selectValueShow = true
			},
			closeSelectValueShow() {
				this.selectValueShow = false
			},
			bindThresholdChange(e) {
				console.log(e)
				this.thresholdValueIdx = e.detail.value[0]
			},
			confirmThresholdValue() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					this.thresholdValue = this.thresholdValueList[this.thresholdValueIdx]
					this.selectValueShow = false
					this.editActivityDesc()
				}, 1000)
			},
			// 奖励次数
			// openNumberOfRewardShow() {
			// 	this.numberOfRewardShow = true
			// },
			// closeNumberOfRewardShow() {
			// 	this.numberOfRewardShow = false
			// },
			// confirmNumberOfReward() {
			// 	uni.showLoading({
			// 		title: '加载中'
			// 	})
			// 	setTimeout(() => {
			// 		uni.hideLoading()
			// 		this.numberOfReward = parseInt(this.numberOfRewardList[this.numberOfRewardIdx])
			// 		this.numberOfRewardShow = false
			// 		this.editActivityDesc()
			// 	}, 1000)
			// },
			// bindNumberOfRewardChange(e) {
			// 	this.numberOfRewardIdx = e.detail.value[0]
			// },
			// 单笔奖励上限
			// openUpperLimitShow() {
			// 	this.upperLimitShow = true
			// },
			// closeUpperLimitShow() {
			// 	this.upperLimitShow = false
			// },
			// confirmUpperLimit() {
			// 	uni.showLoading({
			// 		title: '加载中'
			// 	})
			// 	setTimeout(() => {
			// 		uni.hideLoading()
			// 		this.upperLimit = parseInt(this.upperLimitList[this.upperLimitIdx])
			// 		this.upperLimitShow = false
			// 		this.editActivityDesc()
			// 	}, 1000)
			// },
			// bindUpperLimitChange(e) {
			// 	this.upperLimitIdx = e.detail.value[0]
			// },
			// 卡片种类
			openClasstypeShow() {
				this.classtypeShow = true
			},
			closeClasstypeShow() {
				this.classtypeShow = false
			},
			confirmClasstype() {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(() => {
					uni.hideLoading()
					this.classtype = parseInt(this.classtypeList[this.classtypeIdx])
					this.classtypeShow = false
					this.probability = this.roundFun(1 / this.classtype, 2)
					this.cardList = []
					for (var i = 0; i < this.classtype; i++) {
						this.cardList.push({
							cardPicture: ''
						})
					}
				}, 1000)
			},
			bindClasstypeChange(e) {
				console.log('卡片种类', e)
				this.classtypeIdx = e.detail.value[0]
			},
			openDefinitionShow(type) {
				this.definitionType = type
				this.definitionValue = ''
				if (type == '1') {
					// 抽卡门槛
					this.selectValueShow = false
					// } else if (type == '2') {
					// 	// 奖励次数
					// 	this.numberOfRewardShow = false
					// } else if (type == '3') {
					// 	// 单笔奖励上限
					// 	this.upperLimitShow = false
				} else if (type == '4') {
					// 卡片种类
					this.classtypeShow = false
				}
				this.definitionShow = true
			},
			closeDefinitionShow() {
				this.definitionShow = false
			},
			confirmDefinition() {
				if (this.definitionType == '1') {
					// 抽卡门槛
					this.thresholdValue = this.definitionValue
					this.definitionShow = false
					// } else if (this.definitionType == '2') {
					// 	// 奖励次数
					// 	this.numberOfReward = this.definitionValue
					// 	this.definitionShow = false
					// } else if (this.definitionType == '3') {
					// 	// 单笔奖励上限
					// 	if (this.definitionValue > 10) {
					// 		uni.showToast({
					// 			title: '单笔奖励次数上限最大为10',
					// 			icon: 'none'
					// 		})
					// 	} else {
					// 		this.upperLimit = this.definitionValue
					// 		this.definitionShow = false
					// 	}
				} else if (this.definitionType == '4') {
					// 卡片种类
					if (this.definitionValue > 6) {
						uni.showToast({
							title: '最多可添加6张卡片',
							icon: 'none'
						})
					} else {
						this.classtype = this.definitionValue
						this.probability = this.roundFun(1 / this.classtype, 2)
						this.cardList = []
						for (var i = 0; i < this.classtype; i++) {
							this.cardList.push({
								cardPicture: ''
							})
						}
						this.definitionShow = false
					}
				}
				this.editActivityDesc()
			},
			closeBeginTime() {
				this.beginShow = false
				this.endShow = false
			},
			confirmBeginTime(e) {
				console.log(e)
				this.beginDate = `${e.f1} ${e.hh}:${e.mm}`
				this.beginDateTime = `${e.f1} ${e.hh}:${e.mm}`.slice(0, 13)
				this.beginShow = false
				this.nextMonthTime()
			},
			/* 计算三个月后时间 */
			nextMonthTime() {
				// beginDate为 年-月-日 格式
				let currentDate = new Date(this.beginDate)
				let search_month = currentDate.getMonth()
				search_month = search_month + 3
				if (search_month > 11) {
					currentDate.setFullYear(currentDate.getFullYear() + 1)
					currentDate.setMonth(0)
				} else if (search_month < 0) {
					currentDate.setFullYear(currentDate.getFullYear() - 1)
					currentDate.setMonth(11)
				} else {
					currentDate.setMonth(search_month)
				}
				this.endDate = date.parseTime(currentDate.getTime(), "{y}-{m}-{d} {h}")
				this.endDateTime = this.endDate
				this.editActivityDesc()
			},
			confirmEndTime(e) {
				console.log(e)
				this.endDate = `${e.f1} ${e.hh}:${e.mm}`
				this.endDateTime = `${e.f1} ${e.hh}:${e.mm}`.slice(0, 13)
				this.endShow = false
				this.editActivityDesc()
			},
			/* 店铺选择 */
			selectStore() {
				if (this.beginDate === '' && this.endDate === '') {
					uni.showToast({
						title: '请选择活动时间',
						icon: 'none'
					})
				} else {
					uni.navigateTo({
						url: '../storeList/storeList?storeId=' + this.storeInfo.id + '&beginDate=' + this
							.beginDateTime +
							'&endDate=' + this.endDateTime
					})
				}
			},
			/* 向下取整 */
			roundFun(value, n) {
				// value为原数字，n为保留几位小数
				return Math.floor(value * Math.pow(10, n)) / Math.pow(10, n);
			},
			/* 创建活动 */
			addActivity() {
				let that = this
				let cardFlag = false
				// let cardNameFlag = false
				console.log('cardList', that.cardList)
				that.cardList.forEach(card => {
					card.select = false
					if (card.cardPicture == '') {
						cardFlag = true
					}
					// if (card.name == '') {
					// 	cardNameFlag = true
					// }
				})
				// if (that.activityName === '') {
				// 	uni.showToast({
				// 		title: '请输入活动名称',
				// 		icon: 'none'
				// 	})
				// }
				if (that.storeInfo.id == undefined) {
					uni.showToast({
						title: '请选择店铺',
						icon: 'none'
					})
				} else if (that.beginDate === '') {
					uni.showToast({
						title: '请选择活动开始时间',
						icon: 'none'
					})
				} else if (that.endDate === '') {
					uni.showToast({
						title: '请选择活动结束时间',
						icon: 'none'
					})
				} else if (parseFloat(that.thresholdValue) == 0) {
					uni.showToast({
						title: '请选择抽卡门槛',
						icon: 'none'
					})
					// } else if (that.numberOfReward == 0) {
					// 	uni.showToast({
					// 		title: '请选择奖励次数',
					// 		icon: 'none'
					// 	})
					// } else if (that.upperLimit == 0) {
					// 	uni.showToast({
					// 		title: '请选择单笔奖励上限',
					// 		icon: 'none'
					// 	})
				} else if (that.activityDesc === '') {
					uni.showToast({
						title: '请输入活动描述',
						icon: 'none'
					})
				} else if (that.classtype == 0) {
					uni.showToast({
						title: '请选择卡片种类',
						icon: 'none'
					})
				} else if (cardFlag) {
					uni.showToast({
						title: '请上传卡片图片',
						icon: 'none'
					})
					// } else if (cardNameFlag) {
					// 	uni.showToast({
					// 		title: '请输入卡片名称',
					// 		icon: 'none'
					// 	})
				} else {
					let activityInfo = {
						storeId: that.storeInfo.id,
						beginDate: that.beginDateTime,
						endDate: that.endDateTime,
						thresholdValue: parseFloat(that.thresholdValue),
						description: that.activityDesc,
						classType: that.classtype,
						cardList: that.cardList,
						nickName: that.nickName
					}
					uni.navigateTo({
						url: '../rule/rule?storeId=' + that.storeInfo.id +
							'&activityInfo=' + JSON.stringify(activityInfo) + '&state=0'
					})
					// uni.showLoading({
					// 	title: '保存中'
					// })
					// that.request({
					// 	url: that.config.editActivity,
					// 	method: 'POST',
					// 	header: {
					// 		'Content-Type': 'application/json',
					// 		'Transaction-No': new Date().getTime()
					// 	},
					// 	data: {
					// 		// name: that.activityName, // 活动名称
					// 		storeId: that.storeInfo.id,
					// 		beginDate: that.beginDate,
					// 		endDate: that.endDate,
					// 		thresholdValue: parseFloat(that.thresholdValue),
					// 		// type: that.type,
					// 		// numberOfReward: that.numberOfReward,
					// 		// upperLimit: that.upperLimit,
					// 		description: that.activityDesc,
					// 		classType: that.classtype,
					// 		cardList: that.cardList
					// 	}
					// }).then(res => {
					// 	console.log(res)
					// 	uni.hideLoading()
					// 	if (res.data.code == '200000') {
					// 		uni.navigateTo({
					// 			url: '../rule/rule?id=' + res.data.data +
					// 				'&addActivityShow=true&storeId=' + that.storeInfo.id
					// 		})
					// 	} else {
					// 		uni.showToast({
					// 			title: res.data.detail,
					// 			icon: 'none'
					// 		})
					// 	}
					// })
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>

<style scoped>
	.input-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 24rpx;
		color: #333;
		font-size: 28rpx;
		padding: 26rpx 0;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.input-right {
		display: flex;
		align-items: center;
	}

	.input-right image {
		width: 8rpx;
		height: auto;
		margin-left: 10rpx;
	}

	.input {
		text-align: right;
	}

	.select-time {
		width: 240rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		background-color: #F4F4F4;
	}

	.symbol {
		padding: 0 20rpx;
	}

	.select-box {
		color: #ccc;
	}

	.rule-type-box {
		display: flex;
		align-items: center;
	}

	.rule-type {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50rpx;
		text-align: center;
		margin-left: 14rpx;
		background-color: #EBEBEB;
		color: #999;
		border: 2rpx solid #999;
	}

	.rule-type.select-rule-type {
		background-color: #FCEEEB;
		color: #F2AB99;
		border-color: #F2AB99;
	}

	.textarea-box {
		align-items: flex-start;
	}

	.textarea {
		width: 512rpx;
		font-size: 28rpx;
	}

	.textarea>>>.u-textarea {
		padding: 0;
	}

	.textarea>>>.u-textarea__field {
		color: #333;
		font-size: 28rpx;
	}

	.add-card-tip-box {
		padding: 26rpx 24rpx;
	}

	.add-card-tip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
	}

	.add-card {
		display: flex;
		align-items: center;
		color: #333;
	}

	.card-tip {
		color: #999;
	}

	.probability {
		color: #F2AB99;
	}

	.upload-card-box {
		padding-top: 26rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.upload-card {
		width: 164rpx;
		margin-right: 14rpx;
		position: relative;
		margin-bottom: 20rpx;
	}

	.upload-cardimg {
		width: 164rpx;
		height: 220rpx;
		border-radius: 10rpx;
		border: 2rpx solid #F2AB99;
	}

	.upload-card image {
		width: 164rpx;
		height: 220rpx;
	}

	.upload-card:nth-child(4n) {
		margin-right: 0;
	}

	.add-img {
		width: 164rpx;
		height: 220rpx;
		border-radius: 10rpx;
		border: 2rpx dotted #F2AB99;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add-img>>>.u-upload {
		flex: unset;
	}

	.add-card-input {
		/* border: 2rpx dotted #F2AB99; */
		border-radius: 10rpx;
		color: #333;
		font-size: 28rpx;
		margin-top: 8rpx;
		padding-left: 12rpx;
		text-align: center;
	}

	.upload-card image.delete-img {
		width: 32rpx;
		height: 32rpx;
		position: absolute;
		right: -8rpx;
		top: -16rpx;
	}

	.add-btn {
		margin: 40rpx 32rpx;
		border-radius: 50rpx;
		background-color: #F2AB99;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.add-title {
		background-color: #F4F4F4;
		color: #333;
		font-size: 28rpx;
		font-weight: 600;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	.picker-view {
		height: 300rpx;
	}

	.item {
		height: 70rpx;
		line-height: 70rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.select-btn-box {
		margin: 22rpx 24rpx;
	}

	.select-btn-box view {
		background-color: #F2AB99;
		color: #fff;
		border: 2rpx solid #F2AB99;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 50rpx;
		font-size: 28rpx;
		margin-top: 26rpx;
	}

	.select-btn-box view.definition-btn {
		background-color: #fff;
		color: #F2AB99;
		border: 2rpx solid #F2AB99;
	}

	.cont>>>.u-popup__content__close--top-right {
		top: 24rpx;
		right: 24rpx;
	}

	.definition-box {
		margin: 60rpx 24rpx;
	}

	.definition-input input {
		background-color: #F4F4F4;
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 20rpx;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.definition-btn-box {
		display: flex;
		align-items: center;
	}

	.definition-btn-box view {
		width: 172rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		text-align: center;
		color: #F2AB99;
		font-size: 28rpx;
		border: 2rpx solid #F2AB99;
	}

	.definition-btn-box view.confirm-btn {
		background-color: #F2AB99;
		color: #fff;
		margin-left: 14rpx;
	}
</style>
