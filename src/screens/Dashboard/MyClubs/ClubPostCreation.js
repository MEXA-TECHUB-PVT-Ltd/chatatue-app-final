//import liraries
import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Header from '../../../components/Header';
import CustomLayout from '../../../components/CustomLayout';
import CustomTextInput from '../../../components/TextInputComponent';
import theme from '../../../styles/theme';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../../styles/responsive';
import fonts from '../../../styles/fonts';
import Button from '../../../components/ButtonComponent';
import { resetNavigation } from '../../../utils/resetNavigation';
import useBackHandler from '../../../utils/useBackHandler';
import { SCREENS } from '../../../constant/constants';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { deleteImage, uploadImage } from '../../../redux/cloudinarySlice';
import { useDispatch, useSelector } from 'react-redux';
import Cross from 'react-native-vector-icons/Entypo'
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useAlert } from '../../../providers/AlertContext';
import { createClubPost } from '../../../redux/ClubCreation/createClubPostSlice';
import InterestList from '../../../components/InterestList';
import CustomModal from '../../../components/CustomModal';
import { successImg } from '../../../assets/images';
import { createHighlight } from '../../../redux/ClubCreation/createHighlightSlice';
import { createDelayedNavigation } from '../../../utils/navigationWithDelay';
import { getClubPost } from '../../../redux/ClubCreation/getClubPostSlice';

const eventTags = [
    { id: 1, name: "Music" },
    { id: 2, name: "Sports" },
    { id: 3, name: "Art" },
    { id: 4, name: "Technology" },
    { id: 5, name: "Fitness" },
    { id: 6, name: "Education" },
    { id: 7, name: "Networking" },
    { id: 8, name: "Charity" },
    { id: 9, name: "Entrepreneurship" },
    { id: 10, name: "Travel" }
];


