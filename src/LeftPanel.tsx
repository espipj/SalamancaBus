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

export interface Line {
  id: string;
  name: string;
  stops: Stop[];
}

export interface Stop {
  id: string;
  name: string;
}

export interface Bus {
  line: string;
  direction: string;
  time: Date;
}

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

const LeftPanel = ({onPress}: {onPress: PressableProps.onPress}) => {
  const [isLoading, setLoading] = useState(true);
  const [screen, setScreen] = useState(0);
  const [line, setLine] = useState<Line | null>(null);
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

  if (screen === 1 && line) {
    return (
      <>
        <TopBar
          title="Paradas"
          actionLeft={{name: 'Atrás', onPress: () => setScreen(0)}}
        />
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={line.stops.slice(0, line.stops.length / 2)}
            keyExtractor={({id, name}) => `${id}-${name}`}
            renderItem={({item}) => <StopCard stop={item} onPress={onPress} />}
          />
        )}
      </>
    );
  }

  return (
    <>
      <TopBar title="Lineas" />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({id, name}) => `${id}-${name}`}
          renderItem={({item}) => (
            <LineCard
              line={item}
              onPress={() => {
                setScreen(1);
                setLine(item);
              }}
            />
          )}
        />
      )}
    </>
  );
};

const TopBar = ({
  title,
  actionLeft,
}: {
  title: string;
  actionLeft?: {name: string; onPress: ButtonProps['onPress']};
}) => {
  const styles = StyleSheet.create({
    main: {
      marginHorizontal: 6,
      marginVertical: 12,
      flexDirection: 'row',
    },
    text: {
      fontSize: 24,
    },
  });
  return (
    <View style={styles.main}>
      {actionLeft && (
        <Button title={actionLeft.name} onPress={actionLeft.onPress} />
      )}
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default LeftPanel;
