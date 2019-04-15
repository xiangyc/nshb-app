var interestWin = "interestWin";
var areaId;//地市
var cityActives =0;//地市选择序号
var provinceActives =0;//省份选择序号
var headIconPath ;//上传的头像路径
var sex;//性别
var birthday;//出生年月
var mobile;
var interestsIds;//兴趣爱好ids

apiready = function(){
  
	var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }
    var pos = $api.offset(header);

   initEvent();
   detail();
   
   if(!global.networkConnection()){
		global.setToast('网络异常，请稍后再试！');
  	}
  	
}

function initEvent(){
    api.addEventListener({
        name: 'detailInterestSelect'
    }, function(ret, err) {
        if (ret && ret.value) {
        	interestsIds = ret.value.interestsIds;
            var names = ret.value.interestsNames;
            showInterestByChoice(names);
	    }

        api.closeWin({
			name : interestWin
		});
    });

    api.addEventListener({
        name: 'bingdingMobile'
    }, function(ret, err) {
        if (ret) {
            $api.html($api.byId('mobileId'),  global.getMobile());
	    }

/*        api.closeWin({
			name : 'bingdingMobileWin'
		});*/
    });
}

/**
 * 用户详情
 */
function detail(){

	var persinDataFrame = $api.getStorage("persinDataFrame");
	if(persinDataFrame){
		showInfo(persinDataFrame);
	}else{
		api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/member/detail',
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
			if (ret) {
				$api.setStorage("persinDataFrame", ret);

				showInfo(ret);

			}
		});
	}
}

function showInfo(ret){
	if(ret.areaNo){
		var kk = ret.areaNo.split(",");
		provinceActives = kk[0];
		cityActives = kk[1];
	}

	//if(ret.headIcon){
		$api.attr($api.byId('headIconId'), 'src', global.getImgUri()+'/'+ret.headIcon);
	//}

	if(ret.nickName){
		$api.val($api.byId('nickNameId'), ret.nickName);
	}
	if(ret.sex===0){
		$api.html($api.byId('sexId'), '女');
	}else if(ret.sex===1){
		$api.html($api.byId('sexId'), '男');
	}else{
		$api.html($api.byId('sexId'), '请选择');
	}

	if(ret.mobile){
		mobile = ret.mobile;
		$api.html($api.byId('mobileId'), ret.mobile);
	}

	//$api.html($api.byId('birthdayId'), global.toDateString(ret.birthday));
	if(ret.birthday){
		$api.html($api.byId('birthdayId'), global.formatDate(ret.birthday, 'yyyy-MM'));
		birthday = global.formatDate(ret.birthday, 'yyyy-MM-dd');
	}

	if(ret.regionName){
		$api.html($api.byId('cityId'), ret.provinceName+'，'+ret.regionName);
	}

	showInterest();

	if(ret.introduction){
		var word = 140 - ret.introduction.length;
		$api.html($api.byId('content'), ret.introduction);
		$api.html($api.byId('word'), word);
	}
}

function showInterest(){

	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/member/detail/interest',
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
		if (ret) {
			var list = ret;
			var str='' ;
			if(list && list.length >=2){
				str = '<span class="my-label">'+list[0].interestName + '</span><span class="my-label">' + list[1].interestName + '</span>';
				if(list.length >2){
					str += '<span class="my-slh">...</span>';
				}
	
			}else{
				if(list && list.length==1){
					str = '<span class="my-label">'+list[0].interestName + '</span>' ;
				}
			}
	
			var ids = [];
	
			for (var i = 0; i < list.length; i++) {
				ids.push(list[i].id);
			}
	
			ids = ids.join(',');
			interestsIds =ids;
	
			$api.html($api.byId('interestId'), str);

		}
	});

}

//选择的兴趣
function showInterestByChoice(names){
	var str ='';
	if(names){
		var names_ = names.split(',');
		if(names_.length >=2){
			str = '<span class="my-label">'+names_[0] + '</span><span class="my-label">' + names_[1] + '</span>';

			if(names_.length >2){
				str += '<span class="my-slh">...</span>';
			}
		}else{
			str = '<span class="my-label">'+names_[0] + '</span>' ;
		}
	}
	$api.html($api.byId('interestId'), str);
}

/**
 * 更换头像
 */
function changeIcon(){
    api.actionSheet({
        cancelTitle : '取消',
            style:{
                itemNormalColor:'#ffffff', 
                itemPressColor:'#ffffff', 
                fontNormalColor:'#fc531f',
                fontPressColor:'#fc531f',
                titleFontColor:'#ececec'
            },
            buttons : ['拍照','从手机相册选择']
        }, function(ret, err) {
            if (ret) {
            	if(ret.buttonIndex ==3){//取消
            		// do nothing
            	}else{
	            	var sourceType ='library';
	                if (ret.buttonIndex == 1) {
	                   sourceType ='camera';
	                }else if (ret.buttonIndex == 2) {
	                   sourceType ='library';
	                }

	                api.getPicture({
						sourceType : sourceType,
						encodingType : 'jpg',
						mediaValue : 'pic',
						destinationType : 'url',
						allowEdit : true,
						quality : 90
					}, function(ret, err) {
						if (ret) {
							if (ret.data) {
								headIconPath = ret.data;
								$api.attr($api.byId('headIconId'), 'src', headIconPath);
							}
						} else {
							//global.setToast('读取图片异常');
						}
					});
           	 }
            }
        });
}

