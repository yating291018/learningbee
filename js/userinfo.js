$(function(){
    getOpenid(window.location.href,function(openid){
        var timer=null;
        clearTimeout(timer);
        timer=setTimeout(function(){
            $.post(requestApi+"userInfo",{"openId":openid}).done(data=>{
                if(data.errCode=="00"){
                    var userinfo=data.wxUser;
                    $(".user_name").val(userinfo.nickName);
                    var usersex=userinfo.sex==1?"男":"女";
                    $(".personal-gender li").find("span").removeClass("radio-checked");
                    $(".personal-gender li").find("input").prop("checked",false);
                    if(usersex=="男"){
                        $(".man").addClass("radio-checked").siblings("input").prop("checked",true);
                    }else if(usersex=="女"){
                        $(".women").addClass("radio-checked").siblings("input").prop("checked",true);
                    }
                    $(".user_sex").val(usersex);
                }else{
                    popover("请填写信息!",1500);
                }
            }).fail(error=>{
                 popover("请求出错!",1500);
            })
        },200)
    });
})
