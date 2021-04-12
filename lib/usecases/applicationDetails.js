import getDb from '../gateways/db';
import {
  APPLICATION_STATE,
  BUSINESS_CATEGORIES,
  BUSINESS_SIZE,
  CONTACT_TYPE,
} from 'lib/dbMapping';
import { APPLICATION_NOT_FOUND } from '../constants';

export default async ({ clientGeneratedId }) => {
  const dbInstance = await getDb.getInstance();
  let application = {};
  try {
    application = await getApplicationData(dbInstance, clientGeneratedId);
  } catch (error) {
    if (
      error.name === 'QueryResultError' &&
      // queryResultErrorCode.noData is 0, see https://github.com/vitaly-t/pg-promise/blob/master/lib/errors/query-result-error.js
      error.code === 0
    ) {
      return createErrorResponse(APPLICATION_NOT_FOUND);
    }
    return createErrorResponse(error.message);
  }
  const uploadedDocuments = await getDocuments(dbInstance, clientGeneratedId);
  return {
    application: {
      clientGeneratedId,
      applicationDate: new Date(application.date_time_recorded).toISOString(),
      status: APPLICATION_STATE[application.application_state_id - 1],
      grantAmountAwarded: application.grant_amount_awarded,
      grantAmountAwardedRound2: application.grant_amount_awarded_round_2,
      eligibilityCriteria: {
        tradingInHackney: application.trading_in_hackney,
        meetsArgCriteria: application.meets_arg_criteria,
        meetsArgCriteriaRound2: application.meets_arg_criteria_round_2,
        servedLegalNotices: application.served_legal_notices,
        tradingOn041120: application.trading_on_04_11_20,
        tradingOn011220: application.trading_on_01_12_20,
        eligibleForLrsgClosedGrant: application.eligible_for_lrsg_closed_grant,
        eligibleForLrsgGrants: application.eligible_for_lrsg_grants,
      },
      contact: {
        firstName: application.first_name,
        lastName: application.last_name,
        emailAddress: application.email_address,
        telephoneNumber: application.telephone_number,
        address: {
          buildName: application.contact_address_first_line,
          streetNumber: application.contact_address_second_line,
          street: application.contact_address_third_line,
          town: application.contact_address_ward,
          postcode: application.contact_address_postcode,
        },
        dateOfBirth: application.date_of_birth,
      },
      business: {
        businessName: application.business_name,
        registeredName: application.registered_name,
        previouslyApplied: application.previously_applied,
        previousApplicationId: application.previous_application_id,
        previousApplicationFound: application.previous_application_found,
        liableForRates: application.liable_for_rates,
        howManyEmployees: application.how_many_employees,
        businessCategory:
          BUSINESS_CATEGORIES[application.business_category_id - 1],
        businessReferenceNumber: application.business_reference_number,
        businessDescription: application.business_description,
        businessSizeId: BUSINESS_SIZE[application.business_size_id - 1],
        businessIdentifyType: `${application.business_identify_type} - ${application.business_identify_number}`,
        businessStructure: application.business_structure,
        businessRatesAccountNumber: application.business_rates_account_number,
        businessRatesPayer: application.business_rates_payer,
        businessPremisesDescription: `${application.business_premises_description} ${application.business_premises_text}`,
        tradingDaysPerWeek: application.trading_days_per_week,
        businessRateableValue: application.business_rateable_value,
        businessTradingAddress: {
          buildName: application.business_trading_address_first_line,
          streetNumber: application.business_trading_address_second_line,
          street: application.business_trading_address_third_line,
          town: application.business_trading_address_ward,
          postcode: application.business_trading_address_postcode,
        },
        businessAddress: {
          buildName: application.business_address_first_line,
          streetNumber: application.business_address_second_line,
          street: application.business_address_third_line,
          town: application.business_address_ward,
          postcode: application.business_address_postcode,
        },
        businessWebsite: application.business_website,
        businessImpactStatement: application.business_impact_statement,
      },
      documents: uploadedDocuments,
      businessBankAccount: {
        bankName: application.bank_name,
        accountHolder: application.account_holder,
        accountNumber: application.account_number,
        accountSortcode: application.account_sortcode,
      },
      declaration: {
        name: application.name,
        contactTypeId: `${CONTACT_TYPE[application.contact_type_id - 1]} ${
          application.contact_type_text
        }`,
        authoriseOnBehalf: application.authorise_on_behalf,
        businessMeetsCriteria: application.business_meets_criteria,
        businessIWillInform: application.business_i_will_inform,
        businessNotExceed: application.business_not_exceed,
        businessNotUndertaking: application.business_not_undertaking,
        businessRecoverableAgreement:
          application.business_recoverable_agreeement,
        businessPermitData: application.business_permit_data,
        businessPermitDataRound2: application.business_permit_data_round_2,
        businessShareWithBEIS: application.business_share_with_beis,
        businessHappyContacted: application.business_happy_contacted,
      },
    },
    validations: application.validations,
  };
};

