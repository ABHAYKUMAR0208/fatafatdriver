import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '@/components/home/Avatar';
import {BellIcon} from '@/components/profile/ProfileIcons';
import {fonts} from '@/constants/typography';

type Props = {
  title: string;
  // the photo the driver / rider uploaded (shows a person icon when there is none)
  photoUri?: string;
  onBell: () => void;
};

// Top bar of the Trips tab: profile photo, title, bell. Same bar as the Profile tab.
export default function HistoryHeader({title, photoUri, onBell}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, {paddingTop: insets.top + 16}]}>
      <Avatar uri={photoUri} size={40} flat />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Pressable style={styles.bell} onPress={onBell}>
        <BellIcon />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 3,
  },
  title: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    color: '#111827',
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
