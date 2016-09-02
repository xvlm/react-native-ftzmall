export const WEXIN_ARTICLE_LIST = 'showapi_open_bus/weixin/weixin_article_list';
export const WEXIN_ARTICLE_TYPE = 'showapi_open_bus/weixin/weixin_article_type';

//html for base url
	export const base_url = 'http://api.ftzmall.com';
	export const domain_url = "m.ftzmall.com";

	export const API_VERSION = "/v2";

	export const LOGIN_DYNAMIC = API_VERSION + "/users/dlogin";
//	export const LOGIN_NORMAL = "/v1/users/login?username=%s&password=%s&verifyCode=%s";
	export const LOGIN_NORMAL = API_VERSION + "/users/login";
	export const LOGOUT = API_VERSION + "/users/logout";
	//发送短信验证码
	export const smscode = API_VERSION + "/users/smscode";
	export const register = API_VERSION + "/users/create";
	//获取图片验证码
	export const captcha = "/site/captcha";
	export const refreshCaptcha = "/site/captcha?refresh=1";

	//重置密码
	export const resetpwd = API_VERSION + "/users/resetpwd";

	//获取收货地址列表,第一个参数: token
	export const addresses = API_VERSION + "/addresses/getinfo";
	//获取单个收货地址,第一个参数: addressId
	export const addressShow = API_VERSION + "/addresses/show";

	//创建地址, 第一个参数: token
	export const addressCreate = API_VERSION + "/addresses/create";
	//更新地址, 第一个参数: userId, 第二个参数: addressId
	export const addressUpdate = API_VERSION + "/addresses/update";
	//删除地址, 第一个参数: userId, 第二个参数: addressId
	export const addressDelete = API_VERSION + "/addresses/delete";
	//设置默认地址, 第一个参数: userId, 第二个参数: addressId
	export const addressSetDefault = API_VERSION + "/addresses/setdefault";

	//修改密码
	export const changepwd = API_VERSION + "/users/password";

	//获取实名认证信息
	export const getRealname = API_VERSION + "/realnames/getinfo";
	//提交实名认证
	export const realname = API_VERSION + "/realnames/create";


	export const pageParams = "?page=%s&per-page=%s";
	//获取所有订单列表, method: GET,
	export const getOrderList = API_VERSION + "/orders/index";
//	export const getOrderList = "http://la.ftzmall.com/v1/orders";
	//获取所有订单列表, method: GET, 第一个参数: orderId
	export const getOrderDetail = API_VERSION + "/orders/view";
	//订单支付, method: POST
	export const orderPay= API_VERSION + "/orders/pay";
	export const orderPayResultURl= base_url + "/order/index.html";
	//确认收货, method: PUT, 第一个参数: orderId
	export const putConfirmReceipt= API_VERSION + "/orders/confirmreceived";
	//申请退货
	export const orderRefund = "/smcfs/restapi/executeFlow/CreateReturnFromStorefront";

	//优惠券--列表, method: GET, 第一参数: token
	export const getCouponsList = API_VERSION + "/coupons/index";

	//二维码下载地址
	export const downloadScanUrl = API_VERSION + "/users/qrcode?mobile=%s&size=16";

	//首页广告: 广告滚轮位
	export const ad_imagetext = API_VERSION + "/comercials?platform=api&type=imagetext&id=";
	//首页广告: 专场
	export const ad_brand = API_VERSION + "/comercials?platform=api&type=brand&id=";
	//首页广告: 产品(每日必Buy, 全球精选等...)
	export const ad_product = API_VERSION + "/comercials?platform=api&type=product&id=";
	//模糊搜索
	export const search = API_VERSION + "/searches?search=%s&page=%s";

	export const product_detail = base_url + "/product/app.html?id=%s";
	export const product_detail_url = base_url + "/p/";
	export const p_detail = base_url + "/product/app.html?id";
	export const p_detail_url = base_url + "/p/%s.html";

	//购物车
	export const shopping_cart = base_url + "/cart/app.html";
	//从购物车进去的确认订单页面
	export const confirm_order_url = base_url + "/cart/checkout.html";

	//跳转首页
	export const index_url = base_url + "/site/index.html";
	//服务协议
	export const fwxy_url = base_url + "/issue/fwxy.html";
	//登录页面
	export const login_url = base_url + "/passport/login.html";
	//实名认证
	export const realname_url = base_url + "/realname/index.html";
	//新增地址
	export const addAddress_url = base_url + "/address/create.html";
	//修改地址
	export const editAddress_url = base_url + "/address/update.html";

	export const orderPay_return_url = base_url + "/order/index.html";

    //订单结算页面
	export const checkoutapp_url = base_url + "/cart/checkoutapp.html";

	//意见反馈URL
	export const feedback_url = "https://jinshuju.net/f/vx1yu0";

	export const APP_version = "http://cbt-space.pek3a.qingstor.com/app/version.json";

	export const APP_ANONYMOUS = "anonymous";


	//获取微信支付预支付prepayid
	export const getwxpay = API_VERSION + "/orders/getwxpay";

	//apk 下载地址
	export const APP_APK = "http://m.ftzmall.com/act2016/site/appstore.html";
	export const APP_LOGO = "http://7xoo3k.com2.z0.glb.qiniucdn.com/other-ftzmall-logo.jpg";

	//微信支付回调函数
//	export const WX_PAY_RETURN_URL = "http://payment.11kuajing.com:80/trade-web/rest/v1/payment/paycallback/orderId/%s/paymentmethod/WechatApp/actionName/deposit/storeId/ftzmall";

	//正式环境
//	export const WX_PAY_RETURN_URL = "http://pay.ftzmall.com/trade-web/rest/v1/payment";
	//测试环境
	export const WX_PAY_RETURN_URL = "http://payment.11kuajing.com/trade-web/rest/v1/payment";

	/**
	 * 检查版本接口
	 */
	export const TRANSCODE_CHECK_VERSION = "SYS0000002";

