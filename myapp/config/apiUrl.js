// var hostName = ;
var apiurl = {
	hostName: 'https://api.pierup.cn',//'https://api.pierup.cn',//'http://pierup.asuscomm.com:8686',
	port:'8443',
	getCountries: { url: '/common_api/v1/query/get_countries', method: 'GET' },
	merchantLogin: { url: '/merchant_api/v1/manage/merchant_signin?platform=1'},

	//SDK api
	sdkSMSPsdForget: { url: '/user_api_cn/v1/user/sms_password_forget?platform=1' },
	sdkSMSPsdCheck: { url: '/user_api_cn/v1/user/sms_password_check?platform=1'},
	sdkResetPsd: { url: '/user_api_cn/v1/user/sms_password_reset?platform=1'},

	//公积金 api
	gongjijinValidImage: { url: '/pier-rule-web/gongjj/authcode?platform=1', method: 'GET'},
	gongjijiValid: { url: '/pier-rule-web/gongjj/eval?platform=1' },
	gongjijiAddress: { url: '/pier-rule-web/gongjj/addr?platform=1', method: 'GET' },
	//征信 api
	zhengXinPrepare: { url: '/pier_rules/creditReport/prepare', method: 'GET'},
	zhengXinValid: { url: '/pier_rules/creditReport/eval?platform=1'},
	//商家 api
	//
	//forget password
	sdkSMSPsdForget: {url: '/user_api_cn/v1/user/sms_password_forget?platform=1' },
	sdkSMSPsdCheck: {url: '/user_api_cn/v1/user/sms_password_check?platform=1'},
	sdkResetPsd: {url: '/user_api_cn/v1/user/sms_password_reset?platform=1'},
}
module.exports = apiurl;