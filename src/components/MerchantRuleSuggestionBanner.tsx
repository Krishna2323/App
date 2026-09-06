import {useMemoizedLazyExpensifyIcons} from '@hooks/useLazyAsset';
import useLocalize from '@hooks/useLocalize';
import useMerchantRuleSuggestion from '@hooks/useMerchantRuleSuggestion';
import useOnyx from '@hooks/useOnyx';
import useResponsiveLayout from '@hooks/useResponsiveLayout';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';

import {clearMerchantRuleSuggestionFields, dismissMerchantRuleSuggestion, markMerchantRuleSuggestionSeen, retireMerchantRuleSuggestion} from '@libs/actions/MerchantRuleSuggestion';
import {setDraftMerchantRule} from '@libs/actions/User';
import {getMerchantRuleDraftFromTransaction, isMerchantRuleSuggestionLive} from '@libs/MerchantRuleSuggestionUtils';
import createDynamicRoute from '@libs/Navigation/helpers/dynamicRoutesUtils/createDynamicRoute';
import Navigation from '@libs/Navigation/Navigation';

import variables from '@styles/variables';

import ONYXKEYS from '@src/ONYXKEYS';
import {DYNAMIC_ROUTES} from '@src/ROUTES';

import type {StyleProp, ViewStyle} from 'react-native';

