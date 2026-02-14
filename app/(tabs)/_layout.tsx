import { styles } from '@/styles/bottomNav.styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { labels } from '../utils/labels';

const TabIcon = ({focused, icon, title}: any) => {            
    return (
        <View style={styles.tabbarItem}>
            <FontAwesome name={icon} size={20} color={focused ? 'white' : '#60A5FA'} style={styles.tabbarItemIcon} />
            <Text style={{color: 'white', width: '25%'}}>{title}</Text>
        </View>
    )
}

const _layout = () => {
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
                width: '100%',
                height: '100%',
            },
            tabBarStyle: {
                backgroundColor: '#085a80',
            },
        }}
    >
        <Tabs.Screen
            name="index"
            options={{ 
                // title: labels.booksPointer,
                tabBarIcon: ({ focused }: { focused: boolean }) => (
                   <TabIcon
                    focused={focused}
                    icon="home"
                    title={labels.home}
                   />
                ), 
            }}
        />
        <Tabs.Screen
            name="authors"
            options={{ 
                title: labels.authors,
                tabBarIcon: ({ focused }: { focused: boolean }) => (
                    <TabIcon
                        focused={focused}
                        icon="users"
                        title={labels.authors}
                    />
                ) 
            }}
        />
        <Tabs.Screen
            name="category"
            options={{ 
                title: labels.categories,
                tabBarIcon: ({ focused }: { focused: boolean }) => (
                    <TabIcon
                        focused={focused}
                        icon="list"
                        title={labels.categories}
                    />
                ) 
            }}
        />
        <Tabs.Screen
            name="download"
            options={{
                // href: null 
                title: labels.download,
                tabBarIcon: ({ focused }: { focused: boolean }) => (
                    <TabIcon
                        focused={focused}
                        icon="download"
                        title={labels.download}
                    />
                )
            }}
        />
        <Tabs.Screen name="book/categoryBooks" options={{ href: null }} />
        <Tabs.Screen name="auth/login" options={{ href: null }} />
        <Tabs.Screen name="auth/registration" options={{ href: null }} />
        <Tabs.Screen name="search" options={{ href: null }} />
    </Tabs>
  )
}

export default _layout
