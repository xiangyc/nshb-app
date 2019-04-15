(function(window){
    var p = {};

    var pageSize = 10;
    var pageNo = 1;
    var pageCount = 0;
    var contentId = '';
    var templateId = '';
    var requestUrl = '';
    var requestData = '';
    var hasRows = true;
    var headerData = '{}';
	var noRecordsId = '';

    function getData(currentPage, reload){
		var uiloading = api.require('UILoading');
		uiloading.keyFrame({
			rect: {
		        w: 80,
		        h: 80
		    },
		    styles: {
		        bg: 'rgba(0,0,0,0.5)',
		        corner: 5,
		        interval: 50,
		        frame: {
		            w: 80,
		            h: 80
		        }
		    },
		    content : global.loadImage()
		}, function(ret) {
		});

        pageNo = reload ? 1 : currentPage;
        api.ajax({
            url: requestUrl + requestData,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            cache: true,
            headers: global.getRequestToken(),
            returnAll: false
        },function(ret,err){
			uiloading.closeKeyFrame();
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
              	if(reload && hasRows && ret.totalItems === 0){
	                $api.html($api.byId(contentId),  '');
	                if(noRecordsId){
	                	$api.removeCls($api.byId(noRecordsId), 'aui-hide');
	                	api.sendEvent({
		                    name: contentId
	                    });
	                }
	                return;
              	}

            	if(hasRows && ret.totalItems === 0){
					$api.removeCls($api.byId(noRecordsId), 'aui-hide');
                	return;
            	}


            	if(hasRows){
	                if(ret.totalItems % pageSize == 0){
	                	pageCount = eval(ret.totalItems / pageSize);
	                }else{
	                	pageCount = Math.ceil(eval(ret.totalItems / pageSize));
	                }

	                if(reload){
	                    $api.setStorage("currentPage", 1);
	                }
                }

                var content = $api.byId(contentId);
                var template = $api.byId(templateId).text;
                var tempFun = doT.template(template);
                var data = hasRows ? ret.items : ret;

		        if (data) {
		        
                	if(reload){
                	//	content.innerHTML = tempFun(data);
                    $api.html($api.byId(contentId),  tempFun(data));
               	    }else {
                        //添加判断，判断是否已加载
                        //代码实现……

                        //content.innerHTML = content.innerHTML + tempFun(data);
                          $api.append($api.byId(contentId), tempFun(data));
                    }
                    
                    api.sendEvent({
	                    name:contentId + '-record'
                    });
                }else{
                    content.innerHTML = '';
                }
            }
        });
    }

    p.setRequestData = function(params){
        if(params == ""){
            return;
        }

        requestData = params;
        getData(1, true);
    }

    p.init = function(pageRecord, contId, tempId, url, params, isRows, noId){
        pageSize = pageRecord < 1 ? 10 : pageRecord;
        contentId = contId;
        templateId = tempId;
        requestUrl = url;
        requestData = params;
        hasRows = isRows;
        noRecordsId = noId;
        
    	if(noRecordsId){
			$api.addCls($api.byId(noRecordsId), 'aui-hide');
		}
        getData(1, true);
    }

    p.scrollRefresh = function(){
        var currentPage = parseInt($api.getStorage("currentPage"));
        if(noRecordsId && pageCount > 0){
			$api.addCls($api.byId(noRecordsId), 'aui-hide');
		}
		
        if(currentPage + 1 <= pageCount){
            //requestData = requestData.replace('start=' + eval((currentPage - 1) * 10), 'start=' + eval(currentPage * pageSize));
            requestData = requestData.replace('start=' + eval(currentPage - 1), 'start=' + eval(currentPage));
            currentPage = currentPage + 1;
            $api.setStorage("currentPage", currentPage);

            getData(currentPage, false);
        }
    }

    window.page = p;
})(window);
