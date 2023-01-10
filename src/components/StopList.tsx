import React from 'react';
import {FlatList, PressableProps} from 'react-native';
import {Stop} from '../types';
import StopCard from './StopCard';

type StopsListProps = {
  stops: Array<Stop>;
  onPress: PressableProps['onPress'];
};
const StopList = ({stops, onPress}: StopsListProps) => {
  return (
    <FlatList
      data={stops}
      keyExtractor={({id, name}) => `${id}-${name}`}
      renderItem={({item}) => {
        if (!item.id) console.log(item);
        return <StopCard stop={item} onPress={onPress} />;
      }}
    />
  );
};

export default StopList;
