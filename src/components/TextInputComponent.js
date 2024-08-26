import React, { useState } from "react";
import { TextInput, View, StyleSheet, Text } from "react-native";
import { normalizeFontSize } from "../styles/responsive";
import theme from "../styles/theme";
import fonts from "../styles/fonts";

const CustomTextInput = ({
    placeholder,
    onValueChange,
    iconComponent,
    customInputStyle,
    customContainerStyle,
    multiline,
    isEditable,
    onPress,
    identifier,
    value,
    inputType,
    leftIcon,
    label,
    mainContainer,
    secureTextEntry,
    placeholderTextStyle,
    customLabelStyle,
    isColorWhite = true,
    autoCapitalize = 'none'
}) => {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (inputText) => {
        setText(inputText);
        onValueChange(inputText, identifier);  // Pass the identifier to the parent component
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <View style={mainContainer}>
            {label && <Text style={[styles.label, customLabelStyle]}>{label}</Text>}
            <View
                style={[
                    styles.container,
                    customContainerStyle,
                    multiline && styles.multilineInput,
                    isFocused && styles.focusedContainer,
                ]}
            >

                {leftIcon}

                <TextInput
                    style={[
                        styles.input,
                        customInputStyle,
                        {
                            textAlignVertical: multiline && "top",
                            // paddingBottom:multiline&& '30%' 
                            color: isFocused && !isColorWhite ? theme.colors.secondary :
                                isColorWhite && isFocused ? theme.colors.white : theme.colors.white
                        },
                    ]}
                    editable={isEditable}
                    onPressIn={onPress}
                    placeholder={placeholder}
                    placeholderTextColor={!isFocused ? theme.colors.placeholderColor : theme.colors.focusedPlaceholder}
                    placeholderTextStyle={styles.placeholderStyle}
                    value={value}
                    onChangeText={handleChange}
                    multiline={multiline}
                    maxLength={multiline && 250}
                    numberOfLines={multiline ? 5 : 1}
                    keyboardType={inputType}
                    secureTextEntry={secureTextEntry}
                    caretHidden={!!onPress}
                    showSoftInputOnFocus={!onPress}
                    selectTextOnFocus={false}
                    onFocus={handleFocus} // Add onFocus handler
                    onBlur={handleBlur} // Add onBlur handler
                    autoCapitalize={autoCapitalize}
                    selectionColor={isFocused ? theme.colors.secondary : theme.colors.transparent} // Change cursor color when focused
                />
                {iconComponent}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.inputBg,
        marginTop: 15,
        height: 45,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.colors.transparent,
    },
    placeholderStyle: {
        fontSize: normalizeFontSize(14),
        fontFamily: fonts.fontsType.medium,
    },
    focusedContainer: {
        backgroundColor: theme.colors.transparent, // Background color when focused
        borderColor: theme.colors.secondary, // Border color when focused
    },
    input: {
        flex: 1,
        color: theme.colors.white,
        fontSize: normalizeFontSize(16),
        fontFamily: fonts.fontsType.medium,
        marginStart: 20,
    },
    multilineInput: {
        height: 142,
    },
    label: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(14),
        color: theme.colors.white,
        marginHorizontal: 10,
        top: 10
    }
});

export default CustomTextInput;
