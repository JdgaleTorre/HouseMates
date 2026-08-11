import { Pressable, Text, View } from 'react-native';

import MemberAvatar from './MemberAvatar';
import { MemberProfile, Section } from '../types';
import { FREQUENCY_LABELS, getCurrentAssignee, getNextAssignee } from '../utils/cleaningRotation';

interface CleaningSectionRowProps {
  section: Section;
  memberProfiles: Record<string, MemberProfile>;
  onPress: () => void;
}

function nameFor(uid: string | null, memberProfiles: Record<string, MemberProfile>) {
  if (!uid) return 'Unassigned';
  return memberProfiles[uid]?.displayName ?? 'Unknown roommate';
}

export default function CleaningSectionRow({ section, memberProfiles, onPress }: CleaningSectionRowProps) {
  const { cleaning } = section;

  return (
    <Pressable onPress={onPress} className="gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-900">{section.name}</Text>
        {!cleaning ? <Text className="text-xs text-slate-400">Not scheduled</Text> : null}
      </View>
      {cleaning ? (
        <>
          <View className="flex-row gap-2">
            {cleaning.assignedMemberIds.map((uid) => (
              <MemberAvatar key={uid} profile={memberProfiles[uid]} size={28} />
            ))}
          </View>
          <Text className="text-xs text-slate-500">{FREQUENCY_LABELS[cleaning.frequency]}</Text>
          <Text className="text-sm text-slate-700">
            Up now: <Text className="font-semibold">{nameFor(getCurrentAssignee(cleaning), memberProfiles)}</Text>
          </Text>
          <Text className="text-sm text-slate-500">
            Up next: {nameFor(getNextAssignee(cleaning), memberProfiles)}
          </Text>
        </>
      ) : null}
    </Pressable>
  );
}
