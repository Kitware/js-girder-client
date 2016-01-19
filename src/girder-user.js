// Get reference to the internal HTTP request abstraction
var _ = require("./girder-util.js");

// ----------------------------------------------------------------------------

function listUsers(query, callback) {
    var allowedQueryKeys = ['text', 'limit', 'offset', 'sort', 'sortdir'],
        args = _.args(['query', 'callback'], arguments);
    _.GET('/user' + _.extractQuery(args.query, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function createUser(user, callback) {
    var allowedQueryKeys = ['login', 'email', 'firstName', 'lastName', 'password', 'admin'],
        count = allowedQueryKeys.length;

    // Validate user before making the request
    while(count--) {
        if(user[allowedQueryKeys[count]] === undefined) {
            return callback({ 
                'message': 'User is at least missing ' +
                            allowedQueryKeys[count] + ' but should provide ' +
                            allowedQueryKeys.join(', ') });
        }
    }

    _.POST('/user' + _.extractQuery(user, allowedQueryKeys), callback);
}

// ----------------------------------------------------------------------------

function changePassword(oldPassword, newPassword, callback) {
    _.PUT('/user/password' + 
          _.extractQuery({ old:oldPassword, new:newPassword }), 
          callback);
}

// ----------------------------------------------------------------------------

function resetPassword(email, callback) {
    _.DELETE('/user/password' + 
          _.extractQuery({email:email}), 
          callback);
}

// ----------------------------------------------------------------------------

function deleteUser(userId, callback) {
    _.DELETE('/user/' + userId, callback);
}

// ----------------------------------------------------------------------------

function getUser(userId, callback) {
    _.GET('/user/' + userId, callback);
}

// ----------------------------------------------------------------------------

function updateUser(user, callback) {
    var mandatoryKeys = ['email', 'firstName', 'lastName', 'id'],
        count = mandatoryKeys.length;

    // Validate user before making the request
    while(count--) {
        if(user[mandatoryKeys[count]] === undefined) {
            return callback({ 
                'message': 'User is missing ' +
                            mandatoryKeys[count] + ' but should provide ' +
                            mandatoryKeys.join(', ') });
        }
    }
    _.PUT('/user/' + user.id + _.extractQuery(user, mandatoryKeys, ['id']), callback);
}

// ----------------------------------------------------------------------------

function me(callback) {
    _.GET('/user/me', callback);
}

// AWS

function getAWSProfiles(callback) {
    _GET('user/' + user._id + '/aws/profiles', callback);
}

function createAWSProfile(prof, callback) {
    _.POST('user/' + user._id + '/aws/profiles', prof, callback);
}

function saveAWSProfile(prof, callback) {
    _.PATCH('user/' + user._id + '/aws/profiles/' + prof._id, prof, callback);
}

function getAWSRunningInstances(prof, callback) {
    _GET('user/' + user._id + '/aws/profiles/' + prof._id + '/runninginstances', callback);
}

function getAWSMaxInstances(prof, callback) {
    _GET('user/' + user._id + '/aws/profiles/' + prof._id + '/maxinstances', callback);
}

function deleteAWSProfile(prof, callback) {
    _.DELETE('user/' + user._id + '/aws/profiles/' + prof._id, callback);
}

// --- Export functions for the module ---

module.exports = {
    listUsers       : listUsers,
    createUser      : createUser,
    changePassword  : changePassword,
    resetPassword   : resetPassword,
    deleteUser      : deleteUser,
    getUser         : getUser,
    updateUser      : updateUser,
    me              : me,

    getAWSProfiles:         getAWSProfiles,
    createAWSProfile:       createAWSProfile,
    saveAWSProfile:         saveAWSProfile,
    getAWSRunningInstances: getAWSRunningInstances,
    getAWSMaxInstances:     getAWSMaxInstances,
    deleteAWSProfile:       deleteAWSProfile
};
