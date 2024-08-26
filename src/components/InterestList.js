import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import theme from '../styles/theme';
import { normalizeFontSize } from '../styles/responsive';
import fonts from '../styles/fonts';

const InterestItem = ({ item, isSelected, onSelect, test }) => {
    return (
        <TouchableOpacity
            style={[styles.item, (isSelected || test) && styles.selectedItem]}
            onPress={() => onSelect(item)}
        >
            <Text style={[styles.itemText, (isSelected || test) && styles.selectedText]}>{item?.name}</Text>
        </TouchableOpacity>
    );
};

const InterestList = ({ interests = [], onSelectionChange, test, singleSelection = false }) => {
    const [selectedInterests, setSelectedInterests] = useState([]);

    const handleSelect = (item) => {
        setSelectedInterests((prevSelected) => {
            let newSelected;

            if (singleSelection) {
                // If single selection is enabled, only select the current item
                if (prevSelected.includes(item?.id)) {
                    newSelected = []; // Deselect if already selected
                } else {
                    newSelected = [item?.id]; // Only keep the newly selected item
                }
            } else {
                // Otherwise allow multiple selections
                if (prevSelected.includes(item?.id)) {
                    newSelected = prevSelected.filter((interest) => interest !== item?.id);
                } else {
                    newSelected = [...prevSelected, item?.id];
                }
            }

            return newSelected;
        });
    };

    useEffect(() => {
        onSelectionChange(selectedInterests);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInterests]);

    return (
        <View style={styles.container}>
            {interests?.map((item, index) => (
                <InterestItem
                    key={index}
                    item={item}
                    isSelected={selectedInterests.includes(item?.id)}
                    onSelect={handleSelect}
                    test={test}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    item: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 'auto',
        margin: 5,
        padding: 10,
        backgroundColor: theme.colors.transparent,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.labelColors,
        minWidth: 80,
        alignSelf: 'flex-start',
    },
    selectedItem: {
        backgroundColor: theme.colors.secondary,
        borderWidth: 0,
    },
    itemText: {
        fontSize: normalizeFontSize(14),
        fontFamily: fonts.fontsType.medium,
        color: theme.colors.lightGrey,
    },
    selectedText: {
        color: theme.colors.white,
    },
});

export default InterestList;
