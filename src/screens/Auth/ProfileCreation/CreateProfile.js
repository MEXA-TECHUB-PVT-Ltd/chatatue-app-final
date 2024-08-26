import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView, Keyboard, ToastAndroid } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { fullNameSectionImg, section2Img, section3Img } from '../../../assets/images';
import fonts from '../../../styles/fonts';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../../styles/responsive';
import theme from '../../../styles/theme';
import CustomTextInput from '../../../components/TextInputComponent';
import { BackButton, CloseIcon } from '../../../assets/svgs';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import CustomLayout from '../../../components/CustomLayout';
import Button from '../../../components/ButtonComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Cross from 'react-native-vector-icons/Entypo'
import RBSheet from 'react-native-raw-bottom-sheet';
import GoalsItem from '../../../components/GoalsItem';
import OptionSelector from '../../../components/OptionSelector';
import InterestList from '../../../components/InterestList';
import { useDispatch, useSelector } from 'react-redux';
import { getExperiences } from '../../../redux/AuthSlices/getExperiencesSlice';
import { getRunningTimes } from '../../../redux/AuthSlices/getRunningTimesSlice';
import { getSocialPreferences } from '../../../redux/AuthSlices/getSocialPreferencesSlice';
import { getSocialLinks } from '../../../redux/AuthSlices/getSocialLinksSlice';
import { getCategories } from '../../../redux/AuthSlices/getCategoriesSlices';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from '../../../utils/cameraPermission';
import { useAlert } from '../../../providers/AlertContext';
import { updateProfile } from '../../../redux/AuthSlices/updateProfileSlice';
import { resolvePlugin } from '@babel/core';
import { createSocialLinks } from '../../../redux/AuthSlices/createSocialLinksSlice';
import { login } from '../../../redux/AuthSlices/signInSlice';
import { createGoals } from '../../../redux/AuthSlices/createGoalsSlice';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { uploadImage } from '../../../redux/cloudinarySlice';
import { getFcmToken } from '../../../configs/firebaseConfig';

