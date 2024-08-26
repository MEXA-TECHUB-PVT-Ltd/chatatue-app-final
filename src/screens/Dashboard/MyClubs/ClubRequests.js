import React, { Component, useEffect, useState } from 'react';
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
import { getClubRequests } from '../../../redux/ManageClub/getClubRequestsSlice';
import { updateMembership } from '../../../redux/ManageClub/updateMembershipSlice';
import { useAlert } from '../../../providers/AlertContext';


const ClubRequests = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { clubRequests, loading, currentPage, totalPages } = useSelector((state) => state.getClubRequests);
    const { user_id } = useSelector((state) => state.auth);
    const clubId = useSelector((state) => state.general?.id)
    const previousScreen = useSelector((state) => state.general?.previousScreen)
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [loader, setLoader] = useState(true);

    const handleBackPress = () => {
        resetNavigation(navigation, previousScreen)
        dispatch(setPreviousScreen(SCREENS.CLUB_DETAIL))
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
        dispatch(getClubRequests({ page, limit: 10, clubId }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getClubRequests({ page: 1, limit: 10, clubId }))
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleUpdateMembership = (memberId, status) => {
        const payload = {
            memberId,
            status
        }
        dispatch(updateMembership(payload)).then((result) => {
            const { success, message } = result?.payload
            if (success) {
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
            firstButtonName={"Approve"}
            secondButtonName={"Reject"}
            firstButtonPress={() => {
                handleUpdateMembership(item?.id, "APPROVED")
            }}
            secondButtonPress={() => {
                handleUpdateMembership(item?.id, "REJECTED")
            }}
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


    return (
        <SafeAreaView style={styles.container}>
            <Header
                onBackPress={handleBackPress}
                title={"Manage Requests"}
                isBackIcon={true}
            />


            {loader && !refreshing ? showLoader() :
                clubRequests?.length > 0 ? (
                    <FlatList
                        data={clubRequests}
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
});

export default ClubRequests;
