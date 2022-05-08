import { StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

import { Text, View,  } from '../components/Themed';
import React, { useEffect, useState } from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Card, Chip } from 'react-native-elements';
import { Box, Center, Flex, HStack, Button, Row, ScrollView, Spinner, Link } from 'native-base';
import axios from 'axios';
import { Crimes, getIcon, separateCrimeTypes } from '../functions/helper';
import { useNavigation, useRoute } from '@react-navigation/native';

const baseUrl = 'https://data.police.uk/api';
const GOOGLE_MAPS_APIKEY = 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo';

export function getDirection(data: any) {
  const busIcon = <FontAwesome size={18} style={{ marginRight: 5, marginTop: 5 }} name="bus" />
  const bicyclingIcon = <MaterialIcons size={18} style={{ marginRight: 5, marginTop: 5 }} name="directions-bike" />
  const walkIcon = <MaterialIcons size={18} style={{ marginRight: 5, marginTop: 5 }} name="directions-walk" />
  const rightArrow = <FontAwesome size={10} style={{ color: '#aaa', marginRight: 5, marginTop: 5 }} name="chevron-right" />

  if (data.directions.length === 1) {
    if (data.directions[0].mode === 'WALKING') {
      return <Flex style={styles.flex}>
        {walkIcon}
        <Text>Walk {data.duration}</Text>
      </Flex>
    }
    if (data.directions[0].mode === 'BICYCLING') {
      return <Flex style={styles.flex}>
        {bicyclingIcon}
        <Text>Bicycle {data.duration}</Text>
      </Flex>
    }
  }

  return <Flex style={styles.flex}>
    {data.directions.map((step: any, index: number) => {
      return [<Flex style={styles.flex}>{step.mode === 'TRANSIT' ? busIcon : walkIcon}
          <Text> { step.mode === 'TRANSIT' ? 'bus' : 'walk' } {step.dist} </Text>
        </Flex>,
      ,
      index === data.directions.length-1 ? '' : rightArrow ]
    })}
  </Flex>
}

