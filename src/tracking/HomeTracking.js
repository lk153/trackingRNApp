import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import Timeline from './Timeline';
import Chart from './Chart';
import RegisterTask from './RegisterTask';

const Tab = createBottomTabNavigator();
const HomeTracking = () => {
    return (
        <Tab.Navigator 
            activeColor="#000"
            tabBarOptions={{
                showLabel: true,
                style: styles.tab,
                activeTintColor: '#000000',
                inactiveTintColor: 'grey',
                activeBackgroundColor: '#fae1fb',
                inactiveBackgroundColor: '#ffffff',
            }}
        >
            <Tab.Screen name="RegisterTask" component={RegisterTask} options={{
                tabBarLabel: 'Công việc',
                tabBarColor: '#009387',
                tabBarIcon: ({ color }) => (
                    <Icon name="create" color={color} size={26} />
                ),
                tabBarBadgeStyle: {
                    textAlign: 'center'
                }
            }}/>
            <Tab.Screen name="Chart" component={Chart} options={{
                tabBarLabel: 'Biểu đồ',
                tabBarColor: '#1f65ff',
                tabBarIcon: ({ color }) => (
                    <Icon name="bar-chart" color={color} size={26} />
                ),
            }}/>
            <Tab.Screen name="Timeline" component={Timeline} options={{
                tabBarLabel: 'Lịch trình',
                tabBarColor: '#1f65ff',
                tabBarIcon: ({ color }) => (
                    <Icon name="hourglass" color={color} size={26} />
                ),
            }}/>
        </Tab.Navigator>
    )
}

export default HomeTracking;

const styles = StyleSheet.create({
    tab: {
        borderRadius: 15,
        height: 60,
    }
})