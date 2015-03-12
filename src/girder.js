var _ = require("./girder-util.js"),
    girderResources = [
        require('./girder-assetstore.js'),
        require('./girder-collection.js'),
        require('./girder-file.js'),
        require('./girder-folder.js'),
        require('./girder-group.js'),
        require('./girder-item.js'),
        require('./girder-resource.js'),
        require('./girder-system.js'),
        require('./girder-user.js')
    ];

//-- Main exposed function used to configure the service

function configure(opts) {
    _.update(opts);
}

//-- REST method for User authentication

function login(user, password, callback) {
    // Use basic authentication
    _.update({ user: user, password: password });
    _.GET('/user/authentication', function(err, response) {
        if(err) {
            return callback(err, response);
        }

        _.update({ token: response.content.authToken.token });
        return callback(err, response);
    });
}

//-- REST method for User authentication

function logout(callback) {
    _.DELETE('/user/authentication', function(err, response) {
        if(err) {
            return callback(err, response);
        }
        _.resetAuth();
        return callback(err, response);
    });
}

// --- Export functions for the module ---

module.exports = configure;

//--

module.exports.login  = login;
module.exports.logout = logout;

//-- Expose all girder resources
var count = girderResources.length;

while(count--) {
    var girderModule = girderResources[count];
    for(var key in girderModule) {
        module.exports[key] = girderModule[key];
    }
}
