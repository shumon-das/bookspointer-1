import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    tabbarItem: {
        paddingVertical: 6
    },
    tabbarItemIcon: {
        marginHorizontal: 'auto'
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center',
        // backgroundColor: '#085a80',
        marginRight: 10,
    },
    userImgParentElement: { 
        borderWidth: 1, 
        borderColor: 'white', 
        borderRadius: '50%',
        marginHorizontal: 10
    },
    userImg: { 
        width: 30, 
        height: 30, 
        borderRadius: 50, 
        borderWidth: 1,
        borderColor: 'white',
    },
    marginLeft: {
        marginLeft: 10,
    },
    loginBtn: {
        marginHorizontal: 10, 
        backgroundColor: 'lightgray',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
    },
})