import {useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {FadeInDown, FadeInUp, FadeOutDown, FadeOutUp} from 'react-native-reanimated';

import Banner from './Banner';
import Icon from './Icon';
import Text from './Text';
import TextLink from './TextLink';
import {useWideRHPState} from './WideRHPContextProvider';

type MerchantRuleSuggestionBannerProps = {
    /** The report hosting the expense detail view: a transaction thread, its expense report, or the chat it lives in */
    reportID: string | undefined;

    /** The workspace the expense belongs to */
    policyID: string | undefined;

    /** Styles for the banner container */
    containerStyles?: StyleProp<ViewStyle>;

    /** When set, floats the callout in a wrapper carrying these styles instead of laying it out inline */
    overlayStyles?: StyleProp<ViewStyle>;

    /**
     * Whether this is the mount above the composer. Sets the edge the callout slides in from, and which layouts it
     * serves: the composer takes the wide ones, the report list the narrow ones.
     */
    isAnchoredToBottom?: boolean;
};

type MerchantRuleSuggestionBannerContentProps = MerchantRuleSuggestionBannerProps & {
    /** Whether the composer is expanded, which leaves no room for the callout */
    isComposerFullSize: boolean;
};

function MerchantRuleSuggestionBannerContent({reportID, policyID, containerStyles, overlayStyles, isAnchoredToBottom, isComposerFullSize}: MerchantRuleSuggestionBannerContentProps) {
    const styles = useThemeStyles();
    const theme = useTheme();
    const {translate} = useLocalize();
    const icons = useMemoizedLazyExpensifyIcons(['Lightbulb']);
    const {suggestion, fields, editedTagLevels, transaction, policy} = useMerchantRuleSuggestion(reportID, policyID);
    const isShowing = !!suggestion && !!policyID;

    // Recorded so leaving the report can retire the offer. The report cannot work this out for itself, because the
    // one showing an expense is not always the one the edit was recorded against.
    useEffect(() => {
        if (!isShowing || suggestion?.wasSeen) {
            return;
        }
        markMerchantRuleSuggestionSeen();
    }, [isShowing, suggestion?.wasSeen]);

    if (!suggestion || !policyID) {
        return null;
    }

    const dismiss = () => dismissMerchantRuleSuggestion(suggestion);

    const createRule = () => {
        const draft = getMerchantRuleDraftFromTransaction(transaction, fields, policy, editedTagLevels);
        if (!draft) {
            return;
        }
        // Opened as a suffix on the expense's own path, so the expense stays under the modal and the flow returns
        // here rather than to the workspace Rules page.
        setDraftMerchantRule(draft);
        // The offer was taken, so it must not still be asking on the way back, and the recording ends here. Editing
        // the expense again starts fresh instead of repeating fields already in this rule.
        clearMerchantRuleSuggestionFields(suggestion.transactionID);
        retireMerchantRuleSuggestion();
        Navigation.navigate(createDynamicRoute(DYNAMIC_ROUTES.RULES_MERCHANT_NEW_FROM_EXPENSE.getRoute(policyID)));
    };

    // Slides out of the edge it is pinned to rather than popping. FloatingMessageCounter springs a parked view
    // instead, which this cannot do because it unmounts when there is nothing to offer.
    //
    // The composer check sits inside rather than around this wrapper on purpose. Expanding the composer should take
    // the callout away at once, and unmounting the wrapper would instead play the exit animation over the composer
    // as it grows. Emptying it leaves nothing to see while keeping the animation for an actual dismissal.
    return (
        <Animated.View
            style={overlayStyles}
            entering={isAnchoredToBottom ? FadeInDown : FadeInUp}
            exiting={isAnchoredToBottom ? FadeOutDown : FadeOutUp}
        >
            {!isComposerFullSize && (
                <Banner
                    containerStyles={[styles.merchantRuleCalloutContainer, styles.p4, containerStyles]}
                    shouldShowCloseButton
                    onClose={dismiss}
                    content={
                        <>
                            <View style={styles.mr3}>
                                <Icon
                                    src={icons.Lightbulb}
                                    fill={theme.tooltipHighlightText}
                                    width={variables.iconSizeNormal}
                                    height={variables.iconSizeNormal}
                                />
                            </View>
                            <Text style={[styles.flex1, styles.merchantRuleCalloutText, styles.mr3]}>
                                <TextLink
                                    style={styles.merchantRuleCalloutAction}
                                    onPress={createRule}
                                >
                                    {translate('workspace.rules.merchantRules.createRuleFromExpenseAction')}
                                </TextLink>
                                {` ${translate('workspace.rules.merchantRules.createRuleFromExpensePrompt')}`}
                            </Text>
                        </>
                    }
                />
            )}
        </Animated.View>
    );
}

/**
 * Offers the chance to turn an expense edit into a merchant rule, right on the expense that was just edited. Renders
 * nothing unless there is a qualifying edit to act on.
 */
function MerchantRuleSuggestionBanner({reportID, policyID, containerStyles, overlayStyles, isAnchoredToBottom}: MerchantRuleSuggestionBannerProps) {
    const [storedSuggestion] = useOnyx(ONYXKEYS.RAM_ONLY_MERCHANT_RULE_SUGGESTION);
    // A full-size composer leaves no room for the callout, and on narrow layouts it would sit over the button that
    // collapses the composer again. Handled inside the content rather than here, so the callout goes at once instead
    // of animating out over the composer as it grows.
    const [isComposerFullSize = false] = useOnyx(`${ONYXKEYS.COLLECTION.REPORT_IS_COMPOSER_FULL_SIZE}${reportID}`);
    const {shouldUseNarrowLayout} = useResponsiveLayout();
    // A wide RHP reports a narrow layout but looks wide, so it belongs to the composer mount.
    const route = useRoute();
    const {wideRHPRouteKeys} = useWideRHPState();
    const isInWideRHP = !!route?.key && wideRHPRouteKeys.includes(route.key);

    // Both mounts always render; this picks the one for the layout. Deciding here keeps the two halves from drifting,
    // and keeps the navigation-state subscription out of the report actions list, which re-renders far more often.
    const isMountForThisLayout = isAnchoredToBottom ? !shouldUseNarrowLayout || isInWideRHP : shouldUseNarrowLayout && !isInWideRHP;

    // Nothing is stored for most of a session, so skip the inner component and its Onyx subscriptions until there is
    // an edit to offer.
    if (!isMountForThisLayout || !isMerchantRuleSuggestionLive(storedSuggestion)) {
        return null;
    }

    return (
        <MerchantRuleSuggestionBannerContent
            reportID={reportID}
            policyID={policyID}
            containerStyles={containerStyles}
            overlayStyles={overlayStyles}
            isAnchoredToBottom={isAnchoredToBottom}
            isComposerFullSize={isComposerFullSize}
        />
    );
}

export default MerchantRuleSuggestionBanner;
