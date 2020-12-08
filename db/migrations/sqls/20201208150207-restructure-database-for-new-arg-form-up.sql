drop table if exists eligibility_criteria_details;
drop table if exists eligibility_criteria;
drop table if exists business;
drop table if exists declaration;
drop table if exists business_category;

create table business_category (
  id serial primary key,
  description varchar not null
);

create table eligibility_criteria (
  id serial primary key,
  grant_application_id integer,
  trading_in_hackney boolean,
  meets_arg_criteria boolean,
  served_legal_notices boolean,
  trading_on_04_11_20 boolean,
  eligible_for_lrsg_closed_grant boolean
);

create table business (
  id serial primary key,
  grant_application_id integer,
  business_name text,
  registered_name text,
  liable_for_rates boolean,
  how_many_employees text,
  business_category_id integer references business_category(id),
  business_reference_number text,
  business_description text,
  business_size_id integer references business_size(id),
  business_identify_type text,
  business_identify_number text,
  business_structure text,
  business_rates_account_number text,
  business_rates_payer text,
  business_rateable_value text,
  business_premises_description text,
  business_premises_text text,
  business_website text,
  business_impact_statement text
);

create table declaration (
  id serial primary key,
  grant_application_id integer,
  name text,
  contact_type_id integer references contact_type(id),
  contact_type_text text,
  authorise_on_behalf boolean,
  business_meets_criteria boolean,
  business_i_will_inform boolean,
  business_not_exceed boolean,
  business_not_undertaking boolean,
  business_recoverable_agreeement boolean,
  business_permit_data boolean,
  business_share_with_beis boolean,
  business_happy_contacted boolean
);