const ClubPostCreation = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { loading } = useSelector((state) => state.createClubPost)
    const clubId = useSelector((state) => state.general?.id)
    const { data } = useSelector((state) => state.general)
    const { user_id, role } = useSelector((state) => state.auth)
    const [mediaImages, setMediaImages] = useState([]);
    const [highlightImages, setHighlightImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const refRBSheet = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [isCreateHighlight, setCreateHightlight] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [tag, setTag] = useState('');
    const headerTitle = data?.type === "update" ? "Update Post" : "Create Post"
    const labelName = "Name a Post"
    const navigateBackToFeed = createDelayedNavigation(navigation, SCREENS.CLUB_FEEDS)

    const handleImageLoadStart = (index) => {
        setLoadingImages(prevState => ({ ...prevState, [index]: true }));
    };

    const handleImageLoadEnd = (index) => {
        setLoadingImages(prevState => ({ ...prevState, [index]: false }));
    };

    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.CLUB_FEEDS)
        return true;
    }
    useBackHandler(handleBackPress)

    useEffect(() => {
        dispatch(getClubPost(data?.postId)).then((result) => {
            const { success, message, result: resultData } = result?.payload
            if (success) {
                setName(resultData?.title)
                setDescription(resultData?.description)
                if (resultData?.images && resultData?.images.length > 0) {
                    const media = resultData?.images?.map(({ url, public_id }) => ({ url, public_id }));
                    setMediaImages(media);
                }
            }

        })
    }, [dispatch, data])


    const toggleCreateHighlight = () => {
        setCreateHightlight(!isCreateHighlight)
        handleSheetClose();
        setName('');
        setDescription('')
        setMediaImages([]);
        handleCloseModal();
    }

    function getTagNameById(id) {
        const tag = eventTags.find(eventTag => eventTag.id === id);
        return tag ? tag.name : "";
    }

    const handleSelectionChange = (selectedCategories) => {
        setTag(getTagNameById(selectedCategories?.[0]))
        setSelectedCategories(selectedCategories);
    };

    const handleSheetOpen = () => {
        refRBSheet.current.open();
    };

    const handleSheetClose = () => {
        refRBSheet.current.close();
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const addImage = () => {
        handleSheetOpen()
    };

    const pickImageFromGallery = () => {
        ImagePicker.openPicker({
            width: 600,
            height: 400,
        }).then(image => {
            handleSheetClose();
            dispatch(uploadImage(image.path)).then((result) => {
                if (result?.payload) {
                    // Assuming result.payload contains the URL of the uploaded image
                    const imagesResult = {
                        url: result.payload?.secure_url,
                        public_id: result.payload?.public_id
                    }
                    if (isCreateHighlight) {
                        setHighlightImages([...highlightImages, imagesResult]);
                    } else {
                        setMediaImages([...mediaImages, imagesResult]);
                    }
                }
            }).catch(error => {
                console.error('Error uploading image:', error);
            });
            // setMediaImages([...mediaImages, image.path]);
        }).catch(error => {
            console.log('Error picking image: ', error);
        });
    };

    const pickImageFromCamera = () => {
        ImagePicker.openCamera({
            width: 600,
            height: 400,
        }).then(image => {
            handleSheetClose();
            dispatch(uploadImage(image.path)).then((result) => {
                if (result?.payload) {
                    // Assuming result.payload contains the URL of the uploaded image
                    const imagesResult = {
                        url: result.payload?.secure_url,
                        public_id: result.payload?.public_id
                    }
                    if (isCreateHighlight) {
                        setHighlightImages([...highlightImages, imagesResult]);
                    } else {
                        setMediaImages([...mediaImages, imagesResult]);
                    }
                }
            }).catch(error => {
                console.error('Error uploading image:', error);
            });
            // setMediaImages([...mediaImages, image.path]);
        }).catch(error => {
            console.log('Error capturing image: ', error);
        });
    };

    const removeImage = (item, index) => {
        dispatch(deleteImage(item?.public_id)).then((result) => {
            if (result?.payload) {
                const newImages = [...mediaImages];
                newImages.splice(index, 1);
                setMediaImages(newImages);
            }
        }).catch(error => {
            console.error('Error uploading image:', error);
        });

    };

    const photoSelectorView = () => {

        return (
            <View>
                <Button
                    onPress={() => { pickImageFromCamera() }}
                    title={"Capture from camera"}
                    icon={<Icon name="camera-alt" type="material" size={24} color={theme.colors.greyShade} />}
                    customStyle={styles.button}
                    textCustomStyle={{ color: theme.colors.greyShade }}
                    customIconStyle={styles.customIconStyle}
                />

                <Button
                    onPress={() => { pickImageFromGallery() }}
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

    const renderBottomSheet = () => {
        return <RBSheet
            ref={refRBSheet}
            openDuration={1000}
            customStyles={{
                wrapper: styles.wrapper,
                container: [styles.sheetContainer,
                { backgroundColor: theme.colors.primary }]
            }}
        >

            {photoSelectorView()}

        </RBSheet>
    }

    const handleCreatePost = () => {
        let dataPayload;
        if (data?.type === "update") {
            dataPayload = {
                club_id: data?.clubId,
                userId: data?.userId,
                title: name,
                description: description,
                tag: tag,
                images: mediaImages
            }
        } else {
            dataPayload = {
                club_id: clubId,
                userId: user_id,
                title: name,
                description: description,
                tag: tag,
                images: mediaImages
            }
        }
        const postPayload = {
            postId: data?.postId,
            data: dataPayload,
            method: data?.type === "update" ? 'PATCH' : "POST"
        }

        dispatch(createClubPost(postPayload)).then((result) => {
            const { success, message } = result?.payload
            if (success) {
                setModalVisible(true);
            } else {
                showAlert("Error", "error", message)
            }

        })



    }

    const handleCreateHighlight = () => {
        const data = {
            club_id: clubId,
            title: name,
            description: description,
            images: mediaImages,
            userId: user_id,
        }
        const postPayload = {
            data: data,
            method: 'POST'
        }

        dispatch(createHighlight(postPayload)).then((result) => {
            const { success, message } = result?.payload
            if (success) {
                showAlert("Success", "success", message)
                navigateBackToFeed();
            } else {
                showAlert("Error", "error", message)
            }

        })



    }

    const addMediaSection = () => {

        return (
            <View style={styles.mediaImageContainer}>
                {mediaImages?.map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        {loadingImages[index] && (
                            <FullScreenLoader
                                indicatorSize={40}
                                customIndicatorContainer={styles.loader}
                                loading={loadingImages[index]} />
                        )}
                        <Image
                            source={{ uri: image?.url }}
                            style={styles.mediaImage}
                            onLoadStart={() => handleImageLoadStart(index)}
                            onLoadEnd={() => handleImageLoadEnd(index)}
                        />
                        <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(image, index)}>
                            <Cross name='cross' size={16} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                ))}
                {mediaImages?.length < 3 && <TouchableOpacity style={styles.addButton} onPress={addImage}>
                    <Cross name='plus' size={24} color={"#888888"} />
                </TouchableOpacity>}
            </View>
        )

    }


    return (
        <SafeAreaView style={styles.container}>
            <Header
                onBackPress={handleBackPress}
                isBackIcon={true}
                title={headerTitle}
            />
            <Text style={[styles.subHeading]}>{"This can be your achievement , runs or etc."}</Text>
            <CustomLayout>
                <View style={styles.sectionContainer}>

                    {addMediaSection()}

                    <CustomTextInput
                        label={labelName}
                        identifier={'post_name'}
                        value={name}
                        onValueChange={setName}
                        customContainerStyle={styles.customInput}
                        autoCapitalize={'sentences'}
                    />

                    <CustomTextInput
                        label={"Description"}
                        identifier={'description'}
                        customContainerStyle={styles.customInput}
                        autoCapitalize={'sentences'}
                        multiline={true}
                        value={description}
                        onValueChange={setDescription}
                    />

                    {<View style={{ marginTop: 10 }}>
                        <Text style={[styles.label]}>{"Tags"}</Text>
                        <InterestList
                            interests={eventTags}
                            onSelectionChange={handleSelectionChange}
                            singleSelection={true}
                        />
                    </View>}

                </View>

            </CustomLayout>
            <Button
                loading={loading}
                onPress={handleCreatePost}
                title={"Continue"}
                customStyle={{ marginBottom: 20, marginTop: scaleHeight(20) }}
            />
            {renderBottomSheet()}
            <CustomModal
                isVisible={modalVisible}
                onClose={handleCloseModal}
                headerTitle={"Club Created!"}
                imageSource={successImg}
                isParallelButton={true}
                text={`Club Created Successfully, Do you want to add Highlight in this club?`}
                parallelButtonText1={"Not, Right now"}
                parallelButtonText2={"Yes, Create"}
                parallelButtonPress1={() => {
                    handleBackPress();
                }}
                parallelButtonPress2={() => {
                    // toggleCreateHighlight()
                    handleCreateHighlight()
                }}
            />
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
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
        marginTop: scaleHeight(20),
        width: '70%'
    },
    sectionContainer: {
        padding: 20,
    },
    customInput: {
        marginTop: scaleHeight(20)
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
        marginTop: scaleHeight(20),
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

    dateButton: {
        height: 45,
        backgroundColor: theme.colors.inputBg,
        borderRadius: 20,
        marginVertical: 10,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    dateText: {
        color: theme.colors.white,
        fontSize: normalizeFontSize(16),
        fontFamily: fonts.fontsType.medium,
    },
    bottomSheet: {
        padding: 20,
    },
    scheduleSheet: {
        backgroundColor: theme.colors.primary,
        padding: 20
    },
    pickerContainer: {
        height: 45,
        backgroundColor: theme.colors.inputBg,
        borderRadius: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    picker: {
        height: 45,
        width: '100%',
        color: theme.colors.white,
    },
    pickerItem: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(16),
        color: theme.colors.white,
    },
    pickerWrapper: {
        justifyContent: 'center',  // Center the content
        alignItems: 'center',
        flex: 1,  // Make sure the content takes full height of the sheet
    },
    focusedInput: {
        borderWidth: 1,
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.secondary,
        color: theme.colors.white,
    },
    removeWaypoints: {
        position: 'absolute',
        right: -10,
        top: 10
    },

    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    label: {
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(14),
        color: theme.colors.white,
        marginHorizontal: 10,
        marginBottom: 15

    },
    subHeading: {
        fontFamily: fonts.fontsType.medium,
        fontSize: normalizeFontSize(12),
        color: theme.colors.labelColors,
        alignSelf: 'center'

    }
});

//make this component available to the app
export default ClubPostCreation;
