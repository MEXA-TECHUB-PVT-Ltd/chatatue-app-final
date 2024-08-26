import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { BackButton, LockIcon, SuccessIcon } from '../../assets/svgs';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../styles/responsive';
import CustomLayout from '../../components/CustomLayout';
import CustomTextInput from '../../components/TextInputComponent';
import Button from '../../components/ButtonComponent';
import fonts from '../../styles/fonts';
import theme from '../../styles/theme';
import { SCREENS } from '../../constant/constants';
import { resetNavigation } from '../../utils/resetNavigation';
import useBackHandler from '../../utils/useBackHandler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../providers/AlertContext';
import { resetPassword } from '../../redux/AuthSlices/resetPasswordSlice';

const ResetPassword = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { loading } = useSelector((state) => state.resetPassword)
    const { data } = useSelector((state) => state.setAuthData)
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const refRBSheet = useRef();

    const handlePress = () => {
        resetNavigation(navigation, SCREENS.LOGIN)
        handleSheetClose();
    };

    const handleSheetClose = () => {
        refRBSheet.current.close();
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.VERIFY_CODE)
        return true;
    }

    useBackHandler(handleBackPress)

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        let error = '';
        if (name === 'newPassword') {
            if (value === '') {
                error = 'Password is required.';
            } else if (!validatePassword(value)) {
                error = 'Password must be at least 6 characters long.';
            }
        } else if (name === 'confirmPassword') {
            if (value === '') {
                error = 'Confirm Password is required.';
            }

        }
        setErrors({ ...errors, [name]: error });
    };


    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleResetPassword = () => {
        const { newPassword, confirmPassword } = form;
        let valid = true;
        let newErrors = { newPassword: '', confirmPassword: '' };

        if (newPassword === '') {
            newErrors.newPassword = 'New Password is required.';
            valid = false;
        } else if (!validatePassword(newPassword)) {
            newErrors.newPassword = 'Password must be at least 6 characters long.';
            valid = false;
        }

        if (confirmPassword === '') {
            newErrors.confirmPassword = 'Confirm Password is required';
            valid = false;
        }

        else if (confirmPassword != newPassword) {
            newErrors.confirmPassword = 'Password does not match.';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            const payload = {
                password: newPassword,
                user_id: data?.user_id
            }
            dispatch(resetPassword(payload)).then((result) => {
                if (result?.payload?.success === true) {
                    //showAlert("Success", "success", result?.payload?.message)
                    refRBSheet.current.open()
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
                        Create New Password
                    </Text>
                    <Text style={styles.subTitle}>
                        Create your new password
                    </Text>
                    <CustomTextInput
                        placeholder={'New Password'}
                        identifier={'newPassword'}
                        value={form.newPassword}
                        secureTextEntry={!showPassword}
                        onValueChange={(value) => handleChange('newPassword', value)}
                        mainContainer={{ marginTop: 30 }}
                        iconComponent={
                            <MaterialCommunityIcons
                                onPress={() => { setShowPassword(!showPassword) }}
                                style={{ marginEnd: 15 }}
                                name={!showPassword ? "lock" : "lock-open"} size={24}
                                color={theme.colors.lightGrey} />
                        }
                    />
                    {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
                    <CustomTextInput
                        placeholder={'Confirm Password'}
                        identifier={'confirmPassword'}
                        value={form.confirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        onValueChange={(value) => handleChange('confirmPassword', value)}
                        mainContainer={{ marginTop: 15 }}
                        iconComponent={
                            <MaterialCommunityIcons
                                onPress={() => { setShowConfirmPassword(!showConfirmPassword) }}
                                style={{ marginEnd: 15 }}
                                name={!showConfirmPassword ? "lock" : "lock-open"} size={24}
                                color={theme.colors.lightGrey} />
                        }
                    />
                    {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                </View>

            </CustomLayout>

            <View style={styles.buttonContainer}>
                <Button
                    onPress={() => {
                        handleResetPassword();
                    }}
                    title={'Confirm'}
                />
            </View>

            <CustomBottomSheet
                refRBSheet={refRBSheet}
                heading={"Password Updated"}
                buttonTitle={"Go to Login"}
                handlePress={handlePress}
                iconComponent={
                    <SuccessIcon
                        style={{ marginTop: 10 }}
                        width={58}
                        height={58}
                    />
                }
            />

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
        fontSize: normalizeFontSize(26),
        color: theme.colors.textHeading,
        marginTop: 15,
    },
    subTitle: {
        fontFamily: fonts.fontsType.regular,
        fontSize: normalizeFontSize(14),
        color: theme.colors.white,
        marginTop: 5,
        //textAlign:'center'
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
    errorText: {
        fontFamily: fonts.fontsType.regular,
        fontSize: normalizeFontSize(12),
        color: theme.colors.error,
        marginTop: 5,
        marginHorizontal: 8
    },
});


export default ResetPassword;

