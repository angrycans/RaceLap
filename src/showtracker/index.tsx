import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useRef, useEffect, useState } from 'react';

import { HttpWebIP } from '../libs'

import { useShowTrackTxtHook } from './hooks'

// ...
const ShowTrackerWebView = () => {

    console.log("HttpWebIP", HttpWebIP);
    const web = useRef(null);
    const { trackTxt, setTrackTxt } = useShowTrackTxtHook();

    useEffect(() => {
        console.log("ShowTrackerWebView __dev__=", __DEV__)
        if (trackTxt.finishTxt != "" && trackTxt.sessionTxt != "") {

            // let trackTxt2 = { a: "1" };
            // console.log("injectJavaScript", trackTxt2);

            // console.log("StrackTxt", trackTxt)

            web.current.injectJavaScript(`window.trackTxt=${JSON.stringify(trackTxt)}`);
        }

    }, [])

    return (
        <View style={{ flex: 1 }}>
            {__DEV__ ? <WebView source={{ uri: HttpWebIP + "index.html" }}
                allowFileAccess={true}
                javaScriptEnabled={true}
                decelerationRate='normal'
                scrollEnabled={true}
                useWebKit={true}
                mediaPlaybackRequiresUserAction={true}
                mixedContentMode="compatibility"
                //originWhitelist={["file://"]}
                allowingReadAccessToURL="*"
                style={{ flex: 1 }}
                ref={web}
            /> :
                <WebView source={{ uri: HttpWebIP + "index.html" }}
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
                    ref={web}
                />}
        </View>
    )

}


export default ShowTrackerWebView;