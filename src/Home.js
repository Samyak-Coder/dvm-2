import { useState, useCallback } from 'react';
import axios from 'axios';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput
} from 'react-native';
import Item from './Item'
import debounce from "lodash/debounce";

function Home() {
  
  const [booksList, setBooksList] = useState()

    const fetchBooks = async(name)=>{
      console.log(name)
    try{
        const response = await axios.get(`https://openlibrary.org/search.json?q=${name}`)

        const data1 = response.data.docs
        
        const top10 = data1.slice(0,10).map(item=>({
          key: item.key,
          title: item.title,
          author: item.author_name ? item.author_name.join(',') : 'N/A',
          publish_year: item.first_publish_year,
          cover: item.cover_edition_key,
        }))
        setBooksList(top10)

      }catch(err){
        console.log(`Error: ${err}`)
      }
      }

  const debouncedFunction = useCallback(debounce(fetchBooks, 600), [])
  

  return (
    <View style={styles.container}>
    <View style={styles.tiContainer}>
      <TextInput placeholder='Search using OpenLibrary...' onChangeText={(e)=>debouncedFunction(e)} style={styles.textInput} placeholderTextColor="black" />
      </View>
      <FlatList
        data={booksList}
        renderItem={({item})=><Item item={item} />
        }
        keyExtractor={(item) => item.key}
        removeClippedSubviews = {true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#f9fafb'
  },  
  tiContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  textInput:{
    borderWidth: 2,
    borderRadius: 15,
    height: 40,
    width: '75%',
    borderBlockColor: '#545151',
    padding: 10,
  }
});

export default Home;
