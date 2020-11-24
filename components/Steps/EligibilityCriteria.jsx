import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button, Radios } from 'components/Form';
import { stepPath, getInputProps } from 'components/Steps';
import ErrorSummary from 'components/ErrorSummary/ErrorSummary';

const Step1 = (props) => {
  const { register, errors, handleSubmit } = useForm({
    defaultValues: props.formData,
  });
  const [showError, setShowError] = useState(false);
  const onSubmit = (data) => {
    const hasSomeDeclines = Object.entries(data.eligibilityCriteria).some(
      // eslint-disable-next-line no-unused-vars
      ([key, value]) => value === 'No'
    );
    setShowError(hasSomeDeclines);
    if (!hasSomeDeclines) {
      props.saveData(data);
      Router.push(stepPath, props.nextStep);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className="govuk-fieldset"
        role="group"
        aria-describedby="step-hint"
      >
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 className="govuk-fieldset__heading">Eligibility Criteria</h1>
        </legend>
        <span id="step-hint" className="govuk-hint">
          Applicants must meet all the eligibility questions to proceed to the
          next section
        </span>
        <Radios
          {...getInputProps(
            'eligibilityCriteria',
            'tradingInHackney',
            {
              register,
            },
            errors
          )}
          onChange={() => setShowError(false)}
        />
        <Radios
          {...getInputProps(
            'eligibilityCriteria',
            'liableForRates',
            {
              register,
            },
            errors
          )}
          onChange={() => setShowError(false)}
        />
        <Radios
          {...getInputProps(
            'eligibilityCriteria',
            'isBusinessClosed',
            {
              register,
            },
            errors
          )}
          onChange={() => setShowError(false)}
        />
      </fieldset>
      {showError && (
        <ErrorSummary
          title="Unfortunately you are not eligible for this grant."
          body="The information provided does not meet the specified requirements."
        />
      )}
      {!showError && (
        <Button className="govuk-button" text="Next" type="submit" />
      )}
    </form>
  );
};

export default Step1;
