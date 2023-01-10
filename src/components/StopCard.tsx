import React from 'react';
import {StyleSheet, useColorScheme, Pressable, Text} from 'react-native';
import {Stop} from '../types';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const StopCard = ({
  stop,
  onPress,
}: {
  stop: Stop;
  onPress: (stop: Stop) => void;
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
      color: isDark ? Colors.lighter : Colors.darker,
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

export default StopCard;
