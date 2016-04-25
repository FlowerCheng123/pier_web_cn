// var hostName = ;
var apiurl = {
	hostName: 'https://api.pierup.cn',//'https://api.pierup.cn',//'http://pierup.asuscomm.com:8686',
	port:'8443',
	//商家 api
	register:{ url: '/merchant_api_cn/v1/register/register_merchant?platform=1' },
	emailVerification: { url: '/merchant_api_cn/v1/register/email_verification?platform=1' },
	login:{ url: '/merchant_api_cn/v1/manage/signin?platform=1' },
	forgetPassword: { url: '/merchant_api_cn/v1/manage/forget_password?platform=1'},
	resetPassword: { url: '/merchant_api_cn/v1/manage/reset_password?platform=1' },
	auth:{
		saveBasicInfo: { url: '/merchant_api_cn/v1/register/save_basic_info?platform=1' },
		saveLicenseInfo: { url: '/merchant_api_cn/v1/register/save_license_info?platform=1' },
		smsAgentPhone: { url: '/merchant_api_cn/v1/register/sms_merchant_register?platform=1' },
		saveAgentInfo: { url: '/merchant_api_cn/v1/register/save_agent_info?platform=1' },
		saveImage: { url: '/merchant_api_cn/v1/register/save_image_info?platform=1' },
		merchantInfo: { url: '/merchant_api_cn/v1/register/merchant_info?platform=1' },
		resendVerification: { url: '/merchant_api_cn/v1/register/resend_verification?platform=1' },
		getProfile: { url: '/merchant_api_cn/v1/dashboard/profile?platform=1'},
		updateProfile: { url: '/merchant_api_cn/v1/dashboard/profile_update?platform=1'},
		smsUpdatePhone: { url: '/merchant_api_cn/v1/dashboard/sms_profile_update?platform=1'},
		getCustomers: { url: '/merchant_api_cn/v1/dashboard/list_customers?platform=1' },
		getCustomerTransaction: { url: '/merchant_api_cn/v1/dashboard/list_user_transactions?platform=1'},
		getTransactions: { url: '/merchant_api_cn/v1/dashboard/list_transactions?platform=1' },
		refundInfo: { url: '/merchant_api_cn/v1/dashboard/refund_info?platform=1' },
		refund: { url: '/merchant_api_cn/v1/dashboard/refund?platform=1' },
		changePassword: { url: '/merchant_api_cn/v1/dashboard/change_password?platform=1' },
		getMerchantDashboard: { url: '/merchant_api_cn/v1/dashboard/get_merchant_dashboard?platform=1' },
		logout: { url: '/merchant_api_cn/v1/manage/signout?platform=1' },
		getApiKeys: { url: '/merchant_api_cn/v1/transaction/get_api_keys?platform=1' },
		addApiKey: { url:　'/merchant_api_cn/v1/transaction/add_api_key?platform=1' },
		deleteApiKey: { url: '/merchant_api_cn/v1/transaction/delete_api_key?platform=1' },
		shippingCompanyList: { url: '/merchant_api_cn/v1/order/shipping_company_list?platform=1'},
		saveLogisticsId: { url: '/merchant_api_cn/v1/order/save_logistics_id?platform=1' },
		trackingInfo: { url: '/merchant_api_cn/v1/order/tracking_info?platform=1' },
		orderList: { url: '/merchant_api_cn/v1/order/order_list?platform=1' },
		orderDetail: { url: '/merchant_api_cn/v1/order/order_detail?platform=1' },
		searchOrder: { url: '/merchant_api_cn/v1/order/search_order?platform=1' },
		cancelOrder: { url: '/merchant_api_cn/v1/order/cancel_order?platform=1'},
		cancelOrderTemp: { url: '/merchant_api_cn/v1/order/message_template_for_cancel_order?platform=1' }
	}
	
}
module.exports = apiurl;