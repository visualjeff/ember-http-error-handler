# Ember-http-error-handler

A http reponse code error handler.  Handles everything from a 400 to a 505 return code.  You could extend the error template so as to use a locale addon to provide a localized and much friendlier message.  Just a suggestion.

## Installation:
```bash
   npm install ember-http-error-handler
```
   Add the following error route to your project's app/router.js file:

      this.route('error', { path: '/error/:statusCode/:errorMessageKey' });

## Usage:
```javascript
   var url = 'http://localhost:4200/testService';
   Ember.$.ajax({
       url: url,
       type: 'POST',
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       headers: {
         'Accept': 'application/json'
       },
       success: function(data) {
             self.resolve(data); //success callback invoked
       },
       error: function(request, textStatus, error) {
           //Optionals (after the request parameter) allow for overriding the default errorRoute and logoutURL.
           self.httpErrorHandler.errorHandler.call(self, request);
       }
   });
```

I tested this addon using the following ember project:
https://github.com/visualjeff/addon-test
