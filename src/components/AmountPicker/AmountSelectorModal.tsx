import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import AmountForm from '@components/AmountForm';
import Button from '@components/Button';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import Modal from '@components/Modal';
import ScreenWrapper from '@components/ScreenWrapper';
import ScrollView from '@components/ScrollView';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import CONST from '@src/CONST';
import type {AmountSelectorModalProps} from './types';

function AmountSelectorModal({value, description = '', onValueSelected, onInputChange, isTouched, isVisible, onClose, ...rest}: AmountSelectorModalProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [currentValue, setValue] = useState(value);

    const [initialValue2, setInitialValue2] = useState(value ?? '');
    // Validate again when isTouched changes
    useEffect(() => {
        onInputChange?.(currentValue ?? '');
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isTouched]);

    // Save the initial value for showing it on the Add rate page when user doesn't save it
    useEffect(() => {
        if (!isVisible) {
            return;
        }
        setInitialValue2(value ?? '');
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isVisible]);

    return (
        <Modal
            type={CONST.MODAL.MODAL_TYPE.RIGHT_DOCKED}
            isVisible={isVisible}
            onClose={onClose}
            onModalHide={onClose}
            hideModalContentWhileAnimating
            useNativeDriver
        >
            <ScreenWrapper
                includePaddingTop={false}
                includeSafeAreaPaddingBottom={false}
                testID={AmountSelectorModal.displayName}
                shouldEnableMaxHeight
                style={[styles.pb0]}
            >
                <HeaderWithBackButton
                    title={description}
                    onBackButtonPress={() => {
                        onInputChange?.(initialValue2);
                        onClose();
                    }}
                />
                <ScrollView contentContainerStyle={[styles.flexGrow1, styles.mb5]}>
                    <View style={styles.flex1}>
                        <AmountForm
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...rest}
                            autoFocus
                            value={currentValue}
                            // onInputChange={setValue}
                            onInputChange={(val) => {
                                if (isTouched) {
                                    onInputChange?.(val);
                                }
                                setValue(val);
                            }}
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
                </ScrollView>
            </ScreenWrapper>
        </Modal>
    );
}

AmountSelectorModal.displayName = 'AmountSelectorModal';

export default AmountSelectorModal;
