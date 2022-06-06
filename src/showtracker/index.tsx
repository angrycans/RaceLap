import React, { Component } from 'react';
import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { HttpWebIP } from '../libs'

// ...
const ShowTrackerWebView = () => {

    return (
        // <WebView source={{ uri: './mapbox.bundle/index.html' }}
        //     allowFileAccess={true}
        //     javaScriptEnabled={true}
        //     decelerationRate='normal'
        //     scrollEnabled={true}
        //     useWebKit={true}
        //     mediaPlaybackRequiresUserAction={true}
        //     mixedContentMode="compatibility"
        //     originWhitelist={["file://"]}
        //     allowingReadAccessToURL="*"

        // />
        <WebView source={{ uri: "//172.19.3.37:8881/" }} />
    )

}


export default ShowTrackerWebView;