import type {RouteProp} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import React, {useMemo} from 'react';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import useLocalize from '@hooks/useLocalize';
import useReviewDuplicatesNavigation from '@hooks/useReviewDuplicatesNavigation';
import {setReviewDuplicatesKey} from '@libs/actions/Transaction';
import type {TransactionDuplicateNavigatorParamList} from '@libs/Navigation/types';
import * as TransactionUtils from '@libs/TransactionUtils';
import type SCREENS from '@src/SCREENS';
import type {FieldItemType} from './ReviewFields';
import ReviewFields from './ReviewFields';

function ReviewDescription() {
    const route = useRoute<RouteProp<TransactionDuplicateNavigatorParamList, typeof SCREENS.TRANSACTION_DUPLICATE.DESCRIPTION>>();
    const {translate} = useLocalize();
    const transactionID = TransactionUtils.getTransactionID(route.params.threadReportID ?? '');
    const compareResult = TransactionUtils.compareDuplicateTransactionFields(transactionID);
    const stepNames = Object.keys(compareResult.change ?? {}).map((key, index) => (index + 1).toString());
    const {currentScreenIndex, navigateToNextScreen} = useReviewDuplicatesNavigation(Object.keys(compareResult.change ?? {}), 'comment', route.params.threadReportID ?? '');
    const options = useMemo(
        () =>
            compareResult.change.comment?.map((comment) =>
                !comment?.comment
                    ? {text: translate('violations.none'), value: ''}
                    : {
                          text: comment.comment,
                          value: comment.comment,
                      },
            ),
        [compareResult.change.comment, translate],
    );

    const setDescription = (data: FieldItemType<'commentOption'>) => {
        if (data.value !== undefined) {
            const comment = compareResult.change.comment?.find((d) => d?.comment === data.value);
            setReviewDuplicatesKey({comment: {...comment, comment: data.value}});
        }
        navigateToNextScreen();
    };

    return (
        <ScreenWrapper testID={ReviewDescription.displayName}>
            <HeaderWithBackButton title={translate('iou.reviewDuplicates')} />
            <ReviewFields<'commentOption'>
                stepNames={stepNames}
                label={translate('violations.descriptionToKeep')}
                options={options}
                index={currentScreenIndex}
                onSelectRow={setDescription}
            />
        </ScreenWrapper>
    );
}

ReviewDescription.displayName = 'ReviewDescription';

export default ReviewDescription;
