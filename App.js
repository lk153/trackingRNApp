import React from 'react';
import { StyleSheet } from 'react-native';
import HomePage from './src/HomePage.js';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECF0F3"
  },

  header: {
    fontSize: 35,
    fontWeight: "500",
  }
})

const TrackingApp = () => {
  return (
    <HomePage />
  )
}
export default TrackingApp;