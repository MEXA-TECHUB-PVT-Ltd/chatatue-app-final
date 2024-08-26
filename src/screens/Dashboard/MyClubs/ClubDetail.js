import React, { Component, useEffect, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Dimensions, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../../../components/Header';
import theme from '../../../styles/theme';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../../styles/responsive';
import ProfileComponent from '../../../components/ProfileComponent';
import fonts from '../../../styles/fonts';
import RulesGoalsComponent from '../../../components/RulesGoalsComponent';
import InterestList from '../../../components/InterestList';
import { resetNavigation } from '../../../utils/resetNavigation';
import useBackHandler from '../../../utils/useBackHandler';
import { SCREENS } from '../../../constant/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getClubDetail } from '../../../redux/ClubCreation/getClubDetailSlice';
import FullScreenLoader from '../../../components/FullScreenLoader';
import ActionSheet from '../../../components/ActionSheet';
import Button from '../../../components/ButtonComponent';
import { setData, setId, setPreviousScreen } from '../../../redux/generalSlice';
import { deleteClub } from '../../../redux/ClubCreation/deleteClubSlice';
import { useAlert } from '../../../providers/AlertContext';
import { createDelayedNavigation } from '../../../utils/navigationWithDelay';
import CustomModal from '../../../components/CustomModal';
import { warningImg } from '../../../assets/images';
import ClubMember from '../../../components/ClubMember';
import { openPaymentSheet } from '../../../utils/paymentUtils';
import { sendMembershipRequest } from '../../../redux/ManageClub/sendMembershipRequestSlice';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_KEY } from '@env'
import { getClubMembers } from '../../../redux/ManageClub/getClubMembersSlice';
import { getAllClubPostFeeds } from '../../../redux/ClubCreation/getAllClubPostFeedsSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const goals = [
    { text: 'Swimming' },
    { text: 'Travelling' },
    { text: 'Running' },
];


