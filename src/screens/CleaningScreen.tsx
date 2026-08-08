import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CleaningSectionRow from '../components/CleaningSectionRow';
import { useHouse } from '../hooks/useHouse';
import { useSections } from '../hooks/useSections';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Cleaning'>;

export default function CleaningScreen({ route, navigation }: Props) {
  const { houseId } = route.params;
  const { house, loading: houseLoading } = useHouse(houseId);
  const { sections, loading: sectionsLoading } = useSections(houseId);

  if (houseLoading || sectionsLoading || !house) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-4">
        {sections.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-slate-500">No sections yet — add one under Sections first.</Text>
          </View>
        ) : (
          <FlatList
            data={sections}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item }) => (
              <CleaningSectionRow
                section={item}
                memberProfiles={house.memberProfiles}
                onPress={() => navigation.navigate('CleaningConfig', { houseId, sectionId: item.id })}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
