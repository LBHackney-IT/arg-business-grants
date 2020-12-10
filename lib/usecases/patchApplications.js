const ObjectsToCsv = require('objects-to-csv');

const patchApplications = ({ getDbInstance }) => async ({ author }) => {
  const db = await getDbInstance();

  const query = `
    WITH exported AS
    (
        UPDATE
            application_assessment
        SET
            application_state_id = 9 -- Mark as Exported for Payment
        WHERE
            application_state_id = 4 -- Processed - Approved
        RETURNING grant_application_id
    ),
    noted as
    (
      INSERT INTO
          application_history (grant_application_id, date_time_recorded, user_recorded, notes)
          SELECT
              ex.grant_application_id,
              now(),
              $(user),
              'Application Exported for Payment'
          FROM
              exported ex
    )
    SELECT
        'D' AS record_type,
        ga.id + 1000 AS unique_payment_reference, -- Add 100 to avoid conflicts with previous manual references
        ga.client_generated_id,
        bba.account_holder,
        ba.first_line AS business_address_first_line,
        ba.second_line AS business_address_second_line,
        ba.third_line AS business_address_third_line,
        ba.ward AS business_address_fourth_line,
        ba.postcode AS business_address_postcode,
        aa.grant_amount_awarded AS amount_to_pay,
        aa.validations,
        'B' AS payment_type,
        bba.account_sortcode,
        bba.account_number
    FROM
        exported ex
        JOIN
            grant_application ga
            ON ex.grant_application_id = ga.id
        JOIN
            business b
            ON ga.id = b.grant_application_id
        JOIN
            business_bank_account bba
            ON ga.id = bba.grant_application_id
        JOIN
            contact c
            ON ga.id = c.grant_application_id
        JOIN
            business_address ba
            ON ga.id = ca.grant_application_id
        JOIN
            application_assessment aa
            ON ga.id = aa.grant_application_id;`;

  const applications = await db.any(query, { user: author });

  let results = [];
  let appsCsv = '';

  if (applications && applications.length > 0) {
    results = applications.map((application) => {
      const validations = JSON.parse(application.validations);
      return {
        record_type: application.record_type,
        unique_payment_reference: application.unique_payment_reference,
        account_holder:
          validations.businessBankAccount === undefined ||
          validations.businessBankAccount.accountHolder === false
            ? ''
            : application.account_holder,
        business_address_first_line: application.business_address_first_line,
        business_address_second_line: application.business_address_second_line,
        business_address_third_line: application.business_address_third_line,
        business_address_fourth_line: application.business_address_fourth_line,
        business_address_postcode: application.business_address_postcode,
        amount_to_pay: application.amount_to_pay,
        payment_type: application.payment_type,
        account_sortcode:
          validations.businessBankAccount === undefined ||
          validations.businessBankAccount.accountSortcode === false
            ? ''
            : application.account_sortcode,
        account_number:
          validations.businessBankAccount === undefined ||
          validations.businessBankAccount.accountNumber === false
            ? ''
            : application.account_number,
        client_generated_id: application.client_generated_id,
      };
    });

    appsCsv = await new ObjectsToCsv(results).toString(false);
  }

  const headerData = [
    {
      rectype: 'H',
      code: 'NRGRT',
      council: 'Hackney',
      dt: dateAsDottedString(),
      rows: results.length,
      val: 0,
    },
  ];
  const headerCsv = await new ObjectsToCsv(headerData).toString(false);
  const csvString = headerCsv + appsCsv;

  return {
    csvString,
    error: null,
  };

  function dateAsDottedString() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return dd + '.' + mm + '.' + yyyy;
  }
};

export default patchApplications;
