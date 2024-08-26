import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo'
import theme from '../styles/theme';
import Button from './ButtonComponent';
import { scaleHeight } from '../styles/responsive';
import fonts from '../styles/fonts';

const CustomModal = ({
    isVisible,
    onClose,
    backdropOpacity = 0.90,
    backdropColor = 'rgba(85, 85, 85, 0.70)',
    animationIn = 'bounceIn',
    animationOut = 'bounceOut',
    animationInTiming = 500,
    animationOutTiming = 500,
    imageSource,
    imageStyle,
    text,
    buttonText,
    buttonAction,
    headerTitle,
    isParallelButton,
    parallelButtonText1,
    parallelButtonText2,
    parallelButtonPress1,
    parallelButtonPress2,
    loading,
    secondaryLoader,
    isCross = false,
    modalCustomTextStyle,
    customModalStyle
}) => {
    return (
        <Modal
            backdropOpacity={backdropOpacity}
            backdropColor={backdropColor}
            isVisible={isVisible}
            animationIn={animationIn}
            animationOut={animationOut}
            animationInTiming={animationInTiming}
            animationOutTiming={animationOutTiming}
            onBackdropPress={onClose}
        >
            <View style={[styles.modalContainer, customModalStyle]}>
                {isCross && <TouchableOpacity
                    onPress={() => {
                        onClose();
                    }}
                    style={styles.crossStyle}
                >
                    <Icon
                        name='cross'
                        size={40}
                        color={theme.colors.secondary} />
                </TouchableOpacity>}
                {imageSource && (
                    <Image
                        resizeMode='contain'
                        source={imageSource}
                        style={[styles.image, imageStyle]}
                    />
                )}
                {headerTitle && <Text style={styles.headerTitle}>{headerTitle}</Text>}
                {text && <Text style={[styles.text, modalCustomTextStyle]}>{text}</Text>}
                {buttonText && buttonAction && !isParallelButton && (
                    <Button
                        title={buttonText}
                        onPress={buttonAction}
                        customStyle={{
                            width: '85%',
                            marginTop: scaleHeight(40),
                            marginBottom: scaleHeight(0)
                        }}
                    />

                )}

                {
                    isParallelButton && <View style={{ flexDirection: 'row', marginTop: scaleHeight(10), }}>
                        <Button
                            loading={secondaryLoader === true && secondaryLoader}
                            title={parallelButtonText1}
                            onPress={parallelButtonPress1}
                            isBgTransparent={true}
                            customStyle={{
                                width: '48%',
                                marginHorizontal: '2%',
                                backgroundColor: theme.colors.transparent,
                                borderWidth: 1,
                                borderColor: theme.colors.secondary,
                                marginBottom: scaleHeight(0)
                            }}
                            textCustomStyle={{
                                color: theme.colors.secondary,
                                fontFamily: fonts.fontsType.bold,
                                fontSize: scaleHeight(12),
                            }}
                        />

                        <Button
                            loading={loading === true && loading}
                            title={parallelButtonText2}
                            onPress={parallelButtonPress2}
                            customStyle={{
                                width: '48%',
                                marginBottom: scaleHeight(0)
                            }}
                            textCustomStyle={{
                                fontFamily: fonts.fontsType.bold,
                                fontSize: scaleHeight(13),
                            }}
                        />
                    </View>
                }
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#111111',
        width: '90%',
        // height: '50%',
        alignSelf: 'center',
        borderRadius: 20,
        elevation: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        marginTop: scaleHeight(-10)
    },
    text: {
        color: theme.colors.white,
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(16),
        textAlign: 'center',
        marginTop: 10,
        alignSelf: 'center',

    },
    headerTitle: {
        color: theme.colors.white,
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(20),
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: scaleHeight(-15)
    },
    crossStyle: {
        alignSelf: 'flex-end',
        marginTop: scaleHeight(-15),
        marginBottom: scaleHeight(-10),
        marginEnd: scaleHeight(-15)
    }
});

export default CustomModal;
