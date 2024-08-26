import React, { Component, useEffect, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Dimensions, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../../../components/Header';
import theme from '../../../styles/theme';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../../styles/responsive';
import ProfileComponent from '../../../components/ProfileComponent';
import fonts from '../../../styles/fonts';
import { resetNavigation } from '../../../utils/resetNavigation';
import useBackHandler from '../../../utils/useBackHandler';
import { SCREENS } from '../../../constant/constants';
import { useDispatch, useSelector } from 'react-redux';
import FullScreenLoader from '../../../components/FullScreenLoader';
import ActionSheet from '../../../components/ActionSheet';
import { setId, setPreviousScreen } from '../../../redux/generalSlice';
import { useAlert } from '../../../providers/AlertContext';
import { createDelayedNavigation } from '../../../utils/navigationWithDelay';
import CustomModal from '../../../components/CustomModal';
import { warningImg } from '../../../assets/images';
import { getClubHighlights } from '../../../redux/ClubCreation/getClubHighlightsSlice';
import { deleteHighlight } from '../../../redux/ClubCreation/deleteHighlightSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HighlightDetail = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { highlightDetail, loading } = useSelector((state) => state.getClubHighlights)
    const { loading: deleteLoader } = useSelector((state) => state.deleteClub)
    const { user_id } = useSelector((state) => state.auth)
    const highlightId = useSelector((state) => state.general?.id)
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const refRBSheet = useRef();
    const backToDashboard = createDelayedNavigation(navigation, SCREENS.CLUB_DETAIL)



    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.CLUB_DETAIL)
        dispatch(setId(highlightDetail?.club_id))
        return true;
    }
    useBackHandler(handleBackPress)

    useEffect(() => {
        dispatch(getClubHighlights(highlightId))
    }, [dispatch, highlightId])


    const handleViewProfile = () => {
        dispatch(setId(highlightDetail?.highlighted_by?.id))
        dispatch(setPreviousScreen(SCREENS.HIGHLIGHT_CLUB_DETAIL))
        resetNavigation(navigation, SCREENS.VIEW_PROFILE)
    }

    const handleDeleteHighlight = () => {
        dispatch(deleteHighlight(highlightId)).then((result) => {
            if (result?.payload?.success === true) {
                showAlert("Success", "success", result?.payload?.message)
                backToDashboard();
            } else if (result?.payload?.error?.success === false) {
                showAlert("Error", "error", result?.payload?.error?.message)
            }

        })
    };

    const handleUpdateClub = () => {

    }

    const handleOpenModal = () => {
        setModalVisible(true);
        refRBSheet.current.close()
    };

    const sheetItems = [
        { id: 1, label: 'Update Highlight', onPress: handleUpdateClub },
        { id: 2, label: 'Delete Highlight', onPress: handleOpenModal }
    ];


    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const renderItem = ({ item, index }) => (
        <View style={[styles.carouselItem]}>
            <Image source={{ uri: item?.url }} style={styles.carouselImage} resizeMode="contain" />
        </View>
    );

    const showLoader = () => {
        return <FullScreenLoader
            loading={loading} />;
    };

    return (

        <SafeAreaView style={styles.container}>
            <Header
                onBackPress={handleBackPress}
                isBackIcon={true}
                title={"Highlight Detail"}
                firstIconName={"chat-processing-outline"}
                firstIconColor={theme.colors.transparent}
                secondIconName={"more-vert"}
                secondIconColor={theme.colors.secondary}
                onSecondIconPress={() => { refRBSheet.current.open() }}
            />

            {
                loading ? showLoader() : <ScrollView>

                    <View>
                        <FlatList
                            data={highlightDetail?.images}
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
                            {highlightDetail?.images?.map((_, index) => (
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
                        <Text style={styles.clubName}>{highlightDetail?.title}</Text>

                        <ProfileComponent
                            avatarUrl={highlightDetail?.highlighted_by?.profile_image}
                            name={highlightDetail?.highlighted_by?.username}
                        // rating={highlightDetail?.creator?.rating}
                        // onViewProfile={handleViewProfile}
                        />

                        {highlightDetail?.description && <View style={styles.aboutStyle}>


                            <Text style={{
                                color: theme.colors.white,
                                fontSize: scaleHeight(16),
                                fontFamily: fonts.fontsType.medium,

                            }}>
                                About
                            </Text>

                        </View>}

                        <Text style={{
                            color: theme.colors.labelColors,
                            fontSize: scaleHeight(15),
                            fontFamily: fonts.fontsType.light,
                            marginBottom: scaleHeight(10),
                            marginHorizontal: 10
                        }}>
                            {highlightDetail?.description}
                        </Text>

                    </View>
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
                headerTitle={"Delete Highlight?"}
                imageSource={warningImg}
                isParallelButton={true}
                text={`Do you really want to delete Highlight?`}
                parallelButtonText1={"Cancel"}
                parallelButtonText2={"Yes, Delete"}
                parallelButtonPress1={() => {
                    handleCloseModal()
                }}
                parallelButtonPress2={() => {
                    handleDeleteHighlight()
                }}
            />
        </SafeAreaView>
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

export default HighlightDetail;
