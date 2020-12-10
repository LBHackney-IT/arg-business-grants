import ObjectsToCsv from 'objects-to-csv';
import { FREE_TEXT } from '../dbMapping';

const listApplicationsCSV = ({ getDbInstance }) => async () => {
  const db = await getDbInstance();
  const query = `
    SELECT
       ga.client_generated_id,
       apst.description AS application_status,
       b.business_name AS business_trading_name,
       b.registered_name AS business_registered_name,
       b.business_identify_type AS business_identifying_number_type,
       b.business_identify_number AS business_identifying_number,
       bs.description AS business_size,
       bc.description AS business_category,
       b.business_rates_account_number,
       CASE
        WHEN b.business_premises_description IN ($(other))
          THEN b.business_premises_text
        ELSE b.business_premises_description
       END AS business_premises_description,
       c.first_name AS contact_first_name,
       c.last_name AS contact_last_name,
       c.date_of_birth,
       c.email_address AS contact_email_address,
       c.telephone_number AS contact_telephone_number,
       ba.first_line AS building_name_floor_unit,
       ba.second_line AS street_number,
       ba.third_line AS street,
       ba.ward AS town,
       ba.postcode AS business_post_code,
       bba.bank_name,
       bba.account_holder AS bank_account_holder_name,
       bba.account_number AS bank_account_number,
       bba.account_sortcode AS bank_sort_code
    FROM
      grant_application ga
        JOIN
          application_assessment apa
          ON ga.id = apa.grant_application_id
        JOIN
          application_state apst
          ON apst.id = apa.application_state_id
        JOIN
          eligibility_criteria ec
          ON ga.id = ec.grant_application_id
        JOIN
          contact c
          ON ga.id = c.grant_application_id
        JOIN
          business b
          ON ga.id = b.grant_application_id
        JOIN
          business_size bs
          ON bs.id = b.business_size_id
        JOIN
          business_category bc
          ON bc.id = b.business_category_id
        JOIN
          business_address ba
          ON ga.id = ba.grant_application_id
        JOIN
          business_bank_account bba
          ON ga.id = bba.grant_application_id
    ORDER BY
      ga.id ASC;`;

  const applications = await db.any(query, { other: FREE_TEXT.join(', ') });

  const results = applications.map((application) => ({
    client_generated_id: application.client_generated_id,
    application_status: application.application_status,
    business_trading_name: application.business_trading_name,
    business_registered_name: application.business_registered_name,
    business_identifying_number_type:
      application.business_identifying_number_type,
    business_identifying_number: application.business_identifying_number,
    business_size: application.business_size,
    business_category: application.business_category,
    business_premises_description: application.business_premises_description,
    contact_first_name: application.contact_first_name,
    contact_last_name: application.contact_last_name,
    date_of_birth: application.date_of_birth,
    contact_email_address: application.contact_email_address,
    contact_telephone_number: application.contact_telephone_number,
    business_rates_account_number: application.business_rates_account_number,
    building_name_floor_unit: application.building_name_floor_unit,
    street_number: application.street_number,
    street: application.street,
    town: application.town,
    business_post_code: application.business_post_code,
    bank_name: application.bank_name,
    bank_account_holder_name: application.bank_account_holder_name,
    bank_account_number: application.bank_account_number,
    bank_sort_code: application.bank_sort_code,
  }));

  const csvString = await new ObjectsToCsv(results).toString();

  return {
    csvString,
    error: null,
  };
};

export default listApplicationsCSV;
