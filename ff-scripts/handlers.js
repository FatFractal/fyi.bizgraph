var ff = require("ffef/FatFractal");
var common = require('scripts/common');
var models = require('scripts/models');

exports.addLocation = function() {
    var address = ff.getEventHandlerData();
    // add the Location
    ff.addReferenceToObj("/ff/resources/Locations/" +  address.guid + "GEO", "location", address);
    ff.updateObj(address);
    if(common.debug) print("handlers.js.addAddressLocation added 'location' reference to Address " + JSON.stringify(address));    
}

exports.addQRCode = function() {
    var product = ff.getEventHandlerData();
    var qrimg = common.makeQRCode(product.sku);
    if(qrimg) {
        if(common.debug) print("handlers.js.addQRCode generated QRCode image " + qrimg.length);    
        var qrc = new models.QRCode();
        qrc = ff.createObjAtUri(qrc, "/QRCodes", "system");
        ff.saveBlob(qrc, 'image', qrimg, "image/png");                    
        ff.addReferenceToObj(qrc.ffUrl, "qrcode", product);
        ff.updateObj(product);
        if(common.debug) print("handlers.js.addQRCode added 'qrcode' reference to Product " + JSON.stringify(product));    
    } else {
        if(common.debug) print("handlers.js.addQRCode did not receive QRCode image ");    
    }
}

exports.totalOrder = function() {
    var order = ff.getEventHandlerData().parentObj;
    if(common.debug) print("models.js.totalOrder received " + JSON.stringify(order));
    var total = 0;
    var lines = ff.grabBagGetAll(order.ffUrl, "orderLines", order.createdBy);
    if(common.debug) print("models.js.totalOrder retrieved " + lines.length + " OrderLines");
    for (var i = 0; i < lines.length; i++) {
        total += lines[i].total;
    }
    if(order.total == total) {
        if(common.debug) print("models.js.totalOrder no change in total, skipping " + JSON.stringify(order));
    } else {
        order.total = total;
        ff.updateObj(order);
        if(common.debug) print("models.js.totalOrder updated order total to " + JSON.stringify(order));
    }
}