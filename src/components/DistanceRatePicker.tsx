import React, {useMemo, useState} from 'react';
import {withOnyx} from 'react-native-onyx';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import type {MileageRate} from '@libs/DistanceRequestUtils';
import DistanceRequestUtils from '@libs/DistanceRequestUtils';
import * as OptionsListUtils from '@libs/OptionsListUtils';
import type * as ReportUtils from '@libs/ReportUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import SelectionList from './SelectionList';
import RadioListItem from './SelectionList/RadioListItem';

type DistanceRatePickerOnyxProps = {
    /** Mileage rates */
    rates: MileageRate[];
};

type DistanceRatePickerOProps = DistanceRatePickerOnyxProps & {
    selectedRateID: string;

    /** The policyID we are getting tags for */
    // It's used in withOnyx HOC.
    // eslint-disable-next-line react/no-unused-prop-types
    policyID: string;

    onSubmit: (selectedTag: Partial<ReportUtils.OptionData>) => void;
};

function DistanceRatePicker({rates, onSubmit, selectedRateID}: DistanceRatePickerOProps) {
    const styles = useThemeStyles();
    const {translate, toLocaleDigit} = useLocalize();
    const [searchValue, setSearchValue] = useState('');

    const enabledRatesCount = rates?.filter((rate) => rate.enabled).length;
    const isEnabledRatesBelowThreshold = enabledRatesCount < CONST.TAG_LIST_THRESHOLD;

    const shouldShowTextInput = !isEnabledRatesBelowThreshold;
    const selectedOptions = rates?.filter((rate) => selectedRateID === rate.name);

    // const sections2 = rates.map((rate) => {
    //     const rateForDisplay = DistanceRequestUtils.getRateForDisplay(rate.unit, rate.rate, rate.currency, translate, toLocaleDigit);

    //     return {
    //         text: rate.name ?? rateForDisplay,
    //         alternateText: rate.name ? rateForDisplay : '',
    //         keyForList: rate.customUnitRateID,
    //         value: rate.customUnitRateID,

    //         isSelected: selectedRateID ? selectedRateID === rate.customUnitRateID : Boolean(rate.name === CONST.CUSTOM_UNITS.DEFAULT_RATE),
    //     };
    // });

    const sections = useMemo(
        () =>
            OptionsListUtils.getFilteredOptions([], [], [], searchValue, selectedOptions, [], false, false, false, {}, [], false, [], [], false, false, false, [], true, rates)
                .distanceRateOptions,

        [rates, searchValue, selectedOptions],
    );

    const headerMessage = OptionsListUtils.getHeaderMessageForNonUserList((sections?.[0]?.data?.length ?? 0) > 0, searchValue);

    // console.log(selectedOptions, selectedRateID, rates);
    return (
        <SelectionList
            // sections={[{data: sections2}]}
            sections={sections}
            ListItem={RadioListItem}
            onSelectRow={onSubmit}
            initiallyFocusedOptionKey={selectedRateID}
            sectionTitleStyles={styles.mt5}
            headerMessage={headerMessage}
            textInputValue={searchValue}
            textInputLabel={shouldShowTextInput ? translate('common.search') : undefined}
            isRowMultilineSupported
            onChangeText={setSearchValue}
        />
    );
}

DistanceRatePicker.displayName = 'IOURequestStepDistanceRate';

export default withOnyx<DistanceRatePickerOProps, DistanceRatePickerOnyxProps>({
    rates: {
        key: ({policyID}) => `${ONYXKEYS.COLLECTION.POLICY}${policyID ?? '0'}`,
        selector: DistanceRequestUtils.getMileageRatesArray,
    },
})(DistanceRatePicker);
