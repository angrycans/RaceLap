import React from "react";
import { ScrollView, StyleSheet, Text, View, Share } from 'react-native';

import { ListItem, Avatar, TabView, Tab, Button } from '@rneui/themed'
import SafeAreaView from 'react-native-safe-area-view';

import { connect, withRedux, IProps } from "sim-redux";



import { IState, store } from "./list-store";
import {
  IlistActor,
  listActor
} from "./list-actor";

function filesize(size) {
  if (!size)
    return "";

  var num = 1024.00; //byte

  if (size < num)
    return size + "B";
  if (size < Math.pow(num, 2))
    return (size / num).toFixed(2) + "K"; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
  return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}


@withRedux(store)

@connect(listActor)
export default class ListFileApp extends React.Component<IProps<IState, IlistActor>> {
  constructor(props: IProps) {
    super(props);

  }

  async componentDidMount() {
    await this.props.actions.listfile();
    await this.props.actions.getLocalFile();

  }


  onShare = async (url, name, size) => {
    try {
      const result = await Share.share({
        message:
          `RaceLap share ${name}(${filesize(size)}) to you.`,
        url
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  componentWillUnmount() {
  }

  render() {
    console.log("this.props", this.props)
    const { navigation } = this.props;

    navigation.setOptions({ headerShown: true })
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Tab
          value={this.props.tabIndx}
          onChange={(e) => { this.props.actions.changeTab(e) }}
          indicatorStyle={{
            backgroundColor: 'red',
            height: 3,
          }}
          // disableIndicator
          scrollable={false}
          variant="primary"
        >
          <Tab.Item
            title="Track File"
            titleStyle={{ fontSize: 12 }}
            icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
          />
          <Tab.Item
            title="Server"
            titleStyle={{ fontSize: 12 }}
            icon={{ name: 'clouddownloado', type: 'antdesign', color: 'white' }}
          />

        </Tab>

        <TabView value={this.props.tabIndx} onChange={this.props.actions.changeTab} disableSwipe={true} animationType="spring">
          <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
            <ScrollView>
              <View>
                {
                  this.props?.localfiles?.map((item, i) => {
                    return (
                      <ListItem.Swipeable
                        key={i}
                        onPress={() => {
                          // console.log("on press");
                          if (item.isserver) {
                            this.props.actions.downLocalFilefromserver(item);
                          } else {
                            console.log("navgtion", item.name.indexOf("RL"));
                            if (item.name.indexOf("RL") >= 0 || item.name.indexOf(".sa") >= 0) {
                              //  navigation.navigate('MapBoxApp', { name: item.name });
                              navigation.navigate('ShowTrackerWebView', { name: item.name });
                            } else {

                              navigation.navigate('ViewTxtScreen', { name: item.name });
                            }
                          }

                        }}

                        rightContent={!item.isserver ? (reset) => (
                          <View style={styles.rightview}>
                            <Button
                              title=""
                              onPress={async () => {
                                //navigation.navigate('ViewTxtScreen', { name: item.name });
                                //navigation.navigate('MapBoxApp', { name: item.name });

                                reset();
                                console.log("item", item);
                                await this.onShare(item.path, item.name, item.size);
                              }
                              }
                              icon={{ name: 'info', color: 'white' }}
                              buttonStyle={{ minHeight: '100%', backgroundColor: 'blue' }}
                            />
                            <Button
                              title=""
                              onPress={async () => {
                                await this.props.actions.delfilefromlocal(item);
                                reset()
                              }
                              }
                              icon={{ name: 'delete', color: 'white' }}
                              buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                            /></View>
                        ) : null}


                      >

                        <ListItem.Content>
                          <ListItem.Title>{item.name}</ListItem.Title>

                        </ListItem.Content>
                        <Text>{filesize(item.size)}</Text>
                        {item.isserver && item.progress == 0 ? < Button color="secondary" loading={item.progress != 100 && item.isserver}></Button> : null}

                        <ListItem.Chevron />
                      </ListItem.Swipeable>
                    )
                  })
                }
              </View>
            </ScrollView>
          </TabView.Item>
          <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
            <ScrollView>
              <View>
                {
                  this.props?.serverfiles.map((item, i) => {
                    //let item = l.split("_");

                    return (

                      <ListItem.Swipeable
                        key={i}
                        // onPress={() => {
                        //   console.log("on press");
                        // }}

                        onSwipeBegin={() => {
                          if (item[0] == "/RLDATA/log.txt" || item[0] == "/RLDATA/track.txt") {
                            console.log("onswipebeging");
                            // return;
                          }
                        }}

                        rightContent={(reset) => (
                          <Button
                            title="Delete"
                            onPress={async () => {
                              if (item[0] == "/RLDATA/log.txt" || item[0] == "/RLDATA/track.txt") {

                              } else {
                                await this.props.actions.delfile(item[0]);
                              }

                              reset()
                            }
                            }
                            icon={{ name: 'delete', color: 'white' }}
                            buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                          />
                        )}

                      >

                        <ListItem.Content>
                          <ListItem.Title>{item[0]}</ListItem.Title>

                        </ListItem.Content>
                        <Text>{filesize(item[1])}</Text>
                        <ListItem.Chevron />

                      </ListItem.Swipeable>
                    )
                  })
                }
              </View>
            </ScrollView>
          </TabView.Item>
        </TabView>

      </SafeAreaView>

    );
  }
}


/* <View style={styles.container}>
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
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  rightview: {
    flexDirection: 'row',
    width: 300
  },
}); 