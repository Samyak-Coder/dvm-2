import { useState, useEffect, useRef } from 'react';
import Home from './Home'
import Details from './Details'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();

function App() {
  
 
  
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home" >
      <Stack.Screen name= 'Details' component={Details} />
      <Stack.Screen name = "Home" component={Home} />     
    </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
