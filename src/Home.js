import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput
} from 'react-native';
import Item from './Item'
import debounce from "lodash/debounce";
import {getBooks, saveBooks} from './cache_storage';

function Home() {
  
  const [booksList, setBooksList] = useState([])
  const [books, setBooks] = useState([])

  useEffect(() => {
    const load = async () => {
      const storedBooks = await getBooks();
      setBooks(storedBooks);
    };

    load();
  }, []);

  const mergeAndSave = async (newResults) => {
    const currentCached = await getBooks() || [];
    if(currentCached.length<31){
        const merged = [...newResults, ...currentCached];
        await saveBooks(merged);
        setBooks(merged)
    } else{
      const last10 = currentCached.slice(20, 29)
      const merged = [...newResults, ...last10];
      await saveBooks(merged)
      setBooks(merged)
    }
    
    
  }

    const fetchBooks = async(name)=>{
      
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
        if (top10.length > 0) {
        await mergeAndSave(top10);
      }
      }catch(err){
        console.log(`Error: ${err}`)
      }
      }

  const debouncedFunction = useCallback(debounce(fetchBooks, 600), [])

   useEffect(() => {
    console.log('books (cached) updated:', books);
  }, [books]);
  

  return (
    <View style={styles.container}>
    <View style={styles.tiContainer}>
      <TextInput placeholder='Search using OpenLibrary...' onChangeText={(e)=>debouncedFunction(e)} style={styles.textInput} placeholderTextColor="black" />
      </View>
      <FlatList
        data={booksList.length ? booksList : books}
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
    color: 'black'
  }
});

export default Home;
