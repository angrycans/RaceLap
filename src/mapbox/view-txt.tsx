import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ListItem, Avatar, TabView, Text, Tab, Button } from '@rneui/themed'
import { useMount } from "ahooks"
import { useRoute, RouteProp } from '@react-navigation/native';
import RNFS, { downloadFile, readDir } from "react-native-fs"
import { IP, segmentsIntersect, isFinishLinePassed, defaultRLDATAPath, msg } from "../libs";



const ViewTxt = () => {

  const route = useRoute<RouteProp<{ params: { name: string } }>>();
  const [txt, setTxt] = useState("");

  useMount(async () => {

    console.log("route", defaultRLDATAPath + route);
    const data = await RNFS.readFile(defaultRLDATAPath + route.params.name, 'utf8');

    setTxt(data);

  });

  console.log(txt)
  return (
    <ScrollView>
      <View key="1" style={styles.container}>
        <Text key="txt">{txt}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  }
});

export default ViewTxt;
