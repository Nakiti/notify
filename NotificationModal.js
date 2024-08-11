import { View, Text, Modal, StyleSheet, Pressable, Platform, Button } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import SelectDropdown from 'react-native-select-dropdown'
import AndroidNotification from "./AndroidNotification";
import IOSNotification from "./IOSNotification";

const NotificationModal = ({route, navigation}) => {
  const {key} = route.params;
  const [allData, setAllData] = useState(null);
  const [allAllData, setAllAllData] = useState(null);
  const [data, setData] = useState([])
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [frequency, setFrequency] = useState(0)
  const [message, setMessage] = useState("");
  const [displayError, setDisplayError] = useState(false);
  const [title, setTitle] = useState("");
  const [deviceType, setDeviceType] = useState("")
  const [startDisp, setStartDisp] = useState()
  const [endDisp, setEndDisp] = useState()
  const [dateDisp, setDateDisp] = useState()
  const [confirmModal, setConfirmModal] = useState(false);
  const [endDisplay, setEndDisplay] = useState(false)
  const times = ["15 min", "30 min", "1 hour", "2 hours", "3 hours"]

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const handlePress = async () => {
    if (endTime > startTime && frequency !== 0 && endDate >= (Date.now() - 24*60*60*1000) && data[0] !== undefined) {
      let startTimeStamp = startTime.getTime(); 
      let endTimeStamp = endTime.getTime();
      let endDateStamp = endDate.getTime()
  
      // console.log(startTime, endTime, endDate, frequency)
  
      Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: `Notifications have been set for ${title} from ${String(new Date(startTime).toLocaleTimeString([], {hour: "numeric", minute: "2-digit"}))} to ${String(new Date(endTime).toLocaleTimeString([], {hour: "numeric", minute: "2-digit"}))} until ${String(new Date(endDate).getMonth() + 1)}/${String(new Date(endDate).getDate())}`
        }, 
        trigger: {
          seconds: 10
        }
      })
      let index = -1;
      let identifier;
  
      for (let x = startTimeStamp; x <= endDateStamp; x += 60*60*24*1000) {
        for (let i = startTimeStamp; i <= endTimeStamp; i += frequency) {
          let trigger = new Date(i)
          trigger.setSeconds(0);
  
          index += 1
          if (index > data.length-1) {
            index = 0;
          }
  
          if (deviceType === "ios") {
            identifier = await Notifications.scheduleNotificationAsync({
              content: {
                title: title,
                subtitle: data[index].title,
                body: data[index].content
              },
              trigger: {
                seconds: (i - Date.now())/1000
              }
            })
  
          } else if (deviceType === "android") {
            identifier = await Notifications.scheduleNotificationAsync({
              content: {
                title: data[index].title,
                subtitle: title,
                body: data[index].content
              },
              trigger: {
                seconds: (i -Date.now())/1000
              },
            })          
          }
  
          console.log(trigger, i - Date.now(), data[index].title, identifier)
  
          let tempData = allAllData;
          tempData.find(item => item.key === key).notificationIDs.push(identifier)
          await AsyncStorage.setItem("data", JSON.stringify(tempData))
        }
        startTimeStamp += 60*60*24*1000;
        endTimeStamp += 60*60*24*1000
      }      

      navigation.navigate("Home")
    } else if (endTime <= startTime) {
      setMessage("End Time Must Be Greater Than Start Time")
      setDisplayError(true)
      handleError()
    } else if (frequency === 0) {
      setMessage("Enter a Frequency")
      handleError()
    } else if (endDate < (Date.now() - 24*60*60*1000)) {
      setMessage("Not a Valid End Date")
      handleError()
    } else if (data !== []) {
      setMessage("No data")
      handleError()
    }

    setDisplays()
  }


  const handleEnd = async() => {
    setConfirmModal(false)

    for (var i = 0; i< allAllData.find(item => item.key === key).notificationIDs.length; i++) {
      // console.log(allAllData.find(item => item.key === key).notificationIDs[i])
      await Notifications.cancelScheduledNotificationAsync(allAllData.find(item => item.key === key).notificationIDs[i])
    }

    let tempData = allAllData;
    tempData.find(item => item.key === key).notificationIDs = []

    tempData.find(item => item.key === key).endDate = new Date(Date.now())
    tempData.find(item => item.key === key).endTime = new Date(Date.now())
    tempData.find(item => item.key === key).startTime = new Date(Date.now())

    await AsyncStorage.setItem("data", JSON.stringify(tempData))
    setEndDisplay(false)
    navigation.navigate("Home")
  }

  const handleError = () => {
    setDisplayError(true)
    setTimeout(() => {
      setDisplayError(false)
    }, 1000)
  }

  const setDisplays = async () => {
    let finalData = allAllData;

    for (var i = 0; i < finalData.length; i++) {
      if (finalData[i].key === key) {
        finalData[i].startTime = startTime;
        finalData[i].endTime = endTime;
        finalData[i].endDate = endDate
      }
    }
    
    await AsyncStorage.setItem("data", JSON.stringify(finalData))
  }

  const askNotification = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (Device.isDevice && status === 'granted') {
      console.log('Notification permissions granted.');
    }  
  };

  const handleChange = (item, index) => {
    let tempFrequency = item * 60 * 1000

    if (item === "15 min") {
      tempFrequency = 15 * 60 * 1000
    } else if (item === "30 min") {
      tempFrequency = 30 * 60 * 1000
    } else if (item === "1 hour") {
      tempFrequency = 60 * 60 * 1000
    } else if (item === "2 hour") {
      tempFrequency = 120 * 60 * 1000
    } else if (item === "3 hour") {
      tempFrequency = 180 * 60 * 1000
    }
    setFrequency(tempFrequency)
  }
    
  useEffect(() => {
    if (Platform.OS === "ios") {
      setDeviceType("ios")
    } else if (Platform.OS === "android") {
      setDeviceType("android")
    }

    const fetch = async () => {
      const jsonValue = await AsyncStorage.getItem("data");
      const value = JSON.parse(jsonValue)
      const filteredData = value.filter(item => item.key === key)

      // console.log(value.find(item => item.key === key))

      setTitle(filteredData[0].title)
      setData(filteredData[0].content)
      setAllData(filteredData[0])
      setAllAllData(value)
      
      let finalDate = (new Date(filteredData[0].endDate));
      let finalTime = (new Date(filteredData[0].endTime));
      
      finalDate.setSeconds(finalTime.getSeconds())
      finalDate.setMinutes(finalTime.getMinutes())
      finalDate.setHours(finalTime.getHours())


      console.log(finalDate, finalTime)
      console.log(new Date(Date.now()))
      if ((new Date(Date.now())).getTime() < (new Date(finalDate)).getTime()) {
        setEndDisplay(true)
      } else {
        setEndDisplay(false)
      }

      // console.log((new Date(value.find(item => item.key === key).endDate)).getTime())

      if (filteredData[0].startTime !== undefined && filteredData[0].endTime !== undefined) {
        setStartDisp(filteredData[0].startTime)
        setEndDisp(filteredData[0].endTime)
        setDateDisp(filteredData[0].endDate)
      }

      // console.log(filteredData[0])
    }

    fetch()
    askNotification();
  }, [])

  return ( 
    <View style={styles.view}>
      <View style={styles.view}>
        <Text style={styles.title}>Configure Notifications</Text>
        {/* <Button title="delete" onPress={() => Notifications.cancelAllScheduledNotificationsAsync()}/> */}
        <Modal
          visible={displayError}
          transparent={true}
        >
          <View style={styles.errorModal}>
            <Text style={{fontSize: 20, textAlign: "center"}}>{message}</Text>
          </View>
        </Modal>
        <Modal
          visible={confirmModal}
          transparent={true}
        >
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>Are you sure you want end this notification cycle"?</Text>
            <View style={styles.confirmButtons}>
              <Pressable onPress={() => {setConfirmModal(false)}} style={styles.confirmButton}><Text>Cancel</Text></Pressable>
              <Pressable onPress={handleEnd} style={styles.confirmButton}><Text>Confirm</Text></Pressable>
            </View>
          </View>
        </Modal>
        <View style={styles.frequency}>
          <Text style={styles.heading}>Frequency</Text>
          <View> 
            <SelectDropdown data={times} buttonStyle={styles.dropdown} onSelect={(item, index) => handleChange(item, index)}/>
          </View>
        </View>
        {(deviceType === "ios") ? <IOSNotification startTime={startTime} endTime={endTime} endDate={endDate} setStartTime={setStartTime} setEndTime={setEndTime} setEndDate={setEndDate} startDisp={startDisp} endDisp={endDisp} dateDisp={dateDisp} data={data}/> : <AndroidNotification startTime={startTime} endTime={endTime} endDate={endDate} setStartTime={setStartTime} setEndTime={setEndTime} setEndDate={setEndDate} startDisp={startDisp} endDisp={endDisp} dateDisp={dateDisp} data={data}/>}
        {endDisplay ? <Pressable onPress={() => setConfirmModal(true)} style={styles.endButton}><Text style={{color: "#ff726f"}}>End</Text></Pressable> : <Text>  </Text>}
      </View>
      <View style={styles.bottomBar}>
        <Pressable onPress={handlePress} style={styles.button}><Text style={styles.text}>Confirm</Text></Pressable>
      </View>
    </View>
  );
}
 
