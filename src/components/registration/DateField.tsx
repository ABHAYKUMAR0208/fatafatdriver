import React, {useMemo, useRef, useState} from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MdiIcon from '@/components/common/MdiIcon';
import {colors} from '@/constants/colors';
import {MDI} from '@/constants/iconPaths';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5; // odd, so one row sits in the middle
const PAD = ITEM_HEIGHT * Math.floor(VISIBLE_ROWS / 2);

type Props = {
  label: string;
  placeholder: string;
  // "mmddyyyy" (same format the rest of the app stores), '' when not set
  value: string;
  onChange: (digits: string) => void;
  minYear: number;
  maxYear: number;
  // year the wheels start on when nothing is picked yet
  defaultYear: number;
  containerStyle?: StyleProp<ViewStyle>;
};

function daysIn(month: number, year: number) {
  // month is 0-11; day 0 of the next month = last day of this one
  return new Date(year, month + 1, 0).getDate();
}

function pad(n: number, size = 2) {
  return String(n).padStart(size, '0');
}

function parse(digits: string) {
  if (digits.length !== 8) {
    return undefined;
  }
  return {
    month: Number(digits.slice(0, 2)) - 1,
    day: Number(digits.slice(2, 4)),
    year: Number(digits.slice(4, 8)),
  };
}

type WheelProps = {
  items: string[];
  index: number;
  onChange: (index: number) => void;
};

// One scrolling column that snaps to a row; the middle row is the value.
function Wheel({items, index, onChange}: WheelProps) {
  const ref = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const settle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.min(Math.max(i, 0), items.length - 1);
    if (clamped !== index) {
      onChange(clamped);
    }
  };

  return (
    <ScrollView
      ref={ref}
      style={styles.wheel}
      contentContainerStyle={styles.wheelContent}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      nestedScrollEnabled
      onLayout={() => ref.current?.scrollTo({y: index * ITEM_HEIGHT, animated: false})}
      onMomentumScrollEnd={settle}
      onScrollEndDrag={e => {
        // a slow drag ends without momentum
        if (!e.nativeEvent.velocity || Math.abs(e.nativeEvent.velocity.y) < 0.05) {
          settle(e);
        }
      }}>
      {items.map((item, i) => (
        <Pressable
          key={item}
          style={styles.wheelItem}
          onPress={() => {
            ref.current?.scrollTo({y: i * ITEM_HEIGHT, animated: true});
            onChange(i);
          }}>
          <Text style={[styles.wheelText, i === index && styles.wheelTextOn]}>{item}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// Field that opens a day / month / year wheel picker in a bottom sheet.
export default function DateField({
  label,
  placeholder,
  value,
  onChange,
  minYear,
  maxYear,
  defaultYear,
  containerStyle,
}: Props) {
  const strings = useStrings();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({day: 1, month: 0, year: defaultYear});

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear]);

  const months = strings.personalDetails.months;
  const dayCount = daysIn(draft.month, draft.year);
  const days = useMemo(
    () => Array.from({length: dayCount}, (_, i) => String(i + 1)),
    [dayCount],
  );

  const picked = parse(value);
  const shown = picked
    ? `${pad(picked.day)} ${months[picked.month]} ${picked.year}`
    : undefined;

  const onOpen = () => {
    setDraft(picked ?? {day: 1, month: 0, year: defaultYear});
    setOpen(true);
  };

  // keep the day valid when month / year change (e.g. 31 -> Feb)
  const update = (next: Partial<typeof draft>) =>
    setDraft(d => {
      const merged = {...d, ...next};
      return {...merged, day: Math.min(merged.day, daysIn(merged.month, merged.year))};
    });

  const onDone = () => {
    onChange(`${pad(draft.month + 1)}${pad(draft.day)}${draft.year}`);
    setOpen(false);
  };

  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onOpen} style={[styles.box, open && styles.boxFocused]}>
        <Text numberOfLines={1} style={[styles.valueText, !shown && styles.placeholderText]}>
          {shown ?? placeholder}
        </Text>
        <MdiIcon path={MDI.menuDown} size={24} color={colors.textSecondary} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 16)}]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <Pressable onPress={onDone} hitSlop={8}>
                <Text style={styles.done}>{strings.common.done}</Text>
              </Pressable>
            </View>

            <View style={styles.wheels}>
              <View style={styles.band} pointerEvents="none" />
              {/* key: re-mount a wheel when its list length changes so it re-centres */}
              <Wheel
                key={`d${days.length}`}
                items={days}
                index={draft.day - 1}
                onChange={i => update({day: i + 1})}
              />
              <Wheel
                items={months}
                index={draft.month}
                onChange={i => update({month: i})}
              />
              <Wheel
                items={years.map(String)}
                index={Math.max(years.indexOf(draft.year), 0)}
                onChange={i => update({year: years[i]})}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textLabel,
  },
  box: {
    height: 44,
    paddingLeft: 16,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  boxFocused: {
    borderColor: colors.primary,
  },
  valueText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textDark,
  },
  placeholderText: {
    color: colors.placeholder,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.background,
  },
  sheetHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textDark,
  },
  done: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  wheels: {
    height: ITEM_HEIGHT * VISIBLE_ROWS,
    flexDirection: 'row',
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: PAD,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
  },
  wheel: {
    flex: 1,
  },
  wheelContent: {
    paddingVertical: PAD,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
  },
  wheelTextOn: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.primary,
  },
});
