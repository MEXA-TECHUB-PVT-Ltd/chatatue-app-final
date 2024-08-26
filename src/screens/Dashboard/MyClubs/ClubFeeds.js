import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, FlatList, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import theme from '../../../styles/theme';
import Header from '../../../components/Header';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClubs } from '../../../redux/ClubCreation/getAllClubsSlice';
import FullScreenLoader from '../../../components/FullScreenLoader';
import fonts from '../../../styles/fonts';
import { scaleHeight, scaleWidth } from '../../../styles/responsive';
import { setData, setId, setPreviousScreen } from '../../../redux/generalSlice';
import CustomTextInput from '../../../components/TextInputComponent';
import { getAllClubPostFeeds } from '../../../redux/ClubCreation/getAllClubPostFeedsSlice';
import useBackHandler from '../../../utils/useBackHandler';
import Icon from 'react-native-vector-icons/FontAwesome';
const { width } = Dimensions.get('window');
const GRID_COLUMNS = 2;
const ITEM_MARGIN = 10;

const ClubFeeds = ({ navigation }) => {
    const dispatch = useDispatch();
    const { clubPosts, loading, currentPage, totalPages } = useSelector((state) => state.getAllClubPostFeeds);
    const { user_id, role } = useSelector((state) => state.auth);
    const clubId = useSelector((state) => state.general?.id)
    const { data } = useSelector((state) => state.general)
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loader, setLoader] = useState(true);
    const [isGridView, setIsGridView] = useState(false);


    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.CLUB_DETAIL)
        dispatch(setId(clubId))
        return true;
    }
    useBackHandler(handleBackPress)

    const handleClubPostCreationPress = () => {
        dispatch(setId(clubId))
        dispatch(setPreviousScreen(SCREENS.CLUB_FEEDS))
        resetNavigation(navigation, SCREENS.CLUB_POST_CREATION)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoader(false);
        }, 1000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        dispatch(getAllClubPostFeeds({ page, limit: 10, searchPayload: { user_id: user_id, search: searchTerm } }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page, searchTerm]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getAllClubPostFeeds({ page: 1, limit: 10, searchPayload: { user_id: user_id } }))
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const renderItem = ({ item, index }) => (
        <View
            style={[styles.itemContainer, { flex: isGridView ? 0 : 1, width: isGridView ? scaleWidth(160) : '95%', }]}>
            <TouchableOpacity
                style={{
                    height: isGridView ? scaleHeight(160) : scaleHeight(240),
                }}
                onPress={() => {
                    // handleClubNavigation(item?.id)
                }}>
                <Image source={{ uri: item?.images[0]?.url }} style={[styles.image]} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>

                <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={styles.name}>{item?.title}</Text>
                {/* <Text style={styles.rating}>{item?.creator?.rating}</Text> */}
                {/* <TouchableOpacity onPress={() => { }} style={styles.iconContainer}>
                    <Icon name="edit" size={20} color={theme.colors.textHeading} />
                </TouchableOpacity> */}

            </View>
            <Text style={styles.description}>{item?.description}</Text>
        </View>
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
                title={"Club Feeds"}
                {...(role !== 'USER' && {
                    secondIconName: "add-circle",
                    secondIconColor: theme.colors.secondary,
                    onSecondIconPress: handleClubPostCreationPress
                })}
            />

            <View style={{ padding: 20, marginTop: -25 }}>
                <CustomTextInput
                    identifier={'search'}
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    placeholder={'Search...'} />
            </View>


            {loader && !refreshing ? showLoader() :
                clubPosts?.length > 0 ? (
                    <FlatList
                        key={isGridView ? 'grid' : 'list'}
                        data={clubPosts}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item + index}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        numColumns={isGridView ? GRID_COLUMNS : 1}
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
    rating: {
        fontFamily: fonts.fontsType.regular,
        fontSize: scaleHeight(12),
        color: theme.colors.labelColors,
        marginTop: 8,
        marginEnd: 10,
        alignSelf: 'center',
        marginHorizontal: 2
    },
    description: {
        fontFamily: fonts.fontsType.medium,
        fontSize: scaleHeight(12),
        color: theme.colors.labelColors,
    },
    listContainer: {
        alignItems: 'center',
    },
    gridContainer: {
        justifyContent: 'space-between',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    iconContainer: {
        marginTop: 5
    },
});

export default ClubFeeds;
