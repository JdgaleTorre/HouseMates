import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HouseGate'>;

export default function HouseGateScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="mb-2 text-2xl font-bold text-slate-900">Join a house</Text>
      <Text className="mb-4 text-center text-slate-500">
        Create a new house or join one with an invite code.
      </Text>
      <PrimaryButton label="Create a house" onPress={() => navigation.navigate('CreateHouse')} />
      <PrimaryButton label="Join a house" onPress={() => navigation.navigate('JoinHouse')} />
    </View>
  );
}
