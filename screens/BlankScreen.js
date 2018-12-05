import React, {Component} from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ImageBackground
} from 'react-native';
import { WebBrowser, FileSystem, ImagePicker, Permissions, Constants} from 'expo';


export default class BlankScreen extends React.Component {
  static navigationOptions = {
    headerTitle: "About Us",
  };

  constructor(props){
    super(props);
  }

  render() {
    return (
      <ImageBackground source={require('../assets/images/bg.png')} style={{width: '100%', height: '100%'}}>
      <View style={styles.container}>
        <ScrollView >
         <Text style={styles.body}>
          Hi there,{"\n"}{"\n"}

          We hope you find our app helpful!{"\n"}{"\n"}
          We are a team of five college students, and this application is developed by us as a class project. {"\n"}{"\n"}
          This is our very first React Native application. None of us had previous experience developing mobile applications. We put a lot of efforts into this development and finnaly are able to bring this in front of you. {"\n"}{"\n"}
          This being said, this app may still have a lot of room for improvement, and we will work extra hard to enhance your experience using the app.Meanwhile, enjoy TEXTIFYING!{"\n"}{"\n"}
          Thanks for using SCANster.{"\n"}{"\n"}{"\n"}
          SCANster Team
        </Text>
        </ScrollView>
      </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  body: {
    justifyContent:'center',
    margin: 24,
    fontSize: 18,
    fontFamily: 'Helvetica',
    fontWeight:'bold',
  },
});
