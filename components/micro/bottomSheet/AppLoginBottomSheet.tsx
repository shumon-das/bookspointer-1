import React, { forwardRef, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { User } from '@/components/types/User';
import Login from '@/components/auth/Login';

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