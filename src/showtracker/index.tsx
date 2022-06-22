import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useRef, useEffect, useState } from 'react';

import { HttpWebIP } from '../libs'

import { useShowTrackTxtHook } from './hooks'

// ...
const ShowTrackerWebView = () => {

    console.log("HttpWebIP", HttpWebIP);

    function onMessage(data) {
        console.log("onMessage", data.nativeEvent.data);
    }

    function sendMsg2Web(key: string, data: any) {
        // console.log("onMessage", data.nativeEvent.data);
        //let a = { a: 123 };
        console.log("sendMsg2Web", key, data);
        web.current.injectJavaScript(`RNMsg.emit("${key}",${JSON.stringify(data)});true`);
    }

    const web = useRef(null);
    const { trackTxt, setTrackTxt } = useShowTrackTxtHook();
    useEffect(() => {
        console.log("ShowTrackerWebView __dev__=", __DEV__, web.current)
        if (trackTxt.finishTxt != "" && trackTxt.sessionTxt != "" && web.current) {

            //sendMsg2Web("trackTxt", trackTxt);
            setTimeout(() => {
                sendMsg2Web("trackTxt", trackTxt);
            }, 2000);

        }
    }, [trackTxt])
    return (
        <View style={{ flex: 1 }}>
            <WebView source={{ uri: HttpWebIP + "index.html" }}
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
                injectJavaScript={`console.log("init...");window.__DEV__=${__DEV__}`}
            />
        </View>
    )

}


export default ShowTrackerWebView;