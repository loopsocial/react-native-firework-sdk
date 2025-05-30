import { useState } from 'react';

import { StyleSheet, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import MultiFeeds from './MultiFeeds';
import Shopping from './Shopping';

type HomeComponentType = 'Multi-feeds' | 'Shopping';
const HomeComponentTypeList = ['Multi-feeds', 'Shopping'];

function Home() {
  const [homeComponentType, setHomeComponentType] =
    useState<HomeComponentType>('Multi-feeds');

  const renderMultiFeeds = () => {
    return <MultiFeeds />;
  };

  const renderShopping = () => {
    return <Shopping />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.homeComponentTypeButtonGroupWrapper}>
        <ButtonGroup
          buttons={HomeComponentTypeList}
          selectedIndex={HomeComponentTypeList.indexOf(homeComponentType)}
          onPress={(index) =>
            setHomeComponentType(
              HomeComponentTypeList[index] as HomeComponentType
            )
          }
        />
      </View>
      {homeComponentType === 'Multi-feeds'
        ? renderMultiFeeds()
        : renderShopping()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  homeComponentTypeButtonGroupWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});

export default Home;
