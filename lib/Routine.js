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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _EnsureThat = __webpack_require__(1);
	
	Object.defineProperty(exports, 'ensureThat', {
		enumerable: true,
		get: function () {
			return _EnsureThat.ensureThat;
		}
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Routine = function () {
		_createClass(Routine, null, [{
			key: 'set',
			value: function set(scope) {
				return new Routine(scope);
			}
		}]);
	
		function Routine(scope) {
			_classCallCheck(this, Routine);
	
			this.aborted = false;
			this.operations = [];
			this.handlers = {};
			this.errorHandler = undefined;
			this.currentOperation = undefined;
	
			this.scope = scope;
	
			scope.routine = this;
		}
	
		_createClass(Routine, [{
			key: 'addOperation',
			value: function addOperation(operation) {
				var _this = this;
	
				var func = void 0;
	
				if (isRunnable(operation)) {
					func = function func() {
						return operation.run(_this);
					};
				} else {
					func = function func(arg) {
						return _this.invoke(operation, arg);
					};
				}
	
				this.operations.push(function (arg) {
					if (!_this.aborted) {
						return func(arg);
					}
				});
	
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
			key: 'onError',
			value: function onError(operation) {
				this.errorHandler = operation;
				return this;
			}
		}, {
			key: 'on',
			value: function on(eventName, operation) {
				this.handlers[eventName] = operation;
				return this;
			}
		}, {
			key: 'abort',
			value: function abort() {
				this.aborted = true;
			}
		}, {
			key: 'invoke',
			value: function invoke(operation) {
				if (!this.aborted) {
					this.currentOperation = operation;
	
					for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						args[_key - 1] = arguments[_key];
					}
	
					return operation.apply(this.scope, args);
				}
			}
		}, {
			key: 'run',
			value: function run() {
				var lastResult = void 0;
	
				try {
					for (var i = 0; i < this.operations.length; i++) {
						var operation = this.operations[i];
						lastResult = operation(lastResult);
	
						if (lastResult instanceof Promise) {
							var operationsToPromisify = this.operations.slice(i + 1, this.operations.length);
							return runAsynchronously(this, operationsToPromisify, lastResult);
						}
					}
	
					return lastResult;
				} catch (error) {
					invokeErrorHandlerOn(this, error);
				}
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
		}]);
	
		return Routine;
	}();
	
	exports.default = Routine;
	
	
	function runAsynchronously(routine, operations, lastResult) {
		var promise = Promise.resolve(lastResult);
	
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;
	
		try {
			for (var _iterator = operations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var operation = _step.value;
	
				promise = promise.then(operation);
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
	
		promise = promise.catch(function (error) {
			if (routine.handlers.error) {
				routine.abort();
				return new Promise(function (resolve) {
					invokeErrorHandlerOn(routine, error);
					resolve();
				});
			}
	
			return Promise.reject(error);
		});
	
		return promise;
	}
	
	function invokeErrorHandlerOn(routine, error) {
		error.$state = routine.scope.state;
		error.$invocation = {
			operation: routine.currentOperation.name
		};
	
		if (routine.handlers.error) {
			routine.handlers.error(error);
		}
	}
	
	function isRunnable(operation) {
		return (typeof operation === 'undefined' ? 'undefined' : _typeof(operation)) === 'object' && operation.run !== undefined;
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.ensureThat = ensureThat;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function ensureThat(operation) {
		return new EnsureThat(operation);
	}
	
	var EnsureThat = function () {
		function EnsureThat(operation) {
			_classCallCheck(this, EnsureThat);
	
			this.scope = {};
			this.operations = [];
			this.elseOperation = undefined;
	
			this.addOperation(operation);
		}
	
		_createClass(EnsureThat, [{
			key: "addOperation",
			value: function addOperation(operation) {
				this.operations.push(operationPreppedForExecution(operation, this));
			}
		}, {
			key: "that",
			value: function that(operation) {
				this.addOperation(operation);
				return this;
			}
		}, {
			key: "otherwise",
			value: function otherwise(operation) {
				this.elseOperation = operationPreppedForExecution(operation, this);
				return this;
			}
		}, {
			key: "run",
			value: function run(routine) {
				this.routine = routine;
	
				for (var i = 0; i < this.operations.length; i++) {
					var operation = this.operations[i];
					var result = operation();
	
					if (result instanceof Promise) {
						var operationsToPromisify = this.operations.slice(i + 1, this.operations.length);
						return runAsynchronously(this, operationsToPromisify, result);
					} else {
						if (!result) {
							if (this.elseOperation) {
								var _result = this.elseOperation();
								this.routine.abort();
								return _result;
							} else {
								throw conditionalErrorFor(routine);
							}
						}
					}
				}
			}
		}, {
			key: "and",
			get: function get() {
				return this;
			}
		}]);
	
		return EnsureThat;
	}();
	
	exports.default = EnsureThat;
	
	
	function runAsynchronously(runner, _operations, lastResult) {
		var routine = runner.routine;
		var promise = lastResult;
		var operations = [promise].concat(_operations);
	
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;
	
		try {
			for (var _iterator = operations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var operation = _step.value;
	
				promise = promise.then(operation).then(function (result) {
					if (!result) {
						return Promise.reject(conditionalErrorFor(routine));
					}
				});
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
	
	function conditionalErrorFor(routine) {
		return new Error("Required condition of routine was not met -  " + routine.currentOperation.name + " returned false");
	}
	
	function operationPreppedForExecution(operation, runnable) {
		return function (args) {
			return runnable.routine.invoke(operation, args);
		};
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=Routine.js.map