import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';

interface InviteCodeBannerProps {
  houseName: string;
  inviteCode: string;
}

export default function InviteCodeBanner({ houseName, inviteCode }: InviteCodeBannerProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    Share.share({
      message: `Join "${houseName}" on HouseMates! Use invite code ${inviteCode}.`,
    });
  }

  return (
    <View className="w-full flex-row items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
      <View>
        <Text className="text-xs uppercase tracking-wide text-blue-500">Invite code</Text>
        <Text className="text-lg font-bold tracking-widest text-blue-900">{inviteCode}</Text>
      </View>
      <View className="flex-row gap-3">
        <Pressable onPress={handleCopy}>
          <Text className="font-semibold text-blue-600">{copied ? 'Copied!' : 'Copy'}</Text>
        </Pressable>
        <Pressable onPress={handleShare}>
          <Text className="font-semibold text-blue-600">Share</Text>
        </Pressable>
      </View>
    </View>
  );
}
