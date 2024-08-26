import React, { Component, useEffect, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Dimensions, Image, Text, ScrollView, TouchableOpacity, ToastAndroid, Keyboard, ActivityIndicator } from 'react-native';
import Header from '../../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { resetNavigation } from '../../../utils/resetNavigation';
import useBackHandler from '../../../utils/useBackHandler';
import theme from '../../../styles/theme';
import ItemWithEditAction from '../../../components/ItemWithEditAction';
import CustomTextInput from '../../../components/TextInputComponent';
import CustomLayout from '../../../components/CustomLayout';
import fonts from '../../../styles/fonts';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../../styles/responsive';
import { useAlert } from '../../../providers/AlertContext';
import Icon from 'react-native-vector-icons/MaterialIcons'
import AddIcon from 'react-native-vector-icons/AntDesign'
import Cross from 'react-native-vector-icons/Entypo'
import { getClubDetail } from '../../../redux/ClubCreation/getClubDetailSlice';
import Button from '../../../components/ButtonComponent';
import { createClub } from '../../../redux/ClubCreation/createClubSlice';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { createClubRules } from '../../../redux/ClubCreation/createClubRulesSlice';
import { createGoals } from '../../../redux/AuthSlices/createGoalsSlice';
import { CloseIcon, WaypointIcon } from '../../../assets/svgs';
import { createClubRoute } from '../../../redux/ClubCreation/createClubRouteSlice';
import { getAllRoutes } from '../../../redux/ClubCreation/getAllRoutesSlice';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import { GOOGLE_API_KEY } from '@env'
import { getElevation } from '../../../utils/elevationService';
import { addGoalsImg, mapMarker } from '../../../assets/images';
import AddedRouteItem from '../../../components/AddedRouteItem';
import { deleteRoute } from '../../../redux/ClubCreation/deleteRouteSlice';
import GoalsItem from '../../../components/GoalsItem';
import { deleteRule } from '../../../redux/ClubCreation/deleteRuleSlice';
import { deleteGoal } from '../../../redux/ClubCreation/deleteGoalSlice';
import InterestList from '../../../components/InterestList';
import { deleteImage, uploadImage } from '../../../redux/cloudinarySlice';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { createClubGoal } from '../../../redux/ClubCreation/createClubGoalSlice';

const { width, height } = Dimensions.get('window');

