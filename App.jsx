import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
import GPSLogger from "./GPSLogger";

const App = () => {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const config = {
      default_threshold: 15.0,
      default_delay: 150000000,
      cheatInterval: 3000,
      onStepCountChange: (stepCount) => setSteps(stepCount),
      onCheat: () => console.log("Обнаружена попытка обмана"),
    };

    startCounter(config);
    return () => stopCounter();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Шагов: {steps}</Text>
        <GPSLogger />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold'
  }
});

export default App;
