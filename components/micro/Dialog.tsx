import { View, Text, Modal, StyleSheet, Alert, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

interface ModalProps {
    visible: boolean;
}

const Dialog = ({visible}: ModalProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    setModalVisible(visible)
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.centeredView}>
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <Text style={styles.modalText}>Hello World!</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable>
                    </View>
                </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default Dialog

const styles = StyleSheet.create({
    centeredView: {},
    modalView: {},
    modalText: {},
    button: {},
    buttonClose: {},
    textStyle: {},
    buttonOpen: {}
})