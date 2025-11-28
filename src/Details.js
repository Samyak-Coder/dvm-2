import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Button,
  ScrollView
} from 'react-native';
import {useStore} from './store'
import { useNavigation } from '@react-navigation/native'

function Details() {
  const navigation = useNavigation
  const [description, setDescription] = useState('')
  const selected = useStore((s) => s.selected)
  const clearSelected = useStore((s) => s.clearSelected)

  useEffect(()=>{
    const fetchBooks = async(name)=>{
    console.log(name)
      try{
          const response = await axios.get(`https://openlibrary.org${selected.key}.json`)
          const data = response.data
          setDescription(data.description)
        }catch(err){
          console.log(`Error: ${err}`)
        }
        }
      fetchBooks()
})

if (!selected) {
return (
<View style={styles.center}>
<Text style={styles.warning}>No item selected.</Text>
<Button title="Go back" onPress={() => navigation.goBack()} />
</View>
)
}
  

  return (
    <ScrollView>
    <View style={styles.container}>
    <Image
              source={{
                uri: selected.cover
                  ? `https://covers.openlibrary.org/b/olid/${selected.cover}-M.jpg`
                  : 'https://placehold.co/60x90.png',
              }}
              style={{ width: 180, height: 270 }}
            />
    <Text style={styles.title}>{selected.title}</Text>
    <Text style={styles.description} >{description}</Text>
    
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center'
  },  
  title:{
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10
  },
  description: {
    margin: 10,
    fontSize: 15,
  }
});

export default Details;
