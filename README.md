# Ember-http-error-handler

A http reponse code error handler.  Interprets everything from a 400 to a 505.  You can then use a local add-on to provide a localized and friendly message.

## Installation:
```bash
   npm install ember-http-error-handler
```
   Add the following error route to your project's app/router.js file:

      this.route('error', { path: '/error/:statusCode/:errorMessageKey' });

## Usage:
```javascript
   Ember.$.ajax({
       url: url,
       type: 'POST',
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       headers: {
         'Accept': 'application/json'
       },
       success: function(data) {
             Ember.debug("Success callback invoked");
             self.resolve(data);
       },
       error: function(request, textStatus, error) {
         if (request.status >= 400) {
           //optionals (after request parameter) allow for overriding the errorRoute and logoutURL.
           self.httpErrorHandler.errorHandler.call(self, request);
         }
       }
   });
```
