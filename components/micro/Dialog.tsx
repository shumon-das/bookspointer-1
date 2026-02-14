import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import labels from '@/app/utils/labels';
import Modal from 'react-native-modal';

interface ModalProps {
    visible: boolean;
    message: string;
    onChange: (value: any) => void;
}

const Dialog = ({visible, message, onChange}: ModalProps) => {
    const [visibleModal, setVisibleModal] = useState(visible);

    const onPressYes = () => {
        onChange(true)
        setVisibleModal(false)
    }

    return (
        <Modal
            isVisible={visibleModal}
            onBackdropPress={() => setVisibleModal(false)}
            backdropOpacity={0.2}
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
        >
            <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, width: '60%' }}>
                <Text style={{color: 'red', textAlign: 'center', fontSize: 20}}>{message}</Text>
                <View style={{marginTop: 50, width: '100%', marginHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{width: 100}}>
                        <TouchableOpacity style={{backgroundColor: '#36454F', paddingHorizontal: 10, paddingVertical: 5}} onPress={() => setVisibleModal(false)}>
                            <Text style={{color: 'white', width: '100%', textAlign: 'center'}}>{labels.sortWords.no}</Text>
                        </TouchableOpacity>
                        </View>
                
                        <View style={{width: 100}}>
                        <TouchableOpacity style={{backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5}} onPress={onPressYes}>
                            <Text style={{color: 'white', width: '100%', textAlign: 'center'}}>{ labels.delete }</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default Dialog
