/**
 * @param {Object} options - options object to be passed with args to alter style
 * @param {transformFn} options.transformFn - the transform function to run on property values
 * @param {transformCondition} [options.transformCondition] - optional function for condition to be met to transform property
 * @param {Array} [options.propertyIds] - optional array of property ids to filter transform to
 */

/**
 * transformFn
 * The transform function passed in as an option to run recursively on expressions
 * @function transformFn
 * @param {string} layerId - id of the relevant layer
 * @param {Object|Array|string|number} propertyValue - the value of the property passed in
 * @param {string} propertyKey - the key of the property passed in
 * @returns {Object|Array|string|number} - transformed property value
 */

/**
 * transformCondition
 * Returns a boolean for if the condition is met
 * @function transformCondition
 * @param {Object|Array|string|number} propertyValue - the value of the property passed in
 * @param {string} propertyKey - the key of the property passed in
 * @returns {boolean} - true or false
 */

/**
 * recurseExpression
 * Recurses an expression and passes all sub expressions to transformFn
 * @param {string} layerId - id of the relevant layer
 * @param {string} propertyKey - key of the property where the expression was found
 * @param {Array} exp - expression
 * @param {transformFn} transformFn - transforms the value
 * @param {transformCondition} transformCondition - returns true if value meets condition
 * @returns {Array} - modified expression
 */
const recurseExpression = (
  layerId,
  propertyKey,
  exp,
  transformFn,
  transformCondition
) => {
  if (transformCondition(exp, propertyKey)) {
    return transformFn(layerId, exp, propertyKey);
  }
  if (Array.isArray(exp)) {
    return exp.map(item =>
      recurseExpression(
        layerId,
        propertyKey,
        item,
        transformFn,
        transformCondition
      )
    );
  }
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
 */
const updatePropertyValue = (layerId, propertyKey, propertyValue, options) => {
  const { transformFn, transformCondition } = options;
  let propertyFormat = typeof propertyValue;
  if (!transformCondition) return transformFn(propertyValue, propertyKey);

  if (propertyFormat === 'object' && Array.isArray(propertyValue)) {
    propertyFormat = 'expression';
  } else if (
    propertyFormat === 'object' &&
    propertyValue.hasOwnProperty('stops')
  ) {
    propertyFormat = 'legacyStops';
  } else {
    propertyFormat = 'literal';
  }

  switch (propertyFormat) {
    case 'literal':
      return transformCondition(propertyValue, propertyKey)
        ? transformFn(layerId, propertyValue, propertyKey)
        : propertyValue;
    case 'expression':
      // Since expressions can be nested, recurse through the expression to find any instance that meets the condition
      return recurseExpression(
        layerId,
        propertyKey,
        propertyValue,
        transformFn,
        transformCondition
      );
    case 'legacyStops':
      return {
        ...propertyValue,
        stops: recurseExpression(
          layerId,
          propertyKey,
          propertyValue.stops,
          transformFn,
          transformCondition
        )
      };
  }
};

/**
 * updateLayerPropertyValues
 * Returns a layer or property object with all properties updated with appropriate value
 * @param {string} layerId - id of the relevant layer
 * @param {Object} propertyObj - property object, can be layer or paint/layout object
 * @param {Object} options - options object with transform fn, optional propertyIds, and optional recurse condition
 * @returns {Object} - modified property object
 */
const updateLayerPropertyValues = (layerId, propertyObj, options) => {
  const { propertyIds } = options;
  let nextObj = JSON.parse(JSON.stringify(propertyObj));

  for (const k in propertyObj) {
    switch (k) {
      case 'metadata':
        // Pass metadata straight through since it will not contain property values
        break;
      case 'paint':
      case 'layout':
        nextObj[k] = updateLayerPropertyValues(
          layerId,
          propertyObj[k],
          options
        );
        break;
      default:
        // If specific properties are specified, only transform them
        if (propertyIds && !propertyIds.includes(k)) continue;
        const nextOptions = {
          transformFn: options.transformFn,
          transformCondition: options.transformCondition
        };
        // Handle nested keys here (to get "paint.*" and "layout.*")
        nextObj[k] = updatePropertyValue(
          layerId,
          k,
          propertyObj[k],
          nextOptions
        );
        break;
    }
  }
  return nextObj;
};

/**
 * recurseStyle
 * @param {Object} stylesheet - style json
 * @param {Object} options - options object with transform fn, optional propertyIds, and optional recurse condition
 * @returns {Object} - modified style json with single matches replaced
 */
const recurseStyle = (stylesheet, options) => {
  // Copy stylesheet to not make edits in Maputnik
  const stylesheetCopy = JSON.parse(JSON.stringify(stylesheet));

  stylesheetCopy.layers = stylesheet.layers.map(l =>
    updateLayerPropertyValues(l.id, l, options)
  );

  return stylesheetCopy;
};

/**
 * createRecurseStyle
 * @param {Object} options - options object with transform fn and optional recurse condition
 * @returns {Object} - modified style json with single matches replaced
 */
const createRecurseStyle = options => {
  return stylesheet => recurseStyle(stylesheet, options);
};

module.exports = createRecurseStyle;
