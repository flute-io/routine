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
	exports.default = $injector;
	function $injector(routine) {
	
		routine.on('invocation:before', function (invocation) {
	
			var metadata = routine.metadata.get(injector);
			var mappings = metadata ? metadata.mappings || {} : {};
			var depNames = $args(invocation.operation);
			var depsToInject = [];
	
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;
	
			try {
				for (var _iterator = depNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var argName = _step.value;
	
					if (argName === 'routine') {
						depsToInject.push(routine);
					} else if (mappings[argName]) {
						var arg = getItemFromObjByStringPath({
							obj: routine.scope,
							path: mappings[argName]
						});
	
						if (!arg) {
							// eslint-disable-next-line quotes
							throw new Error('Injector mapping resolution error - mapping value ' + ('of \'' + mappings[argName] + '\' for dependency named \'' + argName + '\' of operation ') + ('named \'' + invocation.operation.name + '\' does not exist in scope'));
						}
	
						depsToInject.push(arg);
					} else if (routine.scope[argName]) {
						depsToInject.push(routine.scope[argName]);
					} else {
						depsToInject.push(invocation.args);
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
	
			if (depsToInject.length === 1) {
				invocation.args = depsToInject[0];
			} else if (depsToInject.length > 1) {
				invocation.args = depsToInject;
				invocation.hasMultipleArgs = true;
			}
		});
	}
	
	$injector.mappings = function (mappings) {
		return function (routine) {
			routine.metadata.set(injector, { mappings: mappings });
		};
	};
	
	var injector = exports.injector = $injector;
	
	function $args(func) {
		return (func + '').replace(/[/][/].*$/mg, '') // strip single-line comments
		.replace(/\s+/g, '') // strip white space
		.replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
		.split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
		.replace(/=[^,]+/g, '') // strip any ES6 defaults
		.split(',').filter(Boolean); // split & filter [""]
	}
	
	function getItemFromObjByStringPath() {
		var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
		var obj = _ref.obj;
		var path = _ref.path;
	
		var props = path.split('.');
		var item = obj;
	
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;
	
		try {
			for (var _iterator2 = props[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var prop = _step2.value;
	
				item = item[prop];
				if (!item) {
					break;
				}
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
	
		return item;
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=injector.js.map