import { Image, Text, View } from 'react-native';

import { MemberProfile } from '../types';

function initials(displayName: string | null) {
  if (!displayName) return '?';
  return displayName.trim().charAt(0).toUpperCase();
}

interface MemberAvatarProps {
  profile: MemberProfile | undefined;
  size?: number;
}

export default function MemberAvatar({ profile, size = 36 }: MemberAvatarProps) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  if (profile?.photoURL) {
    return <Image source={{ uri: profile.photoURL }} style={dim} />;
  }
  return (
    <View style={dim} className="items-center justify-center bg-blue-100">
      <Text className="text-base font-bold text-blue-600">{initials(profile?.displayName ?? null)}</Text>
    </View>
  );
}
