import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';
import labels from '@/app/utils/labels';
import WriteBook from './write-book';
import EthernelWord from './create-ethernal-word';

const CreatePost = () => {
    const layout = useWindowDimensions();
    const theme = useTheme();
    const categories = {
        0: {id:0, name:"write-book"},
        1: {id:8, name:"eternal-word"},
        2: {id:17,name:"song"},
        3: {id:2, name:"jokes"},
        4: {id:12,name:"poetry"}
    } as any;

    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'first', title: labels.createBook.book },
        { key: 'second', title: labels.createBook.ethernelWord },
        { key: 'third', title: labels.createBook.song },
        { key: 'fourth', title: labels.createBook.joke },
        { key: 'fifth', title: labels.createBook.poem },
    ]);

    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'first':
                return <WriteBook />;
            case 'second':
                return <EthernelWord category={categories[index]} />;
            case 'third':
                return <EthernelWord category={categories[index]} />;
            case 'fourth':
                return <EthernelWord category={categories[index]} />;
            case 'fifth':
                return <EthernelWord category={categories[index]} />;
            default:
                return null;
        }
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={(index: number) => setIndex(index)}
            initialLayout={{ width: layout.width }}
            lazy
            style={{ backgroundColor: theme.colors.background }}
            swipeEnabled={false}
        />
    )
}

export default CreatePost
