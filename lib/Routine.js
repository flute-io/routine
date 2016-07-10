(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("routine", [], factory);
	else if(typeof exports === 'object')
		exports["routine"] = factory();
	else
		root["routine"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Routine = function () {
		_createClass(Routine, null, [{
			key: "set",
			value: function set(scope) {
				return new Routine(scope);
			}
		}]);
	
		function Routine(scope) {
			_classCallCheck(this, Routine);
	
			this.actions = [];
			this.lastResult = undefined;
	
			this.scope = scope;
		}
	
		_createClass(Routine, [{
			key: "addAction",
			value: function addAction(action) {
				this.actions.push(action);
			}
		}, {
			key: "first",
			value: function first(action) {
				this.addAction(action);
				return this;
			}
		}, {
			key: "then",
			value: function then(action) {
				this.addAction(action);
				return this;
			}
		}, {
			key: "run",
			value: function run() {
				var scope = this.scope;
				var action = void 0,
				    lastResult = void 0,
				    i = 0;
	
				for (i; i < this.actions.length; i++) {
	
					action = this.actions[i];
	
					lastResult = action.call(this.scope, this.lastResult);
	
					if (lastResult instanceof Promise) {
						var promise = lastResult;
						var actionsToPromisify = this.actions.slice(i + 1, this.actions.length);
	
						promise.then(function () {
							return lastResult;
						});
	
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;
	
						try {
							var _loop = function _loop() {
								var action = _step.value;
	
								promise.then(function (arg) {
									return action.call(scope, arg);
								});
							};
	
							for (var _iterator = actionsToPromisify[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								_loop();
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}
	
						return promise;
					}
				}
	
				return lastResult;
			}
		}]);
	
		return Routine;
	}();
	
	exports.default = Routine;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=Routine.js.map