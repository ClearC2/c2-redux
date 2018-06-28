'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var returnTrue = function returnTrue() {
  return true;
};

var apiMiddleware = function apiMiddleware() {
  var defaultShouldCallAPI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : returnTrue;
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        var types = action.types,
            requestId = action.requestId,
            callAPI = action.callAPI,
            _action$shouldCallAPI = action.shouldCallAPI,
            shouldCallAPI = _action$shouldCallAPI === undefined ? defaultShouldCallAPI : _action$shouldCallAPI,
            _action$payload = action.payload,
            payload = _action$payload === undefined ? {} : _action$payload;


        if (!types || !requestId) {
          // normal action: pass it on
          return next(action);
        }
        if (!Array.isArray(types) || types.length !== 3 || !types.every(function (type) {
          return typeof type === 'string';
        })) {
          throw new Error('Expected an array of three string types.');
        }

        if (typeof callAPI !== 'function') {
          throw new Error('Expected callAPI to be a function.');
        }

        if (typeof shouldCallAPI !== 'function') {
          throw new Error('Expected shouldCallAPI to be a function.');
        }

        if (!shouldCallAPI(getState, requestId)) {
          return;
        }

        var _types = _slicedToArray(types, 3),
            requestType = _types[0],
            successType = _types[1],
            failureType = _types[2];

        dispatch({
          payload: payload,
          type: requestType,
          requestId: requestId
        });
        return callAPI(getState).then(function (response) {
          dispatch({
            payload: payload,
            response: response,
            type: successType,
            requestId: requestId
          });
          return response;
        }, function (error) {
          dispatch({
            payload: payload,
            error: error,
            type: failureType,
            requestId: requestId
          });
          return error;
        });
      };
    };
  };
};

exports.default = apiMiddleware;