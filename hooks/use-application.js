import { grantDefinitions } from 'grants';

export const useApplications = () => {
  return {
    getApplication: (name) => {
      const application = grantDefinitions.get(name);

      if (!application) {
        throw new Error(`Unable to find an application with the name ${name}`);
      }

      return application;
    },
    getActiveApplications: () => {
      const applications = [...grantDefinitions].filter(([, definition]) => {
        return (
          definition.activeFrom <= new Date() &&
          definition.activeUntil >= new Date()
        );
      });

      return applications.reduce((acc, [identifier, definition]) => {
        acc.set(identifier, definition);

        return acc;
      }, new Map());
    },
  };
};
