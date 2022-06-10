import React, { Component } from 'react';
import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { HttpWebIP } from '../libs'

// ...
const ShowTrackerWebView = () => {

    console.log("HttpWebIP", HttpWebIP);

    return (
        __DEV__ ? <WebView source={{ uri: HttpWebIP + "/index.html" }}
            allowFileAccess={true}
            javaScriptEnabled={true}
            decelerationRate='normal'
            scrollEnabled={true}
            useWebKit={true}
            mediaPlaybackRequiresUserAction={true}
            mixedContentMode="compatibility"
            //originWhitelist={["file://"]}
            allowingReadAccessToURL="*"

        /> :
            <WebView source={{ uri: HttpWebIP + "/show-session/index.html" }}
                allowFileAccess={true}
                javaScriptEnabled={true}
                decelerationRate='normal'
                scrollEnabled={true}
                useWebKit={true}
                mediaPlaybackRequiresUserAction={true}
                mixedContentMode="compatibility"
                originWhitelist={["file://"]}
                allowingReadAccessToURL="*"

            />
        // <WebView source={{ uri: "./resources/index2.html" }} />
    )

}


export default ShowTrackerWebView;