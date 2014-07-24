var ff = require("ffef/FatFractal");
var common = require('scripts/common');
var models = require('scripts/models');

exports.cleanup = function() {
    common.runDDFLDropCommands();
    common.runDDFLCreateCommands();
    var r = ff.response();
    r.result = "<h1> Thanks for visiting</h1><p>We have removed all data from your API.</p>";
    r.responseCode="200";
    r.statusMessage = "extensions.js.cleanup has removed all data from your API.";
    r.mimeType = "text/html";
}

exports.populate = function() {
    var count = 0;
    count += models.createSomeMfgs();
    count += models.createSomeVendors();
    count += models.createSomeProducts();
    count += models.createSomePrices();
    count += models.createSomeAddresses();
    count += models.createSomeCustomers();
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

exports.createSomeMfgs = function() {
    var count = 0;
    count += models.createSomeMfgs();
    var r = ff.response();
    r.result = "<h1> Thanks for visiting</h1><p>We have populated "+ count + " Manufacturer objects for the tests.</p>";
    r.responseCode="200";
    r.statusMessage = "extensions.js.populate has created "+ count + " Manufacturer objects.";
    r.mimeType = "text/html";
}
