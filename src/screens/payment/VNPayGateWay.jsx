import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'

const VNPayGateWay = ({ navigation, route }) => {
  // Get the URL from navigation params (route.params.url)
  const url = route?.params?.url
  const [loading, setLoading] = useState(true)

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#42A5F5" />
        </View>
      )}
      <WebView
        source={{ uri: url }}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState={true}
        style={{ flex: 1 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
})

export default VNPayGateWay