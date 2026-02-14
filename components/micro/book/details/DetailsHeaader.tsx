import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

const DetailsHeader = ({data}: {data: {title: string; author: string}}) => {
    const router = useRouter();
    return (<View style={styles.header}>
        <View style={styles.headerContent}>
            <View>
                <TouchableOpacity onPress={() => router.back()} style={{marginLeft: 10}}>
                    <FontAwesome5 name="arrow-left" size={18} color="#d4d4d4" />
            </TouchableOpacity>
            </View>
            <View>
                <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: '#d4d4d4' }}>
                    {data.title}
                </Text>
                <Text style={{ fontSize: 12, color: '#b7f0d4', textAlign: 'center' }}>
                    {data.author}
                </Text>
            </View>
            <View></View>
        </View>
    </View>)
}

export default DetailsHeader

const styles = StyleSheet.create({
    header: {
        height: '80%',
        marginTop: '9%',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center'
    },
})