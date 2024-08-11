import { View, Text, StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

const IOSNotification = (props) => {
  const handleStartTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    props.setStartTime(currentDate);
  };

  const handleEndTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    props.setEndTime(currentDate)
  }

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    currentDate.setHours(23)
    currentDate.setMinutes(59)
    currentDate.setSeconds(59)
    props.setEndDate(currentDate)
    console.log(props.endDate, currentDate)
    // if (props.startTime === props.endDate) {
    //   props.setEndDate(props.endTime)
    // }
  }


  return ( 
    <View>
      <View style={styles.range}> 
        <Text style={styles.heading}>Time Range</Text>
        <View style={styles.inputs}>
          {/* <View> */}
            <DateTimePicker
              testID="dateTimePicker"
              value={props.startTime}
              mode="time"
              is24Hour={true}
              onChange={handleStartTime}
              style={styles.picker}
            />
            {/* {props.data && <Text style={{textAlign: "center", marginTop: 20}}>{String(new Date(props.startDisp).getHours())}:{String(new Date(props.startDisp).getMinutes())}</Text>} */}
          {/* </View> */}
          {/* <View> */}
            <DateTimePicker
              testID="dateTimePicker"
              value={props.endTime}
              mode="time"
              is24Hour={true}
              onChange={handleEndTime}
              style={styles.picker}
            />
            {/* {props.data && <Text style={{textAlign: "center", marginTop: 15}}>{String(new Date(props.endDisp).getHours())}:{String(new Date(props.endDisp).getMinutes())}</Text>} */}
          {/* </View> */}
        </View>
      </View>
      <View style={styles.final}> 
        <Text style={styles.heading}>End Date</Text>
        <View style={styles.date}>
          {/* <View> */}
            <DateTimePicker 
              value={props.endDate}
              mode="date"
              onChange={handleDateChange}
              display="default"
            />
            {/* {props.data && <Text style={{textAlign: "center", marginTop: 20}}>{String(new Date(props.endDate).getMonth() + 1)}/{String(new Date(props.endDate).getDate())}</Text>}
          </View> */}
        </View>
      </View>
    </View>
   );
}
 
export default IOSNotification;

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
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: .5,
  },
  final: {
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // height: 170,
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
    width:  129,
    alignSelf: "center",
    marginTop: 20,
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
})