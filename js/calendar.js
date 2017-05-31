    var weeks=["一","二","三","四","五","六","七","八","九","十","十一","十二"];
    var monthEn=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    $(function(){
         calendarCourse();
         judgeDevice();
         $(window).resize(judgeDevice);
    })
    //操作日历
    function  calendarCourse(){
                var date=new Date();
                var currentYear=date.getFullYear();
                var currentMonth=date.getMonth()+1;
                $(".month").text(weeks[getMonthIndex($(".month"))]);
                $(".year").text(currentYear);
                dayselect();
                calendar(currentYear,currentMonth);
                function calendar(year,month){
                        //一个月的总天数
                        var days=getMonthDays(year,month,0);
                        //这个月的第一天时星期几
                        var week=getFirstDay(year,month);
                        week=week==0 ? 7 : week;
                        //今天时第几号
                        var cdate=getCurrentDay();
                        var j=0;
                        var lihtml="";
                        //拿到上一个月的天数
                        var prevdays=getMonthDays(year,month-1,0);
                        var cmark = false;
                        var nindex = 1;
                        var pwdays = prevdays -week+2;
                        //系统时间
                        var nowmonth=new Date().getMonth();
                        var nowyear=new Date().getFullYear();
                        
                        $.post(requestApi+"classSchedule").done(function(data){
                                if(data.errCode=="00"){
                                    var classLists=data.classList;
                                    while(true){
                                                for(i=1;i<=7;i++){
                                                var mark="";
                                                var flag="";
                                                if(j==0 && i==week){//就去是寻找每个月第一天是星期几
                                                    j++;
                                                    if(j==cdate) mark = "dayselect";
                                                    if(j<cdate && month==nowmonth+1) mark="unselect";
                                                    if(nowyear==year){
                                                        if(month>nowmonth+1 && j>cdate) flag="unselect";
                                                    }else{
                                                        if(month+12>nowmonth+1 && j>cdate) flag="unselect";
                                                    }
                                                    var dj=ymd(year,month,j);
                                                    lihtml +="<li><div class='day "+mark+" "+flag+"'>\
                                                        <span>"+j+"</span>\
                                                        <div>";
                                                    classLists.forEach(function(item,index,arr){
                                                        if(item.courseDate==dj){
                                                            if(item.chargeCount==1){
                                                                lihtml+="<span class='b_flag d_left'></span>";
                                                            }else if(item.freeCount==1){
                                                                lihtml+="<span class='b_flag red d_right'></span>";
                                                            }
                                                        }
                                                    })
                                                    lihtml+="</div></div></li>";
                                                    cmark = true;
                                                }else if(j>0 && j<days){
                                                    j++;
                                                    if(j==cdate)mark = "dayselect";
                                                    if(j<cdate && month==nowmonth+1) mark="unselect";
                                                    if(nowyear==year){
                                                        if(month>nowmonth+1 && j>cdate) flag="unselect";
                                                    }else{
                                                        if(month+12>nowmonth+1 && j>cdate) flag="unselect";
                                                    }
                                                    var dj=ymd(year,month,j);
                                                    lihtml +="<li><div class='day "+mark+" "+flag+"'>\
                                                        <span>"+j+"</span>\
                                                        <div>";
                                                    classLists.forEach(function(item,index,arr){
                                                        if(item.courseDate==dj){
                                                            if(item.chargeCount==1){
                                                                lihtml+="<span class='b_flag d_left'></span>";
                                                            }else if(item.freeCount==1){
                                                                lihtml+="<span class='b_flag red d_right'></span>";
                                                            }
                                                        }
                                                    })
                                                    lihtml+="</div> </div></li>";
                                                }else{
                                                    if(!cmark){
                                                       if(pwdays>=cdate){
                                                            flag="unselect"
                                                       }else{
                                                            flag="unselect";
                                                       }
                                                        lihtml +="<li><div class='day "+mark+" "+flag+" premonth'>\
                                                                <span>"+pwdays+"</span>\
                                                                <div>";
                                                        var dj=ymd(year,month,pwdays);
                                                        classLists.forEach(function(item,index,arr){
                                                            if(item.courseDate==dj){
                                                                if(item.chargeCount==1){
                                                                    lihtml+="<span class='b_flag d_left'></span>";
                                                                }else if(item.freeCount==1){
                                                                    lihtml+="<span class='b_flag red d_right'></span>";
                                                                }
                                                            }
                                                        })
                                                        lihtml+="</div></div></li>";
                                                        pwdays++;
                                                     
                                                    }else{
                                                        if(month==nowmonth+1 && nindex<=cdate){
                                                            lihtml +="<li><div class='day "+mark+" nextmonth'>\
                                                                <span>"+nindex+"</span>\
                                                                <div>";
                                                            var dj=ymd(year,month,nindex);
                                                            classLists.forEach(function(item,index,arr){
                                                                if(item.courseDate==dj){
                                                                    if(item.chargeCount==1){
                                                                        lihtml+="<span class='b_flag d_left'></span>";
                                                                    }else if(item.freeCount==1){
                                                                        lihtml+="<span class='b_flag red d_right'></span>";
                                                                    }
                                                                }
                                                            })
                                                            lihtml+="</div></div></li>";
                                                            nindex++;
                                                        }
                                                    }
                                                }
                                            }
                                            if(j>=days)break;
                                    }
                                    $(".cen_content").html(lihtml);
                                    initCourse();
                                }
                            }).fail(function(error){
                                    console.log(error);
                            }) 
                        
                }
                var initindex=getMonthIndex($(".month"))+1;
                var previndex=getMonthIndex($(".month"))+1;
                $(".mc_arrow").on("click",function(){
                        var currentmonth=$(".month").text();
                        var currentyear=$(".year").text();
                        var weekindex=getMonthIndex($(".month"));
                        ++weekindex;
                        if(weekindex>=initindex){
                            $(this).hide().parent().find(".mc_arrow_left").show();
                        }
                        currentyear=++weekindex>12 ? ++currentyear : currentyear;
                        weekindex=--weekindex>11?0:weekindex;
                        $(".month").text(weeks[weekindex])
                        $(".year").text(currentyear)
                        calendar(currentyear,weekindex+1);
                })
                $(".mc_arrow_left").on("click",function(){
                        var currentmonth=$(".month").text();
                        var currentyear=$(".year").text();
                        var weekindex=getMonthIndex($(".month"));
                        --weekindex;
                        if(weekindex<=previndex){
                            $(this).hide().parent().find(".mc_arrow").show();
                        }
                        currentyear=weekindex<0 ? --currentyear : currentyear;
                        weekindex=weekindex<0 ? weekindex=12:weekindex;
                        $(".month").text(weeks[weekindex])
                        $(".year").text(currentyear)
                        calendar(currentyear,weekindex+1);
                })
    }
    //判断设备是ios,还是android
    function  judgeDevice() {
        let ua = navigator.userAgent.toLowerCase();
        let beeapp=$(".beeapp");
        if (/Android/i.test(ua)) {
            beeapp.attr("href","http://fusion.qq.com/cgi-bin/qzapps/unified_jump?appid=52439765");
        } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
            beeapp.attr("href"," https://www.pgyer.com/r8vd");
        }
    }