var _ = require("./girder-util.js");

// ----------------------------------------------------------------------------

function updateGroupModerator(groupdId, userId, isModerator, callback) {
    var url = '/group/' + groupdId + '/moderator?userId=' + userId;
    if(isModerator) {
        _.POST(url, callback);
    } else {
        _.DELETE(url, callback);
    }
}

// ----------------------------------------------------------------------------

function updateGroupAdmin(groupdId, userId, isAdmin, callback) {
    var url = '/group/' + groupdId + '/admin?userId=' + userId;
    if(isAdmin) {
        _.POST(url, callback);
    } else {
        _.DELETE(url, callback);
    }
}

// ----------------------------------------------------------------------------

function createGroup(name, options, callback) {
    var allowedQueryKeys = ['name', 'description', 'public'],
        args = _.args(['name', 'options', 'callback'], arguments);

    options = args.options || {};
    options.name = name;

    _.POST('/group' + _.extractQuery(options, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function deleteGroup(groupdId, callback) {
    _.DELETE('/group/' + groupdId, callback);
}

// ----------------------------------------------------------------------------

function getGroup(groupdId, callback) {
    _.GET('/group/' + groupdId, callback);
}

// ----------------------------------------------------------------------------

function editGroup(groupdId, options, callback) {
    var allowedQueryKeys = ['name', 'description', 'public'];
    _.PUT('/group/' + groupdId + _.extractQuery(options, allowedQueryKeys), callback);
}

// ----------------------------------------------------------------------------

function listGroupInvitations(groupId, query, callback) {
    var allowedQueryKeys = ['limit', 'offset', 'sort', 'sortdir'],
        args = _.args(['groupId', 'query', 'callback'], arguments);
    _.GET('/group/' + groupId + '/invitation' + _.extractQuery(args.query, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function addGroupInvitation(groupId, userId, options, callback) {
    var allowedQueryKeys = ['userId', 'level', 'quiet'],
        args = _.args(['groupId', 'userId', 'options', 'callback'], arguments);
    
    options = args.options || {};
    options.userId = userId;

    _.POST('/group/' + groupId + '/invitation' + _.extractQuery(options, allowedQueryKeys), args.callback);
}
// ----------------------------------------------------------------------------

function listGroupMembers(groupId, query, callback) {
    var allowedQueryKeys = ['limit', 'offset', 'sort', 'sortdir'],
        args = _.args(['groupId', 'query', 'callback'], arguments);
    _.GET('/group/' + groupId + '/member' + _.extractQuery(args.query, allowedQueryKeys), args.callback);
}

// ----------------------------------------------------------------------------

function removeUserFromGroup(groupId, userId, callback) {
    var url = '/group/' + groupId + '/member';

    if(userId) {
        url += '?userId=' +  userId;
    }
    
    _.DELETE(url, callback);
}

// ----------------------------------------------------------------------------

function joinGroup(groupId, callback) {
    _.POST('/group/' + groupId + '/member', callback);
}

// ----------------------------------------------------------------------------

function getGroupAccess(groupId, callback) {
    _.GET('/group/' + groupId + '/access', callback);
}

// --- Export functions for the module ---

module.exports = {
    updateGroupModerator: updateGroupModerator,
    updateGroupAdmin    : updateGroupAdmin,
    createGroup         : createGroup,
    deleteGroup         : deleteGroup,
    getGroup            : getGroup,
    editGroup           : editGroup,
    listGroupInvitations: listGroupInvitations,
    addGroupInvitation  : addGroupInvitation,
    listGroupMembers    : listGroupMembers,
    removeUserFromGroup : removeUserFromGroup,
    joinGroup           : joinGroup,
    getGroupAccess      : getGroupAccess
};
