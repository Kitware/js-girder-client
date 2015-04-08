// Get reference to the internal HTTP request abstraction
var _ = require("./girder-util.js");

// ----------------------------------------------------------------------------

function deleteSetting(key, callback) {
    _.DELETE('/system/setting' + _.extractQuery({key:key}), callback);
}

// ----------------------------------------------------------------------------

function getSettings(options, callback) {
    var allowedQueryKeys = ['key', 'list', 'default'];
    _.GET('/system/setting' + _.extractQuery(options, allowedQueryKeys), callback);
}

// ----------------------------------------------------------------------------

function setSettings(keyValueMap, callback) {
    var list = [];
    for(var key in keyValueMap) {
        list.push({ key: key, value: keyValueMap[key] });
    }
    _.PUT('/system/setting' + _.extractQuery({list:list}), callback);
}

// ----------------------------------------------------------------------------

function getServerVersion(callback) {
    _.GET('/system/version', callback);
}

// ----------------------------------------------------------------------------

function listUnfinishedUpload(query, callback) {
    var allowedQueryKeys = ['uploadId', 'userId', 'parentId', 'assetstoreId', 'minimumAge', 'includeUntracked', 'limit', 'offset', 'sort', 'sortdir'],
        args = _.args(['query', 'callback'], arguments);
    _.GET('/system/uploads' + _.extractQuery(args.query, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function removeUnfinishedUpload(query, callback) {
    var allowedQueryKeys = ['uploadId', 'userId', 'parentId', 'assetstoreId', 'minimumAge', 'includeUntracked'];
    _.DELETE('/system/uploads' + _.extractQuery(query, allowedQueryKeys), callback);
}

// ----------------------------------------------------------------------------

function listPlugins(callback) {
    _.GET('/system/plugins', callback);
}

// ----------------------------------------------------------------------------

function setActivePlugins(pluginList, callback) {
    _.PUT('/system/plugins' + _.extractQuery({plugins:pluginList}), callback);
}

// --- Export functions for the module ---

module.exports = {
    deleteSetting           : deleteSetting,
    getSettings             : getSettings,
    setSettings             : setSettings,
    getServerVersion        : getServerVersion,
    listUnfinishedUpload    : listUnfinishedUpload,
    removeUnfinishedUpload  : removeUnfinishedUpload,
    listPlugins             : listPlugins,
    setActivePlugins        : setActivePlugins
};
