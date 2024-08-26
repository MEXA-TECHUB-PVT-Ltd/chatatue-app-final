//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../../styles/theme';

// create a component
const MyProfile = () => {
    return (
        <View style={styles.container}>
            <Text>MyProfile</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
    },
});

//make this component available to the app
export default MyProfile;
