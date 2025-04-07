import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const App: React.FC = () => {
  return (
    <WebView 
      source={{ uri: 'https://6f96b5fa-5913-4129-9d39-4259881e4655.e1-us-east-azure.choreoapps.dev' }} 
      style={styles.container}
      startInLoadingState={true}
      renderLoading={() => (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
