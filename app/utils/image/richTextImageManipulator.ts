import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import labels from "../labels";
import resizeImage from "../imageResize";
import * as ImagePicker from 'expo-image-picker';
import API_CONFIG from "../config";


export const pickImage = async (): Promise<any> => {
    const token = await AsyncStorage.getItem('auth-token')
    if (!token) {
      Alert.alert(labels.sorry, labels.pleaseLoginToContinue);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: false
    });

    if (result.canceled) return;

    try {
      const resizedImage: any = await resizeImage(result.assets[0].uri)
      const formData = new FormData();
      formData.append('file', {
          uri: resizedImage.uri,
          name: result.assets[0].uri.split('/').pop(),
          type: "image/*"
      } as any);

      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/upload-image`, {
          method: 'POST',
          headers: {'Authorization': `Bearer ${token}`},
          body: formData
      })

      const upload = await response.json();
      const finalUrl = `${API_CONFIG.BASE_URL}/uploads/${upload.filename}`;
      return finalUrl;
    } catch (error) {
      console.log("Upload error", error);
      Alert.alert("Error", "Failed to upload image");
    }

  };