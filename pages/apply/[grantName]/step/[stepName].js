import { grantDefinitions } from 'grants';
import { useRouter } from 'next/router';
import { useState } from 'react';

const GrantForm = () => {
  const { query } = useRouter();
  const [formData, setFormData] = useState({});
  const [, setIsSubmitted] = useState(false);

  const grantDefinition = grantDefinitions.get(query.grantName);

  if (!grantDefinition) {
    return <div>404 here</div>;
  }

  const Step = grantDefinition.steps[query.stepName];

  if (!Step) {
    return <div>404 here!</div>;
  }

  return (
    <div>
      <h1>{grantDefinition.name}</h1>
      <Step
        formData={formData}
        saveData={(data) => setFormData({ ...formData, ...data })}
        grantName={query.grantName}
        nextStep="business-details"
        clearFormData={() => {
          setIsSubmitted(true);
          setFormData({});
        }}
      />
    </div>
  );
};

export const getServerSideProps = () => {
  return {
    // TBC this is to force server rendering
    props: {},
  };
};

export default GrantForm;
