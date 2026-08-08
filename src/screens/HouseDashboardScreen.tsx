import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import InviteCodeBanner from '../components/InviteCodeBanner';
import MenuRow from '../components/MenuRow';
import { useAuth } from '../context/AuthContext';
import { refreshMemberProfile } from '../firebase/houses';
import { useHouse } from '../hooks/useHouse';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HouseDashboard'>;

export default function HouseDashboardScreen({ route, navigation }: Props) {
  const { houseId } = route.params;
  const { user } = useAuth();
  const { house, loading } = useHouse(houseId);

  useEffect(() => {
    if (house) {
      navigation.setOptions({ title: house.name });
    }
  }, [navigation, house]);

  useEffect(() => {
    if (!house || !user) return;
    const current = house.memberProfiles[user.uid];
    const isStale = !current || current.displayName !== user.displayName || current.photoURL !== user.photoURL;
    if (isStale) {
      refreshMemberProfile(houseId, user.uid, { displayName: user.displayName, photoURL: user.photoURL });
    }
  }, [house, user, houseId]);

  if (loading || !house) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1 gap-4 px-6 pt-4">
        <InviteCodeBanner houseName={house.name} inviteCode={house.inviteCode} />
        <View className="gap-3">
          <MenuRow
            label="Needs List"
            icon="cart-outline"
            onPress={() => navigation.navigate('NeedsList', { houseId })}
          />
          <MenuRow
            label="Members"
            icon="people-outline"
            onPress={() => navigation.navigate('Members', { houseId })}
          />
          <MenuRow
            label="Sections"
            icon="grid-outline"
            onPress={() => navigation.navigate('Sections', { houseId })}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
