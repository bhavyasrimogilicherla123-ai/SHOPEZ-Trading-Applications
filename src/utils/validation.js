const ApiError = require('./ApiError');

function requiredString(value, field, options = {}) {
  const output = String(value || '').trim();
  if (!output || (options.minLength && output.length < options.minLength)) {
    throw new ApiError(400, `${field} is invalid.`);
  }
  return output;
}

function positiveInteger(value, field) {
  const output = Number(value);
  if (!Number.isSafeInteger(output) || output <= 0) {
    throw new ApiError(400, `${field} must be a positive whole number.`);
  }
  return output;
}

function positivePrice(value) {
  const output = Number(value);
  if (!Number.isFinite(output) || output <= 0 || Math.round(output * 100) !== output * 100) {
    throw new ApiError(400, 'price must be a positive amount with at most two decimal places.');
  }
  return output;
}

module.exports = { positiveInteger, positivePrice, requiredString };
