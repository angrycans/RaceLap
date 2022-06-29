import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useRef, useEffect, useState } from 'react';

import { HttpWebIP } from '../libs'



// ...
const Demoh5 = () => {

    console.log("HttpWebIP", HttpWebIP);


    return (
        <View style={{ flex: 1 }}>
            <WebView source={{ uri: "./web.bundle/testmapbox-1/index.html" }}
                allowFileAccess={true}
                javaScriptEnabled={true}
                decelerationRate='normal'
                scrollEnabled={true}
                useWebKit={true}
                mediaPlaybackRequiresUserAction={true}
                mixedContentMode="compatibility"
                originWhitelist={["file://"]}
                allowingReadAccessToURL="*"
                style={{ flex: 1 }}


            //injectJavaScript={`alert("");window.__DEV__=${__DEV__}`}
            />
        </View>
    )

}


export default Demoh5;