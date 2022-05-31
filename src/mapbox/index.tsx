import React from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect, withRedux, IProps } from "sim-redux";
import MapboxGL from '@rnmapbox/maps';
import { NativeBaseProvider, Actionsheet, VStack, ScrollView, Heading, Center, Accordion, Text, Box, Button } from 'native-base';
import { msg } from '../libs'

MapboxGL.setAccessToken("pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ");

import { IState, store } from "./store";
import {
    IlistActor,
    listActor
} from "./list-actor";

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

//console.log("MapboxGL.StyleURL", MapboxGL.StyleURL)
@withRedux(store)
//@connect(listActor)
//@connect(null, listActor)
//@connect(["edittext", "list"], listActor)
@connect(listActor)
//@connect([], listActor, listComputed)
//@connect(null, listActor, listComputed)
//@connect({ state: null, actor: listActor, computed: listComputed })
export default class MapBoxAppScreen extends React.Component<IProps<IState, IlistActor>> {
    constructor(props: IProps) {
        super(props);
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
            <NativeBaseProvider>
                <View style={styles.page}>

                    <View style={styles.container}>
                        <Actionsheet hideDragIndicator disableOverlay isOpen={this.props.view.actionsheet.isopen} onClose={() => { this.props.actions.changeActionSheet(false) }}>
                            <Actionsheet.Content>
                                <Box w="100%" h={60} px={4} justifyContent="center">
                                    <Text fontSize="24" color="gray.500" _dark={{
                                        color: "gray.300"
                                    }}>
                                        Session:11:30:21
                                    </Text>
                                </Box>
                                <ScrollView w="100%" h="80" _contentContainerStyle={{
                                    //px: "20px",
                                    // mb: "4",
                                    minW: "72"
                                }}>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>

                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>

                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>

                                    <Actionsheet.Item>Delete</Actionsheet.Item>
                                    <Actionsheet.Item>Delete</Actionsheet.Item>

                                </ScrollView>

                            </Actionsheet.Content>
                        </Actionsheet>
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
            </NativeBaseProvider>
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