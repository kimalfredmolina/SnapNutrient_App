import { Text, View } from "react-native";
import {StyleSheet} from 'react-native';
import "../global.css";

const Flex = () => {
  return (
    <View
      style={[
        styles.container,
        {
          // Trying to recreate the code in react-native-dev
          flexDirection: 'column',
        },
      ]}>
      <View style={{flex: 1, backgroundColor: 'red'}} />
      <View style={{flex: 2, backgroundColor: 'darkorange'}} />
      <View style={{flex: 3, backgroundColor: 'green'}} />
      <View style={{flex: 3, backgroundColor: 'purple'}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Flex;