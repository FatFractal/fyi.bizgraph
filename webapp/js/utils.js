/* constants */
var MSG_TYPE_SUCCESS = "success";
var MSG_TYPE_WARN = "warn";
var MSG_TYPE_ERROR = "error";

var UNIT_MB         = "MB";
var UNIT_GB         = "GB";
var UNIT_HOURS      = "hour";
var UNIT_MONTH      = "month";
var UNIT_FFVS       = "ffvs";
var UNIT_DOLLARS    = "dollar";

var TYPE_APPLICATION    = "application";
var TYPE_DOMAIN         = "domain";
var TYPE_SSL_CERT       = "sslCert";
var TYPE_DATABASE       = "database";
var TYPE_BLOB           = "blobstore";
var TYPE_BLOB_FILES     = "blobstoreFiles";
var TYPE_BACKUP         = "backup";
var TYPE_BACKUP_FILES   = "backupFile";
var TYPE_FFVS           = "ffvs";
var TYPE_FFVSHOUR       = "ffvsHour";
var TYPE_BANDWIDTH      = "bandwidth";
var TYPE_API            = "api";
var TYPE_REQUESTS       = "requests";
var TYPE_RESPONSES      = "responses";
var TYPE_BANDWIDTH_IN   = "bandwidthIn";
var TYPE_AVG_RSP_TIME   = "avgResponseTime";
var TYPE_DATABASE_FILES = "databaseFiles";
var TYPE_CPU            = "cpu";
var TYPE_PRO_MONITOR    = "proMonitor";
var TYPE_PRO_ANALYTICS  = "proAnalytics";

function htmlInfo(html) {
    return '<span class="text-info">' + html + '</span>';
}

function htmlSuccess(html) {
    return '<span class="text-success">' + html + '</span>';
}

function htmlError(html) {
    return '<span class="text-error">' + html + '</span>';
}

function bytesToGB(bytes) {
    return bytes * 1e-9;
}

function gbToBytes(gb) {
    return gb * 1e9;
}

function bytesToMB(bytes) {
    return bytes * 1e-6;
}

function mbToBytes(mb) {
    return mb * 1e6;
}

/**
 * Returns an element 'el' of 'array' for which 'el.type == type'
 */
function elementWithType(array, type) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].type === type) {
            return array[i];
        }
    }
    return undefined;
}

function getMetaData(el) {
    var xmlHTTP;
    try{
        xmlHTTP = new XMLHttpRequest();
    } catch (e){
        // Internet Explorer Browsers
        try{
            xmlHTTP = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try{
                xmlHTTP = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
                alert("A browser that support AJAX requests is required!");
                return false;
            }
        }
    }

    // TODO: $http-ify this
    xmlHTTP.open("GET", "ff/metadata", true);
    xmlHTTP.setRequestHeader("Content-type","application/json");
    xmlHTTP.setRequestHeader("Data-type","application/json");
    //xmlHTTP.setRequestHeader("Content-length", data.length);
    //xmlHTTP.setRequestHeader("Connection", "close");
    xmlHTTP.send({});
    xmlHTTP.onreadystatechange = function(){
        if(xmlHTTP.readyState == 4) {
            //console.log("xmlHTTP.status: " + xmlHTTP.status + ", xmlHTTP.readyState: " + xmlHTTP.readyState + ", xmlHTTP.responseText: " + xmlHTTP.responseText);
            if(xmlHTTP.status == 200 || xmlHTTP.status == 201) {
                //console.log("xmlHTTP.status: " + xmlHTTP.status);
                //console.log("xmlHTTP.readyState: " + xmlHTTP.readyState);
                //console.log("xmlHTTP.responseText: " + xmlHTTP.responseText);
                var response = JSON.parse(xmlHTTP.responseText);
                el.innerHTML = js_beautify(xmlHTTP.responseText, {
                		'indent_size': 2,
                		'indent_char': '&nbsp;',
                		'linefeed_char': '<br>'
                });
                //alert(response.statusMessage);
            }
            else {
                var response = {statusMessage:"No statusMessage received from server"};
                if (xmlHTTP.responseText) response = JSON.parse(xmlHTTP.responseText);
                alert("Error "+ xmlHTTP.status + ": " + response.statusMessage);
            }
        } else {
            //console.log("xmlHTTP.status: " + xmlHTTP.status + ", xmlHTTP.readyState: " + xmlHTTP.readyState + ", xmlHTTP.responseText: " + xmlHTTP.responseText);
        }
    }
}

