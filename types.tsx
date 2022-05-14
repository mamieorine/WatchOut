/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  RouteScreen: RouteScreenParams;
  CrimeDetailScreen: CrimeDetailScreenParams;
  MapHomeScreen: MapHomeParams;
  Home: undefined;
  Agreement: undefined;
};

export type CrimeDetailScreenParams = {
  dataRoutes: any;
};

export type RouteScreenParams = {
  destination: any;
  origin: any;
  crimes: any;
  filterCrimes: any[];
};

export type MapHomeParams = {
  destination: any;
  dataRoutes: any;
  isShowDestinationSheet: boolean;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  MapHomeScreen: undefined;
  TabTwo: undefined;
  TabThree: undefined;
  TabFour: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
