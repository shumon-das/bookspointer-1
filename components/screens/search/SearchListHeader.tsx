import { searchSubjectButtonStyle } from '@/helper/search'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const SearchListHeader = ({ subject, onChangeSubject }: { subject: string, onChangeSubject: (subject: string) => void }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10, marginLeft: 10 }}>
            <TouchableOpacity style={searchSubjectButtonStyle(subject, 'all')} onPress={() => onChangeSubject('all')}>
                <Text style={{ textAlign: 'center', color: subject === 'all' ? '#fff' : '#000' }}>সব</Text>
            </TouchableOpacity>
            <TouchableOpacity style={searchSubjectButtonStyle(subject, 'books')} onPress={() => onChangeSubject('books')}>
                <Text style={{ textAlign: 'center', color: subject === 'books' ? '#fff' : '#000' }}>বই</Text>
            </TouchableOpacity>
            <TouchableOpacity style={searchSubjectButtonStyle(subject, 'authors')} onPress={() => onChangeSubject('authors')}>
                <Text style={{ textAlign: 'center', color: subject === 'authors' ? '#fff' : '#000' }}>লেখক</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SearchListHeader