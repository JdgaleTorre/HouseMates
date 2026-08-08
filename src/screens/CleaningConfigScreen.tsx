import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MemberAvatar from '../components/MemberAvatar';
import PrimaryButton from '../components/PrimaryButton';
import RemovePill from '../components/RemovePill';
import { setCleaningSchedule } from '../firebase/sections';
import { useHouse } from '../hooks/useHouse';
import { useSections } from '../hooks/useSections';
import { RootStackParamList } from '../navigation/types';
import { CleaningFrequency, CleaningSchedule } from '../types';
import { FREQUENCY_LABELS } from '../utils/cleaningRotation';

type Props = NativeStackScreenProps<RootStackParamList, 'CleaningConfig'>;

const FREQUENCIES: CleaningFrequency[] = ['weekly', 'biweekly', 'monthly'];

export default function CleaningConfigScreen({ route, navigation }: Props) {
  const { houseId, sectionId } = route.params;
  const { house, loading: houseLoading } = useHouse(houseId);
  const { sections, loading: sectionsLoading } = useSections(houseId);
  const section = sections.find((s) => s.id === sectionId);

  const [initialized, setInitialized] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [frequency, setFrequency] = useState<CleaningFrequency>('weekly');

  useEffect(() => {
    if (section && !initialized) {
      setSelected(new Set(section.cleaning?.assignedMemberIds ?? []));
      setFrequency(section.cleaning?.frequency ?? 'weekly');
      setInitialized(true);
    }
  }, [section, initialized]);

  useEffect(() => {
    if (section) {
      navigation.setOptions({ title: `Configure: ${section.name}` });
    }
  }, [navigation, section]);

  function toggle(uid: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) {
        next.delete(uid);
      } else {
        next.add(uid);
      }
      return next;
    });
  }

  function handleSave() {
    if (!house || !section || selected.size === 0) return;
    const assignedMemberIds = house.memberIds.filter((uid) => selected.has(uid));
    const schedule: CleaningSchedule = {
      assignedMemberIds,
      frequency,
      anchorAt: section.cleaning?.anchorAt ?? Date.now(),
    };
    setCleaningSchedule(houseId, sectionId, schedule).then(() => navigation.goBack());
  }

  function handleRemove() {
    Alert.alert('Remove schedule?', `${section?.name} will no longer have a cleaning rotation.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setCleaningSchedule(houseId, sectionId, null).then(() => navigation.goBack()),
      },
    ]);
  }

  if (houseLoading || sectionsLoading || !house || !section) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1 gap-5 px-6 pt-4">
        <View className="gap-2">
          <Text className="text-sm font-semibold text-slate-500">Members</Text>
          {house.memberIds.map((uid) => {
            const profile = house.memberProfiles[uid];
            const isSelected = selected.has(uid);
            return (
              <Pressable
                key={uid}
                onPress={() => toggle(uid)}
                className={`flex-row items-center gap-3 rounded-2xl border px-4 py-3 ${
                  isSelected ? 'border-blue-300 bg-blue-50' : 'border-slate-100 bg-slate-50'
                }`}
              >
                <MemberAvatar profile={profile} />
                <Text className="flex-1 text-base text-slate-900">{profile?.displayName ?? 'Unknown roommate'}</Text>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={isSelected ? '#2563eb' : '#cbd5e1'}
                />
              </Pressable>
            );
          })}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold text-slate-500">Frequency</Text>
          <View className="flex-row gap-2">
            {FREQUENCIES.map((f) => (
              <Pressable
                key={f}
                onPress={() => setFrequency(f)}
                className={`flex-1 items-center rounded-xl px-3 py-2 ${frequency === f ? 'bg-blue-600' : 'bg-slate-100'}`}
              >
                <Text className={`font-semibold ${frequency === f ? 'text-white' : 'text-slate-700'}`}>
                  {FREQUENCY_LABELS[f]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <PrimaryButton label="Save" onPress={handleSave} disabled={selected.size === 0} />
        {section.cleaning ? <RemovePill onPress={handleRemove} label="Remove schedule" /> : null}
      </View>
    </SafeAreaView>
  );
}
