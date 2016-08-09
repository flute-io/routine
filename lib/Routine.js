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
	
	var Routine = function () {
		function Routine(scope) {
			_classCallCheck(this, Routine);
	
			this.aborted = false;
			this.handlers = {
				'run:before': [],
				'invocation:before': [],
				'invocation:after': []
			};
			this.metadata = new Map();
			this.operations = [];
			this.isSynchronous = true;
			this.lastConditionMet = undefined;
			this.currentOperation = undefined;
	
			this.scope = scope || {};
	
			this.scope.routine = this;
		}
	
		_createClass(Routine, [{
			key: 'addOperation',
			value: function addOperation(operation, instanceMetadata) {
	
				Routine.validateOperation(operation);
	
				var metadata = Object.assign(operation['@routine.metadata'] || {}, instanceMetadata || {});
	
				this.addOperationInstanceMetadata(operation, metadata);
	
				this.operations.push(operation);
	
				return this;
			}
		}, {
			key: 'addOperationInstanceMetadata',
			value: function addOperationInstanceMetadata(operation, instanceMetadata) {
				if (!this.metadata.has(operation)) {
					var metadata = {
						instance: {},
						static: {}
					};
	
					this.metadata.set(operation, metadata);
				}
	
				if (instanceMetadata) {
					if ((typeof instanceMetadata === 'undefined' ? 'undefined' : _typeof(instanceMetadata)) !== 'object') {
						throw new Error('Instance metadata must be an object - Instance metadata was ' + ('specified for an operation named ' + operation.name + ' but the instance metadata was ') + ('of type ' + (typeof operation === 'undefined' ? 'undefined' : _typeof(operation)) + '. Instance metadata must however be an object'));
					}
	
					this.metadata.get(operation).instance = instanceMetadata;
				}
			}
		}, {
			key: 'first',
			value: function first(operation, instanceMetadata) {
				this.addOperation(operation, instanceMetadata);
				return this;
			}
		}, {
			key: 'then',
			value: function then(operation, instanceMetadata) {
				this.addOperation(operation, instanceMetadata);
				return this;
			}
		}, {
			key: 'otherwise',
			value: function otherwise(operation, instanceMetadata) {
				var _this = this;
	
				this.addOperationInstanceMetadata(operation, instanceMetadata);
				var _operation = function _operation(args) {
					if (_this.lastConditionMet) {
						_this.abort();
					} else {
						return _this.invoke({ operation: operation, args: args });
					}
				};
	
				this.addOperation(_operation);
	
				return this;
			}
		}, {
			key: 'on',
			value: function on(eventName, operation) {
				var _this2 = this;
	
				Routine.validateOperation(operation);
	
				if (!this.handlers[eventName]) {
					this.handlers[eventName] = [];
				}
	
				this.handlers[eventName].push(function (arg) {
					return operation.call(_this2.scope, arg);
				});
				return this;
			}
		}, {
			key: 'use',
			value: function use() {
				for (var _len = arguments.length, decorators = Array(_len), _key = 0; _key < _len; _key++) {
					decorators[_key] = arguments[_key];
				}
	
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;
	
				try {
	
					for (var _iterator = decorators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var decorator = _step.value;
	
						if (typeof decorator === 'function') {
							decorator(this);
						} else if ((typeof decorator === 'undefined' ? 'undefined' : _typeof(decorator)) === 'object') {
							this.setScopeTo(decorator);
						}
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
	
				return this;
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
				var _ref$isConstructor = _ref.isConstructor;
				var isConstructor = _ref$isConstructor === undefined ? false : _ref$isConstructor;
				var _ref$hasMultipleArgs = _ref.hasMultipleArgs;
				var hasMultipleArgs = _ref$hasMultipleArgs === undefined ? false : _ref$hasMultipleArgs;
				var _ref$respectAbort = _ref.respectAbort;
				var respectAbort = _ref$respectAbort === undefined ? true : _ref$respectAbort;
				var _ref$recordIt = _ref.recordIt;
				var recordIt = _ref$recordIt === undefined ? true : _ref$recordIt;
				var _ref$runHandlers = _ref.runHandlers;
				var runHandlers = _ref$runHandlers === undefined ? true : _ref$runHandlers;
				var _ref$scope = _ref.scope;
				var scope = _ref$scope === undefined ? this.scope : _ref$scope;
	
	
				var invocation = {
					operation: operation,
					args: args,
					hasMultipleArgs: hasMultipleArgs,
					respectAbort: respectAbort,
					recordIt: recordIt,
					runHandlers: runHandlers,
					scope: scope
				};
	
				if (invocation.runHandlers && this.handlers['invocation:before']) {
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;
	
					try {
						for (var _iterator2 = this.handlers['invocation:before'][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var handle = _step2.value;
	
							handle(invocation);
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
	
				if (invocation.respectAbort && this.aborted) {
					return;
				}
	
				if (invocation.recordIt) {
					this.currentOperation = invocation.operation;
				}
	
				var result = void 0;
	
				if (Routine.isRunnable(invocation.operation)) {
					result = invocation.operation.run(this, invocation.args);
				} else if (isConstructor) {
					if (invocation.hasMultipleArgs) {
						invocation.args.unshift(null);
						result = new (invocation.operation.bind.apply(invocation.operation, invocation.args))();
					} else {
						result = new invocation.operation(invocation.args); // eslint-disable-line new-cap
					}
				} else {
					if (invocation.hasMultipleArgs) {
						result = invocation.operation.apply(invocation.scope, invocation.args);
					} else {
						result = invocation.operation.call(invocation.scope, invocation.args);
					}
				}
	
				if (runHandlers && this.handlers['invocation:after']) {
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;
	
					try {
						for (var _iterator3 = this.handlers['invocation:after'][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var aspect = _step3.value;
	
							aspect({ operation: operation, args: args, hasMultipleArgs: hasMultipleArgs, respectAbort: respectAbort, recordIt: recordIt, result: result });
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
	
				return result;
			}
		}, {
			key: 'emit',
			value: function emit(event) {
				for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
					args[_key2 - 1] = arguments[_key2];
				}
	
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;
	
				try {
					for (var _iterator4 = this.handlers[event][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var handler = _step4.value;
	
						handler.apply(null, args);
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
			}
		}, {
			key: 'run',
			value: function run() {
	
				this.emit('run:before');
	
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
			key: 'setScopeTo',
			value: function setScopeTo(scope) {
				for (var prop in scope) {
					if (prop === '@routine.use') {
						this.use.apply(this, scope[prop]);
					} else if (prop !== 'routine' && scope.hasOwnProperty(prop)) {
						this.scope[prop] = scope[prop];
					}
				}
				return this;
			}
		}, {
			key: 'setup',
			get: function get() {
				return {
					as: function as() {
						for (var _len3 = arguments.length, operations = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
							operations[_key3] = arguments[_key3];
						}
	
						var _iteratorNormalCompletion5 = true;
						var _didIteratorError5 = false;
						var _iteratorError5 = undefined;
	
						try {
							for (var _iterator5 = operations[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
								var operation = _step5.value;
	
								Routine.validateOperation(operation);
								this.invoke({
									operation: operation,
									args: this,
									respectAbort: false,
									runAspects: false
								});
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
			value: function use() {
				var routine = new Routine();
	
				for (var _len4 = arguments.length, decorators = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
					decorators[_key4] = arguments[_key4];
				}
	
				routine.use.apply(routine, decorators);
				return routine;
			}
		}, {
			key: 'setScopeTo',
			value: function setScopeTo(scope) {
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
				routine.scope.error = error;
	
				error.$invocation = {
					operation: routine.currentOperation ? routine.currentOperation.name : 'unknown operation'
				};
	
				if (routine.handlers.error) {
					var _iteratorNormalCompletion6 = true;
					var _didIteratorError6 = false;
					var _iteratorError6 = undefined;
	
					try {
						for (var _iterator6 = routine.handlers.error[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
							var operation = _step6.value;
	
							routine.invoke({
								operation: operation,
								args: error,
								recordIt: false,
								respectAbort: false
							});
						}
					} catch (err) {
						_didIteratorError6 = true;
						_iteratorError6 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion6 && _iterator6.return) {
								_iterator6.return();
							}
						} finally {
							if (_didIteratorError6) {
								throw _iteratorError6;
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
	
		var _iteratorNormalCompletion7 = true;
		var _didIteratorError7 = false;
		var _iteratorError7 = undefined;
	
		try {
			var _loop = function _loop() {
				var operation = _step7.value;
	
				promise = promise.then(function (args) {
					return routine.invoke({
						operation: operation,
						args: args
					});
				});
			};
	
			for (var _iterator7 = operations[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
				_loop();
			}
		} catch (err) {
			_didIteratorError7 = true;
			_iteratorError7 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion7 && _iterator7.return) {
					_iterator7.return();
				}
			} finally {
				if (_didIteratorError7) {
					throw _iteratorError7;
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