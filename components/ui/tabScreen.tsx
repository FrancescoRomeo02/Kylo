import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface TabScreenProps {
  title?: string;
  renderHeader?: ReactNode;
  children: ReactNode;
}

const TabScreen: React.FC<TabScreenProps> = ({ title, renderHeader, children }) => {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        {renderHeader ? renderHeader : <ThemedText type="subtitle" style={styles.topBarTitle}>{title}</ThemedText>}
      </View>

      <ThemedView style={styles.main}>{children}</ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  main: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
});

export default TabScreen;
