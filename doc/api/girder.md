# Girder #

Root module for the Girder client which will be extended with the other module
set.

Although those are the current methods defined within the core.
This documentation will just focus on the 3 following methods

```js
var girder = require('girder');

function callback(error, response) {
    if(error) {
        throw error.
    }

    console.log(response);
}

girder( config );
girder.login( user, password, callback );
// ... do stuff ...
girder.logout( callback )

```

## module(options)

This method is used to describe where the client should connect to.
The default set of options available are:

```js
{
    basepath : "/api/v1",
    host     : "localhost",
    port     : 8080,
    token    : null,
    userAuth : null,
    protocol : "http:"
}
```

A user/password can also be provided which will trigger an automatic login. 

```js
{
    user     : "seb",
    password : "MySuperPassword"
}
```

## login(name, password, callback)

FIXME

## logout(callback)

FIXME
