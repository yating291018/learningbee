 
    testreport();
    function  testreport(){
        var testhtml="";
        getOpenid(window.location.href,function(openid){
                var timer=null;
                clearTimeout(timer);
                timer=setTimeout(function(){
                    $.post(requestApi+"testingReport",{"openId":openid}).done(data=>{
                        if(data.errCode=="00"){
                            console.log(data.report)
                            testhtml=template("testreport",data.report);
                            $("body").html(testhtml);
                        //未绑定
                        }else if(data.errCode=="10001"){
                            window.location.href="../pages/register.html";
                        //未测试
                        }else if(data.errCode=="10004"){
                            window.location.href="../pages/userinfo.html";
                        }
                    }).fail(error=>{
                        console.log(error);
                    })
                },200)
        })
    }