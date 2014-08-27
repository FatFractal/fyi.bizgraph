var ff = require("ffef/FatFractal");
var io  = require ('io'); // standard CommonJS module
var fs  = require ('fs'); // standard CommonJS module
var bin = require ('binary'); // standard CommonJS module
var hc  = require ('ringo/httpclient'); // not standardised by CommonJS yet, hence ringo prefix. see http://ringojs.org
var Scalr   = Packages.org.imgscalr.Scalr; // import the Scalr Java package
var ImageIO = Packages.javax.imageio.ImageIO; // import the imageIo Java packages

var collections = [
    {collection:"Customers",objecttype:"Customer",virtual:false},
    {collection:"Products",objecttype:"Product",virtual:false},
    {collection:"Prices",objecttype:"Price",virtual:false},
    {collection:"OrderLines",objecttype:"OrderLine",virtual:false},
    {collection:"Orders",objecttype:"Order",virtual:false},
    {collection:"Vendors",objecttype:"Vendor",virtual:false},
    {collection:"Manufacturers",objecttype:"Manufacturer",virtual:false},
    {collection:"Addresses",objecttype:"Address",virtual:false},
    {collection:"Accounts",objecttype:"Account",virtual:false},
    {collection:"PaymentMethods",objecttype:"PaymentMethod",virtual:false},
    {collection:"ProductImages",objecttype:"ProductImage",virtual:false},
    {collection:"Avatars",objecttype:"Avatar",virtual:false},
    {collection:"Ratings",objecttype:"Rating",virtual:false},
    {collection:"Comments",objecttype:"Comment",virtual:false},
    {collection:"Ratings",objecttype:"Rating",virtual:false},
    {collection:"Likes",objecttype:"Like",virtual:false},
    {collection:"Favorites",objecttype:"Vendor, Comment, Product",virtual:false},
    {collection:"QRCodes",objecttype:"QRCode",virtual:false},
    {collection:"Locations",objecttype:"Location",virtual:false,script:"Location"}
];

var debug = true;
exports.debug = debug;
exports.SYSTEM_USER_GUID = "system";
var common = exports;

exports.isOnTheList = function(email) {
    if(email == "kevin@fatfractal.com" ||
       email == "gary@fatfractal.com" ||
       email == "dave@fatfractal.com" ||
       email == "mic@fatfractal.com"  ||
       email == "nickelskevin@gmail.com")
    return true;
    else return false;
}

exports.isVendorAdmin = function(email) {
    if(email == "shawkinaw@gmail.com")
    return true;
    else return false;
}

exports.isMfgAdmin = function(email) {
    if(email == "gary.casey@gmail.com")
    return true;
    else return false;
}
 
exports.isAdmin = function(userGuid) {
    if (! userGuid) return false;
    print("ConsoleCommon.js isFFAdmin received "+userGuid);
    if (userGuid == common.SYSTEM_USER_GUID) return true;

    var membershipCheck = getSysAdminGroup().ffUrl+"/users/(guid eq '"+userGuid+"')";
    print("common.js isFFAdmin membershipCheck will try to retrieve "+membershipCheck);

    return ff.getObjFromUri(membershipCheck) != null;
}

exports.getSysAdminGroup = function() {
    var sysAdminGroup = ff.getObjFromUri("/FFUser/system/groups/(groupName eq 'sysadmins')");

    if (sysAdminGroup != null)
        return new ff.FFUserGroup(sysAdminGroup);

    // if the admins group doesn't exist, create it
    sysAdminGroup = new ff.FFUserGroup(ff.createObjAtUri({groupName:'sysadmins',createdBy:common.SYSTEM_USER_GUID,clazz:'FFUserGroup'}, "/FFUserGroup"));

    // and add it to the system user's grab bag of groups
    var systemUser = ff.getUser(common.SYSTEM_USER_GUID);
    systemUser.addGroup(sysAdminGroup);

    return sysAdminGroup;
}

exports.runDDFLDropCommands = function() {
    for (var i = 0; i < collections.length; i++) {
        var ffdl;
        if(collections[i].vurtual) {
            ffdl = "DROP COLLECTION /"+collections[i].collection;
        } else {
            ffdl = "DROP COLLECTION COMPLETELY /"+collections[i].collection;            
        }
        if(debug) print("common.js.runDDFLDropCommands "+ffdl);
        ff.executeFFDL(ffdl);
    }
    return collections.length;
}

