var ff = require("ffef/FatFractal");
var common = require('scripts/common');

function Customer() {
    this.clazz = "Customer";
    this.user = null;
    this.address = null;
    this.phone = null;
    this.avatar = null;        
    return this;
}

function Product() {
    this.clazz = "Product";
    this.description = null;
    this.sku = null;
    this.qrcode = null;
    this.mfg = null;
    // this.vendors = [];
    // this.gallery = [];
    return this;
}

function OrderLine() {
    this.clazz = "OrderLine";
    this.product = null;
    this.vendor = null;
    this.quantity = null;
    this.price = null;
    this.total = null;
    return this;    
}

function Order() {    
    this.clazz = "Order";
    this.customer = null;
    this.total = null;
    this.placedAt = null;
    return this;    
}

function Vendor () {
    this.clazz = "Vendor";
    this.name = null;
    this.address = null;
    this.logo = null;
    return this;    
}

function Manufacturer () {
    this.clazz = "Manufacturer";
    this.name = null;
    this.address = null;
    this.logo = null;
    return this;    
}

function Price() {
    this.clazz = "Price";
    this.product = null;
    this.vendor = null;
    return this;    
}

function Address() {
    this.clazz = "Address";
    this.street = null;
    this.city = null;
    this.state = null;
    this.country = null;
    this.postCode = null;
    this.location = null;
    return this;    
}

function Location() {
    this.clazz = "Location";
    this.geo = null;
    return this;    
}

function Account() {
    this.clazz = "Account";
    this.customer = null;
    this.paymentMethods = [];
    return this;    
}

function ProductImage() {
    this.clazz = "ProductImage";
    this.image = null;
    this.product = null;
    return this;    
}

function Avatar() {
    this.clazz = "Avatar";
    this.image = null;
    this.nickname = null;
    return this;        
}

function Rating() {
    this.clazz = "Rating";
    this.relatesTo = null;
    this.geo = null;
    return this;        
}

function Comment () {
    this.clazz = "Comment";
    this.relatesTo = null;
    this.comment = null;
    this.geo = null;
    return this;        
}

function Like () {
    this.clazz = "Like";
    this.relatesTo = null;
    this.geo = null;
    return this;        
}

function QRCode () {
    this.clazz = "QRCode";
    this.image = null;
    return this;        
}
exports.QRCode = QRCode;

exports.createSomeMfgs = function() {
    var objs = [
    {name:"Zojurushi",number:"1149",street:"W 190th St #1000",city:"Gardena",state:"CA",postCode:"90248",country:"USA",logoUrl:"http://www.zojirushi.com/img/zojirushi_logo_black.jpg",logoType:"image/jpg"},
    {name:"Epson",number:"3840",street:"Kilroy Airport Way",city:"Long Beach",state:"CA",postCode:"90806",country:"USA",logoUrl:"http://www.epson.com/_assets/img/header/header-logo-tagline.png",logoType:"image/jpg"},
    {name:"Shark",number:"180",street:"Wells Avenue #200",city:"Newton",state:"MA",postCode:"02459",country:"USA",logoUrl:"http://www.sharkclean.com/include/images/layout/footer_joinUs.jpg",logoType:"image/jpg"},
    {name:"Stoneline",number:"16",street:"Carroll Street",city:"Dunedin",state:"",postCode:"9016",country:"NZ",logoUrl:"http://www.stoneline.co.nz/images/551/medium/logo.jpg",logoType:"image/jpg"}
    ];
    var count = 0;
    for (var i = 0; i < objs.length; i++) {
        var test = ff.getObjFromUri("/Manufacturers/" + objs[i].name);
        if(!test) {
            var ad = new Address();
            ad.number = objs[i].number;
            ad.street = objs[i].street;
            ad.city = objs[i].city;
            ad.state = objs[i].state;
            ad.postCode = objs[i].postCode;
            ad.country = objs[i].country;
            ad = ff.createObjAtUri(ad, "/Addresses", "system");
            count ++;
            if(common.debug) print("models.js.createSomeMfgs created Address " + ad);
            var obj = new Manufacturer();
            obj.name = objs[i].name;
            obj.guid = objs[i].name;
            ff.addReferenceToObj(ad.ffUrl, "address", obj);
            obj = ff.createObjAtUri(obj, "/Manufacturers", "system");
            count ++;
            var img = common.getThumb(objs[i].logoUrl, objs[i].logoType);
            if(common.debug) print("models.js.createSomeMfgs created Manufacturer " + obj.guid);
            ff.saveBlob(obj, 'logo', img, objs[i].logoType);        
        }
    }
    return count;  
}

