import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Button, Linking, Platform } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VConsole from '@kafudev/react-native-vconsole'
import { lightColors, createTheme, ThemeProvider } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from './src/home';
import DetailsScreen from './src/details';
import GeolocationService from './src/react-native-geolocation-service'
import MapBoxAppScreen from './src/mapbox'
import RouteAnimdemo from './src/mapbox/index_route_anim'

import ListFileAppScreen from './src/mapbox/listfile'
import ViewTxt from './src/mapbox/view-txt'
import ShowTrackerWebView from './src/showtracker'
import SettingScreen from './src/setting'
import Demoh5 from './src/demoh5'
import ReceiveShareModal from './src/receiveshare-model'

import { msg } from './src/libs'
import { UrlTile } from 'react-native-maps';



const theme = createTheme({
  lightColors: {
    primary: '#e7e7e8',
  },
  darkColors: {
    primary: '#000',
  },
});


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="ListFileApp" component={ListFileAppScreen} />
      <HomeStack.Screen name="ShowTrackerWebView" component={ShowTrackerWebView} />
    </HomeStack.Navigator>
  );
}

function App() {

  const navigationRef = useNavigationContainerRef();
  const [initURL, setURL] = useState(null);

  function handleShareUrl(event) {
    navigationRef.navigate('ReceiveShareModal', { url: event.url });
  }
  useEffect(() => {

    if (Platform.OS === "ios") {

      Linking.getInitialURL().then((res: string) => {
        console.log("Linking.getInitialURL", res);
        if (res) {
          // navigationRef.navigate('ReceiveShareModal', { url: res });
          if (res.indexOf("file://") >= 0) {
            setURL(res);
          }

        }

      }).catch((e) => { console.log("Linking.getInitialURL()", e) });
      Linking.addEventListener("url", handleShareUrl);

    }

    return () => {
      Linking.removeEventListener("url", handleShareUrl);

    }
  }, [])


  useEffect(() => {
    if (initURL) {
      handleShareUrl({ url: initURL });
      setURL(null);
    }
  }, [initURL]);


  // console.log("navigationRef.current", navigationRef.current);
  // console.log("initURL", initURL);
  // if (navigationRef.current && initURL) {
  //   console.log("handleShareUrl go");

  // }


  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>

          <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
              headerShown: true,

            }}

          >
            <Stack.Group
              screenOptions={{ headerStyle: { backgroundColor: 'white' } }}
            >


              <Stack.Screen name="HomeScreen" component={HomeScreen} />

              <Stack.Screen name="ListFileApp" component={ListFileAppScreen} />
              <Stack.Screen name="ShowTrackerWebView" component={ShowTrackerWebView} />

            </Stack.Group>


            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="ReceiveShareModal" component={ReceiveShareModal} />
            </Stack.Group>
          </Stack.Navigator>
          <View>
            <VConsole />
          </View>
        </NavigationContainer>
      </SafeAreaProvider >
    </ThemeProvider >
  );
}

function App2() {

  useEffect(() => {

    if (Platform.OS === "ios") {

      Linking.getInitialURL().then((res: any) => {
        console.log("Linking.getInitialURL", res)
      }).catch(() => { });
      linkid = Linking.addEventListener("url", (event) => {
        console.log("_handleOpenURL", event, decodeURI(event.url));
      });

    }

    return () => {
      Linking.removeSubscription(linkid);

    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>

        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
          <Stack.Screen name="GeolocationService" component={GeolocationService} />
          <Stack.Screen name="ListFileApp" component={ListFileAppScreen} />
          <Stack.Screen name="MapBoxApp" component={MapBoxAppScreen} options={{
            title: 'My home',
            headerRight: () => (
              <Text
                onPress={() => msg.emit('MapBoxActionSheetOpen')}

              >Menu</Text>
            ),
          }} />
          <Stack.Screen name="ViewTxtScreen" component={ViewTxt} />
          <Stack.Screen name="ShowTrackerWebView" component={ShowTrackerWebView} />
          <Stack.Screen name="SettingScreen" component={SettingScreen} />
          <Stack.Screen name="RouteAnimdemo" component={RouteAnimdemo} />
          <Stack.Screen name="demoh5" component={Demoh5} />

        </Stack.Navigator>
        <View>
          <VConsole />
        </View>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;