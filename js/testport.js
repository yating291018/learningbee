 
    testreport();
    function  testreport(){
        var testhtml="";
        getOpenid(window.location.href,function(openid){
                var timer=null;
                clearTimeout(timer);
                timer=setTimeout(function(){
                    $.post(requestApi+"testingReport",{"openId":openid}).done(data=>{
                        console.log(data.report)
                        if(data.errCode=="00"){
                            var objdata=data.report.remarks;
                            var obj=eval("("+objdata+")");
                            testhtml=template("testreport",obj);
                            $("body").html(testhtml);
                             var divDoms=$("body").find(".colorline>div");
                            divDoms.each(function(index,item){
                                $(this).css("left",0.664*index+"rem");
                            })
                            var index=enToCh(obj.recommend);
                            divDoms.eq(index).addClass("selected").siblings().removeClass("selected");
                            divDoms.eq(index).find("img:last-child").addClass("showjian").parent().siblings().find("img:last-child").removeClass("showjian");
                            $("body").on("click",".golibary",function(){
                              if(obj.gradeId && obj.serialId){
                                 sessionStorage.setItem("gradeid",obj.gradeId);
                                 sessionStorage.setItem("serialid",obj.serialId);
                                 window.location.href="../pages/library.html";
                              }else{
                                  popover("id不能为空!",1500);
                              }
                            })
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

    function enToCh(eng){
         var index=-1;
         eng=eng.toLowerCase();
         switch(eng){
            case "magenta":
                index=0;
                break;
            case "red":
                index=1;
                break;
            case "yellow":
                index=2;
                break;
            case "blue":
                index=3;
                break;
            case "green":
                index=4;
                break;
            case "orange":
                index=5;
                break;
            case "turquoise":
                index=6;
                break;
            case "purple":
                index=7;
                break;
            case "gold":
                index=8;
                break;
         }
         return index;
    }