exports.createSomeVendors = function() {
    var objs = [
    {name:"Amazon",number:"1200",street:"12th Ave. South, Ste. 1200",city:"Seattle",state:"WA",postCode:"98144-2734",country:"USA",logoUrl:"http://phandroid.s3.amazonaws.com/wp-content/uploads/2010/09/amazon-logo-1.jpg",logoType:"image/jpg"},
    // {name:"IBM",number:"1",street:"New Orchard Road",city:"Armonk",state:"NY",postCode:"10504-1722",country:"USA",logoUrl:"http://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1000px-IBM_logo.svg.png",logoType:"image/png"},
    {name:"BestBuy",number:"7601",street:"Penn Avenue South",city:"Richfield",state:"MN",postCode:"55423",country:"USA",logoUrl:"http://img.bbystatic.com/BestBuy_US//en_US/images/global/header/logo.png",logoType:"image/png"}
    ];
    var count = 0;
    for (var i = 0; i < objs.length; i++) {
        var test = ff.getObjFromUri("/Manufacturers/" + objs[i].name);
        if(!test) {
            var ad = new Address();
            ad.number = objs[i].number;
            ad.street = objs[i].street;
            ad.city = objs[i].city;
            ad.state = objs[i].state;
            ad.postCode = objs[i].postCode;
            ad.country = objs[i].country;
            ad = ff.createObjAtUri(ad, "/Addresses", "system");
            count ++;
            if(common.debug) print("models.js.createSomeVendors created Address " + ad);
            var obj = new Vendor();
            obj.name = objs[i].name;
            obj.guid = objs[i].name;
            ff.addReferenceToObj(ad.ffUrl, "address", obj);
            obj = ff.createObjAtUri(obj, "/Vendors", "system");
            count ++;
            var img = common.getThumb(objs[i].logoUrl, objs[i].logoType);
            if(common.debug) print("models.js.createSomeVendors created Vendor " + obj.guid);
            ff.saveBlob(obj, 'logo', img, objs[i].logoType);        
        }
    }
    return count;  
}

exports.createSomePrices = function() {
    var objs = [
    {vendor:"Amazon",sku:"B0074CDG6C",price:146.88},
    {vendor:"Amazon",sku:"B00CBAPEYE",price:69.99},
    {vendor:"Amazon",sku:"B004Q4DRJW",price:160.16},
    {vendor:"Amazon",sku:"B00E9BYFIE",price:225.00},
    {vendor:"Amazon",sku:"B00BSEYJ3Q",price:249.95},
    {vendor:"BestBuy",sku:"B0074CDG6C",price:154.05},
    {vendor:"BestBuy",sku:"B00CBAPEYE",price:91.99},
    {vendor:"BestBuy",sku:"B004Q4DRJW",price:234.99}
    ];
    var count = 0;
    for (var i = 0; i < objs.length; i++) {
        // var test = ff.getObjFromUri("/Prices/" + objs[i].sku);
 // if(!test) {
        var vendor = ff.getObjFromUri("/Vendors/"+objs[i].vendor);
        if(vendor) {
            var prod = ff.getObjFromUri("/Products/"+objs[i].sku);
            if(prod) {
                var p = new Price();
                p.price = objs[i].price;
                ff.addReferenceToObj(vendor.ffUrl, "vendor", p);
                ff.addReferenceToObj(prod.ffUrl, "product", p);
                p = ff.createObjAtUri(p, "/Prices", "system");
                if(common.debug) print("models.js.createSomePrices created Price " + p.guid);                
                count ++;                            
            } else if(common.debug) print("models.js.createSomePrices Product not found " + prod.guid);            
        } else if(common.debug) print("models.js.createSomePrices Vendor not found " + vendor.guid);                                  
            // } else {
  //               if(common.debug) print("models.js.createSomePrices could not find Manufacturer " + mfg + ", skipping add product")
  //  }
    }
    return count;  
}

