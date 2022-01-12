import { redirectIfNotAuth } from '../../utils/auth';

import ApplicationsList from '../../components/ApplicationsList/ApplicationsList';

const AdminPage = ({ name, ...props }) => (
  <>
    <h1 data-testid="admin-page-heading">Hello {name}</h1>
    <ApplicationsList {...props} />
  </>
);

export const getServerSideProps = redirectIfNotAuth;

export default AdminPage;
