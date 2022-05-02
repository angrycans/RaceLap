import * as React from 'react';
import { Button, View, Text } from 'react-native';



class ShowTrackerScreen extends React.Component {

    constructor() {
        super();

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
            </View>
        );
    }
}


export default ShowTrackerScreen;