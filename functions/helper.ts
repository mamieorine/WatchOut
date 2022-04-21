export interface Crimes {
	category: string;
	crimes: Crime[];
}

export interface Crime {
	id: number,
	latitude: string,
	longitude: string,
	dateTime: string,
	location: string,
}

export function filterLatestCrimes(crimes: any[]): any[] {
	const crimesFiltered = crimes.filter((crime: any) => {
		// const dateTime = new Date();
		// dateTime.setMonth(dateTime.getMonth() - 1);
		// const crimeOccur = new Date(crime.month).toISOString();
		return crime.month === '2022-02';
	});

	return crimesFiltered;
}

export function separateCrimeTypes(crimes: any[]): Crimes[] {
	const allCrimes: any[] = [];

	crimes.forEach((crime: any) => {
		allCrimes.push({
		category: crime.category,
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
		acc.push({ category: d.category, crimes: [value]});
		}
		else {
		found.crimes.push(value)
		}
		return acc;
	}, []);

	return result;
}