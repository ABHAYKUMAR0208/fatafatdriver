import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MdiIcon from '@/components/common/MdiIcon';
import {colors} from '@/constants/colors';
import {MDI_DOCS} from '@/constants/iconPathsDocs';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';

type Props = {
  visible: boolean;
  title: string;
  onCamera: () => void;
  onGallery: () => void;
  onClose: () => void;
};

type OptionProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function Option({icon, title, subtitle, onPress}: OptionProps) {
  return (
    <Pressable
      style={({pressed}) => [styles.option, pressed && styles.optionPressed]}
      onPress={onPress}>
      <View style={styles.optionIcon}>
        <MdiIcon path={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSub}>{subtitle}</Text>
      </View>
      <MdiIcon path={MDI_DOCS.chevronRight} size={22} color={colors.placeholder} />
    </Pressable>
  );
}

// Bottom sheet: take a photo with the camera or pick one from the gallery.
// The sheet closes first, then the chosen action runs.
export default function PhotoSourceSheet({
  visible,
  title,
  onCamera,
  onGallery,
  onClose,
}: Props) {
  const strings = useStrings();
  const insets = useSafeAreaInsets();

  // let the sheet finish closing before the camera / gallery screen opens
  const pick = (action: () => void) => () => {
    onClose();
    setTimeout(action, 250);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 16)}]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          <View style={styles.options}>
            <Option
              icon={MDI_DOCS.cameraOutline}
              title={strings.personalDetails.takePhoto}
              subtitle={strings.personalDetails.takePhotoSub}
              onPress={pick(onCamera)}
            />
            <Option
              icon={MDI_DOCS.imageOutline}
              title={strings.personalDetails.fromGallery}
              subtitle={strings.personalDetails.fromGallerySub}
              onPress={pick(onGallery)}
            />
          </View>

          <Pressable
            style={({pressed}) => [styles.cancel, pressed && styles.optionPressed]}
            onPress={onClose}>
            <Text style={styles.cancelText}>{strings.personalDetails.cancel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.background,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  title: {
    marginTop: 16,
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textDark,
  },
  options: {
    marginTop: 16,
    gap: 12,
  },
  option: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  optionPressed: {
    backgroundColor: colors.surface,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    flex: 1,
    marginLeft: 14,
  },
  optionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  optionSub: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  cancel: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  cancelText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textSecondary,
  },
});
