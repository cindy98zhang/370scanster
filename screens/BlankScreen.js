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
  FlatList
} from 'react-native';
import { WebBrowser, FileSystem, ImagePicker, Permissions, Constants} from 'expo';

import { MonoText } from '../components/StyledText';

const PHOTO_DIR = `${FileSystem.documentDirectory}photos/`;

export default class BlankScreen extends React.Component {
  static navigationOptions = {
    headerTitle: "Photo Gallery",
  };

  constructor(props){
    super(props);
    this.state = {
      photos: [],
      refreshing: false,
    };
  }

  async componentWillMount() {
      const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIR);
      if (dirInfo.exists) {
        const photos = await FileSystem.readDirectoryAsync(PHOTO_DIR);
        this.setState({ photos });
      } 
  }

  async componentDidUpdate() {
    if (!this.props.isFocused) {
      const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIR);
      if (dirInfo.exists) {
        const photos = await FileSystem.readDirectoryAsync(PHOTO_DIR);
        this.setState({ photos });
      } 
    }
  }

  deleteImage = () => {
    //FileSystem.deleteAsync(`${FileSystem.documentDirectory}photos/${item}`)
  }

  _showAlert = () => {
    Alert.alert(
      'Just to Confirm',
      'Are you sure you want to delete this image?',
      [
        {text: "Cancel", onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: "OK", onPress: () => this.deleteImage()},
      ],
      { cancelable: false }
    )
  }

  renderPhoto({ item }) {
    return (
      <TouchableOpacity 
        onPress = {this._showAlert}>
      <View>
      <Image
        style={styles.photo}
        source={{
          uri: `${FileSystem.documentDirectory}photos/${item}`,
        }}
      />
      </View>
      </TouchableOpacity>
    );
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidUpdate().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer} 
          refreshControl={
            <RefreshControl 
              refreshing={this.state.refreshing} 
              onRefresh={this._onRefresh}
            />
          }
        ><FlatList
            style={styles.list}
            data={this.state.photos}
            renderItem={this.renderPhoto}
            keyExtractor={item => item}
            numColumns={2}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },
  highlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  highlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  photo: {
    margin: 5,
    width: 150,
    height: 150,
  }
});
