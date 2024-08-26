import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import theme from '../styles/theme';
import fonts from '../styles/fonts';
import { normalizeFontSize, scaleHeight } from '../styles/responsive';
import Button from './ButtonComponent';

const CustomBottomSheet = ({
    refRBSheet,
    buttonTitle,
    heading,
    loading,
    handlePress,
    iconComponent
}) => {
    return (
        <RBSheet
            ref={refRBSheet}
            openDuration={1000}
            customStyles={{
                wrapper: styles.wrapper,
                container: [styles.sheetContainer, { backgroundColor: theme.colors.primary }]
            }}
        >
            <View style={styles.header}>
                {iconComponent}
                <Text style={styles.sheetHeaderText}>{heading}</Text>
            </View>
            <View style={styles.content}>
                <Button
                    loading={loading}
                    onPress={handlePress}
                    title={buttonTitle}
                    customStyle={styles.button}
                />
            </View>
        </RBSheet>
    );
};

export default CustomBottomSheet;


const styles = StyleSheet.create({

    wrapper: {
        backgroundColor: 'rgba(128, 128, 128, 0.80)',
    },
    sheetContainer: {
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        width: '100%',
        alignSelf: 'center'
    },
    header: {
        marginTop: scaleHeight(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    sheetHeaderText: {
        fontFamily: fonts.fontsType.medium,
        color: theme.colors.white,
        fontSize: normalizeFontSize(20),
        marginTop: scaleHeight(20)
    },
    closeButton: {
        alignSelf: 'flex-end'
    },
    content: {
        paddingHorizontal: 20
    },
    button: {
        width: '70%',
        marginBottom: 0,
        marginTop: scaleHeight(30)
    }
});
