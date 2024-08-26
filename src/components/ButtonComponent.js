import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import fonts from '../styles/fonts';
import { normalizeFontSize, scaleWidth } from '../styles/responsive';
import theme from '../styles/theme';
import { UIActivityIndicator } from 'react-native-indicators';


const Button = ({ title, onPress, loading, disabled, customStyle, textCustomStyle, icon, isBgTransparent = false, customIconStyle }) => {
    return (
        <>
            <TouchableOpacity
                style={[styles.button, customStyle]}
                onPress={onPress}
                disabled={disabled}
            >
                {loading ? (
                    <UIActivityIndicator size={35} color={!isBgTransparent ? theme.colors.white : theme.colors.secondary} />
                ) : (
                    <View style={styles.content}>
                        {icon && <View style={[styles.icon,customIconStyle]}>{icon}</View>}
                        <Text style={[styles.buttonText, textCustomStyle]}>{title}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.secondary,
        borderRadius: 25,
        width: '90%',
        height: 45,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
        left: scaleWidth(-35)
    },
    buttonText: {
        color: theme.colors.white,
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(14),
        textAlign: 'center',
    },
});

export default Button;
