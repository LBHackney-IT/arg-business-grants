ALTER TABLE application_assessment
ADD grant_amount_awarded_round_2 numeric(12,2) DEFAULT 0;

ALTER TABLE application_assessment
ADD date_time_recorded_temp timestamp;

UPDATE application_assessment
SET date_time_recorded_temp=grant_application.date_time_recorded
FROM grant_application
WHERE application_assessment.grant_application_id = grant_application.id;

UPDATE application_assessment
SET grant_amount_awarded_round_2=grant_amount_awarded, grant_amount_awarded='0.00'
WHERE date_time_recorded_temp >= '2021-01-09';

UPDATE application_assessment
SET grant_amount_awarded_round_2='0.00'
WHERE grant_amount_awarded_round_2 IS NULL;

ALTER TABLE application_assessment
DROP date_time_recorded_temp;
