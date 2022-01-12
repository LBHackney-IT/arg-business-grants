import { useApplications } from 'hooks/use-application';
import { useRouter } from 'next/router';

const ApplicationLandingPage = () => {
  const { query } = useRouter();
  const { getApplication } = useApplications();

  const application = getApplication(query.grantName);

  return (
    <div>
      <h1 data-testid="home-page-heading">{application.longName}</h1>
      {application.body}

      <a
        href={`/apply/${query.grantName}/step/${
          Object.entries(application.steps)[0][0]
        }`}
        className="govuk-button govuk-button--start govuk-!-margin-top-3"
        data-module="govuk-button"
      >
        Start now
        <svg
          className="govuk-button__start-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="17.5"
          height="19"
          viewBox="0 0 33 40"
          aria-hidden="true"
          focusable="false"
        >
          <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
        </svg>
      </a>
    </div>
  );
};

export const getServerSideProps = () => {
  return {
    props: {},
  };
};

export default ApplicationLandingPage;
