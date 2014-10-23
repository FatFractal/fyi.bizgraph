function _getGraph(queryResult) {
    // queryResult is the base set of objects returned by query
    // refs is ALL objects referred to, whether by reference or grab-bag
    // gbItems is a map (keyed by ffUrl) of maps (keyed by grab-bag name) of arrays of ffUrls

    

    print ("gbItems is : " + JSON.stringify(gbItems));

    // We'll keep our 'nodes' in here
    var nodes = {};
    // And we'll keep our 'edges' in here
    var edges = {};

    if (!refs) {
        refs = [];
    }

    // Iterate over objects presented
    //      add nodes for every item
    //      add edges for every reference and every grab-bag item
    //      and add nodes for every reference and every grab-bag item
    //      Then iterate on all 'new' objects that weren't previously in the base, doing the same thing, until there are no 'new' objects
    var thisObj;
    var node, edge;
    var toProcess = {};
    var processed = {};
    var keysToProcess;
    var i;
    var allRetrievedObjects = {};
    for (i = 0; i < queryResult.length; i++) {
        toProcess[queryResult[i].ffUrl] = queryResult[i];
        allRetrievedObjects[queryResult[i].ffUrl] = queryResult[i];
    }
    for (i = 0; i < refs.length; i++) {
        toProcess[refs[i].ffUrl] = refs[i];
        allRetrievedObjects[refs[i].ffUrl] = refs[i];
    }
    var referredUrl;
    var referredObj;
    // add nodes for every item
    while ((keysToProcess = Object.keys(toProcess)).length != 0) {

        for (i = 0; i < keysToProcess.length; i++) {

            var thisFFUrl = keysToProcess[i];
            thisObj = toProcess[thisFFUrl];
            // remove thisObj from toProcess
            delete toProcess[thisFFUrl];

            print("Processing " + thisFFUrl);

            if (processed[thisFFUrl]) {
                print("    Already processed");
                continue;
            }

            node = {ffUrl:thisFFUrl,ffRL:thisObj.ffRL,edges:[]};
            nodes[thisFFUrl] = node;

            // Check ffRefs for this object - for each 'new' ffRefs' url present in 'references', add an edge and a new node
            var ffRefs = thisObj.ffRefs;
            if (ffRefs && ffRefs.length > 0) {
                for (var j = 0; j < ffRefs.length; j++) {
                    var thisRef = ffRefs[j];
                    if (thisRef.type === 'FFO') {
                        referredUrl = thisRef.url;
                        var referredNode = nodes[referredUrl];
                        if (! referredNode) {
                            // We haven't created a node for this, so let's first check if we traversed as far as it
                            referredObj = allRetrievedObjects[referredUrl];
                            if (referredObj) {
                                // We did traverse to it, so
                                // add a node
                                referredNode = {ffUrl:referredUrl,ffRL:thisObj.ffRL,edges:[]};
                                nodes[referredUrl] = node;
                                // add the referredObj to 'toProcess'
                                toProcess[referredUrl] = referredObj;
                            }
                        }
                        if (referredNode) {
                            edge = {u: unPrefix(thisFFUrl), v: unPrefix(referredUrl), value: { label: thisRef.name }};
                            // add an edge
                            print ("    Adding edge: " + JSON.stringify(edge));
                            nodes[thisFFUrl].edges.push(edge);
                        }
                    }
                }
            }

            // Check gbItems for this object - add an edge and a new node for each one
            print ("    Processing grabBags for " + thisFFUrl);
            var thisObjsGrabBags = gbItems[thisFFUrl];
            if (thisObjsGrabBags) {
                var gbNames = Object.keys(thisObjsGrabBags);
                print ("        Getting grabBag names for " + thisFFUrl);
                for (var gbNameNum = 0; gbNameNum < gbNames.length; gbNameNum++) {
                    var gbName = gbNames[gbNameNum];
                    var items = thisObjsGrabBags[gbName];
                    print ("            Processing grabBag " + gbName + " for " + thisFFUrl + " : items are " + JSON.stringify(items));
                    for (var itemNum = 0; itemNum < items.length; itemNum++) {
                        referredUrl = items[itemNum];
                        print ("                Adding edge for referredUrl " + referredUrl + " grabBag " + gbName + " for " + thisFFUrl);
                        referredNode = nodes[referredUrl];
                        if (! referredNode) {
                            // We haven't created a node for this, so let's first check if we traversed as far as it
                            referredObj = allRetrievedObjects[referredUrl];
                            if (referredObj) {
                                // We did traverse to it, so
                                // add a node
                                referredNode = {ffUrl:referredUrl,ffRL:thisObj.ffRL,edges:[]};
                                nodes[referredUrl] = node;
                                // add the referredObj to 'toProcess'
                                toProcess[referredUrl] = referredObj;
                            }
                        }
                        if (referredNode) {
                            edge = {u: unPrefix(thisFFUrl), v: unPrefix(referredUrl), value: { label: gbName }};
                            // add an edge
                            print ("    Adding edge: " + JSON.stringify(edge));
                            nodes[thisFFUrl].edges.push(edge);
                        }
                    }
                }
            }

            // Finally, add this to our 'processed' list
            processed[thisFFUrl] = true;
        }
    }

    var allColours = ['Aqua', 'Aquamarine', 'Beige', 'Cyan', 'GreenYellow', 'Khaki', 'Lavender', 'LightBlue', 'Orange', 'MediumSpringGreen', 'Pink', 'Plum'];
    var colourMappings = {};
    var nodeKeys = Object.keys(nodes);

    var graph = {nodes:[],edges:[]};
    for (i = 0; i < nodeKeys.length; i++) {
        var nodeID = nodeKeys[i];
        node = nodes[ nodeID];

        var fillColour = colourMappings[node.ffRL];
        if (! fillColour) {
            fillColour = allColours[Object.keys(colourMappings).length];
            colourMappings[node.ffRL] = fillColour;
        }
        graph.nodes.push({id:unPrefix(node.ffUrl), value: {label:unPrefix(node.ffUrl), style: 'fill: ' + fillColour}});
        for (j = 0; j < node.edges.length; j++) {
            edge = node.edges[j];
            graph.edges.push(edge);
        }
    }

    graph.nodeCount = graph.nodes.length;
    graph.edgeCount = graph.edges.length;

    return graph;
}
