import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, FlatList, ScrollView, Keyboard } from 'react-native';
import Header from '../../../components/Header';
import theme from '../../../styles/theme';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../../styles/responsive';
import fonts from '../../../styles/fonts';
import { profileDetail } from '../../../constant/temp';
import Icon from 'react-native-vector-icons/FontAwesome';
import RulesGoalsComponent from '../../../components/RulesGoalsComponent';
import LabelValue from '../../../components/labelValue';
import InterestList from '../../../components/InterestList';
import ReviewList from '../../../components/ReviewList';
import { useDispatch, useSelector } from 'react-redux';
import { followUser } from '../../../redux/FollowSlices/followUserSlice';
import { useAlert } from '../../../providers/AlertContext';
import Button from '../../../components/ButtonComponent';
import RBSheet from 'react-native-raw-bottom-sheet';
import CustomTextInput from '../../../components/TextInputComponent';
import { CloseIcon } from '../../../assets/svgs';
import StarRating from 'react-native-star-rating-widget';
import CustomStarIcon from '../../../components/CustomStarIcon';
import { addReview } from '../../../redux/ReviewSlices/AddReviewSlice';
import ToggleSwitch from 'toggle-switch-react-native';
import { getProfileDetail } from '../../../redux/ProfileSlices/getProfileDetailSlice';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import { setId, setPreviousScreen } from '../../../redux/generalSlice';

const categories = [
    {
        "id": "c19f9f79-ebfa-4ff6-8e6e-fb64f26d92e1",
        "name": "fitness",
        "created_at": "2024-08-08T12:46:31.886711",
        "updated_at": "2024-08-08T12:46:31.886711"
    },
    {
        "id": "a6c47a0e-f2e3-44f1-9f49-241412a7279e",
        "name": "climbing",
        "created_at": "2024-08-08T15:03:01.477665",
        "updated_at": "2024-08-08T15:03:01.477665"
    }
]

