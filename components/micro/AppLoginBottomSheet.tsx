import React, { forwardRef, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import labels from '@/app/utils/labels';
import { User } from '../types/User';
import useCacheStore from '@/app/store/search';
import { searchAuthorData } from '@/services/searchapi';
import { useRouter } from 'expo-router';
import Login from '../auth/Login';

interface SearchItem {
    id: number;
    uuid: string;
    title: string;
    fullName: string;
    category: string
}
const AppLoginBottomSheet = forwardRef((author: User, ref: any) => {
  const snapPoints = useMemo(() => ['70%', '90%'], []);

  return (
    <BottomSheet
      ref={ref}
      index={-1} 
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: 'white' }} 
    >
      <BottomSheetView>
         <Login onLoginSuccess={() => ref.current?.close()} />
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    width: '90%',
    borderRadius: 50,
    paddingHorizontal: 20,
    marginHorizontal: 'auto',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  searchItem: {
    backgroundColor: '#fff', 
    marginBottom: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc'
  },
  searchItemText: {
    paddingBottom: 3, 
    fontSize: 15, 
    fontWeight: '600'
  },
  searchItemAuthor: {
    fontSize: 12,
    color: 'gray'
  }
});

export default AppLoginBottomSheet;