import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import CustomLayout from '../../components/CustomLayout';
import CustomTextInput from '../../components/TextInputComponent';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../styles/responsive';
import { BackButton } from '../../assets/svgs';
import Button from '../../components/ButtonComponent';
import theme from '../../styles/theme';
import fonts from '../../styles/fonts';
import EmailIcon from 'react-native-vector-icons/Zocial';
import { resetNavigation } from '../../utils/resetNavigation';
import { SCREENS } from '../../constant/constants';
import useBackHandler from '../../utils/useBackHandler';
import { createDelayedNavigation } from '../../utils/navigationWithDelay';
import { useDispatch, useSelector } from 'react-redux';
import { sendCode } from '../../redux/AuthSlices/sendCodeSlice';
import { useAlert } from '../../providers/AlertContext';
import { setAuthData } from '../../redux/AuthSlices/setDataSlice';

const ForgetPassword = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { loading } = useSelector((state) => state.sendCode)
    const [form, setForm] = useState({ email: '' });
    const [errors, setErrors] = useState({ userName: '' });
    const handleSendCodeNav = createDelayedNavigation(navigation, SCREENS.VERIFY_CODE)

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.LOGIN)
        return true;
    }

    useBackHandler(handleBackPress)


    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'email') {
            if (value === '') {
                error = 'Email address is required.';
            } else if (!validateEmail(value)) {
                error = 'Please enter a valid email address.';
            }
        }
        setErrors({ ...errors, [name]: error });
    };

    const handleSendCode = () => {
        const { email } = form;
        let valid = true;
        let newErrors = { email: '' };

        if (email === '') {
            newErrors.email = 'Email address is required.';
            valid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address.';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            const payload = {
                email: email
            }
            dispatch(sendCode(payload)).then((result) => {
                if (result?.payload?.success === true) {
                    showAlert("Success", "success", result?.payload?.message)
                    dispatch(setAuthData({
                        email: email,
                        user_id: result?.payload?.result?.id
                    }))
                    handleSendCodeNav();
                }

                else if (result?.payload?.error?.success == false) {
                    showAlert("Error", "error", result?.payload?.message)
                }

                else if (result?.payload?.success === false) {
                    showAlert("Error", "error", result?.payload?.message)
                }

            })
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
                        Forgot Password?
                    </Text>
                    <Text style={styles.subTitle}>
                        Enter your registered email below
                    </Text>
                    <CustomTextInput
                        placeholder={'Email'}
                        identifier={'email'}
                        mainContainer={{ marginTop: scaleHeight(30) }}
                        value={form.email}
                        onValueChange={(value) => handleChange('email', value)}
                        isColorWhite={true}
                        iconComponent={<EmailIcon style={{ marginEnd: 15 }} name="email" size={20} color={theme.colors.lightGrey} />}
                    />

                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                </View>

            </CustomLayout>

            <View style={styles.buttonContainer}>
                <Button
                    loading={loading}
                    onPress={() => {
                        handleSendCode();
                    }}
                    title={'Send OTP'}
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
        width: '60%',
        fontFamily: fonts.fontsType.semiBold,
        fontSize: normalizeFontSize(26),
        color: theme.colors.textHeading,
        marginTop: scaleHeight(30)
    },
    subTitle: {
        fontFamily: fonts.fontsType.medium,
        fontSize: normalizeFontSize(14),
        color: theme.colors.white,
        marginTop: scaleHeight(20)
    },
    forgetText: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: normalizeFontSize(14),
        color: theme.colors.secondary,
        alignSelf: 'center'
    },
    createAccountText1: {
        fontFamily: fonts.fontsType.regular,
        fontSize: normalizeFontSize(16),
        color: theme.colors.white
    },
    createAccountText2: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(16),
        color: theme.colors.secondary,
        marginHorizontal: 5
    },
    createAccountItem: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 30,
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center',
    },
    createAccountView: {
        flex: 1
    },
    forgetPassContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    backButton: {
        marginHorizontal: scaleWidth(20),
        marginTop: scaleHeight(30),
        marginBottom: scaleHeight(20)
    },
    errorText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: normalizeFontSize(14),
        color: theme.colors.error,
        marginTop: 5,
        marginHorizontal: 8
    },
});


export default ForgetPassword;