/******** legacy ********/

var G_DEBUG = true;
var G_ALI = "imgAjaxLoader";

function stringToFunction(strFun, strParam) {
    //Create the function call from function name and parameter.
    var funcCall = strFun + "('" + strParam + "');";
    //Call the function
    var ret = eval(funcCall);
}

function isEmpty(object) {
    for(var i in object) {
    return false; 
    }
    return true; 
}

function isNotEmpty(object) {
    for(var i in object) {
    return true; 
    }
    return false; 
}

function testPassword(pw) {
    var len = pw.length;
    if(len < 8) return false;
    if(len > 50) return false;
    if(pw.replace(/[a-z]/,'').length > len - 1) return false;
    if(pw.replace(/[A-Z]/,'').length > len - 1) return false;
    if(pw.replace(/[0-9]/,'').length > len - 1) return false;
    return true;
}

// error
function error(container, errorText) {
   var spanElement = new Element('p');
   var containerElement = $(container);
   spanElement.addClass('error');
   spanElement.set('text', "  Error:  " + errorText);
   spanElement.injectInside(containerElement); 
}

// browser id
var G_IS_OPERA = navigator.userAgent.indexOf("Opera") > -1;
var G_IS_IE = navigator.userAgent.indexOf("MSIE") > 1 && !G_IS_OPERA;
var G_IS_MOZ = navigator.userAgent.indexOf("Mozilla/5.") == 0 && !G_IS_OPERA;

function browserSizer() {
var winW = 630, winH = 460;
if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
}
return {width:winW, height:winH};
}

function EditButton() {
   var dashboardButtonA = new Element('a', {'class':'uiHeaderActions rfloat uiButton'});
   var dashboardButtonI = new Element('i', {'class':'mrs img sp_3sehve sx_4d05dc'});
   var dashboardButtonSpan = new Element('span', {'class':'uiButtonText','html':C_EDIT});
   dashboardButtonI.injectInside(dashboardButtonA);
   dashboardButtonSpan.injectInside(dashboardButtonA);
   return dashboardButtonA;
}
   
function CancelButton() {
   var buttonLabel = new Element('label', {'class':'submitBtn  uiButton'});
   var buttonInput = new Element('input', {'type':'submit','value':C_CANCEL,'name':C_CANCEL});
   buttonInput.injectInside(buttonLabel);
   return buttonLabel;
}

function CloseButton() {
   var buttonLabel = new Element('label', {'class':'submitBtn  uiButton'});
   var buttonInput = new Element('input', {'type':'submit','value':C_CLOSE,'name':C_CLOSE});
   buttonInput.injectInside(buttonLabel);
   return buttonLabel;
}

function SubmitButton() {
   var buttonLabel = new Element('label', {'class':'submitBtn  uiButton uiButtonConfirm'});
   var buttonInput = new Element('input', {'type':'submit','value':C_SUBMIT,'name':C_SUBMIT});
   buttonInput.injectInside(buttonLabel);
   return buttonLabel;
}
   
function DeleteButton() {
   var buttonLabel = new Element('label', {'class':'submitBtn  uiButton uiButtonConfirm'});
   var buttonInput = new Element('input', {'type':'submit','value':C_DELETE,'name':C_DELETE});
   buttonInput.injectInside(buttonLabel);
   return buttonLabel;
}
   
function BlueButton(label) {
   var buttonLabel = new Element('label', {'class':'submitBtn  uiButton uiButtonConfirm'});
   var buttonInput = new Element('input', {'type':'submit','value':label,'name':label});
   buttonInput.injectInside(buttonLabel);
   return buttonLabel;
}
   
