import type {Emoji as EmojiBaseEmoji} from 'emojibase';
import emojisDataEN from 'emojibase-data/en/data.json';
import emojisDataES from 'emojibase-data/es/data.json';

type Emoji = {
    code: string;
    name: string;
    types?: string[];
    keywords?: string[];
    order?: number;
};

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

function separetEmojiByGroups(emojis: EmojiBaseEmoji[]): Record<string, Emoji[]> {
    const emojisByGroups: Record<string, Emoji[]> = {};
    emojis.forEach((emoji) => {
        if (emoji.group === undefined || emoji.version > 15) {
            return;
        }

        if (emojisNamesByGroupIndex[emoji.group] && emojisByGroups[emojisNamesByGroupIndex[emoji.group]]) {
            const filteredEmojiTypes = emoji.skins && emoji.skins?.length > 5 ? emoji.skins.filter((type) => type.hexcode.split('-').length <= 2) : emoji.skins;

            emojisByGroups[emojisNamesByGroupIndex[`${emoji.group}`]].push({
                name: emoji.label.split(' ').join('_'),
                code: `${emoji.emoji}`,
                keywords: emoji.tags,
                types: filteredEmojiTypes?.sort((a, b) => (b.order ?? 0) - (a.order ?? -1)).map((type) => `${type.emoji}`),
                order: emoji.order,
            });
            return;
        }
        if (emojisNamesByGroupIndex[emoji.group]) {
            const filteredEmojiTypes = emoji.skins && emoji.skins?.length > 5 ? emoji.skins.filter((type) => type.hexcode.split('-').length <= 2) : emoji.skins;

            emojisByGroups[emojisNamesByGroupIndex[emoji.group]] = [
                {
                    name: emoji.label.split(' ').join('_'),
                    code: `${emoji.emoji}`,
                    keywords: emoji.tags,
                    types: filteredEmojiTypes?.sort((a, b) => (b.order ?? 0) - (a.order ?? -1)).map((type) => `${type.emoji}`),
                    order: emoji.order,
                },
            ];
        }
    });

    Object.keys(emojisByGroups).forEach((category) => {
        // Sort the emojis in each category by the `order` property
        emojisByGroups[category] = emojisByGroups[category].sort((a, b) => {
            return (a.order ?? 0) - (b.order ?? 0);
        });
    });

    return emojisByGroups;
}

const groupedEmojisEN = separetEmojiByGroups(emojisDataEN);
const groupedEmojisES = separetEmojiByGroups(emojisDataES);

export default {groupedEmojisEN, groupedEmojisES};
