// GradientScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../styles/theme';

const GradientScreen = ({ children }) => {
    return (
        <LinearGradient
            colors={[theme.colors.primary,theme.colors.secondary, theme.colors.primary, theme.colors.primary, theme.colors.textHeading]}
            locations={[0.1,0, 0.5, 0.85, 1]}
            start={{ x: 2.3, y: -0.1 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
        >
            <View style={styles.container}>
                {children}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GradientScreen;