exports.deleteSystemStuff = function() {
    var collections = [
        {collection:"FFUserGroup"},
        {collection:"FFNotificationID"}
    ];
    var count = 0;
    for (var i = 0; i < collections.length; i++) {
        var objs = ff.getArrayFromUri("/"+collections[i].collection);
        if (objs == null) return;
        if(debug) print("common.js.deleteSystemStuff removing "+objs.length+" from "+ collections[i].collection);
        for (var j = 0; j < objs.length; j++) {
            ff.deleteObj(objs[j]);
            count++;
        }
    }
    return count;    
}

exports.runDDFLCreateCommands = function() {   
    // add the collections
    var count = collections.length;
    for (var i = 0; i < collections.length; i++) {
        var ffdl;
        if(collections[i].vurtual) {
            ffdl = "CREATE VIRTUAL_COLLECTION /"+collections[i].collection+" as javascript:require('scripts/"+collections[i].script+"')";
        } else {
            ffdl = "CREATE COLLECTION /"+collections[i].collection+" OBJECTTYPE "+collections[i].objecttype;            
        }
        ffdl = "CREATE COLLECTION /"+collections[i].collection+" OBJECTTYPE "+collections[i].objecttype;
        if(debug) print("common.js.runDDFLCreateCommands "+ffdl);
        ff.executeFFDL(ffdl);
    }
    // add the handlers because the collections were deleted...
    ff.executeFFDL("CREATE HANDLER locations POST ON /Addresses CREATE AS javascript:require('scripts/handlers').addLocation();");
    count++
    ff.executeFFDL("CREATE HANDLER qrCode POST ON /Products CREATE AS javascript:require('scripts/handlers').addQRCode();");
    count++
    ff.executeFFDL("CREATE HANDLER increase POST ON /Orders GRABBAG_ADD AS javascript:require('scripts/handlers').totalOrder();");
    count++
    ff.executeFFDL("CREATE HANDLER decrease POST ON /Orders GRABBAG_REMOVE AS javascript:require('scripts/handlers').totalOrder();");
    count++
    ff.executeFFDL("CREATE HANDLER grantAccessToVendor PRE ON /Orders CREATE AS javascript:require('scripts/handlers').grantAccessToVendor();");
    count++
    return count;
}

exports.makeQRCode = function(data) {
    var imgUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+JSON.stringify(data);
    if(debug) print("common.js.makeQRCode "+imgUrl);
    try {
        var qrData = hc.get(imgUrl).contentBytes;
        return qrData;
    } catch (e) {
        if(debug) print("common.js.makeQRCode error "+e);
        return null;
    }
}

exports.getAddressGEO = function(address) {
    var key = "AIzaSyBdf0wRKywia_Ve8jKibfk7ewNd2lMwQAU";
    var adStr = address.streetNo+"+"+address.street+",+"+address.city+",+"+address.state+",+"+address.postCode+",+"+address.country;
    adStr = adStr.replace(/\s/g, "+");
    if(debug) print("common.js.getAddressGEO adStr is: "+adStr);
    var adUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+adStr+"&key="+key;
    if(debug) print("common.js.getAddressGEO adUrl is: "+adUrl);
    try {
        var resp = hc.get(adUrl);
        if(debug) print("common.js.getAddressGEO resp is: "+resp);
        var geoData = JSON.parse(resp.content).results[0];
        return geoData;
    } catch (e) {
        if(debug) print("common.js.getAddressGEO error is: "+e);
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
        if(debug) print("img width is: "+img.width+", height: "+img.height);
        var w, h;
        if (img.width > img.height) {
            w = 150;
            h = 150/img.width*img.height;
        } else {
            h = 150;
            w = 150/img.height*img.width;
        }
        if(debug) print("resizing image to width: "+w+", height: "+h);
        var resized = Scalr.resize(img, Scalr.Method.SPEED, Scalr.Mode.FIT_EXACT, w, h);
        if(debug) print("image has been resized to width: "+resized.width+", height: "+resized.height);
        var baos    = new java.io.ByteArrayOutputStream();
        if(format == "image/jpg" || format == "image/jpeg") format = "JPEG";
        else if(format == "image/png") format = "PNG";
        
        ImageIO.write (resized, format, baos);
        /**
         * Get the bytes from the ByteArrayOutputStream
         */
        var resizedBytes = new bin.ByteArray(baos.toByteArray());
        if(debug) print("resizedBytes length: "+resizedBytes.length);
        return resizedBytes;
    } catch (e) {
        return null;
    }
}
exports.getThumb = GetThumb;

function Round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
exports.round = Round;

