import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAsyncEffect } from "ahooks"
import Icon from 'react-native-vector-icons/Ionicons';

import { is_safile } from '../libs/safile'


function ReceiveShareModal() {
  const navigation = useNavigation();
  const route = useRoute();
  const [sa, setSA] = useState(null);

  useAsyncEffect(async () => {
    if (route.params && route.params?.url) {
      let ret = await is_safile(route.params.url);
      console.log("sa info", ret)
      setSA(ret);
    }
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="document-text-outline" size={80} />
      <Text style={{ fontSize: 30 }}>Your recevie share file</Text>
      {sa && <Text style={{ fontSize: 30 }}>{sa.filename}</Text>}
      {sa && <Text style={{ fontSize: 30 }}>{sa.date}</Text>}
      {sa && <Text style={{ fontSize: 30 }}>{sa.name}</Text>}
      <Button onPress={() => navigation.goBack()} title="view" />
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

export default ReceiveShareModal;