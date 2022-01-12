import { useRouter } from 'next/router';

import { redirectIfNotAuth } from '../../utils/auth';
import ApplicationView from '../../../components/ApplicationView/ApplicationView';

const ApplicationViewPage = () => {
  const router = useRouter();
  const { clientGeneratedId, ...queryParameters } = router.query;
  return (
    <>
      <a
        className="govuk-back-link"
        role="button"
        onClick={() =>
          router.push({
            pathname: '/admin',
            query: {
              ...queryParameters,
            },
          })
        }
      >
        Back
      </a>
      <ApplicationView applicationId={clientGeneratedId} />
    </>
  );
};

export const getServerSideProps = redirectIfNotAuth;

export default ApplicationViewPage;
