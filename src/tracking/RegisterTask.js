import React, {useState} from 'react';
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Loader from '../components/Loader';

const TASK_API_ENDPOINT = "http://192.168.1.5:8080/v1/task"
const showFailSubmit = () =>
  Alert.alert(
    "Thông báo",
    "Tạo công việc thất bại. Xin bạn vui lòng thử lại!",
    [
        {
            text: "Thử lại",
            style: "cancel",
        },
    ],
    {
        cancelable: true,
        onDismiss: () => {},
    }
);

const Task = (props) => {
    const validationSchema = Yup.object().shape({
        taskName: Yup.string()
            .required('Nhập tên công việc'),
        startAt: Yup.date()
            .required('Chọn giờ bắt đầu'),
        endAt: Yup.date()
            .min(Yup.ref('startAt'), "Giờ kết thúc lớn hơn giờ bắt đầu")
    });
    const defaultValues = {taskName: "", startAt: new Date(), endAt: new Date()};
    const formOptions = { resolver: yupResolver(validationSchema), defaultValues};
    const { control, handleSubmit, formState: { errors }, reset } = useForm(formOptions);
    const [show, setShow] = useState({
        type: 0
    });

    const [status, setStatus] = useState({
        loading: false,
        isRegistraionSuccess: false,
    })

    const onSubmit = data => {
        setStatus({isRegistraionSuccess: false, loading: true})
        fetch(TASK_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "data" : {
                    "name": data.taskName,
                    "startAt": moment(data.startAt).utcOffset(60*7).format('HH:mm'),
                    "endAt": moment(data.endAt).utcOffset(60*7).format('HH:mm'),
                    "status": 1
                }
            })
        })
        .then((response) => response.json())
        .then((json) => {
            setStatus({isRegistraionSuccess: true, loading: false})
            return json;
        })
        .catch((error) => {
            setStatus({isRegistraionSuccess: false, loading: false})
        });
    }
    
    return (
        (status.isRegistraionSuccess == false ?
        <LinearGradient colors={['#020024', '#6d0979', '#00d4ff']}
            useAngle={true}
            angle={120}
            angleCenter={{ x: 0.5, y: 0.5}}
            style={[styles.container]}
        >
            <Loader loading={status.loading}/>
            <ScrollView style={{height: '100%'}}>
                <Animatable.View animation="fadeInUpBig">
                    <View style={styles.section}>
                        <Text style={styles.label}>Tên công việc</Text>
                        <Controller
                            control={control}
                            render={({field: { onChange, onBlur, value }}) => (
                            <TextInput
                                style={styles.textArea}
                                underlineColorAndroid="transparent"
                                placeholder="Nhập tên công việc của bạn"
                                placeholderTextColor="grey"
                                placeholderStyle={{textAlign: "center"}}
                                numberOfLines={5}
                                multiline={true}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                rules={{ required: true }}
                            />
                            )}
                            name="taskName"
                            rules={{ required: true }}
                            defaultValue=""
                        />
                        {errors.taskName && <Text style={styles.errorMsg}>Trường bắt buộc</Text>}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Giờ bắt đầu</Text>
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            render={({field: { onChange, onBlur, value }}) => (
                                <View>
                                    <Text style={styles.text} onPress={() => setShow({type: 1})}>{value && moment(value).utcOffset(60*7).format('HH:mm')}</Text>
                                    {show.type == 1 && (<RNDateTimePicker value={value}
                                            mode='time'
                                            is24Hour={true}
                                            display="clock"
                                            timeZoneOffsetInMinutes={60*7}
                                            onChange={(event, date) =>  {
                                                if (date != undefined) {
                                                    setShow({type: 0}); onChange(date);
                                                }
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                            name="startAt"
                            rules={{ required: true }}
                            defaultValue={new Date()}
                        />
                        {errors.startAt && <Text style={styles.errorMsg}>{errors.startAt.message}</Text>}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Giờ kết thúc</Text>
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            render={({field: { onChange, onBlur, value }}) => (
                                <View>
                                    <Text style={styles.text} onPress={() => setShow({type: 2})}>{value && moment(value).utcOffset(60*7).format('HH:mm')}</Text>
                                    {show.type == 2 && (<RNDateTimePicker value={value}
                                        mode='time'
                                        is24Hour={true}
                                        display="clock"
                                        timeZoneOffsetInMinutes={60*7}
                                        onChange={(event, date) =>  {
                                            if (date != undefined) {
                                                setShow({type: 0}); onChange(date);
                                            }
                                        }}
                                        disabled={true}
                                        />
                                    )}
                                </View>
                            )}
                            name="endAt"
                            rules={{ required: true }}
                            defaultValue={new Date()}
                        />
                        {errors.endAt && <Text style={styles.errorMsg}>{errors.endAt.message}</Text>}
                    </View>

                    <View style={[styles.button, {marginTop: 10}]}>
                        <TouchableOpacity
                            style={{width: '100%'}}
                            onPress={() => {reset(defaultValues)}}
                        >
                            <LinearGradient
                                colors={['#ad10a9', '#ad10a9']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color:'#ffffff'
                                }]}>Xoá</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            style={[styles.signIn, {
                                marginTop: 25,
                                backgroundColor: "#fabd03"
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#000000'
                            }]}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </ScrollView>
        </LinearGradient> : 
        <View style={{
            flex: 1,
            backgroundColor: '#307ecc',
            justifyContent: 'center',
        }}>
            <Image source={require('../assets/success.png')}
                style={{
                    height: 150,
                    resizeMode: 'contain',
                    alignSelf: 'center'
                }}
            />
            <Text style={styles.successTextStyle}>Bạn đã đăng ký thành công!</Text>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => {
                    reset(defaultValues)
                    setStatus({isRegistraionSuccess: false, loading: false})
                    props.navigation.navigate('Timeline')
                }}
            >
                <Text style={styles.buttonTextStyle}>Xem danh sách</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => {
                    reset(defaultValues)
                    setStatus({isRegistraionSuccess: false, loading: false})
                    props.navigation.navigate('RegisterTask')
                }}
            >
                <Text style={styles.buttonTextStyle}>Tạo công việc mới</Text>
            </TouchableOpacity>
        </View>
        )
    )
}

export default Task;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        height: '100%'
    },
    section: {
        marginBottom: 40,
    },
    label: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },
    text: {
        color: '#000000',
        fontSize: 14,
        fontWeight: "500",
        marginTop: 10,
        marginLeft: 0,
        borderWidth: 3,
        borderColor: "#ffffff",
        backgroundColor: "#E0E0E0",
        borderRadius: 10,
        padding: 10,
        textAlign: "center",
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    textArea: {
        height: 100,
        backgroundColor: '#ffffff',
        color: "#000000",
        borderRadius: 5,
        borderWidth: 3,
        borderColor: "#ffffff"
    },
    datePicker: {
        width: 'auto',
        color: "#ffffff",
        backgroundColor: "#ffffff",
    },
    errorMsg: {
        color: '#ffffff',
        paddingVertical: 2,
        backgroundColor: '#d60e40',
        textAlign: 'center',
        marginTop: 10,
        borderRadius: 13,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#ffffff',
        borderWidth: 3,
    },
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
    buttonStyle: {
        backgroundColor: '#fabd03',
        borderWidth: 0,
        borderColor: '#7DE24E',
        height: 50,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonTextStyle: {
        color: '#000000',
        paddingVertical: 10,
        fontSize: 18,
    },
});