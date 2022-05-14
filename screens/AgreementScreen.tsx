import { useNavigation } from "@react-navigation/native";
import { Center, Input, Stack, Button, Row, Text, Link, Box, Heading, Flex } from "native-base";
import React from "react";
import { StyleSheet, Image, View, TextInput, ScrollView } from 'react-native';
import { ButtonGroup } from "react-native-elements";

export default function AgreementScreen() {
	const buttons = ['Login', 'Register'];
	const navigation = useNavigation();

	return (
		<View style={{ backgroundColor: "#fff", height: '100%' }} >
			<ScrollView style={{ paddingLeft: 30, paddingRight: 30 }}>
				<Heading style={styles.heading}>1 Disclaimer </Heading>
				<Text style={{ marginLeft: 10 }}>These Terms of Service are only for demo purpose. Do not use them for a real project. These are only an example of  the legally binding terms and conditions for the use of the app and the Services.</Text>

				<Heading style={styles.heading}>2 Acceptance of Terms </Heading>

				<Text style={{ marginBottom: 5, marginLeft: 10 }}> 2.1 By registering for and/or using the Services in any manner, including but not limited to visiting or browsing the app, you agree to these Terms of Service (including, for clarity, the Privacy Policy and, where applicable, the EU Data Processing Addendum) and all other operating rules, policies and procedures that may be published from time to time on the Site by us, each of which is incorporated by reference and each of which may be updated from time to time without notice to you. </Text>

				<Text style={{ marginBottom: 5, marginLeft: 10 }}> 2.2 Certain of the Services may be subject to additional terms and conditions specified by us from time to time; your use of such Services is subject to those additional terms and conditions, which are incorporated into these Terms of Service by this reference.</Text>

				<Text style={{ marginBottom: 5, marginLeft: 10 }}> 2.3 These Terms of Service apply to all users of the Services, including, without limitation, users who are contributors of content, information, and other materials or services, registered or otherwise. </Text>
			</ScrollView>
			<Stack  style={{ marginTop: 20, marginBottom: 30, paddingLeft: 40, paddingRight: 40 }} space={4} w="100%">
				<Flex style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<Button size="lg" _text={{ color: "#333" }} style={{backgroundColor: "#E5E5E5", borderRadius: 50, width: 100 }}
					onPress={() => navigation.goBack() } > Back </Button>

					<Button size="lg" style={{backgroundColor: "#7A9495", borderRadius: 50, width: 100 }}
					onPress={() => {
						navigation.navigate('MapHomeScreen', {
							destination: null,
							dataRoutes: null,
							isShowDestinationSheet: false,
						});
					}} > Agree </Button>
				</Flex>
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
	heading: {
		fontSize: 15,
		fontWeight: '500',
		marginBottom: 5,
		marginTop: 15
	}
});