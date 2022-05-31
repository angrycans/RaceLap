import React from "react";
import { FlatList, StyleSheet, Text, View } from 'react-native';


import { connect, withRedux, IProps } from "sim-redux";



import { IState, store } from "./store";
import {
  IlistActor,
  listActor
} from "./list-actor";


@withRedux(store)
//@connect(listActor)
//@connect(null, listActor)
//@connect(["edittext", "list"], listActor)
@connect(listActor)
//@connect([], listActor, listComputed)
//@connect(null, listActor, listComputed)
//@connect({ state: null, actor: listActor, computed: listComputed })
export default class ListFileAppScreen extends React.Component<IProps<IState, IlistActor>> {
  constructor(props: IProps) {
    super(props);
    this.props.actions.listfile();
  }
  render() {
    console.log("this.props", this.props)
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.files}
          renderItem={({ item }) => <Text style={styles.item}
            onPress={async () => {
              await this.props.actions.downfile(item);

              console.log("downfile ok")

              await this.props.actions.getMcuCfg();
              console.log("getMcuCfg ok")
              navigation.navigate('MapBoxApp');

            }}>{item}</Text>}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});