import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../styles/theme';

const HorizontalDivider = ({ customStyle }) => {
    return <View style={[styles.HorizontalDivider, customStyle]} />;
};

const styles = StyleSheet.create({
    HorizontalDivider: {
        height: 1,
        backgroundColor: theme.colors.white,
        opacity: 0.19,
        marginVertical: 10,
        width: '100%',
        alignSelf: 'center'
    },
});

export default HorizontalDivider;
