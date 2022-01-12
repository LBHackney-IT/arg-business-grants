import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button, Radios } from '../Form';
import { stepPath, getInputProps } from '../Steps';
import ErrorSummary from '../ErrorSummary/ErrorSummary';

const Step1 = (props) => {
  const { register, errors, handleSubmit } = useForm({
    defaultValues: props.formData,
  });
  const [showError, setShowError] = useState(false);
  const onSubmit = (data) => {
    let eligible = true;

    Object.entries(data.eligibilityCriteria).forEach(([key, value]) => {
      if (key === 'servedLegalNotices' && value === 'Yes') {
        eligible = false;
      } else if (key === 'eligibleForLrsgGrants' && value === 'Yes') {
        eligible = false;
      } else if (
        key !== 'servedLegalNotices' &&
        key !== 'eligibleForLrsgGrants' &&
        value === 'No'
      ) {
        eligible = false;
      }
    });

    setShowError(!eligible);

    if (eligible) {
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
            'meetsArgCriteriaRound2',
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
            'servedLegalNotices',
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
            'tradingOn011220',
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
            'eligibleForLrsgGrants',
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
