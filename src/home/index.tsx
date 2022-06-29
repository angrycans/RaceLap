import React, { useRef, useEffect, useState } from 'react';
import { Button, View, Text, Linking, Platform, StatusBar } from 'react-native';
import moment from 'moment';
import SafeAreaView from 'react-native-safe-area-view';

import { useNavigation } from '@react-navigation/native';
import { msg } from '../libs'



function HomeScreen() {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{
            flex: 1, alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: '#6a51ae'
        }}>

            <StatusBar
                barStyle="light-content"
                backgroundColor='blue'
            />
            <Text>Home Screen</Text>
            <Button
                title="Go to ShowTrackerWebView"
                onPress={() => navigation.navigate('ShowTrackerWebView')}
            />

            <Button
                title="Go to GeolocationService"
                onPress={() => navigation.navigate('GeolocationService')}
            />

            <Button
                title="Go to ListFileApp"
                onPress={() => navigation.navigate('ListFileApp')}
            />

            <Button
                title="Go to MapBoxApp"
                onPress={() => navigation.navigate('MapBoxApp')}
            />
            <Button
                title="Go to Setting"
                onPress={() => navigation.navigate('SettingScreen')}
            />
            <Button
                title="Go to RouteAnimdemo"
                onPress={() => navigation.navigate('RouteAnimdemo')}
            />

            <Button
                title="Go to demoh5"
                onPress={() => navigation.navigate('demoh5')}
            />

            <Button
                onPress={() => navigation.navigate('ReceiveShareModal')}
                title="Open Modal"
            />
        </SafeAreaView>
    );

}


export default HomeScreen;