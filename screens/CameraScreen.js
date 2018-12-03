import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Camera, Permissions, FileSystem} from 'expo';
import {
  Ionicons,
  MaterialIcons,
  Foundation,
  MaterialCommunityIcons,
  Octicons,
} from '@expo/vector-icons';

const PHOTO_DIR = `${FileSystem.documentDirectory}photos/`;

export default class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      uri: null,
      width: null,
      height: null,
    };
  }


  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    // bug to be fixed!!!
    // if (this.state.uri !== null){
    //   this._handleImagePicked(this.state.uri);
    // }
  }

  snap = async () => {
    if (this.camera) {
      this.camera.pausePreview();
      // let resolvedPromise = await new Promise(async resolve => {
      //   await this.camera.takePictureAsync({onPictureSaved : resolve});
      // });
      const { uri, width, height, } = await this.camera.takePictureAsync();
      this.setState(
      {
        uri: uri,
        width: width,
        height: height,
      });
      this.props.navigation.navigate('Cropper', {
        imageURI: uri,
        width: width,
        height: height,
      });
      this.camera.resumePreview();
      //this._handleImagePicked(this.state.uri);
    }
  };

  _handleImagePicked = async pickerResult => {
    try {
        await FileSystem.moveAsync({
          from: pickerResult,
          to: `${FileSystem.documentDirectory}photos/Photo_${Date.now()}.jpg`
        });
    } catch (e) {
      alert('Ooooooops...Something Went Wrong :(');
    }
  };


  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
            <View style={styles.container}>
              <View style={styles.downArrow}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                  <Ionicons name="ios-arrow-down" size={50} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.button}>
                <TouchableOpacity onPress={this.snap}>
                  <Ionicons name="ios-radio-button-on" size={70} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.placeHolder}/>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  downArrow: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    marginLeft: 20,
  },
  placeHolder: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    marginRight: 20,
  }
})
