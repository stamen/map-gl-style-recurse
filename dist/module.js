var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequiree40e"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequiree40e"] = parcelRequire;
}
parcelRequire.register("dcBU0", function(module, exports) {
"use strict";
function $99c9cbf514d06989$var$ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function $99c9cbf514d06989$var$_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? $99c9cbf514d06989$var$ownKeys(Object(source), !0).forEach(function(key) {
            $99c9cbf514d06989$var$_defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : $99c9cbf514d06989$var$ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function $99c9cbf514d06989$var$_defineProperty(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
function $99c9cbf514d06989$var$_typeof(obj1) {
    "@babel/helpers - typeof";
    return $99c9cbf514d06989$var$_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, $99c9cbf514d06989$var$_typeof(obj1);
}
/**
 * @param {Object} options - options object to be passed with args to alter style
 * @param {transformFn} options.transformFn - the transform function to run on property values
 * @param {transformCondition} [options.transformCondition] - optional function for condition to be met to transform property
 * @param {Array} [options.propertyIds] - optional array of property ids to filter transform to
 */ /**
 * transformFn
 * The transform function passed in as an option to run recursively on expressions
 * @function transformFn
 * @param {string} layerId - id of the relevant layer
 * @param {Object|Array|string|number} propertyValue - the value of the property passed in
 * @param {string} propertyKey - the key of the property passed in
 * @returns {Object|Array|string|number} - transformed property value
 */ /**
 * transformCondition
 * Returns a boolean for if the condition is met
 * @function transformCondition
 * @param {Object|Array|string|number} propertyValue - the value of the property passed in
 * @param {string} propertyKey - the key of the property passed in
 * @returns {boolean} - true or false
 */ /**
 * recurseExpression
 * Recurses an expression and passes all sub expressions to transformFn
 * @param {string} layerId - id of the relevant layer
 * @param {string} propertyKey - key of the property where the expression was found
 * @param {Array} exp - expression
 * @param {transformFn} transformFn - transforms the value
 * @param {transformCondition} transformCondition - returns true if value meets condition
 * @returns {Array} - modified expression
 */ var $99c9cbf514d06989$var$recurseExpression = function recurseExpression1(layerId, propertyKey, exp, transformFn, transformCondition) {
    if (transformCondition(exp, propertyKey)) return transformFn(layerId, exp, propertyKey);
    if (Array.isArray(exp)) return exp.map(function(item) {
        return recurseExpression1(layerId, propertyKey, item, transformFn, transformCondition);
    });
    return exp;
};
/**
 * updatePropertyValue
 * Returns updated property value
 * @param {string} layerId - id of the relevant layer
 * @param {string} propertyKey - key of the property where the value was found
 * @param {Object|Array|string|number} propertyValue - property value
 * @param {Object} options - options object with transform fn and optional recurse condition
 * @returns {Object|Array|string|number} - modified property value
 */ var $99c9cbf514d06989$var$updatePropertyValue = function updatePropertyValue(layerId, propertyKey, propertyValue, options) {
    var transformFn = options.transformFn, transformCondition = options.transformCondition;
    var propertyFormat = $99c9cbf514d06989$var$_typeof(propertyValue);
    if (!transformCondition) return transformFn(propertyValue, propertyKey);
    if (propertyFormat === "object" && Array.isArray(propertyValue)) propertyFormat = "expression";
    else if (propertyFormat === "object" && propertyValue.hasOwnProperty("stops")) propertyFormat = "legacyStops";
    else propertyFormat = "literal";
    switch(propertyFormat){
        case "literal":
            return transformCondition(propertyValue, propertyKey) ? transformFn(layerId, propertyValue, propertyKey) : propertyValue;
        case "expression":
            // Since expressions can be nested, recurse through the expression to find any instance that meets the condition
            return $99c9cbf514d06989$var$recurseExpression(layerId, propertyKey, propertyValue, transformFn, transformCondition);
        case "legacyStops":
            return $99c9cbf514d06989$var$_objectSpread($99c9cbf514d06989$var$_objectSpread({}, propertyValue), {}, {
                stops: $99c9cbf514d06989$var$recurseExpression(layerId, propertyKey, propertyValue.stops, transformFn, transformCondition)
            });
    }
};
/**
 * updateLayerPropertyValues
 * Returns a layer or property object with all properties updated with appropriate value
 * @param {string} layerId - id of the relevant layer
 * @param {Object} propertyObj - property object, can be layer or paint/layout object
 * @param {Object} options - options object with transform fn, optional propertyIds, and optional recurse condition
 * @returns {Object} - modified property object
 */ var $99c9cbf514d06989$var$updateLayerPropertyValues = function updateLayerPropertyValues1(layerId, propertyObj, options) {
    var propertyIds = options.propertyIds;
    var nextObj = JSON.parse(JSON.stringify(propertyObj));
    for(var k in propertyObj)switch(k){
        case "metadata":
            break;
        case "paint":
        case "layout":
            nextObj[k] = updateLayerPropertyValues1(layerId, propertyObj[k], options);
            break;
        default:
            // If specific properties are specified, only transform them
            if (propertyIds && !propertyIds.includes(k)) continue;
            var nextOptions = {
                transformFn: options.transformFn,
                transformCondition: options.transformCondition
            }; // Handle nested keys here (to get "paint.*" and "layout.*")
            nextObj[k] = $99c9cbf514d06989$var$updatePropertyValue(layerId, k, propertyObj[k], nextOptions);
            break;
    }
    return nextObj;
};
/**
 * recurseStyle
 * @param {Object} stylesheet - style json
 * @param {Object} options - options object with transform fn, optional propertyIds, and optional recurse condition
 * @returns {Object} - modified style json with single matches replaced
 */ var $99c9cbf514d06989$var$recurseStyle = function recurseStyle(stylesheet, options) {
    // Copy stylesheet to not make edits in Maputnik
    var stylesheetCopy = JSON.parse(JSON.stringify(stylesheet));
    stylesheetCopy.layers = stylesheet.layers.map(function(l) {
        return $99c9cbf514d06989$var$updateLayerPropertyValues(l.id, l, options);
    });
    return stylesheetCopy;
};
/**
 * createRecurseStyle
 * @param {Object} options - options object with transform fn and optional recurse condition
 * @returns {Object} - modified style json with single matches replaced
 */ var $99c9cbf514d06989$var$createRecurseStyle = function createRecurseStyle(options) {
    return function(stylesheet) {
        return $99c9cbf514d06989$var$recurseStyle(stylesheet, options);
    };
};
module.exports = $99c9cbf514d06989$var$createRecurseStyle;

});

var $cf838c15c8b009ba$exports = {};
"use strict";
Object.defineProperty($cf838c15c8b009ba$exports, "__esModule", {
    value: true
});
Object.defineProperty($cf838c15c8b009ba$exports, "createRecurseStyle", {
    enumerable: true,
    get: function get() {
        return $cf838c15c8b009ba$var$_createRecurseStyle["default"];
    }
});

var $cf838c15c8b009ba$var$_createRecurseStyle = $cf838c15c8b009ba$var$_interopRequireDefault((parcelRequire("dcBU0")));
function $cf838c15c8b009ba$var$_interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    };
}


export {$cf838c15c8b009ba$exports as default};
//# sourceMappingURL=module.js.map
