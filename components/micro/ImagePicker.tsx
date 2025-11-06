import { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import Icon from 'react-native-vector-icons/FontAwesome';

interface defaultImage {
    defaultImage: string;
    onChange?: (value: string) => void;
}

export default function ImagePickerExample({defaultImage, onChange}: defaultImage) {
  
  const defaultImg = `https://api.bookspointer.com/uploads/${defaultImage}`
  const [image, setImage] = useState<string | null>(defaultImg);
  const [onloadPicker, setOnloadPicker] = useState(true)

  useEffect(() => {
    if (defaultImage && onloadPicker) setImage(`https://api.bookspointer.com/uploads/${defaultImage}`)
  }, [defaultImage])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      if (onChange) {
        setOnloadPicker(false)
        onChange(result.assets[0].uri)
      }
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity onPress={pickImage} style={styles.pickContainer}>
        <View>
            {/* <Icon name='camera' style={styles.icon}></Icon> */}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickContainer: {
    width: 50,
    height: 50,
    // borderWidth: 1,
    borderRadius: 50,
    // backgroundColor: 'gray',
    color: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    opacity: 0.5
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  text: {
    fontSize: 10, 
    color: 'white'
  },
  icon: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  }
});
