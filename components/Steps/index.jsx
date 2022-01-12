import isValid from 'date-fns/isValid';
import isPast from 'date-fns/isPast';

import EligibilityCriteria from './EligibilityCriteria';
import SupplementaryInformation from './SupplementaryInformation';
import YourDetails from './YourDetails';
import BusinessDetails from './BusinessDetails';
import BankDetails from './BankDetails';
import Declaration from './Declaration';
import Summary from './Summary';
import BusinessClassificationSummary from './Summaries/BusinessClassification';

import * as options from '../../lib/dbMapping';

export const stepPath = '/step/[id]';

export const steps = {
  'eligibility-criteria': EligibilityCriteria,
  'business-details': BusinessDetails,
  'your-details': YourDetails,
  'bank-details': BankDetails,
  'supplementary-information': SupplementaryInformation,
  declaration: Declaration,
  summary: Summary,
};

export const inputLabels = {
  eligibilityCriteria: {
    tradingInHackney: {
      label: 'Is your business based in and trading in Hackney?',
      hint: (
        <>
          <p>
            Your business must be physically based in either a commercial or
            domestic premises in Hackney and you must conduct your business
            operations from this premises.
          </p>
          <p>
            If you are currently working from home as a result of Covid-19 but
            your business would normally operate from a commercial premises{' '}
            <span className="govuk-!-font-weight-bold">in Hackney</span>, then
            please provide your commercial premises address in Hackney on your
            application form.
          </p>
          <p>
            If your business is a home based business operating from a
            residential premises{' '}
            <span className="govuk-!-font-weight-bold">in Hackney</span> and
            this was your usual mode of operating prior to the Covid-19 pandemic
            then please provide this address.
          </p>
          <p>
            Businesses who use a virtual office/business address in the London
            Borough of Hackney but who do not physically conduct their business
            operations on a full time basis from these premises are not eligible
            for a grant.
          </p>
        </>
      ),
      validation: { required: true },
      adminValidation: true,
    },
    meetsArgCriteria: {
      label: (
        <>
          Does your business meet one of the following criteria for the
          Additional Restrictions Grant:
          <ul>
            <li>
              Your business was legally required to close between 5th November
              2020 - 2nd December 2020, but you are not a business rates
              payer/account holder;{' '}
              <strong>
                <u>or</u>
              </strong>
            </li>
            <li>
              Your business was not legally required to close between 5th
              November 2020 - 2nd December 2020, but has been severely impacted
              by the restrictions put in place to prevent the spread of COVID-19
            </li>
          </ul>
        </>
      ),
      validation: { required: true },
    },
    meetsArgCriteriaRound2: {
      label: (
        <>
          Does your business meet one of the following criteria for the
          Additional Restrictions Grant - Round 2:
          <ul className="govuk-!-font-size-19">
            <li>
              Your business was legally required to close by the Government in
              December due to the tier restrictions (either during Tier 2, Tier
              3, and/or Tier 4){' '}
              <span className="govuk-!-font-weight-bold">and</span> the national
              lockdown from 5 January 2021 onwards{' '}
              <span className="govuk-!-font-weight-bold">and</span> you are not
              a Hackney business rates account holder;{' '}
              <strong>
                <u>or</u>
              </strong>
            </li>
            <li>
              Your business was not legally required to close by the Government
              during the December 2020 tier restriction or the national lockdown
              from 5 January 2021 onwards but has been severely impacted by the
              tier and national lockdown restrictions put in place to prevent
              the spread of COVID-19 from the 2 December 2020 onwards.
            </li>
          </ul>
          <p className="govuk-body govuk-!-font-size-19">
            If you are unsure if your business was legally required to close by
            the Government in December or January please review the documents
            below:
          </p>
          <ul className="govuk-!-font-size-19">
            <li>
              <a
                href={
                  process.env
                    .NEXT_PUBLIC_DECEMBER_BUSINESS_CLOSURES_GUIDANCE_GOOGLE_URL
                }
                target="_blank"
                rel="noopener"
              >
                December 2020: Tiers 1-4 restrictions and required business
                closures
              </a>
            </li>
            <li>
              <a
                href={
                  process.env
                    .NEXT_PUBLIC_JANUARY_BUSINESS_CLOSURES_GUIDANCE_GOOGLE_URL
                }
                target="_blank"
                rel="noopener"
              >
                January 2021: National lockdown and required business closures
              </a>
            </li>
          </ul>
        </>
      ),
      validation: { required: true },
    },
    servedLegalNotices: {
      label:
        'Is your business in administration, insolvent or in receipt of a striking off notice?',
      validation: { required: true },
      adminValidation: true,
    },
    tradingOn041120: {
      label: 'Was your business trading on the 4th November 2020?',
      validation: { required: true },
      adminValidation: true,
    },
    tradingOn011220: {
      label: 'Was your business trading on 1 December 2020?',
      hint:
        'Your business is still considered to have been trading on 1 December 2020 if it was an active business at this time, even if your business was closed to the public due to Government restrictions.',
      validation: { required: true },
      adminValidation: true,
    },
    eligibleForLrsgClosedGrant: {
      label: (
        <>
          Is your business eligible for the{' '}
          <a
            href="https://www.gov.uk/guidance/check-if-your-business-is-eligible-for-a-coronavirus-grant-due-to-national-restrictions-for-closed-businesses"
            target="_blank"
            rel="noopener"
          >
            Local Restrictions Support Grant (Closed) Addendum
          </a>
          ?
        </>
      ),
      adminValidation: true,
      validation: { required: true },
    },
    eligibleForLrsgGrants: {
      label:
        'Is your business eligible for the Local Restrictions Support Grants?',
      hint: (
        <>
          <p>
            If you are eligible for the Local Restrictions Support Grants then
            you are not eligible for the Additional Restrictions Grant and you
            should apply for the Local Restrictions Support Grants instead.
            Visit{' '}
            <a
              href="https://hackney.gov.uk/business-grants"
              target="_blank"
              rel="noopener"
            >
              Hackney Business Grants
            </a>{' '}
            to read the criteria for the Local Restrictions Support Grants to
            make sure you are applying for the correct grant for your business.
          </p>
          <p>
            If you are a Hackney business rates account holder (including if you
            receive rates relief and do not pay for your business rates as a
            result), and your business is in the retail, hospitality or leisure
            sectors then it is likely you will be eligible for a Local
            Restrictions Support Grant and not the Additional Restrictions
            Grant.
          </p>
        </>
      ),
      adminValidation: true,
      validation: { required: true },
    },
  },
  business: {
    previouslyApplied: {
      label:
        'Have you applied for an Additional Restrictions Grant (Round 1) from Hackney Council?',
      validation: { required: true },
    },
    previousApplicationId: {
      label:
        'Please provide your Round 1 grant application ID number (if known):',
      hint:
        'This can be found in the subject header of your previous grant application confirmation email (e.g qf4InsCv6uL30sELgI43O)',
    },
    liableForRates: {
      label: 'Is your business liable for business rates?',
      validation: { required: true },
    },
    businessSizeId: {
      label: 'What is the size of your business?',
      hint:
        'You must be a micro or a small business to be eligible for this grant.',
      children: <BusinessClassificationSummary />,
      options: options.VALID_BUSINESS_SIZE,
      validation: { required: true },
      adminValidation: true,
    },
    howManyEmployees: {
      label:
        'How many employees does your business have? (Full time equivalent PAYE employees)',
      hint: (
        <>
          <p>
            Please note you must be able to evidence the number of full time
            employees your business has by submitting evidence of your business
            PAYE payroll records with this application form. If you are unable
            to provide this evidence then you must not include these employees
            in your response to this question.
          </p>
          <p>
            If you are a company director but are also an employee of the
            business who is paid via PAYE rather than via dividends then you are
            able to count yourself as an employee.
          </p>
        </>
      ),
      inputClassName: 'govuk-input--width-10',
      type: 'number',
      inputMode: 'numeric',
      validation: {
        required: true,
        pattern: {
          value: /^[0-9]+$/,
        },
      },
    },
    businessCategory: {
      label:
        'Please select the category which best describes your business activity',
      options: options.BUSINESS_CATEGORIES,
      hint: (
        <>
          Guidance on which category your business falls into can be found here:{' '}
          <a
            href="http://resources.companieshouse.gov.uk/sic/"
            target="_blank"
            rel="noopener"
          >
            http://resources.companieshouse.gov.uk/sic/
          </a>
          . Please check this website to make sure you are selecting the correct
          drop down category for your business.
        </>
      ),
      validation: {
        required: true,
        validate: (value) => value !== '',
      },
    },
    businessReferenceNumber: {
      label: (
        <>
          Please provide the reference number that best describes your business
          from the business classification website (
          <a
            href="http://resources.companieshouse.gov.uk/sic/"
            target="_blank"
            rel="noopener"
          >
            http://resources.companieshouse.gov.uk/sic/
          </a>
          ).
        </>
      ),
    },
    businessDescription: {
      label:
        'Please set out what your business does and the services it provides ',
      validation: {
        required: true,
      },
      adminValidation: true,
    },
    businessName: {
      label: 'Business Trading Name:',
      validation: {
        required: 'Business Name is required',
      },
    },
    registeredName: {
      label:
        'Business Registered Name (if different from Business Trading Name):',
    },
    businessStructure: {
      label: 'Business Structure:',
      options: options.COMPANY_STRUCTURE,
      validation: {
        required: 'Business Structure is required',
        validate: (value) => value !== '',
      },
      adminValidation: true,
    },
    businessStructureText: {},
    businessIdentifyType: {
      label: 'Please supply one of the following Business Identifying Numbers:',
      hint: `Where available, please provide your Company Number as listed on Companies House. If you don’t have a Company
        Number, please provide another number from the list below.`,
      options: options.TYPE_IDENTIFIER_NUMBER,
      validation: {
        required: true,
      },
    },
    businessIdentifyNumber: {
      validation: {
        required: true,
      },
    },
    businessIdentifyNumberCompanyNumber: {
      validation: {
        required: true,
        pattern: {
          value: /^[a-zA-Z0-9]{7,8}$/,
        },
      },
    },
    businessIdentifyNumberVAT: {
      type: 'number',
      hint: `Please enter your 9 digit number, without the 'GB' at the start, for example 123456789. You can find it on your
        VAT registration certificate.`,
      validation: {
        required: true,
        pattern: {
          value: /^\d{9}$/,
        },
      },
    },
    businessIdentifyNumberNIN: {
      validation: {
        required: true,
        pattern: {
          value: /^[0-9a-z]{9}$/i,
        },
      },
    },
    businessIdentifyNumberUTR: {
      validation: {
        required: true,
        pattern: {
          value: /^(\d{10}|\d{9}K)$/i,
        },
      },
    },
    businessRatesAccountNumber: {
      label: 'Business Rates Account Number (if applicable):',
      hint:
        'A nine digit number starting with a 6 - this is shown on your business rates bill. ',
      validation: {
        pattern: {
          value: /^6(\d{8}|\d{7}x)$/i,
        },
      },
    },
    businessRatesPayer: {
      label: 'Name of Business Rates Payer (if applicable):',
      hint: 'As shown on your business rates bill.',
    },
    businessTradingAddress: {
      label: 'Business Registered Trading Address:',
    },
    businessAddress: {
      label: 'Business Premises Address in the London Borough of Hackney:',
      hint: (
        <>
          <p>
            Please provide your usual business address in Hackney. If you are
            now working from home as a result of the pandemic, but are normally
            based in a commercial premises in Hackney, and plan to return to the
            same commercial premises in the future, please provide this address.
          </p>
          <p>
            For businesses who were working from residential premises in Hackney
            prior to the pandemic, and who will remain working from this
            premises in the future, please provide this address.
          </p>
          <p>
            For market traders, please provide the most accurate nearby address
            for your market stall if you are unable to provide your exact market
            pitch address.
          </p>
        </>
      ),
    },
    businessPremisesDescription: {
      label: 'Business Premises Description',
      options: options.TYPE_OF_BUSINESS,
      validation: {
        required: true,
      },
    },
    businessPremisesText: {},
    tradingDaysPerWeek: {
      label:
        'If you are a market trader please state how many days per week you usually trade in Hackney (prior to the COVID-19 pandemic):',
      type: 'number',
      inputMode: 'numeric',
    },
    businessRateableValue: {
      label: 'Business Premises Rateable Value (if applicable):',
      type: 'number',
      inputMode: 'numeric',
    },
    businessWebsite: {
      label: 'Business Website Address (if applicable):',
    },
    businessImpactStatement: {
      label: 'How has your business been impacted?',
      hint: (
        <p>
          Please provide a short written statement setting out how your business
          has been severely impacted by the tier restrictions from 2 December
          2020 and the national lockdown from 5 January 2021. This should
          include details on why and how your business was severely impacted.
          You should also set out if you are able to trade online, the scale of
          your Coronavirus related losses, and any ongoing fixed business costs
          you may have.
        </p>
      ),
      validation: {
        required: true,
      },
      adminValidation: true,
    },
  },
  contact: {
    firstName: {
      label: 'First Name:',
      validation: {
        required: 'First Name is required',
      },
      adminValidation: true,
    },
    lastName: {
      label: 'Last Name:',
      validation: {
        required: 'Last Name is required',
      },
      adminValidation: true,
    },
    emailAddress: {
      label: 'Email Address:',
      validation: {
        required: 'Email Address is required',
      },
      type: 'email',
    },
    telephoneNumber: {
      label: 'Contact Telephone Number:',
      type: 'tel',
      validation: {
        required: true,
        pattern: {
          value: /^[0-9]*$/,
          message: 'Telephone Number must be a number',
        },
      },
    },
    address: { label: 'Applicant Address:' },
    dateOfBirth: {
      label: 'Date of Birth (Only required for Sole Traders):',
      validation: {
        validate: {
          valid: (value) =>
            value && (isValid(new Date(value)) || 'Must be a valid Date'),
          past: (value) =>
            value && (isPast(new Date(value)) || 'Must be a past Date'),
        },
      },
    },
  },
  businessBankAccount: {
    bankName: {
      label: 'Bank Name:',
      validation: { required: 'Bank Name is required' },
    },
    accountHolder: {
      label: 'Account Holder Name:',
      validation: { required: 'Account Holder Name is required' },
      adminValidation: true,
    },
    accountNumber: {
      inputClassName: 'govuk-input--width-10',
      label: 'Account Number:',
      inputMode: 'numeric',
      validation: {
        required: 'Account Number is required',
        pattern: {
          value: /^[0-9]{8}$/,
          message: 'Account Number must be a 8 digit number',
        },
      },
      adminValidation: true,
    },
    accountSortcode: {
      inputClassName: 'govuk-input--width-5',
      label: 'Sort Code:',
      inputMode: 'numeric',
      validation: {
        required: 'Sort Code is required',
        pattern: {
          value: /^[0-9]{6}$/,
          message: 'Sort Code must be a 6 digit number',
        },
      },
      adminValidation: true,
    },
  },
  supplementaryInformation: {
    bankStatement: {
      label: 'Business Bank Statement:',
      hint: `Please provide 3 months business bank statements from November 2020 to January 2021 (inclusive). The bank account details in the bank statements provided must correspond with the bank account details provided in this application form.`,
      validation: {
        validate: (value) => value.length > 0 || 'Document required',
      },
    },
    ratesBill: {
      label: 'Business Rates Bill:',
      hint:
        'If applicable, please provide a copy of your latest London Borough of Hackney business rates bill.',
    },
    leaseOrRentalAgreement: {
      label: 'Business premises lease or rental agreement:',
      hint: `Please provide a copy of your business premises lease, rental agreement, mortgage statement, or market trading licence. If you do not have an up to date business premises lease, rental agreement or licence please provide another up to date form of evidence to demonstrate your business is physically based in Hackney e.g a signed and dated letter from your landlord, recent utility bill for your business premises.`,
      validation: {
        validate: (value) => value.length > 0 || 'Document required',
      },
    },
    employeesConfirmation: {
      label: 'Confirmation of the amount of employees in your business:',
      hint: `If applicable and you employ PAYE staff, please provide a copy of your most up to date business payroll record showing the number of people employed by your business on a PAYE full time basis. If a payroll record is not available please provide another form of evidence which verifies the number of people employed by your business.`,
    },
    photoId: {
      label: 'Photographic ID:',
      hint:
        'Please provide a form of photo identification such as a passport or driving licence.',
      validation: {
        validate: (value) => value.length > 0 || 'Document required',
      },
    },
    taxReturn: {
      label: 'HMRC self assessment tax return:',
      hint:
        'If you are a sole trader or are self employed please provide a copy of your latest HMRC self assessment tax return.',
    },
  },
  declaration: {
    name: {
      label: 'Full Name of person making this declaration:',
      validation: { required: true },
    },
    contactTypeId: {
      label: 'Role/position in organisation:',
      options: options.CONTACT_TYPE,
      validation: {
        required: 'Role/position in organisation is required',
        validate: (value) => value !== '',
      },
    },
    contactTypeIdText: {},
    authoriseOnBehalf: {
      label:
        'I confirm that I am authorised to submit this form on behalf of the business',
      validation: { required: true },
    },
    businessMeetsCriteria: {
      label: `I declare that the business meets the criteria for the Additional Restrictions Grant that I am applying for and
        that the information I have provided is complete and accurate`,
      validation: { required: true },
    },
    businessIWillInform: {
      label: (
        <>
          I confirm that I will inform Hackney Council if;
          <ul>
            <li>
              My business no longer occupies the premises stated in this
              application form
            </li>
            <li>
              My business ceases trading permanently, or goes into
              administration, becomes insolvent, or is in receipt of a striking
              off notice
            </li>
            <li>
              My business no longer meets any other grant eligibility criteria
            </li>
          </ul>
        </>
      ),
      validation: { required: true },
    },
    businessNotExceed: {
      label: (
        <>
          <p>
            The Additional Restrictions Grant counts towards the total de
            minimis state aid you are permitted to receive over a 3 year period
            which is €200,000. If you have reached the de minimis threshold, you
            may still be eligible for funding under the{' '}
            <a
              href="https://ec.europa.eu/competition/state_aid/what_is_new/covid_19.html"
              target="_blank"
              rel="noopener"
            >
              COVID-19 Temporary Framework
            </a>
            . The limit for this framework is €800,000.
          </p>
          <p>
            I confirm that, including receipt of this grant, the business will
            not exceed the relevant State Aid threshold.
          </p>
        </>
      ),
      validation: { required: true },
    },
    businessNotUndertaking: {
      label: (
        <>
          I confirm that my business is not an{' '}
          <a
            href="https://www.gov.uk/guidance/innovation-apply-for-a-funding-award#undertakings-in-difficulty--eu-definition"
            target="_blank"
            rel="noopener"
          >
            undertaking in difficulty
          </a>{' '}
          (within the meaning of Article 2 (18) of the General Block Exemption
          Regulation) on 31 December 2019
        </>
      ),
      validation: { required: true },
    },
    businessRecoverableAgreement: {
      label:
        'I understand that if the grant is paid in error it will be recoverable from the recipient.',
      validation: { required: true },
    },
    businessPermitData: {
      label: (
        <>
          I permit the data provided in this form to be used to determine my
          eligibility and process my application for the Additional Restrictions
          Grant. I understand that my data will be kept on record and may be
          used to determine my eligibility for any future rounds of the{' '}
          <a
            href="https://www.gov.uk/guidance/check-if-youre-eligible-for-the-coronavirus-additional-restrictions-grant"
            target="_blank"
            rel="noopener"
          >
            Additional Restrictions Grant
          </a>
          , and the{' '}
          <a
            href="https://www.gov.uk/guidance/check-if-your-business-is-eligible-for-a-coronavirus-grant-due-to-national-restrictions-for-closed-businesses"
            target="_blank"
            rel="noopener"
          >
            Local Restrictions Support Grant (Closed) Addendum
          </a>
          , the{' '}
          <a
            href="https://www.gov.uk/guidance/check-if-youre-eligible-for-the-coronavirus-local-restrictions-support-grant-for-open-businesses"
            target="_blank"
            rel="noopener"
          >
            Local Restrictions Support Grant (Open)
          </a>{' '}
          and the{' '}
          <a
            href="https://www.gov.uk/guidance/check-if-your-nightclub-dance-hall-or-adult-entertainment-business-is-eligible-for-a-coronavirus-grant-due-to-national-restrictions"
            target="_blank"
            rel="noopener"
          >
            Local Restrictions Support Grant (Sector)
          </a>{' '}
          where applicable.
        </>
      ),
      validation: { required: true },
    },
    businessPermitDataRound2: {
      label: (
        <>
          I permit the data provided in this form to be used to determine my
          eligibility and process my application for the Additional Restrictions
          Grant. I understand that my data will be kept on record and may be
          used to determine my eligibility for any future rounds of the{' '}
          <a
            href="https://www.gov.uk/guidance/check-if-youre-eligible-for-the-coronavirus-additional-restrictions-grant"
            target="_blank"
            rel="noopener"
          >
            Additional Restrictions Grant
          </a>
          , the Local Restrictions Support Grants, or the{' '}
          <a
            href="https://www.gov.uk/guidance/check-if-your-business-is-eligible-for-the-coronavirus-closed-businesses-lockdown-payment"
            target="_blank"
            rel="noopener"
          >
            Closed Business Lockdown Payment
          </a>{' '}
          where applicable.
        </>
      ),
      validation: { required: true },
    },
    businessShareWithBEIS: {
      label: (
        <>
          I confirm that I am happy for my data to be shared with{' '}
          <a
            href="https://www.gov.uk/government/organisations/department-for-business-energy-and-industrial-strategy"
            target="_blank"
            rel="noopener"
          >
            BEIS
          </a>{' '}
          for research and evaluation purposes
        </>
      ),
      validation: { required: true },
    },
    businessHappyContacted: {
      label: `I confirm that I am happy to be contacted by Hackney Council in the future for details of new business funding
        opportunities and in relation to other business initiatives`,
    },
  },
};

export const getInputProps = (
  form,
  name,
  { register, control } = {},
  errors
) => {
  // filtering out adminValidation
  // eslint-disable-next-line no-unused-vars
  const { validation, adminValidation, ...props } =
    inputLabels[form][name] || {};
  return {
    name: `${form}.${name}`,
    ...props,
    register: validation && register ? register(validation) : register,
    control: control,
    rules: control && validation,
    error: errors && errors[form] && errors[form][name],
  };
};

export const hasAdminValidation = (form, name) =>
  inputLabels[form][name] && inputLabels[form][name].adminValidation;

export const stepKeys = Object.keys(steps);
