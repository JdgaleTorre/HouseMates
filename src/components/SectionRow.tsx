import { Text, View } from 'react-native';

import RemovePill from './RemovePill';
import { Section } from '../types';

interface SectionRowProps {
  section: Section;
  onRemove: (sectionId: string) => void;
}

export default function SectionRow({ section, onRemove }: SectionRowProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-slate-100 py-3">
      <Text className="text-base text-slate-900">{section.name}</Text>
      <RemovePill onPress={() => onRemove(section.id)} />
    </View>
  );
}
