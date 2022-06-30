import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useRef, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { HttpWebIP } from '../libs'

import { useShowTrackTxtHook } from './hooks'

// ...
const ShowTrackerWebView = () => {
    const navigation = useNavigation();
    navigation.setOptions({ headerShown: true })

    console.log("HttpWebIP", HttpWebIP);

    function onMessage(d) {
        console.log("onMessage", d);
        let { event } = JSON.parse(d.nativeEvent.data)
        if (event == "onLoad") {
            web.current.injectJavaScript(`window.__DEV__=${__DEV__};`);
            sendMsg2Web("trackTxt", trackTxt);
        }
    }

    function sendMsg2Web(key: string, data: any) {
        console.log("sendMsg2Web", key, data);
        web.current.injectJavaScript(`RNMsg.emit("${key}",${JSON.stringify(data)});true`);
    }

    const web = useRef(null);
    const { trackTxt, setTrackTxt } = useShowTrackTxtHook();
    // useEffect(() => {
    //     console.log("ShowTrackerWebView __dev__=", __DEV__, web.current)
    //     if (trackTxt.finishTxt != "" && trackTxt.sessionTxt != "" && web.current) {

    //         // //sendMsg2Web("trackTxt", trackTxt);
    //         // setTimeout(() => {
    //         //     // sendMsg2Web("trackTxt", trackTxt);
    //         // }, 2000);

    //     }
    // }, [trackTxt])


    return (
        <View style={{ flex: 1 }}>
            {trackTxt && <WebView source={{ uri: HttpWebIP + "index.html" }}
                allowFileAccess={true}
                javaScriptEnabled={true}
                decelerationRate='normal'
                scrollEnabled={true}
                useWebKit={true}
                mediaPlaybackRequiresUserAction={true}
                mixedContentMode="compatibility"
                originWhitelist={__DEV__ ? ['https://', 'http://'] : ["file://"]}//{["file://"]}
                allowingReadAccessToURL="*"
                style={{ flex: 1 }}
                ref={web}
                onMessage={onMessage}
            />}
        </View>
    )

}


export default ShowTrackerWebView;