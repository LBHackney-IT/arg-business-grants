import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button } from '../Form';
import { stepPath, getInputProps } from '../Steps';
import ControlledFileUpload from '../FileUpload/FileUpload';

const SupplementaryInformation = (props) => {
  const { handleSubmit, errors, control } = useForm({
    defaultValues: props.formData,
  });
  const onSubmit = (formData) => {
    props.saveData(formData);
    Router.push(stepPath, props.nextStep);
  };
  const sharedProps = (name) => ({
    ...getInputProps('supplementaryInformation', name, { control }, errors),
    uploadPrefix: props.formData.contact && props.formData.contact.emailAddress,
    defaultValue:
      props.formData.supplementaryInformation &&
      props.formData.supplementaryInformation[name],
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Supplementary Information</h1>
      <div className="govuk-inset-text">
        File upload information{' '}
        <p>
          Preferred file formats are PDF, JPeg, PNG, Word, Excel (CSV files).
          File size is limited to 20MB per file. Multiple files can be uploaded.
          If uploading a scanned or photographed document, ensure that it is
          clear and legible.
        </p>
      </div>
      <ControlledFileUpload {...sharedProps('bankStatement')} />
      <ControlledFileUpload {...sharedProps('ratesBill')} />
      <ControlledFileUpload {...sharedProps('leaseOrRentalAgreement')} />
      <ControlledFileUpload {...sharedProps('employeesConfirmation')} />
      <ControlledFileUpload {...sharedProps('photoId')} />
      <ControlledFileUpload {...sharedProps('taxReturn')} />
      <Button className="govuk-button" text="Next" type="submit" />
    </form>
  );
};

export default SupplementaryInformation;