function WhiteButton(label) {
   var buttonLabel = new Element('label', {'class':'submitBtn  uiButton'});
   var buttonInput = new Element('input', {'type':'submit','value':label,'name':label});
   buttonInput.injectInside(buttonLabel);
   return buttonLabel;
}

function CheckElement() {
   var checkDiv = new Element('div', {'class':'checkDiv'});
   return checkDiv;
}

function AutoResizeTextArea(rows, columns) {
   var t = new Element('textarea', {'type':'text','cols':columns,'rows':rows,'class':'textBox'});
   if(G_DEBUG) console.log("AutoResizeTextArea columns: " + t.cols);
   
   t.addEvent('keyup',function() {
      resize(t);
   });
   t.addEvent('mouseup',function() {
      resize(t);
   });
   function resize() {
      if ( !t.initialRows ) t.initialRows = t.rows;
      a = t.value.split('\n');
      b=0;
      for (x=0; x < a.length; x++) {
         if (a[x].length >= t.cols) b+= Math.floor(a[x].length / t.cols);
      }
      b += a.length;
      //if (G_IS_OPERA) b += 2;
       if (b > t.rows || b < t.rows) t.rows = (b < t.initialRows ? t.initialRows : b);
   }
   return t;
}

function FileUploader() {
   // constants
   var MAX_FILE_SIZE = 300000;
   var CONTAINER_DIV = "fileUploaderDiv";
   var DROP_DIV = "fileUploaderDropDiv";
   var SUBMIT_BUTTON = "fileUploaderSubmitButton";
   var PREVIEW_DIV = "fileUploaderPreviewDiv";
   var self = {
      containerDiv: null,
      containerClass: "",
      files: [],
      fileBytes: null,
      buttonMessage: 'Upload Files',
      maxFileSize: 300000,
      multiple: false,
      containerHeight: 100, // 204 + 2*padding + border-top
      previewHeight: 50,  // 20 + padding-top + border-top
      init: function() {
         if(G_DEBUG) console.log("FileUploader().init() called");
         // avoid redundant call
         // containerDiv
         this.containerDiv = document.createElement("div");
         this.containerDiv.id = CONTAINER_DIV;
         this.containerDiv.setAttribute("style", "width:100%; " +
                                                 "height:100%; " +
                                                 "margin:0; " +
                                                 "padding:0; ");
         this.containerDiv.setAttribute("class",  + this.containerClass);
         // dropDiv
         var dropDiv = document.createElement("div");
         dropDiv.id = DROP_DIV;
         dropDiv.setAttribute("style", "width:100%; " +
                                         "height: " + this.containerHeight + "px; " +
                                         "border:1px solid #3b5998; " +
                                         "margin:0; " +
                                         "padding:0; ");
         dropDiv.addEventListener('drop', drop, false);
         dropDiv.addEventListener("dragenter", dragEnter, false);
         dropDiv.addEventListener("dragexit", dragExit, false);
         dropDiv.addEventListener("dragover", dragOver, false);
         this.containerDiv.appendChild(dropDiv);
         // selectDiv
         var previewDiv = document.createElement("div");
         previewDiv.id = PREVIEW_DIV;
         previewDiv.setAttribute("style", "width:100%; " +
                                         "height: " + this.containerHeight + "px; " +
                                         "border:1px solid #3b5998; " +
                                         "margin:0; " +
                                         "padding:0; ");
         this.containerDiv.appendChild(previewDiv);

         function dragEnter(evt) {
            evt.stopPropagation();
            evt.preventDefault();
         }

         function dragExit(evt) {
            evt.stopPropagation();
            evt.preventDefault();
         }

         function dragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
         }
         
         function drop(evt) {
            if(G_DEBUG) console.log("FileUploader().init() drop event detected");
            evt.stopPropagation();
            evt.preventDefault();
            self.files = evt.dataTransfer.files;
            //handleFiles(self.files);
            //var files = evt.dataTransfer.files;
            //for (var i = 0, f; f = files.length; i++) {
            //   self.files.push(files[i]);
            //}
            if(G_DEBUG) console.log("FileUploader().init() drop event self.files now has " + self.files.length + " files.");
         }

         function handleFiles(myFiles) {
            if(G_DEBUG) console.log("FileUploader().handleFiles() called with " + myFiles.length + " files.");
            for (var i = 0, f; f = myFiles.length; i++) {
               if(G_DEBUG) console.log("FileUploader().handleFiles() processing " + myFiles[i]);
            }
         }
      },

      uploaderElement: function() {
         if(this.containerDiv) return this.containerDiv;
         else return false;
      },

      getFiles: function() {
         if(G_DEBUG) console.log("FileUploader().getFiles() called.");
         if(self.files.length > 0) {
            if(G_DEBUG) console.log("FileUploader.getFiles.found: " + self.files.length + " files.");
            return self.files;
         }
         else return null;
      },
      
      getByteArray: function(file) {
         if(G_DEBUG) console.log("FileUploader().getByteArray() called.");
         if(self.fileBytes > 0) {
            if(G_DEBUG) console.log("FileUploader.getByteArray.found byteArray with: " + self.fileBytes);
            return self.fileBytes;
         }
         else return null;
      }
   }
   return self;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//function that switches visibility of loadingImg
