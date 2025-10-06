import {createPoliciesSelector} from '@selectors/Policy';
import {useMemo} from 'react';
import type {OnyxCollection, OnyxEntry} from 'react-native-onyx';
import {arePaymentsEnabled, isPaidGroupPolicy} from '@libs/PolicyUtils';
import {createTypeMenuSections} from '@libs/SearchUIUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type {Policy, Session} from '@src/types/onyx';
import useCardFeedsForDisplay from './useCardFeedsForDisplay';
import useNetwork from './useNetwork';
import useOnyx from './useOnyx';

const policySelector = (policy: OnyxEntry<Policy>): OnyxEntry<Policy> =>
    policy && {
        id: policy.id,
        name: policy.name,
        type: policy.type,
        role: policy.role,
        owner: policy.owner,
        connections: policy.connections,
        outputCurrency: policy.outputCurrency,
        isPolicyExpenseChatEnabled: policy.isPolicyExpenseChatEnabled,
        reimburser: policy.reimburser,
        exporter: policy.exporter,
        approver: policy.approver,
        approvalMode: policy.approvalMode,
        employeeList: policy.employeeList,
        reimbursementChoice: policy.reimbursementChoice,
        areCompanyCardsEnabled: policy.areCompanyCardsEnabled,
        areExpensifyCardsEnabled: policy.areExpensifyCardsEnabled,
        achAccount: policy.achAccount,
    };

const policiesSelector = (policies: OnyxCollection<Policy>) => createPoliciesSelector(policies, policySelector);

const currentUserLoginAndAccountIDSelector = (session: OnyxEntry<Session>) => ({
    email: session?.email,
    accountID: session?.accountID,
});
/**
 * Get a list of all search groupings, along with their search items. Also returns the
 * currently focused search, based on the hash
 */
const useSearchTypeMenuSections = () => {
    const {defaultCardFeed, cardFeedsByPolicy, defaultExpensifyCard} = useCardFeedsForDisplay();

    const {isOffline} = useNetwork();
    const [allPolicies] = useOnyx(ONYXKEYS.COLLECTION.POLICY, {selector: policiesSelector, canBeMissing: true});
    const [currentUserLoginAndAccountID] = useOnyx(ONYXKEYS.SESSION, {selector: currentUserLoginAndAccountIDSelector, canBeMissing: false});
    const [activePolicyID] = useOnyx(ONYXKEYS.NVP_ACTIVE_POLICY_ID, {canBeMissing: true});
    const [savedSearches] = useOnyx(ONYXKEYS.SAVED_SEARCHES, {canBeMissing: true});
    const [reports] = useOnyx(ONYXKEYS.COLLECTION.REPORT, {canBeMissing: true});
    // Card data sources used to determine readiness for suggested searches
    const [workspaceCardFeeds] = useOnyx(ONYXKEYS.COLLECTION.WORKSPACE_CARDS_LIST, {canBeMissing: true});
    const [userCardList] = useOnyx(ONYXKEYS.CARD_LIST, {canBeMissing: true});

    const typeMenuSections = useMemo(
        () =>
            createTypeMenuSections(
                currentUserLoginAndAccountID?.email,
                currentUserLoginAndAccountID?.accountID,
                cardFeedsByPolicy,
                defaultCardFeed ?? defaultExpensifyCard,
                allPolicies,
                activePolicyID,
                savedSearches,
                isOffline,
                defaultExpensifyCard,
                reports,
            ),
        [
            currentUserLoginAndAccountID?.email,
            currentUserLoginAndAccountID?.accountID,
            cardFeedsByPolicy,
            defaultCardFeed,
            defaultExpensifyCard,
            allPolicies,
            activePolicyID,
            savedSearches,
            isOffline,
            reports,
        ],
    );

    // Determine if we have enough data to compute suggested searches deterministically
    const isSuggestedSearchAccessReady = useMemo(() => {
        // If policies collection itself is missing, we cannot determine access
        if (!allPolicies) {
            return false;
        }

        // Check required policy fields for each policy we know about
        const policiesArray = Object.values(allPolicies).filter(Boolean);

        for (const policy of policiesArray) {
            // If a policy entry is missing (shouldn't happen after filter), skip
            if (!policy) {
                // Keep checking others
                // but missing policy data indicates we're likely still loading
                return false;
            }

            // Employee list must be defined (can be empty object) for paid policies
            if (isPaidGroupPolicy(policy) && policy.employeeList === undefined) {
                return false;
            }

            // Exporter must be defined (may be empty string or email) for paid policies
            if (isPaidGroupPolicy(policy) && policy.exporter === undefined) {
                return false;
            }

            // Reimburser lives under achAccount; only required for paid policies where current user is an admin,
            // and only when payments are enabled and a VBBA exists (OPEN bank account)
            if (isPaidGroupPolicy(policy) && policy.role === CONST.POLICY.ROLE.ADMIN && arePaymentsEnabled(policy)) {
                const hasVBBA = !!policy.achAccount?.bankAccountID && policy.achAccount.state === CONST.BANK_ACCOUNT.STATE.OPEN;
                if (hasVBBA && policy.achAccount?.reimburser === undefined) {
                    return false;
                }
            }

            // For policies with company cards enabled, ensure workspace card feeds presence is known for that policy
            // Only applicable when the policy is paid and the current user is an admin, matching getSuggestedSearchesVisibility logic
            if (policy.areCompanyCardsEnabled && isPaidGroupPolicy(policy) && policy.role === CONST.POLICY.ROLE.ADMIN) {
                // If the entire collection is missing, not ready
                if (workspaceCardFeeds === undefined) {
                    return false;
                }
                // We don't require a specific key per policy here because keys are namespaced by workspace accountID and feed type
            }
        }

        // Also ensure user card list is loaded (presence vs undefined); value may be empty
        if (userCardList === undefined) {
            return false;
        }

        return true;
    }, [allPolicies, workspaceCardFeeds, userCardList]);

    return {typeMenuSections, isSuggestedSearchAccessReady};
};

export default useSearchTypeMenuSections;
