import React from "react";
import Home from "./Home";
import Set from "./Set";
import NotificationModal from "./NotificationModal";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const backgroundColor = "#f3f3f3";

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} 
        options={{
          title: "",
          headerStyle: {
            backgroundColor: backgroundColor
          },
          headerTitleStyle: {
            fontWeight: "bold",
            textAlign: "center",
            color: "black",
          },
          headerShadowVisible: false
        }}
        />
        <Stack.Screen name="Set" component={Set} 
          options={{      
            title: "",      
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              textAlign: "center",
              color: "black"
            },
            headerShadowVisible: false
          }}
        />
        <Stack.Screen name="NotificationModal" component={NotificationModal} 
          options={{      
            title: "",      
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              textAlign: "center",
              color: "black"
            },
            headerShadowVisible: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}