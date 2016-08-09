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
	
	exports.defaults = defaults;
	function defaults(mapping) {
	
		return function defaults(routine) {
	
			routine.on('run:before', function () {
	
				var scope = routine.scope;
	
				for (var prop in mapping) {
	
					if (mapping.hasOwnProperty(prop)) {
						var def = definitionOf(scope, mapping, prop);
						def.host[def.property] = def.value;
					}
				}
			});
		};
	}
	
	function definitionOf(scope, mapping, prop) {
	
		var def = {
			host: '',
			property: '',
			value: ''
		};
	
		var parts = prop.split('.');
	
		if (parts.length === 1) {
			def.host = scope;
			def.property = prop;
			def.value = function () {
				return isDefined(scope[prop]) ? scope[prop] : mapping[prop];
			}();
		} else {
	
			var totalParts = parts.length;
			var idxOfLastPart = parts.length - 1;
	
			def.host = scope;
	
			var _loop = function _loop(i) {
				var part = parts[i];
	
				if (!isDefined(def.host[part]) && i < idxOfLastPart) {
					def.host[part] = {};
				}
	
				if (isDefined(def.host[part]) && _typeof(def.host[part]) === 'object') {
					def.host = def.host[part];
				}
	
				if (i === idxOfLastPart) {
					def.property = part;
					def.value = function () {
						return isDefined(def.host[part]) ? def.host[part] : mapping[prop];
					}();
				}
			};
	
			for (var i = 0; i < totalParts; i++) {
				_loop(i);
			}
		}
	
		return def;
	}
	
	function isDefined(value) {
		return value !== undefined && value !== null;
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=defaults.js.map