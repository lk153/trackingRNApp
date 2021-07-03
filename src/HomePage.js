import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { 
    Provider as PaperProvider, 
    DefaultTheme as PaperDefaultTheme,
    DarkTheme as PaperDarkTheme 
} from 'react-native-paper';
import { 
    NavigationContainer, 
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import NeomorphBlurControl from './neomorph/NeomorphBlurControl';
import NeomorphControl from './neomorph/NeomorphControl';
import ShadowsControl from './neomorph/ShadowsControl';

import { AuthContext } from './components/context';
import RootStackScreen from './screens/RootStackScreen';
import { DrawerContent } from './screens/DrawerContent';
import SupportScreen from './screens/SupportScreen';
import SettingsScreen from './screens/SettingsScreen';
import BookmarkScreen from './screens/BookmarkScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeTracking from './tracking/HomeTracking';
import { loginReducer } from './reducer'
  
const Drawer = createDrawerNavigator();
const HomePage = () => {
    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
      };
    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        ...PaperDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            ...PaperDefaultTheme.colors,
            background: '#ffffff',
            text: '#333333'
        }
    }
    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        ...PaperDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            ...PaperDarkTheme.colors,
            background: '#000',
            text: '#ffffff',
            primary: '#ffffff'
        }
    }
    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
    const authContext = React.useMemo(() => ({
        signIn: async(foundUser) => {
            const userToken = String(foundUser[0].userToken);
            const userName = foundUser[0].username;
            try {
                await AsyncStorage.setItem('userToken', userToken);
            } catch(e) {
                console.log(e);
            }
            dispatch({ type: 'LOGIN', id: userName, token: userToken });
        },
        signOut: async() => {
            try {
                await AsyncStorage.removeItem('userToken');
            } catch(e) {
                console.log(e);
            }
            dispatch({ type: 'LOGOUT' });
        },
        signUp: () => {
        },
        toggleTheme: () => {
            setIsDarkTheme( isDarkTheme => !isDarkTheme );
        }
    }), []);

    useEffect(() => {
        setTimeout(async() => {
            let userToken;
            userToken = null;
            try {
                userToken = await AsyncStorage.getItem('userToken');
            } catch(e) {
                console.log(e);
            }
            dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
        }, 1000);
    }, []);

    if( loginState.isLoading ) {
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <AuthContext.Provider value={authContext}>
                <NavigationContainer>
                { loginState.userToken !== null ? (
                    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} initialRouteName="HomeTracking">
                        <Drawer.Screen name="HomeTracking" component={HomeTracking} />
                        <Drawer.Screen name="SupportScreen" component={SupportScreen} />
                        <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
                        <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
                        <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
                    </Drawer.Navigator>
                    ) :
                    <RootStackScreen/>
                }
                </NavigationContainer>
            </AuthContext.Provider>
        </PaperProvider>
    );
}

export default HomePage;