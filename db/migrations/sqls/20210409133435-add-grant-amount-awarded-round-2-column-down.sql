UPDATE application_assessment
SET grant_amount_awarded=grant_amount_awarded_round_2
WHERE grant_amount_awarded_round_2 <> '0.00';

ALTER TABLE application_assessment
DROP grant_amount_awarded_round_2;
