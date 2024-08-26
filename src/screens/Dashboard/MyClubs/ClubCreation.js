import React, { memo, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Keyboard, ToastAndroid, Dimensions, Animated, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Button from '../../../components/ButtonComponent';
import Icon from 'react-native-vector-icons/MaterialIcons'
import AddIcon from 'react-native-vector-icons/AntDesign'
import Cross from 'react-native-vector-icons/Entypo'
import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../providers/AlertContext';
import { resetNavigation } from '../../../utils/resetNavigation';
import { SCREENS } from '../../../constant/constants';
import useBackHandler from '../../../utils/useBackHandler';
import InterestList from '../../../components/InterestList';
import { BackButton, CloseIcon, WaypointIcon } from '../../../assets/svgs';
import { normalizeFontSize, scaleHeight, scaleWidth } from '../../../styles/responsive';
import CustomLayout from '../../../components/CustomLayout';
import theme from '../../../styles/theme';
import fonts from '../../../styles/fonts';
import GoalsItem from '../../../components/GoalsItem';
import CustomTextInput from '../../../components/TextInputComponent';
import { createGoals } from '../../../redux/AuthSlices/createGoalsSlice';
import { addGoalsImg, mapMarker, wayPointImg } from '../../../assets/images';
import { getCategories } from '../../../redux/AuthSlices/getCategoriesSlices';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import { GOOGLE_API_KEY } from '@env'
import { getElevation } from '../../../utils/elevationService';
import MarkerCallout from '../../../components/MarkerCallout';
import { createClubRules } from '../../../redux/ClubCreation/createClubRulesSlice';
import { createClub } from '../../../redux/ClubCreation/createClubSlice';
import { createClubRoute } from '../../../redux/ClubCreation/createClubRouteSlice';
import { createSchedule } from '../../../redux/ClubCreation/createScheduleSlice';
import AddedRouteItem from '../../../components/AddedRouteItem';
import { uploadImage } from '../../../redux/cloudinarySlice';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { createClubGoal } from '../../../redux/ClubCreation/createClubGoalSlice';


const { width, height } = Dimensions.get('window');

const ClubCreation = ({ navigation }) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const { categories } = useSelector((state) => state.categories)
    const { loading } = useSelector((state) => state.createClub)
    const { loading: routeLoader } = useSelector((state) => state.createClubRoute)
    const { loading: scheduleLoading } = useSelector((state) => state.createSchedule)
    const { user_id } = useSelector((state) => state.auth)
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [wayPoints, setWayPoints] = useState([]);
    const [waypoints, setWaypoints] = useState(['']);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [clubFee, setClubFee] = useState(0);
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
    const [clubId, setClubId] = useState(null);
    const refRBSheet = useRef();
    const mapRef = useRef(null);
    const ref = useRef();
    const buttonTitle = currentStep == 4 ? "Create Club" : "Continue"
    const sheetTitle = type === 'rules' ? "Add Rules" : "Add Goals"

    const [loadingImages, setLoadingImages] = useState({});

    const handleImageLoadStart = (index) => {
        setLoadingImages(prevState => ({ ...prevState, [index]: true }));
    };

    const handleImageLoadEnd = (index) => {
        setLoadingImages(prevState => ({ ...prevState, [index]: false }));
    };



    const handleBackPress = () => {
        resetNavigation(navigation, SCREENS.MAIN_DASHBOARD, { screen: SCREENS.CLUBS })
        return true;
    }

    useBackHandler(handleBackPress)

    const handleSelectionChange = (selectedCategories) => {
        setSelectedCategories(selectedCategories);
    };

    const createClubValues = () => {
        return {
            name: name,
            description: description,
            fee: clubFee,
        };
    };



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
        const fetchAllAPIsData = async () => {
            try {
                await Promise.all([
                    dispatch(getCategories({ isCategory: true }))
                ]);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchAllAPIsData();
    }, [dispatch]);

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



        // else {
        //     // setWayPoints((prevWayPoints) => [...prevWayPoints, location]);
        //     setWayPoints((prevWayPoints) => [
        //         ...prevWayPoints,
        //         { ...location, elevation: elev },
        //     ]);
        // }
    };

    const handleRemoveWaypoint = (index) => {
        setWaypoints(waypoints.filter((_, i) => i !== index)); // Remove the waypoint at the specified index
    };

    const handleAddWaypoint = () => {
        setWaypoints([...waypoints, '']); // Add a placeholder for the new waypoint
    };


    const handleCreateClub = () => {

        if (mediaImages?.length === 0) {
            showAlert("Error", "error", "Select at least 1 club photo.")
            return
        }

        // const imageType = mediaImages[0]?.endsWith('.png') ? 'image/png' : 'image/jpg';
        // const formData = new FormData();

        const { name, description, fee } = createClubValues();
        const clubFee = parseInt(fee);

        const mediaImagesData = mediaImages.map((image, index) => ({
            url: image?.secure_url,
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
            method: "POST",
            data: dataPayload
        }

        dispatch(createClub(payload)).then((result) => {
            if (result?.payload?.success === true) {
                setClubId(result?.payload?.result?.id)
                showAlert("Success", "success", result?.payload?.message)
                const timer = setTimeout(() => {
                    setCurrentStep(prevStep => prevStep + 1);
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
                    handleBackPress()
                }, 3000);
                return () => clearTimeout(timer);

            } else if (result?.payload?.success === false) {
                showAlert("Error", "error", result?.payload?.message)
            }
        })
    }

    const handleCreateClubRoute = () => {
        // const modifiedWayPoints = wayPoints?.map(item => ({
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

    const addGoal = () => {
        if (type === 'rules') {
            if (rules.trim()) {
                setClubRules([...clubRules, rules]);
                const payload = {
                    club_id: clubId,
                    rule: rules
                }
                dispatch(createClubRules(payload)).then((result) => {
                    if (result?.payload.success === true) {
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
                setGoalsItem([...goalsItem, text]);
                const payload = {
                    club_id: clubId,
                    goal: text
                }
                dispatch(createClubGoal(payload)).then((result) => {
                    if (result?.payload.success === true) {
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
                setClubRules([...clubRules, rules]);
                const payload = {
                    club_id: clubId,
                    rule: rules
                }
                dispatch(createClubRules(payload)).then((result) => {
                    if (result?.payload.success === true) {
                        ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
                    } else if (result?.payload.success === false) {
                        ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
                    }
                })
                setRules('');
            }
        } else {
            if (text.trim()) {
                setGoalsItem([...goalsItem, text]);
                const payload = {
                    club_id: clubId,
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
        }


    };

    const removeItem = (index) => {
        const newItems = goalsItem?.filter((_, i) => i !== index);
        setGoalsItem(newItems);
    };

    const removeRulesItem = (index) => {
        const newItems = clubRules?.filter((_, i) => i !== index);
        setClubRules(newItems);
    };

    const removeScheduleItem = (index) => {
        const newItems = scheduleList?.filter((_, i) => i !== index);
        setScheduleList(newItems);
    };

    const resetScheduleForm = () => {
        scheduleSheetRef?.current.close()
        setScheduleName('')
        setDay('');
        setStartTime(new Date())
        setEndTime(new Date())
    }

    const resetRoute = () => {
        routeSheetRef?.current.close()
        setWaypoints([''])
        setStartPoint(null)
        setEndPoint(null)
    }

    const removeRoutes = (index) => {
        const newRoute = addedRoutes?.filter((_, i) => i !== index);
        setAddedRoutes(newRoute);
    };

    const handleCreateSchedule = () => {

        const payload = {
            club_id: clubId,
            user_id: user_id,
            day: day,
            time_name: scheduleName,
            start_time: moment(startTime).format('hh:mm:ss'),
            end_time: moment(endTime).format('hh:mm:ss')
        }

        dispatch(createSchedule(payload)).then((result) => {
            if (result?.payload.success === true) {
                //showAlert("Success", "success", result?.payload?.message)
                ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
                setScheduleList([...scheduleList, scheduleName]);
                resetScheduleForm();

            } else if (result?.payload.success === false) {
                //showAlert("Error", "error", result?.payload?.message)
                ToastAndroid.show(result?.payload?.message, ToastAndroid.SHORT);
            }
        })
    }


    const pickImageFromGallery = () => {
        ImagePicker.openPicker({
            width: 600,
            height: 400,
        }).then(image => {
            handleSheetClose();

            dispatch(uploadImage(image.path)).then((result) => {
                if (result?.payload) {
                    // Assuming result.payload contains the URL of the uploaded image
                    const uploadedImageUrl = result.payload;
                    setMediaImages([...mediaImages, uploadedImageUrl]);
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
                    const uploadedImageUrl = result.payload;
                    setMediaImages([...mediaImages, uploadedImageUrl]);
                }
            }).catch(error => {
                console.error('Error uploading image:', error);
            });

            // setMediaImages([...mediaImages, image.path]);
        }).catch(error => {
            console.log('Error capturing image: ', error);
        });
    };


    const handleNextStep = () => {
        if (currentStep === 0) {
            handleCreateClub();
            return
        }

        // if (currentStep === 1) {
        //     handleCreateClubRoute();
        //     return
        // }
        if (currentStep == 5) {
            updateIntersets()
            return
        }
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
        handleSheetOpen()
    };

    const removeImage = (index) => {
        const newImages = [...mediaImages];
        newImages.splice(index, 1);
        setMediaImages(newImages);
    };

    const createScheduleSection = () => {
        return (
            <View>
                <Text style={styles.heading}>
                    Add Schedule
                </Text>
                <CustomTextInput
                    label={"Name of Schedule"}
                    identifier={'schedule_name'}
                    value={scheduleName}
                    onValueChange={setScheduleName}
                    mainContainer={{ marginTop: scaleHeight(40) }}
                    autoCapitalize={'sentences'}
                />

                <Text style={styles.label}>Select Day</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={day}
                        onValueChange={(itemValue) => setDay(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={theme.colors.white}
                        dropdownIconRippleColor={theme.colors.secondary}
                    >
                        <Picker.Item label="Select a day" value="" />
                        {daysOfWeek?.map((day, index) => (
                            <Picker.Item label={day?.label} value={day?.value} key={index} />
                        ))}
                    </Picker>
                </View>

                {/* Start Date Picker */}
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity onPress={() => startTimeSheetRef.current.open()} style={styles.dateButton}>
                    <Text style={styles.dateText}>
                        {`${moment(startTime).format('hh:mm:ss A')}`}
                    </Text>
                </TouchableOpacity>

                {/* End Date Picker */}
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity onPress={() => endTimeSheetRef.current.open()} style={styles.dateButton}>
                    <Text style={styles.dateText}>
                        {`${moment(endTime).format('hh:mm A')}`}
                    </Text>
                </TouchableOpacity>

                {/* Start Date Bottom Sheet */}
                <RBSheet
                    ref={startTimeSheetRef}
                    height={300}
                    openDuration={250}
                    customStyles={{ container: styles.bottomSheet }}
                >
                    <View style={styles.pickerWrapper}>
                        <DatePicker
                            date={startTime}
                            onDateChange={setStartTime}
                            mode="time"
                        />
                        <Button
                            onPress={() => {
                                startTimeSheetRef.current.close()
                            }}
                            title={"Confirm Start Time"} />
                    </View>
                </RBSheet>

                {/* End Date Bottom Sheet */}
                <RBSheet
                    ref={endTimeSheetRef}
                    height={300}
                    openDuration={250}
                    customStyles={{ container: styles.bottomSheet }}
                >

                    <View style={styles.pickerWrapper}>
                        <DatePicker
                            date={endTime}
                            onDateChange={setEndTime}
                            mode="time"
                            textColor="red"
                            fadeToColor="white"
                        />

                        <Button
                            onPress={() => {
                                endTimeSheetRef.current.close()
                            }}
                            title={"Confirm End Time"} />
                    </View>
                </RBSheet>

                <Button
                    loading={scheduleLoading}
                    onPress={() => {
                        handleCreateSchedule()
                    }}
                    title={"Save Schedule"}
                    customStyle={{ width: '100%', }}
                />
            </View>
        );
    }

    const createScheduleSec = () => {

        return (
            <View>

                <Text style={styles.heading}>
                    Add Schedule
                </Text>

                <View style={{ marginTop: 20 }}>

                    {
                        scheduleList?.map((item, index) => {
                            return <View key={index}>
                                <GoalsItem
                                    item={item}
                                    onRemove={() => removeScheduleItem(index)}
                                />
                            </View>
                        })
                    }

                    <RBSheet
                        ref={scheduleSheetRef}
                        height={height}
                        openDuration={250}
                        customStyles={{ container: styles.scheduleSheet }}
                        closeOnPressBack={true}
                    >

                        {createScheduleSection()}

                    </RBSheet>

                    <Button
                        onPress={() => {
                            scheduleSheetRef?.current.open()
                        }}
                        title={"Add Schedule"}
                        customStyle={styles.addGoalStyle}
                        textCustomStyle={{
                            color: '#888888',
                        }}
                    />

                </View>


            </View>
        )

    }


    const createClubSection = () => {

        return (
            <CustomLayout>
                <View style={styles.sectionContainer}>
                    <Text style={styles.heading}>
                        Create Club
                    </Text>

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
            </CustomLayout>
        )

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

            }}>
                <Text style={styles.heading}>
                    Add Routes
                </Text>


                <View style={{ marginTop: 20 }}>


                    {
                        addedRoutes?.map((item, index) => {
                            return <View key={index}>
                                <AddedRouteItem
                                    startLoc={item?.start_loc_name}
                                    endLoc={item?.end_loc_name}
                                    onRemove={() => removeRoutes(index)} />
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
                            source={{ uri: image?.secure_url }}
                            style={styles.mediaImage}
                            onLoadStart={() => handleImageLoadStart(index)}
                            onLoadEnd={() => handleImageLoadEnd(index)}
                        />
                        <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                            <Cross name='cross' size={16} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity style={styles.addButton} onPress={addImage}>
                    <Cross name='plus' size={24} color={"#888888"} />
                </TouchableOpacity>
            </View>
        )

    }

    const addGoalsSection = () => {

        return (
            <View>
                <Image style={styles.image} source={addGoalsImg} />
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
            <View>

                <Text style={styles.heading}>
                    Add Club Rules
                </Text>

                <View style={{ marginTop: 20 }}>
                    {
                        clubRules?.map((item, index) => {
                            return <View key={index}>
                                <GoalsItem
                                    item={item}
                                    onRemove={() => removeRulesItem(index)}
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
            <View>

                <Text style={[styles.heading, { width: '55%' }]}>
                    Pick your Top interests
                </Text>
                <View style={{ marginTop: 30 }}>
                    <InterestList
                        interests={categories?.category}
                        //interests={categories?.subCategory}
                        onSelectionChange={handleSelectionChange} />
                </View>
            </View>
        )

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

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    createClubSection()
                );
            case 1:
                return (
                    addRoutes()
                );

            case 2:
                return (
                    createScheduleSec()
                );
            case 3:
                return (
                    addGoalsSection()
                );

            case 4:
                return (
                    addRulesSection()
                );
            case 5:
                return (
                    selectInterestsSection()
                );
            default:
                return null;
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {currentStep != 0 && <TouchableOpacity onPress={() => { handlePreviousStep() }} style={styles.backButton}>
                <BackButton width={scaleWidth(40)} height={scaleHeight(40)} />
            </TouchableOpacity>}
            <View style={{
                flex: 1
            }}>
                {renderStep()}
            </View>

            {/* <CustomLayout>
                {renderStep()}
            </CustomLayout> */}
            <Button
                loading={loading}
                onPress={handleNextStep}
                title={buttonTitle}
                customStyle={{ marginBottom: 10 }}
            />
            {renderBottomSheet()}
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
        marginTop: scaleHeight(20),
        width: '70%'
    },
    sectionContainer: {

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


export default ClubCreation;
