import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';

import Loader from '../components/Loader';

const TASK_API_ENDPOINT = "http://192.168.1.5:8080/v1/task/"
const TaskDetail = ({ navigation: { navigate }, route }) => {
    const isFocused = useIsFocused()
    const [data, setData] = useState({
        data: {},
        loading: false,
    })
    const mapColor = [
        {
            "progress": 0,
            "value": "#f43906"
        },
        {
            "progress": 0.34,
            "value": "#52e5fe"
        },
        {
            "progress": 0.67,
            "value": "#53f404"
        }
    ]

    const getProgressColor = (progressValue) => {
        result = mapColor.filter(item => item.progress < progressValue)
        progressColor = result.pop()
        return progressColor.value
    }

    useEffect(() => {
        setData({loading: true})
        fetch(TASK_API_ENDPOINT + route.params.taskID)
            .then((response) => response.json())
            .then((json) => {
                if (json.data != null) {
                    setData({data: json.data, loading: false})
                }
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setData(prevData => {
                    return {
                        ...prevData, 
                        loading: false
                    }
                })
            });
    }, [isFocused]);
    
    return (
        <LinearGradient colors={['#020024', '#6d0979', '#00d4ff']}
            useAngle={true}
            angle={120}
            angleCenter={{ x: 0.5, y: 0.5}}
            style={[styles.container]}
        >
            <Loader loading={data.loading}/>
            {data.data ? 
                <ScrollView>
                    <Animatable.View animation="fadeInUpBig">
                        <View style={styles.detailView}>
                            <View style={styles.section}>
                                <Text style={styles.label}>TÊN CÔNG VIỆC</Text>
                                <Text style={styles.text}>{data.data.name}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.label}>GIỜ BẮT ĐẦU</Text>
                                <Text style={{...styles.text, ...styles.hour}}>{moment(data.data.startAt, "HH:mm:ss").utcOffset(60*7).format('HH : mm')}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.label}>GIỜ KẾT THÚC</Text>
                                <Text style={{...styles.text, ...styles.hour}}>{moment(data.data.endAt, "HH:mm:ss").utcOffset(60*7).format('HH : mm')}</Text>
                            </View>
                            <View style={{...styles.section, ...{alignItems: 'center'}}}>
                                <TouchableOpacity onPress={() => {navigate('TimerCountDown', {
                                    taskID: data.data.id, 
                                    taskName: data.data.name,
                                    taskStart: data.data.startAt.split(':').reduce((acc,time) => (60 * acc) + +time),
                                    taskEnd: data.data.endAt.split(':').reduce((acc,time) => (60 * acc) + +time),
                                })}}>
                                    <Progress.Circle indeterminate={false} rotation={false} animated={false} 
                                        showsText={true} color={getProgressColor(1)} 
                                        progress={1} thickness={10} borderWidth={3} size={150}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animatable.View>
                </ScrollView>
            : 
                <Animatable.View animation="fadeInUpBig">
                    <View>
                        <Text style={styles.label}>Công việc không tìm thấy</Text>
                    </View>
                </Animatable.View>
            }
        </LinearGradient>
    )
}

export default TaskDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        height: '100%'
    },
    detailView: {
        flex: 1,
        backgroundColor: "#2c3e58",
        borderColor: "#ffffff",
        borderWidth: 3,
        borderRadius: 15,
        height: "100%",
        padding: 20
    },
    section: {
        marginBottom: 60,
    },
    label: {
        color: '#52e5fe',
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
    text: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: "500",
        marginTop: 0,
        marginLeft: 0,
        // borderWidth: 3,
        // borderColor: "#ffffff",
        // // backgroundColor: "#E0E0E0",
        // borderRadius: 10,
        padding: 10,
        textAlign: "center",
    },
    hour: {
        fontWeight: "700",
        fontSize: 20,
    },
});