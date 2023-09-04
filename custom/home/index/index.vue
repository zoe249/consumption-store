<template>
	<view :class="navIdx == 1 ? 'activity-bg' : ''">
		<block v-if="navIdx == 0">
			<view class="custom-swiper">
				<swiper class="swiper" circular :autoplay="true" :interval="interval" :duration="duration">
					<swiper-item v-for="(item, index) in publicityPicList" :key="index" class="banner-home">
						<image :src="item" mode="aspectFit"></image>
					</swiper-item>
				</swiper>
				<view class="manage-box" v-if="userInfo.roleId != '0' && userInfo.roleId != undefined">
					<view class="store-manage" @click="goToStoreHomePage">店铺端</view>
				</view>
			</view>
			<view class="store-cont">
				<view class="store-info-box">
					<view class="store-info-cont">
						<view class="store-logo-box" @click="previewStoreQrcode">
							<image class="store-logo" :src="storeInfo.logo ? storeInfo.logo : defaultHead"></image>
							<image class="store-qrcode" src="../../../static/store/qrcode.png"></image>
						</view>
						<view class="customer-num">{{storeInfo.storeCustomerCount}}粉</view>
					</view>
					<view class="store-info-right">
						<view class="store-operate">
							<view class="business-time-box">
								<view class="store-name">{{storeInfo.name}}</view>
								<view class="business-time">{{storeInfo.businessLicenseDate}} 年店</view>
							</view>
							<view class="store-icon">
								<view class="share-icon" @click.stop="callPhone">
									<image :src="imgUrl + 'phoneIcon.png'" mode="heightFix"></image>
								</view>
								<view class="share-icon">
									<button open-type="share">
										<image :src="imgUrl + 'share.png'" mode="heightFix"></image>
									</button>
								</view>
							</view>
						</view>
						<view class="store-business">
							<view class="store-state" :class="storeInfo.businessState ? '' : 'store-rest'">
								<block v-if="storeInfo.businessState">营业中</block>
								<block v-if="!storeInfo.businessState">休息中</block>
							</view>
							<view class="open-time">{{storeInfo.openingTime}}-{{storeInfo.closingTime}}</view>
							<block v-if="storeInfo.dayOffName == null || storeInfo.dayOffName === ''">
								<view class="close-time">{{storeInfo.businessDayName}}营业</view>
							</block>
							<block v-else>
								<view class="close-time">{{storeInfo.dayOffName}}店休</view>
							</block>
						</view>
						<view class="store-address-box">
							<view class="store-address">
								{{storeInfo.state}}{{storeInfo.city}}{{storeInfo.district}}{{storeInfo.address}}
							</view>
							<view class="store-distance" @click="goStoreNavigate">
								<u-icon name="map-fill" color="#ccc" size="12"></u-icon>
								<view v-if="storeInfo.distance > 1000">{{storeInfo.distance * 1000}}m</view>
								<view v-else>{{storeInfo.distance}}km</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 非展示版 -->
				<block v-if="storeInfo.storeType != 1">
					<!-- 营业 -->
					<view class="function-box" v-if="storeInfo.businessState">
						<view class="func-box" @click="reserveGoods('1')" :class="isDelivery ? '' : 'no-delivery'">
							<image src="../../../static/custome/zitiIcon.png" mode="widthFix"></image>
							<!-- <view>自己取单</view> -->
						</view>
						<view class="func-box delivery-box" @click="reserveGoods('2')" v-if="isDelivery">
							<block v-if="deliveryState">
								<image src="../../../static/custome/songhuo.png" mode="widthFix"></image>
								<view class="delivery-tip">{{storeDelivaryAttr.deliveryTime}}开始配送</view>
							</block>
							<block v-else>
								<image :src="imgUrl + 'disDelivery.png'" mode="widthFix"></image>
								<view class="delivery-tip">配送截止接单</view>
							</block>
							<!-- <view>给您送达</view> -->
						</view>
					</view>
					<view v-else class="close-store">
						<image :src="imgUrl + 'dainxiu.png'" mode="widthFix"></image>
					</view>
					<block v-if="loginState">
						<view class="user-acconut" @click="goMyAccount">
							<view class="my-account">
								<view class="my-account-tip">我的账户</view>
								<view>My Account</view>
							</view>
							<view class="my-account-box">
								<view class="my-account-num">
									<view class="account-price">￥{{userAccount}}</view>
									<view>消费红包</view>
								</view>
								<view class="account-img">
									<image :src="imgUrl + 'accountPacket.png'" mode="widthFix"></image>
								</view>
							</view>
						</view>
						<view class="card-activity-box" v-if="activityInfo.id !== null" @click="goCardDetail">
							<view class="card-activity-title">
								<view class="my-card">
									<view class="top-title">集卡</view>
									<view class="func-tip mood-tip">truck</view>
								</view>
								<view class="activity-state"
									:class="activityInfo.endDay < 15 ? 'activity-count-down' : ''">
									<block v-if="activityInfo.endDay < 15">
										倒计时<text class="count-down-num">{{activityInfo.endDay}}</text>天
									</block>
									<block v-else>进行中</block>
								</view>
							</view>
							<view class="card-list">
								<view v-for="(card, index) in ruleInfo.cardList" :key="index" class="card-box">
									<image src="/static/custome/defaultCard.png" mode="" v-if="card.count == 0"></image>
									<image :src="card.cardPicture" v-else></image>
									<view v-if="index != ruleInfo.cardList.length - 1">+</view>
								</view>
								<view class="card-box">
									<view>=</view>
									<view class="card-goods-img" v-if="ruleInfo.productList != null">
										<image :src="ruleInfo.productList[0].picture"></image>
										<view class="card-goods-name">{{ruleInfo.productList[0].name}}</view>
									</view>
									<view v-else class="goods-type-price">
										<view class="award-price-box">
											<text class="award-price">{{ruleInfo.amount}}</text>元以下商品
										</view>
									</view>
								</view>
							</view>
							<view class="card-detail">查看详情</view>
						</view>
					</block>
				</block>
				<!-- 展示型 -->
				<block v-if="storeInfo.storeType == 1">
					<view class="today-menu-img" @click="goTodayMenu">
						<image :src="imgUrl + 'todayBg.png'" mode="widthFix"></image>
						<!-- <view class="iconfont">今日菜单</view> -->
					</view>
				</block>
				<view class="today-menu-img" @click="goMenu" v-if="tomorrowMenu">
					<image :src="storePublicity.tomorrowMenuHomePic" mode="widthFix"></image>
				</view>
				<view class="comment-cont">
					<view class="she-said-box" @click="goSheSaid">
						<view class="goods-title">
							<view class="top-title">TA说</view>
							<view class="func-tip mood-tip">She said</view>
						</view>
						<view class="she-said-more">
							<view>更多</view>
							<u-icon name="arrow-right" color="#999" size="10"></u-icon>
						</view>
					</view>
					<view class="comment-box">
						<yp-water-fall :value="commentTopList" imageKey="picture" @imageClick="openDetailShow"
							v-if="sonRefresh">
							<view class="item" v-for="(item,index) in commentTopList" :key="index" slot="slot{{index}}">
								<view class="comment-goods-box">
									<view class="comment-img">
										<view class="comment-goods-name">{{item.name}}</view>
									</view>
									<view class="weight-cal">
										<view v-if="item.weight !== null && item.weight != 0" class="weight-box">
											重量：{{item.weight}}g</view>
										<view v-if="item.calorie !== null && item.calorie != 0" class="weight-box">
											热量：{{item.calorie}}cal
										</view>
									</view>
									<view class="comment-func-box">
										<view class="triangle-box" v-if="item.commentShow">
											<view class="comment-func-btn">
												<view class="comment-btn zan-box" @click.stop="collectGoods(item)">
													<image :src="imgUrl + 'zan.png'" mode="widthFix"></image>
													<view>赞</view>
												</view>
												<view class="comment-btn" @click.stop="openCommentShow(item)">
													<image :src="imgUrl + 'comment.png'" mode="widthFix"></image>
													<view>评论</view>
												</view>
											</view>
											<view class="triangle"></view>
										</view>
										<view class="comment-func" @click.stop="openCommentFuncShow(item)">
											<image :src="imgUrl + 'commentIcon.png'" mode=""></image>
										</view>
									</view>
									<view class="like-box" v-if="item.collectionList.length != 0">
										<image :src="imgUrl + 'like.png'" mode="widthFix"></image>
										<view v-for="(citem, cidx) in item.collectionList" :key="cidx"
											class="like-name">
											{{citem.nickname}}<text
												v-if="cidx != (item.collectionList.length - 1)">、</text>
										</view>
									</view>
									<view class="goods-comment-box" v-if="item.customerCommentList.length != 0">
										<block v-for="(coitem, cidx) in item.customerCommentList" :key="cidx">
											<view class="goods-comment">
												<text class="comment-name">{{coitem.nickname}}：</text>
												<text>{{coitem.comment}}</text>
											</view>
										</block>
									</view>
								</view>
							</view>
						</yp-water-fall>
					</view>
					<view v-if="completed" class="no-loading">
						<image :src="imgUrl + 'noLoad.png'" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="business-license" @click="goBusinessLicense">
				<view>商家经营资质</view>
				<u-icon name="arrow-right" size="10"></u-icon>
			</view>
		</block>

		<block v-if="navIdx == 1">
			<u-sticky>
				<view :style="{ 'padding-top': statusBarHeight + 9 + 'px'}" class="dian-quan-title">悦小圈</view>
			</u-sticky>
			<view class="goods-cont">
				<view v-for="(item, index) in storeRecordList" :key="index" class="goods-box">
					<image src="../../../static/custome/circleIcon.png" class="progress-icon"></image>
					<view class="create-time">{{item.createTime}}</view>
					<view class="trend-store-info-box">
						<view class="logo-name-box">
							<view class="trend-store-logo">
								<image :src="item.storeLogo ? item.storeLogo : defaultHead"></image>
							</view>
							<view class="business-time-box">
								<view class="store-name">{{item.storeName}}</view>
							</view>
							<view class="store-distance">
								<u-icon name="map-fill" color="#ccc" size="12"></u-icon>
								<view v-if="item.deliveryAddress > 1000">{{(item.deliveryAddress / 1000).toFixed(2)}}km</view>
								<view v-else>{{(item.deliveryAddress).toFixed(2)}}m</view>
							</view>
						</view>
						<view class="go-store" @click.stop="getStoreInfo(item)">
							<image :src="imgUrl + 'storeIcon.png'" mode="widthFix"></image>
							<view>进店</view>
						</view>
					</view>
					<view class="type-name">
						<block v-if="item.type == 1">
							{{item.typeName}}来喽
						</block>
						<block v-if="item.type == 5">
							新品上新
						</block>
					</view>
					<view class="type-box">
						<view class="goods-img">
							<!-- 上新显示商品卡片图 -->
							<block v-if="item.type == 5">
								<image :src="item.cardPicture" mode="widthFix" :lazy-load="true"></image>
							</block>
							<!-- 明日菜单 -->
							<block v-if="item.type == 1">
								<image :src="item.picture" mode="widthFix" :lazy-load="true"></image>
							</block>
						</view>
						<view class="share-img">
							<button open-type="share" catchtap="share" :id="index">
								<image src="../../../static/custome/share.png"></image>
							</button>
						</view>
					</view>
					<view v-if="completed" class="no-loading">
						<image :src="imgUrl + 'noLoad.png'" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</block>

		<block v-if="navIdx == 2">
			<view class="store-box" :style="{ 'padding-top': statusBarHeight + 47 + 'px'}">
				<view class="store-img-box" @click="previewQrcode">
					<view class="custom-img">
						<image class="user-info-img" :src="userInfo.avatar ? userInfo.avatar : defaultHead"></image>
						<image class="store-qrcode" src="../../../static/store/qrcode.png">
						</image>
					</view>
					<view>{{userInfo.nickname}}</view>
				</view>
				<view @click="openPersonalShow" class="update-personal-info" v-if="personalState">完善个人资料</view>
			</view>
			<view class="red-packet-box">
				<view @click="viewStorePacket(item)" v-for="(item, index) in funcList" :key="index"
					class="mine-func-box">
					<view class="packet-img">
						<image :src="item.img" mode="widthFix"></image>
					</view>
					<view>{{item.name}}</view>
				</view>
			</view>
			<view class="mine-order-box">
				<view>订单</view>
				<view class="mine-order">
					<view @click="goOrderList('unpaid')" class="order-num">待支付（{{waitPayOrderNum}}）</view>
					<view @click="goOrderList('pending')" class="order-num">进行中（{{currentOrderNum}}）</view>
					<view @click="goOrderList('completed')" class="order-num">已完成</view>
				</view>
			</view>
			<view class="complete-order-box" v-if="completedOrderList.length != 0">
				<view>我的动态</view>
				<view v-for="(item, index) in completedOrderList" :key="index" class="history-order"
					@click="goOrderDetail(item)">
					<view class="order-store-box">
						<image :src="item.storeLogo" mode=""></image>
						<view>{{item.storeName}}</view>
					</view>
					<view class="order-time-price">
						<view>买了<text class="price">{{item.goodsNum}}</text>个面包</view>
						<view>花了<text class="price">{{item.totalAmount}}</text>元</view>
					</view>
					<scroll-view scroll-x="true" class="card-img-box">
						<block v-for="(img, idx) in item.orderItems" :key="idx">
							<image :src="img.picture" class="card-img"></image>
						</block>
					</scroll-view>
					<view class="order-time">{{item.createTime}}</view>
				</view>
				<view v-if="completed" class="no-loading">
					<image :src="imgUrl + 'noLoad.png'" mode="widthFix"></image>
				</view>
			</view>
		</block>

		<view v-if="!attentionStoreState">尚未关注任何店铺</view>

		<view style="height: 300rpx;"></view>
		<view class="tab-nav">
			<u-tabbar :value="navIdx" @change="name => navIdx = name" activeColor="#F2AB99">
				<block v-for="(item, index) in navList" :key="navIdx">
					<u-tabbar-item :text="item.name" @click="changeNav(index)">
						<image class="nav-img" slot="active-icon" :src="item.activeImg" mode="heightFix"></image>
						<image class="nav-img" slot="inactive-icon" :src="item.image" mode="heightFix"></image>
					</u-tabbar-item>
				</block>
			</u-tabbar>
		</view>

		<!-- 会员二维码 -->
		<view v-if="qrcodeShow" class="qrcode-box" @touchmove.stop.prevent="stopRoll" @click="closeQrcode">
			<view class="qrcode-img" @click.stop="previewQrcode">
				<view class="qrcode-user-info">
					<image class="user-img" :src="userInfo.avatar ? userInfo.avatar : defaultHead"></image>
					<view>
						<view>{{userInfo.nickname}}</view>
						<view class="user-phone">{{userInfo.phone}}</view>
					</view>
				</view>
				<yp-qrcode :text="qrcodeCont" :size="size" :quality="quality"></yp-qrcode>
				<view class="qrcode-tip">商家扫码可识别您的会员身份</view>
			</view>
		</view>

		<!-- 商家二维码 -->
		<view v-if="storeQrcodeShow" class="qrcode-box" @touchmove.stop.prevent="stopRoll" @click="closeStoreQrcode">
			<view class="qrcode-img" @click.stop="previewStoreQrcode">
				<view class="qrcode-user-info">
					<image class="user-img" :src="storeInfo.logo"></image>
					<view>
						<view>{{storeInfo.name}}</view>
						<view class="user-phone">{{storeInfo.phone}}</view>
					</view>
				</view>
				<image :src="storeInfo.weChatQRCode" mode="" class="store-qrcode-img"></image>
				<view class="qrcode-tip">扫码可添加店家微信</view>
			</view>
		</view>

		<!-- 兑换二维码 -->
		<view v-if="verifyQrcodeShow" class="verify-qrcode-box" @touchmove.stop.prevent="stopRoll">
			<view class="custom-qrcode">
				<view>请向商家出示二维码进行核销</view>
				<view class="custome-qrcode-img">
					<yp-qrcode :text="verifyCode" :size="250" :quality="quality"></yp-qrcode>
				</view>
				<view class="qrcode-tip">
					<image :src="imgUrl + 'rule.png'"></image>
					<view>核销后卡片将从账户中扣除</view>
				</view>
				<view class="close-qrcode" @click="closeVerifyQrcode">关闭</view>
			</view>
		</view>

		<!-- 领取红包 -->
		<u-popup :show="packetShow" @close="closeRedPacket" mode="center" bgColor="transparent">
			<view class="red-packet-img">
				<view class="packet-shadow" @click="$u.throttle(getPacket, 500)" :class="btnState ? '' : 'disabled'">
					<view class="packet-shadow-box">
						<view class="store-info-logo">
							<image :src="storeInfo.logo" mode=""></image>
						</view>
						<view>{{storeInfo.name}}</view>
						<view class="packet-tip">送您一个消费红包</view>
					</view>
					<view class="packet-remark" :class="!packetState ? 'custome-home' : ''">
						<view>{{packetTip}}</view>
						<view class="view-custome" v-if="!packetState" @click="$u.throttle(closeRedPacket, 500)">进店看看
						</view>
					</view>
				</view>
				<view class="close-packet" @click="$u.throttle(closeRedPacket, 500)" v-if="packetState">
					<image :src="imgUrl + 'close.png'" mode=""></image>
				</view>
			</view>
		</u-popup>

		<!-- 待支付订单提示 -->
		<view class="wait-popup">
			<u-popup :show="waitPayOrderState" mode="center" @close="closeWaitPayShow" round="5">
				<view class="wait-pay-box">
					<view class="wait-pay-info-box">
						<view class="wait-pay-info">
							<image :src="waitPayOrderInfo.storeLogo" mode=""></image>
							<view>{{waitPayOrderInfo.storeName}}</view>
						</view>
						<view @click="$u.throttle(closeWaitPayShow, 500)">
							<u-icon name="close"></u-icon>
						</view>
					</view>
					<view class="wait-order-tip">
						<image :src="imgUrl + 'orderTip.png'"></image>
						<view>温馨提示</view>
					</view>
					<view class="wait-order-store">您在{{waitPayOrderInfo.storeName}}店铺下有待支付订单未处理</view>
					<view @click="$u.throttle(goCustomeOrder, 500)" class="go-custome-order">现在处理</view>
				</view>
			</u-popup>
		</view>

		<!-- 个人资料 -->
		<view class="personal-cont">
			<u-popup :show="personalShow" @close="closePersonalShow" mode="center" :closeOnClickOverlay="true">
				<view class="personal-box">
					<view class="personal-title">
						<image :src="imgUrl + 'fresh.png'" mode="widthFix"></image>
						<view>邀请您完善个人信息资料</view>
					</view>
					<view class="personal-input">
						<view>头像</view>
						<button open-type="chooseAvatar" class="personal-avatar" @chooseavatar="onChooseAvatar">
							<image :src="avatarUploadUrl === '' ? defaultHead : avatarUploadUrl"></image>
							<u-icon name="arrow-right" size="10"></u-icon>
						</button>
					</view>
					<view class="personal-input">
						<view>昵称</view>
						<input type="nickname" placeholder="请输入昵称" v-model="nickname" @blur="changeNickname">
					</view>
					<view class="personal-input">
						<view>生日</view>
						<view @click="calenderShow = true" class="personal-avatar">
							<view>{{birthday == '' ? '年/月/日' : birthday}}</view>
							<u-icon name="arrow-right" size="10"></u-icon>
						</view>
					</view>
					<view class="personal-input">
						<view>性别</view>
						<view @click="openSelectGender" class="personal-avatar">
							<view>{{genderName == '' ? '请选择性别' : genderName}}</view>
							<u-icon name="arrow-right" size="10"></u-icon>
						</view>
					</view>
					<view class="save-personal" @click="$u.throttle(verifyPersonal, 500)">确定</view>
				</view>
			</u-popup>
		</view>

		<u-datetime-picker :show="calenderShow" v-model="birthdayValue" mode="date" :minDate="0" :maxDate="maxDate"
			@confirm="confirmBirthday" @close="closeCalender" @cancel="closeCalender"></u-datetime-picker>

		<u-action-sheet :actions="genderList" :show="genderShow" :closeOnClickOverlay="true" :closeOnClickAction="true"
			@select="selectGender"></u-action-sheet>

		<!-- 评论 -->
		<u-popup :show="commentShow" @close="closeCommentShow" mode="center" round="10rpx">
			<view class="definition-box">
				<view class="definition-input">
					<textarea placeholder="请输入您的评价" v-model="comment"
						placeholder-style="color: #ccc; line-height: 60rpx;"></textarea>
				</view>
				<view class="definition-btn-box">
					<view @click="closeCommentShow">取消</view>
					<view class="confirm-btn" @click="$u.throttle(commentGoods, 500)">确认</view>
				</view>
			</view>
		</u-popup>

		<u-overlay :show="collectShow" opacity="rgba(0, 0, 0, 0)">
			<view>
				<view class="collected-img">
					<image :src="imgUrl + 'like.png'" mode="widthFix" class="collected animate__zoomIn"
						:class="disappearShow ? 'animate__zoomOut' : ''"></image>
				</view>
			</view>
		</u-overlay>

		<!-- 商品详情 -->
		<u-popup :show="detailShow" @close="closeDetailShow" :round="10">
			<scroll-view class="detail-box" scroll-y="true"
				:style="'max-height:' + (screenHeight - 130 - statusBarHeight) + 'px'">
				<yp-detail ref="detail" :productsId="productsId" @closeDetailShow="closeDetailShow"></yp-detail>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	import ypQrcode from "@/components/yp-qrcode/yp-qrcode.vue"
	import date from '@/common/js/date.js'
	import ypNav from '@/components/yp-nav/yp-nav.vue'
	import ypDetail from '@/components/yp-goodDetail/yp-detail.vue'
	import ypWaterFall from "@/uni_modules/custom-waterfalls-flow/components/custom-waterfalls-flow/custom-waterfalls-flow.vue";
	export default {
		data() {
			return {
				imgUrl: this.config.imgUrl,
				statusBarHeight: 0,
				screenHeight: 0,
				defaultHead: this.config.imgUrl + 'defaultHead.png', // 默认头像
				storeId: '', // 当前店铺id
				store: {}, // 店铺信息
				userInfo: {}, // 用户信息
				storeList: [], // 门店列表信息
				isLogin: false, // 判断是否登录
				pageIndex: 1,
				pageSize: 4,
				completed: false,
				loginState: false, // 登录状态
				qrcodeShow: false,
				qrcodeCont: '', // 要生成的二维码值
				size: 180,
				quality: 'L',
				token: '',
				storeInfo: {},
				activityInfo: {},
				orderNum: 0,
				goodsList: [],
				ruleInfo: {},
				beginDate: '', // 活动开始时间
				endDate: '', // 活动结束时间
				collectCardList: [], // 集齐卡片列表
				cardList: [],
				verifyCode: '',
				verifyQrcodeShow: false,
				address: '',
				exchangeGoods: '',
				storeDelivaryAttr: {},
				orderState: true,
				cardNum: 0, // 目前已有卡片数
				navList: [{
					name: '首页',
					image: this.config.imgUrl + 'home.png',
					activeImg: this.config.imgUrl + 'homeAc.png',
				}, {
					name: '悦小圈',
					image: this.config.imgUrl + 'dianquan.png',
					activeImg: this.config.imgUrl + 'dqActive.png',
				}, {
					name: '我的',
					image: this.config.imgUrl + 'mine.png',
					activeImg: this.config.imgUrl + 'mineAc.png',
				}],
				navIdx: 0,
				bannerList: [],
				orderInfo: {},
				currentOrderNum: 0, // 当前订单数
				activityList: [],
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				storePublicity: {},
				swiperIdx: 0,
				memuDate: '',
				tomorrowMenu: true,
				currentIndex: 0,
				packetShow: false,
				packetId: '',
				packetTip: '手慢了，红包失效了',
				packetState: true, // 是否可领取红包
				userAccount: 0,
				funcList: [{
					img: this.config.imgUrl + 'redIcon.png',
					name: '红包',
					url: '/redEnvelope/list/storeList',
					value: 1
				}, {
					img: this.config.imgUrl + 'cardIcon.png',
					name: '集卡',
					url: '/activity/cardList/cardList?storeId=',
					value: 2
				}, {
					img: this.config.imgUrl + 'collectIcon.png',
					name: '收藏',
					url: '../../chooseStore/chooseStore',
					value: 3
				}, {
					img: '/static/store/set.png',
					name: '设置',
					url: '../../set/set',
					value: 4
				}],
				orderStatus: 'unpaid',
				waitPayOrderNum: 0,
				waitPayOrderState: false,
				waitPayOrderInfo: {},
				customerLongitude: '',
				customerLatitude: '',
				storeQrcodeShow: false,
				completedOrderList: [], // 已完成订单
				commentTopList: [], // TA说
				storeRecordList: [],
				btnState: true,
				deliveryState: true,
				isDelivery: true,
				personalShow: false,
				calenderShow: false,
				avatarUploadUrl: '',
				avatarUrl: '',
				nickname: '',
				birthday: '',
				birthdayValue: '',
				genderList: [{
						name: '男',
						value: 1
					},
					{
						name: '女',
						value: 2
					}
				],
				genderShow: false,
				gender: 0,
				genderName: '',
				maxDate: 0,
				personalInfo: {},
				qiniuToken: '',
				personalState: true,
				commentShow: false,
				comment: '',
				goodComment: {},
				packetAmountState: false,
				isCollectPacket: false,
				collectShow: false,
				detailShow: false,
				productsId: '',
				disappearShow: false,
				attentionStoreState: true,
				publicityPicList: [],
				sonRefresh: false,
				tomorrowMenuHomeDefault: 'https://qiaokun.yuepong.com/tomorrow-home-menu-default.jpg'
			}
		},
		components: {
			ypQrcode,
			ypNav,
			ypDetail,
			ypWaterFall
		},
		onLoad(options) {
			console.log('小程序跳转', options)
			let that = this
			// 获取状态栏高度,屏幕宽度
			uni.getSystemInfo({
				success: function(res) {
					that.statusBarHeight = res.statusBarHeight
					that.screenHeight = res.screenHeight
				}
			})

			this.token = uni.getStorageSync('token')
			this.packetId = options.packetId
			if (this.packetId != undefined) {
				// 红包分享
				this.isCollectPacket = true
			}
			this.storeId = options.storeId == undefined ? options.scene == undefined ? '' : options.scene : options.storeId
			this.navIdx = options.navIdx == undefined ? 0 : parseInt(options.navIdx)
			this.getCustomeInfo() // 获取用户信息
		},
		onShow() {
			uni.pageScrollTo({
				scrollTop: 0, //滚动到页面的目标位置
				duration: 300
			})

			this.publicityPicList = []
			var dateTime = new Date()
			this.maxDate = Date.parse(dateTime)
			this.collectCardList = []
			this.storeInfo = uni.getStorageSync('storeInfo')
			console.log('店铺id', this.storeId)
			if (this.token === '') {
				console.log('未登录11111')
				this.loginState = false
				this.packetShow = false
				// this.onLogin()
			} else {
				console.log('已登录')
				this.loginState = true
			}
			if (this.navIdx == 0) {
				this.customeHomeInfo()
			} else if (this.navIdx == 1) {
				// 悦小圈
				this.getStoreTrend()
			}
			console.log('完善个人资料状态', uni.getStorageSync('personalState'))
			this.personalState = uni.getStorageSync('personalState') === '' ? true : false
			this.refreshLoginUser() // 刷新用户信息
		},
		onPullDownRefresh() {
			this.customeHomeInfo()
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		onReachBottom() {
			if (!this.completed) {
				this.pageIndex++
				if (this.navIdx == 0) {
					// ta说
					this.getCommentList()
				} else if (this.navIdx == 1) {
					// 悦小圈
					this.getStoreTrend()
				}
			}
		},
		onShareAppMessage(res) {
			console.log('分享', res.target.id)
			let title
			let imageUrl
			let url
			if (this.navIdx == 0) {
				// 店铺分享
				title = this.storeInfo.name
				imageUrl = this.storeInfo.sign
				url = '/custom/home/index/index?storeId=' + this.storeId + '&shareState=true&custome=true'
			} else if (this.navIdx == 1) {
				let index = res.target.id
				let item = this.storeRecordList[index]
				// 悦小圈分享
				if (item.type == '1') {
					// 明日菜单
					title = `${item.storeName}-明日菜单`
					url = '/custom/dailyMenu/dailyMenu?storeId=' + item.storeId + '&shareState=true'
				} else {
					// 新品上新
					title = `${item.storeName}-新品上新`
					url = '/custom/home/index/index?storeId=' + item.storeId + '&shareState=true&custome=true'
				}
				imageUrl = item.picture
			}

			return {
				title: title,
				imageUrl: imageUrl,
				path: url
			}
		},
		watch: {
			comment() {
				if (this.comment.length > 140) {
					uni.showToast({
						title: '商品评论不可超过140个字',
						icon: 'none'
					})
					setTimeout(() => {
						this.comment = this.comment.substring(0, 140)
					}, 10)
				}
			}
		},
		methods: {
			/* 时间判断 */
			timeJudgment() {
				if (this.storeDelivaryAttr.functionState == '1') {
					let dateDay = date.parseTime(Number(new Date()), "{y}/{m}/{d}")
					let time = new Date(dateDay + ' ' + this.storeDelivaryAttr.deliveryTime) // 店铺配送时间
					let deliveryTime = time.getTime() - 900000 // 店铺配送时间前15分钟
					let currentTime = new Date().getTime() // 当前时间
					if (currentTime > deliveryTime) {
						// 当前时间大于店铺开始配送时间
						this.deliveryState = false
					}
				} else {
					// 不支持配送
					this.isDelivery = false
				}
			},
			/* 进入顾客端主页需要请求的接口 */
			customeHomeInfo() {
				let that = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						that.customerLongitude = res.longitude
						that.customerLatitude = res.latitude
						that.getStoreInfo()
					},
					fail(err) {
						console.log('定位失败', err)
					}
				})
				this.orderState = true
				this.getWaitPayOrder() // 获取门店待支付订单
				this.getActivityInfo(this.storeId) // 获取门店下进行中的活动信息
				if (this.packetAmountState) {
					this.getCustomeInfo() // 获取用户信息
				}
				this.pageIndex = 1
				this.completed = false
				this.commentTopList = []
				this.getCommentList() // 评论榜商品
				this.sonRefresh = false
				this.$nextTick(() => {
					this.sonRefresh = true
				})
				this.getStoreDeliveryAttr() // 获取店铺配送属性
				this.getStorePublicity() // 获取店铺宣传图
				var day = new Date()
				day.setTime(day.getTime() + 24 * 60 * 60 * 1000)
				var tomorrow = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
				this.memuDate = tomorrow
				this.getMenuList() // 获取明日菜单
			},
			/* 登录 */
			onLogin(res) {
				let that = this
				uni.showLoading({
					title: '登录中'
				})
				uni.login({
					success: res => {
						uni.setStorageSync('code', res.code)
						uni.removeStorageSync('token')
						that.request({
							url: that.config.getLogin +
								'?grant_type=wx_mini_program&client_id=app_client&client_secret=123&code=' +
								res.code + '&user_type=02&storeId=' + that.storeId +
								'&avatar=&nick_name=',
							method: 'POST',
							header: {
								'Content-Type': 'application/json; charset=utf-8'
							},
						}).then(res => {
							uni.hideLoading()
							console.log('登录成功')
							let data = res.data
							if (res.statusCode == 200 && data.access_token) {
								uni.setStorageSync('token', data.access_token)
								that.getLoginUser()
							}
						})
					}
				})
			},
			getLoginUser() {
				let that = this
				that.request({
					url: that.config.loginUser,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					if (res.data.code == 200000) {
						let data = res.data.data
						console.log('顾客主页用户信息', data)
						that.userInfo = data
						// 缓存用户信息
						uni.setStorageSync('userInfo', data)
						that.loginState = true
						if (that.packetId != undefined) {
							// 红包分享进入
							that.packetIsCollect() // 判断用户是否满足红包领取条件
							that.getStoreInfo()
						}
					}
				})
			},
			/* 刷新用户信息 */
			refreshLoginUser() {
				let that = this
				that.request({
					url: that.config.loginUser,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					if (res.data.code == 200000) {
						let data = res.data.data
						console.log('顾客主页用户信息', data)
						that.userInfo = data
						// 缓存用户信息
						uni.setStorageSync('userInfo', data)
					}
				})
			},
			/* 浏览店铺 */
			goToChooseStore() {
				uni.navigateTo({
					url: '../../chooseStore/chooseStore'
				})
			},
			close(value) {
				this.isLogin = value
				this.userInfo = uni.getStorageSync('userInfo')
				this.loginState = true
			},
			/* 店铺管理 */
			goToStoreHomePage() {
				uni.navigateTo({
					url: '/store/storeHomepage/storeHomepage?storeId=' + this.storeId
				})
			},
			/* 预览用户二维码 */
			previewQrcode() {
				this.qrcodeShow = true
			},
			closeQrcode() {
				this.qrcodeShow = false
			},
			/* 预览商家二维码 */
			previewStoreQrcode() {
				this.storeQrcodeShow = true
			},
			closeStoreQrcode() {
				this.storeQrcodeShow = false
			},
			/* 跳转用户活动列表 */
			goMyActivity() {
				uni.navigateTo({
					url: '/activity/cardList/cardList'
				})
			},
			closeWaitPayShow() {
				this.waitPayOrderState = false
			},
			/* 顾客端订单 */
			goCustomeOrder() {
				this.waitPayOrderState = false
				uni.navigateTo({
					url: '../../order/list'
				})
			},
			goOrderList(type) {
				uni.navigateTo({
					url: '../../order/list?orderStatus=' + type
				})
			},
			/* 获取用户待处理的订单总数 */
			getOrderNum() {
				let that = this
				that.request({
					url: that.config.userOrderList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						orderStatus: 'pending'
					}
				}).then(res => {
					console.log('用户门店下进行中的订单数', res)
					if (res.statusCode == '200') {
						const data = res.data.data.data
						that.currentOrderNum = res.data.data.total
					}
				})
			},
			/* 获取门店进行中的集卡游戏详情 */
			getActivityInfo(storeId) {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let that = this
				that.request({
					url: `${that.config.activityList}/${storeId}/detailOfOngoingActivity`
				}).then(res => {
					console.log('集卡游戏详情', res)
					uni.hideLoading()
					const data = res.data.data
					that.activityInfo = data
					that.ruleInfo = data.changeRuleList[0]
					that.beginDate = data.beginDate.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日')
					that.endDate = data.endDate.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1年$2月$3日')
					that.cardList = data.changeRuleList[0].cardList
					if (that.ruleInfo.awardType == '2') {
						that.exchangeGoods = data.changeRuleList[0].productList[0].name
					}
				})
			},
			/* 获取客户所有访问过的店铺列表 */
			getCustomeStoreList() {
				let that = this
				that.request({
					url: `${that.config.customeStoreList}/${that.userInfo.openId}`
				}).then(res => {
					console.log('门店列表', res)
					const data = res.data.data
					that.storeList = data
				})
			},
			/* 更多商品 */
			goMoreGoods() {
				uni.navigateTo({
					url: '../../goods/index/index?storeId=' + this.storeId + '&backState=true'
				})
			},
			/* 明日菜单 */
			goMenu() {
				if (this.storeInfo.storeType == 3) {
					// 预定版
					uni.navigateTo({
						url: '/custom/fresh/fresh?storeId=' + this.storeId + '&receivingWay=1&loginState=true&backState=true&tomorrowStatus=true'
					})
				} else {
					uni.navigateTo({
						url: '../../dailyMenu/dailyMenu?storeId=' + this.storeId + '&loginState=true'
					})
				}
			},
			/* 今日预定 */
			reserveGoods(type) {
				if (type == '2') {
					// 送货到家
					if (this.storeDelivaryAttr.functionState == '1') {
						// 支持配送
						let dateDay = date.parseTime(Number(new Date()), "{y}/{m}/{d}")
						let time = new Date(dateDay + ' ' + this.storeDelivaryAttr.deliveryTime) // 店铺配送时间
						let deliveryTime = time.getTime() - 900000 // 店铺配送时间前15分钟
						// let deliveryTime = time.getTime() // 店铺配送时间
						let currentTime = new Date().getTime() // 当前时间
						if (currentTime > deliveryTime) {
							this.deliveryState = false
							// 当前时间大于店铺开始配送时间
							uni.showToast({
								title: '配送人员已出发，欢迎到店选购',
								icon: 'none'
							})
						} else {
							if (this.orderState) {
								// 未超过配送范围
								uni.navigateTo({
									url: '../../fresh/fresh?storeId=' + this.storeId + '&receivingWay=' + type +
										'&loginState=' + this.loginState + '&backState=true'
								})
							} else {
								// 超过配送范围
								uni.showToast({
									title: '您当前收货地址超出商家配送范围，暂不支持配送服务',
									icon: 'none'
								})
							}
						}
					} else {
						// 不支持配送
						uni.showToast({
							title: '商家暂不支持配送服务',
							icon: 'none'
						})
					}
				} else {
					uni.navigateTo({
						url: '../../fresh/fresh?storeId=' + this.storeId + '&receivingWay=' + type +
							'&loginState=' + this.loginState + '&backState=true'
					})
				}
			},
			/* 跳转商品详情 */
			goDetail(item) {
				uni.navigateTo({
					url: '../../goods/detail/detail?id=' + item.id
				})
			},
			/* 查看游戏 */
			goCardDetail() {
				uni.navigateTo({
					url: '../../../activity/detail/detail?storeId=' + this.storeId
				})
			},
			/* 跳转集卡明细 */
			goCardDetailList() {
				uni.navigateTo({
					url: '../../../activity/cardList/detail'
				})
			},
			/* 获取用户活动列表 */
			getUserActivityList(storeId) {
				let that = this
				that.request({
					url: that.config.userActivity,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						state: 1
					},
				}).then(res => {
					let data = res.data.data
					that.activityList = data
					if (parseInt(storeId) > 0) {
						// 查看游戏详情
						data.forEach((item, i) => {
							if (item.storeId == storeId) {
								that.swiperIdx = i
							}
						})
					} else {
						that.getActivityInfo(data[0].storeId)
					}
				})
			},
			closeVerifyQrcode() {
				this.verifyQrcodeShow = false
			},
			/* 获取店铺配送属性 */
			getStoreDeliveryAttr() {
				let that = this
				that.request({
					url: `${that.config.storeDeliveries}/${that.storeId}`
				}).then(res => {
					console.log('店铺配送属性', res)
					const data = res.data.data
					if (res.data.code == '200000') {
						that.storeDelivaryAttr = data
					} else {
						that.storeDelivaryAttr.functionState == '1'
					}
					that.timeJudgment() // 当前时间与店铺配送时间判断
				})
			},
			/* 切换底部导航 */
			changeNav(index) {
				this.swiperIdx = 0
				this.navIdx = index
				this.pageIndex = 1
				this.completed = false
				if (index == 1) {
					this.storeRecordList = []
					this.getStoreTrend() // 悦小圈
				} else if (index == 2) {
					if (this.loginState) {
						// 我的
						if (this.storeInfo.storeType != 3) {
							this.getOrderNum() // 获取用户在门店下待处理的订单总数
						}
						this.getCompletedOrder()
						this.getPersonalInfo()
					} else {
						uni.reLaunch({
							url: '/pages/startUp/login/login?storeId=' + this.storeId
						})
					}
				} else if (index == 0) {
					this.customeHomeInfo()
				}
			},
			/* 获取首页宣传图 */
			getStorePublicity() {
				let that = this
				that.request({
					url: `${that.config.storePublicityMaps}/${that.storeId}`
				}).then(res => {
					console.log('获取首页宣传图', res)
					if (res.data.code == '200000') {
						const data = res.data.data
						that.storePublicity = data
						// 明日菜单默认图片
						if (!that.storePublicity.tomorrowMenuHomePic) {
							that.storePublicity.tomorrowMenuHomePic = that.tomorrowMenuHomeDefault
						}
						if (data.homePictures !== null) {
							that.publicityPicList.push(...data.homePictures)
						}
					}
				})
			},
			/* 获取待支付订单数据 */
			getWaitPayOrder() {
				let that = this
				that.request({
					url: that.config.userOrderList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						orderStatus: 'unpaid'
					}
				}).then(res => {
					console.log('订单列表', res)
					if (res.statusCode == '200') {
						const data = res.data.data.data
						that.waitPayOrderInfo = data[0]
						that.waitPayOrderNum = res.data.data.total
						if (that.waitPayOrderNum == 0) {
							that.waitPayOrderState = false
						} else {
							that.waitPayOrderState = true
						}
					}
				})
			},
			/* 拨打电话 */
			callPhone() {
				let that = this
				uni.makePhoneCall({
					phoneNumber: that.storeInfo.phone
				})
			},
			/* 切换游戏 */
			changeActivity(e) {
				this.swiperIdx = e.detail.current
				let storeId = this.activityList[this.swiperIdx].storeId
				this.getActivityInfo(storeId)
			},
			/* 获取明日菜单 */
			getMenuList() {
				let that = this
				that.request({
					url: that.config.menuGoodsList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						memuDate: that.memuDate, // 日期
						storeId: that.storeId,
						productName: '',
						productClass: ''
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data
					if (data.memuDate == null) {
						// 未设置明日菜单
						that.tomorrowMenu = false
					}
				})
			},
			/* 关闭领取红包 */
			closeRedPacket() {
				console.log('111111111111')
				this.packetShow = false
			},
			/* 判断用户是否满足红包领取条件 */
			packetIsCollect() {
				let that = this
				that.request({
					url: `${that.config.redPacketInfo}/${that.userInfo.id}:receive/${that.packetId}/conditionStatus`
				}).then(res => {
					console.log('判断用户是否满足红包领取条件', res)
					that.isCollectPacket = false
					if (res.data.code != '200000') {
						if (res.data.message == '身份验证失败') {
							console.log('验证失败重新登录')
							that.packetShow = false
							// token过期
							that.onLogin() // 重新登录
						} else {
							// 不满足条件
							that.packetShow = true
							that.packetTip = res.data.detail
							that.packetState = false
						}
					} else {
						console.log('token未过期')
						if (res.data.data === null) {
							// 未领取同时满足条件
							that.getRedPacketInfo()
						} else {
							// 领取过红包
							that.packetShow = false
							uni.navigateTo({
								url: '/redEnvelope/receive/receive?packetId=' + that.packetId
							})
						}
					}
				})
			},
			/* 获取红包详情 */
			getRedPacketInfo() {
				let that = this
				that.request({
					url: `${that.config.redPacketInfo}/${that.packetId}`
				}).then(res => {
					console.log('红包详情', res)
					that.packetTip = res.data.data.description
					that.packetShow = true
				})
			},
			/* 领取红包 */
			getPacket() {
				if (this.packetState) {
					let that = this
					uni.showLoading({
						title: '加载中',
						icon: 'none',
						mask: true
					})
					that.request({
						url: `${that.config.redPacketInfo}/${that.userInfo.id}:receive/${that.packetId}`,
						method: 'POST',
						header: {
							'Content-Type': 'application/json',
							'Transaction-No': new Date().getTime()
						},
						data: {
							openId: that.userInfo.openId
						}
					}).then(res => {
						uni.hideLoading()
						console.log('领取红包', res)
						that.packetAmountState = true
						that.btnState = false
						if (res.data.code == '200000') {
							that.packetShow = false
							uni.navigateTo({
								url: '/redEnvelope/receive/receive?packetId=' + that.packetId
							})
						} else {
							uni.showToast({
								title: res.data.detail,
								icon: 'none'
							})
						}
					})
				}
			},
			/* 获取用户店铺下的红包账户 */
			getPacketUserInfo() {
				let that = this
				that.request({
					url: `${that.config.bountyAccounts}?storeId=${that.storeId}&openId=${that.userInfo.openId}`
				}).then(res => {
					console.log('获取用户店铺下的红包账户', res)
					const data = res.data.data
					that.userAccount = (parseFloat(data.presentBalance)).toFixed(2)
				})
			},
			/* 跳转我的红包账户 */
			goMyAccount() {
				uni.navigateTo({
					url: '/redEnvelope/list/packet'
				})
			},
			/* 查看店铺功能模块 */
			viewStorePacket(item) {
				let url = item.url
				uni.navigateTo({
					url: url
				})
			},
			/* 获取门店信息 */
			getStoreInfo(item) {
				console.log('11111111111111', item)
				let that = this
				if (item != undefined) {
					that.storeId = item.storeId
				}
				console.log('storeId', that.storeId)
				that.request({
					url: `${that.config.stores}/${that.storeId}?customerLongitude=${that.customerLongitude}&customerLatitude=${that.customerLatitude}`
				}).then(res => {
					console.log('门店信息', res)
					if (res.data.code == '200000') {
						let data = res.data.data
						that.storeInfo = data
						console.log('店铺形象', data)
						that.publicityPicList.unshift(data.sign)
						uni.setStorageSync('storeInfo', data)
						if (item != undefined) {
							that.navIdx = 0
							that.customeHomeInfo()
						}
					} else {
						// 未获取到门店信息，获取关注的门店列表
						getAtteStoreList()
					}
				})
			},
			/* 获取关注门店列表 */
			getAtteStoreList() {
				let that = this
				that.request({
					url: `${that.config.customeStoreList}/${that.userInfo.openId}?businessState=${that.businessState}&customerLongitude=${that.longitude}&customerLatitude=${that.latitude}`
				}).then((res) => {
					console.log(res)
					const data = res.data.data
					if (data.length == 0) {
						// 无关注门店列表
						that.attentionStoreState = false
					} else {
						that.storeInfo = data[0]
						uni.setStorageSync('storeInfo', data)
					}
				})
			},
			/* 跳转店铺导航 */
			goStoreNavigate() {
				uni.navigateTo({
					url: '../../navigation/navigation'
				})
			},
			/* 获取已完成订单 */
			getCompletedOrder() {
				let that = this
				that.request({
					url: that.config.userOrderList,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						orderStatus: 'completed'
					}
				}).then(res => {
					console.log('已完成订单列表', res)
					if (res.data.code == '200000') {
						const data = res.data.data.data
						let time
						let todayDate = new Date().setHours(0, 0, 0, 0) //把今天的日期时分秒设置为00：00：00，返回一个时间戳,
						data.forEach(item => {
							item.goodsNum = 0
							// 判断是否是今天
							time = item.createTime.substring(0, 10)
							let paramsDate = new Date(time).setHours(0, 0, 0,
								0) //给new Date()传入时间，并返回传入时间的时间戳
							let isToday = (todayDate === paramsDate)

							// 是否是昨天
							let testerdayTime = new Date(time).getTime()
							let isYesterday = that.isYesterday(testerdayTime)

							if (isToday) {
								// 日期为今天
								item.createTime = '今天'
							} else if (isYesterday) {
								// 日期为昨天
								item.createTime = '昨天'
							} else {
								item.createTime = item.createTime.substring(5, 10)
							}
							item.orderItems.forEach(goods => {
								item.goodsNum += goods.quantity
							})
						})
						that.completedOrderList = data
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			isYesterday(time) {
				//昨天
				const date = new Date()
				const year = date.getFullYear()
				const month = date.getMonth() + 1
				const day = date.getDate()
				const today = `${year}/${month}/${day}`
				const todayTime = new Date(today).getTime() // 当天凌晨的时间
				const yesterdayTime = new Date(todayTime - 24 * 60 * 60 * 1000).getTime() // 昨天凌晨的时间
				return time < todayTime && yesterdayTime <= time
			},
			/* 获取评论榜商品 */
			getCommentList() {
				let that = this
				that.request({
					url: that.config.commentTop,
					data: {
						pageIndex: that.pageIndex,
						pageSize: 2,
						storeId: that.storeId
					}
				}).then(res => {
					console.log('ta说', res)
					const data = res.data.data.data
					if (data.length != 0) {
						data.forEach(item => {
							item.commentShow = false
						})
						that.commentTopList.push(...data)
					} else {
						that.completed = true
					}
				})
			},
			/* ta说 */
			goSheSaid() {
				uni.navigateTo({
					url: '/custom/comment/comment?storeId=' + this.storeId
				})
			},
			/* 店铺动态 */
			getStoreTrend() {
				let that = this
				that.request({
					url: that.config.storeGoodsRecord,
					data: {
						pageIndex: that.pageIndex,
						pageSize: that.pageSize,
						addressLongitude: that.customerLongitude,
						addressLatitude: that.customerLatitude
					}
				}).then(res => {
					console.log(res)
					const data = res.data.data.data
					if (data.length == 0) {
						that.completed = true
					} else {
						let time
						let todayDate = new Date().setHours(0, 0, 0, 0) //把今天的日期时分秒设置为00：00：00，返回一个时间戳,
						data.forEach(item => {
							// 判断是否是今天
							time = item.createTime.substring(0, 10)
							let paramsDate = new Date(time).setHours(0, 0, 0,
								0) //给new Date()传入时间，并返回传入时间的时间戳
							let isToday = (todayDate === paramsDate)

							// 是否是昨天
							let testerdayTime = new Date(time).getTime()
							let isYesterday = that.isYesterday(testerdayTime)

							if (isToday) {
								// 日期为今天
								item.createTime = '今天  ' + item.createTime.substring(11, 16)
							} else if (isYesterday) {
								// 日期为昨天
								item.createTime = '昨天  ' + item.createTime.substring(11, 16)
							} else {
								item.createTime = item.createTime.substring(5, 16)
							}
						})
						that.storeRecordList.push(...data)
					}
				})
			},
			/* 获取店铺用户信息 */
			getCustomeInfo() {
				let that = this
				that.request({
					url: that.config.loginUser,
					data: {
						storeId: that.storeId
					}
				}).then(res => {
					console.log('顾客端主页用户信息', res);
					if (res.data.code == 200000) {
						let data = res.data.data
						that.userInfo = data
						uni.setStorageSync('userInfo', data)
						let userInfo = {
							openId: that.userInfo.openId
						}
						that.qrcodeCont = JSON.stringify(userInfo)
						that.getCustomeStoreList() // 获取客户所有访问过的店铺列表
						that.getPacketUserInfo() // 获取用户店铺下的红包账户
						if (that.packetId != undefined && that.isCollectPacket) {
							// 红包分享进入
							that.packetIsCollect() // 判断用户是否满足红包领取条件
						}
					}
				})
			},
			/* 今日菜单 */
			goTodayMenu() {
				uni.navigateTo({
					url: '../../fresh/fresh?storeId=' + this.storeId +
						'&loginState=' + this.loginState + '&backState=true&todayMenu=true'
				})
			},
			openPersonalShow() {
				this.personalShow = true
				this.getQiniuToken()
			},
			closePersonalShow() {
				this.personalShow = false
				this.genderShow = false
				this.calenderShow = false
			},
			onChooseAvatar(e) {
				console.log('选择微信头像', e)
				this.avatarUploadUrl = e.detail.avatarUrl
			},
			closeCalender() {
				this.calenderShow = false
			},
			/* 选择生日 */
			confirmBirthday(e) {
				console.log('选择生日', e)
				this.birthdayValue = e.value
				this.birthday = date.parseTime(e.value, "{y}-{m}-{d}")
				this.calenderShow = false
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
			verifyPersonal() {
				if (this.avatarUploadUrl === '') {
					uni.showToast({
						title: '请上传头像',
						icon: 'none'
					})
				} else if (this.nickname === '') {
					uni.showToast({
						title: '请填写昵称',
						icon: 'none'
					})
				} else if (this.birthday === '') {
					uni.showToast({
						title: '请选择生日',
						icon: 'none'
					})
				} else if (this.genderName === '') {
					uni.showToast({
						title: '请选择性别',
						icon: 'none'
					})
				} else {
					this.personalState = false
					uni.setStorageSync('personalState', false)
					this.uploadFilePromise()
				}
			},
			/* 上传图片 */
			uploadFilePromise() {
				let that = this
				uni.showToast({
					title: '保存中',
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
						url: that.config.uploadUrl, //此处为华东地区，其他地区请查阅文档
						filePath: that.avatarUploadUrl,
						header: {
							"Content-Type": "multipart/form-data"
						},
						name: 'file',
						formData: {
							key: key,
							token: that.qiniuToken, //后端返回的token
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							that.avatarUrl = 'https://qiaokun.yuepong.com/' + data.key
							that.savePersonInfo()
						},
						fail(err) {
							console.log('上传失败', err)
						}
					})
				})
			},
			/* 保存个人资料 */
			savePersonInfo() {
				let that = this
				uni.showLoading({
					title: '保存中',
					mask: true
				})
				that.request({
					url: `${that.config.customers}/${that.userInfo.id}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json; charset=utf-8',
						'Transaction-No': new Date().getTime()
					},
					data: {
						gender: that.gender,
						birthday: that.birthday,
						avatar: that.avatarUrl,
						nickname: that.nickname
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 200000) {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
						that.personalShow = false
						that.calenderShow = false
						that.getLoginUser()
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			openSelectGender() {
				this.genderShow = true
			},
			selectGender(e) {
				console.log('选择性别', e)
				this.gender = e.value
				this.genderName = e.name
				this.genderShow = false
			},
			/* 获取个人资料 */
			getPersonalInfo() {
				let that = this
				that.request({
					url: `${that.config.customers}/${that.userInfo.openId}`
				}).then(res => {
					if (res.data.code == 200000) {
						const data = res.data.data
						uni.getImageInfo({
							src: data.avatar,
							success: (image) => {
								console.log(image)
								that.avatarUploadUrl = image.path
							},
							fail: (err) => {
								uni.hideLoading()
							}
						})
						that.nickname = data.nickname
						that.birthday = (data.birthday).slice(0, 10)
						if (data.gender == '1') {
							that.genderName = '男'
						} else if (data.gender == '2') {
							that.genderName = '女'
						}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			changeNickname(e) {
				setTimeout(() => {
					this.nickname = e.detail.value
					console.log('选择昵称', e)
				}, 10)
			},
			/* 订单详情 */
			goOrderDetail(item) {
				uni.navigateTo({
					url: '../../order/detail?id=' + item.id
				})
			},
			openCommentFuncShow(item) {
				item.commentShow = !item.commentShow
			},
			/* 点赞收藏/取消点赞 */
			collectGoods(item) {
				let that = this
				let title
				that.disappearShow = false
				// 顾客端才能点赞收藏
				that.request({
					url: `${that.config.collectGood}/${item.id}/collection`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == '200000') {
						if (item.collection) {
							title = '已取消'
							item.collectionCount--
							item.collectionList.forEach((collect, i) => {
								if (that.userInfo.nickname == collect.nickname) {
									item.collectionList.splice(i, 1)
								}
							})
							uni.showToast({
								title: title,
								icon: 'none'
							})
						} else {
							that.collectShow = true
							item.collectionCount++
							item.collectionList.push({
								nickname: that.userInfo.nickname,
							})
							setTimeout(() => {
								that.collectShow = false
								that.disappearShow = true
							}, 2000)
						}
						item.collection = !item.collection
						item.commentShow = false
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			openCommentShow(item) {
				this.goodComment = item
				this.commentShow = true
			},
			closeCommentShow() {
				this.goodComment = {}
				this.commentShow = false
			},
			/* 评论商品 */
			commentGoods() {
				let that = this
				uni.showLoading({
					title: '请稍候',
					mask: true
				})
				that.request({
					url: that.config.commentGoods,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Transaction-No': new Date().getTime()
					},
					data: {
						comment: that.comment,
						productId: that.goodComment.id
					}
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					if (res.data.code == '200000') {
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						})
						that.goodComment.commentShow = false
						that.commentShow = false
						that.goodComment.customerCommentList.push({
							nickname: that.userInfo.nickname,
							comment: that.comment
						})
						that.comment = ''
						that.goodComment = {}
					} else {
						uni.showToast({
							title: res.data.detail,
							icon: 'none'
						})
					}
				})
			},
			/* 打开商品详情 */
			openDetailShow(item) {
				this.productsId = item.id
				setTimeout(() => {
					this.$refs.detail.getProductsByID()
					this.detailShow = true
				}, 10)
			},
			/* 关闭商品详情 */
			closeDetailShow() {
				this.detailShow = false
			},
			/* 商家营业资质 */
			goBusinessLicense() {
				uni.navigateTo({
					url: '/custom/business/license'
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}
</style>

<style scoped>
	.activity-bg {
		background-color: #fff;
	}

	.custom-swiper {
		position: relative;
	}

	.manage-box {
		position: absolute;
		right: 24rpx;
		bottom: 100rpx;
		z-index: 9999;
	}

	.store-manage {
		background-color: rgba(0, 0, 0, .5);
		color: #fff;
		font-size: 28rpx;
		border-radius: 50rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 160rpx;
		text-align: center;
	}

	.store-box {
		background-image: url(https://qiaokun.yuepong.com/hongbei%2FhomeBg.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: #333;
		margin-bottom: 40rpx;
	}

	.store-img-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #333;
		font-size: 28rpx;
	}

	.custom-img {
		position: relative;
		margin-bottom: 20rpx;
	}

	.user-info-img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.custom-img .store-qrcode {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 32rpx;
		height: 32rpx;
		border-radius: 10rpx;
	}

	.card-num-box {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.card-num {
		font-size: 28rpx;
		position: relative;
		text-align: center;
	}

	.card-num image {
		width: 36rpx;
		height: 40rpx;
	}

	.card-num>>>.u-badge--not-dot {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.store-cont {
		margin-top: -100rpx;
		position: relative;
		z-index: 99;
	}

	.current-store-info {
		background-color: #fff;
		margin: 0 24rpx;
		border-radius: 10rpx;
		padding: 20rpx 20rpx 24rpx;
		display: flex;
		justify-content: space-between;
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, .1);
	}

	.store-business {
		display: flex;
		align-items: center;
		padding-bottom: 12rpx;
		font-size: 24rpx;
		color: #999;
	}

	.store-state {
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		color: #fff;
		border-radius: 50rpx;
		text-align: center;
		background-color: #7CD1F8;
		font-size: 20rpx;
		margin-right: 20rpx;
	}

	.store-state.store-rest {
		background-color: #F2AB99;
	}

	.open-time {
		margin-right: 20rpx;
	}

	.reserve-box {
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.function-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 20rpx 24rpx;
	}

	.func-box {
		width: 344rpx;
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
		font-weight: 600;
		height: 240rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10rpx;
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, .1);
	}

	.no-delivery {
		width: 100%;
	}

	.func-box image {
		width: 102rpx;
		height: auto;
		padding: 26rpx 0 0;
	}

	.delivery-box image {
		width: 124rpx;
		height: auto;
	}

	.delivery-tip {
		color: #999;
		font-size: 24rpx;
		font-weight: normal;
		margin-top: 10rpx;
	}

	.func-box-tip {
		font-size: 20rpx;
		text-transform: uppercase;
		color: #F2AB99;
		margin-top: 10rpx;
	}

	.func-tip {
		font-size: 20rpx;
		text-transform: uppercase;
	}

	.mood-tip {
		color: #ccc;
	}

	.menu-box {
		background-color: #F2FAFE;
		color: #7CD1F8;
		margin-top: 14rpx;
		height: 120rpx;
	}

	.goods-name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.goods-top image {
		width: 70rpx;
		height: 46rpx;
		position: absolute;
		top: -30rpx;
		left: 50%;
		margin-left: -35rpx;
	}

	.mood-box {
		margin: 20rpx 24rpx;
		background-color: #fff;
		padding: 30rpx 20rpx;
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, .1);
		border-radius: 10rpx;
	}

	.goods-top-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.more-goods {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}

	.more-goods image {
		width: 8rpx;
		height: auto;
		margin-left: 8rpx;
	}

	.draw-card-cont {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 14rpx 0;
		border-radius: 10rpx;
	}

	.draw-card-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 20rpx;
		border: 1rpx solid #eee;
		width: 280rpx;
		border-radius: 10rpx;
	}

	.draw-card-box image {
		width: 60rpx;
		height: 60rpx;
		margin-right: 20rpx;
	}

	.card-btn {
		width: 88rpx;
		height: 44rpx;
		line-height: 44rpx;
		border-radius: 50rpx;
		text-align: center;
		color: #fff;
		background-color: #333;
		font-size: 24rpx;
		margin-left: 24rpx;
	}

	.card-info {
		color: #333;
		font-size: 28rpx;
	}

	.card-count {
		margin-top: 10rpx;
	}

	.card-count text {
		color: #7CD1F8;
		margin-right: 6rpx;
	}

	.card-count text.exchange {
		color: #FFC263;
	}

	.card-detail {
		color: #999;
		text-decoration: underline;
		text-align: right;
		font-size: 28rpx;
		padding: 0 26rpx 10rpx 0;
	}

	.rule-box {
		display: flex;
		font-size: 24rpx;
		color: #999;
		line-height: 36rpx;
		border-top: 1rpx solid #eee;
		margin: 0 20rpx;
		padding: 20rpx 0;
	}

	.rule-box image {
		width: 24rpx;
		height: auto;
		margin: 8rpx 10rpx 0 0;
		min-width: 24rpx;
	}


	.login-store-info {
		margin: 0 24rpx;
		padding: 20rpx;
		display: flex;
		align-items: center;
		border: 2rpx dashed #fff;
		border-radius: 10rpx;
	}

	.login-tip {
		font-size: 36rpx;
	}

	.qrcode-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, .5);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.qrcode-img {
		background-color: #fff;
		padding: 40rpx;
		border-radius: 10rpx;
		width: 500rpx;
	}

	.qrcode-user-info {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.user-img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.user-phone {
		color: #999;
		padding-top: 12rpx;
	}

	.qrcode-tip {
		color: #999;
		font-size: 28rpx;
		text-align: center;
		padding-top: 40rpx;
	}

	.custom-qrcode>>>.canvas-qrcode {
		float: unset !important;
	}

	.card-list {
		display: flex;
		align-items: center;
		padding: 20rpx;
	}

	.top-goods-box {
		position: relative;
	}

	.top-goods-box image {
		width: 204rpx;
		height: 374rpx;
		border-radius: 10rpx;
	}

	.card-box {
		display: flex;
		align-items: center;
	}

	.card-box image {
		width: 70rpx;
		height: 94rpx;
		border-radius: 10rpx;
		border: 1rpx solid #eee;
	}

	.card-goods-img {
		position: relative;
	}

	.card-goods-img image {
		width: 94rpx;
		height: 94rpx;
	}

	.card-goods-name {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, .5);
		color: #fff;
		font-size: 20rpx;
		text-align: center;
		height: 40rpx;
		line-height: 40rpx;
	}

	.goods-type-price {
		background-color: #E3D09E;
		color: #fff;
		width: 94rpx;
		height: 94rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.award-price-box {
		width: 80rpx;
		height: 80rpx;
	}

	.award-price {
		font-size: 28rpx;
	}

	.today-menu-img {
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, .1);
	}

	.today-menu-img image {
		width: 100%;
		height: auto;
	}

	.menu-img {
		margin: 0 24rpx;
	}

	.menu-img image {
		width: 700rpx;
		height: auto;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	.card-activity-box {
		background-color: #fff;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, .1);
	}

	.card-activity-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333;
		font-size: 32rpx;
	}

	.my-card {
		display: flex;
		align-items: center;
		padding: 0 0 0 20rpx;
	}

	.activity-state {
		width: 268rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: linear-gradient(to left, #C7E9F8, #fff);
		color: #48AEDC;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 20rpx 0 0;
	}

	.activity-state.activity-count-down {
		background: linear-gradient(to left, #FAE0D9, #fff);
		color: #F2AB99;
	}

	.count-down-num {
		width: 44rpx;
		height: 44rpx;
		line-height: 44rpx;
		border-radius: 10rpx;
		background-color: #F2AB99;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
		margin: 0 14rpx;
		display: inline-block;
	}

	.nav-activity-detail {
		background-color: #fff;
		position: fixed;
		bottom: 160rpx;
		left: 0;
		right: 0;
	}

	.activity-detail {
		padding: 24rpx 22rpx;
		color: #333;
		font-size: 28rpx;
		border: 2rpx dotted #F2AB99;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		margin: 40rpx 24rpx 20rpx 48rpx;
	}

	.collect-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		color: #999;
		font-size: 28rpx;
	}

	.collect-plan {
		color: #999;
	}

	.collect-tip {
		position: absolute;
		top: -22rpx;
		left: -24rpx;
		background-color: #F2AB99;
		color: #fff;
		width: 132rpx;
		height: 46rpx;
		line-height: 46rpx;
		border-radius: 10rpx;
		text-align: center;
	}

	.collect-img {
		position: relative;
	}

	.collect-tag {
		position: absolute;
		top: 0;
		left: 50%;
		margin-left: -16rpx;
		color: #fff;
		font-size: 28rpx;
	}

	.collect-all {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		color: #999;
		font-size: 28rpx;
		width: 70%;
	}

	.collect-all image {
		width: 68rpx;
		height: auto;
		margin: 0 14rpx 0 0;
	}

	.exchange-btn {
		width: 120rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		font-size: 28rpx;
		color: #FFC263;
		border: 1rpx solid #FFC263;
		border-radius: 50rpx;
	}

	.exchange-btn.no-collect {
		color: #ccc;
		border: 1rpx solid #ccc;
	}

	.verify-qrcode-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 9999;
	}

	.custom-qrcode {
		text-align: center;
		font-size: 32rpx;
		color: #333;
		font-weight: 600;
		margin: 150rpx 0 0;
	}

	.custome-qrcode-img {
		margin: 60rpx auto 40rpx;
		width: 600rpx;
		height: 600rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1rpx solid #ccc;
	}

	.custom-qrcode>>>.canvas-qrcode {
		float: unset !important;
	}

	.qrcode-tip {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
		font-size: 28rpx;
	}

	.qrcode-tip image {
		width: 24rpx;
		height: 24rpx;
		padding-right: 14rpx;
	}

	.close-qrcode {
		position: fixed;
		left: 24rpx;
		right: 24rpx;
		bottom: 40rpx;
		border-radius: 50rpx;
		border: 1rpx solid #FDB193;
		color: #FDB193;
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.address-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		margin: 0 24rpx 14rpx;
		padding: 20rpx;
		border-radius: 10rpx;
	}

	.address-left {
		display: flex;
		align-items: center;
	}

	.address-left image {
		width: 40rpx;
		height: 40rpx;
	}

	.address-right image {
		width: 26rpx;
		height: 26rpx;
	}

	.address {
		font-size: 28rpx;
		color: #000;
		padding-left: 14rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		width: 550rpx;
	}

	.tab-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 999;
		border-top: 2rpx solid rgba(0, 0, 0, .1);
	}

	.tab-nav>>>.u-tabbar__content__item-wrapper {
		height: 160rpx;
	}

	.nav-img {
		width: auto;
		height: 44rpx;
	}

	.address-manager {
		background-color: #fff;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		border-radius: 10rpx;
		padding: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.address-icon {
		display: flex;
		align-items: center;
		color: #000;
		font-size: 28rpx;
	}

	.address-icon image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 14rpx;
	}

	.activity-box {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		margin: 0 10rpx;
		padding: 0 0 0 20rpx;
		color: #333;
		font-size: 28rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.card-top {
		background-color: #fff;
	}

	.store-info {
		display: flex;
		align-items: center;
		padding: 46rpx 0;
	}

	.store-img {
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
	}

	.store-img image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.staff-name-box {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}

	.activity-store {
		color: #333;
		font-size: 28rpx;
		padding-bottom: 12rpx;
	}

	.activity-card {
		color: #999;
		border: 2rpx solid #999;
		border-radius: 50rpx;
		width: 154rpx;
		height: 32rpx;
		line-height: 32rpx;
		font-size: 20rpx;
		text-align: center;
	}

	.count-down-time {
		background: linear-gradient(to left, #FADDD6, #fff);
		width: 268rpx;
		color: #F2AB99;
		font-size: 28rpx;
		padding-right: 20rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.count-down-day {
		font-size: 40rpx;
	}

	.order-box {
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
	}

	.order-tip-box {
		width: 140rpx;
	}

	.order-tip {
		width: 26rpx;
		margin: 0 auto;
		font-size: 28rpx;
		color: #333;
	}

	.right-order {
		border-left: 1rpx solid #eee;
		width: 560rpx;
		color: #999;
		font-size: 28rpx;
	}

	.order-store-box {
		display: flex;
		align-items: center;
		padding: 30rpx 0 16rpx;
		font-size: 28rpx;
		color: #999;
	}

	.order-store-box image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}

	.order-store {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 28rpx;
	}

	.order-store image {
		width: 28rpx;
		height: 28rpx;
		margin-left: 14rpx;
	}

	.order-state {
		color: #F2AB99;
		font-size: 28rpx;
	}

	.order-goods-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 22rpx 0;
	}

	.omit-box {
		margin: 0 auto;
		display: block;
	}

	.omit-box image {
		width: 36rpx;
		height: auto;
	}

	.order-total-price {
		text-align: right;
		padding: 30rpx 22rpx;
	}

	.order-delivery-time {
		text-align: right;
		padding: 30rpx 0;
		color: #333;
		border-top: 1rpx solid #eee;
		margin: 0 22rpx;
	}

	.nav-card-activity-box {
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.nav-card-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 24rpx;
	}

	.nav-card-box {
		text-align: center;
		font-size: 28rpx;
		color: #333;
		width: 224rpx;
		margin: 0 14rpx 30rpx 0;
	}

	.nav-card-box:nth-child(3n) {
		margin-right: 0;
	}

	.nav-card-box image {
		width: 164rpx;
		height: 220rpx;
		border-radius: 10rpx;
		margin-bottom: 8rpx;
		border: 1rpx solid #eee;
		border-radius: 10rpx;
	}

	.banner-home,
	.swiper {
		width: 100% !important;
		height: 750rpx !important;
	}

	.banner-home image {
		width: 750rpx;
		height: 750rpx !important;
	}

	.swiper-box {
		padding: 40rpx 0 30rpx;
		background-image: url(https://qiaokun.yuepong.com/hongbei/activityBg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.card-swiper {
		height: 200rpx !important;
	}

	.swiper-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0 60rpx;
	}

	.view-card-detail {
		color: #666;
		font-size: 28rpx;
		text-decoration: underline;
	}

	.view-card-detail image {
		width: 24rpx;
		height: auto;
		margin-right: 6rpx;
	}

	.swiper-circle-box {
		display: flex;
		align-items: center;
	}

	.swiper-circle {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background-color: #000;
		margin-left: 4rpx;
	}

	.swiper-circle.active-swiper {
		width: 20rpx;
	}

	.banner-img image {
		width: 100%;
		height: auto;
	}

	.no-activity {
		margin: 280rpx auto 0;
		text-align: center;
		font-size: 40rpx;
		color: #333;
	}

	.no-activity image {
		width: 108rpx;
		height: auto;
		margin-bottom: 52rpx;
	}

	.no-order {
		margin: 18rpx 24rpx;
	}

	.no-order image {
		width: 100%;
		height: auto;
	}

	/* 领取红包 */
	.packet-shadow {
		background-image: url(https://qiaokun.yuepong.com/hongbei%2F/shareRed.png);
		background-repeat: no-repeat;
		background-size: 100%;
		width: 720rpx;
		height: 900rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		font-size: 40rpx;
		color: #FEE286;
		font-weight: 600;
	}

	.packet-shadow-box {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.store-info-logo {
		margin: 160rpx 0 16rpx;
	}

	.store-info-logo image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: block;
	}

	.packet-tip {
		padding-top: 20rpx;
		font-size: 28rpx;
	}

	.packet-remark {
		font-size: 40rpx;
		margin-bottom: 150rpx;
		width: 440rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.packet-remark.custome-home {
		margin-bottom: 80rpx;
	}

	.view-custome {
		width: 328rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background-color: #F0C92F;
		color: #C42104;
		font-size: 40rpx;
		border-radius: 50rpx;
		margin-top: 20rpx;
	}

	.close-packet {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-packet image {
		width: 60rpx;
		height: 60rpx;
		display: block;
	}

	.close-store {
		margin: 14rpx 20rpx;
	}

	.close-store image {
		width: 100%;
		height: auto;
	}

	.user-acconut {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 20rpx 24rpx;
		border-radius: 10rpx;
		padding: 20rpx 40rpx 20rpx 20rpx;
		background-color: #fff;
		box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, .1);
	}

	.my-account-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.my-account {
		font-size: 28rpx;
		color: #999;
	}

	.my-account-tip {
		color: #333;
		font-weight: 600;
		padding-bottom: 12rpx;
	}

	.my-account-num {
		font-size: 28rpx;
		color: #999;
		border-right: 1rpx solid #999;
		padding-right: 20rpx;
		text-align: right;
	}

	.account-price {
		font-size: 40rpx;
		color: #F2AB99;
		padding-bottom: 12rpx;
	}

	.account-img image {
		width: 62rpx;
		height: auto;
		display: block;
		margin-left: 40rpx;
	}

	.red-packet-box {
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		padding: 40rpx 0;
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
		display: flex;
		align-items: center;
	}

	.mine-func-box {
		width: 25%;
		text-align: center;
	}

	.packet-img {
		position: relative;
	}

	.packet-img image {
		width: 56rpx;
		height: auto;
		display: block;
		padding-bottom: 12rpx;
		margin: 0 auto;
	}

	.store-info-box {
		background-color: #fff;
		margin: 24rpx;
		color: #333;
		font-size: 24rpx;
		padding: 30rpx 20rpx;
		display: flex;
	}

	.store-info-cont {
		padding: 0 28rpx 0 14rpx;
	}

	.store-logo-box {
		position: relative;
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 12rpx;
	}

	.store-logo {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.store-logo-box .store-qrcode {
		position: absolute;
		top: 54rpx;
		right: -6rpx;
		width: 32rpx;
		height: 32rpx;
		border-radius: 10rpx;
	}

	.store-info-right {
		width: 85%;
	}

	.store-operate {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding-bottom: 18rpx;
	}

	.business-time-box {
		display: flex;
		align-items: center;
	}

	.store-name {
		font-size: 32rpx;
		margin-right: 20rpx;
		font-weight: 600;
	}

	.business-time {
		color: #F2AB99;
		font-size: 20rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 50rpx;
		width: 80rpx;
		border: 2rpx solid #F2AB99;
		text-align: center;
	}

	.customer-num {
		font-size: 28rpx;
		color: #F2AB99;
		text-align: center
	}

	.store-icon {
		display: flex;
		align-items: center;
	}

	.share-icon {
		padding: 0 20rpx;
		border-right: 1rpx solid #ccc;
	}

	.share-icon:last-child {
		padding-right: 0;
		border-right: 0;
	}

	.share-icon image {
		width: auto;
		height: 40rpx;
	}

	.share-icon button {
		background-color: transparent;
		padding: 0;
		height: unset;
		line-height: unset;
	}

	.share-icon button::after {
		border: none;
	}

	.store-address-box {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 28rpx;
		line-height: 44rpx;
	}

	.store-distance {
		display: flex;
		align-items: center;
		color: #999;
	}

	.store-time {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.wait-pay-box {
		padding: 20rpx;
	}

	.wait-pay-info-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.wait-pay-info {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
	}

	.wait-pay-info image {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-right: 8rpx;
	}

	.wait-popup>>>.u-popup__content {
		max-width: 540rpx;
	}

	.wait-order-tip {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #11AA66;
		margin: 28rpx 0;
	}

	.wait-order-tip image {
		width: 56rpx;
		height: 56rpx;
		margin-right: 6rpx;
	}

	.wait-order-store {
		padding: 0 10rpx;
		color: #999;
		font-size: 28rpx;
		line-height: 44rpx;
	}

	.go-custome-order {
		margin: 30rpx 10rpx;
		border: 2rpx solid #F2AB99;
		color: #F2AB99;
		text-align: center;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	.store-qrcode-img {
		width: 360rpx;
		height: 360rpx;
		margin: 0 auto;
		display: block;
	}

	.custome-set {
		padding: 20rpx;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		line-height: unset;
	}

	.custome-set::after {
		border: none;
	}

	.set-left {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #000;
	}

	.set-left image {
		width: 38rpx;
		height: auto;
		margin-right: 14rpx;
	}

	.mine-order-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		padding: 30rpx 50rpx 30rpx 24rpx;
		margin: 14rpx 24rpx;
		background-color: #fff;
		border-radius: 10rpx;
		color: #000;
	}

	.mine-order {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #666;
		border-left: 1rpx solid #ccc;
	}

	.order-num {
		padding-left: 50rpx;
	}

	.complete-order-box {
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
		background-color: #fff;
		padding: 30rpx 20rpx;
		font-size: 28rpx;
	}

	.history-order {
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #ccc;
	}

	.history-order:last-child {
		border-bottom: 0;
	}

	.order-time-price {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #999;
		padding: 0 0 20rpx;
	}

	.card-img-box {
		white-space: nowrap;
		width: 660rpx;
	}

	.card-img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		margin-right: 10rpx;
	}

	.order-time {
		color: #999;
		font-size: 28rpx;
		text-align: right;
	}

	.comment-cont {
		background-color: #fff;
		padding: 0 22rpx;
		margin: 14rpx 24rpx;
		border-radius: 10rpx;
	}

	.she-said-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 0 30rpx;
	}

	.she-said-more {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}

	.goods-title {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 32rpx;
	}

	.top-title {
		margin-right: 14rpx;
	}

	.comment-box {
		/* display: flex; */
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.comment-goods-box {
		width: 100%;
		padding-bottom: 20rpx;
		position: relative;
		margin-top: -54rpx;
		z-index: 9999;
	}

	/* .comment-img {
		border-radius: 10rpx;
		overflow: hidden;
		position: relative;
	}

	.comment-img image {
		width: 344rpx;
		height: auto;
		display: block;
	} */

	.comment-goods-name {
		/* position: absolute;
		top: -48rpx;
		left: 0;
		right: 0; */
		background-color: rgba(0, 0, 0, .5);
		color: #fff;
		font-size: 30rpx;
		text-align: center;
		height: 54rpx;
		line-height: 54rpx;
	}

	.weight-cal {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 20rpx;
		color: #999;
		padding: 0 5rpx;
	}

	.weight-box {
		padding: 16rpx 0 20rpx;
	}

	.comment-func-box {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		min-height: 62rpx;
	}

	.comment-func image {
		width: 54rpx;
		height: 32rpx;
		display: block;
	}

	.triangle-box {
		margin-right: 6rpx;
		display: flex;
		align-items: center;
	}

	.comment-func-btn {
		display: flex;
		align-items: center;
		background-color: #333;
		color: #fff;
		border-radius: 10rpx;
		width: 240rpx;
		padding: 12rpx 0;
	}

	.comment-btn {
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		font-size: 28rpx;
	}

	.comment-btn image {
		width: 26rpx;
		height: auto;
		padding-right: 10rpx;
	}

	.zan-box {
		border-right: 1rpx solid #fff;
	}

	.triangle {
		border-style: solid;
		border-color: transparent;
		border-width: 10rpx 0 10rpx 10rpx;
		border-left-color: #333;
	}

	.like-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		font-size: 28rpx;
		color: #333;
		margin: 0 0 20rpx;
	}

	.like-box image {
		width: 24rpx;
		height: auto;
		margin-right: 10rpx;
	}

	.like-name {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.goods-comment-box {
		background-color: #eee;
		border-radius: 10rpx;
		padding: 26rpx 20rpx;
		margin: 10rpx 0 30rpx;
	}

	.goods-comment {
		font-size: 28rpx;
		color: #666;
	}

	.comment-name {
		color: #333;
	}

	.dian-quan-title {
		text-align: center;
		color: #333;
		font-size: 32rpx;
		background-color: #fff;
		padding-bottom: 32rpx;
	}

	.goods-cont {
		padding: 0 24rpx;
		color: #333;
	}

	.goods-box {
		padding: 0 0 36rpx 24rpx;
		border-left: 1rpx solid #ccc;
		position: relative;
	}

	.progress-icon {
		position: absolute;
		top: 0;
		left: -12rpx;
		width: 24rpx;
		height: 24rpx;
	}

	.create-time {
		font-size: 24rpx;
	}

	.trend-store-info-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 22rpx;
	}

	.logo-name-box {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.trend-store-logo {
		margin-right: 20rpx;
	}

	.trend-store-logo image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: block;
	}

	.business-time-box {
		display: flex;
		align-items: center;
	}

	.store-name {
		font-weight: 600;
		margin-right: 12rpx;
	}

	.business-time {
		color: #F2AB99;
		font-size: 20rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 50rpx;
		width: 80rpx;
		border: 2rpx solid #F2AB99;
		text-align: center;
	}

	.go-store {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #fff;
		width: 140rpx;
		height: 60rpx;
		line-height: 60rpx;
		background-color: #F3B1A0;
		border-radius: 50rpx;
	}

	.go-store image {
		width: 26rpx;
		height: 26rpx;
		display: block;
		margin-right: 10rpx;
	}

	.share-img image {
		width: 60rpx;
		height: 60rpx;
	}

	.customer-num {
		font-size: 28rpx;
		color: #999;
		margin-top: 18rpx;
	}

	.type-box {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.share-img button {
		background-color: #fff;
		line-height: unset;
		padding: 0;
	}

	.share-img button::after {
		border: none;
	}

	.type-name {
		font-size: 28rpx;
		color: #333;
		padding: 40rpx 0 20rpx;
	}

	.goods-img image {
		width: 480rpx;
		height: auto;
	}

	.create-time-box {
		display: flex;
		align-items: center;
		color: #333;
		font-size: 24rpx;
		padding-top: 18rpx;
	}

	.time-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 4rpx;
	}

	.time-icon image {
		width: 36rpx;
		height: 36rpx;
	}

	.time {
		line-height: 36rpx;
	}

	.disabled {
		pointer-events: none;
	}

	.personal-box {
		padding: 40rpx;
	}

	.personal-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #F2AB99;
		font-size: 28rpx;
	}

	.personal-title image {
		width: 110rpx;
		height: auto;
		margin-bottom: 40rpx;
	}

	.personal-input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 26rpx 0;
		font-size: 28rpx;
		color: #333;
		border-bottom: 1rpx solid #F4F4F4;
	}

	.personal-input input {
		text-align: right;
	}

	.personal-input:nth-child(5) {
		border-bottom: 0;
	}

	.personal-avatar {
		background-color: transparent;
		display: flex;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.personal-avatar::after {
		border: unset;
	}

	.personal-avatar image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.save-personal {
		width: 210rpx;
		height: 60rpx;
		line-height: 60rpx;
		color: #fff;
		background-color: #F2AB99;
		text-align: center;
		border-radius: 50rpx;
		margin: 30rpx auto 0;
		display: block;
	}

	.personal-cont>>>.u-popup__content {
		width: 520rpx;
	}

	.update-personal-info {
		color: #F2AB99;
		font-size: 24rpx;
		text-align: right;
		margin: 14rpx 24rpx 0;
	}

	.no-loading image {
		width: 288rpx;
		height: auto;
		padding: 40rpx 0;
		margin: 0 auto;
		display: block;
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
		width: 50%;
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

	.collected-img {
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -30rpx;
	}

	.collected-img image {
		width: 60rpx;
		height: auto;
		animation-duration: 2s;
		animation-delay: 0;
		animation-iteration-count: 1;
	}

	.transition {
		position: fixed;
		left: 50%;
		margin-left: -30rpx;
		top: 50%;
		margin-top: -30rpx;
		z-index: 9999;
	}

	.business-license {
		background-color: #fff;
		margin: 14rpx 24rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
	}
</style>