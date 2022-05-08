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

export function getIcon(category: string) {
	switch (category) {
		case 'anti-social-behaviour':
		case 'public-order':
			return require('../assets/images/violent-against-person.png');
		case 'bicycle-theft':
		case 'vehicle-crime':
			return require('../assets/images/vehicle.png');
		case 'burglary':
		case 'other-theft':
		case 'shoplifting':
		case 'theft-from-the-person':
			return require('../assets/images/thief.png');
		case 'drugs':
			return require('../assets/images/drugs.png');
		case 'possession-of-weapons':
		case 'violent-crime':
			return require('../assets/images/violent-crime.png');
		case 'robbery':
			return require('../assets/images/robbery.png');
		case 'violence-and-sexual-offense':
			return require('../assets/images/sexual.png');
		default:
			return require('../assets/images/thief.png');
	}
}