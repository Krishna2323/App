import sortedEmojis from './sortedEmojisEN';
import type {EmojisList} from './types';

/* eslint-disable @typescript-eslint/naming-convention */
const enEmojis: EmojisList = {};

Object.values(sortedEmojis)
    .map((e) => e)
    .forEach((val) => val.forEach((e) => (enEmojis[e.code] = {keywords: e.keywords ?? [], name: e.name})));

export default enEmojis;
