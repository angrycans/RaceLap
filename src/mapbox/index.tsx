import React from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { connect, withRedux, IProps } from "sim-redux";
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken("pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ");

import { IState, store } from "./store";
import {
    IlistActor,
    listActor
} from "./list-actor";

const AnnotationContent = () => (
    <View style={styles.touchableContainer}>

        <TouchableOpacity style={styles.touchable}>
            <Text style={styles.touchableText}></Text>
        </TouchableOpacity>
    </View>
);

console.log("MapboxGL.StyleURL", MapboxGL.StyleURL)
@withRedux(store)
//@connect(listActor)
//@connect(null, listActor)
//@connect(["edittext", "list"], listActor)
@connect(listActor)
//@connect([], listActor, listComputed)
//@connect(null, listActor, listComputed)
//@connect({ state: null, actor: listActor, computed: listComputed })
export default class MapBoxApp extends React.Component<IProps<IState, IlistActor>> {
    constructor(props: IProps) {
        super(props);
        this.props.actions.init();
    }
    render() {
        console.log("this.props", this.props)
        return (
            <View style={styles.page}>
                <View style={styles.container}>
                    <MapboxGL.MapView styleURL={MapboxGL.StyleURL.Light} style={styles.map}>
                        <MapboxGL.Camera
                            zoomLevel={18}
                            //centerCoordinate={[118.86906246566899, 32.10348051760452]}
                            centerCoordinate={this.props.geojosn.geometry.coordinates[0]}
                        //32.103588663718895,118.86896587214841
                        //centerCoordinate={[-77.035, 38.875]}
                        />
                        <MapboxGL.ShapeSource
                            id="source1"
                            lineMetrics={true}
                            shape={this.props.geojosn}
                        >
                            <MapboxGL.LineLayer id="layer1" style={styles.lineLayer} />
                        </MapboxGL.ShapeSource>

                        <MapboxGL.PointAnnotation
                            coordinate={this.props.geojosn.geometry.coordinates[0]}
                            id="pt-ann"
                        >
                            <AnnotationContent />
                        </MapboxGL.PointAnnotation>
                    </MapboxGL.MapView>
                    <Button
                        title="ShowTracker"
                        onPress={() => this.props.actions.init()}
                    />
                    <Button
                        title=""
                    />
                </View>
            </View>
        );
    }
}

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
    lineLayer: {
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