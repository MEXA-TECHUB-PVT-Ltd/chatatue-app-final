import React, { useEffect, useState } from 'react';
import { Dimensions, Text, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useAlert } from '../providers/AlertContext';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../styles/responsive';
import theme from '../styles/theme';
import fonts from '../styles/fonts';

const { width } = Dimensions.get('window');

const DynamicAlert = () => {
    const { alert, hideAlert } = useAlert();

    useEffect(() => {
        if (alert.visible) {
            const timer = setTimeout(() => {
                hideAlert();
            }, 3000);

            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alert.visible]);

    if (!alert.visible) return null;

    const getShadowStyle = () => {
        switch (alert.type) {
            case 'success':
                return styles.successShadow;
            case 'error':
                return styles.errorShadow;
            default:
                return {};
        }
    };

    return (
        <Animatable.View
            animation={alert.type === 'success' ? "slideInDown" : "bounceInRight"}
            duration={500}
            style={[styles.container, styles[alert.type], getShadowStyle()]}
        >
            <View style={styles.content}>
                {/* <Image resizeMode='contain' source={getImageSource()} style={styles.icon} /> */}
                <Text style={[styles.text, {
                    color: alert.type === 'success' ? "#4CAF50" : theme.colors.error
                }]}>{alert.message}</Text>
            </View>
            <Text style={styles.descriptionText}>{alert.description}</Text>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: width * 0.02,
        margin: width * 0.04,
        borderRadius: 10,
        zIndex: 1000,
        backgroundColor: theme.colors.primary,
        borderWidth: 1.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    text: {
        fontFamily: fonts.fontsType.bold,
        color: 'white',
        fontSize: 17,
    },
    descriptionText: {
        fontFamily: fonts.fontsType.semiBold,
        color: theme.colors.white,
        fontSize: normalizeFontSize(12),
    },
    icon: {
        width: width * 0.06,
        height: width * 0.06,
        top: scaleHeight(10),
    },
    success: {
        borderColor: '#4CAF50',
    },
    error: {
        borderColor: theme.colors.error,
    },
    successShadow: {
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    errorShadow: {
        shadowColor: theme.colors.error,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
});

export default DynamicAlert;