const CreateProfile = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { loading } = useSelector((state) => state.createProfile)
    const { loading: socialLinkLoader } = useSelector((state) => state.createSocialLinks)
    const { experiences } = useSelector((state) => state.experiences)
    const { socialPreferences } = useSelector((state) => state.socialPreferences)
    const { runningTimes } = useSelector((state) => state.runningTimes)
    const { socialLinks: socialLinkData } = useSelector((state) => state.socialLinks)
    const { categories } = useSelector((state) => state.categories)
    const { user_id } = useSelector((state) => state.signup)
    const { data } = useSelector((state) => state.setAuthData)
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [mediaImages, setMediaImages] = useState([]);
    const socialMediaLinks = [
        { identifier: 'facebook', labelName: 'Facebook', id: 1 },
        { identifier: 'instagram', labelName: 'Instagram', id: 2 },
        { identifier: 'twitter', labelName: 'Twitter', id: 3 },
        { identifier: 'tiktok', labelName: 'Tiktok', id: 4 }
    ];
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        instagram: '',
        twitter: '',
        tiktok: ''
    });
    const [age, setAge] = useState('0');
    const [type, setType] = useState('default');
    const [currentStep, setCurrentStep] = useState(0);
    const [sheetView, setSheetView] = useState(0);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [loginLoader, setLoginLoader] = useState(false);
    const [goalsItem, setGoalsItem] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [text, setText] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({});
    const refRBSheet = useRef();
    const buttonTitle = currentStep == 10 ? "Create Profile" : "Continue"
    const [deviceToken, setDeviceToken] = useState(null);


    useEffect(() => {
        getFcmToken().then(token => {
            setDeviceToken(token)
        });
    }, []);


    useEffect(() => {
        const fetchAllAPIsData = async () => {
            try {
                await Promise.all([
                    dispatch(getExperiences()),
                    dispatch(getRunningTimes()),
                    dispatch(getSocialPreferences()),
                    // dispatch(getSocialLinks()),
                    // dispatch(getCategories())
                    dispatch(getCategories({ isCategory: false }))
                ]);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchAllAPIsData();
    }, [dispatch]);


    const handleSelectionChange = (selectedCategories) => {
        setSelectedCategories(selectedCategories);
    };


    const handleSelect = (category, item) => {
        setSelectedOptions((prevOptions) => ({
            ...prevOptions,
            [category]: item,
        }));
    };

    const handleValueChange = (identifier, value) => {
        setSocialLinks(prevLinks => ({
            ...prevLinks,
            [identifier]: value
        }));
    };

    // useEffect(() => {
    //     socialLinkData?.socialLinks?.forEach(link => {
    //         const platform = link.platform_name.toLowerCase();
    //         if (socialLinks.hasOwnProperty(platform)) {
    //             const platformLink = link.platform_link;
    //             handleValueChange(platform, platformLink);
    //         }
    //     });

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [socialLinkData]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardStatus(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardStatus(false);
            }
        );
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (loginLoader) {
            const timer = setTimeout(() => {
                setLoginLoader(false);
            }, 5000); // 3000 milliseconds = 3 seconds

            // Cleanup the timer when the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [loginLoader]);


    const addGoal = () => {
        if (text.trim()) {
            setGoalsItem([...goalsItem, text]);
            const payload = {
                goal: text
            }
            dispatch(createGoals(payload)).then((result) => {
                if (result?.payload.success === true) {
                    showAlert("Success", "success", result?.payload?.message)
                } else if (result?.payload.success === false) {
                    showAlert("Error", "error", result?.payload?.message)
                }
            })
            setText('');
            handleSheetClose()

        }
    };

    const addMore = () => {
        if (text.trim()) {
            setGoalsItem([...goalsItem, text]);
            const payload = {
                goal: text
            }
            dispatch(createGoals(payload)).then((result) => {
                if (result?.payload.success === true) {
                    ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
                } else if (result?.payload.success === false) {
                    ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
                    // showAlert("Error", "error", result?.payload?.message)
                }
            })
            setText('');
        }
    };

    const removeItem = (index) => {
        const newItems = goalsItem?.filter((_, i) => i !== index);
        setGoalsItem(newItems);
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.LOGIN)
        return true;
    }

    useBackHandler(handleBackPress)

    const handleMinusPress = () => {
        setAge(prevAge => (parseInt(prevAge, 10) > 0 ? (parseInt(prevAge, 10) - 1).toString() : '0'));
    };

    const handlePlusPress = () => {
        setAge(prevAge => (parseInt(prevAge, 10) + 1).toString());
    };

    const pickImageFromGallery = (type = "default") => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            //cropping: true,
            //cropperCircleOverlay: true,
        }).then(image => {
            handleSheetClose();

            dispatch(uploadImage(image.path)).then((result) => {
                if (result?.payload) {
                    // Assuming result.payload contains the URL of the uploaded image
                    const uploadedImageUrl = result.payload;

                    if (type === "mediaImages") {
                        // Update the mediaImages state with the new image URL
                        setMediaImages([...mediaImages, uploadedImageUrl]);
                    } else {
                        // Update the selectedImage state with the new image URL
                        setSelectedImage(uploadedImageUrl);
                    }
                }
            }).catch(error => {
                console.error('Error uploading image:', error);
            });

            // if (type === "mediaImages") {
            //     setMediaImages([...mediaImages, image.path]);
            //     return true
            // }
            // setSelectedImage(image.path);
        }).catch(error => {
            console.log('Error picking image: ', error);
        });
    };

    const pickImageFromCamera = (type = "default") => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            //cropping: true,
            //cropperCircleOverlay: true,
        }).then(image => {
            handleSheetClose();

            dispatch(uploadImage(image.path)).then((result) => {
                if (result?.payload) {
                    // Assuming result.payload contains the URL of the uploaded image
                    const uploadedImageUrl = result.payload;

                    if (type === "mediaImages") {
                        // Update the mediaImages state with the new image URL
                        setMediaImages([...mediaImages, uploadedImageUrl]);
                    } else {
                        // Update the selectedImage state with the new image URL
                        setSelectedImage(uploadedImageUrl);
                    }
                }
            }).catch(error => {
                console.error('Error uploading image:', error);
            });


            // dispatch(uploadImage(image.path)).then((result) => {

            //     console.log(result?.payload)

            // });
            // if (type === "mediaImages") {
            //     setMediaImages([...mediaImages, image.path]);
            //     return true
            // }
            // setSelectedImage(image.path);
        }).catch(error => {
            console.log('Error capturing image: ', error);
        });
    };

    const saveSocialLinks = () => {
        // Loop through each platform and dispatch the action if the link is not empty
        Object.keys(socialLinks).forEach(platform => {
            const platform_link = socialLinks[platform];
            if (platform_link) {
                const payload = {
                    user_id,
                    platform_name: platform.charAt(0).toUpperCase() + platform.slice(1), // Capitalize platform name
                    platform_link
                };

                dispatch(createSocialLinks(payload)).then((result) => {
                    if (result?.payload?.success === true) {
                        // Handle success
                        console.log(`${platform} link saved successfully`);
                        setCurrentStep(prevStep => prevStep + 1);
                    } else if (result?.payload?.success === false) {
                        // Handle error
                        console.log(`Error saving ${platform} link:`, result?.payload?.message);
                        // Optionally, show an alert here
                        // showAlert("Error", "error", result?.payload?.message);
                    }
                });
            }
        });
    };

    const handleNextStep = () => {
        if (currentStep == 10) {
            handleCreateProfile();
            return
        }
        // if (currentStep === 9) {
        //     saveSocialLinks()
        //     return
        // }

        setCurrentStep(prevStep => prevStep + 1);

    };

    const handlePreviousStep = () => {
        if (currentStep === 0) {
            handleBackPress();
            return
        }
        setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
    };

    const handleSheetClose = () => {
        refRBSheet.current.close();
    };

    const handleSheetOpen = () => {
        refRBSheet.current.open();
    };

    const addImage = () => {
        setSheetView(0)
        setType("mediaImages")
        handleSheetOpen()
    };

    const removeImage = (index) => {
        const newImages = [...mediaImages];
        newImages.splice(index, 1);
        setMediaImages(newImages);
    };

    const completeProfileSection = () => {

        return (
            <View style={styles.sectionContainer}>

                <Image style={styles.image} source={fullNameSectionImg} />
                <Text style={styles.heading}>
                    COMPLETE PROFILE
                </Text>

                <Text style={[styles.heading, { fontSize: normalizeFontSize(14), color: theme.colors.lightGrey, width: '90%' }]}>
                    Before we move next we need to have more info about you.
                </Text>

            </View>
        )

    }

    const fullNameSection = () => {

        return (
            <View style={styles.sectionContainer}>

                <Image style={styles.image} source={section2Img} />
                <Text style={styles.heading}>
                    WHAT IS YOUR FULL NAME?
                </Text>

                <CustomTextInput
                    placeholder={"Enter your name"}
                    identifier={'full_name'}
                    value={name}
                    onValueChange={setName}
                    customContainerStyle={styles.customInput}
                    autoCapitalize={'sentences'}
                />

            </View>
        )

    }

    const setAgeSection = () => {

        return (
            <View style={styles.sectionContainer}>

                <Image style={styles.image} source={section3Img} />
                <Text style={styles.heading}>
                    SET YOUR AGE
                </Text>

                <TouchableOpacity
                    onPress={() => { handleMinusPress() }}
                    style={[styles.toggleStyle, { left: '25%' }]}>
                    <AntDesign name='minuscircle' size={28} color={theme.colors.toggleColor} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { handlePlusPress() }}
                    style={styles.toggleStyle}>
                    <AntDesign name='pluscircle' size={28} color={theme.colors.toggleColor} />
                </TouchableOpacity>

                <CustomTextInput
                    placeholder={"0"}
                    identifier={'age'}
                    value={age}
                    onValueChange={(text) => setAge(text)}
                    inputType={"number-pad"}
                    customContainerStyle={[styles.customInput,
                    {
                        width: '15%',
                        borderRadius: 10,
                        alignSelf: 'center',
                    }]}
                    customInputStyle={{
                        marginStart: 0,
                        textAlign: 'center',
                    }}
                />

            </View>
        )

    }

    const addPhotoSection = () => {

        return (
            <View style={styles.sectionContainer}>

                <TouchableOpacity
                    onPress={() => {
                        setSheetView(0)
                        setType("default")
                        handleSheetOpen()
                    }}
                    style={styles.imageContainer}>
                    {selectedImage?.secure_url ? (
                        <Image source={{ uri: selectedImage?.secure_url }} style={styles.selectedImage} />
                    ) : (
                        <Icon name="camera-alt" type="material" size={40} color={theme.colors.placeholderColor} />
                    )}
                </TouchableOpacity>

                {selectedImage?.secure_url && <Button
                    onPress={() => {
                        setType("default")
                        handleSheetOpen()
                    }}
                    title={'Change'}
                    customStyle={styles.changeButton}
                    textCustomStyle={{ color: theme.colors.placeholderColor }}
                />}

                <Text style={styles.heading}>
                    ADD YOUR BEST PHOTO
                </Text>
            </View>
        )

    }

    const addMediaSection = () => {

        return (
            <View>

                <Text style={styles.heading}>
                    Add Media
                </Text>

                <Text style={[styles.heading, {
                    fontSize: normalizeFontSize(14),
                    color: theme.colors.lightGrey,
                    width: '70%',
                    marginTop: scaleHeight(10),
                }]}>
                    This will be shown in your Profile as a Grid.
                </Text>

                <View style={styles.mediaImageContainer}>
                    {mediaImages?.map((image, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri: image?.secure_url }} style={styles.mediaImage} />
                            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                                <Cross name='cross' size={16} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={addImage}>
                        <Cross name='plus' size={24} color={"#888888"} />
                    </TouchableOpacity>
                </View>


            </View>
        )

    }

    const addGoalsSection = () => {

        return (
            <View>

                <Text style={styles.heading}>
                    Add your Goals
                </Text>

                <Text style={[styles.heading, {
                    fontSize: normalizeFontSize(14),
                    color: theme.colors.lightGrey,
                    width: '70%',
                    marginTop: scaleHeight(10),
                }]}>
                    This will be shown in your Profile as a goals.
                </Text>

                <View style={{ marginTop: 20 }}>
                    {
                        goalsItem?.map((item, index) => {
                            return <View key={index}>
                                <GoalsItem
                                    item={item}
                                    onRemove={() => removeItem(index)}
                                />
                            </View>
                        })
                    }

                    <Button
                        onPress={() => {
                            setSheetView(1)
                            handleSheetOpen()
                        }}
                        title={"Add Goal"}
                        customStyle={styles.addGoalStyle}
                        textCustomStyle={{
                            color: '#888888',
                        }}
                    />

                </View>


            </View>
        )

    }

    const selectExperienceSection = () => {

        return (
            <View>

                <Text style={styles.heading}>
                    Select your Experience
                </Text>

                <Text style={[styles.heading, {
                    fontSize: normalizeFontSize(14),
                    color: theme.colors.lightGrey,
                    width: '80%',
                    marginTop: scaleHeight(10),
                }]}>
                    This will be shown in your Profile.
                </Text>
                <View style={{ marginTop: 20 }}>
                    <OptionSelector
                        items={experiences?.experienceLevels}
                        onSelect={(item) => handleSelect('experiences', item)}
                        displayKey={"level"}
                    />
                </View>
            </View>
        )

    }

    const socialPreferencesSection = () => {

        return (
            <View>

                <Text style={[styles.heading, { width: '75%' }]}>
                    What is your Social preference
                </Text>
                <View style={{ marginTop: 40 }}>
                    <OptionSelector
                        items={socialPreferences?.socialPreferences}
                        onSelect={(item) => handleSelect('socialPreferences', item)}
                        displayKey={"preference"}
                    />
                </View>
            </View>
        )

    }

    const runningTimeSection = () => {

        return (
            <View>

                <Text style={[styles.heading, { width: '95%' }]}>
                    ADD Times of running
                </Text>

                <View style={{ marginTop: 40 }}>
                    <OptionSelector
                        items={runningTimes?.socialPreferences}
                        onSelect={(item) => handleSelect('runningTimes', item)}
                        displayKey={"time_interval"}
                    />
                </View>
            </View>
        )

    }

    const socialLinksSection = () => {

        return (
            <View>

                <Text style={[styles.heading, { width: '80%' }]}>
                    ADD SOCIAL LINKS
                </Text>
                <View style={{ marginTop: 30 }}>
                    <CustomLayout>
                        {

                            socialMediaLinks?.map((item, index) => {

                                return <View key={item?.id}>
                                    <CustomTextInput
                                        identifier={item?.identifier}
                                        label={item?.labelName}
                                        value={socialLinks[item.identifier]}
                                        onValueChange={(value) => handleValueChange(item.identifier, value)}
                                    />
                                </View>

                            })

                            // socialLinkData?.socialLinks?.map((item, index) => {

                            //     return <View key={item?.id}>
                            //         <CustomTextInput
                            //             identifier={item?.platform_name?.toLowerCase()}
                            //             label={item?.platform_name}
                            //             value={socialLinks[item?.platform_name?.toLowerCase()]}
                            //             onValueChange={(value) => handleValueChange(item.platform_name?.toLowerCase(), value)}
                            //         />
                            //     </View>

                            // })
                        }
                    </CustomLayout>
                </View>
            </View>
        )

    }

    const selectInterestsSection = () => {

        return (
            <View>

                <Text style={[styles.heading, { width: '55%' }]}>
                    Pick your Top interests
                </Text>
                <View style={{ marginTop: 30 }}>
                    <InterestList
                        // interests={categories?.category}
                        interests={categories?.subCategory}
                        onSelectionChange={handleSelectionChange} />
                </View>
            </View>
        )

    }

    const photoSelectorView = (type) => {

        return (
            <View>
                <Button
                    onPress={() => { pickImageFromCamera(type) }}
                    title={"Capture from camera"}
                    icon={<Icon name="camera-alt" type="material" size={24} color={theme.colors.greyShade} />}
                    customStyle={styles.button}
                    textCustomStyle={{ color: theme.colors.greyShade }}
                    customIconStyle={styles.customIconStyle}
                />

                <Button
                    onPress={() => { pickImageFromGallery(type) }}
                    title={"Upload from gallery"}
                    icon={<Icon name="insert-photo" type="material" size={24} color={theme.colors.greyShade} />}
                    customStyle={styles.button}
                    textCustomStyle={{ color: theme.colors.greyShade }}
                    customIconStyle={styles.customIconStyle}
                />

                <Button
                    onPress={handleSheetClose}
                    title={"Cancel"}
                    customStyle={[styles.button, { backgroundColor: theme.colors.transparent, marginBottom: 0 }]}
                    textCustomStyle={{ color: theme.colors.white }}
                />
            </View>
        )

    }

    const addGoalsItemView = () => {

        return (
            <View style={{ padding: 20, flex: 1 }}>

                <View style={{ flexDirection: 'row' }}>

                    <Text style={{
                        fontFamily: fonts.fontsType.bold,
                        fontSize: normalizeFontSize(16),
                        color: theme.colors.white,
                        flex: 1
                    }}>
                        ADD GOAL
                    </Text>

                    <TouchableOpacity onPress={handleSheetClose}>
                        <CloseIcon width={24} height={24} />
                    </TouchableOpacity>


                </View>

                <CustomTextInput
                    identifier={'add_goal'}
                    value={text}
                    onValueChange={setText}
                    multiline={true}
                />

                <View style={{ flexDirection: 'row', marginTop: scaleHeight(10), marginBottom: scaleHeight(30) }}>
                    <Button
                        onPress={() => { addMore() }}
                        title={"ADD MORE"}
                        customStyle={{
                            width: '48%',
                            backgroundColor: theme.colors.textHeading,
                        }}
                        textCustomStyle={{ color: theme.colors.black }}
                    />

                    <Button
                        onPress={() => { addGoal() }}
                        title={"CONFIRM"}
                        customStyle={{ width: '48%', marginHorizontal: '2%', backgroundColor: theme.colors.textHeading }}
                        textCustomStyle={{ color: theme.colors.black }}
                    />

                </View>
            </View>
        )

    }

    const renderSheetView = (type) => {
        switch (sheetView) {
            case 0:
                return (
                    photoSelectorView(type)
                );
            case 1:
                return (
                    addGoalsItemView()
                );
            default:
                return (
                    photoSelectorView(type)
                );
        }

    }

    const renderBottomSheet = (type) => {
        return <RBSheet
            ref={refRBSheet}
            openDuration={800}
            customStyles={{
                wrapper: styles.wrapper,
                container: [styles.sheetContainer,
                { backgroundColor: theme.colors.primary }, sheetView === 1 && { height: keyboardStatus ? '60%' : '37%' }]
            }}
        >

            {renderSheetView(type)}

        </RBSheet>
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    completeProfileSection()
                );
            case 1:
                return (
                    fullNameSection()
                );
            case 2:
                return (
                    setAgeSection()
                );
            case 3:
                return (
                    addPhotoSection()
                );
            case 4:
                return (
                    addMediaSection()
                );
            case 5:
                return (
                    addGoalsSection()
                );
            case 6:
                return (
                    selectExperienceSection()
                );
            case 7:
                return (
                    socialPreferencesSection()
                );
            case 8:
                return (
                    runningTimeSection()
                );
            case 9:
                return (
                    socialLinksSection()
                );
            case 10:
                return (
                    selectInterestsSection()
                );
            default:
                return null;
        }
    };

    const handleCreateProfile = async () => {

        try {
            const granted = await requestLocationPermission();
            if (granted) {

                const getPosition = () => new Promise((resolve, reject) => {
                    Geolocation.getCurrentPosition(resolve, reject);
                });

                const { coords: { latitude, longitude } } = await getPosition();


                const mediaImagesData = mediaImages.map((image, index) => ({
                    url: image?.secure_url,  // Use the image URL or path
                    public_id: image?.public_id  // Generate a unique public_id for each image
                }));

                const profileImage = {
                    url: selectedImage?.secure_url,  // Use the image URL or path
                    public_id: selectedImage?.public_id  // Generate a unique public_id for each image
                }

                const categoryIds = "{" + selectedCategories.join(",") + "}";

                // Create the JSON payload
                const payload = {
                    profile_image: profileImage,
                    profile_showcase_photos: mediaImagesData,
                    username: name,
                    age: age,
                    running_experience_level_id: selectedOptions?.experiences != null && selectedOptions?.experiences,
                    social_preferences_id: selectedOptions?.socialPreferences != null && selectedOptions?.socialPreferences,
                    running_time_id: selectedOptions?.runningTimes != null && selectedOptions?.runningTimes,
                    interest_ids: categoryIds,
                    lat: latitude,
                    long: longitude
                };

                dispatch(updateProfile(payload)).then((result) => {
                    if (result?.payload?.success === true) {
                        setLoginLoader(true)
                        const loginCredentials = {
                            email: data?.email,
                            password: data?.password,
                            device_id: deviceToken,
                            signup_type: data?.signup_type
                        }

                        dispatch(login(loginCredentials)).then((result) => {
                            setLoginLoader(true)
                            console.log('login------>', result?.payload?.message)
                        })

                    } else if (result?.payload?.success === false) {

                    }
                })

            }

            else {
                console.log('Permission denied!');
                showAlert("Error", "error", "Your location permission is not enabled.")
            }
        }
        catch (error) {
            console.log('try catch error---->:', error);
            showAlert("Error", "error", `${error?.message} Enable your location.`)
        }
    }

    if (loginLoader) {
        return <FullScreenLoader loading={loginLoader} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => { handlePreviousStep() }} style={styles.backButton}>
                <BackButton width={scaleWidth(40)} height={scaleHeight(40)} />
            </TouchableOpacity>
            <CustomLayout>
                {renderStep()}
            </CustomLayout>
            <Button
                loading={loading || socialLinkLoader}
                onPress={handleNextStep}
                title={buttonTitle}
                customStyle={{ marginBottom: 10 }}
            />
            {renderBottomSheet(type)}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.primary
    },
    image: {
        width: scaleWidth(140),
        height: scaleHeight(140),
        alignSelf: 'center'
    },
    heading: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(24),
        color: theme.colors.textHeading,
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: scaleHeight(30),
        width: '70%'
    },
    sectionContainer: {
        marginTop: scaleHeight(50)
    },
    customInput: {
        marginTop: scaleHeight(30)
    },
    ageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: scaleHeight(30),
    },
    toggleStyle: {
        position: 'absolute',
        top: '88%',
        right: '27%'
    },
    imageContainer: {
        width: 120,
        height: 120,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'center'
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    changeButton: {
        backgroundColor: theme.colors.white,
        borderRadius: 10,
        width: '25%',
        marginBottom: 0,
        height: 35
    },
    button: {
        width: '85%',
        marginBottom: 0,
        marginTop: scaleHeight(20),
        backgroundColor: '#656565',
        borderRadius: 10,
        height: scaleHeight(55)
    },
    wrapper: {
        backgroundColor: 'rgba(128, 128, 128, 0.80)',
    },
    sheetContainer: {
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        width: '100%',
        alignSelf: 'center',
    },
    customIconStyle: {
        marginRight: 5,
        left: scaleWidth(0)
    },
    mediaImageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: scaleHeight(30),
    },
    imageWrapper: {
        position: 'relative',
        margin: 5,
    },
    mediaImage: {
        width: 100,
        height: 110,
        borderRadius: 20,
    },
    removeButton: {
        position: 'absolute',
        top: 2,
        right: 3,
        backgroundColor: 'red',
        borderRadius: 15,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        width: 100,
        height: 110,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#888888',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderStyle: 'dashed'

    },
    addGoalStyle: {
        width: '70%',
        backgroundColor: theme.colors.transparent,
        borderColor: '#888888',
        borderStyle: 'dashed',
        borderWidth: 2,
        marginTop: 30
    }
});

export default CreateProfile;