const getApplicationData = async (dbInstance, clientGeneratedId) => {
  const query = `SELECT
                  -- grant_application
                  -- ga.id,
                  ga.client_generated_id,
                  ga.date_time_recorded,
                  -- eligibility_criteria
                  -- ec.id,
                  -- ec.grant_application_id,
                  ec.trading_in_hackney,
                  ec.served_legal_notices,
                  ec.meets_arg_criteria,
                  ec.meets_arg_criteria_round_2,
                  ec.trading_on_04_11_20,
                  ec.trading_on_01_12_20,
                  ec.eligible_for_lrsg_closed_grant,
                  ec.eligible_for_lrsg_grants,
                  -- application_assessment
                  aa.id,
                  -- aa.grant_application_id,
                  aa.application_state_id,
                  aa.grant_amount_awarded,
                  aa.grant_amount_awarded_round_2,
                  -- Beware validations is text of JSON
                  aa.validations,
                  -- contact
                  -- c.id,
                  -- c.grant_application_id,
                  c.first_name,
                  c.last_name,
                  c.email_address,
                  c.date_of_birth,
                  c.telephone_number,
                  -- contact_address
                  -- ca.id,
                  ca.first_line AS contact_address_first_line,
                  ca.second_line AS contact_address_second_line,
                  ca.third_line AS contact_address_third_line,
                  ca.postcode AS contact_address_postcode,
                  ca.ward AS contact_address_ward,
                  -- business
                  -- b.id,
                  -- b.grant_application_id,
                  b.business_name,
                  b.registered_name,
                  b.previously_applied,
                  b.previous_application_id,
                  (
                    SELECT count(gap.client_generated_id)
                    FROM grant_application gap
                    WHERE gap.client_generated_id = b.previous_application_id
                  ) as previous_application_found,
                  b.liable_for_rates,
                  b.how_many_employees,
                  b.business_category_id,
                  b.business_reference_number,
                  b.business_description,
                  b.business_size_id,
                  b.business_identify_type,
                  b.business_identify_number,
                  b.business_structure,
                  b.business_premises_description,
                  b.business_premises_text,
                  b.business_rates_account_number,
                  b.business_rates_payer,
                  b.business_website,
                  b.business_impact_statement,
                  b.trading_days_per_week,
                  b.business_rateable_value,
                  -- business_address
                  -- ba.id,
                  -- ba.business_id,
                  ba.first_line AS business_address_first_line,
                  ba.second_line AS business_address_second_line,
                  ba.third_line AS business_address_third_line,
                  ba.postcode AS business_address_postcode,
                  ba.ward AS business_address_ward,
                  bta.first_line AS business_trading_address_first_line,
                  bta.second_line AS business_trading_address_second_line,
                  bta.third_line AS business_trading_address_third_line,
                  bta.postcode AS business_trading_address_postcode,
                  bta.ward AS business_trading_address_ward,
                  -- business_bank_account
                  -- bba.id,
                  -- bba.business_id,
                  bba.bank_name,
                  bba.account_holder,
                  bba.account_number,
                  bba.account_sortcode,
                  -- declaration d
                  -- d.id,
                  -- d.grant_application_id,
                  d.name,
                  d.contact_type_id,
                  d.contact_type_text,
                  d.authorise_on_behalf,
                  d.business_meets_criteria,
                  d.business_i_will_inform,
                  d.business_not_exceed,
                  d.business_not_undertaking,
                  d.business_recoverable_agreeement,
                  d.business_permit_data,
                  d.business_permit_data_round_2,
                  d.business_share_with_beis,
                  d.business_happy_contacted
                FROM
                  grant_application ga
                  JOIN
                      eligibility_criteria ec
                      ON ga.id = ec.grant_application_id
                  JOIN
                      application_assessment aa
                      ON ga.id = aa.grant_application_id
                  JOIN
                      contact c
                      ON ga.id = c.grant_application_id
                  JOIN
                      contact_address ca
                      ON ga.id = ca.grant_application_id
                  JOIN
                      business b
                      ON ga.id = b.grant_application_id
                  JOIN
                      business_address ba
                      ON ga.id = ba.grant_application_id
                  JOIN
                      business_trading_address bta
                      ON ga.id = bta.grant_application_id
                  JOIN
                      business_bank_account bba
                      ON ga.id = bba.grant_application_id
                  JOIN
                      declaration d
                      ON ga.id = d.grant_application_id
                WHERE
                  ga.client_generated_id = $1;`;
  return await dbInstance.one(query, [clientGeneratedId]);
};

const getDocuments = async (dbInstance, clientGeneratedId) => {
  const query = `SELECT s3_path, document_type
                  FROM grant_application AS ga
                  JOIN document_upload AS du
                      ON ga.id = du.grant_application_id
                  WHERE ga.client_generated_id = $1
                  ORDER BY du.document_type;`;
  const documentData = await dbInstance.any(query, [clientGeneratedId]);
  let documents = [];

  documents = documentData.map((row) => ({
    s3Path: encodeURIComponent(row.s3_path),
    documentType: row.document_type,
  }));

  return documents;
};

const createErrorResponse = (error) => {
  return {
    applications: null,
    pagination: null,
    error,
  };
};
