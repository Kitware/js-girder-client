## js-girder-client: JavaScript client for a **Girder** server.

### http://kitware.github.io/js-girder-client/

**js-girder-client** is a JavaScript library for interacting with a girder
server instance. The library can be used inside NodeJS or within a browser.
In addition, a command line interface is also provided that allows complex
actions to be scripted.

More information on **Girder** can be found [here](https://github.com/girder/girder).

#### Getting Started

**js-girder-client** can be retrieved using **npm**, **bower** or **source** at GitHub. 

##### npm

```bash
$ npm install -g js-girder-client
```

##### Bower

Inside a Web project that use a bower.json, you can use the following dependency:

```javascript
{
  "name": "my-project",
  "dependencies": {
    "js-girder-client": "master"
  }
}
```
##### Source

```bash
~ $ git clone git@github.com:Kitware/js-girder-client.git
~ $ cd js-girder-client
~/js-girder-client $ npm install 
~/js-girder-client $ npm run test:basic
# => Now browse to http://localhost:3000
```

#### Documentation

See the [documentation](https://js-girder-client.github.io) for a
getting started guide, advanced documentation, and API descriptions.

#### Licensing

**js-girder-client** is licensed under [BSD Clause 3](LICENSE).

#### Getting Involved

Fork our repository and do great things. At [Kitware](http://www.kitware.com),
we've been contributing to open-source software for 15 years and counting, and
want to make **js-girder-client** useful to as many people as possible.
