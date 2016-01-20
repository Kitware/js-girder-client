// Gather all girder modules so they get exposed via a single entry point.
var _ = require("./girder-util.js"),
    girderResources = [
        require('./girder-assetstore.js'),
        require('./girder-collection.js'),
        require('./girder-cluster.js'),
        require('./girder-file.js'),
        require('./girder-folder.js'),
        require('./girder-group.js'),
        require('./girder-item.js'),
        require('./girder-resource.js'),
        require('./girder-system.js'),
        require('./girder-user.js')
    ];

// Namespace function used to configure the service such as
// host, port, protocol, API endpoint and eventually provide an existing token.
//
// Default values for available options:
//
//      {
//          port: 8080,
//          host: "localhost",
//          protocol: "http:",
//          basepath: "/api/v1",
//          token: "sdhfgojhskfhaksjhdf;kjasrfgu"
//      }
function configure(opts) {
    _.update(opts);
}

// Method used to authenticate yourself as a given user.
function login(user, password, callback) {
    _.update({ user: user, password: password });
    _.GET('/user/authentication', function(err, response) {
        if(err) {
            return callback(err, response);
        }

        _.update({ token: response.content.authToken.token });
        return callback(err, response);
    });
}

// Clear current authentication
function logout(callback) {
    _.DELETE('/user/authentication', function(err, response) {
        if(err) {
            return callback(err, response);
        }
        _.resetAuth();
        return callback(err, response);
    });
}

// Expose methods to the module
module.exports        = configure;
module.exports.login  = login;
module.exports.logout = logout;

// Register every methods from the girder modules to the girder namespace.

var count = girderResources.length;
while(count--) {
    var girderModule = girderResources[count];
    for(var key in girderModule) {
        module.exports[key] = girderModule[key];
    }
}

// This will allow to have other module methods exposed as follow:
//
//     $ girder.methodName(args, ..., callback);
//
