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
        web.current.injectJavaScript(`RNMsg.emit("${key}",${JSON.stringify(data)})`);
    }

    const web = useRef(null);
    const { trackTxt, setTrackTxt } = useShowTrackTxtHook();
    useEffect(() => {
        console.log("ShowTrackerWebView __dev__=", __DEV__)
        if (trackTxt.finishTxt != "" && trackTxt.sessionTxt != "") {
            console.log("injectJavaScript", trackTxt);
            // let a = 12345;
            // web.current.injectJavaScript(`RNMessage(window.trackTxt=${JSON.stringify(trackTxt)});true;`);
            // web.current.injectJavaScript(`console.log("msg1=>",msg);msg.emit('rnmsg',${a})`);
            // web.current.postMessage('Data from React Native App');
            sendMsg2Web("trackTxt", trackTxt);
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
            //injectJavaScript={`alert("");window.__DEV__=${__DEV__}`}
            />
        </View>
    )

}


export default ShowTrackerWebView;