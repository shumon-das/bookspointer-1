import labels from '@/app/utils/labels';
import { useEffect, useState } from 'react';
import { TabView } from 'react-native-tab-view';
import UserLibrary from '../UserLibrary';
import UserSeries from '../UserSeries';
import { useAuthStore } from '@/app/store/auth';

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
    ]);

    const renderScene = ({ route }: any) => {
        switch (route.key) {
        case 'library':
            return author ? <UserLibrary authorId={author.id} /> : <></>;
            default:
                return author ? <UserSeries series={author.series} author={author} onChooseSeries={(seriesName) => onSelectSeries(seriesName)} /> : <></>;
        }
    };

    return <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index: number) => setIndex(index)}
          // initialLayout={{ width: layout.width }}
          lazy
          style={{ backgroundColor: 'white' }}
          swipeEnabled={false}
      />;
}

export default UserProfileTabView;