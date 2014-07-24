var ff = require("ffef/FatFractal");
var io  = require ('io'); // standard CommonJS module
var fs  = require ('fs'); // standard CommonJS module
var bin = require ('binary'); // standard CommonJS module
var hc  = require ('ringo/httpclient'); // not standardised by CommonJS yet, hence ringo prefix. see http://ringojs.org
var Scalr   = Packages.org.imgscalr.Scalr; // import the Scalr Java package
var ImageIO = Packages.javax.imageio.ImageIO; // import the imageIo Java packages

var collections = [
    {collection:"Customers",objecttype:"Customer"},
    {collection:"Products",objecttype:"Product"},
    {collection:"OrderLines",objecttype:"OrderLine"},
    {collection:"Orders",objecttype:"Order"},
    {collection:"Vendors",objecttype:"Vendor"},
    {collection:"Prices",objecttype:"Price"},
    {collection:"Manufacturers",objecttype:"Manufacturer"},
    {collection:"Addresses",objecttype:"Address"},
    {collection:"Accounts",objecttype:"Account"},
    {collection:"PaymentMethods",objecttype:"PaymentMethod"},
    {collection:"ProductImages",objecttype:"ProductImage"},
    {collection:"Avatars",objecttype:"Avatar"},
    {collection:"Ratings",objecttype:"Rating"},
    {collection:"Comments",objecttype:"Comment"},
    {collection:"Ratings",objecttype:"Rating"},
    {collection:"Likes",objecttype:"Like"},
    {collection:"Favorites",objecttype:"Vendor, Comment, Product"},
    {collection:"QRCodes",objecttype:"QRCode"}
];

var debug = true;
exports.debug = debug;

exports.runDDFLDropCommands = function() {
    for (var i = 0; i < collections.length; i++) {
        var ffdl = "DROP COLLECTION COMPLETELY /" + collections[i].collection;
        if(debug) print("common.js.runDDFLDropCommands " + ffdl);
        ff.executeFFDL(ffdl);
    }
}

exports.runDDFLCreateCommands = function() {   
    // add the collections
    for (var i = 0; i < collections.length; i++) {
        var ffdl = "CREATE COLLECTION /" + collections[i].collection + " OBJECTTYPE " + collections[i].objecttype;
        if(debug) print("common.js.runDDFLCreateCommands " + ffdl);
        ff.executeFFDL(ffdl);
    }
    // add the handlers because the collections were deleted...
    ff.executeFFDL("CREATE HANDLER locations POST ON /Addresses CREATE AS javascript:require('scripts/handlers').addLocation();");
    ff.executeFFDL("CREATE HANDLER qrCode POST ON /Products CREATE AS javascript:require('scripts/handlers').addQRCode();");
    ff.executeFFDL("CREATE HANDLER increase POST ON /Orders GRABBAG_ADD AS javascript:require('scripts/handlers').totalOrder();");
    ff.executeFFDL("CREATE HANDLER decrease POST ON /Orders GRABBAG_REMOVE AS javascript:require('scripts/handlers').totalOrder();");
}

exports.makeQRCode = function(data) {
    var imgUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + JSON.stringify(data);
    if(debug) print("common.js.makeQRCode " + imgUrl);
    try {
        var qrData = hc.get(imgUrl).contentBytes;
        return qrData;
    } catch (e) {
        if(debug) print("common.js.makeQRCode error " + e);
        return null;
    }
}

exports.getAddressGEO = function(address) {
    var key = "AIzaSyBdf0wRKywia_Ve8jKibfk7ewNd2lMwQAU";
    var adStr = address.number+"+"+address.street+",+"+address.city+",+"+address.state+",+"+address.postCode+",+"+address.country;
    adStr = adStr.replace(/\s/g, "+");
    if(debug) print("common.js.getAddressGEO adStr is: " + adStr);
    var adUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + adStr + "&key=" + key;
    if(debug) print("common.js.getAddressGEO adUrl is: " + adUrl);
    try {
        var resp = hc.get(adUrl);
        if(debug) print("common.js.getAddressGEO resp is: " + resp);
        var geoData = JSON.parse(resp.content).results[0];
        return geoData;
    } catch (e) {
        if(debug) print("common.js.getAddressGEO error is: " + e);
        return null;
    }    
}

function GetThumb(imgUrl, format) {
    /**
     * We need a BufferedImage for the Scalr processing
     * There are ImageIO read methods for InputStream, File and URL. We've got a
     * ByteArray. So let's create a ByteArrayInputStream.
     */
    try {
        var picData = hc.get(imgUrl).contentBytes;
        var bais = new java.io.ByteArrayInputStream(picData);
        var img  = ImageIO.read(bais);
        /**
         * Resize the picture to a set max of 150px in either direction
         */
        if(debug) print("img width is: " + img.width + ", height: " + img.height);
        var w, h;
        if (img.width > img.height) {
            w = 150;
            h = 150/img.width*img.height;
        } else {
            h = 150;
            w = 150/img.height*img.width;
        }
        if(debug) print("resizing image to width: " + w + ", height: " + h);
        var resized = Scalr.resize(img, Scalr.Method.SPEED, Scalr.Mode.FIT_EXACT, w, h);
        if(debug) print("image has been resized to width: " + resized.width + ", height: " + resized.height);
        var baos    = new java.io.ByteArrayOutputStream();
        if(format == "image/jpg" || format == "image/jpeg") format = "JPEG";
        else if(format == "image/png") format = "PNG";
        
        ImageIO.write (resized, format, baos);
        /**
         * Get the bytes from the ByteArrayOutputStream
         */
        var resizedBytes = new bin.ByteArray(baos.toByteArray());
        if(debug) print("resizedBytes length: " + resizedBytes.length);
        return resizedBytes;
    } catch (e) {
        return null;
    }
}
exports.getThumb = GetThumb;
