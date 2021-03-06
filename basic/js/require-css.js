define(function() {
    if (typeof window == "undefined") return {
        load: function(n, r, load) {
            load()
        }
    };
    var head = document.getElementsByTagName("head")[0];
    var engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)/) || 0;
    var useImportLoad = false;
    var useOnload = true;
    if (engine[1] || engine[7]) useImportLoad = parseInt(engine[1]) < 6 || parseInt(engine[7]) <= 9;
    else if (engine[2]) useOnload = false;
    else if (engine[4]) useImportLoad = parseInt(engine[4]) < 18;
    var cssAPI = {};
    cssAPI.pluginBuilder = "./css-builder";
    var curStyle;

    var __loadSrc__ = true;
    if(window.__qRequire__ && window.__qRequire__.version ){__loadSrc__=false;}
    if(!__loadSrc__ && window.location.href.indexOf('__qJSDebug__=true') != -1){__qJSDebug__=true; }
    function getqUrl (aUrl,moduleName) {
        if(__loadSrc__){
            if(moduleName.indexOf('common')==0 || moduleName.indexOf('project')==0 ){
                var index = aUrl.lastIndexOf('/')+1;
                aUrl = aUrl.substr(0,index) + 'src/' +  aUrl.substr(index) ;
                index=null;
            }
        }else{
            aUrl += ('?v=' + window.__qRequire__.version );
        }
        return aUrl;
    }


    var createStyle = function() {
        curStyle = document.createElement("style");
        head.appendChild(curStyle)
    };
    var importLoad = function(url, callback,moduleName) {
        url = getqUrl(url,moduleName);
        createStyle();
        var curSheet = curStyle.styleSheet || curStyle.sheet;
        if (curSheet && curSheet.addImport) {
            curSheet.addImport(url);
            curStyle.onload = callback
        } else {
            curStyle.textContent = '@import "' + url + '";';
            var loadInterval = setInterval(function() {
                try {
                    curStyle.sheet.cssRules;
                    clearInterval(loadInterval);
                    callback()
                } catch (e) {}
            }, 10)
        }
    };
    var linkLoad = function(url, callback,moduleName) {
        url = getqUrl(url,moduleName);
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        if (useOnload) link.onload = function() {
            link.onload = function() {};
            setTimeout(callback, 7)
        };
        else var loadInterval = setInterval(function() {
            for (var i = 0; i < document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                if (sheet.href == link.href) {
                    clearInterval(loadInterval);
                    return callback()
                }
            }
        }, 10);
        link.href = url;
        head.appendChild(link)
    };
    cssAPI.normalize = function(name, normalize) {
        if (name.substr(name.length - 4, 4) == ".css") name = name.substr(0, name.length - 4);
        return normalize(name)
    };
    cssAPI.load = function(cssId, req, load, config) {
        (useImportLoad ? importLoad : linkLoad)(req.toUrl(cssId + ".css"), load,cssId)
    };
    return cssAPI
});