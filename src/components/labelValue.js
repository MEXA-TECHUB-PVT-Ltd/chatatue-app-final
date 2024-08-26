import React from 'react';
import { View, Text } from 'react-native';
import { normalizeFontSize, scaleHeight } from '../styles/responsive';
import fonts from '../styles/fonts';
import theme from '../styles/theme';

const LabelValue = ({ label, value, labelStyle, valueStyle }) => {
    return (
        <View style={styles.labelValueStyle}>
            <Text style={[styles.defaultLabelStyle, labelStyle]}>{label}</Text>
            <Text style={[styles.defaultValueStyle, valueStyle]}>{value}</Text>
        </View>
    );
};

const styles = {
    labelValueStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scaleHeight(5),
        marginTop: scaleHeight(10),
    },
    defaultLabelStyle: {
        fontSize: normalizeFontSize(14),
        fontFamily: fonts.fontsType.medium,
        color: theme.colors.textHeading,
    },
    defaultValueStyle: {
        color: '#BEC5D1',
        fontSize: normalizeFontSize(12),
        fontFamily: fonts.fontsType.bold,

    },
};

export default LabelValue;
