import type {OnyxEntry} from 'react-native-onyx';
import CONST from '@src/CONST';
import type {PersonalDetails, PersonalDetailsList, Report} from '@src/types/onyx';
import {isEmptyObject} from '@src/types/utils/EmptyObject';

function isPersonalDetailOptimistic(personalDetail: PersonalDetails | null | undefined): boolean {
    return isEmptyObject(personalDetail) || !!personalDetail?.isOptimisticPersonalDetail;
}

const personalDetailsSelector = (accountID: number) => (personalDetailsList: OnyxEntry<PersonalDetailsList>) => personalDetailsList?.[accountID];

const personalDetailsLoginSelector = (accountID: number) => (personalDetailsList: OnyxEntry<PersonalDetailsList>) => personalDetailsList?.[accountID]?.login;

const accountIDToLoginSelector = (reportsToArchive: Report[]) => (personalDetailsList: OnyxEntry<PersonalDetailsList>) => {
    const map: Record<number, string> = {};
    for (const report of reportsToArchive) {
        const {ownerAccountID} = report;
        if (ownerAccountID && ownerAccountID !== CONST.POLICY.OWNER_ACCOUNT_ID_FAKE && personalDetailsList?.[ownerAccountID]?.login) {
            map[ownerAccountID] = personalDetailsList[ownerAccountID].login;
        }
    }
    return map;
};

const isOptimisticPersonalDetailSelector = (accountID: number) => (personalDetailsList: OnyxEntry<PersonalDetailsList>) => {
    return isPersonalDetailOptimistic(personalDetailsList?.[accountID]);
};

export {personalDetailsSelector, personalDetailsLoginSelector, accountIDToLoginSelector, isOptimisticPersonalDetailSelector, isPersonalDetailOptimistic};
