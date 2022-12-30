import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  useColorScheme,
  FlatList,
  View,
  Pressable,
  PressableProps,
  ButtonProps,
  Button,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import {Line, Stop} from './types';

export type IRootStackParams = {
  Lines: undefined;
  Stops: {line: Line};
};

let LeftSideNav = createStackNavigator<IRootStackParams>();
const LeftPanel = ({onPress}: {onPress: PressableProps.onPress}) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <LeftSideNav.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? Colors.dark : Colors.light,
          },
          headerTintColor: isDark ? Colors.light : Colors.dark,
        }}>
        <LeftSideNav.Screen name="Lines" component={LineList} options={{}} />
        <LeftSideNav.Screen name="Stops">
          {props => <StopList {...props} onPress={onPress} />}
        </LeftSideNav.Screen>
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
      .then(json => {
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
    <>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({id, name}) => `${id}-${name}`}
          renderItem={({item}) => (
            <LineCard
              line={item}
              onPress={() => navigation.navigate('Stops', {line: item})}
            />
          )}
        />
      )}
    </>
  );
};
