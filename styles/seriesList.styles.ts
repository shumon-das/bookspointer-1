import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',     // Align items horizontally
    flexWrap: 'wrap',        // Push items to next line when no space
    justifyContent: 'flex-start', // Or 'space-between' for even gaps
    padding: 6,
  },
  series: {
    height: 120,
    backgroundColor: 'white',
    marginHorizontal: 8,
    marginVertical: 5,
    padding: 10,
    width: 155,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  count: {
    textAlign: 'center',
    color: 'gray'
  },
  viewSeries: {
    backgroundColor: '#f9f0eb',
    paddingHorizontal: 2,
    borderRadius: 5,
  },
  viewSeriesText: {
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 5,
    textAlign: 'center',
    fontWeight: 700
  },
  backToSeries: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f9f0eb',
    borderRadius: 5,
  }
})