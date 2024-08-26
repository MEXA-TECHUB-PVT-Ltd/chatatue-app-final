import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import theme from '../styles/theme';
import { normalizeFontSize } from '../styles/responsive';
import fonts from '../styles/fonts';

const OptionSelector = ({ items, onSelect, displayKey }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    console.log(displayKey)

    const handleSelect = (item) => {
        setSelectedItem(item);
        onSelect(item);
    };

    return (
        <ScrollView>
            {items?.map((item, index) => (
                <View key={index}>
                    {selectedItem === item?.id && <Icon name="checkcircle" size={18} color={theme.colors.textHeading} style={styles.icon} />}
                    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelect(item?.id)}>
                        <Text style={styles.itemText}>{item[displayKey]}</Text>
                    </TouchableOpacity>
                    {index < items.length - 1 && <View style={styles.divider} />}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginHorizontal: 25
    },
    itemText: {
        fontSize: normalizeFontSize(14),
        fontFamily: fonts.fontsType.bold,
        color: theme.colors.labelColors,
    },
    icon: {
        position: 'absolute',
        top: 15,
        left: 10
    },
    divider: {
        height: 0.5,
        backgroundColor: theme.colors.labelColors,
        marginHorizontal: 15,
    },
});

export default OptionSelector;
