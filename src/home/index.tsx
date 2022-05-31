import * as React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { NativeBaseProvider, Actionsheet, useDisclose, Center, Text, Box, Button } from 'native-base';

function HomeScreen(props) {

    const { navigation } = props;
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclose();
    return (
        <NativeBaseProvider>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Center>
                    <Button onPress={onOpen}>Actionsheet</Button>
                    <Actionsheet isOpen={isOpen} onClose={onClose}>
                        <Actionsheet.Content>
                            <Box w="100%" h={60} px={4} justifyContent="center">
                                <Text fontSize="16" color="gray.500" _dark={{
                                    color: "gray.300"
                                }}>
                                    Albums
                                </Text>
                            </Box>
                            <Actionsheet.Item>Delete</Actionsheet.Item>
                            <Actionsheet.Item isDisabled>Share</Actionsheet.Item>
                            <Actionsheet.Item>Play</Actionsheet.Item>
                            <Actionsheet.Item>Favourite</Actionsheet.Item>
                            <Actionsheet.Item>Cancel</Actionsheet.Item>
                        </Actionsheet.Content>
                    </Actionsheet>
                </Center>
                <Text>Home Screen</Text>
                <Button onPress={() => navigation.navigate('Details')}>
                    Go to Details</Button>

                <Button onPress={() => navigation.navigate('GeolocationService')}>Go to GeolocationService
                </Button>
                <Button
                    onPress={() => navigation.navigate('ListFileApp')}>Go to ListFileApp
                </Button>
                <Button

                    onPress={() => navigation.navigate('MapBoxApp')}>
                    Go to MapBoxApp </Button>
            </View>
        </NativeBaseProvider >
    );
}



export default HomeScreen;