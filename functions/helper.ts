export interface Crimes {
	category: string;
	icon: string;
	crimes: Crime[];
}

export interface Crime {
	id: number,
	latitude: string,
	longitude: string,
	dateTime: string,
	location: string,
	iconColor: string,
}

export function filterLatestCrimes(crimes: any[]): any[] {
	const crimesFiltered = crimes.filter((crime: any) => {
		return crime.month === '2022-02';
	});

	return crimesFiltered;
}

export function getCrimeGrouping(category: string) {
	switch (category) {
		case 'anti-social-behaviour':
		case 'public-order':
			return 'Violence Against The Person';
		case 'bicycle-theft':
		case 'vehicle-crime':
			return 'Vehicle';
		case 'burglary':
		case 'other-theft':
		case 'shoplifting':
		case 'theft-from-the-person':
			return 'Theft';
		case 'drugs':
			return 'Drugs';
		case 'possession-of-weapons':
		case 'violent-crime':
			return 'Violent Crime';
		case 'robbery':
			return 'Robbery';
		case 'violence-and-sexual-offense':
			return 'Sexual Offense';
		case 'criminal-damage-arson':
			return 'Arson';
		default:
			return 'Others';
	}
}

export function separateCrimeTypes(crimes: any[]): Crimes[] {
	const allCrimes: any[] = [];

	crimes.forEach((crime: any) => {
		allCrimes.push({
		category: getCrimeGrouping(crime.category),
		icon: getIcon(crime.category),
		crime: {
			id: crime.id,
			dateTime: crime.month,
			location: crime.location.streetName,
			latitude: crime.location.latitude,
			longitude: crime.location.longitude,
		}
		})
	})

	const result = allCrimes.reduce((acc, d) => {
		const found = acc.find((a: Crimes) => a.category === d.category);
		const value = d.crime;
		if (!found) {
			acc.push({ category: d.category, icon: d.icon, crimes: [value]});
		} else {
			found.crimes.push(value)
		}
		return acc;
	}, []);

	return result;
}

export function getIcon2(category: string) {
	switch (category) {
		case 'Violence Against The Person':
			return require('../assets/images/violent-against-person.png');
		case 'Vehicle':
			return require('../assets/images/vehicle.png');
		case 'Theft':
			return require('../assets/images/thief.png');
		case 'Drugs':
			return require('../assets/images/drugs.png');
		case 'Violent Crime':
			return require('../assets/images/violent-crime.png');
		case 'Robbery':
			return require('../assets/images/robbery.png');
		case 'Sexual Offense':
			return require('../assets/images/sexual.png');
		case 'Arson':
			return require('../assets/images/arson.png');
		default:
			return require('../assets/images/other.png');
	}
}

export function getIcon(category: string) {
	switch (category) {
		case 'anti-social-behaviour':
		case 'public-order':
			return require('../assets/images/violent-against-person-pin.png');
		case 'bicycle-theft':
		case 'vehicle-crime':
			return require('../assets/images/vehicle-pin.png');
		case 'burglary':
		case 'other-theft':
		case 'shoplifting':
		case 'theft-from-the-person':
			return require('../assets/images/thief-pin.png');
		case 'drugs':
			return require('../assets/images/drugs-pin.png');
		case 'possession-of-weapons':
		case 'violent-crime':
			return require('../assets/images/violent-crime-pin.png');
		case 'robbery':
			return require('../assets/images/robbery-pin.png');
		case 'violence-and-sexual-offense':
			return require('../assets/images/sexual-pin.png');
		case 'criminal-damage-arson':
			return require('../assets/images/arson-pin.png');
		default:
			return require('../assets/images/other-pin.png');
	}
}