    var wait = 60;
    var requestApi="http://mptest.learningbee.net/xfwx/api/";
    $(function(){
        setRem();
        $(window).resize(setRem);
        selectQuestion();
        imgSelect();
        //获取验证码，注册登陆
        login();
        //个人信息提示
        personinfo();
    })

    //字体大小的控制
    var setRem = function(){
            var windowWidth = $(window).width();
            if(windowWidth > 750) windowWidth = 750;
            var fs = windowWidth*6.25 / 750 * 100; //1rem=100px
            $('html').css('font-size', fs + '%');
    };

    /*
    选中答案时，答案的选项高亮
    */

    var selectQuestion=function(){
        $("body").on("click",".answer p",function(){
                $(this).addClass("answerselect").siblings().removeClass("answerselect");
        })
    }


    /*
    选中答案时，答案的选项高亮
    */
    var imgSelect=function(){
        $("body").on("click",".answer div",function(){
                $(this).addClass("answerselect").siblings().removeClass("answerselect");
        })
    }

   
    /**
     * 倒计时六十秒
     * 用法:time(o)
     * @param o
     * @returns {null}
     */
    function time(o) {
            if (wait == 0) {
                o.removeAttribute("disabled");
                o.text = "重新发送";
                $(o).removeClass("disabled");
                wait = 60;
            }
            else {
                o.setAttribute("disabled", true);
                $(o).addClass("disabled");
                o.text = wait + "秒后重新获取";
                wait--;
                setTimeout(function () {
                    time(o);
                }, 1000);
            }
    }

    /**
     * 发送验证码
     * 用法:sendCode(phoneNum)
     * @param phoneNum
     * @returns {null}
     */
    function sendCode(phoneNum) {
        $.post(requestApi+"sendUserVCode",{phoneNum:phoneNum}).done(function(data){
            console.log(data);
            if(data.errCode=="1005"){
                popover(data.errMsg,1500);
            }
        }).fail(function(error){
            console.log(error)
        })
    }

    /**
     * 弹出框
     * 用法:popover()
     * @param 
     * @returns {null}
     */
    function popover(info,time){
            var alertDom=$("<div class='alert'>"+info+"</div>");
            $("body").append(alertDom);
            alertDom.animate({bottom:"20%"},300,function(){
                alertDom.fadeOut(1500,function(){
                    alertDom.css("bottom","-20%");
                })
            });
    }


    /**
     * 获取验证码，登陆
     * 用法:login()
     * @param 
     * @returns {null}
     */
    function login(){
        // 获取验证码
        $(".code").click(function () {
                var tel = $.trim($(".telcode").val());
                var telInfo=$(this).next();
                if(tel ==""){
                    telInfo.fadeIn(2000,function(){
                        telInfo.fadeOut();
                    });
                    return false;	
                }
                var regExp=new RegExp(/^1[3|4|5|7|8][0-9]\d{8}$/);
                if(!regExp.test(tel)){
                    telInfo.fadeIn(2000,function(){
                        telInfo.fadeOut();
                    });
                    return false;
                }
                if(!$(this).hasClass("disabled")){
                        time(this);	
                        sendCode(tel);
                }
        });
        //点击登陆注册
        $(".btn").click(function (e) {
                    e.preventDefault();
                    var tel =$.trim($(".telcode").val());
                    var infoTel= $(".telcode").next().next();
                    if(tel ==""){
                        infoTel.fadeIn(2000,function(){
                            infoTel.fadeOut();
                        });
                        return false;	
                    }
                    var regExp=new RegExp(/^1[3|4|5|7|8][0-9]\d{8}$/);
                    if(!regExp.test(tel)){
                        infoTel.fadeIn(2000,function(){
                            infoTel.fadeOut();
                        });
                        return false;
                    }
                    var imp =$.trim($("#import").val());
                    if(imp==""){
                        $("#import").next().fadeIn();
                        return false;
                    }
                    var timer=null;
                    clearTimeout(timer);
                    getOpenid(window.location.href,function(openid){
                            var params={
                                    "openId":openid,
                                    "phone":tel,
                                    "vcode":imp
                            }
                            timer=setTimeout(function(){
                                    $.post(requestApi+"registerBinding",params).done(function(data){
                                        data=JSON.parse(data.trim());
                                        if(data.errCode=="00"){
                                            console.log(data.errMsg)
                                            window.location.href="../pages/userinfo.html";
                                        }else{
                                            popover(data.errMsg,1500);
                                        }
                                    }).fail(function(error){
                                        popover("绑定失败!",1500);
                                    })
                            },200)
                    })
                });	
    }

    function personinfo(){
        $(".user_name").on("blur",function(){
            var namevalue=$.trim($(this).val());
            if(!namevalue){
                $(this).next().removeClass("userinfoerror");
                return;
            }else{
                $(this).next().addClass("userinfoerror");
            }
        })
        //弹窗 个人信息 性别
        $(".gender-fixed").click(function(){
            var username=$.trim($(".user_sex").val());
            if($(".personal-gender :checked").length == 0){
              if(!username){
                $(".user_sex").next().removeClass("userinfoerror");
              }
            }else{
                $(".user_sex").next().addClass("userinfoerror");
            };
            $(this).hide();
        })
        $(".age-fixed").click(function(){
            var grade=$.trim($(".user_age").val());
            if($(".personal-age :checked").length == 0){
              if(!grade){
                $(".user_age").next().removeClass("userinfoerror");
              }
            }else{
                $(".user_age").next().addClass("userinfoerror");
            };
            $(this).hide();
        })
        $(".user_sex").click(function(e){
            $(".gender-fixed").show().find(".personal-gender").show().siblings().hide();
            e.stopPropagation();
        });

        $(".user_age").click(function(e){
            $(".age-fixed").show().find(".personal-age").show().siblings().hide();
            e.stopPropagation();
        });
        $(".personal-gender li").click(function(e){
            $(".user_sex").next().addClass("userinfoerror");
            var _text = $(this).find("i").text();
            $(".personal-gender li").find("span").removeClass("radio-checked");
            $(".personal-gender li").find("input").prop("checked",false);
            $(this).find("span").addClass("radio-checked").siblings("input").prop("checked",true);
            $(".personal-fixed").hide();
            $(".user_sex").val(_text);
            e.stopPropagation();
        });
        $(".personal-age li").click(function(e){
            $(".user_age").next().addClass("userinfoerror");
            var _text = $(this).find("i").text();
            $(".personal-age li").find("span").removeClass("radio-checked");
            $(".personal-age li").find("input").prop("checked",false);
            $(this).find("span").addClass("radio-checked").siblings("input").prop("checked",true);
            $(".personal-fixed").hide();
            $(".user_age").val(_text);
            e.stopPropagation();
        });
        //开始测试
        $(".userbtn").on("click",function(){
            var  username=$.trim($(".user_name").val());
            if(!username){
                $(".user_name").next().removeClass("userinfoerror");
                return;
            }else{
                $(".user_name").next().addClass("userinfoerror");
            }
            if(!$.trim($(".user_sex").val())){
                $(".user_sex").next().removeClass("userinfoerror");
                return;
            }else{
                $(".user_sex").next().addClass("userinfoerror");
            }
            if(!$.trim($(".user_age").val())){
                $(".user_age").next().removeClass("userinfoerror");
                return;
            }else{
                $(".user_age").next().addClass("userinfoerror");
            }
            var  sex=$.trim($(".user_sex").val())=="男"?1:2;
            var  grade=$.trim($(".user_age").val());
            var  gradenum=gradeTonum(grade);
            /*========================================================================*/ 
            getOpenid(window.location.href,function(openid){
                    var timer=null;
                    clearTimeout(timer);
                    timer=setTimeout(function(){
                        $.ajax({
                            type:"post",
                            url:requestApi+"updateUserInfo",
                            data:{'openId':openid,name:username,sex:sex,grade:gradenum},
                            async:true,
                            dataType : "json",
                            success:function(data){
                                    console.log(data.errCode+"==========================userinfo")
                                    if(data.errCode=="00"){
                                        localStorage.setItem("grade",gradenum);
                                        window.location.href="../pages/testquestion.html";
                                    }else{
                                        popover("修改失败！",1500)
                                    }
                            }
                        });
                    },200)
            })
        })
    }
   
    //得到对应月份的索引
    function getMonthIndex(monthDom){
                var initmonth=monthDom.text();
                var initindex=-1;
                weeks.forEach(function(item,index){
                            if(item==initmonth){
                                initindex=index;
                            }
                })
                return initindex;
    }

    function dayselect(){
            $(".cen_content").on("click","li",function(){
                if($(this).find(".day").hasClass("unselect")){
                    return;
                }
                $(this).find("div").addClass("dayselect").parent().siblings().find("div").removeClass("dayselect");
                var text=$(this).find("span").text();
                var monthnum=0;
                if($(this).find(".day").hasClass("nextmonth")){
                    monthnum=getMonthIndex($(".month"))+2;
                }else if($(this).find(".day").hasClass("premonth")){
                    monthnum=getMonthIndex($(".month"));
                }else{
                    monthnum=getMonthIndex($(".month"))+1;
                }
                var year=$(".year").text();
                var month=getMonthIndex($(".month"))+1;
                var dj=ymd(year,monthnum,text);
                getCourseByDj(dj);
            })
    }
     //计算一个月的总天数
    function getMonthDays(year,month){
            return new Date(year,month,0).getDate();
    }
    //一个月的第一天星期几
    function getFirstDay(year,month){
        return new Date(year,month-1,1).getDay();
    }
    //得到当天是几号
    function getCurrentDay(){
        return new Date().getDate();
    }
    //凭借日期
    function ymd(year,month,day){
            month=month>9 ? month:"0"+month;
            day=day>9 ? day : "0"+day;
            return year+"-"+month+"-"+day;
    }
    //初始默认的课程
    function initCourse(){
          var day=$(".cen_content").find("li div.dayselect").find("span").text();
          var year=$(".year").text();
          var month=getMonthIndex($(".month"))+1;
          var dj=ymd(year,month,day);
          getCourseByDj(dj);
    }

    //得到日期对应的课程
    function  getCourseByDj(ymd){
        $.post(requestApi+"classScheduleInfo",{courseDate:ymd}).done(function(data){
            console.log(data)
            if(data.errCode=="00"){
                var ymd=data.courseDate.split("-");
                var month=ymd[1].substr(0,1)=="0"?ymd[1].substring(1):ymd[1];
                var jsondata={
                    month:wordToNum(month),
                    day:ymd[2],
                    classList:data.classList
                }
                var html=template("coursedesc",jsondata);
                $(".course_content").html(html);
            }
        }).fail(function(error){
            console.log(error);
        })
    }
    /*
        由文字的日期转化为数字的月份
    */
    function  wordToNum(month){
            return monthEn[month-1];
    }

    /*
        把汉字年级换成对应数据
    */
    function  gradeTonum(grade){
         var gradenum=-1;
         switch(grade){
            case "幼儿园":
                gradenum=0;
                break;
            case "一年级":
                gradenum=1;
                break;
            case "二年级":
                gradenum=2;
                break;
            case "三年级":
                gradenum=3;
                break;
            case "四年级":
                gradenum=4;
                break;
            case "五年级":
                gradenum=5;
                break;
            case "六年级":
                gradenum=6;
                break;
         }
         return gradenum;
    }

    /*
    *  获得用户的openid
    *  getOpenid
    *  
    */
   
    function getOpenid(locationurl,callback){
        // var openid=$.cookie("xfOpenId");
        var openid="oVP3EwmxhH45T9PRDCNt6R1XgiTU";
        if(!openid){
                $.post("http://mptest.learningbee.net/xfwx/requestOpenId").done(function(data){
                    if(typeof(data.openId)!='undefined' && data.openId !='' && data.openId !=null  && data.openId !='null' ){
                        openid=data.openId;
                        if(callback) callback(openid);
                    }else{
                        window.location.href="http://mptest.learningbee.net/xfwx/getOpenId2?path="+locationurl;
                    }
                })
        }else{
               if(callback) callback(openid);
        }
    }

    




    