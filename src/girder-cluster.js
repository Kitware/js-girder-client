var _ = require("./girder-util.js");

function getClusterProfiles(cb) {
    _.GET('clusters?type=trad', cb);
}

function getSingleClusterProfile(id, cb) {
    _.GET('clusters/' + id, cb);
}

function getClusterStatus(id, cb) {
    _.GET('clusters/' + id + '/status', cb);
}

function getClusterLog(taskId, offset, cb) {
    if (offset === undefined || offset < 0, cb) {
        offset = 0;
    }

    _.GET('clusters/' + taskId + '/log', cb);
}

function testCluster(id, cb) {
    _.PUT('clusters/' + id + '/start', cb);
}

function createClusterProfile(prof, cb) {
    _.POST('clusters', prof, cb);
}

function deleteClusterProfile(prof, cb) {
    _.DELETE('clusters/' + prof._id, cb);
}

module.exports = {
    getClusterProfiles: getClusterProfiles,
    getSingleClusterProfile: getSingleClusterProfile,
    getClusterStatus: getClusterStatus,
    getClusterLog: getClusterLog,
    testCluster: testCluster,
    createClusterProfile: createClusterProfile,
    deleteClusterProfile: deleteClusterProfile
}