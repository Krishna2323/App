import sortedEmojis from './sortedEmojisES';
import type {EmojisList} from './types';

/* eslint-disable @typescript-eslint/naming-convention */
const esEmojis: EmojisList = {};

Object.values(sortedEmojis)
    .map((e) => e)
    .forEach((val) => val.forEach((e) => (esEmojis[e.code] = {keywords: e.keywords ?? [], name: e.name})));

export default esEmojis;
