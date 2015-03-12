if(typeof jest !== 'undefined') {
    jest.autoMockOff();

    var girder = require('../girder'),
        girderConfig = require('../../tests/girder-config'),
        testHelper = require('../../tests/test-helper');
}

describe("Girder login", function() {
    it('test login/me/logout/me', function(done) { 
        var me = null;

        // Configure server
        girder({port:girderConfig.port});
        girder.login(girderConfig.login, girderConfig.password, testHelper);

        // Look at Login() response
        testHelper.waitAndRun(function(data) {
            // No error
            expect(data.error).toBeNull();

            // Got user            
            expect( data.response
                    && data.response.content 
                    && data.response.content.user).toBeTruthy();

            // Store the user
            me = data.response.content.user;

            // Got authToken
            expect( data.response
                    && data.response.content 
                    && data.response.content.authToken
                    && data.response.content.authToken.token).toBeTruthy();

            // Valid token form
            expect(data.response.content.authToken.token.length).toBe(64);

            // Make a new request
            // => Get current logged in user
            girder.me(testHelper);
        }); 

        // Look at Me() response
        testHelper.waitAndRun(function(data) {
            // No error
            expect(data.error).toBeNull();

            // Got user            
            expect( data.response
                    && data.response.content).toBeTruthy();

            // Same user as the login one
            expect(data.response.content).toEqual(me);

            // Make a new request
            // => Logout
            girder.logout(testHelper);
        });

        // Look at Logout() response
        testHelper.waitAndRun(function(data) {
            // No error
            expect(data.error).toBeNull();

            // Got response            
            expect( data.response
                    && data.response.content).toBeTruthy();

            // Make a new request
            // => Me() while not being logged in
            girder.me(testHelper);
        });

        // Look at Me() response (When not logged in)
        testHelper.waitAndRun(function(data) {
            // No error
            expect(data.error).toBeNull();

            // No me        
            expect(data.response.content).toBeNull();

            testHelper.done(done);
        });
    });
});
