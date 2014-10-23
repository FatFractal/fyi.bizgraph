var ff = require("ffef/FatFractal");
var common = require('scripts/common');
var models = require('scripts/models');

exports.cleanup = function() {
    var dels = common.deleteSystemStuff();
    var drops = common.runDDFLDropCommands();
    var creates = common.runDDFLCreateCommands();
    var r = ff.response();
    r.result = "<h1> Thanks for visiting</h1><p>We have removed "+drops+" Collections and deleted "+dels+" objects from your API.</p>";
    r.responseCode="200";
    r.statusMessage = "extensions.js.cleanup has removed "+drops+" Collections and deleted "+dels+" objects from your API.";
    r.mimeType = "text/html";
}

exports.populate = function() {
    var count = 0;
    count += models.setUpSysAdmins();
    count += models.createSomeMfgs();
    count += models.createSomeVendors();
    count += models.createSomeProducts();
    count += models.createSomePrices();
    count += models.createSomeCustomers();
    count += models.createSomeAddresses();
    count += models.createSomeOrders();
    var r = ff.response();
    r.result = "<h1> Thanks for visiting</h1><p>We have populated "+ count + " data objects for the tests.</p>";
    r.responseCode="200";
    r.statusMessage = "extensions.js.populate has created "+ count + " data objects.";
    r.mimeType = "text/html";
}

exports.createSomeOrders = function() {
    var count = 0;
    count += models.createSomeOrders();
    var r = ff.response();
    r.result = "<h1> Thanks for visiting</h1><p>We have populated "+ count + " Order and OrderLine objects for the tests.</p>";
    r.responseCode="200";
    r.statusMessage = "extensions.js.populate has created "+ count + " Order and OrderLine objects.";
    r.mimeType = "text/html";
}

exports.createSomeProducts = function() {
    var count = 0;
    count += models.createSomeProducts();
    var r = ff.response();
    r.result = "<h1> Thanks for visiting</h1><p>We have populated "+ count + " Product and ProductImages objects for the tests.</p>";
    r.responseCode="200";
    r.statusMessage = "extensions.js.populate has created "+ count + " Product and ProductImages objects.";
    r.mimeType = "text/html";
}

exports.createSomeMfgs = function() {
    var count = 0;
    count += models.createSomeMfgs();
    var r = ff.response();
    r.result = "<h1> Thanks for visiting</h1><p>We have populated "+ count + " Manufacturer objects for the tests.</p>";
    r.responseCode="200";
    r.statusMessage = "extensions.js.populate has created "+ count + " Manufacturer objects.";
    r.mimeType = "text/html";
}

exports.updateAdminGroup = function() {
    var allUsers = ff.getArrayFromUri("/ff/resources/FFUser/");
    var sysAdminGroup = common.getSysAdminGroup();
    var admins = ff.getArrayFromUri(sysAdminGroup.ffUrl + "/users");
    for (var i = 0; i < allUsers.length; i++) {
    	if(common.isOnTheList(allUsers[i].email)) {
            var userGuid = allUsers[i].guid;
            var addThis = true;
            if(admins.length > 0) {
                for (var j = 0; j < admins.length; j++) {
                    var guid = admins[j].guid;
            	    if(guid != userGuid) addThis = false;
                }
            } 
            else sysAdminGroup.addUser(allUsers[i]);
            if(addThis) sysAdminGroup.addUser(allUsers[i]);
            print ("Added " + allUsers[i].email + " to sysAdminGroup");
        }
    }
}
