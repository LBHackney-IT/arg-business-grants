UPDATE application_state
SET description = 'Unprocessed' WHERE id = 1;

UPDATE application_state
SET description = 'Pre-processed' WHERE id = 2;

UPDATE application_state
SET description = 'Pre-processed - Review' WHERE id = 3;

UPDATE application_state
SET description = 'Processed - Check Bank Details' WHERE id = 4;

UPDATE application_state
SET description = 'Processed - Approved' WHERE id = 5;

UPDATE application_state
SET description = 'Processed - Rejected' WHERE id = 6;

UPDATE application_state
SET description = 'Tier 2 ARG application' WHERE id = 7;

UPDATE application_state
SET description = 'NFI' WHERE id = 8;

UPDATE application_state
SET description = 'Refer to Manager' WHERE id = 9;

UPDATE application_state
SET description = 'Closed - Duplicate' WHERE id = 10;

UPDATE application_state
SET description = 'Exported for Payment' WHERE id = 11;

UPDATE application_state
SET description = 'Declined - Test' WHERE id = 12;

UPDATE application_assessment
SET application_state_id = 12 WHERE application_state_id = 10;
