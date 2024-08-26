import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import theme from '../styles/theme';
import { scaleHeight, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';

const FullScreenLoader = ({ loading, title, customTitleStyle, indicatorSize = 70, customIndicatorContainer }) => {
    return (
        loading && <View style={[styles.container, customIndicatorContainer]}>

            <UIActivityIndicator size={indicatorSize} color={theme.colors.secondary} />
            {title && <Text style={[styles.titleStyle, { customTitleStyle }]}>{title}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
    },
    titleStyle: {
        fontSize: scaleHeight(16),
        fontFamily: fonts.fontsType.regular,
        color: theme.colors.white,
    },
});

export default FullScreenLoader;
