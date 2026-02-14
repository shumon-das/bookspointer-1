import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const SECRET_KEY_NAME = 'book_secret_2026';

export const initSecretKey = async () => {
  const existing = await SecureStore.getItemAsync(SECRET_KEY_NAME);

  if (existing) {
    return;
  }

  // generate random per-device key
  const randomKey = Crypto.randomUUID();

  await SecureStore.setItemAsync(SECRET_KEY_NAME, randomKey);
};
