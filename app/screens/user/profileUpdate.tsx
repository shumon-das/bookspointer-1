import { useTempStore } from "@/app/store/temporaryStore";
import { useUserStore } from "@/app/store/userStore";
import { labels } from '@/app/utils/labels';
import HtmlContent from "@/components/micro/HtmlContent";
import { updateUserInfo } from "@/services/api";
import { styles } from '@/styles/profileUpdate.styles';
import { authStyles } from '@/styles/auth.styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    const [birthAt, setBirthAt] = useState('')
    const [birthAtError, setBirthAtError] = useState(false)
    const [calendarVisible, setCalendarVisible] = useState(false)
    const [yearPickerVisible, setYearPickerVisible] = useState(false)
    const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    const [emailEditable, setEmailEditable] = useState(false)
    const [description, setDescription] = useState('')
    const [socials, setSocials] = useState([{ facebook: "" }, { instagram: "" }, { telegram: "" }])
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
                setBirthAt(authUser.birthAt || authUser.details?.birthAt || '')
                setDescription(authUser.details.description || '')
                setSocials(authUser.details.socials ?? [{ facebook: '' }, { instagram: '' }, { telegram: '' }])
            }
        }
        loadUserData();
    }, [])

    const updateUser = async () => {
        if (birthAt && !isValidBirthDate(birthAt)) {
            setBirthAtError(true)
            return
        }
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
        user.birthAt = birthAt;
        user.details.description = description;
        user.details.birthAt = birthAt;
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

    const isValidBirthDate = (value: string) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
        const date = new Date(`${value}T00:00:00`)
        const today = new Date()
        return !Number.isNaN(date.getTime()) && date <= today && date.getFullYear() === Number(value.slice(0, 4)) && date.getMonth() + 1 === Number(value.slice(5, 7)) && date.getDate() === Number(value.slice(8, 10))
    }

    const openCalendar = () => {
        if (isValidBirthDate(birthAt)) {
            const [year, month] = birthAt.split('-').map(Number)
            setCalendarMonth(new Date(year, month - 1, 1))
        } else {
            const today = new Date()
            setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1))
        }
        setYearPickerVisible(false)
        setCalendarVisible(true)
    }

    const selectBirthDate = (date: Date) => {
        setBirthAt(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`)
        setBirthAtError(false)
        setYearPickerVisible(false)
        setCalendarVisible(false)
    }

    const calendarDays = () => {
        const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()
        const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
        return [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
    }

    const isFutureDay = (day: number) => {
        const selected = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        return selected > today
    }

    const currentYear = new Date().getFullYear()
    const birthYears = Array.from({ length: 121 }, (_, index) => currentYear - index)

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

            <View style={[styles.container, {marginTop: 5}]}>
                <Pressable onPress={openCalendar}>
                    <TextInput
                        style={authStyles.input}
                        value={birthAt}
                        placeholder={labels.birthDate}
                        placeholderTextColor="#999"
                        editable={false}
                        pointerEvents="none"
                    />
                </Pressable>
                {birthAtError && <Text style={authStyles.error}>Enter a valid birth date (YYYY-MM-DD).</Text>}
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
        <Modal visible={calendarVisible} transparent animationType="fade" onRequestClose={() => setCalendarVisible(false)}>
            <Pressable style={authStyles.calendarBackdrop} onPress={() => setCalendarVisible(false)}>
                <Pressable style={authStyles.calendarCard} onPress={(event) => event.stopPropagation()}>
                    <View style={authStyles.calendarHeader}>
                        <TouchableOpacity style={authStyles.calendarArrow} onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}><Text>‹</Text></TouchableOpacity>
                        <TouchableOpacity style={authStyles.calendarYearButton} onPress={() => setYearPickerVisible((visible) => !visible)}>
                            <Text style={authStyles.calendarMonth}>{calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}⌄</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={authStyles.calendarArrow} onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}><Text>›</Text></TouchableOpacity>
                    </View>
                    {yearPickerVisible ? (
                        <ScrollView style={authStyles.calendarYearGrid} contentContainerStyle={authStyles.calendarGrid}>
                            {birthYears.map((year) => {
                                const selected = calendarMonth.getFullYear() === year
                                return <TouchableOpacity key={year} style={[authStyles.calendarYearOption, selected && authStyles.calendarYearOptionSelected]} onPress={() => {
                                    const month = year === currentYear && calendarMonth.getMonth() > new Date().getMonth() ? new Date().getMonth() : calendarMonth.getMonth()
                                    setCalendarMonth(new Date(year, month, 1))
                                    setYearPickerVisible(false)
                                }}>
                                    <Text style={[authStyles.calendarYearText, selected && authStyles.calendarYearTextSelected]}>{year}</Text>
                                </TouchableOpacity>
                            })}
                        </ScrollView>
                    ) : (
                        <>
                            <View style={authStyles.calendarWeekdays}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <Text key={day} style={authStyles.calendarWeekday}>{day}</Text>)}
                            </View>
                            <View style={authStyles.calendarGrid}>
                                {calendarDays().map((day, index) => {
                                    if (!day) return <View key={`empty-${index}`} style={authStyles.calendarDay} />
                                    const dateValue = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                    const selected = birthAt === dateValue
                                    const disabled = isFutureDay(day)
                                    return <TouchableOpacity key={dateValue} style={authStyles.calendarDay} onPress={() => selectBirthDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day))} disabled={disabled}>
                                        <View style={selected ? authStyles.calendarDaySelected : undefined}>
                                            <Text style={[authStyles.calendarDayText, selected && authStyles.calendarDaySelectedText, disabled && authStyles.calendarDayDisabled]}>{day}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                        </>
                    )}
                    <TouchableOpacity onPress={() => setCalendarVisible(false)}><Text style={authStyles.calendarCancel}>Cancel</Text></TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
        <Snackbar visible={showSnackBar} onDismiss={() => setShowSnakBar(false)} duration={3000}>{snackBarMessage}</Snackbar>
    </KeyboardAvoidingView>)
}

export default ProfileUpdate;
