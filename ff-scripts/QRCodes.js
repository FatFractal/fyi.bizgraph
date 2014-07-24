var ff = require("ffef/FatFractal");
var hc  = require ('ringo/httpclient'); // not standardised by CommonJS yet, hence ringo prefix. see http://ringojs.org
var common = require('scripts/common');

exports.retrieve = function(paramObject) {
    if(common.debug) print("QRCodes.js.retrieve received paramObject " + paramObject);
    var requestUri = paramObject["requestUri"];
    var query = paramObject["query"];
    var guid = paramObject["guid"];

    var allObjs = [];
    try {
        var url;
        if (guid) {
            if(common.debug) print("guid is " + guid);
            var n = guid.indexOf("QRCode");
            guid = guid.substring(0, n);
            if(common.debug) print("guid is " + guid);
            url = "/Products/" + guid;
        } else {
            url = "/Products";
        }
        var allProducts = ff.getArrayFromUri(url);
        if (allProducts && allProducts.length > 0) {
            if(common.debug) print("QRCodes.js.retrieve retrieved " + allProducts.length + " Products");
            for (var i = 0; i < allProducts.length; i++) {
                var qrcode = {
                    guid:allProducts[i].guid + "QRCode",
                    createdBy:"system",
                    ffUrl:"/ff/resources/QRCodes/" +  allProducts[i].guid,
                    ffRL:"/QRCodes",
                    clazz:"QRCode"
                }
                var img = common.makeQRCode(qrcode.guid);
                if(img) {
                    // ff.saveBlob(qrcode, 'image', img, 'image/png');
                    allObjs.push(qrcode);
                }
            }
            if (query) {
                allObjs = ff.filterObjectsWithFFRQL(allObjs, query);
            }
            var uriSplit = requestUri.split("/");
            // OK We've got our initial set of data. We're going to now get from ANOTHER virtual collection, doing a simple "traversal"
            if (uriSplit.length > 2) {
                var traversal = uriSplit[2];
                if(common.debug) print ("QRCodes retrieve: found traversal : " + traversal);
                var oldObjs = allObjs;
                allObjs = [];
                var i;
                for (i = 0; i < oldObjs.length; i++) {
                    var traversalQueryUri = "/" + traversal + "/(basic_id eq '" + oldObjs[i].guid + "')";
                    if(common.debug) print ("QRCodes.js.exports.retrieve: will issue query to : " + traversalQueryUri);
                    allObjs = allObjs.concat(ff.getArrayFromUri(traversalQueryUri));
                }

                // do we have a filter for the result set from VCTraversal?
                if (uriSplit.length > 3) {
                    allObjs = ff.filterObjectsWithFFRQL(allObjs, uriSplit[3]);
                }
            }
        }
    } catch(e) {
        if(common.debug) print("QRCodes.js.exports.retrieve error: " + JSON.stringify(e));
        throw {statusCode:500,statusMessage:JSON.stringify(e)};
    }
    return allObjs;
}

exports.create = function(paramObject) {
    if(common.debug) print ("QRCodes.js.exports.create: " + JSON.stringify(paramObject));
    var newObj = paramObject["newObj"];
    throw {statusCode:405,
        statusMessage:"QRCodes.js.exports.create API does not support creating QRCodes objects."
    };
}

exports.update = function(paramObject) {
    if(common.debug) print ("QRCodes.js.exports.update: " + JSON.stringify(paramObject));
    var newObj = paramObject["newObj"];
    var oldObj = paramObject["oldObj"];
    throw {statusCode:405,
        statusMessage:"QRCodes.js.exports.update API does not support updating QRCodes objects"
    };
}

exports.delete = function(paramObject) {
    if(common.debug) print ("QRCodes.js.exports.delete: " + JSON.stringify(paramObject));
    var oldObj = paramObject["oldObj"];
    throw {statusCode:405,
        statusMessage:"QRCodes.js.exports.delete API does not support deleting QRCodes objects."
    };  
}