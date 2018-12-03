import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  TextInput,
  Button,
  Alert,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { WebBrowser, Constants} from 'expo';


export default class TextScreen extends React.Component {
  constructor(){
    super();
    this.state={
      textInputData : '',
      alltext : [],
    }
  }

  addText = () => {
    let notEmpty = this.state.textInputData.trim().length > 0;

    if (notEmpty) {
      this.setState(
        prevState => {
          let { alltext, textInputData } = prevState;
          return {
            alltext: alltext.concat({ key: alltext.length, textInputData: textInputData }),
            textInputData: ""
          };
        },
        () => Alltexts.save(this.state.alltext)
      );
    }
  };

  componentDidMount() {
    Alltexts.all(alltext => this.setState({ alltext: alltext || [] }));
  }

  deleteText = i => {
    this.setState(
      prevState => {
        let alltext = prevState.alltext.slice();

        alltext.splice(i, 1);

        return { alltext: alltext };
      },
      () => Alltexts.save(this.state.alltext)
    );
  };

  render() {
    return (
      <View style={styles.MainContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >


      <FlatList
          style={styles.list}
          data={this.state.alltext}
          renderItem={({ item, index }) =>
              (<View>
              <View style={styles.listItemCont}>
                <Text style={styles.listItem}>{item.textInputData}</Text>
                <Button title="X" onPress={() => this.deleteText(index)} />
                <View style={styles.hr} />
              </View>
            </View>)}

        />
        <TextInput
               placeholder="Enter Some Text here"
               onChangeText={ data => this.setState({textInputData : data}) }
               onSubmitEditing={this.addText}
               value={this.state.textInputData}
               underlineColorAndroid='transparent'
               style={styles.TextInputStyle}
               returnKeyType="done"
               returnKeyLabel="done"
             />
        </ScrollView>
      </View>
    );
  }
}

let Alltexts = {
    convertToArrayOfObject(alltext, callback) {
      return callback(
        alltext ? alltext.split("||").map((textInputData, i) => ({ key: i, textInputData: textInputData })) : []
      );
    },
    convertToStringWithSeparators(alltext) {
      return alltext.map(textInputData => textInputData.textInputData).join("||");
    },
    all(callback) {
      return AsyncStorage.getItem("txt", (err, alltext) =>
      this.convertToArrayOfObject(alltext, callback)
    );
    },
    save(alltext) {
      AsyncStorage.setItem("txt", this.convertToStringWithSeparators(alltext));
    }
};
const styles = StyleSheet.create({
MainContainer :{
justifyContent: 'center',
alignItems: 'center',
flex:1,
margin: 10

},
TextInputStyle:{
  textAlign: 'center',
  height: 40,
  width: '100%',
  borderWidth: 1,
  borderColor: '#028b53',
  borderRadius: 10
},
button: {
  width: '100%',
  height: 40,
  padding: 10,
  backgroundColor: '#4CAF50',
  borderRadius:7,
  marginTop: 10
},
buttonText:{
  color:'#fff',
  textAlign:'center',
},
text:{
  fontSize: 20,
  textAlign: 'center'
},
list: {
  flex: 1,
},
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18
  },
  hr: {
    height: 2,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
});
