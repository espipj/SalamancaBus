import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  useColorScheme,
  Linking,
  Alert,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import StopList from './components/StopList';

import OSMData from './static/data/osmData.json';
import {distance, osmToStandard} from './utils';
import {Line, Stop} from './types';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {BusList} from './RightPanel';

export type IRootStackParams = {
  Lines: undefined;
  Stops: {line: Line};
  Buses: {stop: Stop};
};

let Nav = createStackNavigator<IRootStackParams>();
const MobileNavigation = ({
  onPress,
  location = {lat: 40.97044, lon: -5.65478},
}: {
  onPress: () => void;
  location?: {lat: number; lon: number};
}) => {
  const isDark = useColorScheme() === 'dark';
  const OSMDataFiltered = OSMData.filter(
    elem => !!elem.tags.name && !!elem.tags.ref,
  );
  console.log(location);
  OSMDataFiltered.sort(
    ({lat: lata, lon: lona}, {lat: latb, lon: lonb}) =>
      distance(location, {lat: lata, lon: lona}) -
      distance(location, {lat: latb, lon: lonb}),
  );
  const convertedStops = OSMDataFiltered.map(osmToStandard);
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Nav.Navigator
        screenOptions={{
          animationEnabled: true,
          presentation: 'card',
        }}>
        <Nav.Screen name="Stops">
          {props => (
            <StopList
              stops={convertedStops}
              onPress={stop => {
                console.log(stop);
                onPress(stop);
                if (['android', 'ios'].includes(Platform.OS))
                  props.navigation.navigate('Buses', {stop});
              }}
            />
          )}
        </Nav.Screen>
        {/* <Nav.Screen name="Lines" component={LineList} options={{}} /> */}
        {['android', 'ios'].includes(Platform.OS) ? (
          <Nav.Screen name="Buses" component={BusList} />
        ) : null}
      </Nav.Navigator>
    </NavigationContainer>
  );
};

const Home = () => {
  const isDark = useColorScheme() === 'dark';
  const [stop, setStop] = useState<Stop | undefined>(null);
  const [location, setLocation] = useState<GeoPosition>();

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow Bus Salamanca to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        console.log(position);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        // setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: true,
        showLocationDialog: true,
      },
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: isDark ? Colors.darker : Colors.lighter,
    },
    leftPanel: {
      flex: 1,
      backgroundColor: isDark ? Colors.dark : Colors.light,
    },
    rightPanel: {
      flex: 3,
      backgroundColor: isDark ? Colors.darker : Colors.lighter,
    },
  });

  return (
    <MobileNavigation
      onPress={(stopP: Stop) => {
        setStop(stopP);
      }}
      location={
        location
          ? {
              lat: location.coords.latitude,
              lon: location.coords.longitude,
            }
          : undefined
      }
    />
  );
};

export default Home;
