import React from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect, withRedux, IProps } from "sim-redux";
import MapboxGL from '@rnmapbox/maps';
import { msg, MapboxAccessToken } from '../libs'
import { ListItem, Avatar, TabView, Tab, Button, Text } from '@rneui/themed'

MapboxGL.setAccessToken(MapboxAccessToken);

import { IState, store } from "./store";
import {
    IIndexActor,
    indexActor
} from "./index-actor";

const dataArray = [
    { title: "First Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
];

const AnnotationContent = () => (
    <View style={styles.touchableContainer}>

        <TouchableOpacity style={styles.touchable}>
            <Text style={styles.touchableText}></Text>
        </TouchableOpacity>
    </View>
);

@withRedux(store)

@connect(indexActor)

export default class MapBoxAppScreen extends React.Component<IProps<IState, IIndexActor>> {
    constructor(props: IProps) {
        super(props);

        console.log("this.props", this.props)
        this.props.actions.init();

    }

    handleOpen = () => { this.props.actions.changeActionSheet(true) }


    componentDidMount() {

        msg.on("MapBoxActionSheetOpen", this.handleOpen);
    }


    componentWillUnmount() {
        msg.off("MapBoxActionSheetOpen", this.handleOpen);
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
                        {this.props.geojosn.geometry.coordinates.length > 0 &&
                            <MapboxGL.ShapeSource
                                id="source1"
                                lineMetrics={true}
                                shape={this.props.geojosn}
                            >
                                <MapboxGL.LineLayer id="layer1" style={styles.lineLayer} />

                            </MapboxGL.ShapeSource>
                        }

                        {this.props.finishline.geometry.coordinates.length > 0 &&
                            <MapboxGL.ShapeSource
                                id="source2"
                                lineMetrics={true}
                                shape={this.props.finishline}
                            >
                                <MapboxGL.LineLayer id="layer2" style={styles.lineLayer} />

                            </MapboxGL.ShapeSource>

                        }

                        {this.props.geojosn.geometry.coordinates.length > 0 &&
                            <MapboxGL.PointAnnotation
                                coordinate={this.props.geojosn.geometry.coordinates[0]}
                                id="pt-ann"
                            >
                                <AnnotationContent />
                            </MapboxGL.PointAnnotation>
                        }
                    </MapboxGL.MapView>

                    <Button
                        title="ShowTrackerLap"
                        onPress={() => this.props.actions.lapcomputer()}
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
        //lineColor: 'red',
        lineCap: 'round',
        lineJoin: 'round',
        lineWidth: 4,
        lineGradient: [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'blue',


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