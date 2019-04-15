(function(window) {
	var g = {};
	var userVersion = '1.0.0';
	var userToken = 'Authorization';
	var userKey = 'Key';
	var userLoginTime = 'LoginTime';
	var tokenExpires = 'Expires';
	var userName = "UserName";
	var businessName = "BusinessName";
	var mobile = "Mobile";
	var userPayPassword = "UserPayPassword";
	var userWx = "UserWx";
	var headIcon = "HeadIcon";
	var type = "Type";
	var location = "Location";
	var authStatus = "AuthStatus";
	var notificationFlag = "NotificationFlag";
	var businessLogo = "BusinessLogo"

	//var requestUri = "http://192.168.4.55:8061/api/v1";
//	var requestUri = "http://120.77.81.194/api/v1";
//	var domain = "http://120.77.81.194"
//	var shareUri = 'http://120.77.81.194:8081';

	var requestUri = "http://www.nashouhb.com/api/v1";
	var domain = "http://www.nashouhb.com"
	var shareUri = 'http://www.nashouhb.com';


	g.getVersion = function(){
		return userVersion;
	}

	g.getRequestUri = function() {
		return requestUri;
	}

	g.getShareUri = function() {
		return shareUri;
	}

	g.getImgUri = function() {
		return domain;
	}

	g.getRequestToken = function(){
		return { "Authorization" : "Bearer__" + $api.getStorage(userToken) , "Key": "Bearer__" + $api.getStorage(userKey) , "ClientId" : "Bearer__1" };
	}

	g.getTokenName = function() {
		return userToken;
	}

	g.getTokenType = function() {
		return "Bearer__"
	}

	g.loginOut = function(){
		$api.rmStorage(userToken);
	}

	g.getPlatformSource = function() {
		return 1;
	}

	g.getVersionName = function() {
		return "Version";
	}

	g.getToken = function() {
		return $api.getStorage(userToken);
	}

	g.setToken = function(value) {
		$api.setStorage(userToken, value);

		$api.setStorage(userLoginTime, new Date());
	}

	g.getKey = function() {
		return $api.getStorage(userKey);
	}

	g.setKey = function(value) {
		$api.setStorage(userKey, value);
	}

	g.getLocation = function() {
		return $api.getStorage(location);
	}

	g.setLocation = function(value) {
		$api.setStorage(location, value);
	}

	g.getBusinessName = function() {
		return $api.getStorage(businessName);
	}

	g.setBusinessName = function(value) {
		$api.setStorage(businessName, value);
	}

	g.getTokenExpires = function() {
		return $api.getStorage(tokenExpires);
	}

	g.setTokenExpires = function(value) {
		$api.setStorage(tokenExpires, value);
	}

	g.getUserName = function() {
		return $api.getStorage(userName);
	}

	g.setUserName = function(value) {
		$api.setStorage(userName, value);
	}

	g.getMobile = function() {
		return $api.getStorage(mobile);
	}

	g.setMobile = function(value) {
		$api.setStorage(mobile, value);
	}

	g.getHeadIcon = function() {
		return $api.getStorage(headIcon);
	}

	g.setHeadIcon = function(value) {
		$api.setStorage(headIcon, value);
	}

	g.getType = function() {
		return $api.getStorage(type);
	}

	g.setType = function(value) {
		$api.setStorage(type, value);
	}

	g.getAuthStatus = function() {
		return $api.getStorage(authStatus);
	}

	g.setAuthStatus = function(value) {
		$api.setStorage(authStatus, value);
	}

	g.getGuideFlag = function() {
		return $api.getStorage("APP-GUIDEFLAG");
	}

	g.setGuideFlag = function() {
		$api.setStorage("APP-GUIDEFLAG", userVersion);
	}

	g.cleanGuideFlag = function() {
		$api.rmStorage("APP-GUIDEFLAG");
	}

	g.getPlatformSource = function() {
		return 1;
	}

	g.getUserPayPassword  = function() {
		return $api.getStorage(userPayPassword);
	}

	g.setUserPayPassword = function(value) {
		$api.setStorage(userPayPassword, (value == 'true' || value == '1' ? '1' : '0'));
	}

	g.getUserWx  = function() {
		return $api.getStorage(userWx);
	}

	g.setUserWx = function(value) {
		$api.setStorage(userWx, value);
	}

	g.getBusinessLogo  = function() {
		return $api.getStorage(businessLogo);
	}

	g.setBusinessLogo = function(value) {
		$api.setStorage(businessLogo, value);
	}

	g.getNotificationFlag = function() {
		return $api.getStorage(notificationFlag);
	}

	g.setNotificationFlag = function(value) {
		$api.setStorage(notificationFlag, value);
	}

	g.isValidUser = function(){
		if($api.getStorage(userToken) && $api.getStorage(tokenExpires)){
			var currentTime = new Date();
			var loginTime = new Date($api.getStorage(userLoginTime));
			var expires = $api.getStorage(tokenExpires);

			loginTime = loginTime.valueOf() + eval(expires) * 1000;
			loginTime = new Date(loginTime);
			if(currentTime > loginTime){
				return false;
			}

			return true;
		}else{
			return false;
		}
	}

	g.setToast = function(title) {
		api.toast({
			msg : title,
			duration : 2000,
			location : 'middle'
		});
	}

	g.setErrorToast = function() {
		api.toast({
			msg : '网络异常，请稍后再试！',
			duration : 2000,
			location : 'middle'
		});
	}

	g.openWin = function(pageName, params) {
		api.openWin({
			name : pageName,
			url : pageName + '.html',
			reload : true,
			slidBackEnabled : false,
			pageParam : params
		});
	}

	g.openWinName = function(winName, pageName, params) {
		api.openWin({
			name : winName,
			url : pageName + '.html',
			reload : true,
			slidBackEnabled : false,
			pageParam : params
		});
	}

	g.networkConnection = function(){
		var connectionType = api.connectionType;
	  	if(connectionType === 'unknown' || connectionType === 'none'){
	  		return false;
	  	}

	  	return true;
	}

	g.networkStatus = function(noneDiv, mainDiv){
		var connectionType = api.connectionType;
	  	if(connectionType === 'unknown' || connectionType === 'none'){
			$api.removeCls($api.byId(noneDiv), 'hide');
			$api.addCls($api.byId(mainDiv), 'hide');
	 	}else{
	 		$api.removeCls($api.byId(mainDiv), 'hide');
			$api.addCls($api.byId(noneDiv), 'hide');
	 	}
	}

	g.formatDate = function (time, format){
		var date = new Date(time);
		var o = {
		"M+" : date.getMonth()+1,
		"d+" : date.getDate(),
		"h+" : date.getHours(),
		"m+" : date.getMinutes(),
		"s+" : date.getSeconds(),
		"q+" : Math.floor((date.getMonth()+3)/3),
		"S" : date.getMilliseconds()
		}

		if(/(y+)/.test(format)){
			format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4- RegExp.$1.length));
		}

		for(var k in o)if(new RegExp("("+ k +")").test(format)){
			format = format.replace(RegExp.$1, RegExp.$1.length==1? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
		}

		return format;
	}

	g.formatCurrency = function(num) {
        if(isNaN(num))
			return '0';
		if(num === undefined || num === null)
			return '0';
			
        num = num.toString().replace(/\$|\,/g,'');

        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        var cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
			cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++){
			num = num.substring(0,num.length-(4*i+3))+','+
			num.substring(num.length-(4*i+3));
        }
        return (((sign)?'':'-') + num + '.' + cents);
	}
	
	g.formatNum = function(num) {
        if(isNaN(num))
			return '0';
		if(num === undefined || num === null)
			return '0';
        num = num.toString().replace(/\$|\,/g,'');

        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        var cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
			cents = "0" + cents;
        return (((sign)?'':'-') + num + '.' + cents);
	}

	g.toDateString = function (time){
		if(time){
			var date = new Date(time);
			return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
		}else{
			return '';
		}
	}

	g.toYearMonthString = function (time){
		if(time){
			var date = new Date(time);
			return date.getFullYear() + '-' + (date.getMonth()+1);
		}else{
			return '';
		}
	}

	g.toMonthString = function (time){
		var months = new Array("一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二");
		if(time){
			var date = new Date(time);

			return months[date.getMonth()];
		}else{
			return '';
		}
	}

	/**
	 * 根据日期字符串获取星期几
	 */
	g.getWeek = function(time){
	  	if(time){
			var date = new Date(time);

		    var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
		    return weeks[date.getDay()];
		}else{
			return '';
		}
	}

	g.compareDateTime = function(messageTime) {
		var nowTime = new Date();
		var msgTime = new Date(messageTime);
		var differ = nowTime.getTime() - msgTime.getTime();

		var flag = 1;
		if (parseInt(differ / 3600000) <= 24) {
			flag = 1;
		} else {
			flag = 2;
		}

		return flag;
	}

	g.pullImage = function(){
		return ['widget://image/pull_refresh/1.png','widget://image/pull_refresh/2.png','widget://image/pull_refresh/3.png','widget://image/pull_refresh/4.png','widget://image/pull_refresh/5.png','widget://image/pull_refresh/6.png',
				'widget://image/pull_refresh/6.png','widget://image/pull_refresh/8.png','widget://image/pull_refresh/9.png','widget://image/pull_refresh/10.png','widget://image/pull_refresh/11.png','widget://image/pull_refresh/12.png',
				'widget://image/pull_refresh/13.png',];
	}

	g.pushImage = function(){
		return ['widget://image/push_refresh/1.png','widget://image/push_refresh/2.png','widget://image/push_refresh/3.png','widget://image/push_refresh/4.png','widget://image/push_refresh/5.png','widget://image/push_refresh/6.png',
				'widget://image/push_refresh/6.png','widget://image/push_refresh/8.png','widget://image/push_refresh/9.png','widget://image/push_refresh/10.png','widget://image/push_refresh/11.png','widget://image/push_refresh/12.png'];
	}

	g.loadImage = function(){
		return [{ frame: 'widget://image/page_refresh/1.png' }, { frame: 'widget://image/page_refresh/2.png' }, { frame: 'widget://image/page_refresh/3.png' }, { frame: 'widget://image/page_refresh/4.png' }, 
			{ frame: 'widget://image/page_refresh/5.png' }, { frame: 'widget://image/page_refresh/6.png' }, { frame: 'widget://image/page_refresh/7.png' }, { frame: 'widget://image/page_refresh/8.png' }, 
			{ frame: 'widget://image/page_refresh/9.png' }, { frame: 'widget://image/page_refresh/10.png' }, { frame: 'widget://image/page_refresh/11.png' }, { frame: 'widget://image/page_refresh/12.png' }]
	}
	window.global = g;
})(window);
