var _ = require("./girder-util.js");

// ----------------------------------------------------------------------------

function uploadChunk(uploadId, offset, chunk, callback) {
    if(typeof __BROWSER_BUILD__ != 'undefined' && __BROWSER_BUILD__) {
        callback(new Error("Not implemented for browser"));
    } else {
        var FormData = require('form-data'),
            form = new FormData();
    
        form.append('uploadId', uploadId);
        form.append('offset', offset);
        form.append('chunk', chunk);
    
        _.POST('/file/chunk', form, callback);
    }
}

// ----------------------------------------------------------------------------

function uploadComplete(uploadId, callback) {
    if(typeof __BROWSER_BUILD__ != 'undefined' && __BROWSER_BUILD__) {
        callback(new Error("Not implemented for browser"));
    } else {
        var FormData = require('form-data'),
            form = new FormData();
    
        form.append('uploadId', uploadId);
        _.POST('/file/completion', form, callback);        
    }
}

// ----------------------------------------------------------------------------

function getUploadOffset(uploadId, callback) {
    _.GET('/file/offset?uploadId=' + uploadId, callback);
}

// ----------------------------------------------------------------------------

function downloadFile(fileId, callback) {
    _.GET('/file/' + fileId + '/download', callback);
}

// ----------------------------------------------------------------------------

function updateFileContent(fileId, size, callback) {
    _.PUT('/file/' + fileId + '/contents?size=' + size, callback);
}

// ----------------------------------------------------------------------------

function deleteFile(fileId, callback) {
    _.DELETE('/file/' + fileId, callback);
}

// ----------------------------------------------------------------------------

function editFile(fileId, metadata, callback) {
    var allowedQueryKeys = ['name', 'mimeType'],
        args = _.args(['resourceList', 'withMetadata', 'callback'], arguments);
    _.PUT('/file/' + fileId + _.extractQuery(args.metadata, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function newFile(parentType, parentId, name, options, callback) {
    var allowedQueryKeys = ['parentType', 'parentId', 'name', 'size', 'mimeType', 'linkUrl'],
        args = _.args(['parentType', 'parentId', 'name', 'options', 'callback'], arguments);

    options = args.options || {};
    options.parentType = parentType;
    options.parentId   = parentId;
    options.name       = name;

    _.POST('/file' + _.extractQuery(options, allowedQueryKeys), args.callback);
}

// --- Export functions for the module ---

module.exports = {
    uploadChunk       : uploadChunk,
    getUploadOffset   : getUploadOffset,
    downloadFile      : downloadFile,
    updateFileContent : updateFileContent,
    uploadComplete    : uploadComplete,
    deleteFile        : deleteFile,
    editFile          : editFile,
    newFile           : newFile
};