export default NotificationModal;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f3f3f3"
  },
  title: {
    fontSize: 24
  },
  heading: {
    marginTop: 30,
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
  },
  frequency: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    marginTop: 30,
    alignItems: "center",
    height: 150,
    marginBottom: 20,
    borderWidth: .25,
  },
  range: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: .25,
  },
  final: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 130,
    borderWidth: .25,
  },
  inputs: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 20,
    width: 300,
    alignSelf: "center",      
  },
  dropdown: {
    backgroundColor: "#ebebeb",
    borderRadius: 10,
    marginTop: 20,
    height: 50,
  },
  picker: {
    width: 100,
    color: "black",
  },
  date: {
    height: 60,
    width:  129,
    alignSelf: "center",
    marginTop: 20,
  },
  bottomBar: {
    justifyContent: "center",
    flexDirection: "row",
    // borderColor: "black",
    // borderWidth: 2,
    width: "100%",
    height: 100,
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    opacity: 1,
    borderTopWidth: .5,
  },
  button: {
    justifyContent: "center",
    width: 150,
    height: 50,
    textAlign: "center",
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 10
  },
  text: {
    textAlign: "center",
    // fontSize: 24,
    color: "#0D1B2A",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  closeButton: {
    marginLeft: 50,
  },
  errorModal: {
    height: 100,
    width: 370,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 300,
    borderWidth: 1.5,
    alignSelf: "center",
    backgroundColor: "white",
    borderColor: "#ff726f",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },  
  endButton: {
    justifyContent: "center",
    width: 150,
    height: 50,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff726f",
    borderRadius: 10,
    marginTop: 60,
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
})