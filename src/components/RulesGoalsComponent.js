import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { normalizeFontSize } from '../styles/responsive';
import fonts from '../styles/fonts';
import theme from '../styles/theme';

const RulesGoalsComponent = ({ data, iconName = 'check-circle-outline', iconColor = theme.colors.labelColors, cutsomContainer }) => {
    return (
        <View style={[styles.container, cutsomContainer]}>
            {data?.map((item, index) => (
                <View key={index} style={styles.iconTextContainer}>
                    <Icon name={iconName} size={18} color={iconColor} style={styles.icon} />
                    <Text style={styles.text}>{item?.rule ? item?.rule : item?.goal}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 10,
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        marginRight: 8,
        alignSelf: 'center'
    },
    text: {
        fontSize: normalizeFontSize(12),
        fontFamily: fonts.fontsType.medium,
        color: theme.colors.labelColors
    },
});

export default RulesGoalsComponent;
