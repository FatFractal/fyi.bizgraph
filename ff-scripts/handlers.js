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

exports.addToAdminGroup = function() {
    var newUser = ff.getEventHandlerData();
    if (common.isOnTheList(newUser.email)) {
        var sysAdminGroup = common.getSysAdminGroup();
        sysAdminGroup.addUser(newUser);
        if(common.debug) print ("handlers.js.addToAdminGroup Added " + newUser.email + " to sysAdminGroup");
    }
}

exports.grantAccessToVendor = function() {
    var order = ff.getEventHandlerData();
    if(common.debug) print ("handlers.js.grantAccessToVendor received order " + JSON.stringify(order));
    var customer = ff.getReferredObject("customer", order);
    if(common.debug) print ("handlers.js.grantAccessToVendor received customer " + JSON.stringify(customer));
    var user = ff.getReferredObject("user", customer);
    if(common.debug) print ("handlers.js.grantAccessToVendor received user " + JSON.stringify(user));
    var vendor = ff.getReferredObject("vendor", order);
    if(common.debug) print ("handlers.js.grantAccessToVendor received vendor " + JSON.stringify(vendor));
    var adminGroup = ff.getReferredObject("admins", vendor);
    if(common.debug) print ("handlers.js.grantAccessToVendor received adminGroup " + JSON.stringify(adminGroup));
    var vendorAdmins = ff.getArrayFromUri(adminGroup.ffUrl + "/users");
    if(common.debug) print ("handlers.js.grantAccessToVendor received vendorAdmins " + JSON.stringify(vendorAdmins));
    var vendorShare = ff.getReferredObject("vendorAccess", customer);
    if(common.debug) print ("handlers.js.grantAccessToVendor received vendorShare " + JSON.stringify(vendorShare));
    if(!vendorShare) {
        if(common.debug) print ("handlers.js.grantAccessToVendor missing vendorShare, creating new group");
        vendorShare = new ff.FFUserGroup(ff.createObjAtUri({createdBy:user.guid, groupName:'vendorAccess',clazz:'FFUserGroup'}, '/FFUserGroup'));
        if(common.debug) print ("handlers.js.grantAccessToVendor created vendorShare " + JSON.stringify(vendorShare));
        ff.addReferenceToObj(vendorShare.ffUrl, "vendorAccess", customer);
        ff.updateObj(customer, user.guid);
    } else {
        vendorShare = new ff.FFUserGroup(vendorShare);        
    }
    for (var i = 0; i < vendorAdmins.length; i++) {
        if(common.debug) print ("handlers.js.grantAccessToVendor adding vendorAdmin to vendorAccess group " + JSON.stringify(vendorAdmins[i]));
        vendorShare.addUser(vendorAdmins[i]);
    }    
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