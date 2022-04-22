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

export function separateCrimeTypes(crimes: any[]): Crimes[] {
	const allCrimes: any[] = [];

	crimes.forEach((crime: any) => {
		allCrimes.push({
		category: crime.category,
		icon: getPinColor(crime.category),
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

function getPinColor(category: string) {
	let color = 'red';
	switch (category) {
		case 'anti-social-behaviour':
		case 'public-order':
			color = 'yellow';
			break;
		case 'robbery':
			color = 'purple';
			break;
		case 'shoplifting':
			color = 'yellow';
			break;
		case 'theft-from-the-person':
		case 'other-theft':
			color = 'purple';
			break;
		case 'vehicle-crime':
		case 'bicycle-theft':
			color = 'blue';
			break;
		case 'burglary':
			color = 'orange';
			break;
		case 'possession-of-weapons':
		case 'criminal-damage-arson':
		case 'violent-crime':
			color = 'red';
			break;
		case 'other-crime':
			color = 'green';
			break;
	}
	return color;
}