const members = [
    { name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/72.jpg' },
    // Add more members as needed
];


const ClubDetail = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { clubDetail, loading } = useSelector((state) => state.getClubDetail)
    const { clubPosts } = useSelector((state) => state.getAllClubPostFeeds);
    const { clubMembers } = useSelector((state) => state.getClubMembers)
    const { loading: deleteLoader } = useSelector((state) => state.deleteClub)
    const { user_id } = useSelector((state) => state.auth)
    const clubId = useSelector((state) => state.general?.id)
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const refRBSheet = useRef();
    const backToDashboard = createDelayedNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.CLUBS })
    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.CLUBS })
        return true;
    }

    useBackHandler(handleBackPress)

    const handleUpdateClub = () => {
        dispatch(setId(clubId))
        dispatch(setPreviousScreen(SCREENS.CLUB_DETAIL))
        resetNavigation(navigation, SCREENS.UPDATE_CLUB)
        refRBSheet.current.close()
    };

    const handleHighlightDetail = (highlightId) => {
        dispatch(setId(highlightId))
        dispatch(setPreviousScreen(SCREENS.CLUB_DETAIL))
        resetNavigation(navigation, SCREENS.HIGHLIGHT_CLUB_DETAIL)
    };

    const handleClubPostDetail = (postId) => {
        dispatch(setId(postId))
        dispatch(setPreviousScreen(SCREENS.CLUB_DETAIL))
        resetNavigation(navigation, SCREENS.CLUB_POST_DETAIL)
    };

    const handleViewProfile = () => {
        dispatch(setId(clubDetail?.creator?.id))
        dispatch(setData({ clubId }))
        dispatch(setPreviousScreen(SCREENS.CLUB_DETAIL))
        resetNavigation(navigation, SCREENS.VIEW_PROFILE)
    }

    const handleDeleteClub = () => {
        dispatch(deleteClub(clubId)).then((result) => {
            if (result?.payload?.success === true) {
                showAlert("Success", "success", result?.payload?.message)
                backToDashboard();
            } else if (result?.payload?.error?.success === false) {
                showAlert("Error", "error", result?.payload?.error?.message)
            }

        })
    };

    const handleOpenModal = () => {
        setModalVisible(true);
        refRBSheet.current.close()
    };

    const sheetItems = [
        { id: 1, label: 'Update Club', onPress: handleUpdateClub },
        { id: 2, label: 'Delete Club', onPress: handleOpenModal }
    ];

    const handleManageMembers = () => {
        dispatch(setId(clubId))
        dispatch(setPreviousScreen(SCREENS.CLUB_DETAIL))
        resetNavigation(navigation, SCREENS.MANAGE_MEMBERS)
    };


    const handleClubFeeds = () => {
        dispatch(setId(clubId))
        const data = {
            clubId,
            userId: clubDetail?.user_id
        }
        dispatch(setData(data))
        dispatch(setPreviousScreen(SCREENS.CLUB_DETAIL))
        resetNavigation(navigation, SCREENS.CLUB_FEEDS)
    };

    const handleJoinClub = () => {
        const membershipRequest = {
            club_id: clubId,
            user_id: user_id
        }
        dispatch(sendMembershipRequest(membershipRequest)).then((result) => {
            const { success, message } = result?.payload
            if (success) {
                showAlert("Success", "success", message)
            } else if (!success) {
                showAlert("Error", "error", message)
            }
        })
    }

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        dispatch(getClubDetail(clubId))
        dispatch(getClubMembers({ clubId }))
        dispatch(getAllClubPostFeeds({ page: 1, limit: 10, searchPayload: { clubId: clubId } }));

    }, [dispatch, clubId])

    const renderItem = ({ item, index }) => (
        <View style={[styles.carouselItem]}>
            <Image source={{ uri: item?.url }} style={styles.carouselImage} resizeMode="contain" />
        </View>
    );

    const handleSelectionChange = (selectedCategories) => {
        setSelectedCategories(selectedCategories);
    };

    const showLoader = () => {
        return <FullScreenLoader
            loading={loading} />;
    };


    return (
        <StripeProvider publishableKey={"pk_test_51Ml3wJGui44lwdb4K6apO4rnFrF2ckySwM1TfDcj0lVdSekGOVGrB1uHNlmaO7wZPxwHfRZani73KlHQKOiX4JmK00E0l7opJO"}>
            <SafeAreaView style={styles.container}>
                <Header
                    onBackPress={handleBackPress}
                    isBackIcon={true}
                    title={"Club Detail"}
                    firstIconName={"chat-processing-outline"}
                    firstIconColor={theme.colors.labelColors}
                    secondIconName={"more-vert"}
                    secondIconColor={theme.colors.secondary}
                    onSecondIconPress={() => { refRBSheet.current.open() }}
                />

                {
                    loading ? showLoader() : <ScrollView>

                        <View>
                            <FlatList
                                data={clubDetail?.images}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={(e) => {
                                    const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                                    setActiveIndex(index);
                                }}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />


                            <View style={styles.dotContainer}>
                                {clubDetail?.images?.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.indicator,
                                            index === activeIndex && styles.activeIndicator,
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>

                        <View style={{ marginTop: scaleHeight(-10), marginHorizontal: 20 }}>
                            <Text style={styles.clubName}>{clubDetail?.name}</Text>

                            <Text style={styles.clubHighlight}>{"Club Highlights"}</Text>

                            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {clubDetail?.highlights?.map((highlight, index) => (
                                        <ClubMember
                                            key={index}
                                            isPress={false}
                                            onPress={() => { handleHighlightDetail(highlight?.id) }}
                                            avatarUrl={highlight?.images[0]?.url}
                                            customImageStyle={{
                                                marginBottom: 0,
                                                width: 100,
                                                height: 100,
                                            }}
                                        />
                                    ))}
                                </View>
                            </ScrollView>

                            <ProfileComponent
                                avatarUrl={clubDetail?.creator?.profile_image?.url}
                                name={clubDetail?.creator?.username}
                                rating={clubDetail?.creator?.rating}
                                onViewProfile={handleViewProfile}
                            />

                            <View style={styles.aboutStyle}>


                                <Text style={{
                                    color: theme.colors.white,
                                    fontSize: scaleHeight(16),
                                    fontFamily: fonts.fontsType.medium,

                                }}>
                                    About
                                </Text>

                                <Text style={{
                                    color: theme.colors.labelColors,
                                    fontSize: scaleHeight(14),
                                    fontFamily: fonts.fontsType.medium,

                                }}>
                                    {`${clubDetail?.members?.length} Joined`}
                                </Text>

                            </View>

                            <Text style={{
                                color: theme.colors.labelColors,
                                fontSize: scaleHeight(15),
                                fontFamily: fonts.fontsType.light,
                                marginBottom: scaleHeight(10),
                                marginHorizontal: 10
                            }}>
                                {clubDetail?.description}
                            </Text>

                            <View style={styles.aboutStyle}>


                                <Text style={{
                                    color: theme.colors.white,
                                    fontSize: scaleHeight(16),
                                    fontFamily: fonts.fontsType.medium,

                                }}>
                                    Rules
                                </Text>

                                <Text style={{
                                    color: theme.colors.textHeading,
                                    fontSize: scaleHeight(14),
                                    fontFamily: fonts.fontsType.bold,

                                }}>
                                    See All
                                </Text>

                            </View>

                            <RulesGoalsComponent
                                data={clubDetail?.rules}
                            />

                            <View style={{ marginBottom: 20 }}>
                                <InterestList
                                    interests={clubDetail?.categories}
                                    onSelectionChange={handleSelectionChange}
                                    test={true}
                                />
                            </View>


                            <View style={styles.aboutStyle}>


                                <Text style={{
                                    color: theme.colors.white,
                                    fontSize: scaleHeight(16),
                                    fontFamily: fonts.fontsType.medium,

                                }}>
                                    Goals
                                </Text>

                                <Text style={{
                                    color: theme.colors.textHeading,
                                    fontSize: scaleHeight(14),
                                    fontFamily: fonts.fontsType.bold,

                                }}>
                                    See All
                                </Text>

                            </View>

                            <RulesGoalsComponent
                                data={clubDetail?.goals}
                                iconColor={theme.colors.textHeading}
                                iconName='radiobox-marked'
                            />

                            <View style={styles.aboutStyle}>


                                <Text style={{
                                    color: theme.colors.white,
                                    fontSize: scaleHeight(16),
                                    fontFamily: fonts.fontsType.medium,

                                }}>
                                    {`Club Members (${clubDetail?.members?.length})`}
                                </Text>


                                <TouchableOpacity
                                    onPress={handleManageMembers}
                                >

                                    <Text style={{
                                        color: theme.colors.textHeading,
                                        fontSize: scaleHeight(14),
                                        fontFamily: fonts.fontsType.bold,

                                    }}>
                                        See All
                                    </Text>

                                </TouchableOpacity>

                            </View>
                            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {clubMembers?.map((member, index) => (
                                        <ClubMember
                                            key={index}
                                            avatarUrl={member?.user_details?.profile_image?.url}
                                            memberName={member?.user_details?.username}
                                            customImageStyle={{
                                                width: 50,
                                                height: 50,
                                            }}
                                        />
                                    ))}
                                </View>
                            </ScrollView>

                            <View style={styles.aboutStyle}>


                                <Text style={{
                                    color: theme.colors.white,
                                    fontSize: scaleHeight(16),
                                    fontFamily: fonts.fontsType.medium,

                                }}>
                                    {`Club Posts`}
                                </Text>


                                <TouchableOpacity
                                    onPress={handleClubFeeds}
                                >

                                    <Text style={{
                                        color: theme.colors.textHeading,
                                        fontSize: scaleHeight(14),
                                        fontFamily: fonts.fontsType.bold,

                                    }}>
                                        See All
                                    </Text>

                                </TouchableOpacity>

                            </View>

                            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {clubPosts?.map((events, index) => (
                                        <View
                                            key={index}
                                            style={[styles.itemContainer, { flex: 0, width: scaleWidth(160), }]}>
                                            <TouchableOpacity
                                                style={{
                                                    height: scaleHeight(160),
                                                }}
                                                onPress={() => {
                                                    handleClubPostDetail(events?.id)
                                                }}>
                                                <Image source={{ uri: events?.images[0]?.url }} style={[styles.image]} />
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', }}>

                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode='tail'
                                                    style={styles.name}>{events?.title}</Text>
                                                {/* <Text style={styles.rating}>{item?.creator?.rating}</Text> */}

                                            </View>
                                            <Text style={styles.description}>{events?.description}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>

                            <View style={styles.aboutStyle}>


                                <Text style={{
                                    color: theme.colors.white,
                                    fontSize: scaleHeight(16),
                                    fontFamily: fonts.fontsType.medium,

                                }}>
                                    {`Club Events (${clubDetail?.events?.length || '0'})`}
                                </Text>


                                <TouchableOpacity
                                >

                                    <Text style={{
                                        color: theme.colors.textHeading,
                                        fontSize: scaleHeight(14),
                                        fontFamily: fonts.fontsType.bold,

                                    }}>
                                        See All
                                    </Text>

                                </TouchableOpacity>

                            </View>
                            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {clubDetail?.events?.map((events, index) => (
                                        <View
                                            key={index}
                                            style={[styles.itemContainer, { flex: 0, width: scaleWidth(160), }]}>
                                            <TouchableOpacity
                                                style={{
                                                    height: scaleHeight(160),
                                                }}
                                                onPress={() => {
                                                    // handleClubNavigation(item?.id)
                                                }}>
                                                <Image source={{ uri: events?.images[0]?.url }} style={[styles.image]} />
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', }}>

                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode='tail'
                                                    style={styles.name}>{events?.name}</Text>
                                                {/* <Text style={styles.rating}>{item?.creator?.rating}</Text> */}

                                            </View>
                                            <Text style={styles.description}>{events?.description}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>

                            {/* <Text style={styles.clubHighlight}>{"Club Members"}</Text>

                        <Text style={styles.clubHighlight2}>{"Club Goals Section is in Under developemnt"}</Text> */}

                        </View>
                        {user_id !== clubDetail?.creator?.id &&
                            <Button title={'Join Club'}
                                onPress={() => {
                                    clubDetail?.is_paid != null ?
                                        openPaymentSheet(100, handleJoinClub, 'Test User') :
                                        handleJoinClub()
                                }}
                            />}
                    </ScrollView>
                }

                <ActionSheet
                    ref={refRBSheet}
                    sheetItems={sheetItems}
                />
                <CustomModal
                    loading={deleteLoader}
                    isVisible={modalVisible}
                    onClose={handleCloseModal}
                    headerTitle={"Delete Club?"}
                    imageSource={warningImg}
                    isParallelButton={true}
                    text={`Do you really want to delete club?`}
                    parallelButtonText1={"Cancel"}
                    parallelButtonText2={"Yes, Delete"}
                    parallelButtonPress1={() => {
                        handleCloseModal()
                    }}
                    parallelButtonPress2={() => {
                        handleDeleteClub()
                    }}
                />
            </SafeAreaView>
        </StripeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    carouselItem: {
        width: scaleWidth(375),
        height: scaleHeight(260),
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselImage: {
        width: '85%',
        height: '75%',
        borderRadius: 20,
        alignSelf: 'center'
    },
    dotContainer: {
        position: 'absolute',
        top: scaleHeight(200),
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 20,
        height: 5,
        borderRadius: 5,
        backgroundColor: 'white',
        marginHorizontal: 5,
        alignSelf: 'center'
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: theme.colors.inputBg,
        marginHorizontal: 5,
        //borderWidth: 1,
        borderColor: theme.colors.textHeading
    },
    activeIndicator: {
        width: 24,
        height: 8,
        borderRadius: 5,
        backgroundColor: theme.colors.textHeading,
    },
    clubName: {
        fontSize: normalizeFontSize(16),
        fontFamily: fonts.fontsType.bold,
        color: theme.colors.white,
        marginHorizontal: 10,
        marginBottom: 20
    },

    clubHighlight: {
        fontSize: normalizeFontSize(14),
        fontFamily: fonts.fontsType.bold,
        color: theme.colors.white,
        marginHorizontal: 10,
        marginBottom: 10
    },
    clubHighlight2: {
        fontSize: normalizeFontSize(12),
        fontFamily: fonts.fontsType.light,
        color: theme.colors.labelColors,
        marginHorizontal: 10,
        marginBottom: 20,
        width: '100%'
    },
    aboutStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scaleHeight(5),
        marginTop: scaleHeight(10),
        marginHorizontal: 10
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
    name: {
        fontFamily: fonts.fontsType.semiBold,
        fontSize: scaleHeight(14),
        color: theme.colors.white,
        marginTop: 5,
        flex: 1,
        alignSelf: 'center',
    },
    description: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(12),
        color: theme.colors.labelColors,
    },
});

export default ClubDetail;
