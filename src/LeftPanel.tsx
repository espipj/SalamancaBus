import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  FlatList,
  View,
  Pressable,
  PressableProps,
  Platform,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import {useHeaderHeight} from '@react-navigation/elements';
import {BlurView, VibrancyView} from '@react-native-community/blur';
import {Bus, Line, Stop} from './types';
import {BusList} from './RightPanel';

export type IRootStackParams = {
  Lines: undefined;
  Stops: {line: Line};
  Buses: {stop: Stop};
};

let LeftSideNav = createStackNavigator<IRootStackParams>();
const LeftPanel = ({onPress}: {onPress: PressableProps.onPress}) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <LeftSideNav.Navigator
        screenOptions={{
          animationEnabled: true,
          presentation: 'card',
          headerTransparent: true,
          headerBackground: () => (
            <VibrancyView
              blurType="extraDark"
              reducedTransparencyFallbackColor="white"
              blurAmount={10}
              style={{
                flex: 1,
              }}
            />
          ),
        }}>
        <LeftSideNav.Screen name="Lines" component={LineList} options={{}} />
        <LeftSideNav.Screen name="Stops">
          {props => (
            <StopList
              {...props}
              onPress={stop => {
                console.log(stop);
                onPress(stop);
                if (['android', 'ios'].includes(Platform.OS))
                  props.navigation.navigate('Buses', {stop});
              }}
            />
          )}
        </LeftSideNav.Screen>
        {['android', 'ios'].includes(Platform.OS) ? (
          <LeftSideNav.Screen name="Buses" component={BusList} />
        ) : null}
      </LeftSideNav.Navigator>
    </NavigationContainer>
  );
};

export default LeftPanel;

const LineCard = ({
  line,
  onPress,
}: {
  line: Line;
  onPress: PressableProps.onPress;
}) => {
  const isDark = useColorScheme() === 'dark';
  const styles = StyleSheet.create({
    card: {
      flex: 1,
      flexDirection: 'row',
      marginVertical: 3,
      marginHorizontal: 6,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: isDark ? Colors.darker : Colors.lighter,
    },
    number: {
      backgroundColor: isDark ? Colors.light : Colors.dark,
      marginHorizontal: 10,
      borderRadius: 15,
      color: isDark ? Colors.dark : Colors.light,
    },
    lineName: {
      flex: 1,
    },
  });
  return (
    <Pressable
      style={({pressed}) => [
        styles.card,
        pressed ? {backgroundColor: isDark ? Colors.dark : Colors.light} : null,
      ]}
      onPress={onPress}>
      <View style={styles.number}>
        <Text style={{...styles.number}}>{line.id}</Text>
      </View>
      <Text style={styles.lineName}>{line.name}</Text>
    </Pressable>
  );
};

const StopCard = ({
  stop,
  onPress,
}: {
  stop: Stop;
  onPress: PressableProps.onPress;
}) => {
  const isDark = useColorScheme() === 'dark';
  const styles = StyleSheet.create({
    card: {
      flex: 1,
      flexDirection: 'row',
      marginVertical: 3,
      marginHorizontal: 6,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: isDark ? Colors.darker : Colors.lighter,
    },
    number: {
      backgroundColor: isDark ? Colors.light : Colors.dark,
      marginHorizontal: 10,
      borderRadius: 15,
      color: isDark ? Colors.dark : Colors.light,
    },
    lineName: {
      flex: 1,
    },
  });
  return (
    <Pressable
      style={({pressed}) => [
        styles.card,
        pressed ? {backgroundColor: isDark ? Colors.dark : Colors.light} : null,
      ]}
      onPress={() => onPress(stop)}>
      <Text style={styles.lineName}>{stop.name}</Text>
    </Pressable>
  );
};

type StopsListProps = StackScreenProps<IRootStackParams, 'Stops'> & {
  onPress: PressableProps.onPress;
};
const StopList = ({route, onPress}: StopsListProps) => {
  const {line} = route.params;
  return (
    <FlatList
      data={line.stops.slice(0, line.stops.length / 2)}
      keyExtractor={({id, name}) => `${id}-${name}`}
      renderItem={({item}) => <StopCard stop={item} onPress={onPress} />}
    />
  );
};
type LineListProps = StackScreenProps<IRootStackParams, 'Lines'>;
const LineList = ({navigation}: LineListProps) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Line[]>([]);
  const getStops = async () => {
    fetch('http://salamancadetransportes.com/siri?city=salamanca')
      .then(res => res.json())
      .then((json: Array<Line>) => {
        setData(json);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    getStops();
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={({id, name}) => `${id}-${name}`}
      refreshing={isLoading}
      onRefresh={() => {
        setLoading(true);
        getStops();
      }}
      renderItem={({item}) => (
        <LineCard
          line={item}
          onPress={() => navigation.navigate('Stops', {line: item})}
        />
      )}
    />
  );
};
