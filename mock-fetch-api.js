/*
ISC License:
Copyright (c) 2004-2010 by Internet Systems Consortium, Inc. ("ISC")
Copyright (c) 1995-2003 by Internet Software Consortium

Permission to use, copy, modify, and/or distribute this software for
any purpose with or without fee is hereby granted, provided that the
above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND ISC DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
*/

(function(global) {

require('es6-promise').polyfill();
require('isomorphic-fetch');
var extend = require('object-extend');

var conditions = [];
var failNextCall = false;


global.fetch = function(uri, options) {

   var options = extend({
      method: 'GET',
      headers: null,
   }, options || {});

   if (uri instanceof Request) {
        options = uri;
        uri = uri.url;

        if (!options.method) {
            options.method = 'GET'
        }
    }
   
   return new Promise(function(resolve, reject) {

      if(failNextCall) {

         failNextCall = false;
         return reject("as requested");
      }

      for (var ii = 0; ii < conditions.length; ii++) {

         var criteria = conditions[ii];

         // Compare methods
         if(criteria.method == options.method && criteria.uri == uri) {

            // Compare headers
            for(var jj=0; jj<criteria.headers.length; jj++) {
               var expectedHeader = criteria.headers[jj];

               if(!options.headers || !options.headers.has(expectedHeader.header)
                     || options.headers.get(expectedHeader.header) != expectedHeader.value) {

                  if(expectedHeader.elseResponse) {

                     return resolve(new Response("", {
                        status: expectedHeader.elseResponse.status,
                        statusText: expectedHeader.elseResponse.statusText
                     }));

                  }

                  return resolve(new Response("", {
                     status: 404,
                     statusText: "Not Found"
                  }));

               }
            }

            return resolve(new Response(criteria.response.jsonData, {
               status: criteria.response.status,
               headers: criteria.response.headers
            }));

         }
      }

      return resolve(new Response("", {
         status: 404,
         statusText: "Not Found"
      }));

   });
}


module.exports = {

   when: function(method, uri) {

      var condition = {

         method: method,
         uri: uri,
         headers: [],
         response: null,


         withExpectedHeader: function(header, value) {

            condition.headers.push({
               header: header,
               value: value,
               elseResponse: null
            });

            return condition;
         },


         otherwiseRespondWith: function(status, statusText) {

            if(condition.headers.length > 0) {
               condition.headers[condition.headers.length-1].elseResponse = {
                  status: status,
                  statusText: statusText,
               };
               return condition;
            }
            throw "no preceding header set";
         },


         respondWith: function(status, data, headers) {

            condition.response = {
               status: status,
               jsonData: data,
               headers: headers
            };

            conditions.push(condition);

            return true;
         }
      };

      return condition;
   },


   failNextCall: function () {

      failNextCall = true;
   }

};


})(typeof window === 'undefined' ? this : window);
