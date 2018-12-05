import React from 'react';
import {
    View,
    PanResponder,
    Animated,
    Image,
    Dimensions,
    StyleSheet,
    Button,
    NativeModules,
    TouchableOpacity,
    Text,
    ScrollView,
    Alert,
    Share,
    Platform,
    ImageBackground
} from 'react-native';
import RNFS from 'react-native-fs';
import { MonoText } from '../components/StyledText';

export default class FileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filesArray: [], // the array to hold file objects
    };
  }

  // whenever the component mounts, load all the files from ./scanned to the state
  componentDidMount() {
    RNFS.readDir(RNFS.DocumentDirectoryPath + '/scanned/') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        // result is an object with this structure:
        // Object {
// [01:14:45]     "ctime": 2018-11-28T06:14:41.535Z,
// [01:14:45]     "isDirectory": [Function isDirectory],
// [01:14:45]     "isFile": [Function isFile],
// [01:14:45]     "mtime": 2018-11-28T06:14:41.539Z,
// [01:14:45]     "name": "2018_11_28_1:14:41.txt",
// [01:14:45]     "path": "/var/mobile/Containers/Data/Application/D3369581-7C3E-49DE-8524-B699E932185C/Documents/scanned/2018_11_28_1:14:41.txt",
// [01:14:45]     "size": 33,
// [01:14:45]   },
        //console.log('GOT RESULT', result);
        this.setState({filesArray: result});
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }

  componentWillMount(){
    RNFS.readDir(RNFS.DocumentDirectoryPath + '/scanned/') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        // result is an object with this structure:
        // Object {
// [01:14:45]     "ctime": 2018-11-28T06:14:41.535Z,
// [01:14:45]     "isDirectory": [Function isDirectory],
// [01:14:45]     "isFile": [Function isFile],
// [01:14:45]     "mtime": 2018-11-28T06:14:41.539Z,
// [01:14:45]     "name": "2018_11_28_1:14:41.txt",
// [01:14:45]     "path": "/var/mobile/Containers/Data/Application/D3369581-7C3E-49DE-8524-B699E932185C/Documents/scanned/2018_11_28_1:14:41.txt",
// [01:14:45]     "size": 33,
// [01:14:45]   },
        //console.log('GOT RESULT', result);
        this.setState({filesArray: result});
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }

  componentDidUpdate(){
    RNFS.readDir(RNFS.DocumentDirectoryPath + '/scanned/') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        // result is an object with this structure:
        // Object {
// [01:14:45]     "ctime": 2018-11-28T06:14:41.535Z,
// [01:14:45]     "isDirectory": [Function isDirectory],
// [01:14:45]     "isFile": [Function isFile],
// [01:14:45]     "mtime": 2018-11-28T06:14:41.539Z,
// [01:14:45]     "name": "2018_11_28_1:14:41.txt",
// [01:14:45]     "path": "/var/mobile/Containers/Data/Application/D3369581-7C3E-49DE-8524-B699E932185C/Documents/scanned/2018_11_28_1:14:41.txt",
// [01:14:45]     "size": 33,
// [01:14:45]   },
        //console.log('GOT RESULT', result);
        this.setState({filesArray: result});
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }

  // read 1 file and navigate to the text editor with initialized text
  readFile = (path) => {

    RNFS.readFile(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((string) => {
        this.props.navigation.navigate('Editor', {initialText: string});
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  };

  deleteFile = (path) => {
    RNFS.unlink(path)
      .then(() => {
        console.log('FILE DELETED');
      }) // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
        console.log(err.message);
      });
  };

  shareFile = (path) => {
    Share.share({
      url: path,
      title: 'File Shared from SCANster'
    })
  }

  fileOption = (path) => {
    Alert.alert(
      'Just to Confirm',
      'what do you want to do with this file?',
      [
        {text: "Delete", onPress: () => this.deleteFile(path)},
        {text: "Edit", onPress: () => this.readFile(path)},
        {text: "Share", onPress: () => this.shareFile(path)},
      ],
      { cancelable: true }
    )
  }

  // TODO: change the buttons to other UI elements and make other necessary
  // changes such as the layout.
  // TODO: support delete and rename (onpress)
  renderIcons = () => {
    return(this.state.filesArray.map(f => (
      <TouchableOpacity
       style={styles.button}
       onPress={() => this.fileOption(f.path)}
       //onLongPress={() => this.deleteFile(f.path)}
     >
       <Text style={styles.highlightText1}>{f.name}{"\n"}</Text>
     </TouchableOpacity>)
   ))
  }

  render() {
    const { navigation } = this.props;
    return(
        <ImageBackground source={require('../assets/images/bg.png')} style={{width: '100%', height: '100%'}}>
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
       {this.renderIcons()} // call the helper method to load all the files
      </View>
      </ScrollView>
      <View style={styles.tabBarInfoContainer}>
        <View style={[styles.highlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.highlightText}>Click the file to EDIT/SHARE/DELETE </MonoText>
        </View>
      </View>
      </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 10
  },
  button: {
      height: 40,
      borderRadius: 5,
      backgroundColor: 'white',
      alignItems: 'center',
      margin:15,
      justifyContent: 'center',
  },
  countContainer: {
    alignItems: 'center',
    padding: 10
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
  highlightText: {
    color: 'black',
    fontSize: 16,
  },
  highlightText1: {
    color: 'black',
    fontSize: 18,
  },
  contentContainer: {
    paddingVertical: 20
  },
})
