import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import BlankScreen from '../screens/BlankScreen';
import TextScreen from '../screens/TextScreen';
import CropperScreen from '../screens/CropperTest';
import TextEditor from '../screens/TextEditor';
import CameraScreen from '../screens/CameraScreen';
import TestScreen from '../screens/TestScreen';
import FileScreen from '../screens/FileScreen';

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
);

const CameraStack = createStackNavigator(
  {
    Camera: {
      screen: CameraScreen,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      },
    },
    Cropper: {
      screen: CropperScreen,
      navigationOptions: {
        gesturesEnabled: false
      },
    },
    Test: {
      screen: TestScreen,
      navigationOptions: {
        gesturesEnabled: false
      },
    },
    // toFile: {
    //   screen: FileScreen,
    //   navigationOptions: {
    //     gesturesEnabled: false
    //   },
    // }
  },
);

const TextStack = createStackNavigator(
  {
    Main: {
      screen: FileScreen,
      navigationOptions: {
        gesturesEnabled: false
      },
    },
    Editor: {
      screen: TextEditor,
      navigationOptions: {
        gesturesEnabled: false
      },
    }
  }
);

TextStack.navigationOptions = {
  tabBarLabel: 'Text',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const RootStack = createStackNavigator(
  {
    Main: {
      screen: HomeStack,
    },
    Camera: {
      screen: CameraStack,
      navigationOptions: {
        gesturesEnabled: false
      },
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

RootStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};



const BlankStack = createStackNavigator({
  Blank: BlankScreen,
});


BlankStack.navigationOptions = {
  tabBarLabel: 'Files',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};


export default createBottomTabNavigator({
  RootStack,
  BlankStack,
  TextStack,
},{
  initialRouteName: 'RootStack',
  navigationOptions: ({navigation}) => ({
    tabBarVisible: navigation.state.index === 0
  })
});
