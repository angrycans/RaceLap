import React from "react";
import { Button, View, Text, StyleSheet } from 'react-native';

import { connect, withRedux, IProps } from "sim-redux";
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken("pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ");


import { IState, store } from "./store";
import {
    IlistActor,
    listActor,
    IlistComputed,
    listComputed,
} from "./list-actor";

console.log("MapboxGL.StyleURL", MapboxGL.StyleURL)
@withRedux(store)
//@connect(listActor)
//@connect(null, listActor)
//@connect(["edittext", "list"], listActor)
@connect(listActor, listComputed)
//@connect([], listActor, listComputed)
//@connect(null, listActor, listComputed)
//@connect({ state: null, actor: listActor, computed: listComputed })
export default class MapBoxApp extends React.Component<IProps<IState, IlistActor, IlistComputed>> {
    constructor(props: IProps) {
        super(props);
        this.props.actions.init()
    }
    render() {
        return (
            <View style={styles.page}>
                <View style={styles.container}>
                    <MapboxGL.MapView styleURL={"https://api.maptiler.com/maps/streets/style.json?key=YymZPIGfniu7apIvln6X"} style={styles.map}>
                        <MapboxGL.Camera
                            zoomLevel={16}
                            centerCoordinate={[118.90427665743826, 32.092315673828125]}
                        />

                    </MapboxGL.MapView>
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
    }
});