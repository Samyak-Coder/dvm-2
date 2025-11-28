import {useEffect} from 'react';
import Home from './Home'
import Details from './Details'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import {clearBooks} from './cache_storage'


const Stack = createStackNavigator();

function App() {
  
 useEffect(() => {
    clearBooks();
  }, []);
  
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
