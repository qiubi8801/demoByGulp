/*
 * Name     : 考研通用js库 for 移动端
 * Author   : zsx
 * Email    : qiubi8801@163.com
 * Date     : 20151230
 * Version  : 1.1.0
*/
var KY = function() {
    this.version = '1.1.0';
    this.ua = navigator.userAgent.toLowerCase();
    this.regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    this.regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    this.browser = {
        is_wechat       : this.ua.match(/MicroMessenger/i) === "micromessenger" ? true : false,
        is_KaoYanClub   : this.ua.match(/KaoYanClub/i) === "kaoyanclub" ? true : false,
        is_BangXueTang  : this.ua.match(/BangXueTang/i) === "bangxuetang" ? true : false,
        is_qq           : this.ua.match(/QQ/i) === 'qq' ? true : false
    };
    this.api = 'http://bang.kaoyan.com';
};

KY.prototype = {
    // 设置cookie
    setCookie : function(name,value,hour){
        var exp  = new Date();
        var h = hour || 24; //默认过期时间24小时
        exp.setTime(exp.getTime() + h*60*60*1000);
        var path = '/';
        var domain = '.'+ this.getDomain();
        var secure = false;
        document.cookie = name + "=" + escape (value) +((exp === null) ? "" : ("; expires="+ exp.toGMTString())) + ((path === null) ? "" : ("; path=" + path)) +((domain === null) ? "" : ("; domain=" + domain)) + ((secure === true) ? "; secure" : "");
    },

    // 获取cookie
    getCookie : function(name){
       var arr = document.cookie.match(new RegExp("(^| )"+ name +"=([^;]*)(;|$)"));
        if(arr !== null){
            return (arr[2]);
        }else{
            return "";
        }
    },

    // 删除cookie
    delCookie : function(){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        document.cookie= name + '=' + cval + ';expires=' + exp.toGMTString() + '; path=/; domain=.' + this.getDomain();
    },

    //获得当前主域名
    getDomain : function(){
        var domain = document.domain;
        domain = domain.split('.');
        return domain[domain.length-2]+'.'+domain[domain.length-1];
    },

    //获取当前全部域名，包含二级域名
    getHost : function(){
        var host = window.location.host;
        return host;
    },

    //获取url参数
    getQueryString : function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    },

    // 字符串转asc
    str2asc : function(strstr){
        return ("0"+strstr.charCodeAt(0).toString(16)).slice(-2);
    },

    // asc转字符串
    asc2str : function(ascasc){
        return String.fromCharCode(ascasc);
    },

    // 秒转时钟
    sec2clock : function(seconds){
        var uSecond,uMinite,uHour;
        uSecond = Math.floor(seconds % 60);
        uMinite = Math.floor((seconds / 60) % 60);
        uHour = Math.floor((seconds / 3600) % 24);
        return _tidyTime(uHour) + ":" + _tidyTime(uMinite) + ":" + _tidyTime(uSecond);
        // 小时分钟不满10前面加0
        function _tidyTime(d){
            d = d < 10 ? '0'+d : d;
            return d;
        }
    },

    //Unix转时钟
    unix2clock : function(seconds){
        var unixTimestamp = new Date(seconds * 1000);
        return unixTimestamp.toLocaleString();
    },

    // url解码
    UrlDecode : function(str){
        var ret = "";
        for(var i = 0;i < str.length; i++){
            var chr = str.charAt(i);
            if(chr == "+"){
                ret += " ";
            }else if( chr == "%" ){
                var asc = str.substring(i + 1,i + 3);
                if(parseInt("0x"+asc) > 0x7f){
                    ret += this.asc2str(parseInt("0x" + asc + str.substring(i + 4,i + 6)));
                    i += 5;
                }else{
                    ret += this.asc2str(parseInt("0x" + asc));
                    i += 2;
                }
            }else{
                ret += chr;
            }
        }
        return ret;
    },

    // url编码
    UrlEncode : function(str){
        var ret = "";
        var strSpecial = "!\"#$%&'()*+,/:;<=>?[]^`{ | }~%";
        var tt = "";

        for(var i = 0; i < str.length; i++){
            var chr = str.charAt(i);
            var c = this.str2asc(chr);
            tt += chr+":"+c+"n";
            if(parseInt("0x"+c) > 0x7f){
                ret+="%"+c.slice(0,2)+"%"+c.slice(-2);
            }else{
                if(chr==" "){
                    ret += "+";
                }else if(strSpecial.indexOf(chr)!=-1){
                    ret += "%"+c.toString(16);
                }else{
                    ret += chr;
                }
            }
        }
        return ret;
    },

    //浮点加法运算
    FloatAdd : function(arg1, arg2){
        var r1, r2, m;
        try{
            r1 = arg1.toString().split(".")[1].length;
        }catch(e){
            r1 = 0;
        }
        try{
            r2 = arg2.toString().split(".")[1].length;
        }catch(e){
            r2 = 0;
        }
        m =  Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    },

    //浮点减法运算
    FloatSub : function (arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }catch(e){
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        }catch(e){
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        //动态控制精度长度
        n = (r1 >= r2) ? r1: r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },

    //消息提示
    msg : function(options){
        $('.ui-msg').remove();
        var defaults = {
            title : '温馨提示',
            content : '提示内容',
            btnOkText : '确定',
            //time : 2000,
            callback : function(){}
        };
        var ops = $.extend(defaults, options);
        var tempArr = [];
        tempArr.push('<div class="ui-msg">');
            tempArr.push('<div class="inner">');
                if(!ops.time && $.trim(ops.title) !== ''){
                    tempArr.push('<div class="d_hd">');
                        tempArr.push('<p>'+ ops.title +'</p>');
                    tempArr.push('</div>');
                }

                tempArr.push('<div class="d_bd">');
                    tempArr.push('<p>'+ ops.content +'</p>');
                tempArr.push('</div>');
                if(!ops.time){
                    tempArr.push('<div class="d_ft clearfix">');
                        tempArr.push('<span class="btn_ok">'+ ops.btnOkText +'</span>');
                    tempArr.push('</div>');
                }
            tempArr.push('</div>');
        tempArr.push('</div>');
        var tempHtml = tempArr.join('');
        $(tempHtml).appendTo('body').fadeIn();
        var w = $('.inner','.ui-msg').width();
        var h = $('.inner','.ui-msg').height();

        $('.inner','.ui-msg').css({
            position : 'absolute',
            width : '80%',　
            left : '50%',
            top : '50%',
            marginLeft: '-40%',
            marginTop: - h/2 + 'px'
        });

        $('.btn_ok','.ui-msg').on('click',function(){
            $('.ui-msg').fadeOut(200,function(){
                $('.ui-msg').remove();
            });
            if(typeof ops.callback == 'function'){
                ops.callback();
            }
        });

        if(ops.time && typeof ops.time == 'number'){
            setTimeout(function(){
                $('.ui-msg').fadeOut(200,function(){
                    $('.ui-msg').remove();
                    if(typeof ops.callback == 'function'){
                        ops.callback();
                    }
                });
            },ops.time);
        }
    },

    //确认框
    confirm : function(options){
        $('.ui-confirm').remove();
        var defaults = {
            title : 'Titles',
            content : 'This is the content.',
            btnCancelText : 'Cancel',
            btnOkText : 'Confirm',
            callback : function(){
                console.log('This is callback!');
            }
        };
        var ops = $.extend(defaults, options);
        var tempArr = [];
        tempArr.push('<div class="ui-confirm">');
            tempArr.push('<div class="inner">');
                tempArr.push('<div class="d_hd">');
                    tempArr.push('<p>'+ ops.title +'</p>');
                tempArr.push('</div>');
                tempArr.push('<div class="d_bd"><p>'+ ops.content +'</p></div>');
                tempArr.push('<div class="d_ft clearfix">');
                    if(ops.btnCancelText !== ''){
                        tempArr.push('<span class="btn_cancel" style="width:50%">'+ ops.btnCancelText +'</span>');
                        tempArr.push('<span class="btn_ok" style="width:50%">'+ ops.btnOkText +'</span>');
                    }else{
                        tempArr.push('<span class="btn_ok" style="width:100%">'+ ops.btnOkText +'</span>');
                    }
                tempArr.push('</div>');
            tempArr.push('</div>');
        tempArr.push('</div>');
        var tempHtml = tempArr.join('');
        $(tempHtml).appendTo('body').fadeIn();
        var w = $('.inner','.ui-confirm').width();
        var h = $('.inner','.ui-confirm').height();
        $('.inner','.ui-confirm').css({
            position : 'absolute',
            width : '80%',　
            left : '50%',
            top : '50%',
            marginLeft: '-40%',
            marginTop: - h/2 + 'px'
        });

        $('.btn_cancel','.ui-confirm').on('click',function(){
            $('.ui-confirm').fadeOut(200,function(){
                $('.ui-confirm').remove();
            });
        });

        $('.btn_ok','.ui-confirm').on('click',function(){
            $('.ui-confirm').fadeOut(200,function(){
                $('.ui-confirm').remove();
            });
            if(typeof ops.callback == 'function'){
                ops.callback();
            }
        });
    },

    //加载中
    loading : function(options){
        $('.ui-loading').remove();
        var defaults = {
            title : '',
            content : '努力加载中...',
            mask : false,
            maskColor : 'rgba(255,255,255,.4)',
            callback : function(){}
        };
        var ops = $.extend(defaults, options);
        $('<div class="ui-loading"><div class="inner"><div class="img_wrap"></div><dl><dt>'+ ops.title +'</dt><dd>'+ ops.content +'</dd></dl><div></div>').appendTo('body').fadeIn();
        var h = $('.inner','.ui-loading').height();
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        $('.inner','.ui-loading').css({
            position : 'absolute',
            top : '50%',
            marginTop:  (scrollTop - h/2) + 'px'
        });
        if(ops.mask){
            $('.ui-loading').css({
                background  : ops.maskColor,
                width       : '100%',
                height      : '100%',
                position    : 'fixed',
                left        : 0,
                top         : 0
            });
        }
    },

    //微信分享
    wxShare : function(json){

        //后端服务签名认证
        function _auth(url){
            var _url = null;
            try{
                _url = url.split("#")[0];
            }catch(e){
                _url = url;
            }

            $.ajax({
                data: {
                    'url' : encodeURIComponent(_url)
                },
                url: "http://bang.kaoyan.com/weixin/jssdk",
                type: "GET",
                jsonpCallback: "share",
                dataType: 'jsonp',
                success : function(rs){
                    //console.log(rs);
                    var data = {};
                    data = JSON.parse(rs);

                    wxconfig(data);
                }
            });
        }

        //微信配置项
        function _wxShare(json){
            wx.ready(function () {
                //1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareAppMessage({
                    title: json.title,
                    desc: json.desc,
                    link: json.link,
                    imgUrl: json.imgUrl,
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        json.success();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        json.cancel();
                    }
                });
                //2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareTimeline({
                    title: json.timelineTitle,
                    link: json.link,
                    imgUrl: json.imgUrl,
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        json.success();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        json.cancel();
                    }
                });

                //3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareQQ({
                    title: json.qqTitle,
                    desc: json.qqDesc,
                    link: json.link,
                    imgUrl: json.imgUrl,
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        json.success();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        json.cancel();
                    }
                });

                //4 监听“分享到腾讯微博”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareWeibo({
                    title: json.qqTitle, // 分享标题
                    desc: json.qqDesc, // 分享描述
                    link: json.link, // 分享链接
                    imgUrl: json.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        json.success();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        json.cancel();
                    }
                });

                //5 监听“分享到QQ空间”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareQZone({
                    title: json.qqTitle, // 分享标题
                    desc: json.qqDesc, // 分享描述
                    link: json.link, // 分享链接
                    imgUrl: json.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        json.success();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        json.cancel();
                    }
                });
            });
        }

        _auth(json.url);
        _wxShare(json);
    },

    //滑入层滑入
    popSlideIn : function(options){
        var docW = $(window).width(),
            docH = $(window).height();

        var defaults = {
            id : 'J_Pop',
            html : '',
            callback : function(){}
        };
        var ops = $.extend(defaults, options);
        $('#'+ ops.id).remove();

        $('<div id="'+ ops.id +'" class="pop">'+ ops.html +'</div>').css({
            left        : docW,
            width       : docW,
            height      : docH,
        }).appendTo('body');

        $('#'+ops.id).animate({
            translate3d : '-'+ docW +'px,0,0'
        },300,'ease-out');
        if(typeof ops.callback == 'function'){
            ops.callback();
        }
        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    },

    //滑入层滑出
    popSlideOut : function (id){
        $('#'+id).animate({
            translate3d : '0,0,0'
        },300,'ease-out',function(){
            $('#'+id).remove();
        });
    },

    //选学校
    selectSchool : function(options){
        var defaults = {
            pid : 0
        };
        var ops = $.extend(defaults, options);
        $.ajax({
            data: {
                pid : ops.pid
            },
            url: this.api + '/api/area',
            type: "GET",
            jsonpCallback: "area",
            dataType: 'jsonp',
            success : function(data){
                var oList = data.res.list;
                ky._getList({
                    pid : 0,
                    api : ops.api,
                    schType : ops.schType,
                    target : ops.target,
                    parentList : oList
                });
            }
        });
    },

    //选城市
    selectArea : function(options){
        var defaults = {
            pid : 0
        };
        var ops = $.extend(defaults, options);
        $.ajax({
            data: {
                pid : ops.pid
            },
            url: this.api + '/api/area',
            type: "GET",
            jsonpCallback: "area",
            dataType: 'jsonp',
            success : function(data){
                var oList = data.res.list;
                ky._getList({
                    pid : 0,
                    api : ops.api,
                    target : ops.target,
                    parentList : oList
                });
            }
        });
    },

    //生成地区或者学校列表
    _getList : function(options){
        var defaults = {};
        var ops = $.extend(defaults, options);
        var API_ROOT = this.api;
        var tempId = 'J_main_area_list';
        var _this = this;
        $.ajax({
            data: {
                pid : ops.pid,
                type : ops.schType
            },
            url: API_ROOT + '/api/' + ops.api ,
            type: "GET",
            jsonpCallback: 'ajax',
            dataType: 'jsonp',
            success : function(data){

                var schoolList = data.res.list.list;
                var areaList = data.res.list;

                var temp = [];
                for(var j = 0; j < ops.parentList.length; j++){
                    temp.push('<li>');
                        temp.push('<div class="oUnit">');
                            temp.push('<div class="oUnit-hd" data-value="'+ ops.parentList[j].id +'">');
                                temp.push('<i></i>');
                                temp.push('<span class="main_name">'+ ops.parentList[j].name +'</span>');
                            temp.push('</div>');
                            temp.push('<div class="oUnit-bd">');
                                temp.push('<dl>');
                                if(ops.api == 'school'){
                                    for(var m = 0; m < schoolList.length; m++){
                                        if(schoolList[m].pid == ops.parentList[j].id){
                                            temp.push('<dd data-value="'+ schoolList[m].id +'">'+ schoolList[m].name +'</dd>');
                                        }
                                    }
                                }
                                temp.push('</dl>');
                            temp.push('</div>');
                        temp.push('</div>');
                    temp.push('</li>');
                }
                var tempHtml = '<div class="main_list"><div class="inner"><div class="main_list_bd"><ul style="display:block">' + temp.join('') + '</ul></div></div></div>';
                _this.popSlideIn({
                    id : tempId,
                    html : tempHtml
                });
                var myScroll = new IScroll('.main_list', { mouseWheel: true, click: true});

                $('.main_list .oUnit-hd').on('tap',function(e){
                    var oParent = $(this).parents('li');
                    var oLiHeight = oParent.height();

                    if(oParent.is('.on')){
                        oParent.removeClass('on');
                        $('.main_list_bd').animate({
                            translate3d :  '0,0,0'
                        });
                    }else{
                        oParent.addClass('on').siblings().removeClass('on');
                        var numTop = oParent.index() * oLiHeight;
                        $('.main_list_bd').animate({
                            translate3d :  '0,-'+ numTop +'px,0'
                        },500,'ease-out');
                    }

                    if(ops.api == 'school'){
                        var myScroll = new IScroll('.main_list', { mouseWheel: true, click: true});

                        e.stopPropagation();
                        $('.main_list dd').on('tap',function(){
                            var areaid = $(this).parents('.oUnit').find('.oUnit-hd').data('value');
                            var strId = $(this).data('value');
                            var txt = $(this).text();

                            if($('span',ops.target)[0]){
                                $('span',ops.target).text(txt);
                            }
                            if($('input[type="text"]',ops.target)[0]){
                                $('input[type="text"]',ops.target).val(txt);
                            }
                            $(':hidden',ops.target).val(strId);
                            ops.target.attr('data-pid',areaid);
                            // if($('input[name="areaid"]',ops.target)[0]){
                            //     $('input[name="areaid"]',ops.target).val(areaid);
                            // }

                            ky.popSlideOut(tempId);
                        });
                    }else if(ops.api == 'area'){

                        var placeID = $(this).data('value');
                        $.ajax({
                            data : {
                                pid : placeID
                            },
                            url : API_ROOT + '/api/area',
                            type : 'GET',
                            jsonpCallback : 'citylist',
                            dataType : 'jsonp',
                            success : function(data){
                                var cityList = data.res.list;
                                var cityTemp = [];
                                for(var j = 0; j < cityList.length; j++){
                                    cityTemp.push('<dd data-value="'+ cityList[j].id +'">'+ cityList[j].name +'</dd>');
                                }
                                var tempCityHtml = cityTemp.join('');
                                $('dl',oParent).html(tempCityHtml);
                                var myScroll = new IScroll('.main_list', { mouseWheel: true, click: true});

                                e.stopPropagation();

                                $('.main_list dd').on('tap',function(){
                                    var oDl = $(this).parents('.oUnit');
                                    var cityId = $(this).data('value');
                                    var provinceId = $('.oUnit-hd',oDl).data('value');
                                    var txt_city = $(this).text();
                                    var txt_province = $('.oUnit-hd span',oDl).text();
                                    if($('span',ops.target)[0]){
                                        $('span',ops.target).text(txt_province +' '+ txt_city);
                                    }
                                    if($('input[type="text"]',ops.target)[0]){
                                        $('input[type="text"]',ops.target).val(txt_province +' '+ txt_city);
                                    }

                                    $('.provinceVal',ops.target).val(provinceId);
                                    $('.cityVal',ops.target).val(cityId);
                                    ky.popSlideOut(tempId);
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    //选专业
    selectMajor : function(options){
        var defaults = {
            pid  : 0
        };
        var ops = $.extend(defaults, options);
        var tempId = 'J_main_major_list';
        var _this = this;
        $.ajax({
            data: {
                pid : ops.pid
            },
            url: 'http://mapi.kaoyan.com/misc/major/list',
            type: "GET",
            jsonpCallback: "plist",
            dataType: 'jsonp',
            success : function(data){
                var oList = data.res.list;

                var temp1 = []; //学术硕士
                var temp2 = []; //专业硕士
                for(var j = 0; j < oList.length; j++){
                    if(oList[j].pid < 1500){
                        temp1.push('<li>');
                            temp1.push('<div class="oUnit">');
                                temp1.push('<div class="oUnit-hd" data-value="'+ oList[j].id +'">');
                                    temp1.push('<i></i>');
                                    temp1.push('<span class="main_name">'+ oList[j].name +'</span>');
                                temp1.push('</div>');
                            temp1.push('</div>');
                        temp1.push('</li>');
                    }else if(oList[j].pid > 1500){
                        temp2.push('<li>');
                            temp2.push('<div class="oUnit">');
                                temp2.push('<div class="oUnit-hd" data-value="'+ oList[j].id +'">');
                                    temp2.push('<i></i>');
                                    temp2.push('<span class="main_name">'+ oList[j].name +'</span>');
                                temp2.push('</div>');
                            temp2.push('</div>');
                        temp2.push('</li>');
                    }
                }
                var tempHtml = '<div class="main_list main_major_list"><div class="inner"><div class="main_list_bd"><ul style="display:block">' + temp1.join('') + '</ul><ul>' + temp2.join('') + '</ul></div></div><div class="main_list_hd"><ul><li class="cur">学术硕士</li><li>专业硕士</li></ul></div></div>';
                _this.popSlideIn({
                    id : tempId,
                    html : tempHtml
                });
                var myScroll = new IScroll('.main_major_list', { mouseWheel: true, click: true});

                $('.main_list_hd li','#' + tempId).on('tap',function(){
                    $(this).addClass('cur').siblings().removeClass('cur');
                    $('.main_list_bd ul','#' + tempId).eq($(this).index()).show().siblings().hide();
                });

                //to do
                $('.main_major_list .oUnit-hd').on('tap',function(){
                    var strPid = $(this).data('value');
                    var secondPopId = 'J_sub_major_list';
                    $.ajax({
                        data: {
                            pid : strPid
                        },
                        url: 'http://mapi.kaoyan.com/misc/major/list',
                        type: "GET",
                        jsonpCallback: "mlist",
                        dataType: 'jsonp',
                        success : function(data){
                            var arr_last_major_list = data.res.list;
                            var sub_major_id = [];
                            var sub_major_name = [];
                            for(var x = 0; x < arr_last_major_list.length; x++){
                                sub_major_id.push(arr_last_major_list[x].pid);
                                sub_major_name.push(arr_last_major_list[x].pname);
                            }
                            sub_major_id = _this.unique(sub_major_id);
                            sub_major_name = _this.unique(sub_major_name);

                            var tempSub = [];
                            for(var j = 0; j < sub_major_id.length; j++){
                                tempSub.push('<li>');
                                    tempSub.push('<div class="oUnit">');
                                        tempSub.push('<div class="oUnit-hd" data-value="'+ sub_major_id[j] +'">');
                                            tempSub.push('<i></i>');
                                            tempSub.push('<span class="main_name">'+ sub_major_name[j] +'</span>');
                                        tempSub.push('</div>');
                                        tempSub.push('<div class="oUnit-bd">');
                                        tempSub.push('<dl>');
                                            for(var m = 0; m < arr_last_major_list.length; m++){
                                                if(arr_last_major_list[m].pid == sub_major_id[j]){
                                                    tempSub.push('<dd data-value="'+ arr_last_major_list[m].id +'">'+ arr_last_major_list[m].name +'</dd>');
                                                }
                                            }
                                        tempSub.push('</div>');
                                    tempSub.push('</div>');
                                tempSub.push('</li>');
                            }
                            var tempSubHtml = '<div class="main_list last_major_list"><div class="inner"><div class="main_list_bd"><ul style="display:block">' + tempSub.join('') + '</ul></div></div></div>';

                            _this.popSlideIn({
                                id : secondPopId,
                                html : tempSubHtml
                            });
                            var mySubScroll = new IScroll('.last_major_list', { mouseWheel: true, click: true});

                            $('.last_major_list .oUnit-hd').on('tap',function(){
                                var oParent = $(this).parents('li');
                                if(oParent.is('.on')){
                                    oParent.removeClass('on');
                                }else{
                                    oParent.addClass('on').siblings().removeClass('on');
                                }

                                $('.last_major_list dd').on('tap',function(){
                                    var id = $(this).data('value');
                                    var txt = $(this).text();
                                    if($('span',ops.target)[0]){
                                        $('span',ops.target).text(txt);
                                    }
                                    if($('input[type="text"]',ops.target)[0]){
                                        $('input[type="text"]',ops.target).val(txt);
                                    }

                                    $(':hidden',ops.target).val(id);
                                    _this.popSlideOut(tempId);
                                    _this.popSlideOut(secondPopId);
                                });
                            });
                        }
                    });
                });
            }
        });
    },

    //数组去重
    unique : function(arr){
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) !== null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    },

    //上传预览
    uploadPreview : function(options){
        var _this = this;
        var defaults = {
            input    : $('#file_input'),
            result   : $('#result'),
            maxSize  : 100,
            callback : function(){

            }
        };
        var ops = $.extend(defaults, options);
        if(typeof FileReader === 'undefined'){
            ops.result.html('抱歉，你的浏览器不支持 FileReader');
            ops.input.prop('disabled',ture);
        }else{
            ops.input[0].addEventListener('change',function(){
                var file = this.files[0];
                if(file.type.indexOf("image") === 0) {
                    if(file.size >= ops.maxSize * 1000) {
                        _this.msg({
                            content: file.name + '图片应小于' + ops.maxSize + 'KB'
                        });
                        return false;
                    }
                }else{
                    _this.msg({
                        content: '文件"' + file.name + '"不是图片。'
                    });
                    return false;
                }
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    ops.result.attr('src',this.result);
                };
                if(typeof ops.callback == 'function'){
                    ops.callback();
                }
            },false);
        }
    },
};


var ky = new KY();

// 注册AMD模块
window.ky = ky;
if(typeof define === "function" && define.amd ){
    define("kym",['IScroll'],function(){return ky;});
}



