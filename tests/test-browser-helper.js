(function(window){
    var callbackStack = [],
        callbackFnStack = [],
        intervalID = null;

    // ----------------------------------------------------------------------------
    
    function callback(error, response) {
        callbackStack.push({error: error, response: response});
    };

    // ----------------------------------------------------------------------------

    function waitAndRun(fn) {
        callbackFnStack.push(fn);
    }

    // ----------------------------------------------------------------------------

    function processCallbackFnStack() {
        if(callbackStack.length > 0 && callbackFnStack.length > 0) {
            var data = callbackStack.shift(),
                fn = callbackFnStack.shift();
         
            fn(data);
        }
    }
    
    // ----------------------------------------------------------------------------
    
    intervalID = setInterval(processCallbackFnStack, 200);

    // ----------------------------------------------------------------------------

    function done(fn) {
        window.clearInterval(intervalID)
        fn();
    }

    // ----------------------------------------------------------------------------

    window.testHelper = callback;
    window.testHelper.waitAndRun = waitAndRun;
    window.testHelper.done = done;

})(window);