var showLoading = function(show){
   var i = $(G_ALI);
   if(i == null) {
      var b = $(G_BC);
      i = new Element("img", {"id":G_ALI,"class":G_ALI,"src":"common/asset/ajax-loader.gif"});
      i.injectInside(b);
   }
   if(show){
      i.style.display = 'block';
   } else {
      i.style.display = 'none';
   }
};

var G_LOG_DOMAIN = null;
var G_LOG_CONTEXT = null;
var G_LOG_OFFSET = "0";
var G_LOG_LEVEL = "ALL";

function LogData(data) {
   if(data) {
      this.messages = data.messages;
      this.errorMessage = data.errorMessage;
      this.status = data.status;
      this.eof = data.eof;
      this.lastOffset = data.lastOffset;
      this.logFile = data.logFile;
   } else {
      this.messages = [];
      this.errorMessage = null;
      this.status = null;
      this.eof = null;
      this.lastOffset = null;
      this.logFile = null;
   }
   return this;
}

var G_LOG_TIMER;
var G_LOGGER = null;

function getAppLog(baseUrl, domain, context, logOffset, logLevel, $http) {
   clearTimeout(G_LOG_TIMER);
   if(!G_LOGGER) G_LOGGER = new Logger();
   G_LOGGER.clear();
   G_LOGGER.show();
   if(domain) G_LOG_DOMAIN = domain;
   if(context) G_LOG_CONTEXT = context;
   if(logOffset) G_LOG_OFFSET = logOffset;
   if(logLevel) G_LOG_LEVEL = logLevel;
   
   this.getData = function() {
      var url = baseUrl + "/ff/applicationGetLogsAction/?domain="+G_LOG_DOMAIN+"&context="+G_LOG_CONTEXT+"&offset="+G_LOG_OFFSET+"&level="+G_LOG_LEVEL;

       $http.get(url)
           .success(function(data, status, headers, config){
               if(data) var ld = new LogData(data);
               G_LOG_OFFSET = response.lastOffset;// is a string
               if(!G_LOGGER) G_LOGGER = new Logger();
               if(ld.messages.length > 0) {
                   for (var i = 0; i < ld.messages.length; i++) {
                       G_LOGGER.logMessage(ld.messages[i]);
                   }
               } else {
                   //G_LOGGER.logMessage("No " + G_LOG_LEVEL + " messages found");
               }
               G_LOG_TIMER = setTimeout("this.getData();", 60000);
           })
           .error(function(data, status, headers, config) {
               console.error("utils.js GetAppLog " + status + ", " + data);
           });
/*
      var jsonRequest = new Request.JSON({
         url: url,
         method: 'get',
         onSuccess: function(response){
            if(response) var ld = new LogData(response);
            G_LOG_OFFSET = response.lastOffset;// is a string
            if(!G_LOGGER) G_LOGGER = new Logger();
            if(ld.messages.length > 0) {
               for (var i = 0; i < ld.messages.length; i++) {
               G_LOGGER.logMessage(ld.messages[i]);
               }
            } else {
               //G_LOGGER.logMessage("No " + G_LOG_LEVEL + " messages found");
            }
            G_LOG_TIMER = setTimeout("this.getData();", 60000);
         },
         onFailure: function(xhr) {
            console.error("utils.js GetAppLog " + xhr.status + ", " + xhr.responseText);
         }
      }).send();
*/
   };
   this.getData();
}

