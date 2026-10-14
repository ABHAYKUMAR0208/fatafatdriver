import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import TitleBar from '@/components/home/TitleBar';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';

export default function PlaceholderTabScreen({name}: {name: string}) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TitleBar />
      <View style={styles.body}>
        <Text style={styles.text}>{name} (coming soon)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  body: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {fontFamily: fonts.medium, fontSize: 15, color: colors.textSecondary},
});