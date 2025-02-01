import type {CodeTextStyles, CodeWordStyles, CodeWordWrapperStyles} from './types';

const codeWordWrapper: CodeWordWrapperStyles = {
    height: 22,
    justifyContent: 'center',
};

const codeWordStyle: CodeWordStyles = {
    height: 18,
    top: 4,
};

const codeTextStyle: CodeTextStyles = {
    lineHeight: 22,
};

const codePlainTextStyle: CodeTextStyles = {
    lineHeight: 15,
};

const codeWithTextStyle: CodeWordStyles = {
    top: 7,
    marginTop: 7,
};

export default {codeWordWrapper, codeWordStyle, codeTextStyle, codePlainTextStyle, codeWithTextStyle};
