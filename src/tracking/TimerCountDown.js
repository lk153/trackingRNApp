import React, { useState } from 'react';
import { Text, View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import KeepAwake from 'react-native-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimerCountDown = ({ navigation: { navigate }, route }) => {
    const taskTimeSeconds = route.params.taskEnd - route.params.taskStart
    const [isPlaying, setIsPlaying] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [remainSeconds, setRemainSeconds] = useState(taskTimeSeconds)
    const remainingTimeKey = "@remainingTime"

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("unsubscribe navigation")
        });
    
        return unsubscribe;
    }, [navigation]);

    return (
        <LinearGradient colors={['#020024', '#6d0979', '#00d4ff']}
            useAngle={true}
            angle={120}
            angleCenter={{ x: 0.5, y: 0.5}}
            style={[styles.container]}
        >
            <View style={styles.detailView}>
                <KeepAwake/>
                <TouchableOpacity onPress={() => setIsPlaying(prev => !prev)}>
                    <CountdownCircleTimer
                        trailColor='#d9d9d9'
                        isLinearGradient={true}
                        isPlaying={isPlaying}
                        duration={taskTimeSeconds}
                        initialRemainingTime={remainSeconds}
                        colors={[
                            ['#218ad8', 0.5],
                            ['#7ec964', 0.5],
                        ]}
                        onComplete={(totalElapsedTime) => {
                            setIsDone(true)
                            return [false, 0]
                        }}
                    >
                    {({ remainingTime, elapsedTime, animatedColor}) => {
                        // try {
                        //     const jsonValue = JSON.stringify(remainingTime)
                        //     await AsyncStorage.setItem(remainingTimeKey, jsonValue)
                        // } catch (e) {
                        // // saving error
                        // }
                        return (
                            <Animated.Text style={{ color: animatedColor, fontSize: 30 }}>
                            {`${moment.utc(remainingTime*1000).format('HH:mm:ss')}`}
                            </Animated.Text>
                        )
                    }}
                    </CountdownCircleTimer>
                </TouchableOpacity>
                {isDone ?
                    <View style={styles.success}>
                        <Text style={styles.successText}>
                            {'Chúc mừng bạn đã hoàn thành'}
                        </Text>
                        <Icon name={"check"}
                            color={'#7ec964'}
                            size={50}
                            style={{marginTop: 10}}
                        />
                    </View>
                    : 
                    <TouchableOpacity onPress={() => setIsPlaying(prev => !prev)}>
                        <Icon name={isPlaying ? "pause" : "play-outline"}
                            color={'#ffffff'}
                            size={50}
                            style={{marginTop: 20}}
                        />
                    </TouchableOpacity>
                }
            </View>
        </LinearGradient>
    )
}

export default TimerCountDown;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        height: '100%'
    },
    detailView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        backgroundColor: "#2c3e58",
        borderColor: "#ffffff",
        borderWidth: 3,
        borderRadius: 15,
        height: "100%",
    },
    success: {
        marginTop: 30,
        color: "#ffffff",
        alignItems: 'center'
    },
    successText: {
        color:"#ffffff",
        fontSize: 16
    },
});
