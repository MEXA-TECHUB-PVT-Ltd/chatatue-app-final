import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import fonts from '../styles/fonts';
import { normalizeFontSize } from '../styles/responsive';
import theme from '../styles/theme';

const ClubMember = ({ avatarUrl, memberName, customImageStyle, onPress, isPress = true }) => {
    return (
        <TouchableOpacity
            disabled={isPress}
            onPress={onPress}
            style={styles.container}>
            <Image source={{ uri: avatarUrl }} style={[styles.avatar, customImageStyle]} />
            <Text style={styles.name}>{memberName}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        margin: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginBottom: 8,
    },
    name: {
        fontSize: normalizeFontSize(10),
        fontFamily: fonts.fontsType.regular,
        color: theme.colors.white
    },
});

export default ClubMember;
