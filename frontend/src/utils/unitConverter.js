// Unit conversion utilities
// Base unit: feet (for running feet calculation)

export const UNITS = {
  FEET: 'ft',
  METER: 'm',
  CENTIMETER: 'cm',
  INCHES: 'in'
};

// Conversion factors to feet
const TO_FEET = {
  [UNITS.FEET]: 1,
  [UNITS.METER]: 3.28084,
  [UNITS.CENTIMETER]: 0.0328084,
  [UNITS.INCHES]: 0.0833333
};

// Conversion factors from feet
const FROM_FEET = {
  [UNITS.FEET]: 1,
  [UNITS.METER]: 0.3048,
  [UNITS.CENTIMETER]: 30.48,
  [UNITS.INCHES]: 12
};

/**
 * Convert a value from one unit to another
 * @param {number} value - The value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export const convertUnit = (value, fromUnit, toUnit) => {
  if (!value || isNaN(value)) return 0;
  if (fromUnit === toUnit) return parseFloat(value);
  
  // Convert to feet first, then to target unit
  const valueInFeet = parseFloat(value) * TO_FEET[fromUnit];
  return valueInFeet * FROM_FEET[toUnit];
};

/**
 * Convert to feet (for running feet calculation)
 * @param {number} value - The value to convert
 * @param {string} unit - Source unit
 * @returns {number} Value in feet
 */
export const toFeet = (value, unit) => {
  if (!value || isNaN(value)) return 0;
  return parseFloat(value) * TO_FEET[unit];
};

/**
 * Format dimension with unit
 * @param {number} value - The value
 * @param {string} unit - The unit
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
export const formatDimension = (value, unit, decimals = 2) => {
  if (!value || isNaN(value)) return '-';
  const numValue = parseFloat(value);
  return `${numValue.toFixed(decimals)} ${unit}`;
};

/**
 * Calculate running feet from length and width
 * @param {number} length - Length value
 * @param {string} lengthUnit - Length unit
 * @param {number} width - Width value
 * @param {string} widthUnit - Width unit
 * @returns {number} Running feet
 */
export const calculateRunningFeet = (length, lengthUnit, width, widthUnit) => {
  const lengthInFeet = toFeet(length, lengthUnit);
  const widthInFeet = toFeet(width, widthUnit);
  
  // Running feet = (length + width) * 2 / 12 (perimeter in feet)
  // Or simpler: sum of length and width in feet
  return lengthInFeet + widthInFeet;
};

