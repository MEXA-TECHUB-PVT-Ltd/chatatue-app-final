import React from 'react';
import { Keyboard,  ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import theme from '../styles/theme';

const CustomLayout = ({ children, customStyle }) => {
    return (
        <View style={[styles.container, customStyle]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView 
                    style={{ backgroundColor: theme.colors.transparent, }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'>
                    {children}
                </ScrollView>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.transparent,
    }
});

export default CustomLayout;
