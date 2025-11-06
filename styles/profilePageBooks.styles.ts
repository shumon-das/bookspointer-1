import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50,
  },
  book: {
    height: 'auto', 
    width: '32%',
    marginBottom: 10,
  },
  series: {
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    height: 160,
  },
  seriesName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#F6F7F9',
  },
  authorName: {
    fontSize: 10, 
    color: '#F6F7F9'
  },
  image: { 
    width: '100%', 
    height: '100%',
  },
  content: {
    position: 'absolute',
    width: '68%',
    height: 100,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    transform: [{ rotate: '-3deg' }]
  },
  contentAuthorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
})