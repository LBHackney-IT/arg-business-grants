import { useState, useEffect } from 'react';
import Router from 'next/router';

import Summary from '../Summary/Summary';
import ErrorSummary from '../ErrorSummary/ErrorSummary';
import { set } from '../../utils/persistency';
import { postApplication } from '../../utils/api/applications';

const Result = ({ formData, clearFormData }) => {
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    Router.prefetch('/confirmation');
  }, []);
  const submitForm = async () => {
    try {
      setSubmitting(true);
      const ref = await postApplication(formData);
      set(ref, formData);
      clearFormData();
      return Router.push({
        pathname: '/confirmation',
        query: { ref },
      });
    } catch (e) {
      setSubmitting(false);
      setError(e.message);
    }
  };
  if (submitting) {
    return (
      <>
        <h1>Submitting...</h1>
        <h2>Do not navigate away from this page</h2>
      </>
    );
  }
  return (
    <>
      <h1>Summary</h1>
      <Summary formData={formData} hasChangeLink />
      <button
        className="govuk-button"
        onClick={submitForm}
        type="button"
        disabled={submitting}
      >
        Confirm and submit
      </button>
      {error && (
        <ErrorSummary
          title="Unfortunately there was a problem with your submission."
          body="Please try again later."
        />
      )}
    </>
  );
};

export default Result;
