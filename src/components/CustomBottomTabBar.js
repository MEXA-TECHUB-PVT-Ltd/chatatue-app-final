import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Platform } from 'react-native';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../styles/responsive';
import theme from '../styles/theme';
import fonts from '../styles/fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const CustomBottomTabBar = ({ state, descriptors, navigation, icons }) => {
    const { routes } = state;
    

    return (
        <View style={[styles.tabContainer]}>
            {routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.title !== undefined ? options.title : route.name;
                //const Icon = options.icon;
                const isFocused = state.index === index;
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[styles.tabButton, isFocused && styles.selectedTab]}
                    >
                        {/* Icon */}
                        <View style={{ position: 'relative' }}>
                            <Icon name={icons[index]} 
                            size={30} color={isFocused
                                ? theme.colors.secondary
                                : theme.colors.labelColors} />
                            {/* <Image
                                resizeMode='contain'
                                style={{
                                    height: scaleHeight(16),
                                    width: scaleWidth(16),
                                    alignSelf: 'center',
                                    tintColor: isFocused
                                        ? theme.colors.white
                                        : theme.inactive,
                                }}
                                source={icons[index]} /> */}

                        </View>
                        {/* <Text style={[styles.tabText, {
                            color: isFocused
                                ? theme.white
                                : theme.inactive,
                        }]}>{label}</Text> */}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        height: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: Platform.OS === 'ios' ? 15 : 0,
    },
    tabButton: {
        borderRadius: 30,
        paddingHorizontal: 10,
        height: 40,
        justifyContent:'center'
    },
    tabText: {
        alignSelf: 'center',
        color: theme.colors.secondary,
        fontFamily: fonts.fontsType.regular,
        fontSize: normalizeFontSize(10),
        marginTop: scaleHeight(10)
    },

});

export default CustomBottomTabBar;
