/**
 * Created by shijianan on 2016/7/6.
 */
/**
 * 是否中文
 * @param str
 * @returns {boolean}
 */
function isChineseChar(str){
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    return reg.test(str);
}

/**
 * 中文转换
 * @param obj
 */
function  getChinese(obj){
    for(var k in obj){
        if(typeof(obj[k]) == "object"){
            getChinese(obj[k]);
        }else if(typeof(obj[k]) == "string"){
            if(isChineseChar(obj[k])){
                //obj[k] = toUnicode(obj[k]);
                obj[k] = encodeURI(obj[k]);
            }
        }
    }
}

function fromQueryOrBody(req,name,isTranscoding) {
    var parmVal = req.query[name] || req.body[name];
    if(null ==parmVal ||""==parmVal ||"undefined" ==parmVal ||typeof(parmVal) == "undefined"){
        return "";
    }
    parmVal = parmVal.replace("\\\\","\\").replace("&","&amp;")
        .replace( "<","&lt;").replace( ">","&gt;")
        .replace("\r","\\r") .replace( "\n","\\n")
        .replace("\f", "\\f").replace("\b","\\b");
    if(null!=isTranscoding&&!isTranscoding){
        return parmVal;
    }
    var type =0;
    if(typeof(parmVal) == "string" &&(parmVal.indexOf("[")>=0 || parmVal.indexOf("{")>=0 )){
        type =1;
        parmVal =JSON.parse(parmVal)
    }
    //如果是中文，转码
    if(typeof(parmVal)=="object"){
        for(var k in parmVal){
            if(typeof(parmVal[k]) == "object"){
                getChinese(parmVal[k])
            }else if(typeof(parmVal[k]) == "string"){
                if(isChineseChar(parmVal[k])){
                    //parmVal[k] = toUnicode(parmVal[k]);
                    parmVal[k] = encodeURI(parmVal[k]);
                }
            }
        }
    }
    if(typeof(parmVal) == "string") {
        if (isChineseChar(parmVal)) {
            //parmVal[k] = toUnicode(parmVal[k]);
            parmVal = encodeURI(parmVal);
        }
    }

    if(type==1){
        parmVal =JSON.stringify(parmVal);
    }
    return parmVal;
}



exports.fromQueryOrBody = fromQueryOrBody