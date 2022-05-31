import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/home';
import DetailsScreen from './src/details';
import GeolocationService from './src/react-native-geolocation-service'
import MapBoxAppScreen from './src/mapbox'
import ListFileAppScreen from './src/mapbox/listfile'
import { msg } from './src/libs'


const Stack = createNativeStackNavigator();
//import VConsole from '@sigmayun/react-native-vconsole'

function App() {
  return (
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
      </Stack.Navigator>
      {/* <View>
        <VConsole />
        <View></View>
      </View> */}
    </NavigationContainer>
  );
}

export default App;