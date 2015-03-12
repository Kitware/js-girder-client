describe("Validate testing environment", function() {

    it('test globals', function() { 
        expect(girder).toBeDefined();
    });

    it('test girder proxy', function(done){
        girder({port:Number(window.location.port)});
        
        girder.listUsers(function(error, data){
            expect(error).toBeNull();

            var users = data.content,
                count = users.length;

            while(count--) {
                console.log(' - '+ users[count].login + '  \t: ' + users[count].firstName + ' ' + users[count].lastName);
            }

            return done();
        });
    });
});
