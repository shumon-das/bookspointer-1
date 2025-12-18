import labels from '@/app/utils/labels';
import { useEffect, useState } from 'react';
import { TabBar, TabView } from 'react-native-tab-view';
import UserLibrary from '../UserLibrary';
import UserSeries from '../UserSeries';
import { useAuthStore } from '@/app/store/auth';
import UserBrowsingHistory from '../UserBrowsingHistory';
import { StyleSheet } from 'react-native';

const UserProfileTabView = ({onSelectSeries}: {onSelectSeries: (value: any) => void}) => {
    const { user: author, authenticatedUser } = useAuthStore();
    const [index, setIndex] = useState(0);
    const [loggedInUser, setLoggedInUser] = useState(authenticatedUser);

    useEffect(() => {
        setLoggedInUser(authenticatedUser);
    }, [authenticatedUser]);

    const [routes] = useState(null === loggedInUser ? [{ key: 'series', title: labels.books }] : [
        { key: 'series', title: labels.books },
        { key: 'library', title: labels.userBookTypes.library },
        { key: 'history', title: labels.userBookTypes.history },
    ]);

    const renderScene = ({ route }: any) => {
        switch (route.key) {
        case 'library':
            return author ? <UserLibrary authorId={author.id} /> : <></>;
        case 'history':
            return author ? <UserBrowsingHistory /> : <></>;    
            default:
                return author ? <UserSeries series={author.series} author={author} onChooseSeries={(seriesName) => onSelectSeries(seriesName)} /> : <></>;
        }
    };

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            // 1. Line under the active tab
            indicatorStyle={styles.indicator} 
            // 2. Main background of the header
            style={styles.tabBar}
            // 3. Text styling
            labelStyle={styles.label}
            activeColor="#6200ee" // Your primary color
            inactiveColor="#757575"
            pressColor="#f0f0f0" // Ripple effect color
        />
    );

    return <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index: number) => setIndex(index)}
          // initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar} // Added this prop
          lazy
          style={{ backgroundColor: 'white' }}
          swipeEnabled={false}
      />;
}

export default UserProfileTabView;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'white',
        elevation: 0,           // Removes shadow on Android
        shadowOpacity: 0,       // Removes shadow on iOS
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    indicator: {
        backgroundColor: '#6200ee',
        height: 3,
        borderRadius: 3,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'none', // Prevents default uppercase behavior
    },
});