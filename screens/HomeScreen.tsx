import { useNavigation } from "@react-navigation/native";
import { Center, Input, Stack, Button, Row, Text, Link, Box } from "native-base";
import React from "react";
import { StyleSheet, Image, View, TextInput } from 'react-native';
import { ButtonGroup } from "react-native-elements";

export default function HomeScreen() {
	const buttons = ['Login', 'Register'];
	const navigation = useNavigation();

	return (
		<View style={{ backgroundColor: "#fff", height: '100%' }} >
			<Image style={styles.logo}
				source={require('../assets/images/logo.png')}
				resizeMode='center'
			/>
			<View style={{ paddingLeft: 30, paddingRight: 30 }}>
				<ButtonGroup
					onPress={(index) => {console.log(index)}}
					selectedIndex={0}
					buttons={buttons}
					containerStyle={{ height: 54, borderRadius: 8, borderWidth: 0, padding: 3,backgroundColor: "#E5E5E5" }}
					selectedButtonStyle={{ backgroundColor: "#fff", borderColor: "#fff", borderWidth: 1 }}
					selectedTextStyle={{ color: "#2D77EE" }}
					buttonStyle={{ backgroundColor: "#E5E5E5", borderColor: "#E5E5E", borderRadius: 8 }}
					innerBorderStyle={{ width: 4, color: 'transparent'}}
					textStyle={{ fontSize: 14 }}
				/>
			</View>
			<Stack  style={{ marginTop: 15, paddingLeft: 40, paddingRight: 40 }} space={4} w="100%">
				<Input size="lg" height={'12'} borderRadius={8} placeholder="Username" placeholderTextColor="blueGray.400" />
				<Input size="lg" height={'12'} borderRadius={8} placeholder="Password" placeholderTextColor="blueGray.400" type="password" />
				<Button size="lg" style={{backgroundColor: "#2D77EE", borderRadius: 8 }}
					onPress={() => {
						navigation.navigate('Agreement');
					}} > Login </Button>
				<Row>
					<Text fontSize="sm" style={{ alignItems: 'center' }}>Forgot password? </Text>
					<Link _text={{ color: '#007AFF'}} href="https://nativebase.io">Remember</Link>
				</Row>
			</Stack>

		</View>
	);
}

const styles = StyleSheet.create({
    logo:{
		width: '50%',
		height: 200,
		marginLeft: '25%',
		marginTop: '30%'
	},
	input: {
		padding: 10,
	},
});