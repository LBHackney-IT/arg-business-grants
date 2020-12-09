import getDb from '../gateways/db';
import * as options from 'lib/dbMapping';

export default async ({
  clientGeneratedId,
  eligibilityCriteria,
  contact,
  business,
  supplementaryInformation,
  businessBankAccount,
  declaration,
}) => {
  const db = await getDb.getInstance();
  const grantApplication = await db.one(
    `INSERT INTO grant_application
      (client_generated_id)
      VALUES ($1)
      RETURNING id
        `,
    [clientGeneratedId]
  );

  await db.none(
    `INSERT INTO eligibility_criteria
      (grant_application_id, trading_in_hackney, meets_arg_criteria, served_legal_notices, trading_on_04_11_20, eligible_for_lrsg_closed_grant)
      VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      grantApplication.id,
      eligibilityCriteria.tradingInHackney,
      eligibilityCriteria.meetsArgCriteria,
      eligibilityCriteria.servedLegalNotices,
      eligibilityCriteria.tradingOn041120,
      eligibilityCriteria.eligibleForLrsgClosedGrant,
    ]
  );

  await db.one(
    `INSERT INTO contact
      (grant_application_id, first_name, last_name, email_address, telephone_number, date_of_birth)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
    [
      grantApplication.id,
      contact.firstName,
      contact.lastName,
      contact.emailAddress,
      contact.telephoneNumber,
      contact.dateOfBirth,
    ]
  );

  await db.none(
    `INSERT INTO public.contact_address
      (grant_application_id, first_line, second_line, third_line, ward, postcode)
      VALUES($1, $2, $3, $4, $5, $6)`,
    [
      grantApplication.id,
      contact.address.buildName,
      contact.address.streetNumber,
      contact.address.street,
      contact.address.town,
      contact.address.postcode,
    ]
  );

  await db.one(
    `INSERT INTO business
    (grant_application_id, business_name, registered_name, business_size_id, business_identify_type, business_identify_number, liable_for_rates, business_rates_account_number, business_rates_payer, how_many_employees, business_category_id, business_reference_number, business_description, business_structure, business_premises_description, business_premises_text, business_rateable_value, business_website, business_impact_statement)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING id
  `,

    [
      grantApplication.id,
      business.businessName,
      business.registeredName,
      options.BUSINESS_SIZE.indexOf(business.businessSizeId) + 1,
      business.businessIdentifyType,
      business.businessIdentifyNumber,
      business.liableForBusinessRates,
      business.businessRatesAccountNumber,
      business.businessRatesPayer,
      business.howManyEmployees,
      options.BUSINESS_CATEGORIES.indexOf(business.businessCategory) + 1,
      business.businessReferenceNumber,
      business.businessDescription,
      business.businessStructure,
      business.businessPremisesDescription,
      business.businessPremisesText,
      business.businessRatableValue,
      business.businessWebsite,
      business.businessImpactStatement,
    ]
  );

  await db.none(
    `
    INSERT INTO business_address
    (grant_application_id, first_line, second_line, third_line, ward, postcode)
    VALUES($1, $2, $3, $4, $5, $6)
    `,
    [
      grantApplication.id,
      business.businessAddress.buildName,
      business.businessAddress.streetNumber,
      business.businessAddress.street,
      business.businessAddress.town,
      business.businessAddress.postcode,
    ]
  );

  await db.none(
    `
    INSERT INTO business_trading_address
    (grant_application_id, first_line, second_line, third_line, ward, postcode)
    VALUES($1, $2, $3, $4, $5, $6)
    `,
    [
      grantApplication.id,
      business.businessTradingAddress.buildName,
      business.businessTradingAddress.streetNumber,
      business.businessTradingAddress.street,
      business.businessTradingAddress.town,
      business.businessTradingAddress.postcode,
    ]
  );

  await db.none(
    `INSERT INTO business_bank_account
      (grant_application_id, bank_name, account_holder, account_number, account_sortcode)
      VALUES($1, $2, $3, $4, $5)`,
    [
      grantApplication.id,
      businessBankAccount.bankName,
      businessBankAccount.accountHolder,
      businessBankAccount.accountNumber,
      businessBankAccount.accountSortcode,
    ]
  );

  await db.none(
    `INSERT INTO declaration
     (grant_application_id, name, contact_type_id, contact_type_text, authorise_on_behalf, business_meets_criteria, business_i_will_inform, business_not_exceed, business_not_undertaking, business_recoverable_agreeement, business_permit_data, business_share_with_beis, business_happy_contacted)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      grantApplication.id,
      declaration.name,
      options.CONTACT_TYPE.indexOf(declaration.contactTypeId) + 1,
      declaration.contactTypeIdText,
      declaration.authoriseOnBehalf,
      declaration.businessMeetsCriteria,
      declaration.businessIWillInform,
      declaration.businessNotExceed,
      declaration.businessNotUndertaking,
      declaration.recoverableAgreement,
      declaration.businessPermitData,
      declaration.businessShareWithBEIS,
      declaration.businessHappyContacted,
    ]
  );

  const documentPromises = Object.entries(supplementaryInformation).reduce(
    (acc, [fileType, value]) => [
      ...acc,
      ...value.map((file) =>
        db.none(
          `INSERT INTO document_upload
          (grant_application_id, s3_path, document_type)
          VALUES($1, $2, $3)`,
          [grantApplication.id, file, fileType]
        )
      ),
    ],
    []
  );

  const documentInsertResults = await Promise.allSettled(documentPromises);
  for (const promiseResult in documentInsertResults) {
    if (promiseResult.status === 'rejected') {
      throw Error('A document failed to be inserted in the db');
    }
  }

  await db.none(
    `INSERT INTO application_assessment
    (grant_application_id, application_state_id, validations)
     VALUES($1, $2, $3)`,
    [grantApplication.id, 1, '{}']
  );

  await db.none(
    `INSERT INTO application_history
    (grant_application_id, user_recorded, notes)
    VALUES($1, $2, $3);`,
    [grantApplication.id, 'system', 'Application received']
  );
};
