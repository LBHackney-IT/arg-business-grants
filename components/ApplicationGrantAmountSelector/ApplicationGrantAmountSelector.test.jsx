import { handleOnChange } from './ApplicationGrantAmountSelector';

describe('<ApplicationGrantAmountSelector>', () => {
  describe('handleOnChange()', () => {
    it('Patches the grant application', async () => {
      const grantApplicationPatcherSpy = jest.fn();
      const setValueSpy = jest.fn();
      const onChangeSpy = jest.fn();
      const setErrorSpy = jest.fn();

      const applicationId = 1;
      const storeAs = 'additionalRestrictionsGrant';
      const grantAmountAwarded = '25565.0';
      await handleOnChange(
        setErrorSpy,
        setValueSpy,
        onChangeSpy,
        grantApplicationPatcherSpy,
        applicationId,
        storeAs
      )(grantAmountAwarded);
      expect(grantApplicationPatcherSpy).toHaveBeenCalledWith(applicationId, {
        [storeAs]: grantAmountAwarded,
      });
    });

    it('Sets the value to the awarded grant amount', async () => {
      const grantApplicationPatcherSpy = jest.fn();
      const setValueSpy = jest.fn();
      const onChangeSpy = jest.fn();
      const setErrorSpy = jest.fn();

      const applicationId = 1;
      const storeAs = 'additionalRestrictionsGrant';
      const grantAmountAwarded = '25565.0';
      await handleOnChange(
        setErrorSpy,
        setValueSpy,
        onChangeSpy,
        grantApplicationPatcherSpy,
        applicationId,
        storeAs
      )(grantAmountAwarded);

      expect(setValueSpy).toHaveBeenCalledWith(grantAmountAwarded);
    });

    it('Sets the error to be the received error message if the change fails to validate', async () => {
      const validationErrorMessage = 'Validation error';
      const grantApplicationPatcherSpy = jest.fn(() => {
        throw {
          response: {
            data: validationErrorMessage,
          },
        };
      });
      const setValueSpy = jest.fn();
      const onChangeSpy = jest.fn();
      const setErrorSpy = jest.fn();

      const applicationId = 1;
      const storeAs = 'additionalRestrictionsGrant';
      const grantAmountAwarded = '25565.0';
      await handleOnChange(
        setErrorSpy,
        setValueSpy,
        onChangeSpy,
        grantApplicationPatcherSpy,
        applicationId,
        storeAs
      )(grantAmountAwarded);

      expect(setErrorSpy).toHaveBeenCalledWith(validationErrorMessage);
    });

    it('Unsets the error if successful', async () => {
      const grantApplicationPatcherSpy = jest.fn();
      const setValueSpy = jest.fn();
      const onChangeSpy = jest.fn();
      const setErrorSpy = jest.fn();

      const applicationId = 1;
      const storeAs = 'additionalRestrictionsGrant';
      const grantAmountAwarded = '25565.0';
      await handleOnChange(
        setErrorSpy,
        setValueSpy,
        onChangeSpy,
        grantApplicationPatcherSpy,
        applicationId,
        storeAs
      )(grantAmountAwarded);

      expect(setErrorSpy).toHaveBeenCalledTimes(1);
      expect(setErrorSpy).toHaveBeenCalledWith(false);
    });

    it('Triggers callback if successful', async () => {
      const grantApplicationPatcherSpy = jest.fn();
      const setValueSpy = jest.fn();
      const onChangeSpy = jest.fn();
      const setErrorSpy = jest.fn();

      const applicationId = 1;
      const storeAs = 'additionalRestrictionsGrant';
      const grantAmountAwarded = '25565.0';
      await handleOnChange(
        setErrorSpy,
        setValueSpy,
        onChangeSpy,
        grantApplicationPatcherSpy,
        applicationId,
        storeAs
      )(grantAmountAwarded);

      expect(onChangeSpy).toHaveBeenCalledWith(grantAmountAwarded);
    });
  });
});
