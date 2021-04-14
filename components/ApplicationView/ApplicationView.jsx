import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import { GRANT_AMOUNT, GRANT_AMOUNT_ROUND_2 } from 'lib/dbMapping';
import { fetchApplication, patchApplication } from 'utils/api/applications';
import Summary from 'components/Summary/Summary';
import ExpandableDetails from 'components/ExpandableDetails/ExpandableDetails';
import ApplicationGrantAmountSelector from 'components/ApplicationGrantAmountSelector/ApplicationGrantAmountSelector';
import ApplicationStateSelector from 'components/ApplicationStateSelector/ApplicationStateSelector';
import Comments from 'components/Comments/Comments';
import { Checkbox } from 'components/Form';

const ApplicationView = ({ applicationId }) => {
  const [data, setData] = useState();
  const [error, setError] = useState(false);
  const [status, setStatus] = useState();
  const [grantAmountAwarded, setGrantAwardedAmount] = useState();
  const [grantAmountAwardedRound2, setGrantAwardedAmountRound2] = useState();
  const [validationRecap, setValidationRecap] = useState();
  const { register, watch, reset } = useForm({ defaultValues: {} });
  const watcher = watch({ nest: true });
  const validations = JSON.stringify(watcher);
  const [legitValidation, setLegitValidation] = useState();
  const fetchData = useCallback(async (applicationId) => {
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
  const saveValidation = useCallback(async (validations) => {
    try {
      await patchApplication(applicationId, { validations });
    } catch {
      fetchData(applicationId);
    }
  });
  const getValidationRecap = useCallback((watcher) =>
    Object.entries(watcher).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: Object.values(value).every(Boolean),
      }),
      {}
    )
  );
  useEffect(() => {
    fetchData(applicationId);
  }, [applicationId]);
  useEffect(() => {
    if (validations !== '{}') {
      legitValidation ? saveValidation(validations) : setLegitValidation(true);
      setValidationRecap(getValidationRecap(watcher));
    }
  }, [validations]);
  return (
    <>
      {data && (
        <>
          <div className="govuk-main-wrapper">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">
                <h1
                  className="govuk-!-margin-top-0"
                  data-testid="application-view-business-name"
                >
                  {data.business.businessName}
                </h1>
                <div className="govuk-body">
                  Submitted: {new Date(data.applicationDate).toLocaleString()}
                </div>
                <div className="govuk-!-margin-top-7 govuk-!-margin-bottom-7">
                  <p
                    className="govuk-body"
                    data-testid="application-view-business-email"
                  >
                    Email:{' '}
                    <a
                      href={`mailto:${data.contact.emailAddress}`}
                      target="_blank"
                    >
                      {data.contact.emailAddress}
                    </a>
                  </p>
                  {data.contact.telephoneNumber && (
                    <p
                      className="govuk-body"
                      data-testid="application-view-business-phone"
                    >
                      Phone:{' '}
                      <a
                        href={`tel:${data.contact.emailAddress}`}
                        target="_blank"
                      >
                        {data.contact.telephoneNumber}
                      </a>
                    </p>
                  )}
                  {data.business.previousApplicationId && (
                    <p
                      className="govuk-body"
                      data-testid="application-view-previuos-application"
                    >
                      Previous Application:{' '}
                      {parseInt(data.business.previousApplicationFound) ===
                      1 ? (
                        <a
                          href={`/admin/applications/${data.business.previousApplicationId}`}
                          target="_blank"
                        >
                          {data.business.previousApplicationId}
                        </a>
                      ) : (
                        <span>
                          {data.business.previousApplicationId} (Application ID
                          not found)
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <Checkbox
                  name="nfi_check"
                  label="NFI Check"
                  register={register}
                />
              </div>
              <div className="govuk-grid-column-one-third">
                <ApplicationStateSelector
                  status={data.status}
                  applicationId={applicationId}
                  onChange={setStatus}
                />

                <ApplicationGrantAmountSelector
                  storeAs="grantAmountAwarded"
                  name="arg"
                  label="Round 1 Grant Amount"
                  options={GRANT_AMOUNT}
                  grantAmountAwarded={data.grantAmountAwarded}
                  applicationId={applicationId}
                  onChange={setGrantAwardedAmount}
                  tag={data.round1PaymentExported ? 'EXPORTED' : ''}
                />

                <ApplicationGrantAmountSelector
                  storeAs="grantAmountAwardedRound2"
                  name="arg-round-2"
                  label="Round 2 Grant Amount"
                  options={GRANT_AMOUNT_ROUND_2}
                  grantAmountAwarded={data.grantAmountAwardedRound2}
                  applicationId={applicationId}
                  onChange={setGrantAwardedAmountRound2}
                  tag={data.round2PaymentExported ? 'EXPORTED' : ''}
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
          <Comments
            applicationId={applicationId}
            status={status}
            grantAmountAwarded={grantAmountAwarded}
            grantAmountAwardedRound2={grantAmountAwardedRound2}
          />
        </>
      )}
      {error && <p>{error}</p>}
    </>
  );
};

ApplicationView.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

export default ApplicationView;
