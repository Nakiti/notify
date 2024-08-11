import {Text, View, StyleSheet, ScrollView} from 'react-native';
import { useState, useEffect } from 'react';
import SetModal from './SetModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useLayoutEffect } from 'react';

const Set = ({ route, navigation }) => {
  const {text, key, content} = route.params;
  const [pairs, setPairs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [allData, setAllData] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <IconButton style={styles.notification} onPress={handleNotificationOpen} icon={props => <Icon name="bell" {...props}/>}/>
      }
    })
  }, [navigation])

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try { 
        const jsonValue = await AsyncStorage.getItem('data');
        const value = JSON.parse(jsonValue)
        const setData = value.find(item => item.key === key)

        setAllData(value)
        setPairs(setData.content)
        // console.log(pairs)
      } catch (e) {
        if (e.name === "AbortError") {
          console.log("succesfully aborted")
        } else {
          console.log(e)
        }
      }
    }
    if (fetch) {
      fetchData()
      setFetch(false)

      return () => controller.abort()
    }
  })

  const handleNotificationOpen = () => {
    navigation.navigate("NotificationModal", {key: key})
  }

  const handleDelete = async (id) => {
    try { 
      let finalData = allData;
      for (var i = 0; i < finalData.length; i++) {
        if (finalData[i].key === key) {
          finalData[i].content = finalData[i].content.filter(item => item.key !== id)
        }
      }

      await AsyncStorage.setItem("data", JSON.stringify(finalData))
      setFetch(true)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.view}>
        <Text style={styles.header}>{text}</Text>
        <View style={styles.modal}>
          <SetModal modalVisible={modalVisible} setModalVisible={setModalVisible} pairs={pairs} setPairs={setPairs} id={key} setFetch={setFetch}/>
        </View>
        <ScrollView style={styles.scrollView}>
          {pairs && pairs.map((item) => {
            return (
              <View style={styles.card} key={item.key}>
                <IconButton style={styles.iconButton} onPress={() => handleDelete(item.key)} icon={props => <Icon name="delete" {...props}/>}/>
                  <Text style={styles.titleDisplay} selectable>{item.title}</Text>
                  <Text style={styles.contentDisplay} selectable>{item.content}</Text>
              </View>
            )
          })}
        </ScrollView>
        <View style={styles.bottomBar}>
          <IconButton style={styles.button} onPress={() => setModalVisible(true)} icon={props => <Icon name="plus" {...props}/>}/>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  scrollViewContainer: {
    height: "100%"
  },
  header: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
  },
  card: {
    flexDirection: "column",
    width: 350,
    alignItems: "center",
    flex: 1,
    margin: 5,
    minHeight: 200,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: .25,
  },
  button: {
    justifyContent: "center",
    width: 60,
    height: 60,
    textAlign: "center",
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 50
  },
  titleDisplay: {
    width: "80%",
    minHeight: 40,
    borderColor: "grey",
    textAlign: "left",
    fontSize: 21,
    textAlignVertical: "center",
    padding: 3,

  },
  contentDisplay: {
    width: "95%",
    minHeight: 50,
    textAlign: "center",
    // marginTop: 7.5,
    fontSize: 18,
    justifyContent: "center",
    padding: 5,
  },
  scrollView: {
    paddingTop: 20,
    height: 200,
    alignSelf: "center",
    flex: 1,
  },
  bottomBar: {
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    height: 100,
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    borderTopWidth: .5,
  },
  text: {
    textAlign: "center",
    // fontSize: 24,
    color: "#0D1B2A",
  },
  stuff: {
    flexDirection: "column",    
  },
  iconButton: {
    height: 40,
    width: 50,
    alignSelf: "flex-end",
    marginTop: 10,
  }, 
  notification: {
    alignSelf: "flex-end",
  },
  errorModal: {
    height: 100,
    width: 350,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 300,
    borderWidth: 2,
    alignSelf: "center",
    backgroundColor: "white",
    borderColor: "#ff726f",
    borderRadius: 15,
  }, 
})

export default Set;