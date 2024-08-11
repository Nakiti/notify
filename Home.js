import React, {useEffect, useState} from "react";
import { Text,View, StyleSheet, Pressable, Modal, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import HomeModal from "./HomeModal";
import { IconButton } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const Home = ({navigation, route}) => {
  const [itemList, setItemList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deletedKey, setDeletedKey] = useState(null);
  const [deletedSetName, setDeletedSetName] = useState("")

  const askNotification = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (Device.isDevice && status === 'granted') {
      console.log('Notification permissions granted.');
    }  
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("data");
        const value = JSON.parse(jsonValue)
        setItemList(value)
        // console.log(value)
      } catch (e) {
        console.log(e)
      }
    }

    if (fetch) {
      fetchData();
      setFetch(false);
    }

    askNotification();
  }, [fetch])

  const handleDelete = async (key) => {
    setConfirmModal(true)
    setDeletedKey(key)
    setDeletedSetName(itemList.filter(item => item.key === key)[0].title)
    
    for (var i = 0; i< itemList.find(item => item.key === deletedKey).notificationIDs.length; i++) {
      await Notifications.cancelScheduledNotificationAsync(itemList.find(item => item.key === deletedKey).notificationIDs[i])
    }
  }

  const handleConfirm = async () => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(itemList.filter(item => item.key !== deletedKey)));
      setFetch(true)
      setConfirmModal(false)
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <View style={styles.view}>
        <Text style={styles.header}>Home</Text>
        <View>
            <HomeModal modalVisible={modalVisible} setModalVisible={setModalVisible} setItemList={setItemList} itemList={itemList} fetch={fetch} setFetch={setFetch}/>
        </View>
        <Modal
          visible={confirmModal}
          transparent={true}
        >
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>Are you sure you want to delete "{deletedSetName}"?</Text>
            <Text style={styles.confirmText}>Deleted sets can not be recovered</Text>
            <View style={styles.confirmButtons}>
              <Pressable onPress={() => {setConfirmModal(false)}} style={styles.confirmButton}><Text>Cancel</Text></Pressable>
              <Pressable onPress={handleConfirm} style={styles.confirmButton}><Text>Confirm</Text></Pressable>
            </View>
          </View>
        </Modal>
        <ScrollView contentContainerStyle={styles.scrollView}>
            {itemList && itemList.map(item => {
                return (
                  <TouchableOpacity style={styles.item} key={item.key} onPress={() => {
                    navigation.navigate("Set", {text: item.title, key: item.key, content: item.content})}}>
                      <IconButton style={styles.deleteButton} onPress={() => handleDelete(item.key)}  icon={props => <Icon name="delete" {...props}/>}/>
                      <Text style={styles.text}>{item.title}</Text>
                      <Text style={styles.date}>{String(new Date(item.key).getMonth() + 1)}/{String(new Date(item.key).getDate())}/{String(new Date(item.key).getFullYear())}</Text>
                  </TouchableOpacity>
                )
            })}
        </ScrollView>
        <View style={styles.bottomBar}>
            {/* <Pressable style={styles.bottomButton} >
                <Text style={styles.addButtonText} onPress={() => setModalVisible(true)}>Add</Text>
            </Pressable> */}
          <IconButton style={styles.bottomButton} onPress={() => setModalVisible(true)} icon={props => <Icon  name="plus" {...props}/>}/>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: "#f3f3f3",
    },
    buttonText: {
      fontSize: 20,
      color: "#14213D"
    },
    itemContainer: {
      width: 350,
      flex: .75,
      flexDirection: "row",
      flex: 1,
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignSelf: "center"
    }, 
    item: {
      borderColor: "black",
      borderWidth: .25,
      height: 150,
      width: 155,
      margin: 10,
      borderRadius: 10,
      backgroundColor: "white",
      // justifyContent: "center",
      fontSize: 24,
    },
    bottomBar: {
      justifyContent: "center",
      flexDirection: "row",
      // borderColor: "black",
      // borderWidth: 2,
      width: "100%",
      height: 90,
      alignItems: "center",
      backgroundColor: "#e5e5e5",
      opacity: 1,
      borderTopWidth: .5,
    },
    bottomButton: {
      justifyContent: "center",
      width: 60,
      height: 60,
      textAlign: "center",
      borderColor: "black",
      borderRadius: 50,
      alignItems: "center",
      borderWidth: 1.5,
    },
    text: {
      textAlign: "center",
      fontSize: 22,
      color: "#0D1B2A",
      alignSelf: "center",
      marginTop: 15,
      padding: 2,
    },
    header:{
      fontSize: 34,
      marginLeft: 40,
      marginBottom: 20,
    },
    scrollView: {
      width: 350,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignSelf: "center"
    },
    deleteButton: {
      alignSelf: "flex-end",
    },
    addButtonText: {
      textAlign: "center",
      fontSize: 18,
      color: "#EE6C4D",
      alignSelf: "center",
      width: "100%",
      justifyContent: "center",
      alignItems: "center"
    },
    confirmModal: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 300,
      borderColor: "black",
      borderWidth: 2,
      backgroundColor: "white",
      height: 160,
      width: 350,
      alignSelf: "center",
      borderRadius: 15,
      
    },
    confirmButtons: {
      display: "flex",
      flexDirection: "row",
      marginTop: 7,
    },
    confirmButton: {
      borderWidth: 1,
      width: 140,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      margin: 7,
      borderRadius: 5,
    },
    confirmText: {
      fontSize: 16,
      width: 320,
      textAlign: "center"
    },
    date: {
      alignSelf: "flex-end",
      margin: 15,
      marginTop: 30,
      fontSize: 12,
      color: "grey"
    }
})

export default Home;