module.exports = function (girder, port, host, protocol) {
    if(!host) {
        host = 'localhost';
    }
    if(!port) {
        port = 8080;
    }
    if(!protocol) {
        protocol = 'http:';
    }
    console.log("--------------------------------------------------------------------------------");
    console.log("--- Usage : girder-client --init-girder-for-test ${port} ${host} ${protocol} ---");
    console.log("--------------------------------------------------------------------------------\n");

    console.log(" => Running against: " + protocol + "//" + host + ':' + port);
    
    // Configure Girder Client accordingly
    girder({ port: port, host: host, protocol: protocol});

    // -------------------------------------------------------------------------

    console.log("\n => Register admin user (admin / admin-password)");
    var adminResp = girder.createUser({
        'login': 'admin', 
        'password': 'admin-password', 
        'email': 'admin@girder-test.com', 
        'firstName': 'Administrator', 
        'lastName': 'GirderTestServer', 
        'admin': true
    });
    if(adminResp.status === 200) {
        var admin = adminResp.content;
        console.log("  - Done " + admin.firstName + ' ' + admin.lastName + ' | E-Mail: ' + admin.email + ' | Id: ' + admin._id);
    } else {
        console.log("  - Error: " +  adminResp.content.message);
    }
    
    // -------------------------------------------------------------------------

    console.log("\n => Register standard user (std-user / std-user-password)");
    var stdUserResp = girder.createUser({
        'login': 'std-user', 
        'password': 'std-user-password', 
        'email': 'std-user@girder-test.com', 
        'firstName': 'Standard User', 
        'lastName': 'GirderTestServer', 
        'admin': false
    });
    if(stdUserResp.status === 200) {
        var stdUser = stdUserResp.content;
        console.log("  - Done " + stdUser.firstName + ' ' + stdUser.lastName + ' | E-Mail: ' + stdUser.email + ' | Id: ' + stdUser._id);
    } else {
        console.log("  - Error: " +  stdUserResp.content.message);
    }
};
