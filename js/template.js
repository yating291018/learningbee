$(function(){
     //选择答案，得到答案
    var index=0;
    var result=[];
    var temgrade=gradeToQuestion(localStorage.getItem("grade"));
    console.log(temgrade+"===============")
    switch(temgrade){
        case 1:
            questiontype=magenta;
            break;
        case 2:
            questiontype=red;
            break;
        case 3:
            questiontype=yellow;
            break;
        case 4:
            questiontype=blue;
            break;
        case 5:
            questiontype=green;
            break;
    }
    showHtml(index,questiontype);
    $("body").on("click",".nextTi",function(){
            if($(".answer").children().hasClass("answerselect")){
                    result[index]=$(".answer").children(".answerselect").index();
                    index++;
                    showHtml(index,questiontype);
            }else{
                   popover("请选择答案!",1500)
            }
    })
    $("body").on("click",".prev",function(){
            index--;
            showHtml(index,questiontype);
            var answerindex=result[index];
            $(".answer").children().eq(answerindex).addClass("answerselect");
    })
    $("body").on("click",".send",function(){
            if($(".answer").children().hasClass("answerselect")){
                    result[index]=$(".answer").children(".answerselect").index();
                    console.log(result)
                    /*========================================================================*/ 
                    var newresult=numToEn(result);
                    getOpenid(window.location.href,function(openid){
                            var data={
                                "openId":openid,
                                setsNo:temgrade,
                                grade:parseInt(localStorage.getItem("grade")),
                                result:[
                                    {answerValue:newresult[0],questionEdition:"1.0",questionNo:temgrade+"-"+1},
                                    {answerValue:newresult[1],questionEdition:"1.0",questionNo:temgrade+"-"+2},
                                    {answerValue:newresult[2],questionEdition:"1.0",questionNo:temgrade+"-"+3},
                                    {answerValue:newresult[3],questionEdition:"1.0",questionNo:temgrade+"-"+4},
                                    {answerValue:newresult[4],questionEdition:"1.0",questionNo:temgrade+"-"+5},
                                    {answerValue:newresult[5],questionEdition:"1.0",questionNo:temgrade+"-"+6},
                                    {answerValue:newresult[6],questionEdition:"1.0",questionNo:temgrade+"-"+7},
                                    {answerValue:newresult[7],questionEdition:"1.0",questionNo:temgrade+"-"+8},
                                    {answerValue:newresult[8],questionEdition:"1.0",questionNo:temgrade+"-"+9},
                                    {answerValue:newresult[9],questionEdition:"1.0",questionNo:temgrade+"-"+10}
                                ]
                            }
                            console.log(data)
                            var timer=null;
                            clearTimeout(timer);
                            timer=setTimeout(function(){
                                $.ajax({
                                    type:"POST",
                                    url:requestApi+"submitQuestion",
                                    data:{"data":JSON.stringify(data)},
                                    async:true,
                                    dataType : "json",
                                    success:function(data){
                                        if(data.errCode=="00"){
                                            window.location.href="../pages/testreport.html";
                                        }else{
                                            popover(data.errMsg,1500);
                                        }
                                    }
                                })
                            },200)
                    })
            }else{
                   popover("请选择答案!",1500);
            }
    })
})

//得到对应的题目，选择不同的模板
function showHtml(index,data){
        var type=data[index].type;
        var jsondata=data[index];
        var html1=template("template1",jsondata);
        var html2=template("template2",jsondata);
        var html3=template("template3",jsondata);
        var html4=template("template4",jsondata);
        var html5=template("template5",jsondata);
        if(type==1){
            $("body").html(html1)
        }else if(type==2){
            $("body").html(html2)
        }else if(type==3){
            $("body").html(html3)
        }else if(type==4){
            $("body").html(html4)
        }else if(type==5){
            $("body").html(html5)
        }
  }

  /*
       不同年级对应的题类型
    */
  
  function gradeToQuestion(gradenum){
        var qtype=0;
        if(gradenum==0 || gradenum==1){
            qtype=1;
        }else if(gradenum==2){
            qtype=2;
        }else if(gradenum==3){
            qtype=3;
        }else if(gradenum==4){
            qtype=4;
        }else{
            qtype=5;
        }
        return qtype;
    }

    /*
      把数组答案转换为大写英文字母
      */
    function numToEn(arr){
        var newResult=[];
        if(Array.isArray(arr)){
            arr.forEach(function(item,index,arr){
                 newResult.push(nTe(item));
            })
            return newResult;
        }
    }
    function nTe(num){
        var en="";
        switch(num){
            case 0:
                en="A";
                break;
            case 1:
                en="B";
                break;
            case 2:
                en="C";
                break;
            case 3:
                en="D";
                break;
        }
        return en;
    }

  
  