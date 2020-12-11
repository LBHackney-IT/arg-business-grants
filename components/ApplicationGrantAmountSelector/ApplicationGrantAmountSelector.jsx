import { useState } from 'react';

import { Button, Select, TextInput } from 'components/Form';
import { patchApplication } from 'utils/api/applications';
import { FREE_TEXT } from '../../lib/dbMapping';

export const handleOnChange = (
  setError,
  setValue,
  setCustomValueVisible
) => async (grantAmountAwarded) => {
  setError(false);
  try {
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
  setError
) => {
  const grantAmountAwarded = FREE_TEXT.includes(value) ? customValue : value;

  setError(false);
  try {
    await grantApplicationPatcher(applicationId, {
      [storeAs]: grantAmountAwarded,
    });
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
}) => {
  const [error, setError] = useState();
  const [value, setValue] = useState(grantAmountAwarded);
  const [customValueVisible, setCustomValueVisible] = useState(
    value === 'Other'
  );
  const [customValue, setCustomValue] = useState(0);
  return (
    <>
      <Select
        name={name}
        label={label}
        options={options}
        onChange={handleOnChange(setError, setValue, setCustomValueVisible)}
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
            setError
          )
        }
        text="Award grant amount"
      />
    </>
  );
};

export default ApplicationGrantAmountSelector;
