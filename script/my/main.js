var winName = "memberCenterWin";
var authStatus;
var bindWXFlag = -1;//-1=未绑定 1=微信绑定成功 0=解绑微信成功

apiready = function(){
	bindWXFlag = global.getUserWx();
	showAuthStatus();
	loadUserInfo();
	initEvent();
}

/**
 *初始化事件
 */
function initEvent(){
	api.setCustomRefreshHeaderInfo({
		bgColor : '#fdf7e7',
		image : {
			pull : global.pullImage(),
			load : global.pushImage()
		}
	}, function(ret, err) {
		showAuthStatus();
		loadUserInfo();
		api.refreshHeaderLoadDone();
	});
	
	
	api.addEventListener({
        name: 'modifyUserInfo'
    }, function(ret, err) {
	    if (ret) {
	    	global.setToast('保存成功');
			$api.attr($api.byId('headIconId'), 'src', global.getImgUri() +'/'+ global.getHeadIcon());
			$api.html($api.byId('mobileId'), global.getMobile());
			$api.html($api.byId('nickNameId'), (global.getUserName()?global.getUserName(): '暂无昵称'));
		}

		api.closeWin({
				name : winName
		});
	});

	api.addEventListener({
        name: 'authApplyEvent'
    }, function(ret, err) {
		global.setAuthStatus(0);
		global.setType(0);
		$api.html($api.byId('authDiv'), '认证中');

		var params = { "page" : "../my/auth_detail", "title" : "商家认证（认证中）", "closeAuth" : 1 };
		global.openWinName('authDetailWin', '../common/common_win', params);
    });

    api.addEventListener({
        name: 'authRefreshEvent'
    }, function(ret, err) {
		showAuthStatus();
    });

	api.addEventListener({
        name: 'bingdingMobile'
    }, function(ret, err) {
        if (ret) {
			$api.html($api.byId('mobileId'), global.getMobile());
	    }
    });

	api.addEventListener({
        name: 'signSuccess'
    }, function(ret, err) {
        if (ret && ret.value) {
			$api.html($api.byId('signDivId'), '今日已签到');
			$api.addCls($api.byId('signPointId'), 'aui-hide');
	    }
    });


	//现金资产更新事件
	api.addEventListener({
		name : 'financeAccountRefresh'
	}, function(ret, err) {
		//现金资产方法
		getFinanceAccount();
	});

	//会员统计数据更新事件
	api.addEventListener({
		name : 'memberStatisticsRefresh'
	}, function(ret, err) {
		//会员统计数据方法
		getMemberStatistics();
	});


    //登出更新事件
	api.addEventListener({
		name : 'logOutSuccessEvent'
	}, function(ret, err) {
		$api.clearStorage();
	
		api.closeWin({
			name: 'setWin'
        });

		api.closeFrameGroup({
			name: 'frameGroup'
		});
		
		var params = { "type" : 2 };
		global.openWinName('entranceWin', './html/entrance/login', params);
	});
	
	api.addEventListener({
		name : 'authSuccessEvent'
	}, function(ret, err) {
		//显示认证状态
		showAuthStatus();
		api.closeWin({
			name : winName
        });
		api.closeWin({
		 name : 'authDetailWin'
        });
	});
	
	api.addEventListener({
		name : 'authFailEvent'
	}, function(ret, err) {
		//显示认证状态
		showAuthStatus();
		api.closeWin({
			name : winName
        });
		api.closeWin({
		 name : 'authDetailWin'
        });
	});
	
	api.addEventListener({
		name : 'countExpiredCouponEvent'
	}, function(ret, err) {
		loadUserInfo();
	});
}

/**
 *显示认证状态
 */
function showAuthStatus(){
    authStatus = global.getAuthStatus();
    if(authStatus == 0){
		$api.html($api.byId('authDiv'), '认证中');
	}else if(authStatus == 1){
		$api.html($api.byId('authDiv'), '已认证');
	}else if(authStatus == 2){
		$api.html($api.byId('authDiv'), '已认证');
	}else if(authStatus == -1){
		$api.html($api.byId('authDiv'), '认证未通过');
	}else{
		$api.html($api.byId('authDiv'), '未认证');
	}
}

/**
 * 打开子窗体
 * @param {序号} item
 */
