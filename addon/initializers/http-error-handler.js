import Ember from 'ember';

/*
 * Ember httpErrorHandler initializer is a dependecy injected service singleton.
 * Created by visualjeff
 *
 * Default 'error' route uses a model override strategy.
 * Template can access the model.properties to query for a locale supported message.  *
 *
 * Call the httpErrorHandler like this:
 *
 *   httpErrorHandler.errorHandler.call(this, error);
 *
 * You can provide your own overriding config/environment.js 'baseURL' and 'errorRoute' properties if you don't like the defaults.
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
            //Map request status codes / errors for the appropriate error response.
            let errors = Ember.Map.create()
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
                .set(505, 'notSupported');

            let is = (obj) => Object.prototype.toString.call(obj).slice(8, -1);

            if (request && typeof request.status !== 'undefined' && errors.has(request.status)) {
                Ember.debug("1");
                Ember.debug(request.status);
                Ember.debug(errors.get(request.status));
                Ember.debug(is(errors.get(request.status)));
                if (is(errors.get(request.status)) === 'String') {
                    Ember.debug("2");
                    try {
                        Ember.debug("3");
                        return this.transitionTo(errorRoute, {
                            statusCode: request.status,
                            errorMessageKey: errors.get(request.status)
                        });
                    } catch (e) {
                        Ember.debug(e.message);
                        return this.transitionTo(errorRoute, {
                            statusCode: 500,
                            errorMessageKey: 'systemDown'
                        });
                    }
                } else if (is(errors.get(request.status)) === 'Function') {
                    Ember.debug("UNAUTHORIZED - You are being routed back to your baseURL for authentication.  In theory...");
                    return errors.get(request.status)();
                }
            } else if (request && typeof request.status !== 'undefined' && request && !errors.has(request.status)) {
                return this.transitionTo(errorRoute, {
                    statusCode: 500,
                    errorMessageKey: 'systemDown'
                });
            } else if (request && typeof request.status === 'undefined') {
                Ember.debug('request object status property is undefined');
            }
        }
    });

    //Register with ember
    application.register('service:httpErrorHandler', httpErrorHandler);
    //Inject in all routes.  Could be injected into other objects
    application.inject('route', 'httpErrorHandler', 'service:httpErrorHandler');
}

export default {
    name: 'http-error-handler',
    initialize: initialize,
    before: '',
    after: ''
};
