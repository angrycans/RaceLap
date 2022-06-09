import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {
    MapView,
    ShapeSource,
    LineLayer,
    SkyLayer,
    Camera,
    Logger,
    Terrain,
    RasterDemSource,
    Animated,
    MarkerView,
} from '@rnmapbox/maps';
import { msg, MapboxAccessToken, formatMS } from '../libs'
import { ListItem, Icon, Avatar, TabView, Tab, Button, Text } from '@rneui/themed'
import { Animated as RNAnimated } from 'react-native';

import { useTrackHook } from "./hooks"
import exampleIcon from './pin.png';


MapboxGL.setAccessToken(MapboxAccessToken);
const AnimatedMarkerView = RNAnimated.createAnimatedComponent(MarkerView);


const AnnotationContent = () => (
    <View style={styles.touchableContainer}>

        <TouchableOpacity style={styles.touchable}>
            <Text style={styles.touchableText}></Text>
        </TouchableOpacity>
    </View>
);
const featureCollection = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            id: '9d10456e-bdda-4aa9-9269-04c1667d4552',
            properties: {
                icon: 'example',
                message: 'Hello!',
            },
            geometry: {
                type: 'Point',
                // coordinates: [12.338, 45.4385],
                coordinates: [118.76410717, 31.97739967],
                //'31.97739967', '118.76410717'
            },
        },
    ],
};


const MapBoxAppScreen = () => {
    // console.log("route", route);

    const [expanded, setExpanded] = useState(true)
    const { trackSession, setTrackSession } = useTrackHook();
    const { finishlineJson, sessionJosn, trackJosn, LapJson, LapIdx2 } = trackSession;
    console.log("useTrack ", finishlineJson, sessionJosn, trackJosn, LapJson);
    //console.log("featureCollection ", featureCollection)
    return (

        <View style={styles.page}>
            {sessionJosn.geometry.coordinates.length > 0 ?

                <View style={styles.container}>
                    <ListItem.Accordion
                        content={
                            <>
                                <Icon name="place" size={30} />
                                <ListItem.Content>
                                    <ListItem.Title>LAP</ListItem.Title>
                                </ListItem.Content>
                            </>
                        }
                        isExpanded={expanded}
                        onPress={() => {
                            setExpanded(!expanded);
                        }}
                    >
                        {trackJosn.lap.map((l, i) => (
                            <ListItem key={i} bottomDivider onPress={async () => {
                                console.log("Lap onpress");
                                await setTrackSession(draft => {
                                    draft.LapIdx2 = i;
                                })
                                setExpanded(!expanded);
                            }}>
                                <ListItem.Content >
                                    <ListItem.Title>{`Lap ${i} timer:${formatMS(l.timer)} max:${l.maxspeed}`}</ListItem.Title>

                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))}
                    </ListItem.Accordion>

                    <MapboxGL.MapView styleURL={MapboxGL.StyleURL.Light} style={styles.map}>
                        <MapboxGL.Camera
                            zoomLevel={18}
                            //  centerCoordinate={[12.338, 45.4385]}
                            centerCoordinate={LapIdx2 == -1 ? sessionJosn.geometry.coordinates[0] : LapJson.features[LapIdx2]?.geometry.coordinates[0]}
                        />

                        {finishlineJson.geometry.coordinates.length > 0 && <MapboxGL.ShapeSource
                            id="source2"
                            lineMetrics={true}
                            shape={finishlineJson}
                        ><MapboxGL.LineLayer id="layer2" style={styles.lineLayer} />
                        </MapboxGL.ShapeSource>}

                        <MapboxGL.ShapeSource
                            id="source1"
                            lineMetrics={true}
                            //shape={sessionJosn}
                            shape={LapIdx2 == -1 ? sessionJosn : LapJson}
                        >
                            <MapboxGL.LineLayer id="layer1" style={styles2.mapPinLayer2} />

                        </MapboxGL.ShapeSource>
                        {/* 
                        <MapboxGL.ShapeSource
                            id="mapPinsSource"
                            shape={ddd}
                        //  onPress={onPinPress}
                        >
                            <MapboxGL.SymbolLayer id="mapPinsLayer" style={styles2.mapPinLayer} />
                            <MapboxGL.LineLayer id="layer3" style={styles2.mapPinLayer2} />
                        </MapboxGL.ShapeSource> */}

                        <MapboxGL.PointAnnotation
                            coordinate={LapIdx2 == -1 ? sessionJosn.geometry.coordinates[0] : LapJson.features[LapIdx2]?.geometry.coordinates[0]}
                            id="pt-ann"
                        >
                            <AnnotationContent />
                        </MapboxGL.PointAnnotation>


                        {/* <AnimatedMarkerView
                            coordinate={LapIdx2 == -1 ? sessionJosn.geometry.coordinates[0] : LapJson.features[LapIdx2]?.geometry.coordinates[0]}

                            anchor={{ x: 0.5, y: 1 }}>
                            <View style={{ alignItems: 'center' }}>
                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 5,
                                        width: 60,
                                        height: 30,
                                        borderRadius: 10,
                                        left: 40,
                                    }}
                                >
                                    <Text>Altitude: m</Text>
                                </View>
                                <View
                                    style={[styles2.triangleStyle(6, 'white'), { marginTop: -1 }]}
                                /> 
                            </View>
                        </AnimatedMarkerView> */}

                    </MapboxGL.MapView>

                    <Button
                        title="Play"
                        onPress={() => {
                            console.log("play")
                        }}
                    />
                    <Button
                        title=""
                    />
                </View>
                : <Text>File invaild</Text>}
        </View>
    );
}

export default MapBoxAppScreen;

const styles2 = {
    mapPinLayer: {
        iconAllowOverlap: true,
        iconAnchor: 'bottom',
        iconSize: 1.0,
        iconImage: exampleIcon,
    },
    mapPinLayer2: {
        lineWidth: 4,
        lineColor: ['get', 'color']
    },
    triangleStyle: (size, color) => ({
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: size,
        borderRightWidth: size,
        borderTopWidth: size * 1.3,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
        marginLeft: 40,
        //  left: 100,
    }),
};


const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'blue',
    },
    map: {
        flex: 1
    },
    mapPinLayer: {
        iconAllowOverlap: true,
        iconAnchor: 'bottom',
        iconSize: 1.0,
        //iconImage: exampleIcon,
    },
    lineLayer: {
        lineColor: 'blue',
        lineCap: 'round',
        lineJoin: 'round',
        lineWidth: 4,

    },
    lineLayer2: {
        lineColor: 'red',
        lineCap: 'round',
        lineJoin: 'round',
        lineWidth: 4,
        lineGradient: [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'blue',
            0.1,
            'royalblue',
            0.3,
            'cyan',
            0.5,
            'lime',
            0.7,
            'yellow',
            1,
            'red',
        ],

    },
    touchableContainer: { borderColor: 'black', borderWidth: 0, width: 40 },
    touchable: {
        backgroundColor: 'blue',
        width: 20,
        height: 20,
        borderRadius: 10,
        left: 10,
        // alignItems: 'center',
        //justifyContent: 'center',
    },
    touchableText: {
        color: 'white',
        fontWeight: 'bold',
    },
}); 