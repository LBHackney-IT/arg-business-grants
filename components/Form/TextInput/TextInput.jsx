import PropTypes from 'prop-types';
import cx from 'classnames';

import ErrorMessage from '../../ErrorMessage/ErrorMessage';

const TextInput = ({
  label,
  hint,
  name,
  register,
  error,
  type = 'text',
  inputClassName,
  labelSize = 'm',
  ...otherProps
}) => (
  <div
    className={cx('govuk-form-group', {
      'govuk-form-group--error': error,
    })}
  >
    <label className={`govuk-label govuk-label--${labelSize}`} htmlFor={name}>
      {label}
    </label>
    {hint && (
      <span id={`${name}-hint`} className="govuk-hint">
        {hint}
      </span>
    )}
    {error && <ErrorMessage text={error.message} />}
    <input
      className={cx('govuk-input', inputClassName, {
        'govuk-input--error': error,
      })}
      id={name}
      data-testid={name}
      name={name}
      type={type}
      ref={register}
      aria-describedby={hint && `${name}-hint`}
      {...otherProps}
    />
  </div>
);

TextInput.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  labelSize: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  name: PropTypes.string.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  inputClassName: PropTypes.string,
  type: PropTypes.string,
  register: PropTypes.func,
};

export default TextInput;
