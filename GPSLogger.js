import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Text, View, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const GPSLogger = () => {
  const [coords, setCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let watchId = null;

    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Разрешение на доступ к геолокации',
              message: 'Приложению нужен доступ к вашей геопозиции',
              buttonNeutral: 'Спросить позже',
              buttonNegative: 'Отмена',
              buttonPositive: 'ОК',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            startWatchingLocation();
          } else {
            setErrorMsg('Доступ к геопозиции отклонён');
          }
        } catch (err) {
          setErrorMsg('Ошибка при запросе разрешения');
          console.warn(err);
        }
      } else {
        startWatchingLocation();
      }
    };

    const startWatchingLocation = () => {
      watchId = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
          console.log('Позиция обновлена:', latitude, longitude);
        },
        error => {
          setErrorMsg(error.message);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 60000,        // обновление раз в 1 минуту (Android)
          fastestInterval: 60000,
        }
      );
    };

    requestLocationPermission();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        console.log('Отслеживание остановлено');
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {coords ? (
        <>
          <Text style={styles.text}>Широта: {coords.latitude}</Text>
          <Text style={styles.text}>Долгота: {coords.longitude}</Text>
        </>
      ) : (
        <Text style={styles.text}>
          {errorMsg ? `Ошибка: ${errorMsg}` : 'Получение координат...'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    backgroundColor: '#ffffffcc',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
});

export default GPSLogger;
