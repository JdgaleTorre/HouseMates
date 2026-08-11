import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import CircularProgress from './CircularProgress';
import { markSectionCleaned } from '../firebase/sections';
import { MemberProfile, Section } from '../types';
import { getCurrentAssignee, getProgress, isOverdue } from '../utils/cleaningRotation';
import { getSectionInitials } from '../utils/initials';

interface MyCleaningSummaryProps {
  sections: Section[];
  userUid: string;
  houseId: string;
  memberProfiles: Record<string, MemberProfile>;
}

export default function MyCleaningSummary({ sections, userUid, houseId, memberProfiles }: MyCleaningSummaryProps) {
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const mine = sections.filter(
    (section) => section.cleaning && getCurrentAssignee(section.cleaning) === userUid
  );

  function handleComplete(section: Section) {
    if (!section.cleaning || pending[section.id]) return;
    setPending((prev) => ({ ...prev, [section.id]: true }));
    markSectionCleaned(houseId, section.id, section.cleaning, userUid).finally(() => {
      setPending((prev) => ({ ...prev, [section.id]: false }));
    });
  }

  return (
    <View className="gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
      <Text className="text-sm font-semibold text-blue-900">Your cleaning this period</Text>
      {mine.length === 0 ? (
        <Text className="text-sm text-blue-700">Nothing assigned to you this period.</Text>
      ) : (
        <View className="flex-row flex-wrap gap-4">
          {mine.map((section) => {
            const cleaning = section.cleaning!;
            const overdue = isOverdue(cleaning);
            const lastDoneName = cleaning.lastCompletedBy
              ? (memberProfiles[cleaning.lastCompletedBy]?.displayName ?? 'Unknown roommate')
              : null;

            return (
              <Pressable
                key={section.id}
                onPress={() => handleComplete(section)}
                className="items-center gap-1"
                style={{ width: 88 }}
              >
                <CircularProgress progress={getProgress(cleaning)} color={overdue ? '#dc2626' : '#16a34a'}>
                  <Text className="text-base font-bold text-slate-900">{getSectionInitials(section.name)}</Text>
                </CircularProgress>
                <Text className="text-center text-xs font-semibold text-blue-900" numberOfLines={1}>
                  {section.name}
                </Text>
                {cleaning.assignedMemberIds.length > 1 ? (
                  <Text className="text-center text-[11px] text-blue-700" numberOfLines={2}>
                    {cleaning.lastCompletedAt
                      ? `${new Date(cleaning.lastCompletedAt).toLocaleDateString()} · ${lastDoneName}`
                      : 'Not done yet'}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
