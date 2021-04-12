ALTER TABLE application_assessment
ADD round_1_payment_exported boolean DEFAULT false;

ALTER TABLE application_assessment
ADD round_2_payment_exported boolean DEFAULT false;

UPDATE application_assessment
SET round_1_payment_exported = true;

UPDATE application_assessment
SET round_2_payment_exported = true;