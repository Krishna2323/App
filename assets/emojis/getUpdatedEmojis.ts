import type {Emoji, Emoticon, Shortcode} from 'emojibase';
import emojisD from 'emojibase-data/en/data.json';
import emojisr from 'emojibase-data/en/messages.json';
import Smiley from '@assets/images/emoji.svg';
import Flags from '@assets/images/emojiCategoryIcons/flag.svg';
import FoodAndDrink from '@assets/images/emojiCategoryIcons/hamburger.svg';
import Objects from '@assets/images/emojiCategoryIcons/light-bulb.svg';
import Symbols from '@assets/images/emojiCategoryIcons/peace-sign.svg';
import TravelAndPlaces from '@assets/images/emojiCategoryIcons/plane.svg';
import AnimalsAndNature from '@assets/images/emojiCategoryIcons/plant.svg';
import Activities from '@assets/images/emojiCategoryIcons/soccer-ball.svg';

const emojis222 = [
    {
        header: true,
        icon: Smiley,
        code: 'smileysAndEmotion',
        emojibaseGroupsIndex: [0, 1],
    },
    {
        header: true,
        icon: AnimalsAndNature,
        code: 'animalsAndNature',
        emojibaseGroupsIndex: [2],
    },
    {
        header: true,
        icon: FoodAndDrink,
        code: 'foodAndDrink',
        emojibaseGroupsIndex: [3],
    },
    {
        header: true,
        icon: TravelAndPlaces,
        code: 'travelAndPlaces',
        emojibaseGroupsIndex: [4],
    },
    {
        header: true,
        icon: Activities,
        code: 'activities',
        emojibaseGroupsIndex: [5],
    },
    {
        header: true,
        icon: Objects,
        code: 'objects',
        emojibaseGroupsIndex: [6],
    },
    {
        header: true,
        icon: Symbols,
        code: 'symbols',
        emojibaseGroupsIndex: [7],
    },
    {
        header: true,
        icon: Flags,
        code: 'flags',
        emojibaseGroupsIndex: [8],
    },
];

/* eslint-disable */
const emojisNamesByGroupIndex: {[key: number]: string} = {
    0: 'smileysAndEmotion',
    1: 'smileysAndEmotion',
    3: 'animalsAndNature',
    4: 'foodAndDrink',
    5: 'travelAndPlaces',
    6: 'activities',
    7: 'objects',
    8: 'symbols',
    9: 'flags',
};

const emojisByGroups: Record<string, Emoji[]> = {};

function separetEmojiByGroups(emojis: Emoji[]) {
    emojis.forEach((emoji) => {
        if (emoji.group === undefined) {
            return;
        }

        if (emojisNamesByGroupIndex[emoji.group] && emojisByGroups[emojisNamesByGroupIndex[emoji.group]]) {
            emojisByGroups[emojisNamesByGroupIndex[`${emoji.group}`]].push(emoji);
            return;
        }
        if (emojisNamesByGroupIndex[emoji.group]) {
            emojisByGroups[emojisNamesByGroupIndex[emoji.group]] = [emoji];
        }
    });
}

separetEmojiByGroups(emojisD);

const sortedArrayNew = {};

Object.keys(emojisByGroups).forEach((category) => {
    // Sort the emojis in each category by the `order` property
    const sortedEmojis = emojisByGroups[category].sort((a, b) => {
        // console.log(a, b);
        return (a.order ?? 0) - (b.order ?? 0);
    });

    // console.log(sortedEmojis);

    // Sort the skins for each emoji, if they exist
    const sortedEmojisWithSortedSkins = sortedEmojis.map((emoji) => {
        let sortedSkins: Emoji['skins'] = [];
        if (emoji.skins) {
            sortedSkins = emoji.skins.sort((a, b) => (b.order ?? 0) - (a.order ?? -1));
        }
        return {
            ...emoji,
            skins: sortedSkins,
        };
    });

    sortedArrayNew[category] = sortedEmojisWithSortedSkins;
});

console.log(emojisr, emojisD, sortedArrayNew);
export default emojisByGroups;
