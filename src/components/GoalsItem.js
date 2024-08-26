import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme';
import { normalizeFontSize, scaleHeight } from '../styles/responsive';
import fonts from '../styles/fonts';

const GoalsItem = ({ item, onRemove }) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                <Icon name="close" size={20} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        backgroundColor: theme.colors.inputBg,
        borderRadius:10,
        marginTop:scaleHeight(10)
    },
    itemText: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(14),
        color: theme.colors.primary,
        flex:1
    },
    removeButton: {
        padding: 5,
        top:-8
    },
});

export default GoalsItem;
