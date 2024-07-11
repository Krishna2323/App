import Smiley from '@assets/images/emoji.svg';
import Flags from '@assets/images/emojiCategoryIcons/flag.svg';
import FoodAndDrink from '@assets/images/emojiCategoryIcons/hamburger.svg';
import Objects from '@assets/images/emojiCategoryIcons/light-bulb.svg';
import Symbols from '@assets/images/emojiCategoryIcons/peace-sign.svg';
import TravelAndPlaces from '@assets/images/emojiCategoryIcons/plane.svg';
import AnimalsAndNature from '@assets/images/emojiCategoryIcons/plant.svg';
import Activities from '@assets/images/emojiCategoryIcons/soccer-ball.svg';
import FrequentlyUsed from '@assets/images/history.svg';
import sortedEmojis from './sortedEmojisEN';
import type {HeaderEmoji, PickerEmojis} from './types';

const skinTones = [
    {
        code: '🖐',
        skinTone: -1,
    },
    {
        code: '🖐🏻',
        skinTone: 4,
    },
    {
        code: '🖐🏼',
        skinTone: 3,
    },
    {
        code: '🖐🏽',
        skinTone: 2,
    },
    {
        code: '🖐🏾',
        skinTone: 1,
    },
    {
        code: '🖐🏿',
        skinTone: 0,
    },
] as const;

const headers: HeaderEmoji[] = [
    {
        header: true,
        icon: Smiley,
        code: 'smileysAndEmotion',
    },
    {
        header: true,
        icon: AnimalsAndNature,
        code: 'animalsAndNature',
    },
    {
        header: true,
        icon: FoodAndDrink,
        code: 'foodAndDrink',
    },
    {
        header: true,
        icon: TravelAndPlaces,
        code: 'travelAndPlaces',
    },
    {
        header: true,
        icon: Activities,
        code: 'activities',
    },
    {
        header: true,
        icon: Objects,
        code: 'objects',
    },
    {
        header: true,
        icon: Symbols,
        code: 'symbols',
    },
    {
        header: true,
        icon: Flags,
        code: 'flags',
    },
];

const emojis: PickerEmojis = headers
    .map((header) => {
        if (sortedEmojis[header.code]) {
            return [header, sortedEmojis[header.code]];
        }
        return header;
    })
    .flat(2);

const categoryFrequentlyUsed: HeaderEmoji = {
    header: true,
    code: 'frequentlyUsed',
    icon: FrequentlyUsed,
};

export {skinTones, categoryFrequentlyUsed};
export default emojis;
