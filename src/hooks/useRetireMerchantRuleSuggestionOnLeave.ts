import {retireMerchantRuleSuggestion} from '@libs/actions/MerchantRuleSuggestion';
import {isMerchantRuleSuggestionLive} from '@libs/MerchantRuleSuggestionUtils';

import ONYXKEYS from '@src/ONYXKEYS';

import {useEffect, useRef} from 'react';

import useOnyx from './useOnyx';

/**
 * Ends the "Create a rule" offer once the user has seen it and left the report showing it.
 *
 * Owned by the report, not the callout: the callout unmounts whenever the layout crosses the narrow breakpoint or the
 * composer expands, and retiring on those would silence an offer the user is still looking at.
 *
 * Whether it was seen is read from the record rather than matched against this report, because the report showing an
 * expense is not always the one the edit was recorded against. An expense report holding a single expense renders the
 * detail view under its own reportID, so matching here would never fire and the offer would outlive the page.
 */
function useRetireMerchantRuleSuggestionOnLeave() {
    const [suggestion] = useOnyx(ONYXKEYS.RAM_ONLY_MERCHANT_RULE_SUGGESTION);
    const hasBeenSeenRef = useRef(false);
    // Tracks the live value rather than latching, so an offer dismissed on the way out is not retired as well.
    const isSeenAndLive = !!suggestion?.wasSeen && isMerchantRuleSuggestionLive(suggestion);

    useEffect(() => {
        hasBeenSeenRef.current = isSeenAndLive;
    }, [isSeenAndLive]);

    useEffect(
        () => () => {
            if (!hasBeenSeenRef.current) {
                return;
            }
            retireMerchantRuleSuggestion();
        },
        [],
    );
}

export default useRetireMerchantRuleSuggestionOnLeave;
