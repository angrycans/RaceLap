import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Easing } from 'react-native';
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
import length from '@turf/length';
import { point, lineString } from '@turf/helpers';
import { tick } from './trackuitls'


import { useTrackHook } from "./hooks"
import exampleIcon from './pin.png';


MapboxGL.setAccessToken(MapboxAccessToken);
const AnimatedMarkerView = RNAnimated.createAnimatedComponent(MarkerView);



var _tick;

const MapBoxAppScreen = () => {

    const [expanded, setExpanded] = useState(true)
    const { trackSession, setTrackSession } = useTrackHook();
    const { finishlineJson, sessionJosn, sessionData, trackJosn, LapJson, LapIdx2, routeJson, actPoint, actPointIdx } = trackSession;
    // const tickRef = useRef(null);

    //console.log("useTrack ", finishlineJson, sessionJosn, trackJosn, LapJson);
    // console.log("sessionJosn ", sessionJosn);
    // console.log("trackJosn ", trackJosn);
    // console.log("finishlineJson ", finishlineJson);
    // console.log("LapJson ", LapJson);
    // console.log("sessionData ", sessionData);

    // console.log("routeJson", routeJson);
    // console.log("actPoint", actPoint);
    // console.log("trackSession ", trackSession);


    //console.log("idx", idx)

    useEffect(() => {

        return () => {
            console.log("componentWillUnmount--------")

        }
    }, [])


    if (routeJson.length > 0 && !_tick) {
        console.log("new tick", trackSession)
        _tick = tick(sessionData, LapIdx2, trackJosn, routeJson, setTrackSession);
    }




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

                    <MapView style={styles.map} >
                        <Camera
                            zoomLevel={18}
                            //  centerCoordinate={[12.338, 45.4385]}
                            centerCoordinate={actPoint}

                            animationDuration={100}
                        />

                        {finishlineJson.geometry.coordinates.length > 0 && <ShapeSource
                            id="source2"
                            lineMetrics={true}
                            shape={finishlineJson}
                        ><LineLayer id="layer2" style={styles.lineLayer} />
                        </ShapeSource>}



                        <ShapeSource
                            id="source1"
                            lineMetrics={true}
                            shape={LapIdx2 == -1 ? sessionJosn : LapJson}
                        >
                            <LineLayer id="layer1" style={styles2.mapPinLayer2} />

                        </ShapeSource>


                        {actPoint && <Animated.ShapeSource
                            id="currentLocationSource1"
                            shape={
                                {
                                    type: 'Point',
                                    coordinates: actPoint,
                                }
                            }
                        >
                            <Animated.CircleLayer
                                id="currentLocationCircle"
                                style={styles.circleLayer}
                            />
                        </Animated.ShapeSource>}

                        {actPoint && <AnimatedMarkerView
                            id="AnimatedMarkerView"
                            coordinate={actPoint}
                            anchor={{ x: 0.5, y: 0.5 }}>
                            <View style={{ alignItems: 'center' }}>
                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 5,
                                        width: 90,
                                        height: 30,
                                        borderRadius: 10,
                                        left: 50,
                                        paddingLeft: 10,
                                        marginLeft: 20,
                                    }}
                                >
                                    <Text>{(+sessionData[actPointIdx][4]).toFixed(1) + " " + sessionData[actPointIdx][7]}</Text>
                                </View>

                            </View>
                        </AnimatedMarkerView>
                        }

                    </MapView>

                    <Button
                        title="Play"
                        onPress={() => {
                            console.log("play");
                            _tick.play();
                        }}
                    />
                    <Button
                        title="pause"
                        onPress={() => {
                            console.log("pause");
                            _tick.pause();
                        }}
                    />
                    <Button
                        title=""
                    />
                    <Button
                        title=""
                    />
                    <Button
                        title=""
                    />

                    <Button
                        title="4"
                    />
                </View>
                : <Text>File invaild</Text>}
        </View >
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
    circleLayer: {
        circleOpacity: 1,
        circleColor: '#c62221',
        circleRadius: 8,
    },
    lineLayerOne: {
        lineCap: 'round',
        lineWidth: 6,
        lineOpacity: 0.84,
        lineColor: '#514ccd',
    },
}); 