import { useTempStore } from "@/app/store/temporaryStore";
import { useUserStore } from "@/app/store/userStore";
import { labels } from '@/app/utils/labels';
import HtmlContent from "@/components/micro/HtmlContent";
import { updateUserInfo } from "@/services/api";
import { styles } from '@/styles/profileUpdate.styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Snackbar } from 'react-native-paper';

const ProfileUpdate = () => {
    const navigation = useNavigation()
    useEffect(() => navigation.setOptions({ title: labels.editProfile }), []);

    const router = useRouter()
    const [oldUser, setOldUser] = useState<any>(null)

    const [firstName, setFirstName] = useState('')
    const [firstNameEditable, setFirstNameEditable] = useState(false)
    const [lastName, setLastName] = useState('')
    const [lastNameEditable, setLastNameEditable] = useState(false)
    const [email, setEmail] = useState('')
    const [emailEditable, setEmailEditable] = useState(false)
    const [description, setDescription] = useState('')
    const [socials, setSocials] = useState([{ facebook: "" }, { instagram: "" }, { telegram: "" }])
    const [socialsExpanded, setSocialsExpanded] = useState(false);
    const [showSnackBar, setShowSnakBar] = useState(false);
    const [snackBarMessage, setSnakBarMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setDescription(useTempStore.getState().bookContent)
        }, [useTempStore.getState().bookContent])
    )

    useEffect(() => {
        const loadUserData = async () => {
            let authUser = useUserStore.getState().authUser;
            if (!authUser) {
                await useUserStore.getState().fetchAuthUserFromDb();
                authUser = useUserStore.getState().authUser;
            }
            if (authUser) {
                useTempStore.getState().setBookContent(authUser.details.description)
                setOldUser(authUser)
                setFirstName(authUser.firstName || '')
                setLastName(authUser.lastName || '')
                setEmail(authUser.email || '')
                setDescription(authUser.details.description || '')
                setSocials(authUser.details.socials ?? [{ facebook: '' }, { instagram: '' }, { telegram: '' }])
            }
        }
        loadUserData();
    }, [])

    const updateUser = async () => {
        const token = await AsyncStorage.getItem('auth-token')
        if (!token) {
            alert(labels.pleaseLoginToContinue)
            return;
        }

        setIsUpdating(true);
        let user = oldUser;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.details.description = description;
        user.details.socials = socials;

        const response = await updateUserInfo(user, token)
        if (response.status) {
            useUserStore.getState().setAuthUser(response.user)
            setOldUser(response.user)
            setFirstNameEditable(false)
            setLastNameEditable(false)
            setEmailEditable(false)
            setSnakBarMessage(response.message)
            setShowSnakBar(true)
            await AsyncStorage.setItem('auth-user', JSON.stringify(response.user))
        }
        setIsUpdating(false);
    }

    return (<KeyboardAvoidingView>
        <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
            <View style={[styles.container]}>
                {firstNameEditable && (<View style={styles.col}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setFirstName(value)}
                        value={firstName}
                        placeholder={labels.firstName}
                    />
                    {oldUser && oldUser.firstName !== firstName && (
                        <TouchableOpacity onPress={updateUser}>
                            <FontAwesome5 name="check-circle" size={20} color="black" />
                        </TouchableOpacity>
                    )}

                    {oldUser && oldUser.firstName === firstName && (
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setFirstNameEditable(false)}>
                            <Ionicons name="close-circle-outline" size={24} color="black" />
                        </TouchableOpacity>
                    )}
                </View>)}
                {!firstNameEditable && (<View style={[styles.col, { flex: 1, alignItems: 'center' }]}>
                    <Text style={styles.text}>{firstName}</Text>
                    <TouchableOpacity onPress={() => setFirstNameEditable(true)}>
                        <AntDesign name="edit" size={24} color="black" />
                    </TouchableOpacity>
                </View>)}
            </View>

            <View style={[styles.container]}>
                {lastNameEditable && (<View style={styles.col}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setLastName(value)}
                        value={lastName}
                        placeholder={labels.lastName}
                    />
                    {oldUser && oldUser.lastName !== lastName && (
                        <TouchableOpacity onPress={updateUser}>
                            <FontAwesome5 name="check-circle" size={20} color="black" />
                        </TouchableOpacity>
                    )}
                    {oldUser && oldUser.lastName === lastName && (
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setLastNameEditable(false)}>
                            <Ionicons name="close-circle-outline" size={24} color="black" />
                        </TouchableOpacity>
                    )}
                </View>)}
                {!lastNameEditable && (<View style={[styles.col, { flex: 1, alignItems: 'center' }]}>
                    <Text style={styles.text}>{lastName}</Text>
                    <TouchableOpacity onPress={() => setLastNameEditable(true)}>
                        <AntDesign name="edit" size={24} color="black" />
                    </TouchableOpacity>
                </View>)}
            </View>

            <View style={[styles.container]}>
                {/* {emailEditable && (<View style={styles.col}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => setEmail(value)}
                    value={email}
                    placeholder={labels.email}
                />
                {oldUser && oldUser.email !== email && (
                    <TouchableOpacity onPress={updateUser}>
                        <FontAwesome5 name="check-circle" size={20} color="black" />            
                    </TouchableOpacity>
                )}
                {oldUser && oldUser.email === email && (
                    <TouchableOpacity style={{marginLeft: 10}} onPress={() => setEmailEditable(false)}>
                        <Ionicons name="close-circle-outline" size={24} color="black" />                    
                    </TouchableOpacity>
                )}
            </View>)} 
            {!emailEditable && (<View style={[styles.col, {flex: 1, alignItems: 'center' }]}>
                <Text style={styles.text}>{email}</Text>
                <TouchableOpacity onPress={() => setEmailEditable(true)}>
                    <AntDesign name="edit" size={24} color="black" />
                </TouchableOpacity>
            </View>)}*/}
                <View style={[styles.col, { flex: 1, alignItems: 'center' }]}>
                    <Text style={styles.text}>{email}</Text>
                </View>
            </View>

            <View style={[styles.col, { flexDirection: 'column', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }]}>
                <View style={{ width: '100%', height: 300, marginBottom: 30 }}>
                    <TouchableOpacity
                        style={{ height: 300, borderWidth: 1, borderColor: 'gray', borderRadius: 5, margin: 10 }}
                        onPress={() => router.push({
                            pathname: '/screens/book/content-editor',
                            params: { content: `${description}` }
                        })}
                    >
                        {useTempStore.getState().bookContent.length > 0
                            ? <HtmlContent content={description} />
                            : <Text style={{ padding: 10, }}>{labels.startWriting}</Text>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.descriptionSaveButton}>
                    <TouchableOpacity onPress={updateUser} disabled={isUpdating}>
                        {isUpdating ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* <List.Section>
            <List.Accordion
                title={labels.user.update.description}
                expanded={socialsExpanded}
                onPress={() => setSocialsExpanded(!socialsExpanded)}
            >
                <View style={[styles.col, {flexDirection: 'column'}]}>
                    <View style={{height: 300}}>
                        <TextEditor initialContent={description} onChange={(content: string) => setDescription(content)} />
                    </View>
                    <View style={styles.descriptionSaveButton}>
                        <TouchableOpacity  onPress={updateUser}>
                            <Text style={{ color: 'white', textAlign: 'center'}}>Save</Text>                   
                        </TouchableOpacity>
                    </View>
                </View>
            </List.Accordion>

            <List.Accordion title={labels.user.update.socials}>
                <View style={styles.col}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value: string) => {
                            const newSocials = [...socials];
                            newSocials[0] = { ...newSocials[0], facebook: value } as any;
                            setSocials(newSocials)
                        }}
                        value={socials[0].facebook}
                        placeholder={labels.user.socialMedia.facebook}
                    />
                    <TouchableOpacity onPress={updateUser}>
                        <FontAwesome5 name="check-circle" size={24} color="black" />    
                    </TouchableOpacity>
                </View>

                <View style={styles.col}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value: string) => {
                            const newSocials = [...socials];
                            newSocials[1] = { ...newSocials[1], instagram: value } as any;
                            setSocials(newSocials)
                        }}
                        value={socials[1].instagram}
                        placeholder={labels.user.socialMedia.instagram}
                    />
                    <TouchableOpacity onPress={updateUser}>
                        <FontAwesome5 name="check-circle" size={24} color="black" />                 
                    </TouchableOpacity>
                </View>

                <View style={styles.col}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value: string) => {
                            const newSocials = [...socials];
                            newSocials[2] = { ...newSocials[2], facebook: value } as any;
                            setSocials(newSocials)
                        }}
                        value={socials[2].telegram}
                        placeholder={labels.user.socialMedia.telegram}
                    />
                    <TouchableOpacity onPress={updateUser}>
                        <FontAwesome5 name="check-circle" size={24} color="black" />                    
                    </TouchableOpacity>
                </View>
            </List.Accordion>
          </List.Section> */}

            <View style={{ height: 300 }}></View>
        </ScrollView>
        <Snackbar visible={showSnackBar} onDismiss={() => setShowSnakBar(false)} duration={3000}>{snackBarMessage}</Snackbar>
    </KeyboardAvoidingView>)
}

export default ProfileUpdate;