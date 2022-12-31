import React, {useState} from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import LeftPanel, {Stop} from './LeftPanel';
import RightPanel from './RightPanel';

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
    <LeftPanel
      onPress={(stopP: Stop) => {
        setStop(stopP);
      }}
    />
  );
};

export default Home;
