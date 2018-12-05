import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  NativeModules,
  Button,
  Alert,
  TouchableHighlight,
  ImageBackground
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { WebBrowser, Permissions, FileSystem} from 'expo';
import { MonoText } from '../components/StyledText';
import CameraScreen from './CameraScreen';

var Scanner = NativeModules.TextDetector;
var GMVScanner = NativeModules.GMVTextDetector;


export default class HomeScreen extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
     imageURI: null,
     width: null,
     height: null,
   }
  }
  componentDidMount() {
    	FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos')
    		.catch(e => {});
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: 'Welcome',
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: '#fbefcc',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  }

  async scan() {
    try {
      // const image = require("../assets/sample_image.png");
      const imageURL = this.state.image;
      // const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');
      // const resolvedImage = resolveAssetSource(image);
      var recognizedTextArray = await Scanner.scan(imageURL);
      var recognizedText = [];
      if (recognizedTextArray != undefined && recognizedTextArray.length != 0) {
        recognizedText = recognizedTextArray.map(block => block['text']);
      }
      alert(recognizedText.join(' '));
      console.log(recognizedText.join(' '));
    } catch (e) {
      console.error(e);
    }
  }

  async scanTest() {
    try {
      // const image = require("../assets/sample_image.png");
      const imageURL = this.state.image;
      // const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');
      // const resolvedImage = resolveAssetSource(image);
      var recognizedTextArray = await GMVScanner.scan(imageURL);
      // const recognizedText = recognizedTextArray.map(block => block['text'])
      // const recognizedText = recognizedTextArray.map(block => block['text']);
      // alert(recognizedText.join(' '));
      // console.log(recognizedText.join(' '));
      alert(recognizedTextArray);
    } catch (e) {
      console.error(e);
    }
  }


  render() {
    let {image} = this.state;

    return (
        <ImageBackground source={require('../assets/images/bg3.png')} style={{width: '100%', height: '100%'}}>
      <View style={styles.container}>

      <View style={styles.iconContainer}>
        <Image
          source={
            __DEV__
              ? require('../assets/images/logo.png')
              : require('../assets/images/logo.png')
          }
          style={styles.iconImage}
        />
      </View>
              <View style={styles.hContainer}>
                <MonoText style={styles.highlightText1}>We Textify EVERYTHING!</MonoText>
              </View>

  <View style={styles.alignClickable1}>
          <View style = {styles.alignClickable}>
            <Button title = "Take Photos" onPress = {this._takePhoto}/>
            <TouchableHighlight onPress = {this._takePhoto}>
              <Image
                source={require('../assets/images/camera.png')} />
            </TouchableHighlight>
          </View>

          <View style = {styles.alignClickable}><Button
            title = "Camera Roll"
            onPress={this._pickImage}
          />
            <TouchableHighlight onPress={this._pickImage}>
            <Image
              source={require('../assets/images/addPhoto.png')} />
            </TouchableHighlight>
          </View>

  </View>
        <View style={styles.tabBarInfoContainer}>
          <View style={[styles.highlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.highlightText}>Click the Buttons to Discover Goodies!</MonoText>
          </View>
        </View>
      </View>
        </ImageBackground>
    );
  }


  _takePhoto = async () => {
    this.props.navigation.navigate('Camera');
  };

  _pickImage = async () => {
    const options = {};
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const { uri, width, height} = response;

        this.setState({
          image: uri,
          width: width,
          heigth: height,
        });
        this.props.navigation.navigate('Cropper', {
          imageURI: uri,
          width: width,
          height: height,
        });
      }
    });
  };

  _handleImagePicked = async pickerResult => {
    try {
      if (!pickerResult.cancelled) {
        await FileSystem.moveAsync({
          from: pickerResult.uri,
          to: `${FileSystem.documentDirectory}photos/Photo_${Date.now()}.jpg`
        });
      }
    } catch (e) {
      alert('Ooooooops...Something Went Wrong :(');
    }
  };

  _handleImageTaken = async pickerResult => {
    if (!pickerResult.cancelled) {
      this.setState({ image: pickerResult.uri });
      this.scan();
    }
      console.log(pickerResult);

      this._handleImagePicked(pickerResult);
    }
  };

  const styles = StyleSheet.create({
  alignClickable: {
    flex: 1,
    flexDirection: 'row',
    //marginTop:10,
    // marginBottom:5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },alignClickable1: {
    flex: 1,
    flexDirection: 'column',
    marginTop:60,
    marginBottom:70,
    justifyContent: 'center',
  //  alignItems: 'flex-start',
  },
  container: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  iconImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 30,

  },
  bstyle:{
    height: 20,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    margin:15,
    justifyContent: 'center',
  },
  highlightText: {
    color: 'black',
    fontSize: 14,
  },
  highlightText1: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hContainer: {
    alignItems: 'center',
    borderRadius: 3,
    paddingHorizontal: 4,
    marginTop: 410,
    marginBottom:20,
  },
  highlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 10,
  },
  navigationFilename: {
    marginTop: 5,
  }
  });
