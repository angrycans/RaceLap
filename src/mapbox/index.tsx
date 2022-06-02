import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { msg, MapboxAccessToken, formatMS } from '../libs'
import { ListItem, Icon, Avatar, TabView, Tab, Button, Text } from '@rneui/themed'

import { useTrack } from "./hooks"
import exampleIcon from './pin.png';


MapboxGL.setAccessToken(MapboxAccessToken);


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
    const { finishlineJson, sessionJosn, trackJosn, ddd } = useTrack()
    console.log("useTrack ", finishlineJson, sessionJosn, trackJosn, ddd);
    console.log("featureCollection ", featureCollection)
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
                            <ListItem key={i} bottomDivider>

                                <ListItem.Content onPress={() => {

                                }}>
                                    <ListItem.Title>{`Lap ${i} timer:${formatMS(l.timer)}`}</ListItem.Title>

                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        ))}
                    </ListItem.Accordion>

                    <MapboxGL.MapView styleURL={MapboxGL.StyleURL.Light} style={styles.map}>
                        <MapboxGL.Camera
                            zoomLevel={18}
                            //  centerCoordinate={[12.338, 45.4385]}
                            centerCoordinate={sessionJosn.geometry.coordinates[0]}
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
                            shape={sessionJosn}
                        >
                            <MapboxGL.LineLayer id="layer1" style={styles.lineLayer2} />

                        </MapboxGL.ShapeSource>

                        <MapboxGL.ShapeSource
                            id="mapPinsSource"
                            shape={ddd}
                        //  onPress={onPinPress}
                        >
                            {/* <MapboxGL.SymbolLayer id="mapPinsLayer" style={styles2.mapPinLayer} /> */}
                            <MapboxGL.LineLayer id="layer3" style={styles2.mapPinLayer2} />
                        </MapboxGL.ShapeSource>

                        <MapboxGL.PointAnnotation
                            coordinate={sessionJosn.geometry.coordinates[0]}
                            id="pt-ann"
                        >
                            <AnnotationContent />
                        </MapboxGL.PointAnnotation>

                    </MapboxGL.MapView>

                    <Button
                        title="ShowTrackerLap"
                    // onPress={() => this.props.actions.lapcomputer()}
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
        lineWidth: 2,
        lineColor: ['get', 'color']
    }
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
        lineColor: 'black',
        lineCap: 'round',
        lineJoin: 'round',
        lineWidth: 1,

    },
    lineLayer2: {
        lineColor: 'red',
        lineCap: 'round',
        lineJoin: 'round',
        lineWidth: 1,
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