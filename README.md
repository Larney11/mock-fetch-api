# mock-fetch-api
<<<<<<< HEAD
This is a mock fetch API created for unit testing communication between a server

## Installation
    npm install --save-dev mock-fetch-api

## Usage
    var MockFetch = require('mock-fetch-api');

### Functions

#### when()
The when() function sets the required method and URL.  
```js
when(method, URL)    
when('GET', 'http://mydomain.com')    
```

#### withExpectedHeader()
The withExpectedHeader() function sets the required headers.  
```js
withExpectedHeader(Header-Field-Name, Header-Field-Type)  
withExpectedHeader('Content-Type', 'application/json')  
```


#### otherwiseRespondWith()
The otherwiseRespondWith() function sets the Response if the header does not match the header set in the withExpectedHeader() function  
```js
otherwiseRespondWith(status, statusText)  
otherwiseRespondWith(401, 'not authorised')  
```

#### respondWith()
The respondWith() function sets the Response if all the requirements specified with the when() and withExpectedHeader() functions correspond with what is passed to the fetch().  
```js
respondWith(status, data)  
respondWith(401, '{"data":[{"text":"Hello"},{"text":"Goodbye"}]}')  
```

#### failNextCall()
The failNextCall() function forces the fetch to reject().  
```js
failNextCall()
```

## Examples
<strong>Check out the '__tests__' directory to view all examples. </strong> https://github.com/Larney11/mock-fetch-api/blob/master/__tests__/mock-fetch-api-test.js  

The following examples are unit tests using Jest.  

```js

pit("can set a condition which is returned by fetch", () => {
  var MockFetch  = require('../MockFetch.js');

  MockFetch.when('GET', 'http://mydomain.com').respondWith(200, '"Hello World"');

  return fetch('GET', 'http://mydomain.com').then((response) => {
     return response.json();

  }).then((data) => {
     expect(data).toBe('Hello World');
  });
});


pit("only responds when matched correctly", () => {
  var MockFetch  = require('mock-fetch-api');

  MockFetch.when('GET', 'http://mydomain.com').respondWith(200, '"Hello World"');

  return fetch('http://mydomain.com', { method: 'PUT'}).then((response) => {

  expect(response.status).toBe(404);
  expect(response.statusText).toBe('Not Found');
  });
});    


pit("also checks for an expected header value", () => {
   var MockFetch  = require('../MockFetch.js');

   MockFetch.when('GET', 'http://mydomain.com')
      .withExpectedHeader('X-AuthToken','1234')
      .otherwiseRespondWith(401, "Not Authorized")
      .respondWith(200, '"Hello World"');

   return fetch('http://mydomain.com', { method: 'GET', headers: new Headers({
      'X-AuthToken':'1234'
   })}).then((response) => {
      expect(response.status).toBe(200);
   });
});


pit("fails when expected header is not set", () => {
   var MockFetch  = require('../MockFetch.js');

   MockFetch.when('GET', 'http://mydomain.com')
      .withExpectedHeader({'X-AuthToken':'1234'}).otherwiseRespondWith(401, "Not Authorized")
      .respondWith(200, '"Hello World"');

   return fetch('http://mydomain.com', { method: 'GET'}).then((response) => {

      expect(response.status).toBe(401);
      expect(response.statusText).toBe('Not Authorized');
   });
});


pit("can check for multiple expected headers", () => {
   var MockFetch  = require('../MockFetch.js');

   MockFetch.when('GET', 'http://mydomain.com')
      .withExpectedHeader('X-AuthToken','1234').otherwiseRespondWith(401, "Not Authorized")
      .withExpectedHeader('Content-Type', 'application/json').otherwiseRespondWith(404, "Not Found")
      .respondWith(200, '"Hello World"');

   return fetch('http://mydomain.com', { method: 'GET', headers: new Headers({
      'X-AuthToken':'1234',
      'Content-Type': 'application/json'
   })}).then((response) => {

      expect(response.status).toBe(200);
   });
});


pit("rejects the promise when simulating a failed network connection", () => {
   var MockFetch  = require('../MockFetch.js');

   MockFetch.when('GET', 'http://mydomain.com')
      .respondWith(200, '"Hello World"');

   MockFetch.failNextCall();
   return fetch('http://mydomain.com').then((response) => {
      expect(false).toBe(true);
   }, (error) => {
      expect(true).toBe(true);
   });
});
```
=======
gjgj
>>>>>>> 960029188f4489b5b53e199ea4b6e4ca84f3a184
