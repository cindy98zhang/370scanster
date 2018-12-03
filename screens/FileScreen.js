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
} from 'react-native';
import RNFS from 'react-native-fs';

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
       <Text style={styles.countText}>{f.name}{"\n"}</Text>
     </TouchableOpacity>)
   ))
  }

  render() {
    const { navigation } = this.props;
    return(
      <ScrollView style={styles.container}>
      <View style={styles.container}>
       {this.renderIcons()} // call the helper method to load all the files
      </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    paddingHorizontal: 10,
    //contentCenter: true
    borderColor: 'black',

  },
  button: {
    // alignItems: 'center',
    backgroundColor: 'transparent',

    //fontSize: 16,
    // padding: 10
  },
  countContainer: {
    alignItems: 'center',
    padding: 10
  },
  countText: {
    color: '#BF7F3F',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  }
})
