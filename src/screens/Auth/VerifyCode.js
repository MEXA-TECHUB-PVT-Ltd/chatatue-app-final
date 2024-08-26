import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { scaleHeight, scaleWidth } from '../../styles/responsive';
import { BackButton } from '../../assets/svgs';
import CustomLayout from '../../components/CustomLayout';
import Button from '../../components/ButtonComponent';
import fonts from '../../styles/fonts';
import theme from '../../styles/theme';
import { SCREENS } from '../../constant/constants';
import { resetNavigation } from '../../utils/resetNavigation';
import useBackHandler from '../../utils/useBackHandler';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../providers/AlertContext';
import { verifyCode } from '../../redux/AuthSlices/verifyCodeSlice';
import { createDelayedNavigation } from '../../utils/navigationWithDelay';

const CELL_COUNT = 4;

const VerifyCode = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { loading } = useSelector((state) => state.verifyCode)
    const { data } = useSelector((state) => state.setAuthData)
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
    const handleSendCodeNav = createDelayedNavigation(navigation, SCREENS.RESET_PASSWORD)


    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.FORGET_PASSWORD)
        return true;
    }
    useBackHandler(handleBackPress)

    const handleSendCode = () => {
        if (value) {
            const payload = {
                email: data?.email,
                otp: value
            }
            dispatch(verifyCode(payload)).then((result) => {
                if (result?.payload?.success === true) {
                    showAlert("Success", "success", result?.payload?.message)
                    handleSendCodeNav();
                }

                else if (result?.payload?.error?.success == false) {
                    showAlert("Error", "error", result?.payload?.message)
                }

                else if (result?.payload?.success === false) {
                    showAlert("Error", "error", result?.payload?.message)
                }

            })
        } else {
            showAlert("Error", "error", "Please enter the OTP that was sent to your email.")
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => { handleBackPress() }} style={styles.backButton}>
                <BackButton width={scaleWidth(40)} height={scaleHeight(40)} />
            </TouchableOpacity>
            <CustomLayout>
                <View style={styles.contentContainer}>
                    <Text style={styles.welcomeText}>
                        Enter OTP
                    </Text>
                    <Text style={styles.subTitle}>
                        Enter the OTP you have received on your Email.
                    </Text>
                    <View style={{ justifyContent: 'center', marginTop: scaleHeight(80) }}>
                        <CodeField
                            ref={ref}
                            {...props}
                            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                            value={value}
                            onChangeText={setValue}
                            cellCount={CELL_COUNT}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }) => (
                                <Text
                                    key={index}
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    onLayout={getCellOnLayoutHandler(index)}
                                >
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            )}
                        />
                    </View>
                </View>

            </CustomLayout>

            <View style={styles.buttonContainer}>
                <Button
                    loading={loading}
                    onPress={() => { handleSendCode() }}
                    title={'Verify'}
                />
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary
    },
    contentContainer: {
        padding: 30,
        flex: 1
    },
    welcomeText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(26),
        color: theme.colors.textHeading,
        marginTop: 15
    },
    subTitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(14),
        color: theme.colors.white,
        marginTop: 5
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
    },

    backButton: {
        marginHorizontal: scaleWidth(20),
        marginTop: scaleHeight(30),
        marginBottom: scaleHeight(20)
    },
    codeFieldRoot: { marginTop: scaleHeight(20) },
    cell: {
        width: scaleWidth(50),
        height: scaleHeight(60),
        lineHeight: 55,
        fontSize: 24,
        backgroundColor: theme.colors.inputBg,
        color: theme.colors.white,
        // borderColor: theme.colors.text,
        borderWidth: 1,
        textAlign: "center",
        borderRadius: 10,
    },
    focusCell: {
        backgroundColor: 'rgba(14, 122, 249, 0.13)',
        borderWidth: 1,
        lineHeight: 55,
        borderRadius: 10,
        width: scaleWidth(50),
        height: scaleHeight(60),
        borderColor: theme.colors.secondary,
    },
});


export default VerifyCode;



