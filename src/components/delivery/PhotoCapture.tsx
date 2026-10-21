import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {CameraIcon} from '@/components/common/Icons';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';

type Props = {
  label: string;
  uri?: string;
  onPress: () => void;
  height?: number;
};

// Dashed box that opens the camera; shows the photo once taken.
export default function PhotoCapture({label, uri, onPress, height = 120}: Props) {
  const strings = useStrings();

  return (
    <Pressable
      style={({pressed}) => [styles.box, {height}, pressed && styles.pressed]}
      onPress={onPress}>
      {uri ? (
        <>
          <Image source={{uri}} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.retake}>
            <Text style={styles.retakeText}>{strings.delivery.retake}</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.iconCircle}>
            <CameraIcon size={20} color={colors.primary} />
          </View>
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.gray300,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.peach,
  },
  label: {
    marginTop: 8,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  retake: {
    position: 'absolute',
    bottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(15,18,36,0.6)',
  },
  retakeText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
});
