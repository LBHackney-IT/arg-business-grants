import { APPLICATION_STATE, BUSINESS_CATEGORIES } from 'lib/dbMapping';

export const PAGE_MUST_BE_AT_LEAST_ONE =
  'Cannot list applications. Page must be at least 1.';
export const PAGINATED_PAST_END =
  'Cannot list applications. It appears that you have paginated beyond the end.';

const listApplications = ({ getDbInstance, getListGrantOfficers }) => async ({
  currentPage,
  pageSize,
  sort,
  status,
  businessCategory,
  grantOfficer,
  clientGeneratedId,
}) => {
  currentPage = currentPage !== undefined ? currentPage : 1;
  pageSize = pageSize || 10;
  sort = sort || '+applicationDate';

  if (currentPage < 1) {
    return createErrorResponse(PAGE_MUST_BE_AT_LEAST_ONE);
  }

  const offset = (currentPage - 1) * pageSize;
  let sortBy = 'ga.date_time_recorded';
  switch (sort.slice(1)) {
    case 'businessName':
      sortBy = 'LOWER(b.business_name)';
      break;
  }
  const sortDirection = sort.slice(0, 1) === '-' ? 'DESC' : 'ASC';
  const statesFilter = calculateStatesFilter(status);
  const businessCategoriesFilter = calculateBusinessCategoriesFilter(
    businessCategory
  );
  const listGrantOfficers = getListGrantOfficers();
  const grantOfficerFilter = await calculateGrantOfficersFilter(
    listGrantOfficers,
    grantOfficer
  );
  const clientGeneratedIdFilter = clientGeneratedId || '%';

  const db = await getDbInstance();
  const query = `
    SELECT
      ga.date_time_recorded,
      ga.client_generated_id,
      b.business_name,
      state.description AS status,
      COUNT(*) OVER() AS total_applications
    FROM
      grant_application AS ga
    JOIN business AS b ON
      b.grant_application_id = ga.id
    JOIN eligibility_criteria AS ec
      ON ec.grant_application_id = ga.id
    JOIN application_assessment AS aa ON
      ga.id = aa.grant_application_id
    JOIN (
      SELECT DISTINCT grant_application_id
        FROM application_history
        WHERE user_recorded IN ($(grantOfficerFilter:list))
      ) AS ah
      ON ga.id = ah.grant_application_id
    JOIN application_state AS state ON
      aa.application_state_id = state.id
    JOIN business_category as bc ON
      b.business_category_id = bc.id
    WHERE aa.application_state_id IN ($(statesFilter:list))
      AND ga.client_generated_id LIKE $(clientGeneratedIdFilter)
      AND b.business_category_id IN ($(businessCategoriesFilter:list))
    ORDER BY ${sortBy} ${sortDirection}
    LIMIT $(pageSize) OFFSET $(offset);`;

  const applications = await db.any(query, {
    pageSize,
    offset,
    statesFilter,
    businessCategoriesFilter,
    grantOfficerFilter,
    clientGeneratedIdFilter,
  });

  const totalPages = calculateTotalPages();

  if (totalPages === 0 && currentPage > 1) {
    return createErrorResponse(PAGINATED_PAST_END);
  }

  return {
    applications: applications.map((application) => {
      return {
        clientGeneratedId: application.client_generated_id,
        businessName: application.business_name,
        applicationDate: new Date(application.date_time_recorded).toISOString(),
        status: application.status,
      };
    }),
    pagination: {
      totalPages,
      currentPage,
      links: {
        firstPage: createPageURL(1),
        lastPage: createPageURL(totalPages),
        previousPage: createPageURL(currentPage - 1),
        nextPage: createPageURL(currentPage + 1),
      },
    },
    error: null,
  };

  function calculateTotalPages() {
    let totalPages = 0;
    if (applications.length > 0) {
      totalPages = Math.ceil(applications[0].total_applications / pageSize);
    }
    return totalPages;
  }

  function createPageURL(page) {
    if (page < 1) {
      return null;
    }
    return `/api/applications?page=${page}&pageSize=${pageSize}`;
  }

  function createErrorResponse(error) {
    return {
      applications: null,
      pagination: null,
      error,
    };
  }

  function calculateStatesFilter(requiredState) {
    let result = [];

    requiredState = requiredState || '';
    const statusIndex = APPLICATION_STATE.findIndex(
      (status) => status === requiredState
    );

    if (statusIndex !== -1) {
      result.push(statusIndex + 1);
    } else {
      for (let x = 0; x < APPLICATION_STATE.length; x++) {
        result.push(x + 1);
      }
    }
    return result;
  }

  function calculateBusinessCategoriesFilter(requiredBusinessCategory) {
    let result = [];

    requiredBusinessCategory = requiredBusinessCategory || '';
    const businessCategoryIndex = BUSINESS_CATEGORIES.findIndex(
      (businessCategory) => businessCategory === requiredBusinessCategory
    );

    if (businessCategoryIndex !== -1) {
      result.push(businessCategoryIndex + 1);
    } else {
      for (let x = 0; x < BUSINESS_CATEGORIES.length; x++) {
        result.push(x + 1);
      }
    }
    return result;
  }

  async function calculateGrantOfficersFilter(
    listGrantOfficers,
    requiredOfficer
  ) {
    const grantOfficersResponse = await listGrantOfficers();
    const allKnownGrantOfficers = grantOfficersResponse.grantOfficers.map(
      (grantOfficer) => grantOfficer.identifier
    );
    requiredOfficer = allKnownGrantOfficers.find(
      (officer) => officer === requiredOfficer
    );
    if (!requiredOfficer) {
      return allKnownGrantOfficers;
    }
    return [requiredOfficer];
  }
};

export default listApplications;
