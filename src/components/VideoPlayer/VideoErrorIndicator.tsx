import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from '@components/Icon';
import * as Expensicons from '@components/Icon/Expensicons';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import variables from '@styles/variables';

function VideoErrorIndicator() {
    const theme = useTheme();
    const styles = useThemeStyles();

    return (
        <View style={[StyleSheet.absoluteFillObject, styles.fullScreenLoading, styles.opacity1, styles.highlightBG, styles.br2]}>
            <Icon
                fill={theme.activeComponentBG}
                src={Expensicons.VideoSlash}
                width={variables.iconSizeSuperLarge}
                height={variables.iconSizeSuperLarge}
            />
        </View>
    );
}

VideoErrorIndicator.displayName = 'VideoErrorIndicator';

export default VideoErrorIndicator;