const UpdateClub = ({ navigation }) => {
    const dispatch = useDispatch();
    const { clubDetail, loading } = useSelector((state) => state.getClubDetail)
    const { user_id } = useSelector((state) => state.auth)
    const clubId = useSelector((state) => state.general?.id)
    const previousScreen = useSelector((state) => state.general.previousScreen);
    const { showAlert } = useAlert();
    const { loading: clubLoader } = useSelector((state) => state.createClub)
    const { loading: routeLoader } = useSelector((state) => state.createClubRoute)
    const { loading: scheduleLoading } = useSelector((state) => state.createSchedule)
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [wayPoints, setWayPoints] = useState([]);
    const [waypoints, setWaypoints] = useState(['']);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [clubFee, setClubFee] = useState(0);
    const [categories, setClubCategories] = useState([]);
    const [mediaImages, setMediaImages] = useState([]);
    const [type, setType] = useState('rules');
    const [currentStep, setCurrentStep] = useState(0);
    const [sheetView, setSheetView] = useState(0);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [goalsItem, setGoalsItem] = useState([]);
    const [clubRules, setClubRules] = useState([]);
    const [addedRoutes, setAddedRoutes] = useState([]);
    const [scheduleList, setScheduleList] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [scheduleName, setScheduleName] = useState('');
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [focusedInput, setFocusedInput] = useState(null);
    const startTimeSheetRef = useRef();
    const endTimeSheetRef = useRef();
    const scheduleSheetRef = useRef();
    const routeSheetRef = useRef();
    const sheetTitle = type === 'rules' ? "Add Rules" : "Add Goals"

    const daysOfWeek = [
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
        { label: 'Wednesday', value: 'Wednesday' },
        { label: 'Thursday', value: 'Thursday' },
        { label: 'Friday', value: 'Friday' },
        { label: 'Saturday', value: 'Saturday' },
        { label: 'Sunday', value: 'Sunday' },
    ];


    const [text, setText] = useState('');
    const [rules, setRules] = useState('');
    const refRBSheet = useRef();
    const mapRef = useRef(null);
    const [selectedView, setSelectedView] = useState(null);
    const items = [
        { id: '1', label: 'Update Club Detail' },
        { id: '2', label: 'Update Routes' },
        { id: '3', label: 'Update Rules' },
        { id: '4', label: 'Update Goals' },
        { id: '5', label: 'Update Categories' },
    ];

    const [loadingImages, setLoadingImages] = useState({});

    const handleImageLoadStart = (index) => {
        setLoadingImages(prevState => ({ ...prevState, [index]: true }));
    };

    const handleImageLoadEnd = (index) => {
        setLoadingImages(prevState => ({ ...prevState, [index]: false }));
    };

    const handleBackPress = () => {
        if (selectedView != null) {
            setSelectedView(null)
            return
        } else {
            resetNavigation(navigation, previousScreen)
        }
        return true;
    }

    useBackHandler(handleBackPress)


    useEffect(() => {
        if (!startPoint && !endPoint) {
            const fetchCurrentLocation = async () => {
                try {
                    const getPosition = () => new Promise((resolve, reject) => {
                        Geolocation.getCurrentPosition(resolve, reject);
                    });

                    const { coords: { latitude, longitude } } = await getPosition();

                    const location = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    };

                    setCurrentLocation(location);

                    // Animate to current location
                    if (mapRef.current) {
                        mapRef.current.animateToRegion(location, 1000);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            };

            fetchCurrentLocation();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        dispatch(getClubDetail(clubId)).then((result) => {
            const { name, description, fee, images, categories, rules, goals } = result?.payload?.result
            setName(name);
            setDescription(description);
            setClubFee(fee)
            setClubRules(rules)
            // if(goals != null){
            //     setGoalsItem(goals)
            // }
            setClubCategories(categories)
            if (images && images.length > 0) {
                const media = images.map((image) => image);
                setMediaImages(media); // Set all images at once
            }
        })
        dispatch(getAllRoutes({ page: 1, limit: 10, searchPayload: {} })).then((result) => {
            const { routes } = result?.payload.result
            setAddedRoutes(routes)
        })
    }, [dispatch, clubId])

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
                    setMediaImages([...mediaImages, imagesResult]);
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
                    setMediaImages([...mediaImages, imagesResult]);
                }
            }).catch(error => {
                console.error('Error uploading image:', error);
            });
            // setMediaImages([...mediaImages, image.path]);
        }).catch(error => {
            console.log('Error capturing image: ', error);
        });
    };


    const handleSelectionChange = (selectedCategories) => {
        setSelectedCategories(selectedCategories);
    };

    const handleItemPress = (id) => {
        setSelectedView(id);
    };

    const handleSheetOpen = () => {
        refRBSheet.current.open();
    };

    const handleSheetClose = () => {
        refRBSheet.current.close();
    };

    const addImage = () => {
        setSheetView(0)
        handleSheetOpen()
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

    const addGoal = () => {
        if (type === 'rules') {
            if (rules.trim()) {
                const payload = {
                    club_id: clubId,
                    rule: rules
                }
                dispatch(createClubRules(payload)).then((result) => {
                    if (result?.payload.success === true) {
                        setClubRules([...clubRules, result?.payload?.result]);
                        showAlert("Success", "success", result?.payload?.message)
                    } else if (result?.payload.success === false) {
                        showAlert("Error", "error", result?.payload?.message)
                    }
                })
                setRules('');
                handleSheetClose()

            }
        } else {
            if (text.trim()) {
                const payload = {
                    club_id: clubId,
                    goal: text
                }
                dispatch(createClubGoal(payload)).then((result) => {
                    if (result?.payload.success === true) {
                        const newGoal = result.payload.result;
                        if (newGoal) {
                            setGoalsItem(prevItems => [...prevItems, newGoal]);
                        }

                        showAlert("Success", "success", result?.payload?.message)
                    } else if (result?.payload.success === false) {
                        showAlert("Error", "error", result?.payload?.message)
                    }
                })
                setText('');
                handleSheetClose()

            }
        }

    };

    const addMore = () => {

        if (type === 'rules') {
            if (rules.trim()) {
                const payload = {
                    club_id: clubId,
                    rule: rules
                }
                dispatch(createClubRules(payload)).then((result) => {
                    if (result?.payload.success === true) {
                        setClubRules([...clubRules, result?.payload?.result]);
                        ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
                    } else if (result?.payload.success === false) {
                        ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
                    }
                })
                setRules('');
            }
        } else {
            if (text.trim()) {
                const payload = {
                    goal: text
                }
                dispatch(createGoals(payload)).then((result) => {
                    if (result?.payload.success === true) {
                        const newGoal = result.payload.result;
                        if (newGoal) {
                            setGoalsItem(prevItems => [...prevItems, newGoal]);
                        }
                        ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
                    } else if (result?.payload.success === false) {
                        ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
                        // showAlert("Error", "error", result?.payload?.message)
                    }
                })
                setText('');
            }
        }


    };


    const removeItem = (item, index) => {

        dispatch(deleteGoal(item?.id)).then((result) => {
            if (result?.payload?.success === true) {
                showAlert("Success", "success", result?.payload?.message)
                const newItems = goalsItem?.filter((_, i) => i !== index);
                setGoalsItem(newItems);
            } else if (result?.payload?.success === false) {
                showAlert("Error", "error", result?.payload?.message)
            }

        })
    };

    const removeRulesItem = (item, index) => {
        dispatch(deleteRule(item?.id)).then((result) => {
            if (result?.payload?.success === true) {
                showAlert("Success", "success", result?.payload?.message)
                const newItems = clubRules?.filter((_, i) => i !== index);
                setClubRules(newItems);
            } else if (result?.payload?.success === false) {
                showAlert("Error", "error", result?.payload?.message)
            }

        })

    };

    const removeRoutes = (item, index) => {
        dispatch(deleteRoute(item?.id)).then((result) => {
            if (result?.payload?.success === true) {
                showAlert("Success", "success", result?.payload?.message)
                const newRoute = addedRoutes?.filter((_, i) => i !== index);
                setAddedRoutes(newRoute);
            } else if (result?.payload?.success === false) {
                showAlert("Error", "error", result?.payload?.message)
            }

        })

    };

    const handleCreateClub = () => {

        // const imageType = mediaImages[0]?.endsWith('.png') ? 'image/png' : 'image/jpg';
        // const formData = new FormData();

        // const { name, description, fee } = createClubValues();
        // const clubFee = parseInt(fee);
        // mediaImages?.forEach((image, index) => {
        //     if (image && image.trim()) {
        //         formData.append('images', {
        //             uri: image,
        //             type: imageType,
        //             name: `image_${Date.now()}_${index}.${imageType.split('/')[1]}`,
        //         });
        //     }
        // });
        // formData.append('name', name);
        // formData.append('description', description);
        // formData.append('fee', clubFee);
        // formData.append('user_id', user_id);

        const mediaImagesData = mediaImages?.map((image, index) => ({
            url: image?.url,
            public_id: image?.public_id
        }));

        const dataPayload = {
            name,
            description,
            fee: clubFee,
            user_id: user_id,
            images: mediaImagesData,
        };

        const payload = {
            method: "PUT",
            data: dataPayload,
            clubID: clubId
        }

        dispatch(createClub(payload)).then((result) => {
            if (result?.payload?.success === true) {
                showAlert("Success", "success", result?.payload?.message)
                const timer = setTimeout(() => {
                    setSelectedView(null)
                }, 3000);
                return () => clearTimeout(timer);

            } else if (result?.payload?.success === false) {

            }
        })

    }

    const updateIntersets = () => {
        const categoryIds = "{" + selectedCategories.join(",") + "}";
        const dataPayload = {
            category_ids: categoryIds,
            user_id: user_id
        }
        const payload = {
            method: "PUT",
            data: dataPayload,
            clubID: clubId
        }

        dispatch(createClub(payload)).then((result) => {
            if (result?.payload?.success === true) {
                showAlert("Success", "success", result?.payload?.message)
                const timer = setTimeout(() => {
                    setSelectedView(null)
                }, 3000);
                return () => clearTimeout(timer);

            } else if (result?.payload?.success === false) {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }


    const onPlaceSelected = async (details, flag, index = null) => {
        const location = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        };

        const elev = await getElevation(location.latitude, location.longitude);

        if (mapRef.current) {
            mapRef.current.animateToRegion(location, 1000);
        }

        if (flag === 'start') {
            //setStartPoint(location);
            setStartPoint({ ...location, elevation: elev, location_name: details?.formatted_address });
        } else if (flag === 'end') {
            //setEndPoint(location);
            setEndPoint({ ...location, elevation: elev, location_name: details?.formatted_address });
        }

        else {
            // Update a specific waypoint if index is provided
            if (index !== null) {
                const updatedWaypoints = [...waypoints];
                updatedWaypoints[index] = { ...location, elevation: elev, location_name: details?.formatted_address };
                setWaypoints(updatedWaypoints);
            } else {
                // Add a new waypoint
                setWaypoints((prevWaypoints) => [
                    ...prevWaypoints,
                    { ...location, elevation: elev, location_name: details?.formatted_address },
                ]);
            }
        }

    };


    const handleRemoveWaypoint = (index) => {
        setWaypoints(waypoints.filter((_, i) => i !== index)); // Remove the waypoint at the specified index
    };

    const handleAddWaypoint = () => {
        setWaypoints([...waypoints, '']); // Add a placeholder for the new waypoint
    };


    const resetRoute = () => {
        routeSheetRef?.current.close()
        setWaypoints([''])
        setStartPoint(null)
        setEndPoint(null)
    }

    const handleCreateClubRoute = () => {
        const modifiedWayPoints = waypoints?.map(item => ({
            lat: item.latitude,
            long: item.longitude,
            elevation: item.elevation
        }));

        const routePayload = {
            user_id: user_id,
            club_id: clubId,
            start_loc_name: startPoint?.location_name,
            end_loc_name: endPoint?.location_name,
            start_lat: startPoint?.latitude,
            start_long: startPoint?.longitude,
            start_elevation: startPoint?.elevation,
            end_lat: endPoint?.latitude,
            end_long: endPoint?.longitude,
            end_elevation: endPoint.elevation,
            waypoints: modifiedWayPoints
        }

        dispatch(createClubRoute(routePayload)).then((result) => {
            if (result?.payload?.success === true) {
                const routeData = result?.payload?.result
                setAddedRoutes(prevArray => [...prevArray, routeData]);
                resetRoute();
                const timer = setTimeout(() => {
                    showAlert("Success", "success", result?.payload?.message)
                }, 500);
                return () => clearTimeout(timer);

            } else if (result?.payload?.success === false) {
                showAlert("Error", "error", result?.payload?.message)
            }
        })

    }


    const renderRouteView = () => {

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.searchBox}>
                    <GooglePlacesAutocomplete
                        placeholder="Start Point"
                        onPress={(data, details = null) => onPlaceSelected(details, 'start')}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'en',
                        }}
                        fetchDetails
                        styles={{
                            container: { flex: 0, width: width * 0.9 },
                            listView: { backgroundColor: 'white' },
                            textInputContainer: { backgroundColor: 'transparent' },
                            textInput: [
                                styles.googleInput,
                                focusedInput === 'start' && styles.focusedInput, // Change styles on focus
                            ],
                        }}
                        textInputProps={{
                            placeholderTextColor: focusedInput === 'start' ? theme.colors.labelColors : theme.colors.placeholderColor,
                            onFocus: () => setFocusedInput('start'),
                            onBlur: () => setFocusedInput(null),
                        }}
                    />
                    <GooglePlacesAutocomplete
                        placeholder="End Point"
                        onPress={(data, details = null) => onPlaceSelected(details, 'end')}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'en',
                        }}
                        fetchDetails
                        styles={{
                            container: { flex: 0, width: width * 0.9 },
                            listView: { backgroundColor: 'white' },
                            textInputContainer: { backgroundColor: 'transparent' },
                            textInput: [
                                styles.googleInput,
                                focusedInput === 'end' && styles.focusedInput, // Change styles on focus
                            ],
                        }}
                        textInputProps={{
                            placeholderTextColor: focusedInput === 'end' ? theme.colors.labelColors : theme.colors.placeholderColor,
                            onFocus: () => setFocusedInput('end'),
                            onBlur: () => setFocusedInput(null),
                        }}
                    />
                    <View style={{}}>
                        {waypoints?.map((waypoint, index) => (
                            <View
                                key={index}
                            >

                                <GooglePlacesAutocomplete
                                    key={index}
                                    placeholder={`Waypoint ${index + 1}`}
                                    onPress={(data, details = null) => onPlaceSelected(details, 'waypoint', index)}
                                    query={{ key: GOOGLE_API_KEY, language: 'en' }}
                                    fetchDetails
                                    styles={{
                                        container: { flex: 0, width: '95%' },
                                        textInput: [
                                            styles.googleInput,
                                            focusedInput === `waypoint-${index}` && styles.focusedInput, // Change styles on focus
                                        ],
                                    }}
                                    textInputProps={{
                                        placeholderTextColor: focusedInput === `waypoint-${index}` ? theme.colors.labelColors : theme.colors.placeholderColor,
                                        onFocus: () => setFocusedInput(`waypoint-${index}`),
                                        onBlur: () => setFocusedInput(null),
                                    }}
                                />

                                {index !== 0 && <TouchableOpacity
                                    style={styles.removeWaypoints}
                                    onPress={() => handleRemoveWaypoint(index)}
                                >
                                    <AddIcon name="closecircle" size={24} color={theme.colors.error} />
                                </TouchableOpacity>}

                            </View>

                        ))}

                        {/* Single Add Waypoint Button */}
                        <TouchableOpacity style={styles.removeWaypoints} onPress={handleAddWaypoint}>
                            <AddIcon name="pluscircle" size={24} color={theme.colors.textHeading} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.mapContainer}>

                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{
                            latitude: currentLocation?.latitude || 37.78825,
                            longitude: currentLocation?.longitude || -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}

                    >
                        {currentLocation && !startPoint && (
                            <Marker
                                coordinate={currentLocation}
                                title="Current Location"
                            />
                        )}
                        {startPoint && <Marker tracksViewChanges={false} coordinate={startPoint} title={`Start\t\tElevation ${startPoint?.elevation}`} >
                            <View>
                                <Image style={styles.marker} source={mapMarker} />
                            </View>

                            {/* <Callout
                    tooltip={true}>
                    <MarkerCallout point={"Start"} elevation={startPoint?.elevation} />
                </Callout> */}
                        </Marker>}
                        {endPoint && <Marker tracksViewChanges={false} coordinate={endPoint} title={`End\t\tElevation ${endPoint?.elevation}`}>
                            <View>
                                <Image style={styles.marker} source={mapMarker} />
                            </View>
                            {/* <Callout
                    tooltip={true}>
                    <MarkerCallout point={"End"} elevation={endPoint?.elevation} />
                </Callout> */}
                        </Marker>}
                        {/* {wayPoints?.map((point, index) => (
                <Marker key={`waypoint-${index}`} coordinate={point} title={`Waypoint ${index + 1}`} >
                    <WaypointIcon />
                </Marker>
            ))} */}

                        {waypoints?.map((point, index) => (
                            point.latitude && (
                                <Marker
                                    tracksViewChanges={false}
                                    key={`waypoint-${index}`}
                                    coordinate={point}
                                    title={`Waypoint ${index + 1}\t\t${point?.elevation}`} >
                                    <WaypointIcon />
                                </Marker>
                            )
                        ))}
                        {startPoint && endPoint && (
                            <MapViewDirections
                                origin={startPoint}
                                destination={endPoint}
                                // waypoints={wayPoints}
                                waypoints={waypoints}
                                apikey={GOOGLE_API_KEY}
                                strokeWidth={3}
                                strokeColor={theme.colors.secondary}
                            />
                        )}
                    </MapView>

                </View>
                <Button
                    loading={routeLoader}
                    onPress={() => {

                        handleCreateClubRoute()
                    }}
                    title={"Save Route"}
                    customStyle={{ width: '100%', }}
                />
            </View>
        );

    }

    const addRoutes = () => {

        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                {/* <Text style={styles.heading}>
                    Add Routes
                </Text> */}


                <View style={{ marginTop: 20 }}>


                    {
                        addedRoutes?.map((item, index) => {
                            return <View key={index}>
                                <AddedRouteItem
                                    startLoc={item?.start_loc_name}
                                    endLoc={item?.end_loc_name}
                                    onRemove={() => removeRoutes(item, index)} />
                            </View>
                        })
                    }

                    <RBSheet
                        ref={routeSheetRef}
                        height={height}
                        openDuration={250}
                        customStyles={{ container: styles.scheduleSheet }}
                        closeOnPressBack={true}
                    >

                        {renderRouteView()}

                    </RBSheet>

                    <Button
                        onPress={() => {
                            routeSheetRef?.current.open()
                        }}
                        title={"Add Route"}
                        customStyle={styles.addGoalStyle}
                        textCustomStyle={{
                            color: '#888888',
                        }}
                    />

                </View>


            </View>
        )

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
                        {sheetTitle}
                    </Text>

                    <TouchableOpacity onPress={handleSheetClose}>
                        <CloseIcon width={24} height={24} />
                    </TouchableOpacity>


                </View>

                {
                    type === 'rules' ? <CustomTextInput
                        identifier={'add_rules'}
                        value={rules}
                        onValueChange={setRules}
                        multiline={true}
                        autoCapitalize='sentences'
                    /> : <CustomTextInput
                        identifier={'add_goal'}
                        value={text}
                        onValueChange={setText}
                        multiline={true}
                        autoCapitalize='sentences'
                    />
                }



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

    const createClubSection = () => {

        return (
            <CustomLayout>
                <View style={styles.sectionContainer}>
                    {/* <Text style={styles.heading}>
                        Create Club
                    </Text> */}

                    {addMediaSection()}

                    <CustomTextInput
                        label={"Name of Club"}
                        identifier={'club_name'}
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

                    <CustomTextInput
                        label={"Add club fee"}
                        identifier={'club_fee'}
                        customContainerStyle={styles.customInput}
                        inputType={"number-pad"}
                        value={clubFee}
                        onValueChange={setClubFee}
                    />

                </View>
                <Button
                    loading={clubLoader}
                    onPress={handleCreateClub}
                    title={"Update"}
                    customStyle={{ marginBottom: 10, marginTop: scaleHeight(30) }}
                />
            </CustomLayout>
        )

    }

    const addGoalsSection = () => {

        return (
            <View style={{ padding: 20 }}>
                {/* <Image style={styles.image} source={addGoalsImg} /> */}
                {/* <Text style={styles.heading}>
                    Update your Goals
                </Text>

                <Text style={[styles.heading, {
                    fontSize: normalizeFontSize(14),
                    color: theme.colors.lightGrey,
                    width: '70%',
                    marginTop: scaleHeight(10),
                }]}>
                    This will be shown in your Profile as a goals.
                </Text> */}

                <View style={{ marginTop: 20 }}>
                    {
                        goalsItem?.map((item, index) => {
                            return <View key={index}>
                                <GoalsItem
                                    item={item?.goal}
                                    onRemove={() => removeItem(item, index)}
                                />
                            </View>
                        })
                    }

                    <Button
                        onPress={() => {
                            setType("goals")
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

    const addRulesSection = () => {

        return (
            <View style={{ padding: 20 }}>

                {/* <Text style={styles.heading}>
                    Upadte Club Rules
                </Text> */}

                <View style={{ marginTop: 20 }}>
                    {
                        clubRules?.map((item, index) => {
                            return <View key={index}>
                                <GoalsItem
                                    item={item?.rule}
                                    onRemove={() => removeRulesItem(item, index)}
                                />
                            </View>
                        })
                    }

                    <Button
                        onPress={() => {
                            setType("rules")
                            setSheetView(1)
                            handleSheetOpen()
                        }}
                        title={"Add Rules"}
                        customStyle={styles.addGoalStyle}
                        textCustomStyle={{
                            color: '#888888',
                        }}
                    />

                </View>


            </View>
        )

    }

    const selectInterestsSection = () => {

        return (
            <>
                <View style={{ padding: 20, flex: 1 }}>

                    <View style={{ marginTop: 30, }}>
                        <InterestList
                            interests={categories}
                            //interests={categories?.subCategory}
                            onSelectionChange={handleSelectionChange} />
                    </View>



                </View>
                <Button
                    loading={clubLoader}
                    onPress={updateIntersets}
                    title={'Update'} /></>
        )

    }

    const renderSelectedView = () => {
        switch (selectedView?.id) {
            case '1':
                return (
                    createClubSection()
                );
            case '2':
                return (
                    addRoutes()
                );
            case '3':
                return (addRulesSection());
            case '4':
                return (
                    addGoalsSection()
                );
            case '5':
                return (
                    selectInterestsSection()
                );
            default:
                return null;
        }
    };

    const renderSheetView = () => {
        switch (sheetView) {
            case 0:
                return (
                    photoSelectorView()
                );
            case 1:
                return (
                    addGoalsItemView()
                );
            default:
                return (
                    photoSelectorView()
                );
        }

    }

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
                { backgroundColor: theme.colors.primary }, sheetView === 1 && { height: keyboardStatus ? '60%' : '37%' }]
            }}
        >

            {renderSheetView()}

        </RBSheet>
    }


    return (
        <SafeAreaView style={styles.container}>
            <Header
                onBackPress={handleBackPress}
                isBackIcon={true}
                title={"Update Club"}
            />

            {selectedView === null ? (
                items.map((item, index) => (
                    <ItemWithEditAction
                        key={index}
                        label={item?.label}
                        onItemPress={() => handleItemPress(item)}
                    />
                ))
            ) : (
                renderSelectedView()
            )}
            {renderBottomSheet()}
        </SafeAreaView>
    );
};

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
    addGoalStyle: {
        width: '70%',
        backgroundColor: theme.colors.transparent,
        borderColor: '#888888',
        borderStyle: 'dashed',
        borderWidth: 2,
        marginTop: 30
    },
    map: {
        ...StyleSheet.absoluteFillObject,

    },
    searchBox: {
        //position: 'absolute',
        top: 20,
        width: width * 0.9,
    },
    marker: {
        width: scaleWidth(40),
        height: scaleHeight(40)
    },
    mapContainer: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        // height: '70%',
        marginTop: '10%',
    },
    googleInput: {
        fontSize: scaleHeight(14),
        fontFamily: fonts.fontsType.medium,
        color: theme.colors.labelColors,
        backgroundColor: theme.colors.inputBg,
        borderRadius: 30,
        padding: 10
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
    label: {
        marginTop: 16,
        fontFamily: fonts.fontsType.bold,
        fontSize: normalizeFontSize(14),
        color: theme.colors.white,
        marginHorizontal: 10,
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
    }

});

export default UpdateClub;
