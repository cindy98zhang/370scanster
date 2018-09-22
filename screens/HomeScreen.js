import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.sprintContainer}>

            <View style={styles.highlightContainer}>
              <MonoText style={styles.highlightText}>Sprint One</MonoText>
            </View>
          </View>
          <View style={styles.iconContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/icon.png')
                  : require('../assets/images/icon.png')
              }
              style={styles.iconImage}
            />
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <View style={[styles.highlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.highlightText}>Yo! Click our logo to access the camera!</MonoText>
          </View>
        </View>
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
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  iconImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 30,
  },
  sprintContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  highlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  highlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    paddingVertical: 20,
  },
  navigationFilename: {
    marginTop: 5,
  }
});
