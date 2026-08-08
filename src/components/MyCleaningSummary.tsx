import { Text, View } from 'react-native';

import { Section } from '../types';
import { FREQUENCY_LABELS, getAssigneeForPeriod } from '../utils/cleaningRotation';

interface MyCleaningSummaryProps {
  sections: Section[];
  userUid: string;
}

export default function MyCleaningSummary({ sections, userUid }: MyCleaningSummaryProps) {
  const mine = sections.filter(
    (section) => section.cleaning && getAssigneeForPeriod(section.cleaning, 0) === userUid
  );

  return (
    <View className="gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
      <Text className="text-sm font-semibold text-blue-900">Your cleaning this period</Text>
      {mine.length === 0 ? (
        <Text className="text-sm text-blue-700">Nothing assigned to you this period.</Text>
      ) : (
        mine.map((section) => (
          <Text key={section.id} className="text-sm text-blue-700">
            {section.name} · {FREQUENCY_LABELS[section.cleaning!.frequency]}
          </Text>
        ))
      )}
    </View>
  );
}
