import { useUserStore } from "@/app/store/userStore";
import labels from "@/app/utils/labels";
import DetailsHeader from "@/components/micro/book/details/DetailsHeaader"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native"
import { Snackbar } from "react-native-paper";

const BlockUser = () => {
    const {id, username} = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    const userStore = useUserStore()
    
    const [toastVisible, setToastVisible] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    const onPressBlock = async () => {
        const data = await userStore.blockUser(id as string) as any
        if (data.status) {
            setSnackMessage(`${username} ${labels.user.block.userBlockedMessage}`)
            setToastVisible(true)
            setTimeout(() => router.back(), 2000)
        } else {
            setSnackMessage(data.message)
            setToastVisible(true)
        }
    }

    return (<View>
        <View style={{height: '11%', backgroundColor: '#d4151eff'}}>
          <DetailsHeader data={{title: `Block ${username}` as string, author: ''}} />
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '83.5%'}}>
            <View style={{margin: 20}}>
                <Text style={{fontSize: 20}}>
                    {labels.user.block.blockWarningStart} 
                    <Text style={{ fontWeight: 'bold' }}> {username} </Text>
                    {labels.user.block.blockWarningEnd}
                </Text>
            </View>
            <View>
                <Text style={{margin: 20, textAlign: 'center', fontSize: 15}}>{labels.user.block.you} {username} {labels.user.block.blockUserButtonMessage}</Text>
                <TouchableOpacity onPress={onPressBlock} style={{backgroundColor: 'red', margin: 20}}>
                    <Text style={{textAlign: 'center', paddingVertical: 10, color: 'white'}}>Block</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
                  <Text style={{color: 'white'}}>{snackMessage}</Text>
              </Snackbar>
            </View>
        </View>
    </View>)
}

export default BlockUser