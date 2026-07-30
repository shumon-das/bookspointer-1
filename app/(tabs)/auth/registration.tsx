import { labels } from '@/app/utils/labels'
import { User } from '@/components/types/User'
import { login } from '@/services/api'
import { saveNewUser } from '@/services/savesApi'
import { authStyles } from '@/styles/auth.styles'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Stack, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Registration = () => {
    const navigation = useNavigation()
    const title = labels.register
    useLayoutEffect(() => navigation.setOptions({ title }), [navigation, title]);
    const router = useRouter()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [birthDateError, setBirthDateError] = useState(false)
    const [calendarVisible, setCalendarVisible] = useState(false)
    const [yearPickerVisible, setYearPickerVisible] = useState(false)
    const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    const [loading, setLoading] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [saveMessage, setSaveMessage] = useState('')

    
    const handleRegister = async () => {
        const initialUserState = {
            firstName: '',
            lastName: '',
            email: '',
            roles: ['ROLE_USER'],
            phone: '',
            password: '',
            confirmPassword: '',
            birthAt: '',
            isActive: true,
            isDeleted: false,
            series: ['বইসমূহ']
        } as any

        setEmailError(!isValidEmail(email))
        setPasswordError(password !== confirmPassword)
        setBirthDateError(!isValidBirthDate(birthDate))

        if (firstName.trim() && lastName.trim() && isValidEmail(email) && password && password === confirmPassword && isValidBirthDate(birthDate)) {
            setLoading(true)
            try {
                initialUserState.firstName = firstName
                initialUserState.lastName = lastName
                initialUserState.email = email
                initialUserState.password = password
                initialUserState.confirmPassword = confirmPassword
                initialUserState.birthAt = birthDate

                const response = await saveNewUser(initialUserState)
                setToastVisible(true)
                setSaveMessage(response.message)
                if (response.message) {
                    const response: {token: string; user: User} = await login(email, password)
                    if (response) {
                        AsyncStorage.setItem("auth-user", JSON.stringify(response.user))
                        AsyncStorage.setItem("auth-token", response.token)
                    
                        router.push('/')
                    } else {
                        alert("Invalid email or password")
                    }
                }
            } catch (error) {
                console.error(error)
                setSaveMessage('Registration failed. Please try again.')
                setToastVisible(true)
            } finally {
                setLoading(false)
            }
        }
    }

    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };

    const isValidBirthDate = (value: string) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
        const date = new Date(`${value}T00:00:00`)
        const today = new Date()
        return !Number.isNaN(date.getTime()) && date <= today && date.getFullYear() === Number(value.slice(0, 4)) && date.getMonth() + 1 === Number(value.slice(5, 7)) && date.getDate() === Number(value.slice(8, 10))
    }

    const openCalendar = () => {
        if (isValidBirthDate(birthDate)) {
            const [year, month] = birthDate.split('-').map(Number)
            setCalendarMonth(new Date(year, month - 1, 1))
        } else {
            const today = new Date()
            setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1))
        }
        setYearPickerVisible(false)
        setCalendarVisible(true)
    }

    const selectBirthDate = (date: Date) => {
        const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        setBirthDate(formatted)
        setBirthDateError(false)
        setYearPickerVisible(false)
        setCalendarVisible(false)
    }

    const calendarDays = () => {
        const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()
        const numberOfDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
        return [...Array(firstDay).fill(null), ...Array.from({ length: numberOfDays }, (_, index) => index + 1)]
    }

    const isFutureDay = (day: number) => {
        const selected = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        return selected > today
    }

    const currentYear = new Date().getFullYear()
    const birthYears = Array.from({ length: 121 }, (_, index) => currentYear - index)
      

  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 60}
    >
        <ScrollView contentContainerStyle={authStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <Stack.Screen
            options={{
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.replace('/')}>
                  <FontAwesome name="arrow-left" size={20} style={{ marginLeft: 10, marginRight: 20, color: '#4B5945' }} />
                </TouchableOpacity>
              ),
            }}
          />
            <View style={authStyles.header}>
                <Image
                    source={require('../../../assets/images/logo.png')}
                    style={authStyles.logo}
                />
                <Text style={authStyles.title}>
                    {labels.welcomeMessage}
                </Text>
            </View>
            <View style={authStyles.form}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 2 }}>
                    <TextInput
                        style={[authStyles.input, {width: '49%'}]}
                        onChangeText={(value: string) => setFirstName(value)}
                        value={firstName}
                        placeholder={labels.firstName}
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        style={[authStyles.input, {width: '49%'}]}
                        onChangeText={(value: string) => setLastName(value)}
                        value={lastName}
                        placeholder={labels.lastName}
                        placeholderTextColor="#999"
                    />
                </View>
                <TextInput
                    style={authStyles.input}
                    onChangeText={(value: string) => {
                        if (isValidEmail(value)) {
                            setEmailError(false)
                        }
                        setEmail(value)
                    }}
                    value={email}
                    placeholder="email"
                    placeholderTextColor="#999"
                />
                {emailError ? <Text style={authStyles.error}>{labels.invalidEmail}</Text> : null}
                <Pressable onPress={openCalendar}>
                    <TextInput
                        style={authStyles.input}
                        value={birthDate}
                        placeholder={labels.birthDate}
                        placeholderTextColor="#999"
                        editable={false}
                        pointerEvents="none"
                    />
                </Pressable>
                {birthDateError ? <Text style={authStyles.error}>Enter a valid birth date (YYYY-MM-DD).</Text> : null}
                <TextInput
                    style={authStyles.input}
                    onChangeText={(value) => setPassword(value)}
                    value={password}
                    placeholder="password"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                />
                <TextInput
                    style={authStyles.input}
                    onChangeText={(value) => {
                        setPasswordError(password !== value)
                        setConfirmPassword(value)
                    }}
                    value={confirmPassword}
                    placeholder="confirm password"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                />
                {passwordError ? <Text style={authStyles.error}>{labels.passswordConfirmNotMatch}</Text> : null}
    
                <TouchableOpacity style={[authStyles.button, loading && authStyles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
                    {loading && <ActivityIndicator color="#fff" />}
                    <Text style={authStyles.buttonText}>{labels.register}</Text>
                </TouchableOpacity>
                <View style={authStyles.accountPrompt}>
                    <Text style={authStyles.accountPromptText}>{labels.alreadyAccount}</Text>
                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                        <Text style={authStyles.accountLink}>{labels.signIn}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
                {saveMessage}
            </Snackbar>
            <View style={{height: 100}}></View>
        </ScrollView>
        <Modal visible={calendarVisible} transparent animationType="fade" onRequestClose={() => setCalendarVisible(false)}>
            <Pressable style={authStyles.calendarBackdrop} onPress={() => setCalendarVisible(false)}>
                <Pressable style={authStyles.calendarCard} onPress={(event) => event.stopPropagation()}>
                    <View style={authStyles.calendarHeader}>
                        <TouchableOpacity
                            style={authStyles.calendarArrow}
                            onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                        >
                            <Text>‹</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={authStyles.calendarYearButton} onPress={() => setYearPickerVisible((visible) => !visible)}>
                            <Text style={authStyles.calendarMonth}>
                                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}⌄
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={authStyles.calendarArrow}
                            onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                        >
                            <Text>›</Text>
                        </TouchableOpacity>
                    </View>
                    {yearPickerVisible ? (
                        <ScrollView style={authStyles.calendarYearGrid} contentContainerStyle={authStyles.calendarGrid}>
                            {birthYears.map((year) => {
                                const selected = calendarMonth.getFullYear() === year
                                return (
                                    <TouchableOpacity
                                        key={year}
                                        style={[authStyles.calendarYearOption, selected && authStyles.calendarYearOptionSelected]}
                                        onPress={() => {
                                            const month = year === currentYear && calendarMonth.getMonth() > new Date().getMonth() ? new Date().getMonth() : calendarMonth.getMonth()
                                            setCalendarMonth(new Date(year, month, 1))
                                            setYearPickerVisible(false)
                                        }}
                                    >
                                        <Text style={[authStyles.calendarYearText, selected && authStyles.calendarYearTextSelected]}>{year}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    ) : (
                        <>
                            <View style={authStyles.calendarWeekdays}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <Text key={day} style={authStyles.calendarWeekday}>{day}</Text>
                                ))}
                            </View>
                            <View style={authStyles.calendarGrid}>
                                {calendarDays().map((day, index) => {
                                    if (!day) return <View key={`empty-${index}`} style={authStyles.calendarDay} />
                                    const dateValue = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                    const selected = birthDate === dateValue
                                    const disabled = isFutureDay(day)
                                    return (
                                        <TouchableOpacity
                                            key={dateValue}
                                            style={authStyles.calendarDay}
                                            onPress={() => selectBirthDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day))}
                                            disabled={disabled}
                                        >
                                            <View style={selected ? authStyles.calendarDaySelected : undefined}>
                                                <Text style={[authStyles.calendarDayText, selected && authStyles.calendarDaySelectedText, disabled && authStyles.calendarDayDisabled]}>{day}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </>
                    )}
                    <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                        <Text style={authStyles.calendarCancel}>Cancel</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    </KeyboardAvoidingView>
  )
}

export default Registration
