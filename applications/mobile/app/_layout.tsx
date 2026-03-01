import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useAuthStore } from "../store/auth";

export default function RootLayout() {
  const { token, isReady, load } = useAuthStore();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isReady) return;
    if (token) router.replace("/(tabs)");
    else router.replace("/login");
  }, [isReady, token]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="send" />
      <Stack.Screen name="request" />
    </Stack>
  );
}