const ViewProfile = ({ navigation }) => {
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.followUser)
    const { loading: reviewLoader } = useSelector((state) => state.addReview)
    const { profileDetail, loading: profileLoader } = useSelector((state) => state.getProfileDetail)
    const previousScreen = useSelector((state) => state.general?.previousScreen)
    const userId = useSelector((state) => state.general?.id)
    const { data } = useSelector((state) => state.general)
    const { user_id } = useSelector((state) => state.auth)
    const { showAlert } = useAlert();
    const { user } = profileDetail ?? {}
    const [selectedCategories, setSelectedCategories] = useState([]);
    const buttonTitle = user?.id === user_id ? "Edit Profile" : "Write Review"
    const profileTitle = user?.id === user_id ? "My Profile" : "Profile"
    const refRBSheet = useRef();
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const handleBackPress = () => {
        resetNavigation(navigation, previousScreen)
        dispatch(setId(data?.clubId))
        dispatch(setPreviousScreen(SCREENS.CLUB_DETAIL))
        return true;
    }
    useBackHandler(handleBackPress)


    useEffect(() => {
        dispatch(getProfileDetail(userId))
    }, [dispatch, userId])

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

    const handleSelectionChange = (selectedCategories) => {
        setSelectedCategories(selectedCategories);
    };

    const handleFollowUser = () => {
        const payload = {
            follower_id: user_id,
            followed_id: user?.id
        }
        dispatch(followUser(payload)).then((result) => {
            const { success, message } = result?.payload
            if (success) {
                showAlert("Success", "success", message)
            } else {
                showAlert("Error", "error", message)
            }
        })
    }

    const handleSheetClose = () => {
        refRBSheet.current.close();
    };

    const handleSheetOpen = () => {
        refRBSheet.current.open();
    };

    const handleAddReview = () => {
        const payload = {
            user_id: user?.id,
            reviewer_id: user_id,
            type: "PROFILE",
            rating: rating,
            comment: comment,
            is_anonymus: isEnabled
        }
        dispatch(addReview(payload)).then((result) => {
            const { success, message } = result?.payload
            if (success) {
                showAlert("Success", "success", message)
                handleSheetClose();
            } else {
                showAlert("Error", "error", message)
                handleSheetClose();
            }
        })
    }

    const renderMeidaImages = ({ item, index }) => (
        <View
            style={[styles.itemContainer, { flex: 0, width: scaleWidth(160), }]}>
            <TouchableOpacity
                style={{
                    height: scaleHeight(160),
                }}>
                <Image source={{ uri: item?.url }} style={[styles.image]} />
            </TouchableOpacity>
        </View>
    );

    const renderBottomSheet = () => {
        return <RBSheet
            ref={refRBSheet}
            openDuration={800}
            customStyles={{
                wrapper: styles.wrapper,
                container: [styles.sheetContainer,
                { backgroundColor: theme.colors.primary, height: keyboardStatus ? '80%' : '50%' }]
            }}
            closeOnPressBack={true}
        >

            <View style={{ padding: 20, flex: 1 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={{
                        fontFamily: fonts.fontsType.bold,
                        fontSize: normalizeFontSize(16),
                        color: theme.colors.white,
                        alignSelf: 'center'
                    }}>
                        Rate a Profile
                    </Text>

                    {/* <TouchableOpacity onPress={handleSheetClose}>
                        <CloseIcon width={24} height={24} />
                    </TouchableOpacity> */}


                </View>

                <View style={styles.starContainer}>
                    <StarRating
                        rating={rating}
                        onChange={setRating}
                        maxStars={5}
                        color={theme.colors.textHeading}
                        starSize={30}
                        StarIconComponent={(props) => <CustomStarIcon {...props} />}
                        style={{
                            marginTop: 15,
                            alignSelf: 'center'
                        }}
                    />
                </View>

                <CustomTextInput
                    identifier={'rate'}
                    value={comment}
                    onValueChange={setComment}
                    multiline={true}
                    label={"Write Review"}
                />

                <View style={{ flexDirection: 'row', top: 15, marginStart: 10 }}>

                    <ToggleSwitch
                        isOn={isEnabled}
                        onColor={'rgba(252, 226, 32, 0.15)'}
                        offColor={'rgba(217, 217, 217, 1)'}
                        onValueChange={toggleSwitch}
                        thumbOnStyle={{ backgroundColor: theme.colors.textHeading }}
                        thumbOffStyle={{ backgroundColor: 'rgba(137, 137, 137, 1)' }}
                        size="medium"
                        onToggle={(isOn) => toggleSwitch(isOn)}
                    />
                    <Text style={styles.settingText}>{"Mark Anonymous"}</Text>
                </View>

                <Button
                    loading={reviewLoader}
                    onPress={handleAddReview}
                    title={"Rate & Review"}
                    customStyle={{
                        width: '80%',
                        marginBottom: 10,
                        marginTop: 30
                    }}
                />
            </View>

        </RBSheet>
    }

    const showLoader = () => {
        return <FullScreenLoader
            loading={profileLoader} />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                isBackIcon={true}
                title={profileTitle}
                isButton={user?.id === user_id ? false : true}
                buttonPress={handleFollowUser}
                loading={loading}
                onBackPress={handleBackPress}
            />
            {
                profileLoader ? showLoader() : <ScrollView>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: user?.profile_image?.url }} style={styles.avatar} />

                        <View style={styles.ratingContainer}>
                            <Text style={styles.name}>{user?.username}</Text>
                            <Icon
                                style={{ alignSelf: 'center', marginStart: 10 }}
                                name={'star'}
                                size={20}
                                color="gold"
                            />
                            <Text style={styles.rating}>{'4.5'}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.age}>{`${user?.age} Years Old`}</Text>
                            <Text style={styles.followers}>{` , 32 Followers`}</Text>
                        </View>
                    </View>

                    <View style={{ padding: 20 }}>

                        <View style={styles.aboutStyle}>

                            <Text style={styles.label}>
                                Meida
                            </Text>

                            <FlatList
                                data={user?.profile_showcase_photos}
                                renderItem={renderMeidaImages}
                                keyExtractor={(item, index) => item + index}
                                numColumns={2}
                                contentContainerStyle={styles.list} />

                        </View>

                        <View style={styles.aboutStyle}>
                            <Text style={styles.label}>
                                Goals
                            </Text>

                        </View>

                        <RulesGoalsComponent
                            data={user?.fitness_goal}
                            iconColor={theme.colors.textHeading}
                            iconName='radiobox-marked'
                            cutsomContainer={{ padding: 0, marginTop: 10 }}
                        />

                        <LabelValue
                            label={'Expereince'}
                            value={user?.running_experience_level?.level}
                        />

                        <LabelValue
                            label={'Social Preference'}
                            value={user?.social_preference?.preference}
                        />

                        <LabelValue
                            label={'Time of Running'}
                            value={user?.running_time?.time_interval}
                        />

                        <LabelValue
                            label={'Social Links'}
                            value={"Facebook"}
                        />

                        <View style={{ marginTop: 10 }}>
                            <InterestList
                                interests={categories}
                                onSelectionChange={handleSelectionChange}
                                test={true}
                            />
                        </View>

                        <ReviewList />

                    </View>
                    <Button
                        onPress={handleSheetOpen}
                        title={buttonTitle}
                        customStyle={{ backgroundColor: theme.colors.textHeading, width: '70%', marginBottom: 20 }}
                        textCustomStyle={{ color: theme.colors.black }}
                    />
                </ScrollView>
            }

            {renderBottomSheet()}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    imageContainer: {
        alignItems: 'center',
        margin: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    starContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    name: {
        fontSize: normalizeFontSize(16),
        fontFamily: fonts.fontsType.bold,
        color: '#BEC5D1'
    },
    age: {
        fontSize: normalizeFontSize(14),
        fontFamily: fonts.fontsType.bold,
        color: '#BEC5D1'
    },
    followers: {
        fontSize: normalizeFontSize(16),
        fontFamily: fonts.fontsType.bold,
        color: theme.colors.textHeading
    },
    rating: {
        fontSize: normalizeFontSize(12),
        fontFamily: fonts.fontsType.medium,
        color: theme.colors.labelColors,
        marginHorizontal: 5,
        alignSelf: 'center'
    },
    aboutStyle: {
        marginBottom: scaleHeight(5),
        marginTop: scaleHeight(10),
    },
    itemContainer: {
        width: scaleWidth(160),
        flex: 1,
        margin: 10,
        borderRadius: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    list: {
        justifyContent: 'space-between',
        marginHorizontal: 10
    },
    label: {
        color: theme.colors.textHeading,
        fontSize: normalizeFontSize(16),
        fontFamily: fonts.fontsType.medium,

    },
    labelValueStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scaleHeight(5),
        marginTop: scaleHeight(10),
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
    settingText: {
        fontSize: scaleHeight(14),
        fontFamily: fonts.fontsType.semiBold,
        marginRight: 10,
        flex: 1,
        color: theme.colors.white,
        marginLeft: 15
    },
});

export default ViewProfile;
