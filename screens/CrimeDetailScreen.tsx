import { useNavigation, useRoute } from "@react-navigation/native";
import { Center, Input, Stack, Button, Row, Text, Link, Box, ScrollView, Heading } from "native-base";
import React from "react";
import { StyleSheet, Image, View } from 'react-native';
import { Card } from 'react-native-elements';
import { ButtonGroup, Header } from "react-native-elements";
import { getIcon2 } from "../functions/helper";

export default function CrimeDetailScreens(props: { dataRoutes: any }) {
	const navigation = useNavigation();
	const location = useRoute();

	const params: any = location.params;
  	const crimes = params?.dataRoutes?.crimesDetail;

	return (
		<View style={{ backgroundColor: "#fff", height: '100%' }} >
			<Header
				containerStyle={{
					marginTop: 5,
					backgroundColor: '#fff',
				}}
				placement="center"
				leftComponent={{
					icon: 'arrow-back-ios', color: '#7A9495', size: 20,
					onPress: (() => { navigation.goBack() })
				}}
				centerComponent={{
					text: `List all crime in this path`,
					style: { color: '#7A9495', fontSize: 18, fontWeight: '600' }
				}}
			/>

			<Heading style={{ fontSize: 15, marginTop: 5, marginLeft: 15, color: '#333' }}> All crimes occurred on this route</Heading>
			<ScrollView>
				{crimes.map((crime: any, index: number) => {
					return  <Card containerStyle={{ borderRadius: 10 }} key={index}>
					<Row justifyContent={'flex-start'} alignItems={'center'} >
						<View style={{ width: '20%', marginRight: 10 }}>
						<Box style={{ marginRight: 10 }}>
							<Image style={{ width: 70, height: 70 }}
							source={getIcon2(crime.category)}
							resizeMode='cover'
							/>
						</Box>
						</View>
						<View style={{ width: '65%' }}>
							<Text style={{ fontSize: 15 }}>{crime.category}</Text>
						</View>
						<View style={{ width: '15%' }}>
							<Text style={{ fontSize: 15, color: '#7A9495' }} bold>{crime.crimes.length}</Text>
						</View>
					</Row>
					</Card>
				})}
				</ScrollView>
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
});