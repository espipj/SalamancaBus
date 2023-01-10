import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
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
const MobileNavigation = ({onPress}: {onPress: () => void}) => {
  const isDark = useColorScheme() === 'dark';
  const location = {lat: 40.97044, lon: -5.65478};
  const OSMDataFiltered = OSMData.filter(
    elem => !!elem.tags.name && !!elem.tags.ref,
  );
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
    />
  );
};

export default Home;