exports.createSomeProducts = function() {
    // create the Product objects
    var objs = [
    {mfg:"Zojurushi",sku:"B0074CDG6C",description:"Zojirushi NS-TSC10 5-1/2-Cup (Uncooked) Micom Rice Cooker and Warmer, 1.0-Liter",model:"NS-TSC10",weight:10,picture:"http://ecx.images-amazon.com/images/I/41VHslnju%2BL.jpg",type:"image/jpg"},
    {mfg:"Epson",sku:"B00CBAPEYE",description:"Epson Expression Home XP-410 Small-in-One All-in-One Wireless Inkjet Printer",model:"C11CC87201",weight:11.6,picture:"http://ecx.images-amazon.com/images/I/4101unRBoFL.jpg",type:"image/jpg"},
    {mfg:"Shark",sku:"B004Q4DRJW",description:"Shark Navigator Lift-Away Vacuum",model:"NV352",weight:19.4,picture:"http://ecx.images-amazon.com/images/I/51epS5eORkL._SL1500_.jpg",type:"JPG"},
    {mfg:"Stoneline",sku:"B00E9BYFIE",description:"Stoneline PFOA Free Nonstick Stone Cookware - Classic 8-Piece Set",model:"Classic8",weight:19.4,picture:"http://ecx.images-amazon.com/images/I/51epS5eORkL._SL1500_.jpg",type:"image/jpg"},
    {mfg:"Zojurushi",sku:"B00BSEYJ3Q",description:"Zojirushi BB-CEC20 Home Bakery Supreme 2-Pound-Loaf Breadmaker",model:"BB-CEC20",weight:25.2,picture:"http://ecx.images-amazon.com/images/I/71adJp2DTPL._SL1500_.jpg",type:"image/jpg"}
    ];
    var count = 0;
    for (var i = 0; i < objs.length; i++) {
        var test = ff.getObjFromUri("/Products/" + objs[i].sku);
        if(!test) {
            var mfg = ff.getObjFromUri("/Manufacturers/"+ objs[i].mfg);
            if(mfg) {
                var obj = new Product();
                obj.guid = objs[i].sku;
                obj.sku = objs[i].sku;
                obj.description = objs[i].description;
                obj.model = objs[i].model;
                obj.weight = objs[i].weight;                
                ff.addReferenceToObj(mfg.ffUrl, "mfg", obj);
                obj = ff.createObjAtUri(obj, "/Products", "system");
                count ++;
                if(common.debug) print("models.js.createSomeProducts created Product " + obj.guid);                
                var img = common.getThumb(objs[i].picture, objs[i].type);
                var pimg = new ProductImage();
                ff.addReferenceToObj(obj.ffUrl, "product", pimg);
                pimg = ff.createObjAtUri(pimg, "/ProductImages", "system");
                count ++;
                ff.saveBlob(pimg, 'image', img, objs[i].type);
                      
            } else {
                if(common.debug) print("models.js.createSomeProducts could not find Manufacturer " + mfg + ", skipping add product")
            }
        }
    }
    return count;  
}

exports.createSomeCustomers = function() {
    var objs = [
    {firstName:"Kevin",lastName:"Nickels",email:"nickelskevin@gmail.com",phone:"+1-650-318-3887",password:"Iwantin123",number:"3420",street:"Finnian Way #410",city:"Dublin",state:"CA",postCode:"94568",country:"USA"},
    {firstName:"Gary",lastName:"Casey",email:"gary.casey@gmail.com",phone:"+44-7974-457003",password:"Iwantin123",number:"Clifton House",street:"Viewfield Street",city:"Nairn",state:"Scotland",postCode:"IV124HW",country:"UK"},
    {firstName:"Faisal",lastName:"Hakeem",email:"faisal.7akeem@gmail.com",phone:"+1-408-455-4435",password:"Iwantin123",number:"350",street:"River Oaks Parkway, Apt 1234",city:"San Jose",state:"CA",postCode:"95134",country:"USA"},
    {firstName:"Mavis",lastName:"Nickels",email:"mavis_2@q.com",phone:"+1-360-573-9785",password:"Iwantin123",number:"16323",street:"NE 94th Avenue",city:"Battleground",state:"WA",postCode:"98604",country:"USA"},
    {firstName:"Vanessa",lastName:"Schott",email:"vanessa@spotjournal.me",phone:"+1-415-746-0165",password:"Iwantin123",number:"350",street:"River Oaks Parkway, Apt 1234",city:"San Jose",state:"CA",postCode:"95134",country:"USA"},
    {firstName:"Dave",lastName:"Wells",email:"shawkinaw@gmail.com",phone:"+1-217-714-6872",password:"Iwantin123",number:"4621",street:"Copper Ridge",city:"Champaign",state:"IL",postCode:"61822",country:"USA"},
    ];
    var count = 0;
    for (var i = 0; i < objs.length; i++) {
        var usr = ff.getObjFromUri("/FFUser/(email eq '" + objs[i].email + "')");
        if(common.debug) print("models.js.createSomeCustomers test user is:  " + JSON.stringify(usr));
        if(!usr) {
            // register the user
            var reg = {userName:objs[i].email,firstName:objs[i].firstName,lastName:objs[i].lastName,email:objs[i].email};
            if(common.debug) print("models.js.createSomeCustomers user does not exist, registering:  " + JSON.stringify(reg));
            usr = ff.registerUser(reg, objs[i].password, true, false);
            count ++;
        }
        // check if customer record exists
        var url = usr.ffUrl+"/BackReferences.Customers";
        if(common.debug) print("models.js.createSomeCustomers url is: " + url);
        var test = ff.getObjFromUri(url);
        if(!test) {
            var cus = new Customer();
            cus.phone = objs[i].phone;
            // create the address
            var ad = new Address();
            ad.number = objs[i].number;
            ad.street = objs[i].street;
            ad.city = objs[i].city;
            ad.state = objs[i].state;
            ad.postCode = objs[i].postCode;
            ad.country = objs[i].country;
            ad = ff.createObjAtUri(ad, "/Addresses", "system");
            count ++;
            // now, add references and save customer
            ff.addReferenceToObj(ad.ffUrl, "address", cus);            
            ff.addReferenceToObj(usr.ffUrl, "user", cus);
            cus = ff.createObjAtUri(cus, "/Customers", "system");            
            if(common.debug) print("models.js.createSomeCustomers created Customer " + cus);
            count ++;
        }        
    }
    return count;  
}

