import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Timeline from './Timeline';
import TaskDetail from './TaskDetail';
import TimerCountDown from './TimerCountDown';

const TimelineStack = () => {
    const TaskStack = createStackNavigator();

    return (
        <TaskStack.Navigator>
            <TaskStack.Screen
                name="Timeline"
                component={Timeline}
                options={{ headerShown: false, animationEnabled: true }}
            />
            <TaskStack.Screen
                name="TaskDetail"
                component={TaskDetail}
                options={{ headerShown: false, animationEnabled: true }}
            />
            <TaskStack.Screen
                name="TimerCountDown"
                component={TimerCountDown}
                options={{ headerShown: false, animationEnabled: true }}
            />
        </TaskStack.Navigator>
    )
}

export default TimelineStack;