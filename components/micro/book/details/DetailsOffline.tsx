import labels from "@/app/utils/labels"
import { View, Text } from "react-native"

const DetailsOffline = () => {
    return (<View style={{height: '99%', flex: 1, justifyContent: 'center', alignItems: 'center',marginVertical: 5}}>
        <Text>{labels.detailsScreenOfflineMessage}</Text>
    </View>)
}

export default DetailsOffline