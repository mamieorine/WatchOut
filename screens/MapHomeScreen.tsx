import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { View } from '../components/Themed';
import GooglePlacesInput from '../components/DestinationSearch';
import DestinationPopup from '../components/DestinationSheet';
import { separateCrimeTypes, Crimes, Crime } from '../functions/helper';
import MapViewDirections, { MapViewDirectionsMode } from 'react-native-maps-directions';
import MapView, { Callout, Marker, EventUserLocation, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import axios from 'axios';
import { Actionsheet, Text, Modal, Row, Stack, useDisclose, Box, Heading, Input, Icon, HStack, Spinner, NativeBaseProvider, Center, Pressable } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import busStop from '../assets/files/bus-stop-cleaned.json';
import RoutePopup from '../components/RouteSheet';
import { Header, Button, Card, Chip, Overlay } from 'react-native-elements';
import SecureRoutePopup from '../components/SecureRouteSheet';
import AlertPopup from '../components/AlertSheet';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const baseUrl = 'https://data.police.uk/api';
const GOOGLE_MAPS_APIKEY = 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo';

interface Coordinate {
  latitude: number,
  longitude: number
}

function Example() {
  const [selected, setSelected] = React.useState(1);
  return <NativeBaseProvider>
      <Box flex={1} bg="white" safeAreaTop width="100%" maxW="300px" alignSelf="center">
        <Center flex={1}></Center>
        <HStack bg="indigo.600" alignItems="center" safeAreaBottom shadow={6}>
          <Pressable opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => setSelected(0)}>
            <Center>
              <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? "home" : "home-outline"} />} color="white" size="sm" />
              <Text color="white" fontSize="12">
                Home
              </Text>
            </Center>
          </Pressable>
          <Pressable opacity={selected === 1 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(1)}>
            <Center>
              <Icon mb="1" as={<MaterialIcons name="search" />} color="white" size="sm" />
              <Text color="white" fontSize="12">
                Search
              </Text>
            </Center>
          </Pressable>
          <Pressable opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(2)}>
            <Center>
              <Icon mb="1" as={<MaterialCommunityIcons name={selected === 2 ? "cart" : "cart-outline"} />} color="white" size="sm" />
              <Text color="white" fontSize="12">
                Cart
              </Text>
            </Center>
          </Pressable>
          <Pressable opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(3)}>
            <Center>
              <Icon mb="1" as={<MaterialCommunityIcons name={selected === 3 ? "account" : "account-outline"} />} color="white" size="sm" />
              <Text color="white" fontSize="12">
                Account
              </Text>
            </Center>
          </Pressable>
        </HStack>
      </Box>
    </NativeBaseProvider>;
}

