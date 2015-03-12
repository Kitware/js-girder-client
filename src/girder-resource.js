var _ = require("./girder-util.js");

// ----------------------------------------------------------------------------

function downloadResources(resourceList, withMetadata, callback) {
    var args = _.args(['resourceList', 'withMetadata', 'callback'], arguments),
        query = { resources: JSON.toString(args.resourceList), includeMetadata: (args.withMetadata === undefined) ? false : !!args.withMetadata };
    _.GET('/resource/download' + _.extractQuery(args.query), args.callback);
}

// ----------------------------------------------------------------------------

function searchResources(query, types, callback) {
    var opt = { q: JSON.toString(query), types: JSON.toString(types) };
    _.GET('/resource/search' + _.extractQuery(opt), callback);
}

// ----------------------------------------------------------------------------

function deleteResources(resourceList, callback) {
    var query = { resources: JSON.toString(resourceList) };
    _.DELETE('/resource' + _.extractQuery(query), callback);
}

// --- Export functions for the module ---

module.exports = {
    downloadResources : downloadResources,
    searchResources   : searchResources,
    deleteResources   : deleteResources
};
