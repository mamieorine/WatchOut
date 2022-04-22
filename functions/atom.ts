import { atom } from 'jotai'

interface Routes {
	indexSelected: number,
	allRoutes: any[]
}

export const routesAtom = atom(<Routes>{
    indexSelected: 100,
    allRoutes: []
});