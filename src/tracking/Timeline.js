import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment';

import Loader from '../components/Loader';

const TASK_API_ENDPOINT = "http://192.168.1.5:8080/v1/tasks"
function convertData(input) {
    if (input.length > 0) {
        output = input.map(item => {
            return {time: moment("2021-07-02 " + item.startAt).utcOffset(60*7).format('HH:mm'), title: item.name}
        })

        return output
    }

    return []
}

const TrackTimeline = () => {
    const isFocused = useIsFocused()
    const [data, setData] = useState({
        data: [],
        loading: false,
    })

    useEffect(() => {
        setData({loading: true})
        fetch(TASK_API_ENDPOINT)
            .then((response) => response.json())
            .then((json) => {
                if (json.data != null) {
                    output = convertData(json.data)
                    setData({data: output, loading: false})
                }
            })
            .catch((error) => console.error(error))
            .finally(() => {});
    }, [isFocused]);

    return (
        <LinearGradient
            colors={['#020024', '#6d0979', '#00d4ff']}
            useAngle={true}
            angle={120}
            angleCenter={{ x: 0.5, y: 0.5}}
            style={styles.container}
        >
            <Loader loading={data.loading}/>
            <Timeline
                data={data.data}
                circleSize={20}
                dotColor='#000000'
                circleColor={styles.tree.color}
                lineColor={styles.tree.color}
                lineWidth={5}
                timeContainerStyle={{minWidth:72, marginTop: 0}}
                timeStyle={styles.time}
                descriptionStyle={{color:'gray'}}
                innerCircle={'dot'}
                columnFormat='two-column'
                options={{
                    style:{paddingTop:5, width: '100%'},
                }}
                titleStyle={styles.eventDetail}
            />
        </LinearGradient>
    );
};

export default TrackTimeline;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    eventDetail: {
        padding: 5,
        backgroundColor: "#fabd03",
        color: "#000000",
        marginBottom: 30,
        borderWidth: 3,
        borderColor: "#ffffff",
        borderRadius: 13,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '300'
    },
    time: {
        paddingTop: 5,
        alignItems: 'center',
        padding:1, 
        textAlign: 'center', 
        backgroundColor:'#33a852', 
        color:'#ffffff', 
        borderWidth: 3,
        borderColor: "#ffffff",
        borderRadius: 13,
    },
    tree: {
        color: "#fabd03"
    }
});