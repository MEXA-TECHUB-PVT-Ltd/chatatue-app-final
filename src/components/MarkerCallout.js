import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../styles/theme';
import fonts from '../styles/fonts';
import { normalizeFontSize } from '../styles/responsive';

const MarkerCallout = ({ point, elevation }) => {
    return (
        <View style={styles.container}>

            <View style={[styles.pointContainer, { marginTop: 0 }]}>
                <Text style={styles.labelStyle}>
                    Point :
                </Text>

                <Text style={styles.valueStyle}>
                    {point}
                </Text>
            </View>

            <View style={styles.pointContainer}>
                <Text style={styles.labelStyle}>
                    Elevation :
                </Text>

                <Text style={styles.valueStyle}>
                    {`${elevation?.toFixed(2)} m`}
                </Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        borderRadius: 20,
        elevation: 8,
        shadowOpacity: 0.3,
        shadowColor: theme.colors.textHeading,
        shadowRadius: 10,
        padding: 20,
        alignSelf: 'center'
    },
    pointContainer: { flexDirection: 'row', marginTop: 10 },
    labelStyle: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(16),
        color: theme.colors.textHeading,

    },
    valueStyle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: normalizeFontSize(14),
        color: theme.colors.labelColors,
        alignSelf: 'center',
        marginHorizontal: 10

    }
});

export default MarkerCallout;
