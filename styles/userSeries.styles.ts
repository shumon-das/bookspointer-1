import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50,
  },
  series: {
    width: '32%',
    marginBottom: 8,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#085a80',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seriesName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#F6F7F9',
  },
  seriesListItem: {
    backgroundColor: '#085a80', 
    margin: 4, 
    paddingVertical: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    borderRadius: 5
  },
  seriesBackButton: {
    marginVertical: 10,
    width: '98%', 
    backgroundColor: '#282C35', 
    color: 'white', 
    paddingVertical: 7, 
    borderRadius: 50, 
    textAlign: 'center'
  }
})