function Logger() {
   var CONTAINER_DIV = "loggerContainer";
   var LOG_DIV = "logger";
   var TAB_DIV = "loggerTab";
   var FILTER_TAB_DIV = "filterTab";
   var self = {
      // properties
      containerDiv: null,
      tabDiv: null,
      logDiv: null,
      visible: false,
      logHeight: 415, // 204 + 2*padding + border-top
      tabHeight: 26,  // 20 + padding-top + border-top
      // for animation
      animId: null,
      animTime: 0,
      animDuration: 200,  // ms
      animFrameTime: 16,  // ms
      scrolling: false,
      // create a div for log and attach it to document
      init: function() {
         // avoid redundant call
         if(this.containerDiv)
            return true;

         // constants

         // create logger DOM element
         var containerDiv = document.getElementById(CONTAINER_DIV);
         if(!this.containerDiv) {
            if(G_DEBUG) console.log("Logger found containerDiv == null, adding  containerDiv");
            // container
            this.containerDiv = document.createElement("div");
            this.containerDiv.id = CONTAINER_DIV;
            this.containerDiv.setAttribute("style", "width:100%; " +
                                           "height: " + this.logHeight + "px; " +
                                           "margin:0; " +
                                           "padding:0; " +
                                           "position:fixed; " +
                                           "left:0; ");
            //this.containerDiv.style.bottom = "" + -this.logHeight + "px";   // hide it initially

            // tab
            this.tabDiv = document.createElement("div");
            this.tabDiv.id = TAB_DIV;
            this.tabDiv.appendChild(document.createTextNode("LOG"));
            cssHeight = "height:" + (this.tabHeight - 6) + "px; ";        // subtract padding-top and border-top
            this.tabDiv.setAttribute("style", "width:60px; " + cssHeight +
                                     "overflow:hidden; " +
                                     "font:bold 12px verdana,helvetica,sans-serif;" +
                                     "color:#fff; " +
                                     "position:absolute; " +
                                     "left:20px; " +
                                     "top:" + -this.tabHeight + "px; " +
                                     "margin:0; padding:5px 0 0 0; " +
                                     "text-align:center; " +
                                     "border:1px solid #aaa; " +
                                     "border-bottom:none; " +
                                     "background:#333; " +
                                     "background:rgba(0,0,0,0.8); " +
                                     "-webkit-border-top-right-radius:10px; " +
                                     "-webkit-border-top-left-radius:10px; " +
                                     "-khtml-border-radius-topright:10px; " +
                                     "-khtml-border-radius-topleft:10px; " +
                                     "-moz-border-radius-topright:10px; " +
                                     "-moz-border-radius-topleft:10px; " +
                                     "border-top-right-radius:10px; " +
                                     "border-top-left-radius:10px; ");
            // add mouse event handlers
            this.tabDiv.onmouseover = function() {
               this.style.cursor = "pointer";
               this.style.textShadow = "0 0 1px #fff, 0 0 2px #0f0, 0 0 6px #0f0";
            };
            this.tabDiv.onmouseout = function() {
               this.style.cursor = "auto";
               this.style.textShadow = "none";
            };
            this.tabDiv.onclick = function() {
               if(self.visible)
                  self.hide();
               else
                  self.show();
            };

            // filterTab
            this.filterTabDiv = document.createElement("div");
            this.filterTabDiv.id = FILTER_TAB_DIV;
            this.filterTabDiv.appendChild(document.createTextNode("FILTER"));
            cssHeight = "height:" + (this.tabHeight - 6) + "px; ";        // subtract padding-top and border-top
            this.filterTabDiv.setAttribute("style", "width:60px; " + cssHeight +
                                     "overflow:hidden; " +
                                     "font:bold 12px verdana,helvetica,sans-serif;" +
                                     "color:#fff; " +
                                     "position:absolute; " +
                                     "left:85px; " +
                                     "top:" + -this.tabHeight + "px; " +
                                     "margin:0; padding:5px 0 0 0; " +
                                     "text-align:center; " +
                                     "border:1px solid #aaa; " +
                                     "border-bottom:none; " +
                                     "background:#333; " +
                                     "background:rgba(0,0,0,0.8); " +
                                     "-webkit-border-top-right-radius:10px; " +
                                     "-webkit-border-top-left-radius:10px; " +
                                     "-khtml-border-radius-topright:10px; " +
                                     "-khtml-border-radius-topleft:10px; " +
                                     "-moz-border-radius-topright:10px; " +
                                     "-moz-border-radius-topleft:10px; " +
                                     "border-top-right-radius:10px; " +
                                     "border-top-left-radius:10px; ");
            // add mouse event handlers
            this.filterTabDiv.onmouseover = function() {
               this.style.cursor = "pointer";
               this.style.textShadow = "0 0 1px #fff, 0 0 2px #0f0, 0 0 6px #0f0";
            };
            this.filterTabDiv.onmouseout = function() {
               this.style.cursor = "auto";
               this.style.textShadow = "none";
            };
            this.filterTabDiv.onclick = function() {
               var textNode = document.getElementById(FILTER_TAB_DIV);
               console.log("filterTabDiv.onclick received: " + textNode.innerHTML);
               if((textNode.innerHTML == "FILTER") || (textNode.innerHTML == "ALL")) {
                  textNode.innerHTML = "ERROR";
                  GetAppLog(G_LOG_DOMAIN, G_LOG_CONTEXT, "0", "ERROR");
               }
               else if(textNode.innerHTML == "ERROR") {
                  textNode.innerHTML = "WARN";
                  GetAppLog(G_LOG_DOMAIN, G_LOG_CONTEXT, "0", "WARN");
               }
               else if(textNode.innerHTML == "WARN") {
                  textNode.innerHTML = "INFO";
                  GetAppLog(G_LOG_DOMAIN, G_LOG_CONTEXT, "0", "INFO");
               }
               else if(textNode.innerHTML == "INFO") {
                  textNode.innerHTML = "ALL";
                  GetAppLog(G_LOG_DOMAIN, G_LOG_CONTEXT, "0", "ALL");
               }
            };
            
            // log message
            this.logDiv = document.createElement("div");
            this.logDiv.id = LOG_DIV;
            var cssHeight = "height:" + (this.logHeight - 11) + "px; "; // subtract paddings and border-top
            this.logDiv.setAttribute("style", "font:12px monospace; "
                                     + cssHeight +
                                     "color:#fff; " +
                                     "resize:vertical; " +
                                     "overflow-x:hidden; " +
                                     "overflow-y:scroll; " +
                                     "visibility:hidden; " +
                                     "position:relative; " +
                                     "bottom:0px; " +
                                     "margin:0px; " +
                                     "padding:5px; " +
                                     "background:#333; " +
                                     "background:rgba(0, 0, 0, 0.8); " +
                                     "border-top:1px solid #aaa; ");
            // style for log message
            var span = document.createElement("span"); // for coloring text
            span.style.color = "#afa";
            span.style.fontWeight = "bold";

            // the first message in log
            var msg = "===== Log Started at " +
                      this.getDate() + ", " + this.getTime() + ", " +
                      "=====";
            span.appendChild(document.createTextNode(msg));
            this.logDiv.appendChild(span);
            this.logDiv.appendChild(document.createElement("br"));  // blank line
            this.logDiv.appendChild(document.createElement("br"));  // blank line

            // add divs to document
            this.containerDiv.appendChild(this.tabDiv);
            this.containerDiv.appendChild(this.filterTabDiv);
            this.containerDiv.appendChild(this.logDiv);
            document.body.appendChild(this.containerDiv);

            this.logDiv.onclick = function() {
               if(G_DEBUG) console.log("logDiv onclick received - setting self.scrolling to true");
               self.scrolling = true;
            }

            //TODO - make sure and unload this event handler
/*
            window.addEvent('keydown',function(e) {
               if(e.key == 'enter') {
                  //window.removeEvents('keydown');
                  if(G_DEBUG) console.log("enter key pressed - setting self.scrolling to false");
                  self.scrolling = false;
               }
               if(e.key == 'esc') {
                  //window.removeEvents('keydown');
                  if(G_DEBUG) console.log("esc key pressed - setting self.scrolling to true");
                  self.scrolling = true;
               }
            });
*/

         }
         return this.containerDiv;
      },
      clear: function() {
         var containerDiv = document.getElementById(LOG_DIV);
         if(containerDiv) while(containerDiv.firstChild){
            containerDiv.removeChild(containerDiv.firstChild);
         }
      },
      ///////////////////////////////////////////////////////////////////////
      // print log message to logDiv
      logMessage: function(msg) {
         // check if this object is initialized
         if(!this.containerDiv) {
            var ready = this.init();
            if(!ready)
               return;
         }

         var msgDefined = true;

         // convert non-string type to string
         if(typeof msg == "undefined") {// print "undefined" if param is not defined
            msg = "undefined";
            msgDefined = false;
         }
         else if(msg === null) {// print "null" if param has null value
            msg = "null";
            msgDefined = false;
         }
         else {
            msg += ""; // for "object", "function", "boolean", "number" types
         }

         var timeSpan = document.createElement("span");  // color for time
         timeSpan.style.color = "#999";

         var timeNode = document.createTextNode(this.getTime() + " ");
         timeSpan.appendChild(timeNode);
         var msgSpan = document.createElement("span");
         if(!msgDefined)
         msgSpan.style.color = "#afa";
         var msgNode = document.createTextNode(msg);
         msgSpan.appendChild(msgNode);

         this.logDiv.appendChild(timeSpan);  // add time
         this.logDiv.appendChild(msgSpan);   // add message
         this.logDiv.appendChild(document.createElement("br"));  // add newline

         console.log("self.scrolling = " + self.scrolling);
         if(!self.scrolling) this.logDiv.scrollTop = this.logDiv.scrollHeight;  // scroll to last line
         console.log("logDiv.scrollTop = " + this.logDiv.scrollTop);
         console.log("logDiv.scrollHeight = " + this.logDiv.scrollHeight);         
         console.log("logDiv.scrollHeight - logDiv.scrollTop = " + (this.logDiv.scrollHeight - this.logDiv.scrollTop));
         if((this.logDiv.scrollHeight - this.logDiv.scrollTop) > 414) {
            console.log("logDiv.scrollHeight - logDiv.scrollTop > 414 - setting self.scrolling = true");
            self.scrolling = true;
         }
      },
      ///////////////////////////////////////////////////////////////////////
      // get time and date as string with a trailing space
      getTime: function() {
         var now = new Date();
         var hour = "0" + now.getHours();
         hour = hour.substring(hour.length-2);
         var minute = "0" + now.getMinutes();
         minute = minute.substring(minute.length-2);
         var second = "0" + now.getSeconds();
         second = second.substring(second.length-2);
         return hour + ":" + minute + ":" + second;
      },
      getDate: function() {
         var now = new Date();
         var year = "" + now.getFullYear();
         var month = "0" + (now.getMonth()+1);
         month = month.substring(month.length-2);
         var date = "0" + now.getDate();
         date = date.substring(date.length-2);
         return year + "-" + month + "-" + date;
      },
      ///////////////////////////////////////////////////////////////////////
      // slide log container up and down
      show: function() {
         if(!this.containerDiv) {
            if(!this.init())
               return;
         }

         if(this.visible)
            return;

         var textNode = document.getElementById(FILTER_TAB_DIV);

         this.logDiv.style.visibility = "visible";
         textNode.style.visibility = "visible";

         this.animTime = Date.now();
         this.animId = setInterval(slideUp,  self.animFrameTime);
         function slideUp() {
            var duration = Date.now() - self.animTime;
            if(duration >= self.animDuration) {
                self.containerDiv.style.bottom = 0;
                self.visible = true;
                clearInterval(self.animId);
                return;
            }
            var y = Math.round(-self.logHeight * (1 - 0.5 * (1 - Math.cos(Math.PI * duration / self.animDuration))));
            self.containerDiv.style.bottom = "" + y + "px";
         }
      },
      hide: function() {
         if(!this.containerDiv) {
            if(!this.init())
               return;
         }
         if(!this.visible)
            return;

         var textNode = document.getElementById(FILTER_TAB_DIV);
         textNode.style.visibility = "hidden";

         this.animTime = Date.now();
         this.animId = setInterval(slideDown,  self.animFrameTime);
         function slideDown() {
            var duration = Date.now() - self.animTime;
            if(duration >= self.animDuration) {
               self.containerDiv.style.bottom = "" + -self.logHeight + "px";
               self.logDiv.style.visibility = "hidden";
               self.visible = false;
               clearInterval(self.animId);
               return;
            }
            var y = Math.round(-self.logHeight * 0.5 * (1 - Math.cos(Math.PI * duration / self.animDuration)));
            self.containerDiv.style.bottom = "" + y + "px";
         }
      }
   };
   return self;
}

