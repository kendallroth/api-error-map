// Default error that will be used when no matching error message is found for a code
const DEFAULT_ERROR_MESSAGE = "An unknown error occurred";

/**
 * Get an error code from an error
 *
 * NOTE: Function should only be called internally!
 *
 * @param   {Object|string} error - Error object/string
 * @returns {string}        Error code
 */
const getErrorCodeBase = (error) => {
  if (!error) return null;

  // Errors are often provided as an object, but the code 'key' may vary
  if (typeof error === "object") {
    const { code, error: subError, message } = error;

    // 'code' key should be checked first (most likely to be set manually)
    if (code) return code;
    // 'error' key should be checked next (may be set manually)
    if (subError) return subError;
    // 'message' key should always be checked last (most common, likely not set manually)
    if (message) return message;
  }
  // A bare error code may be provided instead of an error object
  else if (typeof error === "string") {
    return error;
  }

  return null;
};

/**
 * Map an error code to a readable error message
 *
 * NOTE: Function should only be called internally!
 *
 * @param   {Object|string} error          - Error object/string
 * @param   {Object}        errorMap       - Error code/message map
 * @param   {string}        defaultMessage - Default error message (if code is not found)
 * @param   {function}      getErrorCode   - Function to extract error code
 * @returns {string}        Mapped error message
 */
const getErrorMessageBase = (error, errorMap, defaultMessage, getErrorCode) => {
  if (!error) return null;

  const errorCode = getErrorCode(error);
  if (!errorCode) return defaultMessage;

  return errorMap[errorCode] || defaultMessage;
};

/**
 * Determine whether an error includes a specific error code
 *
 * NOTE: Function should only be called internally!
 *
 * @param   {Object|string} error           - Error object/string
 * @param   {string}        targetErrorCode - Target error code
 * @param   {function}      getErrorCode    - Function to extract error code
 * @returns {boolean}       Whether error includes specific error code
 */
const hasErrorCodeBase = (error, targetErrorCode, getErrorCode) => {
  if (!error) return false;

  const errorCode = getErrorCode(error);
  if (!errorCode) return false;

  return errorCode == targetErrorCode;
};

/**
 * Create the error utilities (providing error map, overrides, etc)
 * @param   {Object}   errorMap               - Error map object
 * @param   {Object}   options                - Override options
 * @param   {string}   options.defaultMessage - Default message override
 * @param   {function} options.getErrorCode   -
 * @returns {Object}                          - Error utilities (with error map, overrides)
 */
const createErrorUtils = (errorMap = {}, options = {}) => {
  const {
    defaultMessage: defaultMessageOverride,
    getErrorCode: getErrorCodeOverride,
  } = options;

  // Function to get error code from an error can be overridden
  const getErrorCode = getErrorCodeOverride || getErrorCodeBase;
  // Default error message (if no code matches AND no default was provided) can be overridden
  const defaultMessageString = defaultMessageOverride || DEFAULT_ERROR_MESSAGE;

  return {
    errorMap,
    getError: (error, defaultMessage) =>
      getErrorMessageBase(
        error,
        errorMap,
        defaultMessage || defaultMessageString,
        getErrorCode
      ),
    getErrorCode: (error) => getErrorCode(error),
    hasError: (error, errorCode) =>
      hasErrorCodeBase(error, errorCode, getErrorCode),
  };
};

export { createErrorUtils };

// TEST: Only exported for testing!
export { DEFAULT_ERROR_MESSAGE };
