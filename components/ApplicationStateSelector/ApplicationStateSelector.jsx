import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Select } from 'components/Form';
import { APPLICATION_STATE } from 'lib/dbMapping';
import { patchApplication } from 'utils/api/applications';

const ApplicationStateSelector = ({ status, onChange, applicationId }) => {
  const [error, setError] = useState();
  const [value, setValue] = useState(status);
  const handleOnChange = useCallback(async (status) => {
    if (!value) {
      return null;
    }
    setError(false);
    try {
      await patchApplication(applicationId, { status });
      setValue(status);
      onChange(status);
    } catch (e) {
      setError(e.response.data);
    }
  }, []);
  return (
    <>
      <Select
        name="state"
        label="State"
        options={Object.values(APPLICATION_STATE)}
        onChange={handleOnChange}
        value={value}
        error={error && { message: error }}
        isUnselectable={false}
      />
    </>
  );
};

ApplicationStateSelector.propTypes = {
  status: PropTypes.string.isRequired,
};

export default ApplicationStateSelector;