function openSubWin(item) {
	if (item != 1 && item != 2 && item != 3) {
		if(!global.networkConnection()){
			global.setToast('网络异常，请稍后再试！');
			return;
		}
	}
	
	winName = "memberCenterWin"
	var header = "../common/common_win";
	var params = {};

	switch(item) {
		case 1:
			header = "../my/message_win";
			break;
		case 2:
			winName = "setWin";
			params = { "page" : "../my/set", "title" : "设置"};
			break;
		case 3:
			header = "../my/persion_data_win";
			break;
		case 4:
			params = { "page" : "../my/sign", "title" : "签到送礼"};
			break;
		case 5:
			header = "../my/red_packets_win";
			break;
		case 6:
			header = "../my/finance_win";
			break;
		case 7:
			header = "../my/collect_win";
			break;
		case 8:
			params = { "page" : "../my/top", "title" : "排行榜"};
			break;
		case 9:
			var title = "";
			var page = "../my/auth_detail";
			if(authStatus == 0){
				title = "商家认证（认证中）";
	    	}else if(authStatus == 1 || authStatus == 2){
				title = "商家认证（已认证）";
	    	}else if(authStatus == -1){
	    		winName = 'againWin';
				title = "商家认证（认证未通过）";
				page = "../my/auth_again";
	    	}else{
	    		title = "商家认证（未认证）";
	    		page = "../my/auth";
	    	}

			params = { "page" : page, "title" : title , "authStatus" : authStatus };
			break;
		case 10:
			
			bindWX();
			break;
	}

	if(item != 10){
		global.openWinName(winName, header, params);
	}
}

/**
 *查询有效优惠券
 */
function validCouponNum() {
	api.ajax({
			method : 'GET',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/coupon-records/count',
			headers : global.getRequestToken()
		}, function(ret, err) {
			if(ret){
				if(ret.success ){
					if(ret.obj > 0){
						$api.html($api.byId('vaildCouponCount'), ret.obj + "张可用优惠券");
					}
				}else {
					global.setToast(ret.message);
				//	api.alert({msg:ret.message});
				}
			} else {
				$api.html($api.byId('vaildCouponCount'), "暂无可用");
			}
	});
}

/**
 *绑定微信
 */
function bindWX(){
		
	if(bindWXFlag == -1){//
		
		var wx = api.require('wx');
		wx.isInstalled(function(ret, err) {
		    if (ret.installed) {
				wx.auth({
					apiKey: ''
				}, function(ret, err) {
				    if (ret.status) {
						wx.getToken({
						    code: ret.code
						}, function(ret, err) {
						    if (ret.status) {
						        wx.getUserInfo({
								    accessToken: ret.accessToken,
								    openId: ret.openId
								}, function(ret, err) {
								    if (ret.status) {
								        bindWxOpenId(ret.openid, ret.nickname, ret.sex, ret.headimgurl);
								       
								    } else {
								        global.setToast('获取用户信息失败')
								    }
								   
									
								});
						    } else {
						        global.setToast('获取token失败');
						    }
						});
				    }
				    bindWXFlag =0;
				});
		    } else {
		        alert('当前设备未安装微信客户端');
		    }
		    
		});
		
		//bindWXFlag =0;
	}else if(bindWXFlag ==1){//微信绑定成功

		unBindWx();
	}else if(bindWXFlag ==0){//解绑微信成功

		reBindWx();
	} 
	
}

//解绑
function unBindWx(){
	api.confirm({
			title : '您要解除绑定吗',
			msg : '',
			buttons : ['解绑', '取消']
   		},function(ret,err){
			// api.showProgress({
			// 	title: '解绑中...',
			// 	modal: false
		 //    });

			if (ret.buttonIndex === 1) {
				   api.ajax({
		            method : 'post',
		            cache : false,
		            dataType : 'json',
		            returnAll : false,
		            url : global.getRequestUri() + '/member/info/unbind-wx',
		            headers : global.getRequestToken()
		        }, function(ret, err) {
		        	//api.hideProgress();
		            if (ret) {
		            	if (ret.success) {
		                    global.setToast('解绑成功');

		                    $api.html($api.byId('oauthDiv'), '未绑定');
							global.setUserWx(0);
							bindWXFlag = 0;	
		                } else {
		                    global.setToast(ret.message);
		                }
		            } else {
		                global.setErrorToast();
		            }

		        });
			}
		});
}

//重新绑定
function reBindWx(){
	api.confirm({
			title : '您要重新绑定吗',
			msg : '',
			buttons : ['重绑', '取消']
   		},function(ret,err){

			if (ret.buttonIndex === 1) {
				   api.ajax({
		            method : 'post',
		            cache : false,
		            dataType : 'json',
		            returnAll : false,
		            url : global.getRequestUri() + '/member/info/rebind-wx',
		            headers : global.getRequestToken()
		        }, function(ret, err) {
		        	//api.hideProgress();
		            if (ret) {
		            	if (ret.success) {
		                    global.setToast('重绑成功');

		                    $api.html($api.byId('oauthDiv'), '已绑定');
							global.setUserWx(1);
							bindWXFlag = 1;	
		                } else {
		                    global.setToast(ret.message);
		                }
		            } else {
		                global.setErrorToast();
		            }

		        });
			}
		});
}

