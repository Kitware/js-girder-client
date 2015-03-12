var callbackStack = [];

// ----------------------------------------------------------------------------

function callback(error, response) {
    callbackStack.push({error: error, response: response});
};

// ----------------------------------------------------------------------------

function waitAndRun(fn) {
    waitsFor(function() { 
        return callbackStack.length != 0;
    }, "No callback before timeout", 5000);

    runs(function(){
        fn(callbackStack.pop());
    });
}

// ----------------------------------------------------------------------------

function done(doneCB) {
    // NoOp
}

// ----------------------------------------------------------------------------

module.exports = callback;
module.exports.waitAndRun = waitAndRun;
module.exports.done = done;

