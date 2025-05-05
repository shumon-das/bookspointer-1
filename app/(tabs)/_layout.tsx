import { useAuthStore } from '@/app/store/auth';
import { styles } from '@/styles/bottomNav.styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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
  const user = useAuthStore((state) => state.user)
  const router = useRouter()

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
            headerRight: () => (
                <View style={styles.header}>
                    <TouchableOpacity  onPress={() => router.push('/book/search')}>
                        <FontAwesome name="search"  style={styles.marginLeft} size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => router.push('/book/writeNewBook')}>
                        <Text style={styles.marginLeft}>{labels.writeBook}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => router.push(user ? '/profile' : '/auth/login')} style={styles.loginBtn}>
                        {user 
                            ? <Image source={{uri: `https://api.bookspointer.com/uploads/${user?.image}`}} style={styles.userImg} />
                            : <Text>{labels.signIn}</Text>
                            
                        }
                    </TouchableOpacity>
                </View>
            ),
        }}
    >
        <Tabs.Screen
            name="index"
            options={{ 
                title: labels.booksPointer,
                tabBarIcon: ({focused}) => (
                   <TabIcon
                    focused={focused}
                    icon="home"
                    title={labels.home}
                   />
                )
            }}
        />
        <Tabs.Screen
            name="authors"
            options={{ 
                title: labels.authors,
                tabBarIcon: ({focused}) => (
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
                tabBarIcon: ({focused}) => (
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
                tabBarIcon: ({focused}) => (
                    <TabIcon
                        focused={focused}
                        icon="download"
                        title={labels.download}
                    />
                )
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                href: null 
            }}
        />
    </Tabs>
  )
}

export default _layout
