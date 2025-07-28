import type {ValueOf} from 'type-fest';
import type Form from './Form';

const INPUT_IDS = {
    VALUE: 'value',
} as const;

type InputID = ValueOf<typeof INPUT_IDS>;

type AmountPickerModalForm = Form<
    InputID,
    {
        [INPUT_IDS.VALUE]: string;
    }
>;

export type {AmountPickerModalForm};
export default INPUT_IDS;