function hidenSoftInput(){
	document.getElementById("nickNameId").blur();
    document.getElementById("content").blur();
}
/**
 * 选择性别
 */
function changeSex(){
	   // 使用模块弹出键盘
    //var softInput = api.require('softInputMgr');

    // 将相应的输入框获取焦点
    //softInput.toggleKeyboard();

    hidenSoftInput();

    api.actionSheet({
        cancelTitle : '取 消',
            style:{
            	itemNormalColor:'#ffffff', 
                itemPressColor:'#ffffff', 
                fontNormalColor:'#fc531f',
                fontPressColor:'#fc531f',
                titleFontColor:'#ececec'
            },
            buttons : ['男','女']
        }, function(ret, err) {
            if (ret) {
                if (ret.buttonIndex == 1) {
                    sex = 1;
                    $api.html($api.byId('sexId'), '男');
                }else if(ret.buttonIndex == 2) {
                    sex = 0;
                   	$api.html($api.byId('sexId'), '女');
                }
            }
        });
}

/**
 * 选择城市
 */
function choiceCity() {
	hidenSoftInput();

	var UIActionSelector = api.require('UIActionSelector');

	UIActionSelector.open({
	    datas: 'widget://res/UICityList.json',
	    layout: {
	        row: 5,
	        col: 2,
	        height: 30,
	        size: 12,
	        sizeActive: 14,
	        rowSpacing: 6,
	        colSpacing: 10,
	        maskBg: 'rgba(0,0,0,0.6)',
	        bg: '#fff',
	        color: '#999',
	        colorActive: '#333',
	        colorSelected: '#333'
	    },
	    animation: true,
	    cancel: {
	        text: '取消',
	        size: 12,
	        w: 90,
	        h: 35,
	        bg: '#f7f7f7',
	        bgActive: '#f7f7f7',
	        color: '#fc531f',
	        colorActive: '#fc531f'
	    },
	    ok: {
	        text: '完成',
	        size: 12,
	        w: 90,
	        h: 35,
            bg: '#f7f7f7',
	        bgActive: '#f7f7f7',
	        color: '#fc531f',
	        colorActive: '#fc531f'
	    },
	    title: {
	        text: '选择地点',
	        size: 15,
	        h: 42,
	        bg: '#f7f7f7',
	        color: '#333'
	    },
	    fixedOn: api.frameName
	}, function(ret, err) {
	    if (ret) {
	    	if(ret.eventType=='ok'){
	       		areaId = ret.selectedInfo[1].c_id;
	       		cityActives = ret.selectedInfo[1].c_no;
	       		provinceActives = ret.selectedInfo[0].p_no;
				$api.html($api.byId('cityId'), ret.level1+'，'+ret.level2);
	        }
	    }
	});

	UIActionSelector.setActive({
   		 actives: [provinceActives,cityActives]
	});

}

/**
 * 出生年月
 */
function editBirthday() {
	hidenSoftInput();

	if(birthday === undefined){
		birthday = global.formatDate(new Date(), 'yyyy-MM-dd hh:mm');
	}
	
	api.openPicker({
		type : 'date',
		//date: $api.html(global.formatDate($api.byId('birthdayId'), 'yyyy-MM')),
		date: birthday,
		title : '选择出生年月'
	}, function(ret, err) {
		if (ret) {
			var tempDay = ret.year + '-' + ret.month + '-' + ret.day;

			if(global.compareDateTime( ret.year + '/' + ret.month + '/' + ret.day) ==1){
				global.setToast('请选择正确的出生年月');

				return ;
			}

			$api.html($api.byId('birthdayId'), ret.year + '-' + ret.month);

			birthday = tempDay ;
		}
	});
}

/**
 *设置新手机号
 */
function changeMobile(){
	var params = { "page" : "../my/mobile_set", "title" : "绑定新手机号", "mobile" :mobile };
	api.openWin({
		name : 'bingdingMobileWin',
		url : '../common/common_win.html',
		pageParam : params
	});
}

/**
 *设置兴趣爱好
 */
function changeTag(){
	var params = { "page" : "../entrance/interest" ,"title" : "你是怎样的一个人？", "src":"detail"};
	api.openWin({
		name : interestWin,
		url :  '../entrance/interest.html',
		pageParam : params
	});
}

/**
 *保存
 */
function save(){
	var nickName = $api.val($api.byId('nickNameId'));
	var content = $api.val($api.byId('content'));
	api.showProgress({
		title: '数据保存中...',
		modal: false
    });
	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/member/update',
		headers : global.getRequestToken(),
		timeout : 100,
		data : {
			values : {
				'headIconPath' : headIconPath,
				'nickName' : nickName,
				'sex' : sex,
				'mobile' : mobile,
				'birthday' : birthday,
				'areaId' : areaId,
				'provinceActives' : provinceActives,
				'cityActives' : cityActives,
				'interestsIds' : interestsIds,
				'content' : content
			},
			files : {
					file : headIconPath
				}
		}
	}, function(ret, err) {
		api.hideProgress();
		if (ret) {
			if (ret.success) {
				$api.rmStorage("persinDataFrame");

				if(nickName){
					global.setUserName(nickName);
				}
				if(ret.obj){
					global.setHeadIcon(ret.obj);
				}

	            api.sendEvent({
	                 name:'modifyUserInfo'
                });
			} else {
				global.setToast(ret.message);
			}
		} else {
			global.setErrorToast();
		}
	});
}
