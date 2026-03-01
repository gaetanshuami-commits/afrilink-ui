import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../store/auth";

export default function LoginScreen() {
  const { token, isReady, load, loginDemo } = useAuthStore();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isReady && token) router.replace("/(tabs)");
  }, [isReady, token]);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>AfriLink</Text>
        <Text style={styles.subtitle}>Chargement…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AfriLink</Text>
      <Text style={styles.subtitle}>Connexion (démo)</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          await loginDemo();
          router.replace("/(tabs)");
        }}
      >
        <Text style={styles.btnText}>Se connecter</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Plus tard : login téléphone + OTP + token sécurisé.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E1B2E", justifyContent: "center", padding: 20 },
  title: { color: "#00C2A8", fontSize: 40, fontWeight: "900", marginBottom: 10 },
  subtitle: { color: "white", opacity: 0.8, marginBottom: 20 },

  btn: { backgroundColor: "#00C2A8", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  btnText: { color: "#0E1B2E", fontWeight: "900", fontSize: 16 },

  hint: { color: "white", opacity: 0.6, marginTop: 16 },
});