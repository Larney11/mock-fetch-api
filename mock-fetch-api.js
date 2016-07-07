/**
 *
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
               status: criteria.response.status
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


         respondWith: function(status, data) {

            condition.response = {
               status: status,
               jsonData: data
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
