import PropTypes from 'prop-types';
import cx from 'classnames';
import isPostcodeValid from 'uk-postcode-validator';

import { TextInput } from '../TextInput/TextInput';

const AddressBox = ({ name, register, error = {} }) => (
  <div className="govuk-form-group">
    <TextInput
      label="Building Name / Floor / Unit"
      labelSize="s"
      name={`${name}.buildName`}
      register={register}
    />
    <TextInput
      label="Street Number"
      labelSize="s"
      error={error.streetNumber}
      name={`${name}.streetNumber`}
      register={register({ required: true })}
    />
    <TextInput
      label="Street"
      labelSize="s"
      error={error.street}
      name={`${name}.street`}
      register={register({ required: true })}
    />
    <TextInput
      label="Town"
      labelSize="s"
      error={error.town}
      name={`${name}.town`}
      register={register({ required: true })}
    />
    <TextInput
      label="Postcode"
      labelSize="s"
      error={error.postcode}
      name={`${name}.postcode`}
      register={register({
        required: true,
        validate: {
          valid: (value) =>
            value === '' ||
            (value && isPostcodeValid(value)) ||
            'You entered an invalid postcode',
        },
      })}
    />
  </div>
);

const AddressLookup = ({ name, label, hint, register, error }) => (
  <div
    className={cx('govuk-form-group', {
      'govuk-form-group--error': Boolean(error),
    })}
  >
    <label
      className="govuk-label govuk-label--m"
      htmlFor={`${name}.streetNumber`}
    >
      {label}
    </label>
    {hint && (
      <span id={`${name}-hint`} className="govuk-hint">
        {hint}
      </span>
    )}
    <AddressBox name={name} register={register} error={error} />
  </div>
);

AddressLookup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  register: PropTypes.func,
  error: PropTypes.shape({ message: PropTypes.string }),
};

export default AddressLookup;
