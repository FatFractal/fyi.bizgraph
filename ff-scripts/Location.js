var ff = require("ffef/FatFractal");
var hc  = require ('ringo/httpclient'); // not standardised by CommonJS yet, hence ringo prefix. see http://ringojs.org
var common = require('scripts/common');

exports.retrieve = function(paramObject) {
    if(common.debug) print("Location.js.retrieve received paramObject " + paramObject);
    var requestUri = paramObject["requestUri"];
    var query = paramObject["query"];
    var guid = paramObject["guid"];

    var allObjs = [];
    try {
        var url;
        if (guid) {
            if(common.debug) print("guid is " + guid);
            var n = guid.indexOf("GEO");
            guid = guid.substring(0, n);
            if(common.debug) print("guid is " + guid);
            url = "/Addresses/" + guid;
        } else {
            url = "/Addresses";
        }
        var allAddresses = ff.getArrayFromUri(url);
        if (allAddresses && allAddresses.length > 0) {
            if(common.debug) print("Location.js.retrieve retrieved " + allAddresses.length + " Addresses");
            for (var i = 0; i < allAddresses.length; i++) {
                var googGeo = common.getAddressGEO(allAddresses[i]);
                if(googGeo) {
                    var geo = {latitude:googGeo.geometry.location.lat,longitude:googGeo.geometry.location.lng};
                    var loc = {
                        guid:allAddresses[i].guid + "GEO",
                        geo:geo,
                        createdBy:"system",
                        ffUrl:"/ff/resources/Locations/" +  allAddresses[i].guid + "GEO",
                        ffRL:"/Locations",
                        clazz:"Location"
                    }
                    allObjs.push(loc);
                }
            }
            if (query) {
                allObjs = ff.filterObjectsWithFFRQL(allObjs, query);
            }
            var uriSplit = requestUri.split("/");
            // OK We've got our initial set of data. We're going to now get from ANOTHER virtual collection, doing a simple "traversal"
            if (uriSplit.length > 2) {
                var traversal = uriSplit[2];
                if(common.debug) print ("Location retrieve: found traversal : " + traversal);
                var oldObjs = allObjs;
                allObjs = [];
                var i;
                for (i = 0; i < oldObjs.length; i++) {
                    var traversalQueryUri = "/" + traversal + "/(basic_id eq '" + oldObjs[i].guid + "')";
                    if(common.debug) print ("Location.js.exports.retrieve: will issue query to : " + traversalQueryUri);
                    allObjs = allObjs.concat(ff.getArrayFromUri(traversalQueryUri));
                }
                // do we have a filter for the result set from VCTraversal?
                if (uriSplit.length > 3) {
                    allObjs = ff.filterObjectsWithFFRQL(allObjs, uriSplit[3]);
                }
            }
        }
    } catch(e) {
        if(common.debug) print("Location.js.exports.retrieve error: " + JSON.stringify(e));
        throw {statusCode:500,statusMessage:JSON.stringify(e)};
    }
    return allObjs;
}

exports.create = function(paramObject) {
    if(common.debug) print ("Location.js.exports.create: " + JSON.stringify(paramObject));
    var newObj = paramObject["newObj"];
    throw {statusCode:405,
        statusMessage:"Location.js.exports.create API does not support creating Location objects."
    };
}

exports.update = function(paramObject) {
    if(common.debug) print ("Location.js.exports.update: " + JSON.stringify(paramObject));
    var newObj = paramObject["newObj"];
    var oldObj = paramObject["oldObj"];
    throw {statusCode:405,
        statusMessage:"Location.js.exports.update API does not support updating Location objects"
    };
}

exports.delete = function(paramObject) {
    if(common.debug) print ("Location.js.exports.delete: " + JSON.stringify(paramObject));
    var oldObj = paramObject["oldObj"];
    throw {statusCode:405,
        statusMessage:"Location.js.exports.delete API does not support deleting Location objects."
    };  
}