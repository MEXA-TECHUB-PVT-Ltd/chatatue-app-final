import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { normalizeFontSize, scaleWidth } from '../styles/responsive';
import fonts from '../styles/fonts';
import theme from '../styles/theme';
import Button from './ButtonComponent';
import HorizontalDivider from './HorizontalDivider';

const MembersListItem = ({ profileImage, name, firstButtonName = "View", firstButtonPress, secondButtonName = null, secondButtonPress }) => {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: profileImage }} style={styles.avatar} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{name}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        onPress={firstButtonPress}
                        title={firstButtonName}
                        customStyle={[styles.buttonStyle, { width: secondButtonName == null ? '25%' : '30%' }]}
                        textCustomStyle={styles.buttonTextStyle}
                    />
                    <Button
                        onPress={secondButtonPress}
                        title={secondButtonName && secondButtonName}
                        customStyle={[styles.buttonStyle, styles.buttonWithIcon,
                        {
                            backgroundColor: secondButtonName ? theme.colors.error : theme.colors.secondary,
                            width: secondButtonName == null ? '25%' : '30%'
                        }]}
                        textCustomStyle={styles.buttonTextStyle}
                        icon={secondButtonName == null ? <Icon name='more-horiz' size={24} color={theme.colors.white} /> : null}
                        customIconStyle={styles.customIconStyle}
                    />
                </View>
            </View>
            <HorizontalDivider customStyle={styles.horizontalDividerStyle} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: theme.colors.textHeading,
    },
    infoContainer: {
        marginLeft: 10,
        flex: 1,
    },
    name: {
        fontSize: normalizeFontSize(14),
        fontFamily: fonts.fontsType.medium,
        color: theme.colors.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginEnd: scaleWidth(-50)
    },
    buttonStyle: {
        borderRadius: 8,
        width: '30%',
        height: 40,
        marginBottom: 0,
        marginTop: 0,
    },
    buttonTextStyle: {
        fontSize: normalizeFontSize(11),
    },
    buttonWithIcon: {
        marginHorizontal: '2%',
    },
    customIconStyle: {
        marginRight: 0,
        left: 0,
    },
    horizontalDividerStyle: {
        width: '78%',
        alignSelf: 'flex-end',
        marginEnd: '4%',
        marginVertical: 3,
    },
});

export default MembersListItem;
