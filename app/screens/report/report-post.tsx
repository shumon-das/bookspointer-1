import labels from "@/app/utils/labels";
import DetailsHeader from "@/components/micro/book/details/DetailsHeaader"
import { reportPost } from "@/services/userApi";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { RadioButton, Snackbar } from "react-native-paper";

const ReportPost = () => {
    const {targetPost, targetUser, title} = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    
    const reportOptions = ["Spam","Harassment","Sexual Content","Violence","Copyright Violation","Other"];
    const [selectedReason, setSelectedReason] = useState('');
    const [details, setDetails] = useState('');
    const [toastVisible, setToastVisible] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    const onPressReport = async () => {
        const result = await reportPost(
            parseInt(targetPost as string), 
            parseInt(targetUser as string), 
            selectedReason === "Other" ? details : selectedReason
        )
        setSnackMessage(`${result.message}`)
        setToastVisible(true)
        setTimeout(() => router.back(), 2000)
    }

    return (<View>
        <View style={{height: '11%', backgroundColor: '#d4151eff'}}>
          <DetailsHeader data={{title: `Report ${title}` as string, author: ''}} />
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '83.5%'}}>
            <View style={{margin: 20}}>
                <Text style={{fontSize: 20}}>{labels.user.report.reportingFor}</Text>
                <Text style={{ fontWeight: 'bold' }}> {title} </Text>
            </View>
            <View>
                <RadioButton.Group onValueChange={newValue => setSelectedReason(newValue)} value={selectedReason}>
                    {reportOptions.map((option, i: number) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} key={i}>
                            <RadioButton value={option} color="#2196F3" />
                            <TouchableOpacity onPress={() => setSelectedReason(option)}>
                                <Text style={{ fontSize: 16 }}>{option}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </RadioButton.Group>

                {selectedReason === "Other" && <TextInput 
                    placeholder="Optional: Provide more details..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    style={styles.textArea}
                    onChangeText={setDetails}
                />}

                <TouchableOpacity onPress={onPressReport} style={{backgroundColor: 'red', margin: 20}}>
                    <Text style={{textAlign: 'center', paddingVertical: 10, color: 'white'}}>Report</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
                  <Text>{snackMessage}</Text>
              </Snackbar>
            </View>
        </View>
    </View>)
}

export default ReportPost

const styles = StyleSheet.create({
    radioOption: {},
    textArea: {
        borderWidth: 1,
        margin: 10,
        borderRadius: 10,
        color: 'black'
    },
})