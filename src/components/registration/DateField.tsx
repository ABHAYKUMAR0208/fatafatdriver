import React, {useEffect, useMemo, useRef, useState} from 'react';
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
// wait this long after a drag ends to see whether momentum scrolling follows
const DRAG_SETTLE_MS = 150;

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
  // Earliest date that can be picked (expiry dates pass today). The wheels then
  // only list valid days / months / years, so a past date cannot be chosen.
  // Without it the field behaves as before (e.g. date of birth).
  minDate?: Date;
  labelColor?: string;
  darkBorder?: boolean;
  boxStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

type Draft = {day: number; month: number; year: number};

function daysIn(month: number, year: number) {
  // month is 0-11; day 0 of the next month = last day of this one
  return new Date(year, month + 1, 0).getDate();
}

function pad(n: number, size = 2) {
  return String(n).padStart(size, '0');
}

function parse(digits: string): Draft | undefined {
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
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const ready = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const scrollToIndex = (i: number, animated: boolean) =>
    ref.current?.scrollTo({y: i * ITEM_HEIGHT, animated});

  // Keep the wheel on the chosen row when the value changes from outside
  // (list got shorter, a tap, the sheet re-opened).
  useEffect(() => {
    scrollToIndex(index, ready.current);
    ready.current = true;
  }, [index, items.length]);

  const settle = (y: number) => {
    const i = Math.min(Math.max(Math.round(y / ITEM_HEIGHT), 0), items.length - 1);
    if (i !== index) {
      onChange(i);
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
      // first layout: jump straight to the row, no animation
      onContentSizeChange={() => scrollToIndex(index, false)}
      onScrollBeginDrag={() => clearTimeout(timer.current)}
      onMomentumScrollBegin={() => clearTimeout(timer.current)}
      onScrollEndDrag={e => {
        // A drag can end with momentum scrolling still to come; only settle if
        // no momentum starts shortly after (a slow drag).
        const y = e.nativeEvent.contentOffset.y;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => settle(y), DRAG_SETTLE_MS);
      }}
      onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
        clearTimeout(timer.current);
        settle(e.nativeEvent.contentOffset.y);
      }}>
      {items.map((item, i) => (
        <Pressable key={item} style={styles.wheelItem} onPress={() => onChange(i)}>
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
  minDate,
  labelColor,
  darkBorder,
  boxStyle,
  containerStyle,
}: Props) {
  const strings = useStrings();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  // the earliest allowed day / month / year (only when minDate is set)
  const min = minDate
    ? {day: minDate.getDate(), month: minDate.getMonth(), year: minDate.getFullYear()}
    : undefined;

  const startDraft = (): Draft =>
    min ? {...min} : {day: 1, month: 0, year: defaultYear};

  const [draft, setDraft] = useState<Draft>(startDraft);

  const years = useMemo(() => {
    const list: number[] = [];
    if (min) {
      for (let y = min.year; y <= maxYear; y++) {
        list.push(y); // nearest year first, so "today" is at the top
      }
    } else {
      for (let y = maxYear; y >= minYear; y--) {
        list.push(y);
      }
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minYear, maxYear, min?.year]);

  const allMonths = strings.personalDetails.months;
  const monthStart = min && draft.year === min.year ? min.month : 0;
  const months = allMonths.slice(monthStart);

  const dayStart = min && draft.year === min.year && draft.month === min.month ? min.day : 1;
  const dayCount = daysIn(draft.month, draft.year);
  const days = useMemo(
    () => Array.from({length: dayCount - dayStart + 1}, (_, i) => String(dayStart + i)),
    [dayCount, dayStart],
  );

  const picked = parse(value);
  const shown = picked
    ? `${pad(picked.day)} ${allMonths[picked.month]} ${picked.year}`
    : undefined;

  const onOpen = () => {
    setDraft(picked ? clamp(picked) : startDraft());
    setOpen(true);
  };

  // pull a draft back inside the allowed range (never before minDate,
  // never a day that the month does not have, e.g. 31 -> Feb)
  function clamp(d: Draft): Draft {
    let {year, month, day} = d;
    if (min) {
      if (year < min.year) {
        year = min.year;
      }
      if (year === min.year && month < min.month) {
        month = min.month;
      }
    }
    day = Math.min(day, daysIn(month, year));
    if (min && year === min.year && month === min.month && day < min.day) {
      day = min.day;
    }
    return {year, month, day};
  }

  const update = (next: Partial<Draft>) => setDraft(d => clamp({...d, ...next}));

  const onDone = () => {
    const date = new Date(draft.year, draft.month, draft.day);
    if (minDate && date < minDate) {
      return; // cannot happen with the clamped wheels, but never save a past date
    }
    onChange(`${pad(draft.month + 1)}${pad(draft.day)}${draft.year}`);
    setOpen(false);
  };

  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={[styles.label, labelColor ? {color: labelColor} : null]}>{label}</Text>
      <Pressable
        onPress={onOpen}
        style={[
          styles.box,
          darkBorder && styles.boxDark,
          open && styles.boxFocused,
          boxStyle,
        ]}>
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
              {/* key: re-mount a wheel when its list changes so it re-centres */}
              <Wheel
                key={`d${dayStart}-${days.length}`}
                items={days}
                index={draft.day - dayStart}
                onChange={i => update({day: dayStart + i})}
              />
              <Wheel
                key={`m${monthStart}`}
                items={months}
                index={draft.month - monthStart}
                onChange={i => update({month: monthStart + i})}
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
  boxDark: {
    borderColor: colors.textDark,
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
