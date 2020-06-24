import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import { fetchApplication, patchApplication } from 'utils/api/applications';
import Summary from 'components/Summary/Summary';
import ExpandableDetails from 'components/ExpandableDetails/ExpandableDetails';
import ApplicationStateSelector from 'components/ApplicationStateSelector/ApplicationStateSelector';
import Comments from 'components/Comments/Comments';

const ApplicationView = ({ applicationId }) => {
  const [data, setData] = useState();
  const [status, setStatus] = useState();
  const [error, setError] = useState(false);
  const [validationRecap, setValidationRecap] = useState();
  const { register, watch, reset } = useForm({ defaultValues: {} });
  const watcher = watch({ nest: true });
  const validations = JSON.stringify(watcher);
  const fetchData = useCallback(async applicationId => {
    if (!applicationId) {
      return null;
    }
    setError(false);
    try {
      const { application, validations } = await fetchApplication(
        applicationId
      );
      setData(application);
      validations && reset(JSON.parse(validations));
      setValidationRecap(getValidationRecap(watcher));
    } catch (e) {
      setError(e.response.data);
    }
  }, []);
  const saveValidation = useCallback(async validations => {
    try {
      await patchApplication(applicationId, { validations });
    } catch {
      fetchData(applicationId);
    }
  });
  const getValidationRecap = useCallback(watcher =>
    Object.entries(watcher).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: Object.values(value).every(Boolean)
      }),
      {}
    )
  );
  useEffect(() => {
    fetchData(applicationId);
  }, [applicationId]);
  useEffect(() => {
    validations !== '{}' && saveValidation(validations);
    setValidationRecap(getValidationRecap(watcher));
  }, [validations]);
  return (
    <>
      {data && (
        <>
          <div className="govuk-main-wrapper">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">
                <h1 className="govuk-!-margin-top-0">
                  {data.business.businessName}
                </h1>
                <div className="govuk-body">
                  Submitted: {new Date(data.applicationDate).toLocaleString()}
                </div>
                <div className="govuk-!-margin-top-7 govuk-!-margin-bottom-7">
                  <p className="govuk-body">
                    Email:{' '}
                    <a
                      href={`mailto:${data.contact.emailAddress}`}
                      target="_blank"
                    >
                      {data.contact.emailAddress}
                    </a>
                  </p>
                  {data.contact.telephoneNumber && (
                    <p className="govuk-body">
                      Phone:{' '}
                      <a
                        href={`tel:${data.contact.emailAddress}`}
                        target="_blank"
                      >
                        {data.contact.telephoneNumber}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <div className="govuk-grid-column-one-third">
                <ApplicationStateSelector
                  status={data.status}
                  applicationId={applicationId}
                  onChange={setStatus}
                />
              </div>
            </div>
          </div>

          <form>
            <Summary
              formData={data}
              filterOut={['supplementaryInformation']}
              register={register}
              isExpandable
              validationRecap={validationRecap}
            />
            <h2>Documents</h2>
            <ExpandableDetails>
              {data.documents.map(({ documentType, s3Path }) => (
                <div key={s3Path} className="govuk-body">
                  <a
                    className="govuk-link"
                    href={`/api/applications/${applicationId}/document/${s3Path}`}
                    target="_blank"
                  >
                    {documentType}
                  </a>
                </div>
              ))}
            </ExpandableDetails>
          </form>
          <Comments applicationId={applicationId} status={status} />
        </>
      )}
      {error && <p>{error}</p>}
    </>
  );
};

ApplicationView.propTypes = {
  applicationId: PropTypes.string.isRequired
};

export default ApplicationView;