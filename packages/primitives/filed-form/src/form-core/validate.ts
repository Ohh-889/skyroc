/* eslint-disable no-template-curly-in-string */
/**
 * Validation message system for form field validation Provides customizable error messages for different validation
 * rule types
 */

/** Type alias for validation message strings */
type ValidateMessage = string;

/** Configuration object for validation error messages Supports nested message structures for different validation types */
export interface ValidateMessages {
  /** Error message for boolean type validation */
  boolean?: ValidateMessage;

  /** Error messages for date type validation */
  date?: {
    invalid?: ValidateMessage;
    max?: ValidateMessage;
    min?: ValidateMessage;
  };

  /** Default error message when no specific message is found */
  default?: ValidateMessage;

  /** Error message for email format validation */
  email?: ValidateMessage;

  /** Error message for enum validation failure */
  enum?: ValidateMessage;

  /** Error message for float type validation */
  float?: ValidateMessage;

  /** Error message for hex color validation */
  hex?: ValidateMessage;

  /** Error messages for integer type validation */
  integer?: {
    invalid?: ValidateMessage;
    max?: ValidateMessage;
    min?: ValidateMessage;
  };

  /** Error messages for number type validation */
  number?: {
    invalid?: ValidateMessage;
    len?: ValidateMessage;
    max?: ValidateMessage;
    min?: ValidateMessage;
  };

  /** Error message for regular expression validation */
  regexp?: ValidateMessage;

  /** Error message for required field validation */
  required?: ValidateMessage;

  /** Error messages for string type validation */
  string?: {
    len?: ValidateMessage;
    maxLength?: ValidateMessage;
    minLength?: ValidateMessage;
    pattern?: ValidateMessage;
  };

  /** Error message for URL format validation */
  url?: ValidateMessage;

  /** Error message for whitespace-only string validation */
  whitespace?: ValidateMessage;
}

/**
 * Default validation message templates with placeholder support These messages can be customized by providing a
 * ValidateMessages object Placeholders like ${min}, ${max}, ${len} are replaced with actual rule values
 */
export const defaultValidateMessages: ValidateMessages = {
  boolean: 'Must be a boolean',
  date: {
    invalid: 'Must be a valid Date',
    max: 'Date is later than maximum',
    min: 'Date is earlier than minimum'
  },
  email: 'Must be a valid email',
  enum: 'Value is not in enum',
  float: 'Must be a float',
  hex: 'Must be a valid hex color',
  integer: {
    invalid: 'Must be an integer',
    max: 'Max is ${max}',
    min: 'Min is ${min}'
  },
  number: {
    invalid: 'Must be a number',
    len: 'Must equal ${len}',
    max: 'Max is ${max}',
    min: 'Min is ${min}'
  },
  regexp: 'Must be a valid regular expression',
  required: 'This field is required',
  string: {
    len: 'Length must be ${len}',
    maxLength: 'Max length is ${maxLength}',
    minLength: 'Min length is ${minLength}',
    pattern: 'Pattern not match'
  },
  url: 'Must be a valid URL',
  whitespace: 'Only whitespace is not allowed'
};