export default function MapHomeScreen(props: { destination: any, dataRoutes: any, isShowDestinationSheet: boolean }) {
  const h1Ref = useRef<MapView>(null);
	const navigation = useNavigation();
  const location = useRoute();

  const [isFirstVisit, setFirstVisit] = useState(true);
  const [crimes, initialCrimes] = useState<Crimes[]>([]);
  const [rawCrimesData, onCrimesRawDataChange] = useState<Crimes[]>([]);
  const [filteredBusStop, setFilteredBusStop] = useState<any[]>([]);

  const params: any = location.params;
  const destinationRoute = params?.destination;
  const routesData = params?.dataRoutes;
  const isShowDestinationSheet = params?.isShowDestinationSheet;

	const [filterCrimes, onFilterCrimesChange] = useState<any>(['Violence Against The Person',
  'Vehicle', 'Theft', 'Drugs', 'Violent Crime', 'Robbery', 'Sexual Offense', 'Arson', 'Others'])

  const [delta, onDeltaChange] = useState({
		latitudeDelta: 0,
		longitudeDelta: 0
	});

  const [destination, onDestinationChange] = useState({
    place_id: '', name: '', address: '',
    latitude: 50.9044082,
    longitude: -1.405594
	});

  const [centerGeometry, onCenterGeometryChange] = useState({
		latitude: 50.9044082,
		longitude: -1.405594
	});

  const [polyGeometry, onPolyGeometryChange] = useState([
		{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 }
  ]);

  const [currentGeometry, onCurrentGeometryChange] = useState({
		latitude: 50.9044082,
		longitude: -1.405594
	});

  const [isDestSheetVisible, setDestSheetVisible] = useState(false);
  const [isRouteSheetVisible, setRouteSheetVisible] = useState(false);
  const [isSecureRouteSheetVisible, setSecureRouteSheetVisible] = useState(false);
  const [isAlertSheetVisible, setAlertSheetVisible] = useState(false);
  const [isCheckedInSheetVisible, setCheckedInSheetVisible] = useState(false);
  const [isReportModelVisible, setReportModelVisible] = useState(false);
  const [isFriendModelVisible, setFriendModelVisible] = useState(false);
  const [isBusStopVisible, setBusStopVisible] = useState(false);
  const [isCrimeVisible, setCrimesVisible] = useState(true);
  const [isBottomTabClicked, onBottomTabClicked] = useState(false);
  const locationCrimes: any = [];

  // useLayoutEffect(() => {
  //   if (!h1Ref.current) return;

  //   h1Ref.current.animateToRegion({
  //     latitude: isFirstVisit ? currentGeometry.latitude : centerGeometry.latitude,
  //     longitude: isFirstVisit ? currentGeometry.longitude : centerGeometry.longitude,
  //     latitudeDelta: isFirstVisit ? 0.02 : delta.latitudeDelta,
  //     longitudeDelta: isFirstVisit ? 0.02 : delta.longitudeDelta,
  //   }, 2000)
  // })

  useEffect(() => {
    if (!h1Ref.current) return;

    h1Ref.current.animateToRegion({
      latitude: isFirstVisit ? currentGeometry.latitude : centerGeometry.latitude,
      longitude: isFirstVisit ? currentGeometry.longitude : centerGeometry.longitude,
      latitudeDelta: isFirstVisit ? 0.02 : delta.latitudeDelta,
      longitudeDelta: isFirstVisit ? 0.02 : delta.longitudeDelta,
    }, 2000)
  }, [centerGeometry])

  useEffect(() => {
    if (isShowDestinationSheet) {
      setDestSheetVisible(true)
    }
  }, [isShowDestinationSheet])

  useEffect(() => {
    let polyStr = '';
    if (isFirstVisit) return;

    if (polyGeometry.length == 1) {
      polyStr = '50.904784,-1.408083:50.90271,-1.403046:50.912051,-1.4029:50.913540,-1.397047';
    }
    else {
      polyGeometry.forEach((coordinate: Coordinate, index: number) => {
        polyStr = `${polyStr}${coordinate.latitude},${coordinate.longitude}`;
        if (index != polyGeometry.length-1) {
          polyStr = `${polyStr}:`;
        }
      });
    }

    axios.get(`${baseUrl}/crimes-street/all-crime?poly=${polyStr}`)
      .then(response => {
        const crimes: Crimes[] = separateCrimeTypes(response.data);
        initialCrimes(crimes);
        onCrimesRawDataChange(crimes);
      });
  }, [polyGeometry]);

  useEffect(() => {
    if (isDestSheetVisible) {
      onCenterGeometryChange({
        latitude: destination.latitude,
        longitude: destination.longitude
      });
    }


    onDeltaChange({
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    });

    onPolyGeometryChange([
      {latitude: destination.latitude, longitude: destination.longitude - 0.005},
      {latitude: destination.latitude - 0.005, longitude: destination.longitude},
      {latitude: destination.latitude, longitude: destination.longitude + 0.005},
      {latitude: destination.latitude + 0.005, longitude: destination.longitude},
    ]);

    if (routesData) {
      setFirstVisit(false);
      setSecureRouteSheetVisible(false);
      setRouteSheetVisible(true);
    }
  }, [destination]);

  function getMapDirection(strokeColor: string, mode: MapViewDirectionsMode, waypoints: any[]) {
    return <MapViewDirections
      origin={currentGeometry}
      destination={destinationRoute ? destinationRoute : currentGeometry}
      apikey={GOOGLE_MAPS_APIKEY}
      waypoints={waypoints}
      strokeWidth={4}
      strokeColor={strokeColor}
      lineCap="round"
      mode={mode}
      optimizeWaypoints={true}
      onReady={result => {
        if (isFirstVisit) return;

        const deltaPerDist = 100;
        let ratioDist = result.distance/deltaPerDist;
        onDeltaChange({
          latitudeDelta: ratioDist,
          longitudeDelta: ratioDist
        })

        const centerIndex = Math.floor(result.coordinates.length/3);
        const centerCoordinates = result.coordinates[centerIndex];
        const originCoord = result.coordinates[0];
        const destinationCoord = result.coordinates[result.coordinates.length-1];

        ratioDist = Math.min(0.010, ratioDist);
        onPolyGeometryChange([
          {latitude: originCoord.latitude, longitude: originCoord.longitude + 0.003},
          {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude + 0.003},
          {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude + 0.003},
          {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude - 0.003},
          {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude - 0.003},
          {latitude: originCoord.latitude, longitude: originCoord.longitude - 0.003},
        ]);

        const centerLatFocus = (currentGeometry.latitude + destinationCoord.latitude) / 2;
        const centerLngFocus = (currentGeometry.longitude + destinationCoord.longitude) / 2;
        onCenterGeometryChange({
          latitude: centerLatFocus,
          longitude: centerLngFocus
        })

        const filtered = busStop.filter((stop: any) => {
          const busLng = stop.Longitude;

          const fistLng = originCoord.longitude + 0.005;
          const secondLng = originCoord.longitude - 0.005;
          const thirdLng = destinationCoord.longitude + 0.005;
          const ForthLng = destinationCoord.longitude - 0.005;

          const firstCon = busLng > secondLng && busLng < fistLng
          const secondCon = busLng > ForthLng && busLng < thirdLng
          // const con3 = busLat < firstLat - 0.0001 && busLat > firstLat + 0.0001;
          // const con4 = busLat < thirdLat - 0.0001 && busLat > thirdLat + 0.0001;
          return firstCon && secondCon;
        })
        setFilteredBusStop(filtered);
        setBusStopVisible(true);
      }}
      onError={(errorMessage) => {
        console.log(errorMessage);
      }}
    />
  }

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();

  function openActionSheet() {
    return <Actionsheet isOpen={isDestSheetVisible} onClose={() => {}} disableOverlay >
      <Actionsheet.Content>
          <DestinationPopup
            isDestSheetVisible={isDestSheetVisible}
            setDestSheetVisible={setDestSheetVisible}
            geometry={destination}
            origin={currentGeometry}
            crimes={rawCrimesData}
            navigation={navigation}
            filterCrimes={filterCrimes}
            onFilterCrimesChange={onFilterCrimesChange}
          ></DestinationPopup>
        </Actionsheet.Content>
      </Actionsheet>
  }

  function openRouteSheet() {
    return <Actionsheet isOpen={isRouteSheetVisible} onClose={() => {}} disableOverlay>
      <Actionsheet.Content>
          <RoutePopup
            isRouteSheetVisible={isRouteSheetVisible}
            setRouteSheetVisible={setRouteSheetVisible}
            routeDetail={routesData}
            navigation={navigation}
            setSecureRouteStart={setSecureRouteSheetVisible}
            isBusStopVisible={isBusStopVisible}
            isCrimeVisible={isCrimeVisible}
            onBusStopVisible={setBusStopVisible}
            onCrimesVisible={setCrimesVisible}
          ></RoutePopup>
        </Actionsheet.Content>
      </Actionsheet>
  }

  function openSecureRouteSheet() {
    return <Actionsheet isOpen={isSecureRouteSheetVisible} onClose={() => {}} disableOverlay>
      <Actionsheet.Content>
          <SecureRoutePopup
            isSecureRouteSheetVisible={isSecureRouteSheetVisible}
            setSecureRouteSheetVisible={setSecureRouteSheetVisible}
            setAlertSheetVisible={setAlertSheetVisible}
            routeDetail={routesData}
            setReportModelVisible={setReportModelVisible}
            setFriendModelVisible={setFriendModelVisible}
            filterFriends={filterFriendConfirmed}
          ></SecureRoutePopup>
        </Actionsheet.Content>
      </Actionsheet>
  }

  function openAlertSOSSheet() {
    return <Actionsheet isOpen={isAlertSheetVisible} onClose={() => {}} disableOverlay>
      <Row style={{ flex: 1, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', top: 100, padding: 30 }}>
        <Button icon={{}}
          title="SOS"
          titleStyle= {{ fontSize: 40 }}
          buttonStyle={styles.alertButton}
          onPress={() => {}} />
        <Text bold style={{ color: '#FFFFFF', fontSize: 17, textAlign: 'center' }}>This <Text style={{ color: '#FFD747' }}>emergency alert </Text>
          will send the alert to your selected friends to tell them that you’re in danger.</Text>
          <View style={{ flex: 0, flexWrap: 'nowrap', justifyContent: 'flex-start', flexDirection: 'row', marginTop: 5, marginBottom: 10, backgroundColor: 'transparent' }}>
            <Box style={[styles.name, { backgroundColor: '#E95B77' } ]} ><Center>N</Center></Box>
            <Box style={[styles.name, { backgroundColor: '#FAD234' } ]} ><Center>M</Center></Box>
            <Box style={[styles.name, { backgroundColor: '#C4C4C4' } ]} ><Center>S</Center></Box>
				</View>
      </Row>
        <Actionsheet.Content>
          <AlertPopup
            isAlertSheetVisible={isAlertSheetVisible}
            setAlertSheetVisible={setAlertSheetVisible}
            // routeDetail={routesData}
          ></AlertPopup>
        </Actionsheet.Content>
      </Actionsheet>
  }

  function openCheckedInSheet() {
    return <Actionsheet isOpen={isCheckedInSheetVisible} onClose={() => {}} disableOverlay>
      <Row style={{ flex: 1, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', top: 120, padding: 30 }}>
        <TouchableOpacity
          style={[styles.alertButton, { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}
          onPress={() => {}}
        >
          <Image style={{ width: 70, height: 70 }}
            source={require('../assets/images/checked-in.png')}
            resizeMode='cover'
          />
        </TouchableOpacity>
        <Text bold style={{ color: '#FFFFFF', fontSize: 17, textAlign: 'center', marginTop: -70 }}>This message
          will send the alert to your selected friends to tell them that you’re in danger.</Text>
          <View style={{ flex: 0, flexWrap: 'nowrap', justifyContent: 'flex-start', flexDirection: 'row', marginTop: 65, marginBottom: 10, backgroundColor: 'transparent' }}>
            <Box style={[styles.name, { backgroundColor: '#6EB3FF' } ]} ><Center>P</Center></Box>
            <Box style={[styles.name, { backgroundColor: '#E95B77' } ]} ><Center>N</Center></Box>
            <Box style={[styles.name, { backgroundColor: '#FAD234' } ]} ><Center>M</Center></Box>
            <Box style={[styles.name, { backgroundColor: '#C4C4C4' } ]} ><Center>S</Center></Box>
				</View>
      </Row>
        <Actionsheet.Content>
          <AlertPopup
            isAlertSheetVisible={isCheckedInSheetVisible}
            setAlertSheetVisible={setCheckedInSheetVisible}
            // routeDetail={routesData}
          ></AlertPopup>
        </Actionsheet.Content>
      </Actionsheet>
  }

  const crimeTypes = ['Theft', 'Robbery', 'Drugs', 'Vehicle'];
	const [filterReport, onFilterReportChange] = useState<any>({
    selected: '',
  })

  const friendsList = ['Maya', 'Sawarin', 'Pete', 'Nick']
	const [filterFriends, onFilterFriendsChange] = useState({ last: '', selected: ['Pete', 'Nick'] });
  const [filterFriendConfirmed, onFilterFriendsConfirmed] = useState({ last: '', selected: ['Pete', 'Nick']})

  function openReportCrimeModel() {
    return <Modal isOpen={isReportModelVisible} onClose={() => setReportModelVisible(false)}>
      <Modal.Content maxWidth="500px" style={{ padding: 25, borderRadius: 15 }}>
        <Modal.CloseButton />
          <Heading fontSize={18} style={{ textAlign: 'center', marginTop: -5, marginBottom: 15 }}>Crime Report</Heading>
          {crimeTypes.map((type, index: number) => {
            return <TouchableOpacity
              key={index}
              onPress={() => {
                onFilterReportChange({selected: type});
              }}>
              <Card containerStyle={[styles.cardContainer, {
                  backgroundColor: filterReport.selected === type ? '#7A949550' : '#fff',
                  borderColor: filterReport.selected === type ? '#7A9495' : '#ddd',
                  borderWidth: 1
                }]}>
                <Row style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                {/* <Image style={{ width: 40, height: 40 }}
                  source={require('../assets/images/bus-icon-min.png')} /> */}
                <Text style={{ fontSize: 16, marginLeft: 10,
                  fontWeight:  '400'}}
                  >
                  {type}</Text>
                </Row>
              </Card>
              </TouchableOpacity>
          })}

          <Button title="Report"
            titleStyle={{ fontSize: 17 }}
            style={{ marginTop: 10, alignItems: 'flex-end' }}
            buttonStyle={{ width: 120, borderRadius: 10, height: 42, backgroundColor: "#7A9495" }}
            onPress={() => { setReportModelVisible(false)}} />
      </Modal.Content>
    </Modal>
  }

  function openFriendModel() {
    return <Modal isOpen={isFriendModelVisible} onClose={() => setFriendModelVisible(false)}>
      <Modal.Content maxWidth={350} style={{ padding: 25, borderRadius: 15, width: '100%' }}>
        <Modal.CloseButton />
          <Heading fontSize={18} style={{ textAlign: 'left', marginTop: -10, marginBottom: 15 }}>Add friends to receive your alert</Heading>
          <Input w={{ base: "100%" }} h={{ base: 10 }} borderRadius={8} paddingLeft={5} paddingRight={10}
              InputRightElement={<Icon as={<MaterialIcons name="search" />} size={7} ml="5" color="#ccc" marginRight={1} />}
              placeholder="Search friend"
              fontSize={16}
              marginBottom={2}
          />
          <Chip containerStyle={styles.chipMode} title="Select All"
            titleStyle={{ color: '#000' }}
            buttonStyle={{ backgroundColor: '#6EB3FF26' }}
            onPress={() => {
              // setSelectedTransit(!isSelectedTransit);
            }} />
          {friendsList.map((friend, index: number) => {
            const test = {
              last: '',
              selected: [...filterFriends.selected]
            }
            return <TouchableOpacity
              key={index}
              onPress={() => {
                if (test.selected.includes(friend)) {
                  const index = test.selected.indexOf(friend);
                  if (index !== -1) {
                    test.selected.splice(index, 1);
                  }
                } else {
                  test.selected.push(friend);
                }
                test.last = friend;
                onFilterFriendsChange(test);
              }}>
              <Card containerStyle={[styles.cardContainer, {
                  backgroundColor: filterFriends.selected.includes(friend) ? '#7A949550' : '#fff',
                  borderColor: filterFriends.selected.includes(friend) ? '#7A9495' : '#ddd',
                  borderWidth: filterFriends.selected.includes(friend) ? 1 : 1
                }]}>

                <Row style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                  <Text style={{ fontSize: 16, marginLeft: 10,
                    fontWeight: filterFriends.selected.includes(friend) ? '600' : '400'}}>
                    {friend}</Text>
                </Row>
              </Card>
              </TouchableOpacity>
          })}

          <Row style={{ flex: 0, flexWrap: 'nowrap', justifyContent: 'space-between' }}>
            <Row style={{ flex: 0, flexWrap: 'nowrap', justifyContent: 'flex-start', marginTop: 5 }}>
              {filterFriends.selected.includes('Pete') ? <Box style={[styles.name, { backgroundColor: '#6EB3FF' } ]} ><Center>P</Center></Box> : <></> }
              {filterFriends.selected.includes('Nick') ? <Box style={[styles.name, { backgroundColor: '#E95B77' } ]} ><Center>N</Center></Box> : <></> }
              {filterFriends.selected.includes('Maya') ? <Box style={[styles.name, { backgroundColor: '#FAD234' } ]} ><Center>M</Center></Box> : <></> }
              {filterFriends.selected.includes('Sawarin') ? <Box style={[styles.name, { backgroundColor: '#C4C4C4' } ]} ><Center>S</Center></Box> : <></> }
            </Row>
            <Button title="Add"
              titleStyle={{ fontSize: 17 }}
              style={{ marginTop: 10, alignItems: 'flex-end' }}
              buttonStyle={{ width: 100, borderRadius: 10, height: 42, backgroundColor: "#7A9495" }}
              onPress={() => {
                setFriendModelVisible(false);
                onFilterFriendsConfirmed(filterFriends);
              }} />
          </Row>
      </Modal.Content>
    </Modal>
  }

  const marker = useRef<Marker>(null)

  return (
    <View style={styles.container}>
      {isSecureRouteSheetVisible || isAlertSheetVisible || isCheckedInSheetVisible ?
      <Header containerStyle={{
          marginTop: 5,
          backgroundColor: '#fff',
        }}
        placement="left"
        leftComponent={{
          icon: 'arrow-back-ios', color: '#7A9495', size: 20,
          onPress: (() => {
            if (isSecureRouteSheetVisible) {
              setSecureRouteSheetVisible(false);
              setRouteSheetVisible(true)
            } else if (isAlertSheetVisible) {
              setAlertSheetVisible(false);
              if (!isBottomTabClicked) {
                setSecureRouteSheetVisible(true)
                onBottomTabClicked(false)
              }
            }  else if (isCheckedInSheetVisible) {
              setRouteSheetVisible(false);
              setAlertSheetVisible(false);
              setCheckedInSheetVisible(false);
              setSecureRouteSheetVisible(true)
            }
          })
        }}
        centerComponent={{
          text: isSecureRouteSheetVisible ? 'Secure navigation started' : isAlertSheetVisible ? 'Emergency Alert' : 'Destination Check In',
          style: { color: '#7A9495', fontSize: 18, fontWeight: '600' } }}
        rightComponent={
          <TouchableOpacity
            onPress = {() => {
              setDestSheetVisible(false);
              setSecureRouteSheetVisible(false);
              setAlertSheetVisible(false);
              setCheckedInSheetVisible(true);
            }}
          >
            <Image style={{ width: 35, height: 35, marginTop: -5 }}
              source={require('../assets/images/checked-in.png')}
              resizeMode='cover'
            />
          </TouchableOpacity>
        }
      /> :
      <GooglePlacesInput onDestinationChange={onDestinationChange} isDestinationChanged={setDestSheetVisible} isFirstVisited={setFirstVisit}/>}

      <MapView region={{... isFirstVisit ? currentGeometry : centerGeometry, latitudeDelta: delta.latitudeDelta, longitudeDelta: delta.longitudeDelta}}
        style={{margin: 0, height: Dimensions.get('window').height-70, width: '100%'}}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        ref={h1Ref}
        onUserLocationChange={(e: EventUserLocation) => {
          const lat = e.nativeEvent.coordinate.latitude;
          const lng = e.nativeEvent.coordinate.longitude;
          if (lat.toFixed(3) == currentGeometry.latitude.toFixed(3) ||
          lng.toFixed(3) == currentGeometry.longitude.toFixed(3)) return;
          onCurrentGeometryChange({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
          })
        }}
        >

        <Marker key={1000} coordinate={currentGeometry} />
        <Marker key={2000} coordinate={isFirstVisit ? currentGeometry : {
          latitude: destinationRoute ? destinationRoute.latitude : destination.latitude,
          longitude: destinationRoute ? destinationRoute.longitude : destination.longitude
        }} />
        {crimes.map((crimeTypes: Crimes, index) => {
          return crimeTypes.crimes.map((crime: Crime, d) => {
            let lat: number = parseFloat(crime.latitude);
            let lng: number = parseFloat(crime.longitude);
            const isShow = filterCrimes.includes(crimeTypes.category);

            const isFound = locationCrimes.filter((addCrimeLocation: any) => {
              const isEqualLat = addCrimeLocation.latitude === parseFloat(crime.latitude)
              const isEqualLng = addCrimeLocation.longitude === parseFloat(crime.longitude)
              return isEqualLat && isEqualLng
            });

            const isFoundSameCat = locationCrimes.filter((addCrimeLocation: any) => {
              const isEqualLat = addCrimeLocation.latitude === parseFloat(crime.latitude)
              const isEqualLng = addCrimeLocation.longitude === parseFloat(crime.longitude)
              const isSameCat = addCrimeLocation.category === crimeTypes.category;

              return isEqualLat && isEqualLng && isSameCat
            });

            if (isFound.length === 0) {
              locationCrimes.push({
                latitude: parseFloat(crime.latitude),
                longitude: parseFloat(crime.longitude),
                category: crimeTypes.category
              });
            } else {
              lat = lat - Math.random()*Math.random()/10001
              lng = lng + Math.random()*Math.random()/10001
            }

            return isFoundSameCat.length === 0 ?
            <Marker
                key={`${index}${d}`}
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
                onPress={() => {
                  if (isCrimeVisible && isShow) {
                    onOpen();
                  }
                }}
                image={crimeTypes.icon}
                opacity={ isCrimeVisible && isShow ? 1 : 0 }
                ref={marker}
              >
              <Callout
                tooltip
                style={{ borderRadius: 10}}
                onPress={() => { marker.current?.hideCallout() }}
                >
                <View style={styles.bubble}>
                  <Image style={{ width: 50, height: 50 }}
                    source={crimeTypes.icon}
                    resizeMode='contain'
                  />
                  <View>
                    <Text style={{fontSize: 16, textTransform: 'capitalize', fontWeight: '500'}}>{crimeTypes.category}</Text>
                    {crime.location ? <Text>Location: {crime.location} </Text> : <></>}
                    <Text>Date: {crime.dateTime}</Text>
                  </View>
                  <Icon as={<MaterialCommunityIcons name={"close"} />} color="#bbb" size="20px"
                    style={{ position:'absolute', right:8, top:15 }}
                  />
                </View>
              </Callout>
            </Marker> : <></>
            }
          );
        })}

        {filteredBusStop.map((busDetail: any) => {
          return <Marker
              key={busDetail.ATCOCode}
              coordinate={{
                latitude: busDetail.Latitude,
                longitude: busDetail.Longitude,
              }}
              onPress={() => {
                if (isBusStopVisible) {
                  onOpen();
                }
              }}
              icon={require('../assets/images/bus-icon.png')}
              opacity={ isBusStopVisible ? 1 : 0 }
            >

            <Callout
              tooltip
              style={{ borderRadius: 20}}>
              <View style={styles.bubble}>
              <Image style={{ width: 50, height: 50 }}
                    source={require('../assets/images/bus-icon.png')}
                    resizeMode='contain'
                  />
                <View>
                  <Text style={{fontSize: 16, marginBottom: 5, textTransform: 'capitalize', fontWeight: '500'}}>{busDetail.CommonName}</Text>
                  { busDetail.Street ? <Text>Street: {busDetail.Street}</Text> : <></> }
                </View>
              </View>
            </Callout>
          </Marker>
        })}

        {routesData?.mode === 'TRANSIT' ? getMapDirection("hotpink", routesData?.mode, []) :
        destinationRoute ? getMapDirection("hotpink", routesData?.mode, routesData?.waypoints) : <></>}
      </MapView>

      {isAlertSheetVisible || isCheckedInSheetVisible ? <View style={[styles.overlay, { height: '100%' }]} /> : <></>}

      {destination ? openActionSheet() : <></>}
      {routesData ? openRouteSheet() : <></>}
      {isSecureRouteSheetVisible ? openSecureRouteSheet() : <></>}
      {isAlertSheetVisible ? openAlertSOSSheet() : <></>}
      {isCheckedInSheetVisible ? openCheckedInSheet() : <></> }
      {isReportModelVisible ? openReportCrimeModel() : <></> }
      {isFriendModelVisible ? openFriendModel() : <></> }


      <Box flex={0} bg="white" width="100%" height="70px" alignSelf="center">
          <HStack bg="#f2f2f2" alignItems="center" safeAreaBottom shadow={3} style={{ paddingTop: 10 }}>
            <TouchableOpacity style={{width: '25%'}} onPress={() => {
                navigation.navigate('MapHomeScreen', {
                  destination: null,
                  dataRoutes: null,
                  isShowDestinationSheet: false,
                });
              }}>
              <Center>
                <Icon as={<MaterialCommunityIcons name={"home"} />} color="#bbb" size="34px" />
              </Center>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '25%'}} >
              <Center>
                <Icon as={<FontAwesome name={"user-plus"} />} color="#bbb" size="30px" />
              </Center>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '25%'}} >
              <Center>
                <Icon as={<MaterialCommunityIcons name={"comment-question"} />} color="#bbb" size="32px" />
              </Center>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '25%'}} onPress={() => {
                onBottomTabClicked(true)
                setAlertSheetVisible(true)
              }}>
              <Center>
                <Text style={{ color:"#bbb",  fontSize: 24, fontWeight: 'bold', lineHeight: 0 }}>SOS</Text>
                {/* <Icon as={<MaterialCommunityIcons name={"help"} />} color="#bbb" size="40px" /> */}
              </Center>
            </TouchableOpacity>
          </HStack>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bubble: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  name: {
		width: 40,
		height: 40,
		borderRadius: 50,
		paddingTop: 10,
    textAlign: 'center',
		marginRight: 5,
    marginTop: 5
	},
  modal: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  cardContainer: {
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    margin: 0,
    marginBottom: 8,
  },
  modalSubTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    fontSize: 16
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  alertButton: {
		width: 180,
		height: 180,
    margin: 10,
		marginTop: 100,
    marginBottom: 15,
		borderRadius: 100,
		backgroundColor: '#F84D3A',
		shadowColor: '#333',
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.9,
		shadowRadius: 6,
	},
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 97,
    opacity: 0.80,
    width: '100%',
    backgroundColor: '#807878',
  },
  chipMode: {
		marginRight: 5,
		marginBottom: 10,
		color: '#000',
		width: 100,
    borderRadius: 8
	},
});
