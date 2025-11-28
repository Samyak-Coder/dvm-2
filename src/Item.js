import { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Button
} from 'react-native';  
import { useNavigation } from '@react-navigation/native'
import Details from './Details'
import {useStore} from './store'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {saveBooks, getBooks} from './cache_storage'

const Item = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const navigation = useNavigation()
  const setSelected = useStore((s) => s.setSelected)

  const mergeAndSave = async (itemN) => {
    setLiked(!liked)
    const newResults = Array.isArray(itemN) ? itemN : [itemN];
    const currentCached = await getBooks() || [];
  console.log("newres", currentCached)

    const merged = [...newResults, ...currentCached];
    await saveBooks(merged);
  
  }

  const toggleList = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(anim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const heightInterpolate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const toDetails = (item) =>{
    setSelected(item)
    navigation.navigate('Details')
  }

  return (
      <TouchableOpacity style={styles.item} onPress={toggleList} activeOpacity={0.9}>
        <View style={styles.btnContainer}>
          <View style={styles.innerBtnCtn}>
            <Image
              source={{
                uri: item.cover
                  ? `https://covers.openlibrary.org/b/olid/${item.cover}-M.jpg`
                  : 'https://placehold.co/60x90.png',
              }}
              style={{ width: 60, height: 90 }}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>

          <Animated.View
            style={{
              height: heightInterpolate,
              
              overflow: 'hidden',
            }}
            pointerEvents={expanded ? 'auto' : 'none'} //mouse pointer ke liye
          >
            <View
              style={styles.hiddenTxt}
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height; 
                if (contentHeight === 0 && h > 0) setContentHeight(h);
              }}
            >
            <View style={{display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent: 'space-between' }}>
            <View>
              <Text> Author: {item.author}</Text>
              <Text> Publish Year: {item.publish_year}</Text>
            </View>
            <TouchableOpacity onPress={()=>mergeAndSave(item)}>
              <FontAwesome name={liked ? "heart" : "heart-o"} size={24} color="black" style={{padding: 10}}/>
            </TouchableOpacity>
            </View>
            <View style={{display: 'flex', alignItems: 'center', margin: 10,}}>
              <Button title="More!!" onPress={()=>toDetails(item)} color ="#58c4dc" style={{ width: '60%', color: 'black'}} titleStyle={{color: 'black'}}/>
            </View>
            </View>
          </Animated.View>
          
          {contentHeight === 0 && (
        <View
          // pointerEvents="none"
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h && h > 0) setContentHeight(h);
          }}
        >
          <View style={styles.hiddenTxt}>
            <Text>Author: {item.author}</Text>
            <Text>Publish Year: {item.publish_year}</Text>
            <View style={{display: 'flex', alignItems: 'center', margin: 10,}}>
            <Button title="More!!" onPress={()=>toDetails(item)}/>
            </View>
          </View>
        </View>
      )}
        </View>
      </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  item: {
    margin: 20,
  },
  title: {
    display: 'flex',
    flex: 1,
    fontSize: 23,
    alignItems: 'center',
    margin: 10,
  },
  btnContainer: {
    overflow: 'hidden',
    borderRadius: 10,
    boxShadow: '5px 5px 5px rgba(0,0,0,0.3)',
  },
  innerBtnCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, 
  },
  hiddenTxt: {
    display: 'flex',
    marginLeft: 10,
    fontSize: 15,
    paddingVertical: 8,
  },
});
