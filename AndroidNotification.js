import { View, Text, Modal, StyleSheet, TextInput, Pressable } from "react-native";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

const AndroidNotification = (props) => {
  const [showStart, setShowStart] = useState(false)
  const [showEnd, setShowEnd] = useState(false)
  const [showDate, setShowDate] = useState(false)

  const handleStartTime = (event, selectedDate) => {
    if (event?.type == "dismissed") {
      console.log("dismissed")
    } else {
      const currentDate = selectedDate;
      props.setStartTime(currentDate);
      setShowStart(false)
      console.log(currentDate)
    }
  };

  const handleEndTime = (event, selectedDate) => {
    if (event?.type == "dismissed") {
      console.log("dismissed")
    } else {
      const currentDate = selectedDate;
      props.setEndTime(currentDate)
      setShowEnd(false)
      console.log(currentDate)
    }
  }

  const handleDateChange = (event, selectedDate) => {
    if (event?.type == "dismissed") {
      console.log("dismissed")
    } else {
      const currentDate = selectedDate;
      props.setEndDate(currentDate)
      setShowDate(false)
      console.log(currentDate)
    }
  }

  return ( 
    <View>
      <View style={styles.range}> 
        <Text style={styles.heading}>Time Range</Text>
        <View style={styles.inputs}>
          <Pressable onPress={() => setShowStart(true)} style={styles.button}><Text>{(props.startTime.getHours() + 11) % 12 + 1}:{(props.startTime.getMinutes() < 10) ? "0" + props.startTime.getMinutes() : props.startTime.getMinutes()} {(props.startTime.getHours() > 12) ? "pm" : "am"}</Text></Pressable>
          {showStart && <DateTimePicker
            testID="dateTimePicker"
            value={props.endTime}
            mode="time"
            is24Hour={false}
            onChange={handleStartTime}
            style={styles.picker}
          />}
          <Pressable onPress={() => setShowEnd(true)} style={styles.button}><Text>{(props.endTime.getHours() + 11) % 12 + 1}:{(props.startTime.getMinutes() < 10) ? "0" + props.startTime.getMinutes() : props.startTime.getMinutes()} {(props.endTime.getHours() > 12) ? "pm" : "am"}</Text></Pressable>
          {showEnd && <DateTimePicker
            testID="dateTimePicker"
            value={props.endTime}
            mode="time"
            is24Hour={false}
            onChange={handleEndTime}
            style={styles.picker}
          />}
        </View>
      </View>
      <View style={styles.final}> 
        <Text style={styles.heading}>End Date</Text>
        <View style={styles.date}>
          <Pressable onPress={() => setShowDate(true)} style={styles.button}><Text>{props.endDate.toLocaleDateString()}</Text></Pressable>
          {showDate && <DateTimePicker 
            testID="dateTimePicker"
            value={props.endDate}
            mode="date"
            onChange={handleDateChange}
            style={styles.date}
          />}
        </View>
      </View>
    </View>
  );
}
 
export default AndroidNotification;

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
  range: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: .5,
  },
  final: {
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 130,
    borderWidth: .5,
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
  picker: {
    width: 100,
    color: "black",
  },
  date: {
    height: 60,
    alignSelf: "center",
    marginTop: 20,
  },
  text: {
    textAlign: "center",
    // fontSize: 24,
    color: "#0D1B2A",
  },
  button: {
    width: 100,
    height: 40, 
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ebebeb",

  }
})