export default function AllRoutesScreen(props: { destination: any, origin: any, crimes: any, filterCrimes: any[] }) {
  const navigation = useNavigation();
  const location = useRoute();

  const params: any = location.params;
  const destination = params?.destination;
  const crimes = params?.crimes;
  // const filterCrimes = params?.filterCrimes;
  const latLongOrigin = `${params?.origin.latitude},${params?.origin.longitude}`
  const latLongDestination = `${params?.destination.latitude},${params?.destination.longitude}`

  const [highestCrimeList, onHighestCrimesChange] = useState<any>([]);
  const [routeData, onRouteDataChange] = useState<any>([]);
  const [rawData, onRawDataChange] = useState<any>([]);
  const [transit, setTransit] = useState(false)
  const [bicycling, setBicycling] = useState(false)
  const [walking, setWalking] = useState(false)

  const [isSelectedTransit, setSelectedTransit] = useState(true)
  const [isSelectedBicycle, setSelectedBicycle] = useState(true)
  const [isSelectedWalking, setSelectedWalking] = useState(true)

  const [filterCrimes, onFilterCrimesChange] = useState<any>(['Violence Against The Person',
  'Vehicle', 'Theft', 'Drugs', 'Violent Crime', 'Robbery', 'Sexual Offense', 'Others'])

  const Loading = () => {
    return <HStack space={2} justifyContent="center">
        <Spinner accessibilityLabel="Loading posts" />
      </HStack>;
  };

  async function getCrimes(waypoints: any, distance: number) {
    const originCoord = waypoints[0];
    const destinationCoord = waypoints[waypoints.length-1];
    const centerIndex = Math.floor(waypoints.length/2);
    const centerCoordinates = waypoints[centerIndex];
    const deltaPerDist = 100;
    const ratioDist = Math.min(0.010, distance/deltaPerDist);

    const polyGeometry = [
      {latitude: originCoord.latitude, longitude: originCoord.longitude + ratioDist/2},
      {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude + ratioDist/2},
      {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude + ratioDist/2},
      {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude - ratioDist/2},
      {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude - ratioDist/2},
      {latitude: originCoord.latitude, longitude: originCoord.longitude - ratioDist/2},
    ];

    let polyStr = '';
    polyGeometry.forEach((coordinate: any, index: number) => {
      polyStr = `${polyStr}${coordinate.latitude},${coordinate.longitude}`;
      if (index != polyGeometry.length-1) {
        polyStr = `${polyStr}:`;
      }
    });

    return axios.get(`${baseUrl}/crimes-street/all-crime?poly=${polyStr}`)
    .then(response => {
      const crimes: Crimes[] = separateCrimeTypes(response.data);
      const highestCrime = {name: '', value: 0};

      crimes.forEach((crime: any) => {
        if (!highestCrime.name || highestCrime.value < crime.crimes.length) {
          highestCrime.name = crime.category;
          highestCrime.value = crime.crimes.length;
        }
      })

      highestCrimeList.push(highestCrime)
      onHighestCrimesChange(crimes)

      return {detail: crimes, highest: highestCrime};
    })
    .catch(function (error) {
      return Promise.reject(error)
   });
  }

  useEffect(() => {
    axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${latLongOrigin}&destination=${latLongDestination}&key=${GOOGLE_MAPS_APIKEY}&alternatives=true&mode=walking`)
      .then((response: any) => {
        response.data.routes.forEach((route: any, index: number) => {
          const waypoint = route.legs[0].steps.map((step: any, index: number): any => {
            return {
              latitude: step.end_location.lat,
              longitude: step.end_location.lng
            };
          })

          const direction: any[] = [];

          direction.push({
            mode: 'WALKING',
            dist: route.legs[0].distance.text
          });

          const getHighestCrimes = async() => {
            await getCrimes(waypoint, route.legs[0].distance.value)
            .then((result) => {
              const response = {
                distance: route.legs[0].distance.text,
                duration: route.legs[0].duration.text,
                road: route.summary,
                mode: 'WALKING',
                waypoints: waypoint,
                directions: direction,
                crimes: result.highest,
                crimesDetail: result.detail,
                destination: destination,
              }

              const isDuplicated = routeData.filter((route: any) =>  {
                const isSameRoad = route.road == response.road;
                const isSameDist = route.distance == response.distance;
                const isSameCrimes =  route.duration == response.duration;
                return isSameRoad && isSameCrimes && isSameDist;
              });

              if (isDuplicated.length === 0) {
                routeData.push(response);
                routeData.sort((a: any, b: any) => a.crimes.value - b.crimes.value);
              }
            });
          }

          getHighestCrimes();
        })
        onRouteDataChange(routeData);
        onRawDataChange(routeData);
        setWalking(true);
      });
  }, [walking]);

  useEffect(() => {
      axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${latLongOrigin}&destination=${latLongDestination}&key=${GOOGLE_MAPS_APIKEY}&alternatives=true&mode=bicycling`)
      .then((response: any) => {
        response.data.routes.forEach((route: any, index: number) => {
          const waypoint = route.legs[0].steps.map((step: any, index: number): any => {
            if (step.end_location.lat && step.end_location.lng) {
              return {
                latitude: step.end_location.lat,
                longitude: step.end_location.lng
              };
            } else {
              return {
                latitude: route.legs[0].steps[index-1].end_location.lat,
                longitude: route.legs[0].steps[index-1].end_location.lng
              };
            }
          })

          const direction: any[] = [];
          direction.push({
            mode: 'BICYCLING',
            dist: route.legs[0].distance.text
          });

          const getHighestCrimes = async() => {
            await getCrimes(waypoint, route.legs[0].distance.value)
            .then((result) => {
              const response = {
                distance: route.legs[0].distance.text,
                duration: route.legs[0].duration.text,
                road: route.summary,
                mode: 'BICYCLING',
                waypoints: waypoint,
                directions: direction,
                crimes: result.highest,
                crimesDetail: result.detail,
                destination: destination,
              }

              const isDuplicated = routeData.filter((route: any) =>  {
                const isSameRoad = route.road == response.road;
                const isSameDist = route.distance == response.distance;
                const isSameDuration = route.duration == response.duration;
                const isSameCrimes =  route.duration == response.duration;
                return isSameRoad && isSameCrimes && isSameDist && isSameDuration;
              });
              if (isDuplicated.length === 0) {
                routeData.push(response);
                routeData.sort((a: any, b: any) => a.crimes.value - b.crimes.value);
              }
            });
          }

          getHighestCrimes();
        })
        setBicycling(true)
        onRouteDataChange(routeData);
        onRawDataChange(routeData);
      });
  }, [bicycling]);

  useEffect(() => {
      axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${latLongOrigin}&destination=${latLongDestination}&key=${GOOGLE_MAPS_APIKEY}&alternatives=true&mode=transit`)
      .then((response: any) => {
        response.data.routes.forEach((route: any, index: number) => {
          const waypoint = route.legs[0].steps.map((step: any, index: number): any => {
            if (step.end_location.lat && step.end_location.lng) {
              return {
                latitude: step.end_location.lat,
                longitude: step.end_location.lng
              };
            } else {
              return {
                latitude: route.legs[0].steps[index-1].end_location.lat,
                longitude: route.legs[0].steps[index-1].end_location.lng
              };
            }
          })

          const direction: any[] = [];

          route.legs[0].steps.forEach((step: any, index: number): any => {
            direction.push({
              mode: step.travel_mode,
              dist: step.duration.text
            });
          })

          const getHighestCrimes = async() => {
            await getCrimes(waypoint, route.legs[0].distance.value)
            .then((result) => {
              const response = {
                distance: route.legs[0].distance.text,
                duration: route.legs[0].duration.text,
                road: route.summary,
                mode: 'TRANSIT',
                waypoints: waypoint,
                directions: direction,
                crimes: result.highest,
                crimesDetail: result.detail,
                destination: destination,
              }

              const isDuplicated = routeData.filter((route: any) =>  {
                const isSameRoad = route.road == response.road;
                const isSameDist = route.distance == response.distance;
                const isSameCrimes =  route.duration == response.duration;
                return isSameRoad && isSameCrimes && isSameDist;
              });
              if (isDuplicated.length === 0) {
                routeData.push(response);
                routeData.sort((a: any, b: any) => a.crimes.value - b.crimes.value);
              }
            });
          }

          getHighestCrimes();
        })
        setTransit(true)
        onRouteDataChange(routeData);
        onRawDataChange(routeData);
      });
  }, [transit]);

  useEffect(() => {
    let filtered = [...rawData]
    if (isSelectedTransit && isSelectedWalking && isSelectedBicycle) {
      onRouteDataChange(rawData)
      return;
    } if (!isSelectedTransit) {
      filtered = filtered.filter((route: any) => {
        return route.mode !== 'TRANSIT'
      });
    } if (!isSelectedWalking) {
      filtered = filtered.filter((route: any) => {
        return route.mode !== 'WALKING'
      });
    } if (!isSelectedBicycle) {
      filtered = filtered.filter((route: any) => {
        return route.mode !== 'BICYCLING'
      });
    }
    onRouteDataChange(filtered)
  }, [isSelectedTransit, isSelectedWalking, isSelectedBicycle]);

  return (
    <View style={{ height: '100%', backgroundColor: '#fff', paddingTop: 45 }}>
      <View style={{ padding: 10 }}>
        <Flex style={styles.flex}>
          <Image style={{
						width: 22, height: 22,
						tintColor: '#aaa',
            marginRight: 8
					}} source={{
						uri: "https://img.icons8.com/external-kmg-design-detailed-outline-kmg-design/64/000000/external-pin-map-and-navigation-kmg-design-detailed-outline-kmg-design-2.png"}}
					/>
          <TextInput
            style={styles.input}
            editable={false}
            value='Current Location'
          />
        </Flex>
        <Flex style={styles.flex}>
          <Image style={{
						width: 22, height: 22,
						tintColor: '#aaa',
            marginRight: 8
					}} source={{
						uri: "https://img.icons8.com/external-kmg-design-detailed-outline-kmg-design/64/000000/external-pin-map-and-navigation-kmg-design-detailed-outline-kmg-design-2.png"}}
					/>
          <TextInput
            style={styles.input}
            editable={false}
            value={destination.name}
          />
        </Flex>
      </View>

      <View style={styles.chipContainer}>
			  {crimes.map((crime: any, index: number) => {
				  return <Chip containerStyle={styles.chip} title={crime.category}
					titleStyle={{ color: '#000' }}
          key={index}
					buttonStyle={{backgroundColor: filterCrimes.includes(crime.category) ? '#FF47734D' : '#ccc' }}
          onPress={() => {
            let filtered = [...filterCrimes];
						if (filterCrimes.includes(crime.category)) {
							filtered = filtered.filter((cat) => {
								return cat !== crime.category;
							})
							onFilterCrimesChange(filtered);
						} else {
							filtered.push(crime.category);
							onFilterCrimesChange(filtered);
						}
          }}
					/>
			  })}

		  </View>
      <View style={styles.chipContainer}>
        <Text style={{marginRight: 5}}>Travel Mode: </Text>
        <Chip containerStyle={styles.chipMode} title="Bus"
          titleStyle={{ color: '#000' }}
          buttonStyle={{ backgroundColor: isSelectedTransit ? '#007AFF4D' : '#ccc'}}
          onPress={() => {
            setSelectedTransit(!isSelectedTransit);
          }}
        />
        <Chip containerStyle={styles.chipMode} title="Bicycle"
          titleStyle={{ color: '#000' }}
          buttonStyle={{ backgroundColor: isSelectedBicycle ? '#007AFF4D' : '#ccc'}}
          onPress={() => {
            setSelectedBicycle(!isSelectedBicycle);
          }}
          />
        <Chip containerStyle={styles.chipMode} title="Walk"
          titleStyle={{ color: '#000' }}
          buttonStyle={{ backgroundColor: isSelectedWalking ? '#007AFF4D' : '#ccc'}}
          onPress={() => {
            setSelectedWalking(!isSelectedWalking);
          }}
          />
		  </View>

      {walking && bicycling && transit ?
      <ScrollView>
      {routeData.map((data: any, index: number) => {
        let hasCrimes = false;
        data.crimesDetail.map((crime: any) => {
          if (!filterCrimes.includes(crime.category)) {
            hasCrimes = true;
          }
        })

        if (hasCrimes) return <></>

        return  <Card containerStyle={{ borderRadius: 10 }} key={index}>
          <Flex justifyContent={'flex-start'} direction={'row'} alignItems={'center'} style={{ paddingRight: 10 }}>
            <View style={{ width: '22%', marginRight: 10 }}>
              <Center>
              <Box style={[styles.box, {borderColor: data?.crimes?.value < 20 ? '#007AFF' : '#FF4773', borderWidth: 2 }]}>
                <Image style={{ width: 30, height: 30 }}
                  source={getIcon(data?.crimes?.name)}
                  resizeMode='cover'
                />
              </Box>
              {/* <Text style={{ marginTop: 5 }}>{data?.crimes?.name}</Text>
              <Text>{data?.crimes?.value} times</Text> */}
              </Center>
            </View>
            <View style={{ width: '73%' }}>
                {getDirection(data)}
                <Text style={{ marginTop: 5 }}>Distance: {data.distance}</Text>
                <Text style={{ marginTop: 5 }}>{data?.crimes?.name}: {data?.crimes?.value} times occurred</Text>
                <Row style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'baseline', marginTop: 5 }}>
                  <Link style={{ marginRight: 10 }} _text={{ fontSize: 15 }}
                    onPress={() => {
                      navigation.navigate('CrimeDetailScreen', {
                        dataRoutes: data
                      });
                    }} > Detail </Link>


                  <Link _text={{ fontSize: 15, color: "#7A9495" }}
                    // style={{ backgroundColor: "#7A9495", borderRadius: 10, width: 100, height: 38, padding: 8, paddingLeft: 15 }}
                    onPress={() => {
                      navigation.navigate('MapHomeScreen', {
                        destination: {
                          latitude: data.waypoints[data.waypoints.length-1].latitude,
                          longitude: data.waypoints[data.waypoints.length-1].longitude
                        },
                        dataRoutes: data
                      });
                    }}
                    > Select </Link>
                </Row>
            </View>
          </Flex>
          </Card>
      })}
      </ScrollView>
      : Loading() }
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 60,
    height: 60,
    borderRadius: 50,
    padding: 15,
    marginBottom: 0
  },
  container: {
    flexDirection: "row",
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonSelected: {
    width: 100,
    borderRadius: 10,
    height: 38,
    backgroundColor: "#7A9495",
    padding: 5,
    textAlign: 'center',
  },
  flex: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    height: 45,
    width: 320,
    margin: 5,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 10,
  },
  chipContainer: {
    flex: 0,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'transparent'
  },
	chip: {
		marginRight: 5,
    marginBottom: 5,
		color: '#000'
	},
  chipMode: {
		marginRight: 5,
    marginBottom: 5,
		color: '#000',
    width: 75,
	},
});



