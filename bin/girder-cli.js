#! /usr/bin/env node

var fs = require('fs'),
    sync = require('synchronize'),
    girder = require('../src/girder.js'),
    script = null,
    execOptions = { args: [], command: null, config: null , session: null, extract: [], debug: false, url: 'http://localhost:8080', api: "/api/v1" },
    keywordsFn = {
        '--session': function(i) {
            // Extract token from session if any
            execOptions.session = process.argv[i+1];
            extractConfigFromSession();
            return i + 1;
        }, 
        '--url': function(i) {
            // Extract token from session if any
            execOptions.url = process.argv[i+1];
            return i + 1;
        }, 
        '--api': function(i) {
            // Extract token from session if any
            execOptions.api = process.argv[i+1];
            return i + 1;
        }, 
        '--command': function(i) {
            execOptions.command = process.argv[i+1];
            return i + 1;
        }, 
        '--json': function(i){
            execOptions.args.push(JSON.parse(process.argv[i+1]));
            return i + 1;
        }, 
        '--reset': function(i) {
            // Delete session file
            var filePath = '.girder-session-' + execOptions.session;
            if(execOptions.session && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return i;
        }, 
        '--debug': function(i) {
            execOptions.debug = true;
            return i;
        }, 
        '--extract': function(i) {
            execOptions.extract = process.argv[i+1].split('.');
            return i + 1;
        }, 
        '--script': function(i) {
            script = require(process.argv[i+1]);
            return i + 1;
        }, 
        '--help': function(i) {
            if(!script) {
                console.log('\nUsage: girder-client [options]');
                console.log('\n --session ${name}\n\n\t Create a local hidden file to store the user token and server URL.');
                console.log('\n --reset\n\n\t Remove the session file ".girder-session-${name}"');
                console.log('\n --url "http://localhost:8080"\n\n\t URL to the girder instance.\n\t (OPTIONAL)');
                console.log('\n --api "/api/v1"\n\n\t Girder API endpoint.\n\t (OPTIONAL)"');
                
                console.log('\n --debug\n\n\t Add extra output');
                console.log('\n --extract ${query} // i.e: content.list.0.name\n\n\t Extract from the response of a --command a subset using the dot notation.' + 
                            '\n\t A response object will typically look like' + 
                            '\n\t   { ' + 
                            '\n\t      status: 200,' + 
                            '\n\t      headers: { date: "Thu, 12 Mar 2015 21:20:34 GMT", content-length: "1184" },' +
                            '\n\t      content: [ ... ] or { ... } ' +
                            '\n\t   }');

                console.log('\n --script /path-to-javascript/my-file.js\n\n\t Provide a JavaScript execution script."');
                console.log('\n --command ${command} ${arg_0} ... ${arg_n} --json "{ \\\"key\\\" : \\\"value\\\" }"');
                console.log('\n\t Run a girder command where the argument after any --json\n\t will be converted into a JSON object');

                console.log('\nCommand list:');
                for(var key in girder) {
                    console.log("  - " + girder[key].toString().split('{')[0].replace(/function /g, ''));
                }
                console.log();
                return;
            }

            return i;
        }
    };

// ----------------------------------------------------------------------------

function extractConfigFromSession() {
    var session = execOptions.session,
        filePath = '.girder-session-' + session;

    if(fs.existsSync(filePath)) {
        execOptions.config = JSON.parse(fs.readFileSync(filePath).toString());
    }
}

// ----------------------------------------------------------------------------

function saveConfigToSession() {
    if(execOptions.session && execOptions.config) {
        fs.writeFileSync('.girder-session-' + execOptions.session, JSON.stringify(execOptions.config));
    }
}

// ----------------------------------------------------------------------------

function extractTokenFromResponse(response) {
    if(response && response.content && response.content.authToken) {
        execOptions.config = execOptions.config || {};
        execOptions.config.token = response.content.authToken.token;
        return true;
    }

    return false;
}

// ----------------------------------------------------------------------------

function updateConfig() {
    var urlSplit = execOptions.url.split(':');

    execOptions.config = execOptions.config || {};
    execOptions.config.basepath = execOptions.api;
    execOptions.config.host = urlSplit[1].substring(2);
    execOptions.config.port = (urlSplit.length === 3) ? urlSplit[2] : 80;
    execOptions.config.protocol = urlSplit[0] + ':';

    return execOptions.config;
}

// ----------------------------------------------------------------------------

function callback(error, response) {
    if(error) {
        if(execOptions.debug) {
            console.log('===== ERROR ======');
            console.log(error);
            console.log('===== END ======');
        } else {
            console.log(error);
        }
        return;
    }

    // Check is response as token
    if(extractTokenFromResponse(response)) {
        saveConfigToSession();
    }

    if(execOptions.debug) {
        console.log('===== OUTPUT ======');
    }

    // Look for extract
    if(execOptions.extract.length) {
        var output = response;
        for(var i = 0; i < execOptions.extract.length && (output !== null); ++i) {
            output = output[execOptions.extract[i]];
        }
        console.log(output);
    } else {
        console.log(response);
    }

    if(execOptions.debug) {
        console.log('===== END ======');
    }
}

// ----------------------------------------------------------------------------
// Process arguments
// ----------------------------------------------------------------------------

for(var i = 2; i < process.argv.length; ++i) {
    var arg = process.argv[i];

    if(arg in keywordsFn) {
        i = keywordsFn[arg](i);
    } else {
        execOptions.args.push(arg);
    }
}

if(execOptions.debug) {
    console.log('===== DEBUG ======');
    console.log(execOptions);
}

// ----------------------------------------------------------------------------
// Update girder configuration
// ----------------------------------------------------------------------------

girder(updateConfig());

// ----------------------------------------------------------------------------
// Execute girder command
// ----------------------------------------------------------------------------

if(execOptions.command) {
    var f = girder[execOptions.command],
        args = [].concat(execOptions.args, callback);

    // Run command line
    f.apply(girder, args);
}

// ----------------------------------------------------------------------------
// Execute girder script
// ----------------------------------------------------------------------------

if(script) {
    var synchGirder = girder,
        args = [].concat(synchGirder, execOptions.args);;

    // Make girder API sync
    for(var key in girder) {
        synchGirder[key] = sync(girder[key]);
    }

    // Run the script in a synchronous manner
    sync.fiber(function(){
        script.apply(script, args);
    });
}
