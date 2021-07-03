import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native';
import { StackedAreaChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape'

const Chart = () => { 
    const [data, updateData] = React.useState([]);
    const contentInset = { top: 50, bottom: 50 }
    
    React.useEffect(function effectFunction() {
        updateData([
            {
                apples: 3840,
                bananas: 1920,
                cherries: 960,
                dates: 400,
            },
            {
                apples: 1600,
                bananas: 1440,
                cherries: 960,
                dates: 400,
            },
            {
                apples: 640,
                bananas: 960,
                cherries: 3640,
                dates: 400,
            },
            {
                apples: 3320,
                bananas: 480,
                cherries: 640,
                dates: 400,
            },
        ]);
    }, []);

    const colors = ['#8800cc', '#aa00ff', '#cc66ff', '#eeccff']
    const keys = ['apples', 'bananas', 'cherries', 'dates']
    const svgs = [
        { onPress: () => console.log('apples') },
        { onPress: () => console.log('bananas') },
        { onPress: () => console.log('cherries') },
        { onPress: () => console.log('dates') },
    ]

    return (
        <View style={styles.container}>
            <YAxis
                data={StackedAreaChart.extractDataPoints(data, keys)}
                contentInset={contentInset}
                svg={{
                    fill: '#fff',
                    fontSize: 12,
                    stroke: '#000',
                    strokeWidth: 0.3,
                    alignmentBaseline: 'baseline',
                    baselineShift: '3',
                }}
                numberOfTicks={10}
                formatLabel={(value) => `${value}`}
            />
            <StackedAreaChart
                style={styles.chart}
                keys={keys}
                colors={colors}
                data={data}
                contentInset={contentInset}
                curve={shape.curveNatural}
            >
                <Grid belowChart={false} />
            </StackedAreaChart>
            <XAxis
                style={{ marginHorizontal: -10, borderWidth: 3, borderColor: 'red'}}
                data={StackedAreaChart.extractDataPoints(data, keys)}
                formatLabel={(value, index) => index}
                contentInset={{ left: 50, right: 50 }}
                svg={{ fontSize: 10, fill: 'black' }}
            />
        </View>
    )
}

export default Chart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#212833",
        // borderWidth: 3,
        // borderColor: 'red',
    },
    chart: {
        paddingRight: 30,
        color: "#fff",
        // borderWidth: 3,
        // borderColor: 'red',
        width: '100%'
    },
    grid: {
        color: "white",
        backgroundColor: "white"
    }
})