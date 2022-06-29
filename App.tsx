import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Linking, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VConsole from '@kafudev/react-native-vconsole'
import { lightColors, createTheme, ThemeProvider } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';


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


import { msg } from './src/libs'



const theme = createTheme({
  lightColors: {
    primary: '#e7e7e8',
  },
  darkColors: {
    primary: '#000',
  },
});


const Stack = createNativeStackNavigator();


var linkid;

function App() {

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