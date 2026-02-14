import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

type ResizeImageResult = {
  uri: string;
  width: number;
  height: number;
};

export const resizeImage = async (uri: string, maxWidth = 800): Promise<ResizeImageResult> => {
  try {
    // Get image info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) throw new Error('File does not exist');

    // Resize image
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }], // maintain aspect ratio
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG } // you can change format if needed
    );

    return manipResult;
  } catch (err) {
    throw err;
  }
};

export default resizeImage

