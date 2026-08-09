import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MemberAvatar from './MemberAvatar';
import MenuRow from './MenuRow';
import { MemberProfile } from '../types';

interface AccountMenuProps {
  visible: boolean;
  onClose: () => void;
  profile: MemberProfile;
  email: string | null;
  onEditProfile: () => void;
  onSignOut: () => void;
}

export default function AccountMenu({ visible, onClose, profile, email, onEditProfile, onSignOut }: AccountMenuProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/30" onPress={onClose}>
        <SafeAreaView edges={['top']}>
          <Pressable onPress={() => {}} className="mx-4 mt-2 gap-4 rounded-2xl bg-white p-4 shadow-lg">
            <View className="flex-row items-center gap-3">
              <MemberAvatar profile={profile} size={48} />
              <View className="flex-1">
                <Text className="text-base font-bold text-slate-900">{profile.displayName ?? 'Unnamed'}</Text>
                {email ? <Text className="text-sm text-slate-500">{email}</Text> : null}
              </View>
            </View>
            <View className="gap-2">
              <MenuRow
                label="Edit profile"
                icon="person-circle-outline"
                onPress={() => {
                  onClose();
                  onEditProfile();
                }}
              />
              <MenuRow
                label="Sign out"
                icon="log-out-outline"
                onPress={() => {
                  onClose();
                  onSignOut();
                }}
              />
            </View>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}
