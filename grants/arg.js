import { steps } from 'components/Steps';

export const argGrantDefinition = {
  name: 'Additional Restrictions Grant',
  longName: 'Apply for the COVID-19 Additional Restrictions Grant - Round 2',
  activeFrom: new Date(2022, 0, 1),
  activeUntil: new Date(2023, 1, 1),
  body: (
    <>
      <p className="govuk-body">
        The Government has announced a series of grants for certain businesses
        affected by the COVID-19 pandemic.
      </p>
      <p className="govuk-body">
        By completing this application form, you will be considered for the
        COVID-19{' '}
        <a
          className="govuk-link"
          href="https://www.gov.uk/guidance/check-if-youre-eligible-for-the-coronavirus-additional-restrictions-grant"
          data-testid="arg-govuk-link"
        >
          Additional Restrictions Grant
        </a>
        .
      </p>
      <p className="govuk-body">
        Check{' '}
        <a
          className="govuk-link"
          href="https://hackney.gov.uk/business-grants"
          data-testid="arg-hackney-link"
        >
          additional restrictions grant
        </a>{' '}
        for more information by Hackney Council.
      </p>
    </>
  ),
  steps,
};
