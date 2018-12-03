import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';

export default class TestScreen extends React.Component {
  render() {
    const { navigation } = this.props;
    this.IMAGE_URI = navigation.getParam('imageURI', 'NO-URI');
    this.IMAGE_WIDTH = navigation.getParam('width', 0);
    this.IMAGE_HEIGHT = navigation.getParam('height', 0);
    return(
      <View>
        <Image source={{uri: this.IMAGE_URI}} style={{width: this.IMAGE_WIDTH,
            height: this.IMAGE_HEIGHT}}/>
      </View>
    );
  }
}
