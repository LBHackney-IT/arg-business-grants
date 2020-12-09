alter table application_assessment rename column grant_amount_awarded to lrsg_closed_businesses_amount;
alter table application_assessment add column lrsg_sector_amount decimal(12,2) default 0;
alter table application_assessment add column lrsg_open_amount decimal(12,2) default 0;

alter table application_assessment add column lrsg_closed_businesses_payment_exported boolean default FALSE;
alter table application_assessment add column lrsg_sector_payment_exported boolean default FALSE;
alter table application_assessment add column lrsg_open_payment_exported boolean default FALSE;
