import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  AsyncStorage,
  TouchableWithoutFeedback,
  AlertIOS,
  Share,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
//import Share from 'react-native-share';
import { RichTextEditor, RichTextToolbar, actions } from 'react-native-zss-rich-text-editor';
import RNFS from 'react-native-fs';
import { Content, Spinner, Container, Header, Icon, Left, Body, Right, Button, Title, Card, CardItem } from 'native-base';

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width


export default class TextEditor extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        const { goBack } = navigation;
        return {
            title: 'Text Editor',
            headerTintColor: 'black',
            headerRight: <TouchableOpacity onPress={navigation.state.params.handlesave} style={{ marginRight: 10 }}>
                <Text>SAVE</Text>
            </TouchableOpacity>,
            headerLeft: <TouchableOpacity onPress={() => goBack(null)} style={{ marginRight: 10 }}>
                <Text>Cancel</Text>
            </TouchableOpacity>
        }
    };

    constructor(props) {
        super(props);
        this.getHTML = this.getHTML.bind(this);
        this.state = {
            isToolShow: true,
            newText: "",
        }
        this.props.navigation.setParams({handlesave: this.saveAndShare})
    }
    saveAndShare = async () => {
      // this.getHTML();
      // console.log(newText);
      // console.log(this.state);
      this.saveText();
      // Share.share(
      //       {message: JSON.stringify(this.getHTML()),
      //       }
      // ).then(result => console.log(result)).catch(errorMsg => console.log(errorMsg));
    }

    goback = () => {
         this.props.navigation.goback;
    }
    changeState = () => {
        this.setState({ isToolShow: !this.state.isToolShow })
    }

    getHTML = async () => {

        const contentHtml = await this.richtext.getContentHtml();
        // console.log(contentHtml.length);
        var text = "";
        for(let i = 0; i < contentHtml.length; i++) {
          text += contentHtml[i];
        }
        // console.log(text);
        this.setState({newText: text});
        // return text;
    }
    saveText = async () => {
      const contentHtml = await this.richtext.getContentHtml();
      // console.log(contentHtml.length);
      var textoSave = "";
      for(let i = 0; i < contentHtml.length; i++) {
        textoSave += contentHtml[i];
      }
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
        text => this.createFile({text, path, textoSave})
      );
    };

    createFile = ({text, path, textoSave}) => {
      const { navigation } = this.props;

      RNFS.writeFile(path + text + '.txt', textoSave, 'utf8')
      .then((success) => {
        console.log(textoSave);
        navigation.navigate('Main');
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
    }

    renderTextEditor() {
        var testString = this.props.navigation.getParam('initialText', 'NO-TEXT');
        // console.log("In Editor: " + testString);
        return (
            <Container style={Platform.OS == 'ios' ? {} : styles.container}>
                <View style={{ width: screenWidth, marginVertical: 70, height: screenHeight - 185, borderColor: '#666', borderWidth: 0.5, borderRadius: 2 }}>
                    <RichTextEditor
                        ref={(r) => this.richtext = r}
                        hiddenTitle={true}
                        style={styles.richText}
                        footerHeight={screenHeight * 0.25}
                        initialContentHTML={testString}
                        contentPlaceholder='Write a description'
                        editorInitializedCallback={() => this.onEditorInitialized()}
                        />
                </View>
                {this.showHideToolbar()}
                <TouchableOpacity onPress={this.changeState} style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginVertical: 0, position: 'absolute' }}>
                    <Image source={require('../assets/images/ic-edit-text.png')} style={{ height: 50, width: 50 }} />
                </TouchableOpacity>
            </Container>)
    }

    showHideToolbar() {
        if (this.state.isToolShow) {
            return (
                <View style={{left: 50, width: screenWidth -50, position: 'absolute', height: 50, marginVertical: 0, borderColor: '#999', borderWidth: 1, borderRadius: 2, alignItems: 'center', paddingTop: 4 }}>
                    <RichTextToolbar
                        getEditor={() => this.richtext}
                        style={{position: 'absolute', backgroundColor: 'transparent'}}
                    />
                </View>)
        } else {
            return null
        }
    }

    render() {
            return (
            <ScrollView keyboardDismissMode='on-drag'>
            <KeyboardAvoidingView behavior= "padding" style={styles.container}>
                {this.renderTextEditor()}
            </KeyboardAvoidingView>
            </ScrollView>
            )
    }

}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column'
    },

    textInput: {
        marginTop: 20,
        paddingLeft: 10,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 5,
        height: screenHeight - 150
    },

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        zIndex: -3
        //   paddingTop: 40
    },
    richText: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginTop: 20,
    },
});
