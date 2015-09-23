import Ember from 'ember';

/*
 * Ember httpErrorHandler initializer is a dependecy injected service singleton.
 * Created by visualjeff
 *
 * Example usage:
 *
 *   Ember.$.ajax({
 *     url: url,
 *     type: 'POST',
 *     contentType: 'application/json; charset=utf-8',
 *     dataType: 'json',
 *     headers: {
 *       'Accept': 'application/json'
 *     },
 *     success: function(data) {
 *       Ember.debug("Success callback invoked");
 *       self.resolve(data);
 *     },
 *     error: function(request, textStatus, error) {
 *         self.httpErrorHandler.errorHandler.call(self, request);
 *     }
 *   });
 */
export function initialize(container, application) {
    let httpErrorHandler = Ember.Object.extend({

        /**
         * @method errorHandler
         * @param {request} http request
         * @param {errorRoute} [options='error']
         * @param {logoutURL} [options='/']
         * @return {Transition}
         * @throws {Error} An error.
         */
        errorHandler: function(request, errorRoute='error', logoutURL='/') {
            Ember.assert('Must pass in a request object for the first parameter', request);
            Ember.assert('Must pass in a request object for the first parameter', request.status !== 'undefined');
            Ember.assert('Must pass in a errorRoute for the second parameter', errorRoute);
            Ember.assert('Must pass in a logoutURL object for the third parameter', logoutURL);

            //Map request status codes / errors for the appropriate error response.
            const ERRORS = Object.freeze(Ember.Map.create()
                .set(400, 'badRequest')
                .set(401, function() {
                    window.location.href = logoutURL;
                    return true;
                })
                .set(402, 'paymentRequired')
                .set(403, 'forbidden')
                .set(404, 'pageNotFound')
                .set(405, 'methodNotAllowed')
                .set(406, 'notAcceptable')
                .set(407, 'proxyAuthenticationRequired')
                .set(408, 'requestTimeout')
                .set(409, 'conflict')
                .set(410, 'gone')
                .set(411, 'length')
                .set(412, 'preconditionFailed')
                .set(413, 'requestEntityTooLarge')
                .set(414, 'requestURITooLong')
                .set(415, 'unsupportedMediaType')
                .set(416, 'requestRangeNotSatisfiable')
                .set(417, 'expectationFailed')
                .set(500, 'systemDown')
                .set(501, 'notImplemented')
                .set(502, 'badGateway')
                .set(503, 'serviceUnavailable')
                .set(504, 'gatewayTimeout')
                .set(505, 'notSupported'));

            let status = request.status || 500;
            switch(Object.prototype.toString.call((ERRORS.get(status))).slice(8, -1)) {
              case 'String':
                try {
                  return this.transitionTo(errorRoute, {
                    statusCode: request.status,
                    errorMessageKey: ERRORS.get(status)
                  });
                } catch (e) {
                  Ember.debug(e.message);
                  return this.transitionTo(errorRoute, {
                    statusCode: 500,
                    errorMessageKey: 'systemDown'
                  });
                }
                break;
              case 'Function':
                //UNAUTHORIZED - Browser routed back to loginURL.
                return ERRORS.get(status)();
              default:
            }
        }
    });

    //Register with ember
    application.register('service:httpErrorHandler', httpErrorHandler);
    //Inject in all routes
    application.inject('route', 'httpErrorHandler', 'service:httpErrorHandler');
}

export default {
    name: 'http-error-handler',
    initialize: initialize,
    before: '',
    after: ''
};
