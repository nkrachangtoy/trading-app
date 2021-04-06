import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'

// Components
import SearchBar from '../../components/searchBar'
import SearchResult from '../../components/searchResult'

// Requests endpoint
import finnhub from '../../api/finnhub'
//import requests from '../../api/requests'

const searchScreen = ({navigation}) => {
    const [quote, setQuote] = useState('')
    const [symbol, setSymbol] = useState('')
    const [currentPrice, setcurrentPrice] = useState('')
    const [name, setName] = useState('')
    const [fetching, setFetching] = useState(false)
    
  
    const searchByQuote = async () => {
      const request = await finnhub.get(`/search?q=${quote}`)
      let data = request.data.result[0]
      setName(data.description)
      setSymbol(data.symbol)
      setFetching(true)

    }

    const getCurrentPrice = async (symbol) => {
      // const request = await finnhub.get(requests.searchBySymbol`${symbol.toUpperCase()}`)
      const request = await finnhub.get(`/quote?symbol=${symbol}`)
      .then(res => setcurrentPrice(res.data.c))
      setFetching(true)
    }

    useEffect(() => {
      searchByQuote()
    }, [])

    useEffect(() => {
      getCurrentPrice(symbol)
    }, [symbol])

    return (
        <SafeAreaView style={{flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: '#16171C'}}>
            <SearchBar 
                quote={quote}
                onQuoteChange={newQuote => setQuote(newQuote)}
                // pass the api call trigger as a prop 
                // onQuoteSubmit={() => getCurrentPrice()}
                onQuoteSubmit={() => searchByQuote()}
            />
            <Text style={{fontSize: 20, fontWeight: '900', color: '#fff'}}>Results</Text>
            {fetching ? 
              <TouchableOpacity onPress={()=>navigation.navigate('StockDetail', {price: currentPrice, symbol: symbol})}>
                <View style={styles.row}>
                  <Text style={styles.symbol}>{name}</Text>
                  <Text style={styles.price}>{currentPrice} USD</Text>
                </View>
              </TouchableOpacity> : <ActivityIndicator size='small' color='#67D9FA' />} 
        </SafeAreaView>
    )
}

export default searchScreen

const styles = StyleSheet.create({
  price: {
      fontWeight: '200',
      color: '#fff',
      fontSize: 16,
      fontWeight: '500'
  },
  row: {
      height: 48,
      flexDirection: 'row',
      width: "100%",
      backgroundColor: '#1E1F26',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginTop: 10
  },
  symbol: {
      fontSize: 16,
      fontWeight: '900',
      color: '#fff'
  }
})
