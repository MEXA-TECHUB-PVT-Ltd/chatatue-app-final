import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can change the icon library
import { normalizeFontSize } from '../styles/responsive';
import theme from '../styles/theme';
import fonts from '../styles/fonts';

const ItemWithEditAction = ({ label, onEditPress, onItemPress, containerStyle, labelStyle, iconStyle }) => {
    return (
        <TouchableOpacity style={[styles.container, containerStyle]} onPress={onItemPress}>
            <Text style={[styles.label, labelStyle]}>{label}</Text>
            <TouchableOpacity onPress={onEditPress} style={styles.iconContainer}>
                <Icon name="edit" size={24} color={'#ABAAB1'} style={iconStyle} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: theme.colors.actionItemColor,
        marginHorizontal:20,
        marginTop:10,
        borderRadius:10
    },
    label: {
        fontSize: normalizeFontSize(14),
        color: '#ABAAB1',
        fontFamily: fonts.fontsType.medium,
        flex: 1
    },
    iconContainer: {
        paddingLeft: 10,
    },
};

export default ItemWithEditAction;
