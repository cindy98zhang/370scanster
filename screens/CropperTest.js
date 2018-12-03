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
    AlertIOS
} from 'react-native';
import { ImageManipulator } from 'expo';
import RNFS from 'react-native-fs';
//import Prompt from 'react-native-input-prompt';

var Scanner = NativeModules.TextDetector;
var resolveAssetSource = require('resolveAssetSource');
const LEFT_INIT_OFFSET = 35;
const DOT_SIZE = 20;

export default class CropperScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      view_width: 0,
      view_height: 0,
      image_width: 0,
      image_height: 0,
      image_x: 0,
      image_y: 0,
      image_top_offset: 0,
      image_left_offset: LEFT_INIT_OFFSET,
      rect_x: 0,
      rect_y: 0,
      rect_width: 0,
      rect_height: 0,
      rect_top_offset: 0,
      rect_left_offset: LEFT_INIT_OFFSET,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Crop it!",
      headerLeft: (
      <Button
        onPress={() => navigation.navigate('Home')}
        title="Back"
        />),
      headerRight:(
      <Button
        onPress={navigation.state.params.handleScan}
        title="Scan"
        />),
    }
  };

  _panResponder = {};
  // crop = null

  initializeImage = () => {
    const { navigation } = this.props;
    this.IMAGE_URI = navigation.getParam('imageURI', 'NO-URI');
    // var imgSrc = resolveAssetSource(require(`${this.props.imageURI}`));
    this.SCREEN_WIDTH = Dimensions.get('window').width;
    this.IMAGE_WIDTH = navigation.getParam('width', 0);
    this.IMAGE_HEIGHT = navigation.getParam('height', 0);
    this.IMAGE_RATIO = this.IMAGE_HEIGHT / this.IMAGE_WIDTH;
  };

  // setCrop(crop) {
  //   if(crop) {
  //     this.crop = crop;
  //   }
  // }

  async sendImage () {
    const ratio = this.IMAGE_WIDTH / this.state.image_width;
    const originX = this.state.rect_left_offset - this.state.image_left_offset;
    const originY = this.state.rect_top_offset - this.state.image_top_offset;
    const width = this.state.rect_width;
    const height = this.state.rect_height;
    try {
      // const image = require("../assets/sample_image.png");
      // const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');
      // const resolvedImage = resolveAssetSource(image);
      var recognizedTextArray = await Scanner.scan(
        this.IMAGE_URI,
        originX * ratio,
        originY * ratio,
        width * ratio,
        height * ratio);

      var recognizedText = [];
      if (recognizedTextArray != undefined && recognizedTextArray.length != 0) {
        recognizedText = recognizedTextArray.map(block => block['text']);
      }
      var resultText = recognizedText.join(' ');
      console.log(resultText);
      this.saveText(resultText);
    } catch (e) {
      console.error(e);
    }
    // alert(height+ ": " + height * ratio + ", " + this.IMAGE_HEIGHT);
    // const actions = [{
    //   crop: {
    //     originX: originX * ratio,
    //     originY: originY * ratio,
    //     width: width * ratio,
    //     height: height * ratio,
    //   }
    // },];
    // console.log(actions);
    // const manipResult = await ImageManipulator.manipulate(
    //   this.IMAGE_URI,
    //   actions);
    // console.log(manipResult);
    // this.props.navigation.navigate('Test', {
    //   imageURI: manipResult.uri,
    //   width: manipResult.width / ratio,
    //   height: manipResult.height / ratio,
    // });
  };

  saveText = (resultText) => {
    const { navigation } = this.props;
    var today = new Date();
    var date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+'_'+time;

    var path = RNFS.DocumentDirectoryPath + '/scanned/';
    RNFS.mkdir(path);
    AlertIOS.prompt(
      'Please Name Your File',
      null,
      text => this.createFile({text, path, resultText})
    );
  };

  createFile = ({text, path, resultText}) => {
    const { navigation } = this.props;
    RNFS.writeFile(path + text + '.txt', resultText, 'utf8')
    .then((success) => {
      navigation.navigate('Home');
      console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    });
  }
  setLeft(left) {
    const current_left_offset = this.state.rect_left_offset;
    const current_width = this.state.rect_width;
    if (left <= LEFT_INIT_OFFSET) {
      this.setState(
        {
          rect_left_offset: LEFT_INIT_OFFSET,
          rect_width: current_left_offset - LEFT_INIT_OFFSET + current_width,
        });
    } else if (left - current_left_offset >= current_width) { // collide with right
      this.setState(
        {
          rect_left_offset: current_left_offset + current_width,
          rect_width: 0,
        });
    } else {
      this.setState(
        {
          rect_left_offset: left,
          rect_width: current_width - left + current_left_offset,
        });
    }
  }

  // Manipulate WIDTH ONLY!!
  setRight(width) {
    const current_left_offset = this.state.rect_left_offset;
    const current_width = this.state.rect_width;
    const image_width = this.state.image_width;
    const image_left_offset = this.state.image_left_offset;
    // collide with left
    if (width <= 0) {
      this.setState(
        {
          rect_width: 0,
        });
    } else if (width + current_left_offset >= (image_width + image_left_offset)) {
      this.setState(
        {
          rect_width: image_width + LEFT_INIT_OFFSET - current_left_offset,
        });
    } else {
      this.setState(
        {
          rect_width: width,
        });
    }
  }

  setTop(top) {
    const current_top_offset = this.state.rect_top_offset;
    const current_height = this.state.rect_height;
    if (top <= this.state.image_top_offset) {
      this.setState(
        {
          rect_top_offset: this.state.image_top_offset,
          rect_height: current_top_offset - this.state.image_top_offset + current_height,
        });
    } else if (top - current_top_offset >= this.state.rect_height) {
      // var current_offset = this.state.rect_left_offset;
      this.setState(
        {
          rect_top_offset: current_top_offset + this.state.rect_height,
          rect_height: 0,
        });
    } else {
      this.setState(
        {
          rect_top_offset: top,
          rect_height: current_height - top + current_top_offset,
        });
    }
  }

  // Manipulate HEIGHT ONLY!!
  setBottom(bottom) {
    const current_top_offset = this.state.rect_top_offset;
    const current_height = this.state.rect_height;
    const image_height = this.state.image_height;
    const image_top_offset = this.state.image_top_offset;
    // collide with top
    if (bottom <= 0) {
      this.setState(
        {
          rect_height: 0,
        });
    } else if (bottom + current_top_offset >= (image_height + image_top_offset)) {
      this.setState(
        {
          rect_height: image_height + image_top_offset - current_top_offset,
        });
    } else {
      this.setState(
        {
          rect_height: bottom,
        });
    }
  }

  componentWillMount() {
    this.initializeImage();
    // Top Left PanResonder
    this.topLeftResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
           return gestureState.dx != 0 && gestureState.dy != 0;
      },
      onPanResponderMove: (e, gestureState) => {
        const {dx, dy} = gestureState;
        const left = this._previousLeft + dx;
        const top = this._previousTop + dy;
        this.setLeft(left);
        this.setTop(top);
      },
      onPanResponderRelease: (e, gestureState) => {
        this._previousLeft += gestureState.dx;
        this._previousTop += gestureState.dy;
        this._previousWidth = this.state.rect_width;
        this._previousHeight = this.state.rect_height;
      },
      onPanResponderTerminate: (e, gestureState) => {
        this._previousLeft += gestureState.dx;
        this._previousTop += gestureState.dy;
        this._previousWidth = this.state.rect_width;
        this._previousHeight = this.state.rect_height;
      }
    });

    // Top Right Responder
    this.topRightResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (e, gestureState) => {
        const {dx, dy} = gestureState;
        const right = this._previousWidth + dx;
        const top = this._previousTop + dy;
        this.setRight(right);
        this.setTop(top);
        // console.log(this._previousWidth);
        // console.log("rect " + this.state.rect_width);
      },
      onPanResponderRelease: (e, gestureState) => {
        this._previousWidth += gestureState.dx;
        this._previousTop += gestureState.dy;
      },
      onPanResponderTerminate: (e, gestureState) => {
        this._previousWidth += gestureState.dx;
        this._previousTop += gestureState.dy;
      }
    });

    // Bottom Left Responder
    this.bottomLeftResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (e, gestureState) => {
        const {dx, dy} = gestureState;
        const left = this._previousLeft + dx;
        const bottom = this._previousHeight + dy;
        this.setLeft(left);
        this.setBottom(bottom);
      },
      onPanResponderRelease: (e, gestureState) => {
        this._previousLeft += gestureState.dx;
        this._previousHeight += gestureState.dy;
      },
      onPanResponderTerminate: (e, gestureState) => {
        this._previousLeft += gestureState.dx;
        this._previousHeight += gestureState.dy;
      }
    });

    // Bottom Right Responder
    this.bottomRightResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (e, gestureState) => {
        const {dx, dy} = gestureState;
        const right = this._previousWidth + dx;
        const bottom = this._previousHeight + dy;
        this.setRight(right);
        this.setBottom(bottom);
      },
      onPanResponderRelease: (e, gestureState) => {
        this._previousWidth += gestureState.dx;
        this._previousHeight += gestureState.dy;
      },
      onPanResponderTerminate: (e, gestureState) => {
        this._previousWidth += gestureState.dx;
        this._previousHeight += gestureState.dy;
      }
    });
  }

  componentDidMount() {
    this.initializeImage();
    this.props.navigation.setParams({ handleScan: this.sendImage.bind(this) });
  }

  find_view_dims(layout) {
      if(!this.state.initialized) {
        const {x, y, width, height} = layout;
        var image_width = width - LEFT_INIT_OFFSET;
        var image_height = (width - LEFT_INIT_OFFSET) * this.IMAGE_RATIO;
        var top_offset = (height - image_height) / 2;
        if(top_offset < 0) {
          top_offset = 0;
        }
        this._previousLeft = LEFT_INIT_OFFSET;
        this._previousTop = top_offset;
        this._previousWidth = image_width;
        this._previousHeight = image_height;
        this.setState({
          initialized: true,
          view_width: width,
          view_height: height,
          image_width: image_width,
          image_height: image_height,
          image_x: x,
          image_y: y,
          image_top_offset: top_offset,
          image_left_offset: LEFT_INIT_OFFSET,
          rect_x: x,
          rect_y: y,
          rect_width: image_width,
          rect_height: image_height,
          rect_top_offset: top_offset,
          rect_left_offset: LEFT_INIT_OFFSET,
        });
      }
  }

  find_rect_dims() {
    return({
      top: this.state.rect_top_offset,
      left: this.state.rect_left_offset,
      right: 0,
      bottom: 0,
      width: this.state.rect_width,
      height: this.state.rect_height,
    });
  }

  render() {
    return(
      <View style={styles.container} >
        <View style={[styles.backgroundContainer, {left: this.state.image_left_offset, top: this.state.image_top_offset}]} onLayout={(event) => {
            this.find_view_dims(event.nativeEvent.layout)
          }}>
          <Image source={{uri: this.IMAGE_URI}} style={{ width: this.state.image_width, height: this.state.image_height }}/>
        </View>
        <View style={[styles.clipRectBorder, this.find_rect_dims()]}/>
        <View style={[styles.moveableDots,
            {top: this.state.rect_top_offset - DOT_SIZE / 2,
              left: this.state.rect_left_offset - DOT_SIZE / 2}]} {...this.topLeftResponder.panHandlers}/>
        <View style={[styles.moveableDots,
            {top: this.state.rect_top_offset + this.state.rect_height - DOT_SIZE / 2,
              left: this.state.rect_left_offset - DOT_SIZE / 2}]} {...this.bottomLeftResponder.panHandlers}/>
        <View style={[styles.moveableDots,
            {top: this.state.rect_top_offset - DOT_SIZE / 2,
              left: this.state.rect_left_offset + this.state.rect_width - DOT_SIZE / 2}]} {...this.topRightResponder.panHandlers}/>
        <View style={[styles.moveableDots,
            {top: this.state.rect_top_offset + this.state.rect_height - DOT_SIZE / 2,
              left: this.state.rect_left_offset + this.state.rect_width - DOT_SIZE / 2}]} {...this.bottomRightResponder.panHandlers}/>
        </View>
    );
  }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        overflow: 'hidden',
        // backgroundColor: 'black',
    },
    backgroundContainer: {
      position: 'absolute',
      // justifyContent: 'center',
      // alignItems: 'center',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    editboxContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    clipRectBorder: {
        position: 'absolute',
        // top: 0,
        // right: 0,
        // bottom: 0,
        // left: 0,
        borderColor: '#FFD700',
        borderWidth: 2,
    },
    editboxMiddle: {
        flexDirection: 'row',
    },
    moveableDots: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: DOT_SIZE / 2,
      backgroundColor: '#FFD700',
    },
    overlay: {
      flex: 1,
      opacity: 0.5,
      backgroundColor: 'black',
    }
});
