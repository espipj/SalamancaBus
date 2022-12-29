import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  Button,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Bus, Stop} from './LeftPanel';

const RightPanel = ({stop}: {stop?: Stop}) => {
  const isDark = useColorScheme() === 'dark';
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setLoading] = useState(true);

  const getBuses = async () => {
    console.log(Date());
    if (!stop?.id) return;
    fetch(
      `http://salamancadetransportes.com/siri?city=salamanca&stop=${stop.id}`,
    )
      .then(res => {
        return res.json();
      })
      .then((json: Array<Bus>) => {
        setLoading(false);
        setBuses(json);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    getBuses();
  }, [stop]);

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: isDark ? Colors.darker : Colors.lighter,
    },
    header: {
      flexDirection: 'row',
    },
    text: {
      margin: 8,
      fontSize: 24,
    },
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.text}>
          Buses en {stop?.name} [{stop?.id}]
        </Text>
        <Button title="Refrescar" onPress={getBuses} />
      </View>
      {stop ? (
        isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={buses}
            keyExtractor={({line, direction, time}) =>
              `${line},${direction},${time}`
            }
            renderItem={({item}) => <BusCard bus={item} />}
          />
        )
      ) : (
        <Text>No selected stop</Text>
      )}
    </View>
  );
};

const BusCard = ({
  bus,
  onPress,
}: {
  bus: Bus;
  onPress?: PressableProps.onPress;
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
        <Text style={{...styles.number}}>{bus.line}</Text>
      </View>
      <Text style={styles.lineName}>{bus.direction}</Text>
      <Text style={styles.lineName}>{bus.time}</Text>
    </Pressable>
  );
};

export default RightPanel;
