// Utilities
import { createErrorUtils } from "../src";
import { DEFAULT_ERROR_MESSAGE } from "../src/errors";

class ErrorError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "CodeError";
    this.error = code;
  }
}

class CodeError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "CodeError";
    this.code = code;
  }
}

describe("Error Utils", () => {
  const ERROR_CODE_SAMPLE = "SAMPLE_ERROR";
  const ERROR_MESSAGE_CUSTOM_DEFAULT = "Another default error message";
  const ERROR_MESSAGE_SAMPLE = "Sample error message";

  const errorMap = {
    [ERROR_CODE_SAMPLE]: ERROR_MESSAGE_SAMPLE,
  };

  const beforeHandler = () => {};
  const afterHandler = () => {};

  beforeEach(beforeHandler);
  afterEach(afterHandler);

  it("should create error utilities", () => {
    const utils = createErrorUtils(errorMap);

    expect(utils.getError).toBeInstanceOf(Function);
    expect(utils.getErrorCode).toBeInstanceOf(Function);
    expect(utils.hasError).toBeInstanceOf(Function);
    expect(utils.errorMap).toEqual(errorMap);
  });

  // NOTE: Only this test needs to test all different error shapes,
  //         as the other functions all depend on this handler.
  it("should get error codes from different error shapes", () => {
    const { getErrorCode } = createErrorUtils(errorMap);

    const errorEmpty = null;
    const errorInvalid = () => {};
    const errorString = ERROR_CODE_SAMPLE;
    const errorObjectEmpty = new Error();
    const errorObjectSimple = new Error(ERROR_CODE_SAMPLE);
    const errorObjectCode = new CodeError("", ERROR_CODE_SAMPLE);
    const errorObjectError = new ErrorError("", ERROR_CODE_SAMPLE);

    expect(getErrorCode(errorEmpty)).toEqual(null);
    expect(getErrorCode(errorInvalid)).toEqual(null);
    expect(getErrorCode(errorString)).toEqual(ERROR_CODE_SAMPLE);
    expect(getErrorCode(errorObjectEmpty)).toEqual(null);
    expect(getErrorCode(errorObjectSimple)).toEqual(ERROR_CODE_SAMPLE);
    expect(getErrorCode(errorObjectCode)).toEqual(ERROR_CODE_SAMPLE);
    expect(getErrorCode(errorObjectError)).toEqual(ERROR_CODE_SAMPLE);
  });

  it("should get error messages from matched errors", () => {
    const { getError } = createErrorUtils(errorMap);

    const errorEmpty = null;
    const errorObjectMatched = new Error(ERROR_CODE_SAMPLE);
    const errorObjectUnmatched = new Error("ERROR_CODE_UNMATCHED");

    expect(getError(errorEmpty)).toEqual(null);
    expect(getError(errorObjectMatched)).toEqual(ERROR_MESSAGE_SAMPLE);
    expect(getError(errorObjectUnmatched)).toEqual(DEFAULT_ERROR_MESSAGE);
  });

  it("should only use default error messages with unmatched errors", () => {
    const { getError } = createErrorUtils(errorMap);

    const errorObjectMatched = new Error(ERROR_CODE_SAMPLE);
    const errorObjectUnmatched = new Error("ERROR_CODE_UNMATCHED");

    expect(getError(errorObjectMatched, ERROR_MESSAGE_CUSTOM_DEFAULT)).toEqual(
      ERROR_MESSAGE_SAMPLE
    );
    expect(
      getError(errorObjectUnmatched, ERROR_MESSAGE_CUSTOM_DEFAULT)
    ).toEqual(ERROR_MESSAGE_CUSTOM_DEFAULT);
  });

  it("should check whether error has code", () => {
    const { hasError } = createErrorUtils(errorMap);

    const errorEmpty = null;
    const errorObject = new Error(ERROR_CODE_SAMPLE);

    expect(hasError(errorEmpty, ERROR_CODE_SAMPLE)).toBeFalsy();
    expect(hasError(errorObject, ERROR_CODE_SAMPLE)).toBeTruthy();
  });

  // Test customization options

  it("should use override error extraction function", () => {
    const { getError, getErrorCode, hasError } = createErrorUtils(errorMap, {
      getErrorCode: (error) => error.custom || null,
    });

    const errorCustomShape = { custom: ERROR_CODE_SAMPLE };

    expect(getError(errorCustomShape)).toEqual(ERROR_MESSAGE_SAMPLE);
    expect(getErrorCode(errorCustomShape)).toEqual(ERROR_CODE_SAMPLE);
    expect(hasError(errorCustomShape, ERROR_CODE_SAMPLE)).toBeTruthy();
  });

  it("should use override default error message with unmatched errors", () => {
    const { getError } = createErrorUtils(errorMap, {
      defaultMessage: ERROR_MESSAGE_CUSTOM_DEFAULT,
    });

    const errorObjectMatched = new Error(ERROR_CODE_SAMPLE);
    const errorObjectUnmatched = new Error("ERROR_CODE_UNMATCHED");

    expect(getError(errorObjectMatched)).toEqual(ERROR_MESSAGE_SAMPLE);
    expect(getError(errorObjectUnmatched)).toEqual(
      ERROR_MESSAGE_CUSTOM_DEFAULT
    );
  });

  it("should handle edge test cases", () => {
    const utilsWithEmptyMap = createErrorUtils();
    const { getError, getErrorCode, hasError } = utilsWithEmptyMap;

    const errorInvalidShape = { invalid: "ERROR_CODE_UNMATCHED" };

    // NOTE: Necessary to properly test missing error map
    expect(utilsWithEmptyMap).toBeTruthy();

    // NOTE: Tests are necessary to properly catch branch executions
    expect(getError(errorInvalidShape)).toEqual(DEFAULT_ERROR_MESSAGE);
    expect(getErrorCode(errorInvalidShape)).toBeNull();
    expect(hasError(errorInvalidShape, ERROR_CODE_SAMPLE)).toBeFalsy();
  });
});
