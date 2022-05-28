import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/home';
import DetailsScreen from './src/details';
import GeolocationService from './src/react-native-geolocation-service'
import MapBoxApp from './src/mapbox'
import ListFileApp from './src/mapbox/listfile'

const Stack = createNativeStackNavigator();
import VConsole from '@sigmayun/react-native-vconsole'

function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        <Stack.Screen name="GeolocationService" component={GeolocationService} />
        <Stack.Screen name="ListFileApp" component={ListFileApp} />
        <Stack.Screen name="MapBoxApp" component={MapBoxApp} />
      </Stack.Navigator>
      <View>
        <VConsole />
        <View></View>
      </View>
    </NavigationContainer>
  );
}

export default App;