import { styles } from '@/styles/bottomNav.styles';
import HomeScreenHeader from '@/components/micro/book/home/HomeScreenHeader';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useLabels } from '../utils/labels';

const TabIcon = ({focused, icon, title}: any) => {            
    return (
        <View style={styles.tabbarItem}>
            <FontAwesome name={icon} size={20} color={focused ? 'white' : '#60A5FA'} style={styles.tabbarItemIcon} />
            <Text style={{color: 'white', width: '25%'}}>{title}</Text>
        </View>
    )
}

const _layout = () => {
  const labels = useLabels();

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
            sceneStyle: {
                backgroundColor: '#f9f0eb',
            },
        }}
    >
        <Tabs.Screen
            name="index"
            options={{ 
                headerShown: true,
                header: () => (
                    <View style={{ height: 80, backgroundColor: '#085a80', justifyContent: 'flex-end' }}>
                        <HomeScreenHeader />
                    </View>
                ),
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
