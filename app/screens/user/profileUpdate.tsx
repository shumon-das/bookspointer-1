import { KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, View, Text } from "react-native";
import { styles } from '@/styles/profileUpdate.styles';
import { useEffect, useState } from "react";
import { labels } from '@/app/utils/labels';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import TextEditor from "@/components/micro/TextEditor";


const ProfileUpdate = () => {
    const [oldUser, setOldUser] = useState<any>(null)

    const [firstName, setFirstName] = useState('')
    const [firstNameEditable, setFirstNameEditable] = useState(false)
    const [lastName, setLastName] = useState('')
    const [lastNameEditable, setLastNameEditable] = useState(false)
    const [email, setEmail] = useState('')
    const [emailEditable, setEmailEditable] = useState(false)
    const [details, setDetails] = useState('')
    const [socials, setSocials] = useState([])
    const [socialsExpanded, setSocialsExpanded] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = await AsyncStorage.getItem('auth-user');
            const user = storedUser ? JSON.parse(storedUser) : null
            if (user) {
                setOldUser(user)
                setFirstName(user.firstName || '')
                setLastName(user.lastName || '')
                setEmail(user.email || '')
                setDetails(user.details.description || '')
                setSocials(user.details.socials)
            }
        }
        loadUserData();
    }, [])

    return (<KeyboardAvoidingView>
        <ScrollView>
          <View style={[styles.container]}>
            {firstNameEditable && (<View style={styles.col}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => setFirstName(value)}
                    value={firstName}
                    placeholder={labels.firstName}
                />
                {oldUser && oldUser.firstName !== firstName && (
                    <TouchableOpacity onPress={() => setFirstNameEditable(false)}>
                        <FontAwesome5 name="check-circle" size={20} color="black" />            
                    </TouchableOpacity>
                )}

                {oldUser && oldUser.firstName === firstName && (
                    <TouchableOpacity style={{marginLeft: 10}} onPress={() => setFirstNameEditable(false)}>
                        <Ionicons name="close-circle-outline" size={24} color="black" />                    
                    </TouchableOpacity>
                )}
            </View>)}
            {!firstNameEditable && (<View style={[styles.col, {flex: 1, alignItems: 'center' }]}>
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
                {oldUser && oldUser.firstName !== firstName && (
                    <TouchableOpacity onPress={() => setFirstNameEditable(false)}>
                        <FontAwesome5 name="check-circle" size={20} color="black" />            
                    </TouchableOpacity>
                )}
                {oldUser && oldUser.firstName === firstName && (
                    <TouchableOpacity style={{marginLeft: 10}} onPress={() => setLastNameEditable(false)}>
                        <Ionicons name="close-circle-outline" size={24} color="black" />                    
                    </TouchableOpacity>
                )}
            </View>)}
            {!lastNameEditable && (<View style={[styles.col, {flex: 1, alignItems: 'center' }]}>
                <Text style={styles.text}>{lastName}</Text>
                <TouchableOpacity onPress={() => setLastNameEditable(true)}>
                    <AntDesign name="edit" size={24} color="black" />
                </TouchableOpacity>
            </View>)}
          </View>

          <View style={[styles.container]}>
            {emailEditable && (<View style={styles.col}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => setEmail(value)}
                    value={email}
                    placeholder={labels.email}
                />
                {oldUser && oldUser.email !== email && (
                    <TouchableOpacity onPress={() => setFirstNameEditable(false)}>
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
            </View>)}
          </View>

          <List.Section>
            <List.Accordion
                title={labels.user.update.description}
                expanded={socialsExpanded}
                onPress={() => setSocialsExpanded(!socialsExpanded)}
            >
                <View style={[styles.col, {flexDirection: 'column'}]}>
                    <View style={{height: 300}}>
                        <TextEditor initialContent={details} onChange={(content: string) => setDetails(content)} />
                    </View>
                    <View style={styles.descriptionSaveButton}>
                        <TouchableOpacity  onPress={() => setEmailEditable(false)}>
                            <Text style={{ color: 'white', textAlign: 'center'}}>Save</Text>                   
                        </TouchableOpacity>
                    </View>
                </View>
            </List.Accordion>

            <List.Accordion title={labels.user.update.socials}>
                <View style={styles.col}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setLastName(value)}
                        value={email}
                        placeholder={labels.user.socialMedia.facebook}
                    />
                    <TouchableOpacity onPress={() => setEmailEditable(false)}>
                        <FontAwesome5 name="check-circle" size={24} color="black" />    
                    </TouchableOpacity>
                </View>

                <View style={styles.col}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setLastName(value)}
                        value={email}
                        placeholder={labels.user.socialMedia.instagram}
                    />
                    <TouchableOpacity onPress={() => setEmailEditable(false)}>
                        <FontAwesome5 name="check-circle" size={24} color="black" />                 
                    </TouchableOpacity>
                </View>

                <View style={styles.col}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => setLastName(value)}
                        value={email}
                        placeholder={labels.user.socialMedia.telegram}
                    />
                    <TouchableOpacity onPress={() => setEmailEditable(false)}>
                        <FontAwesome5 name="check-circle" size={24} color="black" />                    
                    </TouchableOpacity>
                </View>
            </List.Accordion>
          </List.Section>
        </ScrollView>
    </KeyboardAvoidingView>)
}

export default ProfileUpdate;