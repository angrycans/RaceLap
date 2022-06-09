import React, { Component } from 'react';
import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { HttpWebIP } from '../libs'

// ...
const ShowTrackerWebView = () => {

    return (
        <WebView source={{ uri: HttpWebIP + "/track.html" }}
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