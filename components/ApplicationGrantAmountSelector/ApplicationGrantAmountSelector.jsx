import { useState } from 'react';

import { Button, Select, TextInput } from 'components/Form';
import { patchApplication } from 'utils/api/applications';
import { GRANT_AMOUNT, FREE_TEXT } from '../../lib/dbMapping';

export const handleOnChange = (
  setError,
  setValue,
  setCustomValueVisible,
  setSuccessMessage
) => async (grantAmountAwarded) => {
  setError(false);
  try {
    setSuccessMessage(false);
    setValue(grantAmountAwarded);

    if (FREE_TEXT.includes(grantAmountAwarded)) {
      setCustomValueVisible(true);
    } else {
      setCustomValueVisible(false);
    }
  } catch (e) {
    setError(e.response.data);
  }
};

export const handleSubmit = async (
  value,
  customValue,
  grantApplicationPatcher,
  applicationId,
  storeAs,
  setError,
  onChange,
  setSuccessMessage
) => {
  const grantAmountAwarded = FREE_TEXT.includes(value) ? customValue : value;

  setError(false);
  try {
    await grantApplicationPatcher(applicationId, {
      [storeAs]: grantAmountAwarded,
    });
    onChange(grantAmountAwarded);
    setSuccessMessage(true);
  } catch (e) {
    setError(e.response.data);
  }
};

const ApplicationGrantAmountSelector = ({
  grantAmountAwarded,
  applicationId,
  name,
  label,
  options,
  storeAs,
  onChange,
}) => {
  const [error, setError] = useState();
  const [successMessage, setSuccessMessage] = useState(false);
  const [value, setValue] = useState(
    GRANT_AMOUNT.includes(grantAmountAwarded) ? grantAmountAwarded : 'Other'
  );
  const [customValueVisible, setCustomValueVisible] = useState(
    !GRANT_AMOUNT.includes(grantAmountAwarded)
  );
  const [customValue, setCustomValue] = useState(grantAmountAwarded);
  return (
    <>
      <Select
        name={name}
        label={label}
        options={options}
        onChange={handleOnChange(
          setError,
          setValue,
          setCustomValueVisible,
          setSuccessMessage
        )}
        value={value}
        error={error && { message: error }}
        isUnselectable={false}
      />
      {customValueVisible && (
        <TextInput
          name={name}
          onChange={(event) => setCustomValue(event.target.value)}
          value={customValue}
        />
      )}
      <Button
        onClick={() =>
          handleSubmit(
            value,
            customValue,
            patchApplication,
            applicationId,
            storeAs,
            setError,
            onChange,
            setSuccessMessage
          )
        }
        className="govuk-button govuk-!-margin-0"
        text="Award grant amount"
      />
      {successMessage && (
        <div
          class="govuk-notification-banner govuk-notification-banner--success"
          role="alert"
          aria-labelledby="govuk-notification-banner-title"
          data-module="govuk-notification-banner"
        >
          <div class="govuk-notification-banner__content">
            <p class="govuk-body">Grant amount awarded</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationGrantAmountSelector;
