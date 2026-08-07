import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type FeedBookAction = { name?: string; label: string; icon?: React.ReactElement };

const FeedBookActions = ({ bookTitle, actions, onAction }: { bookTitle: string; actions: FeedBookAction[]; onAction: (action: FeedBookAction) => void }) => {
    const [visible, setVisible] = useState(false);

    const selectAction = (action: FeedBookAction) => {
        setVisible(false);
        onAction(action);
    };

    return <>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Book actions" activeOpacity={0.72} onPress={() => setVisible(true)} style={styles.trigger}>
            <MaterialIcons name="more-horiz" size={22} color="#526173" />
        </TouchableOpacity>

        <Modal transparent visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
                <View style={styles.sheet}>
                    <View style={styles.handle} />
                    <View style={styles.header}>
                        <Text numberOfLines={2} style={styles.title}>{bookTitle}</Text>
                        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close" hitSlop={8} onPress={() => setVisible(false)} style={styles.closeButton}>
                            <MaterialIcons name="close" size={20} color="#526173" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.actionList}>
                        {actions.map((action, index) => {
                            const destructive = ['report', 'block', 'delete'].includes(action.name ?? '');
                            return <TouchableOpacity key={`${action.name ?? action.label}-${index}`} activeOpacity={0.78} style={[styles.action, destructive && styles.destructiveAction]} onPress={() => selectAction(action)}>
                                <View style={[styles.actionIcon, destructive && styles.destructiveIcon]}>{action.icon ?? <MaterialIcons name="more-horiz" size={20} color={destructive ? '#c24131' : '#526173'} />}</View>
                                <Text style={[styles.actionText, destructive && styles.destructiveText]}>{action.label}</Text>
                                <MaterialIcons name="chevron-right" size={20} color={destructive ? '#d7978d' : '#a3adb9'} />
                            </TouchableOpacity>;
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    </>;
};

export default FeedBookActions;

const styles = StyleSheet.create({
    trigger: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#f2f4f7', borderWidth: 1, borderColor: '#e4e8ee' },
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(20, 29, 40, 0.32)' },
    sheet: { marginHorizontal: 10, marginBottom: 12, borderRadius: 24, backgroundColor: '#fff', padding: 14, shadowColor: '#1f2937', shadowOpacity: 0.24, shadowOffset: { width: 0, height: 8 }, shadowRadius: 18, elevation: 12 },
    handle: { alignSelf: 'center', width: 42, height: 4, borderRadius: 99, marginBottom: 13, backgroundColor: '#d9dee5' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 13, paddingHorizontal: 3 },
    title: { flex: 1, color: '#253041', fontSize: 16, lineHeight: 22, fontWeight: '800' },
    closeButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', marginLeft: 12, borderRadius: 17, backgroundColor: '#f2f4f7' },
    actionList: { gap: 8 },
    action: { minHeight: 58, flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 12, backgroundColor: '#f6f8fb' },
    destructiveAction: { backgroundColor: '#fff6f5' },
    actionIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 11, borderRadius: 12, backgroundColor: '#e8edf4' },
    destructiveIcon: { backgroundColor: '#fee6e2' },
    actionText: { flex: 1, color: '#253041', fontSize: 16, fontWeight: '800' },
    destructiveText: { color: '#c24131' },
});
