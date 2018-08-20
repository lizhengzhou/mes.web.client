// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。


(function () {
    "use strict";

    var storage = window.localStorage;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    var log = document.getElementById('log');

    function onDeviceReady() {

        // 处理 Cordova 暂停并恢复事件
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        log = document.getElementById('log');


        // TODO: Cordova 已加载。在此处执行任何需要 Cordova 的初始化。
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        var selectURL = document.getElementById('selectURL');
        var urlElement = document.getElementById('manual_url');
        var btnElement = document.getElementById('bt_ok');


        btnElement.addEventListener('click', function () {
            var showName = selectURL.options[selectURL.selectedIndex].firstChild.nodeValue;
            var showValue = selectURL.options[selectURL.selectedIndex].value;
            if (showValue == "") {
                showValue = urlElement.value;
            }
            if (showValue == "" || showValue == "http://") {
                alert('请选择地址或者手动输入地址！');
                return;
            }

            SetConfig(showValue, Redirect);
        }, false);


        GetConfig(Redirect);
    };

    function onPause() {
        // TODO: 此应用程序已挂起。在此处保存应用程序状态。
    };

    function onResume() {
        // TODO: 此应用程序已重新激活。在此处还原应用程序状态。
    };

    function Logger(log, msg) {
        log.get(0).innerHTML += "->" + msg;
    }

    function fail(evt) {
        console.log(evt.target.error.code);
        log.innerHTML += "fail-.-" + evt + evt.target + evt.target.error + evt.target.error.code;
    }

    function GetConfig(callback) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            log.innerHTML += "Read fileSystem -。-";
            fileSystem.root.getFile("app.config.txt", null, function (fileEntry) {
                log.innerHTML += "Read fileEntry -。-";
                fileEntry.file(function (file) {
                    log.innerHTML += "Read file -。-";
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        console.log("Read as data URL");
                        console.log(evt.target.result);
                        log.innerHTML += "Read as data URL：" + evt.target.result;
                        if (callback != undefined && typeof callback === "function") {
                            callback(evt.target.result);
                        }
                    };
                    reader.readAsText(file);
                    log.innerHTML += "Read readAsText -。-";
                }, fail);
            }, fail);
        }, fail);

    }

    function Redirect(url) {
        Logger($("#log"), url);
        Logger($("#log"), url.toLowerCase());
        Logger($("#log"), url.toLowerCase().indexOf("http"));
        if (url.toLowerCase().indexOf("http") == -1) return;
        //Android _self
        //IOS _blank
        cordova.InAppBrowser.open(url, "_blank", "location=no,zoom=no,fullscreen=yes,clearCache=yes,hardwareback=no");

    }

    function SetConfig(url, callback) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            log.innerHTML += "Write fileSystem-.-";
            fileSystem.root.getFile("app.config.txt", { create: true, exclusive: false }, function (fileEntry) {
                log.innerHTML += "Write fileEntry-.-";
                fileEntry.createWriter(function (writer) {
                    log.innerHTML += "Write createWriter-.-";
                    writer.onwriteend = function (evt) {
                        console.log("Write write success");
                        log.innerHTML += "Write  write success-.-";

                        if (callback != undefined && typeof callback === "function") {
                            callback(url);
                        }
                    };
                    writer.write(url);
                    log.innerHTML += "write-.-";
                }, fail);
            }, fail);
        }, fail);
    }

})();