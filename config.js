import Vue from 'vue'
// let protocol = 'http://' // 协议
let protocol = 'https://' // 协议
// let host = 'www.yuepong.cn/dev/vibraphone/api-gateway/' // 外网域名+接口 开发环境
let host = 'www.yuepong.cn/test/vibraphone/api-gateway/' // 外网域名+接口 测试环境
// let host = 'www.yuepong.cn/prod/vibraphone/api-gateway/' // 外网域名+接口 正式环境
// let host = '192.168.0.202:10000/api-gateway/'
let appletName = '悦小店' // 小程序名称
let uploadUrl = 'https://upload-z1.qiniup.com' // 七牛云地址
let imgUrl = 'https://qiaokun.yuepong.com/hongbei%2F/' // 图片七牛云地址

let config = {
	protocol,
	host,
	appletName,
	uploadUrl,
	imgUrl,

	/* 文件域 auth-service */
	// 获取七牛云token
	getQiniuToken: 'file-service/api/v1.0/qiNiuClouds/token:get',






	/*认证域 auth-service*/
	// 登录
	getLogin: 'auth-service/api/v1.0/oauth/token',
	
	
	




	/*店铺域 store-service*/
	// 获取店铺详细信息
	stores: 'store-service/api/v1.0/stores',
	// 获取客户的所有注册门店
	storecustomers: 'store-service/api/v1.0/storeCustomers',
	// 注册单个门店和客户的关系，顾客端选择店铺信息之后调用
	resisterStore: 'store-service/api/v1.0/storeCustomers/loginStore',
	// 星标操作
	emphasis: 'store-service/api/v1.0/storeCustomers/emphasis',
	// 获取店铺编码
	storeCode: 'store-service/api/v1.0/stores/storeCode/next',
	// OCR印刷体识别
	scanOrder: 'store-service/api/v1.0/OCRs',
	// 获取登录用户管理的所有门店列表
	staffStore: 'store-service/api/v1.0/stores/staffStores/storeList',
	// 获取上线的管理店铺列表
	manageStaffStore: 'store-service/api/v1.0/stores/staffStores/storeList/publish',
	// 保存OCR识别模板
	ocrTemplate: 'store-service/api/v1.0/OCRs/template',
	// 保存店铺配置信息
	storePublicityMaps: 'store-service/api/v1.0/storePublicityMaps',
	// 获取店铺是否开启微信支付
	openJsApiPayStatus: 'store-service/api/v1.0/stores/openJsApiPayStatus',
	// 获取客户访问过的店铺列表
	customeStoreList: 'store-service/api/v1.0/storeCustomers/storeList',
	// 获取客户新增趋势折线图数据
	newCustomer: 'store-service/api/v1.0/storeCustomers/newCustomerCent/lineChart',
	// 取消店铺关注
	cancleAttention: 'store-service/api/v1.0/storeCustomers/cancel',
	// 客户取消关注的店铺列表
	cancleAttentionStore: 'store-service/api/v1.0/storeCustomers/cancelCollection/storeList',
	// 关注店铺
	attentionStore: 'store-service/api/v1.0/storeCustomers/comeBack',
	// 审核店铺信息
	applyStoreInfo: 'store-service/api/v1.0/stores/basicInfo/material',
	// 小程序码
	storesQrcode: 'store-service/api/v1.0/stores/weChat/miniProgram/qrCode',





	/*员工域 staff-service*/
	// 获取店铺下所有人员
	staffs: 'staff-service/api/v1.0/staffs',
	// 创建管理员
	administrators: 'staff-service/api/v1.0/admins',
	// 获取当前登录的用户是否为管理员
	loginUserRole: 'staff-service/api/v1.0/admins/loginCustomer/status',
	// 获取管理员列表
	adminsList: 'staff-service/api/v1.0/admins',





	/*客户域 customer-service*/
	// 获取当前登录的客户
	loginUser: 'customer-service/api/v1.0/customers/loginInformation',
	// 获取用户信息
	customers: 'customer-service/api/v1.0/customers/',
	// 客户配送地址
	shippingAddresses: 'customer-service/api/v1.0/shippingAddresses',
	//微信用户注册客户
	register: 'customer-service/api/v1.0/customers/register/weChat',
	// 解析获取手机号
	decryptPhone: 'customer-service/api/v1.0/customers/decryptPhone',
	// 验证码
	phoneCode: 'customer-service/api/v1.0/phoneMessage',





	/*商品域 catalog-service*/
	catalog: 'catalog-service/api/v1.0/bakeFinishes',
	menuGoodsList: 'catalog-service/api/v1.0/ememus',
	elementList: 'catalog-service/api/v1.0/elements',
	sellOut: 'catalog-service/api/v1.0/bakeFinishes/sellOut',
	// 获取商家的商品动态
	storeGoodsRecord: 'catalog-service/api/v1.0/products/records',
	// 商品点赞收藏/取消点赞收藏
	collectGood: 'catalog-service/api/v1.0/products',
	// 根据门店 id 获取商品信息(客户端)
	storecatalog: 'catalog-service/api/v1.0/products',
	storeBakeFinishes: 'catalog-service/api/v1.0/bakeFinishes',
	// 创建商品
	products: 'catalog-service/api/v1.0/products',
	// 提前出炉
	releasedAdvance: 'catalog-service/api/v1.0/bakeFinishes/comeOut',
	// 批量删除原料
	deleteElement: 'catalog-service/api/v1.0/elements/remove/list',
	productImg: 'catalog-service/api/v1.0/products/productImg',
	// 获取商品的点赞排行榜
	popularityTop: 'catalog-service/api/v1.0/products/popularityTop',
	// 获取商品评论排行榜
	commentTop: 'catalog-service/api/v1.0/products/comment/top',
	// 评论商品
	commentGoods: 'catalog-service/api/v1.0/products/customerComment',
	// 商品置顶
	topProduct: 'catalog-service/api/v1.0/products/topProduct',
	// 商品排序
	productOrder: 'catalog-service/api/v1.0/products/productOrder',
	// 商品分类
	productClass: 'catalog-service/api/v1.0/productClass',
	// 批量置顶
	topProductList: 'catalog-service/api/v1.0/products/topProduct/list',





	/*  营销域 activity-service  */
	// 创建活动
	editActivity: 'activity-service/api/v1.0/cardActivityRules',
	// 创建活动及保存规则
	addActivity: 'activity-service/api/v1.0/cardActivityRules/changeRule',
	// 活动列表、获取单个兑换规则详情
	activityList: 'activity-service/api/v1.0/cardActivityRules',
	// 兑换核销奖励查询、兑换核销
	verificationInfo: 'activity-service/api/v1.0/cardExchanges',
	// 抽卡资格查询、抽卡资格发放
	qualificationQuery: 'activity-service/api/v1.0/cardLuckDraws/level',
	// 用户的活动列表
	userActivity: 'activity-service/api/v1.0/cardActivityRules/userActivity',
	// 抽卡
	drawCardInfo: 'activity-service/api/v1.0/cardLuckDraws',
	// 核销数据存储
	cardExchanges: 'activity-service/api/v1.0/cardExchanges/qrCode',
	// 获取用户的卡数量
	userCardCount: 'activity-service/api/v1.0/cardExchanges/userCardCount',
	// 获取用户的抽卡记录
	drawRecord: 'activity-service/api/v1.0/cardLuckDraws/record',
	// 获取兑换核销记录
	exchangeRecord: 'activity-service/api/v1.0/cardExchanges/record',
	// 获取用户的卡片发放记录
	customerCardRecord: 'activity-service/api/v1.0/cardActivityRules/customerCardRecord',
	// 获取卡片预计获得数量
	estimateCardCount: 'activity-service/api/v1.0/cardActivityRules/estimateCardCount',
	// 发放卡片
	sendCardCustomer: 'activity-service/api/v1.0/cardActivityRules/sendCardCustomer',





	/*  交易域 order-service  */
	// 商家订单列表
	orderList: 'order-service/api/v1.0/orders/storeOrder',
	// 用户订单列表
	userOrderList: 'order-service/api/v1.0/orders/userOrder',
	// 订单操作
	orderOperation: 'order-service/api/v1.0/orders',
	// 地址是否超出配送范围
	deliveryRange: 'order-service/api/v1.0/orders/deliveryRange',
	// 获取微信支付参数
	wechatPay: 'order-service/api/v1.0/weChat',
	// 取消订单
	cancleOrder: 'order-service/api/v1.0/orders/cancel',
	// 获取时间段内的交易数据统计
	dataCount: 'order-service/api/v1.0/orders/payTimeRange/dataTotal',
	// 获取店铺收入折线图数据
	orderLineChart: 'order-service/api/v1.0/orders/payData/lineChart',
	// 获取客户成交分析数据
	payCustomer: 'order-service/api/v1.0/orders/customerPay/lineChart',
	// 实时获取收入数据
	payDataHour: 'order-service/api/v1.0/orders/payDataHour/lineChart',
	// 明日订单商品
	tomorrowOrderGoods: 'order-service/api/v1.0/orders/store/tomorrow/itemsCount',
	// 明日订单
	tomorrowOrder: 'order-service/api/v1.0/orders/store/tomorrow/orderPage',
	
	
	
	/*  配送域 delivery-service  */
	// 店铺配送属性
	storeDeliveries: 'delivery-service/api/v1.0/storeDeliveries',
	// 获取配送单列表
	deliveries: 'delivery-service/api/v1.0/deliveries',
	// 开始配送订单
	deliveryOrder: 'delivery-service/api/v1.0/deliveries/shipping',
	// 完结的配送单列表
	finishDelivery: 'delivery-service/api/v1.0/deliveries/finish',
	
	
	
	
	
	/*  红包域 consumption-service  */
	// 店铺红包列表
	redPacketInfo: 'consumption-service/api/v1.0/consumptionVouchers',
	// 用户红包账户明细
	bountyAccounts: 'consumption-service/api/v1.0/bountyAccounts',
	// 用户领取的红包详情
	redPacketDetail: 'consumption-service/api/v1.0/consumptionVouchers/received/record',
	
	
	
	/*   平台域 platform-service    */
	// 提交反馈
	userFeedback: 'platform-service/api/v1.0/platforms/customerFeedback',
	// 获取平台规范
	platformContexts: 'platform-service/api/v1.0/platforms',
	// 店铺审核
	storeMaterials: 'platform-service/api/v1.0/storeMaterials',
	// 根据账号获取店铺审核
	userStoreMaterials: 'platform-service/api/v1.0/storeMaterials/detailInfo/customer',
	
	
	
	
	
	/*   记账域 bookkeeping-service    */
	// 获取时间端内的账目合计
	timeRangeCount: 'bookkeeping-service/api/v1.0/accounts/timeRangeCount',
	// 获取时间范围内的日账目合计数据
	timeRangeLineChart: 'bookkeeping-service/api/v1.0/accounts/timeRangeLineChart',
	// 获取时间范围内收支账目分类
	timeRangeClassify: 'bookkeeping-service/api/v1.0/accounts/timeRangeClassCount',
	// 分类
	operateClassify: 'bookkeeping-service/api/v1.0/classOfAccounts',
	// 账目流水
	accountStream: 'bookkeeping-service/api/v1.0/accounts',
	// 获取时间范围内类别明细列表
	timeRangeClassItems: 'bookkeeping-service/api/v1.0/accounts/timeRangeClassItems',
	// 使用过的分类
	historyClassify: 'bookkeeping-service/api/v1.0/classOfAccounts/useRecord',
	
	
	
	
	
	/*   配方域 formula-service    */
	// 配方列表
	formulaInfo: 'formula-service/api/v1.0/formulas',
	// 原料列表
	ingredientInfo: 'formula-service/api/v1.0/ingredients',
	// 供货商原料列表
	supplierIngredient: 'formula-service/api/v1.0/ingredients/list',
	// 原料单位
	unitsInfo: 'formula-service/api/v1.0/units',
	// 食谱信息
	cookbookInfo: 'formula-service/api/v1.0/cookbooks',
	// 供货商信息
	suppliersInfo: 'formula-service/api/v1.0/suppliers',
	// 删除供货商
	deleteRecipeElement: 'formula-service/api/v1.0/ingredients/deleteList',
	// 存货列表
	ingredientInventoryInfo: 'formula-service/api/v1.0/ingredientInventory',
	// 存货点
	stockPointInfo: 'formula-service/api/v1.0/stocks/place',
	// 存货原料
	stockElement: 'formula-service/api/v1.0/stocks',
	
	

}
module.exports = config