function exportMyData(baseUrl, domain, context) {
    var xmlHTTP;
    try{
        xmlHTTP = new XMLHttpRequest();
    } catch (e){
        // Internet Explorer Browsers
        try{
            xmlHTTP = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try{
                xmlHTTP = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
                alert("A browser that support AJAX requests is required!");
                return false;
            }
        }
    }

    // TODO: $http-ify this
    xmlHTTP.open("GET", baseUrl + "/ff/requestDatabaseExport?domain=" + domain + "&appName=" + context, true);
    xmlHTTP.setRequestHeader("Content-type","application/json");
    xmlHTTP.setRequestHeader("Data-type","application/json");
    //xmlHTTP.setRequestHeader("Content-length", data.length);
    //xmlHTTP.setRequestHeader("Connection", "close");
    xmlHTTP.send({});
    xmlHTTP.onreadystatechange = function(){
        if(xmlHTTP.readyState == 4) {
            //console.log("xmlHTTP.status: " + xmlHTTP.status + ", xmlHTTP.readyState: " + xmlHTTP.readyState + ", xmlHTTP.responseText: " + xmlHTTP.responseText);
            if(xmlHTTP.status == 200 || xmlHTTP.status == 201) {
                //console.log("xmlHTTP.status: " + xmlHTTP.status);
                //console.log("xmlHTTP.readyState: " + xmlHTTP.readyState);
                //console.log("xmlHTTP.responseText: " + xmlHTTP.responseText);
                var response = JSON.parse(xmlHTTP.responseText);
                alert(response.statusMessage);
            }
            else {
                var response = {statusMessage:"No statusMessage received from server"};
                if (xmlHTTP.responseText) response = JSON.parse(xmlHTTP.responseText);
                alert("Error "+ xmlHTTP.status + ": " + response.statusMessage);
            }
        } else {
            console.log("xmlHTTP.status: " + xmlHTTP.status + ", xmlHTTP.readyState: " + xmlHTTP.readyState + ", xmlHTTP.responseText: " + xmlHTTP.responseText);
        }
    }
}




