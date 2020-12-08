drop table if exists eligibility_criteria_details;
drop table if exists eligibility_criteria;
drop table if exists business;
drop table if exists declaration;
drop table if exists business_category;

create table eligibility_criteria_details (
  id serial primary key,
  grant_application_id integer,
  business_size_id integer,
  how_many_employees integer,
  trading_on_22_03_20 boolean,
  trading_on_16_10_20 boolean,
  trading_on_04_11_20 boolean,
  served_legal_notices boolean,
  business_category text,
  business_sub_category text,
  business_custom_category text
);

create table eligibility_criteria (
  id serial primary key,
  grant_application_id integer,
  trading_in_hackney boolean,
  liable_for_rates boolean,
  is_business_closed boolean
);

create table business (
  id serial primary key,
  grant_application_id integer,
  business_name text,
  registered_name text,
  business_identify_type text,
  business_identify_number text,
  business_rates_account_number integer,
  business_rates_payer text,
  business_annual_rent integer,
  business_website text
);

create table declaration (
  id serial primary key,
  grant_application_id integer,
  name text,
  contact_type_id integer references contact_type(id),
  authorise_on_behalf boolean,
  business_meets_criteria boolean,
  business_closed_by_law boolean,
  business_intends_reopen boolean,
  business_i_will_inform boolean,
  business_not_exceed boolean,
  business_not_undertaking boolean,
  business_not_rate_payer boolean,
  business_permit_data boolean,
  business_share_with_beis boolean,
  business_happy_contacted boolean
);
