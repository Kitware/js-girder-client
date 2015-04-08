// Internal module used to abstract HTTP request between a node and browser
// implementation.

var basepath = "/api/v1",
    host     = "localhost",
    port     = 8080,
    token    = null,
    userAuth = null,
    protocol = "http:";

function NoOp(){}


// Helper to extract optional arguments and callback
// This assume the callback parameter being the last one.
function argsProcessor(keys, args) {
    var argMap = {},
        argsArray = [];

    for(var i = 0; i < args.length; ++i) {
        argsArray.push(args[i]);
    }

    // Extract callback (Last arg)
    argMap[keys.pop()] = argsArray.pop();

    // Fill remaining keys
    while(keys.length) {
        argMap[keys.shift()] = (argsArray.length ? argsArray.shift() : undefined);    
    }

    return argMap;
}

// Update module configuration
function update(config) {
    basepath = config.basepath  || basepath;
    host     = config.host      || host;
    port     = config.port      || port;
    protocol = config.protocol  || protocol;
    token    = config.token     || token;

    updateUser(config.user, config.password);
}

// Reset authentication
function resetAuth() {
    token    = null;
    userAuth = null;
}

// Update user authentication information
function updateUser(user, password) {
    if(user && password) {
        if(typeof __BROWSER_BUILD__ != 'undefined' && __BROWSER_BUILD__) {
            userAuth = 'Basic ' + btoa(user + ':' + password);
        } else {
            userAuth = 'Basic ' + new Buffer(user + ':' + password).toString('base64');
        }
    }
}

// Generate URI parameter based on a Map and an array of string of include and exclude.
function extractQuery(queryMap, filterKeys, excludeKeys) {
    var queryBuffer = [];

    queryMap = queryMap || {};

    for(var key in queryMap) {
        if(excludeKeys && (excludeKeys.indexOf(key) !== -1)) {
            continue;
        }
        if(filterKeys && (filterKeys.indexOf(key) === -1)) {
            continue;
        }
        queryBuffer.push(encodeURIComponent(key) + '=' + encodeURIComponent(queryMap[key]));
    }

    if(queryBuffer.length) {
        return "?" + queryBuffer.join('&');
    }

    return '';
}

// Build the request description for Girder
function makeRequest(method, url, formData) {
    var requestObject = {  
        method      : method,      
        host        : host,
        port        : port,
        protocol    : protocol,
        headers: {
            Accept: 'application/json'
        }
    };

    if(typeof __BROWSER_BUILD__ != 'undefined' && __BROWSER_BUILD__) {
        requestObject.url = basepath + url;
    } else {
        requestObject.path = basepath + url;
    }

    if(token) {
        requestObject.headers['Girder-Token'] = token; 
    } else if(userAuth) {
        requestObject.headers.Authorization = userAuth; 
    }

    if(formData) {
        var fHeaders = formData.getHeaders();
        for(var key in fHeaders) {
            requestObject.headers[key] = fHeaders[key];
        }
    }

    return requestObject;
}

// Helper for node implementation
function handleResponse(callback) {
    if(!callback) {
        return NoOp;
    }

    var buffer = [];
    return function(response) {
        response.on('data', function(chunk) {
                buffer.push(chunk);
        });
        response.on('end', function() {
            callback( null, 
                     { status  : response.statusCode, 
                       headers : response.headers, 
                       content : JSON.parse(buffer.join('')) });
        });
    };
}

// Helper for browser implementation
function attachSuccessError(requestObj, callback) {
    if(callback) {
        requestObj.success = function(response,a,b,c,d) {
            callback(null, { content: response, status: 200, headers: {}});
        };
        requestObj.error = function(response) {
            callback(response);
        };
    }
    return requestObj;
}

// Helper for node implementation
function handleRequest(request, formData, callback) {
    var args = argsProcessor(['request', 'formData', 'callback'], arguments);

    if(args.callback) {
        request.on('error', function(err) {
            args.callback(new Error(err), null);
        });
    }

    if(typeof __BROWSER_BUILD__ != 'undefined' && __BROWSER_BUILD__) {
        console.error("Skip form data");
    } else {
        if(args.formData) {
            formData.pipe(request);
        }
    }

    request.end();
}

// Expose module API
module.exports = {
    update      : update,
    resetAuth   : resetAuth,
    extractQuery: extractQuery,
    args        : argsProcessor
};

// Browser specific code
if(typeof __BROWSER_BUILD__ != 'undefined' && __BROWSER_BUILD__) {
    var httpClient = require('reqwest');
    module.exports.GET = function (url, callback) {
        httpClient(attachSuccessError(makeRequest('get', url), callback));
    };

    module.exports.DELETE = function (url, callback) {
        httpClient(attachSuccessError(makeRequest('delete', url), callback));
    };

    module.exports.PUT = function (url, callback) {
        httpClient(attachSuccessError(makeRequest('put', url), callback));
    };

    module.exports.POST = function (url, callback) {
        httpClient(attachSuccessError(makeRequest('post', url), callback));
    };
} else {
    // Node specific code
    var http = require('http');
    module.exports.GET = function (url, callback) {
        handleRequest( http.request(makeRequest('GET', url), handleResponse(callback)), callback);
    };

    module.exports.DELETE = function (url, callback) {
        handleRequest( http.request(makeRequest('DELETE', url), handleResponse(callback)), callback);
    };

    module.exports.PUT = function (url, callback) {
        handleRequest( http.request(makeRequest('PUT', url), handleResponse(callback)), callback);
    };

    module.exports.POST = function (url, formData, callback) {
        var args = argsProcessor(['url', 'formData', 'callback'], arguments);

    handleRequest( http.request(makeRequest('POST', url, args.formData), handleResponse(args.callback)), args.formData, args.callback);
    };
}
