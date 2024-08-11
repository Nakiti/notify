import {Text, View, StyleSheet, Modal, Pressable, Button, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity} from 'react-native';
import { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"

const HomeModal = (props) => {
  const [text, setText] = useState("")

  const handleConfirm = async () => {
    if (text !== "") {
      props.setModalVisible(false)
      
      const storedData = await AsyncStorage.getItem("data");
      const storedDataParsed = JSON.parse(storedData);
      let newData = [];

      try {
        if (storedData == null) {
          await AsyncStorage.setItem("data", JSON.stringify([{content: [], title: text, notificationIDs: [], key: Date.now(), }]))
        } else {
          newData = [{content: [], title: text, notificationIDs: [], key: Date.now()}, ...storedDataParsed]
          await AsyncStorage.setItem("data", JSON.stringify(newData))
        }
      } catch (e) {
        console.log(e)
      }
    }
    props.setFetch(true)
  }

  return (
    <View style={styles.blur}>
      <Modal
        visible={props.modalVisible}
        transparent={true}
        style={styles.modal}
        animationType="none"
        
      >
        <View style={styles.modal}>
          <View style={styles.inputs}>
            <TextInput placeholder='Enter Title' placeholderTextColor={"grey"} style={styles.title} onChangeText={text => setText(text)} maxLength={15}></TextInput>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={() => props.setModalVisible(false)}><Text>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleConfirm}><Text>Confirm</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 300,
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "white",
    height: 135,
    width: 350,
    alignSelf: "center",
    borderRadius: 15,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
     
    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    width: "100%",
    height: 50,
    borderColor: "grey",
    borderWidth: 2,    
    textAlign: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
    marginBottom: 5,
  },
  inputs: {
    flexDirection: "column",
    width: 320,
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    width: 320,
    justifyContent: "space-around",
    marginTop: 2,
  },
  button: {
    borderColor: "grey",
    borderWidth: 2,
    width: 155,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
})

export default HomeModal;