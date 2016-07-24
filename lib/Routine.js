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

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// export {ensureThat} from './EnsureThat'; // TODO: Uncomment or remove
	
	var Routine = function () {
		function Routine(scope) {
			_classCallCheck(this, Routine);
	
			this.aborted = false;
			this.operations = [];
			this.handlers = {};
			this.currentOperation = undefined;
			this.isSynchronous = true;
	
			this.scope = scope || {};
	
			this.scope.routine = this;
		}
	
		_createClass(Routine, [{
			key: 'addOperation',
			value: function addOperation(operation) {
	
				Routine.validateOperation(operation);
	
				this.operations.push(operation);
	
				return this;
			}
		}, {
			key: 'first',
			value: function first(operation) {
				this.addOperation(operation);
				return this;
			}
		}, {
			key: 'then',
			value: function then(operation) {
				this.addOperation(operation);
				return this;
			}
		}, {
			key: 'on',
			value: function on(eventName, operation) {
				var _this = this;
	
				Routine.validateOperation(operation);
	
				if (!this.handlers[eventName]) {
					this.handlers[eventName] = [];
				}
	
				this.handlers[eventName].push(function (arg) {
					return operation.call(_this.scope, arg);
				});
				return this;
			}
		}, {
			key: 'use',
			value: function use(decorator) {
				decorator(this);
			}
		}, {
			key: 'abort',
			value: function abort() {
				this.aborted = true;
			}
		}, {
			key: 'invoke',
			value: function invoke() {
				var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
				var operation = _ref.operation;
				var args = _ref.args;
				var _ref$hasMultipleArgs = _ref.hasMultipleArgs;
				var hasMultipleArgs = _ref$hasMultipleArgs === undefined ? false : _ref$hasMultipleArgs;
				var _ref$respectAbort = _ref.respectAbort;
				var respectAbort = _ref$respectAbort === undefined ? true : _ref$respectAbort;
				var _ref$recordIt = _ref.recordIt;
				var recordIt = _ref$recordIt === undefined ? true : _ref$recordIt;
				var _ref$runHandlers = _ref.runHandlers;
				var runHandlers = _ref$runHandlers === undefined ? true : _ref$runHandlers;
	
	
				var invocation = {
					operation: operation,
					args: args,
					hasMultipleArgs: hasMultipleArgs,
					respectAbort: respectAbort,
					recordIt: recordIt,
					runHandlers: runHandlers
				};
	
				if (invocation.runHandlers && this.handlers['before-invoking-operation']) {
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;
	
					try {
						for (var _iterator = this.handlers['before-invoking-operation'][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var handle = _step.value;
	
							handle(invocation);
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
				}
	
				if (invocation.respectAbort && this.aborted) {
					return;
				}
	
				if (invocation.recordIt) {
					this.currentOperation = invocation.operation;
				}
	
				var result = void 0;
	
				if (Routine.isRunnable(invocation.operation)) {
					result = invocation.operation.run(this);
				} else {
					if (invocation.hasMultipleArgs) {
						result = invocation.operation.apply(this.scope, invocation.args);
					} else {
						result = invocation.operation.call(this.scope, invocation.args);
					}
				}
	
				if (runHandlers && this.handlers['after-invoking-operation']) {
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;
	
					try {
						for (var _iterator2 = this.handlers['after-invoking-operation'][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var aspect = _step2.value;
	
							aspect({ operation: operation, args: args, hasMultipleArgs: hasMultipleArgs, respectAbort: respectAbort, recordIt: recordIt, result: result });
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				}
	
				return result;
			}
		}, {
			key: 'run',
			value: function run() {
				var lastResult = void 0;
	
				try {
					for (var i = 0; i < this.operations.length; i++) {
						var operation = this.operations[i];
	
						lastResult = this.invoke({
							operation: operation,
							args: lastResult
						});
	
						if (lastResult instanceof Promise) {
							this.isSynchronous = false;
							var operationsToPromisify = this.operations.slice(i + 1, this.operations.length);
							return runAsynchronously(this, operationsToPromisify, lastResult);
						}
					}
	
					return lastResult;
				} catch (error) {
					Routine.handleError(this, error);
				}
			}
		}, {
			key: 'set',
			value: function set(scope) {
				for (var prop in scope) {
					if (scope.hasOwnProperty(prop)) {
						this.scope[prop] = scope;
					}
				}
				return this;
			}
		}, {
			key: 'setup',
			get: function get() {
				return {
					as: function as() {
						for (var _len = arguments.length, operations = Array(_len), _key = 0; _key < _len; _key++) {
							operations[_key] = arguments[_key];
						}
	
						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;
	
						try {
							for (var _iterator3 = operations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var operation = _step3.value;
	
								Routine.validateOperation(operation);
								this.invoke({
									operation: operation,
									args: this,
									respectAbort: false,
									runAspects: false
								});
							}
						} catch (err) {
							_didIteratorError3 = true;
							_iteratorError3 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion3 && _iterator3.return) {
									_iterator3.return();
								}
							} finally {
								if (_didIteratorError3) {
									throw _iteratorError3;
								}
							}
						}
					}
				};
			}
		}, {
			key: 'and',
			get: function get() {
				return this;
			}
		}, {
			key: 'but',
			get: function get() {
				return this;
			}
		}], [{
			key: 'use',
			value: function use(decorator) {
				var routine = new Routine();
	
				routine.use(decorator);
	
				return routine;
			}
		}, {
			key: 'set',
			value: function set(scope) {
				return new Routine(scope);
			}
		}, {
			key: 'isRunnable',
			value: function isRunnable(operation) {
				return (typeof operation === 'undefined' ? 'undefined' : _typeof(operation)) === 'object' && operation.run !== undefined;
			}
		}, {
			key: 'validateOperation',
			value: function validateOperation(operation) {
				if (!Routine.isRunnable(operation) && typeof operation !== 'function') {
					throw new Error('Invalid operation type - An operation has to ' + 'either be a function or an object with a `run()` method. Instead an operation of type ' + ('\'' + (typeof operation === 'undefined' ? 'undefined' : _typeof(operation)) + '\' was supplied.'));
				}
			}
		}, {
			key: 'handleError',
			value: function handleError(routine, error) {
	
				error.$state = routine.scope.state;
				error.$invocation = {
					operation: routine.currentOperation ? routine.currentOperation.name : 'unknown operation'
				};
	
				if (routine.handlers.error) {
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;
	
					try {
						for (var _iterator4 = routine.handlers.error[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var operation = _step4.value;
	
							routine.invoke({
								operation: operation,
								args: error,
								recordIt: false,
								respectAbort: false
							});
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}
				} else if (routine.isSynchronous) {
					throw error;
				}
			}
		}]);
	
		return Routine;
	}();
	
	exports.default = Routine;
	
	
	function runAsynchronously(routine, operations, lastResult) {
		var promise = Promise.resolve(lastResult);
	
		var _iteratorNormalCompletion5 = true;
		var _didIteratorError5 = false;
		var _iteratorError5 = undefined;
	
		try {
			var _loop = function _loop() {
				var operation = _step5.value;
	
				promise = promise.then(function (args) {
					return routine.invoke({
						operation: operation,
						args: args
					});
				});
			};
	
			for (var _iterator5 = operations[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
				_loop();
			}
		} catch (err) {
			_didIteratorError5 = true;
			_iteratorError5 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion5 && _iterator5.return) {
					_iterator5.return();
				}
			} finally {
				if (_didIteratorError5) {
					throw _iteratorError5;
				}
			}
		}
	
		promise = promise.catch(function (error) {
			if (routine.handlers.error) {
				routine.abort();
				return new Promise(function (resolve) {
					Routine.handleError(routine, error);
					resolve();
				});
			}
	
			return Promise.reject(error);
		});
	
		return promise;
	}
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=Routine.js.map