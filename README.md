# API Error Map

![](https://github.com/kendallroth/api-error-map/workflows/Jest%20Test/badge.svg)

Simple API error code mapping

- [`createErrorUtils`](#createErrorUtils)

## Features

- Map a readable error message from an error
- Check whether an error has a particular code

## `createErrorUtils`

### Usage

The `createErrorUtils` helper creates a set of helpers to work with API error/codes, given a corresponding error map from codes to strings. The error code extractor can be customized to extend the default behaviour.

To use the helpers, create an mapping between API error codes and the corresponding human-readable error messages. Use this mapping to create the error utils, and then export them for use across the application.

> **NOTE:** It is recommended to use short, description error codes; however, this may be out of your control (specified by the API).

```js
// utilities/errors.js

const errorMap = {
  NOT_AUTHORIZED: "You are not authorized",
  EVENT_CREATE__DUPLICATE_NAME: "Event already exists",
  // ...
};

const { getError, hasError } = createErrorUtils(errorMap);

export { getError, hasError };
```

The created helpers can be used in other files to determine whether an API error contains a specific error (`hasError`) or to get a readable error from the response (`getError`) (with optional default).

```js
// Check whether a specific error occurred
const hasThisError = hasError(response.error, "NOT_AUTHORIZED");

// Get a readable error message from an error (or use default if not matched)
const errorMessage = getError(response.error);
// Get a readable error message with customized default (if not matched)
const errorMessageDefault = getError(response.error, "Something went wrong!");
```

### API

#### `createErrorUtils(errorMap, options)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `errorMap` | `Object` | `{}` | Error mapping between codes and messages
| `options` | `Object` | `{}` | Configuration options
| `options.defaultMessage` | `string` | | Default error message if no matching code is found
| `options.getErrorCode(error)` | `function` | _See below_ | Function to extract error code from error

> **NOTE:** The default `getErrorCode` function simply returns the error as a code if it is a string; otherwise, it will check a few common error keys (`code`, `error`) before returning the error message.

## Miscellaneous

> Project boilerplate from: [`flexdinesh/npm-module-boilerplate`](https://github.com/flexdinesh/npm-module-boilerplate)
