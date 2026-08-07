import HomeScreenHeader from '@/components/micro/book/home/HomeScreenHeader';
import AppBottomNavigation from '@/components/navigation/AppBottomNavigation';
import { Tabs } from 'expo-router';
import React from 'react';
import { useLabels } from '../utils/labels';

const TabsLayout = () => {
  const labels = useLabels();

  return (
    <Tabs
        tabBar={(props) => <AppBottomNavigation {...props} />}
    >
        <Tabs.Screen
            name="index"
            options={{ 
                headerShown: true,
                header: () => <HomeScreenHeader />,
            }}
        />
        <Tabs.Screen
            name="authors"
            options={{ 
                title: labels.authors,
            }}
        />
        <Tabs.Screen
            name="write-book"
            options={{
                title: labels.writeBook,
            }}
        />
        <Tabs.Screen
            name="category"
            options={{ 
                title: labels.categories,
            }}
        />
        <Tabs.Screen
            name="download"
            options={{
                title: labels.download,
            }}
        />
        <Tabs.Screen name="book/categoryBooks" options={{ href: null }} />
        <Tabs.Screen name="auth/login" options={{ href: null }} />
        <Tabs.Screen name="auth/registration" options={{ href: null }} />
        <Tabs.Screen name="search" options={{ href: null }} />
    </Tabs>
  )
}

export default TabsLayout
