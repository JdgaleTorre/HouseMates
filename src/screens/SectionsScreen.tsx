import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddItemInput from '../components/AddItemInput';
import SectionRow from '../components/SectionRow';
import { useAuth } from '../context/AuthContext';
import { addSection, deleteSection } from '../firebase/sections';
import { useSections } from '../hooks/useSections';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Sections'>;

export default function SectionsScreen({ route }: Props) {
  const { houseId } = route.params;
  const { user } = useAuth();
  const { sections, loading } = useSections(houseId);

  function handleAddSection(name: string) {
    if (!user) return;
    addSection(houseId, name, user.uid);
  }

  function handleRemoveSection(sectionId: string) {
    deleteSection(houseId, sectionId);
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1 gap-4 px-6 pt-4">
        <AddItemInput onSubmit={handleAddSection} placeholder="Add a chore (e.g. Take out Bins)" />
        {loading ? (
          <ActivityIndicator />
        ) : sections.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-slate-500">No chores yet.</Text>
          </View>
        ) : (
          <FlatList
            data={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SectionRow section={item} onRemove={handleRemoveSection} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
