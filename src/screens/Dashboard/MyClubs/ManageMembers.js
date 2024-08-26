import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, FlatList, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import { setId, setPreviousScreen } from '../../../redux/generalSlice';
import MembersListItem from '../../../components/MembersListItem';
import FullScreenLoader from '../../../components/FullScreenLoader';
import Header from '../../../components/Header';
import theme from '../../../styles/theme';
import { getClubMembers } from '../../../redux/ManageClub/getClubMembersSlice';
import useBackHandler from '../../../utils/useBackHandler';
import Button from '../../../components/ButtonComponent';
import RBSheet from 'react-native-raw-bottom-sheet';
import fonts from '../../../styles/fonts';
import { CloseIcon } from '../../../assets/svgs';
import { normalizeFontSize, scaleHeight } from '../../../styles/responsive';
import ClubMember from '../../../components/ClubMember';
import { updateMemberRole } from '../../../redux/ManageClub/updateMemberRoleSlice';
import { useAlert } from '../../../providers/AlertContext';
import { removeClubMember } from '../../../redux/ManageClub/removeClubMemberSlice';


const ManageMembers = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { clubMembers, loading, currentPage, totalPages } = useSelector((state) => state.getClubMembers);
    const { loading: memberRoleLoader } = useSelector((state) => state.updateMemberRole);
    const { loading: removeMemberLoader } = useSelector((state) => state.removeClubMember);
    const { user_id } = useSelector((state) => state.auth);
    const clubId = useSelector((state) => state.general?.id)
    const previousScreen = useSelector((state) => state.general?.previousScreen)
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [loader, setLoader] = useState(true);
    const [memberInfo, setMemberInfo] = useState(null);
    const refRBSheet = useRef();


    const handleBackPress = () => {
        resetNavigation(navigation, previousScreen)
        return true;
    }
    useBackHandler(handleBackPress)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoader(false);
        }, 1000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        dispatch(getClubMembers({ page, limit: 10, clubId }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getClubMembers({ page: 1, limit: 10, clubId }))
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleSheetClose = () => {
        refRBSheet.current.close();
    };

    const handleSheetOpen = (item) => {
        setMemberInfo(item)
        refRBSheet.current.open();
    };

    const handleViewProfile = (userId) => {
        dispatch(setId(userId))
        dispatch(setPreviousScreen(SCREENS.MANAGE_MEMBERS))
        resetNavigation(navigation, SCREENS.VIEW_PROFILE)
    }

    const handleClubRequest = () => {
        dispatch(setId(clubId))
        dispatch(setPreviousScreen(SCREENS.MANAGE_MEMBERS))
        resetNavigation(navigation, SCREENS.CLUB_REQUESTS)
    };

    const handleUpdateMemberRole = (memberId) => {
        dispatch(updateMemberRole(memberId)).then((result) => {
            const { success, message } = result?.payload
            if (success) {
                handleSheetClose();
                showAlert("Success", "success", message)
            } else if (!success) {
                showAlert("Error", "error", message)
            }
        })
    }

    const handleRemoveMemberRole = (memberId) => {
        dispatch(removeClubMember(memberId)).then((result) => {
            const { success, message } = result?.payload
            if (success) {
                handleSheetClose();
                showAlert("Success", "success", message)
            } else if (!success) {
                showAlert("Error", "error", message)
            }
        })
    }

    const renderItem = ({ item, index }) => (
        <MembersListItem
            name={item?.user_details?.username}
            profileImage={item?.user_details?.profile_image?.url}
            secondButtonPress={() => { handleSheetOpen(item) }}
            firstButtonPress={() => { handleViewProfile(item?.user_details?.id) }}
        />
    );

    const showLoader = () => {
        return <FullScreenLoader
            loading={loader} />;
    };

    const showFooterSpinner = () => {
        return <FullScreenLoader
            indicatorSize={40}
            loading={loading} />;
    }

    const renderBottomSheet = () => {
        return (
            <RBSheet
                ref={refRBSheet}
                openDuration={1000}
                customStyles={{
                    wrapper: styles.wrapper,
                    container: styles.sheetContainer,
                }}
                closeOnPressBack={true}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{"MANAGE"}</Text>
                        <TouchableOpacity onPress={handleSheetClose}>
                            <CloseIcon width={24} height={24} />
                        </TouchableOpacity>
                    </View>

                    <ClubMember
                        avatarUrl={memberInfo?.user_details?.profile_image?.url}
                        memberName={memberInfo?.user_details?.username}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            loading={memberRoleLoader}
                            onPress={() => {
                                handleUpdateMemberRole(memberInfo?.id)
                            }}
                            title={"Make Admin"}
                            customStyle={[styles.button, styles.makeAdminButton]}
                            textCustomStyle={styles.buttonText}
                        />
                        <Button
                            loading={removeMemberLoader}
                            onPress={() => {
                                handleRemoveMemberRole(memberInfo?.id)
                            }}
                            title={"Remove From Club"}
                            customStyle={[styles.button, styles.removeButton]}
                            textCustomStyle={styles.buttonText}
                        />
                    </View>
                </View>
            </RBSheet>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <Header
                onBackPress={handleBackPress}
                title={"Manage Members"}
                isBackIcon={true}
            />


            {loader && !refreshing ? showLoader() :
                clubMembers?.length > 0 ? (
                    <FlatList
                        data={clubMembers}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item + index}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.list}
                        ListFooterComponent={loading && !refreshing && (<View style={styles.footer}>
                            {showFooterSpinner()}
                        </View>)}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[theme.colors.textHeading]}
                                progressBackgroundColor={theme.colors.secondary}
                            />
                        }
                    />
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[theme.colors.textHeading]}
                                progressBackgroundColor={theme.colors.secondary}
                            />
                        }
                    >
                        {/* //list empty component */}
                    </ScrollView>
                )
            }

            <Button
                onPress={handleClubRequest}
                title={"Manage Requests"} />

            {renderBottomSheet()}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    list: {
        justifyContent: 'space-between',
        marginHorizontal: 10
    },
    listContainer: {
        alignItems: 'center',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    sheetContainer: {
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: theme.colors.primary,
        height: '35%'
    },
    wrapper: {
        backgroundColor: theme.colors.backDropColor,
    },
    contentContainer: {
        padding: 20,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
    },
    headerText: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(16),
        color: theme.colors.white,
        flex: 1,
    },
    buttonContainer: {
        marginTop: scaleHeight(0),
        marginBottom: scaleHeight(0),
    },
    button: {
        width: '90%',
        borderRadius: 10,
        marginBottom: 0,
    },
    makeAdminButton: {
        backgroundColor: theme.colors.success,
        marginTop: 5,
    },
    removeButton: {
        backgroundColor: theme.colors.error,
        marginTop: 10,
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: normalizeFontSize(12),
    },
});

export default ManageMembers;
