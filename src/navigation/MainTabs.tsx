import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainTabBar from '@/components/home/TabBar';
import EarningsScreen from '@/screens/tabs/EarningsScreen';
import HomeScreen from '@/screens/tabs/HomeScreen';
import ProfileScreen from '@/screens/tabs/ProfileScreen';
import TripHistoryScreen from '@/screens/tabs/TripHistoryScreen';
import type {MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      tabBar={props => <MainTabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="Trips" component={TripHistoryScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}