function bindWxOpenId(openId, nickname, sex, headimgurl){
	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/member/info/bind-wx',
		headers : global.getRequestToken(),
		data : {
			values : {
				wxOpenId : openId,
				nickname : nickname,
				sex : sex,
				headimgurl : headimgurl
			}
		}
	}, function(ret, err) {
		if(ret && ret.success){
			global.setToast('绑定成功');
			$api.html($api.byId('oauthDiv'), '已绑定');
			global.setUserWx(1);

			var userName = global.getUserName();
			var headIcon = global.getHeadIcon();
			if(!userName){
				global.setUserName(ret.obj.nickName);

				$api.html($api.byId('nickNameId'), (global.getUserName()?global.getUserName(): '暂无昵称'));
			}
			
			if(!headIcon){
				global.setHeadIcon(ret.obj.headIcon);
				$api.attr($api.byId('headIconId'), 'src', global.getImgUri() +'/'+ global.getHeadIcon());
			}
			
			bindWXFlag = 1;	
		}else{
			global.setToast('绑定失败');
		}
	});
}

/**
 *获取我的资产账户数据
 */
function getFinanceAccount(){
	api.ajax({
			method : 'GET',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/finance-account',
			headers : global.getRequestToken()
		}, function(ret, err) {
			if(ret && ret.code === "403"){
				api.sendEvent({
	                name:'tokenExpiredEvent',
	                extra:{
	                	msg : ret.message
	                }
                });
                
                return;
			}
			if(ret){
				$api.html($api.byId('accountBalance'), global.formatCurrency(ret.accountBalance) + '元');

				//账户资产数据放入缓存
				$api.setStorage("financeAccountResult", ret);
				api.sendEvent({
					name: 'financeAccountRefreshSuccess'
				});

			}
	});
}

// 获取会员统计数据
function getMemberStatistics(){
	api.ajax({
			method : 'GET',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/memberStatistics',
			headers : global.getRequestToken()
		}, function(ret, err) {
			if(ret){
				//会员统计数据放入缓存
				$api.setStorage("memberStatisticsResult", ret);
				api.sendEvent({
					name: 'memberStatisticsRefreshSuccess'
				});

			}
	});
}

function loadUserInfo(){
	$api.attr($api.byId('headIconId'), 'src', global.getImgUri() +'/'+ global.getHeadIcon());
	$api.html($api.byId('mobileId'), global.getMobile());
	$api.html($api.byId('nickNameId'), (global.getUserName()?global.getUserName(): '暂无昵称'));

	$api.html($api.byId('oauthDiv'), (global.getUserWx() == 1 ? '已绑定': '未绑定'));

	var memberStatisticsResult = $api.getStorage("memberStatisticsResult");
	var financeAccountResult = $api.getStorage("financeAccountResult");

	if(financeAccountResult){
		$api.html($api.byId('couponCount'), '(' + financeAccountResult.coupon + ')');
		$api.html($api.byId('accountBalance'), global.formatCurrency(financeAccountResult.accountBalance) + '元');
	}

	api.ajax({
		method : 'GET',
		cache : false,
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/member/info/my',
		headers : global.getRequestToken()
	}, function(ret, err) {
		if(ret){
			if(ret.sign==1){
				$api.html($api.byId('signDivId'), '今日已签到');
				$api.addCls($api.byId('signPointId'), 'aui-hide');

				$api.setStorage("todaySignFlag", 1);
			}else{
				$api.setStorage("todaySignFlag", 0);
			}

			global.setType(ret.type);

			global.setAuthStatus(ret.authStatus);
			showAuthStatus();

			if(ret.memberStatistics){
				$api.setStorage("memberStatisticsResult", ret.memberStatistics);
			}

			if(ret.financeAccount){
				$api.html($api.byId('couponCount'), '(' + ret.financeAccount.coupon + ')');
				$api.html($api.byId('accountBalance'), global.formatCurrency(ret.financeAccount.accountBalance) + '元');
				//账户资产数据放入缓存
				$api.setStorage("financeAccountResult", ret.financeAccount);

			}
		}
	});
}

function openAdvWin(status){
	var params = {"status" : status};

	global.openWinName("advWin", "./advertisement_win", params);
}

function openVoucher(){
	api.openFrame({
        name: 'couponNoteFrame',
        url: '../redpacket/coupon_note.html'
    });
}

function closeRedpacket(){
	$api.addCls($api.byId('redpackMaskDiv'), 'aui-hide');
	$api.addCls($api.byId('vouchertkDiv'), 'aui-hide');
}
	