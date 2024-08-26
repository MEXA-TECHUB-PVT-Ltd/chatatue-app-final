import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet"; // Assuming you're using RBSheet
import theme from '../styles/theme';
import fonts from '../styles/fonts';
import { normalizeFontSize } from '../styles/responsive';
import HorizontalDivider from './HorizontalDivider';

const ActionSheet = React.forwardRef(({ sheetItems }, ref) => {
    return (
        <RBSheet
            ref={ref}
            height={110}
            openDuration={250}
            customStyles={{
                wrapper: styles.wrapper,
                container: [styles.container, { backgroundColor: theme.colors.primary }]
            }}
        >
            {sheetItems?.map((item, index) => (
                <React.Fragment key={index}>
                    <TouchableOpacity
                        onPress={item.onPress}
                        style={styles.itemTouchable}
                    >
                        <Text style={[styles.itemText, {
                            fontFamily: fonts.fontsType.semiBold,
                            fontSize: normalizeFontSize(16),
                            color: item?.id === 2 ? theme.colors.error : theme.colors.white
                        }]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                    {index < sheetItems.length - 1 && <HorizontalDivider />}
                </React.Fragment>
            ))}
        </RBSheet>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'rgba(128, 128, 128, 0.80)',
    },
    container: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        width: '90%',
        alignSelf: 'center',
    },
    itemTouchable: {
        justifyContent: 'center',
        alignItems: 'center',
        //paddingVertical: 10,
    },
    itemText: {

    },
});

export default ActionSheet;
