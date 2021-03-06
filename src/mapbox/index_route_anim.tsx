import React from 'react';
import PropTypes from 'prop-types';

import { Easing, Button, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

import { Animated, MapView, Camera, ShapeSource, LineLayer } from '@rnmapbox/maps';

import along from '@turf/along';
import length from '@turf/length';
import { point, lineString } from '@turf/helpers';


const blon = -73.99155;
const blat = 40.73481;
const bdelta = 0.0005;

const lon = -73.99255;
const lat = 40.73581;
const delta = 0.001;
const steps = 300;

const styles = {
    lineLayerOne: {
        lineCap: 'round',
        lineWidth: 6,
        lineOpacity: 0.84,
        lineColor: '#514ccd',
    },
    circleLayer: {
        circleOpacity: 0.8,
        circleColor: '#c62221',
        circleRadius: 20,
    },
    lineLayerTwo: {
        lineCap: 'round',
        lineWidth: 6,
        lineOpacity: 0.84,
        lineColor: '#314ccd',
    },
    lineLayer: {
        lineColor: 'red',
        lineCap: 'round',
        lineJoin: 'round',
        lineWidth: 14,
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
};

class AnimatedLine extends React.Component {

    constructor(props) {
        super(props);


        const route = new Animated.RouteCoordinatesArray([
            [blon, blat],
            [blon, blat + 2 * bdelta],
            [blon + bdelta, blat + 2 * bdelta + bdelta],
            [blon + bdelta + 2 * bdelta, blat + 2 * bdelta + bdelta + bdelta],
        ]);
        const route2 = [
            [blon, blat],
            [blon, blat + 2 * bdelta],
            [blon + bdelta, blat + 2 * bdelta + bdelta],
            [blon + bdelta + 2 * bdelta, blat + 2 * bdelta + bdelta + bdelta],
        ];

        this.state = {
            backgroundColor: 'blue',
            coordinates: [[-73.99155, 40.73581]],
            targetPoint: {
                type: 'FeatureCollection',
                features: [],
            },
            route,
            route2,

            actPoint: new Animated.ExtractCoordinateFromArray(route, -1),
            idx: 2
        };
    }


    startAnimateRoute() {

        const { originalRoute } = this.state.route;
        //  dest = length(lineString(originalRoute), { units: 'meters' });
        // let pt = point(originalRoute[3]);
        console.log("this.state.route", originalRoute);

        debugger
        this.state.route
            .timing({
                toValue: {
                    end: { point: point(originalRoute[2]) }
                },
                duration: 2000,
                easing: Easing.linear,
            })
            .start(() => {
                console.log("this.state.route", this.state.route)
            });
    }

    tick() {
        //  requestAnimationFrame(() => {
        const { originalRoute } = this.state.route;
        //  dest = length(lineString(originalRoute), { units: 'meters' });
        let pt = point(originalRoute[this.state.idx]);

        this.state.route
            .timing({
                toValue: { end: { point: pt } },
                duration: 2000,
                easing: Easing.linear,
            })
            .start(() => {
                if (this.state.idx > this.state.route.length - 1) {
                    return;
                }
                this.setState({
                    idx: this.state.idx - 1
                });
                this.tick();
                //console.log("this.state.route", this.state.route)
            });
        // });
    }



    render() {
        // console.log("this.state.coordinates[0]", this.state.coordinates[0]);
        // console.log("this.state.route", this.state.route);
        // console.log("this.state.actPoint", this.state.actPoint);

        //console.log(this.props);
        return (
            <View {...this.props} style={{ flex: 1 }}>
                <MapView
                    // ref={(c) => (this._map = c)}
                    onPress={this.onPress}
                    //  onDidFinishLoadingMap={this.onDidFinishLoadingMap}
                    style={{ flex: 1 }}
                >
                    <Camera zoomLevel={16} centerCoordinate={this.state.coordinates[0]} />
                    {/* <ShapeSource
                        id={'route2'}
                        shape={{
                            type: 'LineString',
                            coordinates: this.state.route2,
                        }
                        }
                    >
                        <LineLayer id={'lineroute'} style={styles.lineLayerOne} />
                    </ShapeSource> */}

                    <Animated.ShapeSource
                        id={'route1'}
                        shape={
                            new Animated.Shape({
                                type: 'LineString',
                                coordinates: this.state.route,
                            })
                        }
                    >
                        <Animated.LineLayer id={'lineroute'} style={styles.lineLayerOne} />
                    </Animated.ShapeSource>

                    <Animated.ShapeSource
                        id="currentLocationSource1"
                        shape={
                            new Animated.Shape({
                                type: 'Point',
                                coordinates: this.state.actPoint,
                            })
                        }
                    >
                        <Animated.CircleLayer
                            id="currentLocationCircle"
                            style={styles.circleLayer}
                        />
                    </Animated.ShapeSource>


                </MapView>


                <View>


                    <Button
                        title="Animate route tick"
                        onPress={() => this.tick()}
                    />

                    <Button
                        title="Animate route"
                        onPress={() => this.startAnimateRoute()}
                    />
                </View>
            </View >
        );
    }
}

export default AnimatedLine;
