import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button, Checkbox, Select, TextInput } from '../Form';
import { stepPath, getInputProps } from '../Steps';
import { FREE_TEXT } from '../../lib/dbMapping';

const Declaration = (props) => {
  const { register, errors, handleSubmit, watch } = useForm({
    defaultValues: props.formData,
  });
  const onSubmit = (data) => {
    props.saveData(data);
    Router.push(stepPath, props.nextStep);
  };
  const selectedContactTypeId = watch('declaration.contactTypeId');
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Declaration</h1>
      <TextInput
        {...getInputProps(
          'declaration',
          'name',
          {
            register,
          },
          errors
        )}
      />
      <Select
        {...getInputProps(
          'declaration',
          'contactTypeId',
          {
            register,
          },
          errors
        )}
      />
      {FREE_TEXT.includes(selectedContactTypeId) && (
        <TextInput
          {...getInputProps(
            'declaration',
            'contactTypeIdText',
            {
              register,
            },
            errors
          )}
        />
      )}
      <Checkbox
        {...getInputProps(
          'declaration',
          'authoriseOnBehalf',
          {
            register,
          },
          errors
        )}
      />
      <Checkbox
        {...getInputProps(
          'declaration',
          'businessMeetsCriteria',
          {
            register,
          },
          errors
        )}
      />
      <Checkbox
        {...getInputProps(
          'declaration',
          'businessIWillInform',
          {
            register,
          },
          errors
        )}
      />
      <Checkbox
        {...getInputProps(
          'declaration',
          'businessNotExceed',
          {
            register,
          },
          errors
        )}
      />
      <Checkbox
        {...getInputProps(
          'declaration',
          'businessNotUndertaking',
          {
            register,
          },
          errors
        )}
      />
      <Checkbox
        {...getInputProps(
          'declaration',
          'businessRecoverableAgreement',
          {
            register,
          },
          errors
        )}
      />
      <Checkbox
        {...getInputProps(
          'declaration',
          'businessPermitDataRound2',
          {
            register,
          },
          errors
        )}
      />
      <Checkbox
        {...getInputProps(
          'declaration',
          'businessShareWithBEIS',
          {
            register,
          },
          errors
        )}
      />
      <Checkbox
        {...getInputProps(
          'declaration',
          'businessHappyContacted',
          {
            register,
          },
          errors
        )}
      />
      <h2>How we will use your information</h2>
      <p className="govuk-body">
        The Council will not accept deliberate manipulation and fraud. Any
        business caught falsifying their records to gain additional grant money
        will face prosecution and any funding issued will be subject to
        clawback.{' '}
      </p>

      <p className="govuk-body">
        We will use your information to assess your application for financial
        support. In doing so we will confirm information about you and your
        account from Council departments and credit reference agencies to
        confirm account validity and your identity. If you provide false or
        inaccurate information, we will record this. If you would like full
        details on how we use your information, please refer to our{' '}
        <a href="https://hackney.gov.uk/privacy" target="_blank" rel="noopener">
          privacy statement
        </a>
        .
      </p>
      <Button className="govuk-button" text="Next" type="submit" />
    </form>
  );
};

export default Declaration;
