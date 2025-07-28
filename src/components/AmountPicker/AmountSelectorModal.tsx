import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
// import {View} from 'react-native';
import AmountForm from '@components/AmountForm';
// import Button from '@components/Button';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import Modal from '@components/Modal';
import ScreenWrapper from '@components/ScreenWrapper';
import type {BaseTextInputRef} from '@components/TextInput/BaseTextInput/types';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import {getFieldRequiredErrors} from '@libs/ValidationUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/AmountPickerModalForm';
import type {AmountSelectorModalProps} from './types';

function AmountSelectorModal({value, description = '', onValueSelected, isVisible, onClose, validateValue, ...rest}: AmountSelectorModalProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const inputRef = useRef<BaseTextInputRef | null>(null);
    const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const inputCallbackRef = (ref: BaseTextInputRef | null) => {
        inputRef.current = ref;
    };

    useFocusEffect(
        useCallback(() => {
            focusTimeoutRef.current = setTimeout(() => {
                if (inputRef.current && isVisible) {
                    inputRef.current.focus();
                }
                return () => {
                    if (!focusTimeoutRef.current || !isVisible) {
                        return;
                    }
                    clearTimeout(focusTimeoutRef.current);
                };
            }, CONST.ANIMATED_TRANSITION);
        }, [isVisible, inputRef]),
    );

    const submit = useCallback(
        (inputValues: FormOnyxValues<typeof ONYXKEYS.FORMS.AMOUNT_PICKER_MODAL_FORM>) => {
            onValueSelected?.(inputValues[INPUT_IDS.VALUE]);
        },
        [onValueSelected],
    );

    const validate = useCallback(
        (inputValues: FormOnyxValues<typeof ONYXKEYS.FORMS.AMOUNT_PICKER_MODAL_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.AMOUNT_PICKER_MODAL_FORM> => {
            const errors = getFieldRequiredErrors(inputValues, [INPUT_IDS.VALUE]);

            // We only want integers to be sent as the limit
            if (!inputValues[INPUT_IDS.VALUE] || !Number(inputValues[INPUT_IDS.VALUE])) {
                errors.value = translate('iou.error.invalidAmount');
            }

            return {...errors, ...validateValue?.(inputValues)};
        },
        [translate, validateValue],
    );

    return (
        <Modal
            type={CONST.MODAL.MODAL_TYPE.RIGHT_DOCKED}
            isVisible={isVisible}
            onClose={onClose}
            onModalHide={onClose}
            enableEdgeToEdgeBottomSafeAreaPadding
            shouldUseReanimatedModal
        >
            <ScreenWrapper
                enableEdgeToEdgeBottomSafeAreaPadding
                includePaddingTop={false}
                testID={AmountSelectorModal.displayName}
                shouldEnableMaxHeight
            >
                <HeaderWithBackButton
                    title={description}
                    onBackButtonPress={onClose}
                />
                <FormProvider
                    formID={ONYXKEYS.FORMS.AMOUNT_PICKER_MODAL_FORM}
                    submitButtonText={translate('common.save')}
                    shouldHideFixErrorsAlert
                    onSubmit={submit}
                    style={[styles.flex1]}
                    submitButtonStyles={[styles.mh5, styles.mt0]}
                    submitFlexEnabled={false}
                    disablePressOnEnter={false}
                    validate={validate}
                    enabledWhenOffline
                    addBottomSafeAreaPadding
                    enterKeyEventListenerPriority={0}
                >
                    <InputWrapper
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...rest}
                        InputComponent={AmountForm}
                        defaultValue={value}
                        ref={(ref) => inputCallbackRef(ref)}
                        // isCurrencyPressable={false}
                        inputID={INPUT_IDS.VALUE}
                    />
                </FormProvider>
                {/* <ScrollView
                    contentContainerStyle={[styles.flexGrow1, styles.mb5]}
                    addBottomSafeAreaPadding
                >
                    <View style={styles.flex1}>
                        <AmountForm
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...rest}
                            value={currentValue}
                            onInputChange={setValue}
                            ref={(ref) => inputCallbackRef(ref)}
                        />
                        <Button
                            success
                            large
                            pressOnEnter
                            text={translate('common.save')}
                            onPress={() => onValueSelected?.(currentValue ?? '')}
                            style={styles.mh5}
                        />
                    </View>
                </ScrollView> */}
            </ScreenWrapper>
        </Modal>
    );
}

AmountSelectorModal.displayName = 'AmountSelectorModal';

export default AmountSelectorModal;