exports.createSomeAddresses = function() {
    var objs = [
    {number:"376",street:"University Ave",city:"Palo Alto",state:"CA",postCode:"94301",country:"USA"},
    {number:"714",street:"7th Ave",city:"New York",state:"NY",postCode:"10036",country:"USA"},
    {number:"4550",street:"Worth St",city:"Dallas",state:"TX",postCode:"75246",country:"USA"},
    {number:"801",street:"Alaskan Way",city:"Seattle",state:"WA",postCode:"98104",country:"USA"}
    ];
    var count = 0;
    for (var i = 0; i < objs.length; i++) {
        // create the address
        var ad = new Address();
        ad.number = objs[i].number;
        ad.street = objs[i].street;
        ad.city = objs[i].city;
        ad.state = objs[i].state;
        ad.postCode = objs[i].postCode;
        ad.country = objs[i].country;
        ad = ff.createObjAtUri(ad, "/Addresses", "system");
        count ++;
    }    
    return count;  
}

exports.createSomeOrders = function() {
    var count = 0;
    var customer = ff.getObjFromUri("/Customers/(guid eq random(guid))");
    var user = ff.getReferredObject("user", customer);
    if(common.debug) print("models.js.createSomeOrders retrieved Customer " + JSON.stringify(customer));
    var address = ff.getObjFromUri("/Addresses/(guid eq random(guid))");
    if(common.debug) print("models.js.createSomeOrders retrieved Address " + JSON.stringify(address));
    var numOrders = Math.floor(Math.random() * 10) + 1;
    if(common.debug) print("models.js.createSomeOrders will create "+numOrders+" Orders");
    for (var i = 0; i < numOrders; i++) {
        // get a random Vendor
        var vendor = ff.getObjFromUri("/Vendors/(guid eq random(guid))");
        if(common.debug) print("models.js.createSomeOrders retrieved Vendor " + JSON.stringify(vendor));
        var order = new Order();
        ff.addReferenceToObj(customer.ffUrl, "customer", order);            
        ff.addReferenceToObj(vendor.ffUrl, "vendor", order);            
        ff.addReferenceToObj("/ff/resources/Locations/"+address.guid+"GEO", "placedAt", order);            
        order = ff.createObjAtUri(order, "/Orders", user.guid);
        count ++;               
        if(common.debug) print("models.js.createSomeOrders created Order " + JSON.stringify(order));
        var numProds = Math.floor(Math.random() * 10) + 1;
        if(common.debug) print("models.js.createSomeOrders will create "+numProds+" OrderLines");
        for (var j = 0; j < numProds; j++) {
            var qty = Math.floor(Math.random() * 10) + 1;
            if(common.debug) print("models.js.createSomeOrders will set quantity to "+qty);
            // get a random price
            if(common.debug) print("models.js.createSomeOrders "+vendor.ffUrl + "/BackReferences.Prices/(guid eq random(guid))");
            var price = ff.getObjFromUri(vendor.ffUrl + "/BackReferences.Prices/(guid eq random(guid))");
            if(common.debug) print("models.js.createSomeOrders retrieved Price " + JSON.stringify(price));
            // get the product
            var prod = ff.getReferredObject("product", price); 
            var line = new OrderLine();
            line.price = price.price;
            line.quantity = qty;
            line.total = qty * price.price;
            ff.addReferenceToObj(prod.ffUrl, "product", line);            
            ff.addReferenceToObj(vendor.ffUrl, "vendor", line);    
            line = ff.createObjAtUri(line, "/OrderLines", user.guid);
            if(common.debug) print("models.js.createSomeOrders created OrderLine " + JSON.stringify(line));
            ff.grabBagAdd(line.ffUrl, order.ffUrl, "orderLines", user.guid);
            count ++;               
        }
    }
    return count;  
}