import * as React from 'react';
import { Button, View, Text } from 'react-native';
import moment from 'moment';


class HomeScreen extends React.Component {

    constructor() {
        super();

        console.log(moment(new Date()).format("YYYYMMDD"))
    }

    componentDidMount() {


    }


    componentWillUnmount() {
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                <Text>Home Screen</Text>
                <Button
                    title="Go to Details"
                    onPress={() => navigation.navigate('Details')}
                />

                <Button
                    title="Go to GeolocationService"
                    onPress={() => navigation.navigate('GeolocationService')}
                />

                <Button
                    title="Go to ListFileApp"
                    onPress={() => navigation.navigate('ListFileApp')}
                />

                <Button
                    title="Go to MapBoxApp"
                    onPress={() => navigation.navigate('MapBoxApp')}
                />
            </View>
        );
    }
}


export default HomeScreen;