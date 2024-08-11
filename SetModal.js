import {Text, View, StyleSheet, Modal, TextInput, TouchableOpacity} from 'react-native';
import { useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SetModal = (props) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleConfirm = async () => {
      if (title !== "" && content !== "") {
        const jsonValue = await AsyncStorage.getItem("data");
        const value = JSON.parse(jsonValue)

        try {
          value.find(item => item.key === props.id).content.push({title: title, content: content, key: Date.now()})
          await AsyncStorage.setItem("data", JSON.stringify(value))
        } catch (e) {
          console.log(e)
        }

        console.log(value)
        setTitle("");
        setContent("");
        props.setModalVisible(false)
        props.setFetch(true)
      }
    }

    return ( 
        <Modal
          visible={props.modalVisible}
          transparent={true}
        >
          <View style={styles.modal}>
            <Text style={styles.header}>New Term</Text>
            <View style={styles.inputs} >
              <TextInput placeholder='Enter Title' placeholderTextColor={"grey"} style={styles.title} onChangeText={text => setTitle(text)} multiline={true}></TextInput>
              <TextInput placeholder='Enter Content' placeholderTextColor={"grey"} style={styles.content} onChangeText={text => setContent(text)} multiline={true}></TextInput>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => props.setModalVisible(false)} style={styles.button2}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={styles.button1}><Text>Confirm</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
     );
}
 
const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 250,
    borderColor: "black",
    borderWidth: 1.25,
    backgroundColor: "white",
    minHeight: 250,
    width: 370,
    alignSelf: "center",  
    borderRadius: 10,

    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  header: {
    fontSize: 20,
    marginBottom: 15,
  },
  title: {
    width: "100%",
    minHeight: 50,
    borderColor: "grey",
    borderWidth: 2,    
    textAlign: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
    marginBottom: 5,
  },
  content: {
    width: "100%",
    minHeight: 50,
    borderColor: "grey",
    borderWidth: 2,    
    textAlign: "center",
    backgroundColor: "white",
    padding: 5,
  },
  inputs: {
    // flexDirection: "column",
    width: 300,
    // alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    width: 300,
    justifyContent: "space-around",
    marginTop: 5,

  },
  button1: {
    borderColor: "grey",
    borderWidth: 2,
    width: 147.5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 10,
    marginLeft: 2.5,
  },
  button2: {
    borderColor: "grey",
    borderWidth: 2,
    width: 147.5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 10,
    marginRight: 2.5,
  },
})

export default SetModal;