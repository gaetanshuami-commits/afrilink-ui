import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useWalletStore } from "../../store/transactions";

export default function HomeScreen() {
  const balance = useWalletStore((s) => s.balance);
  const walletCurrency = useWalletStore((s) => s.walletCurrency);

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>AfriLink</Text>
      <Text style={styles.tagline}>Envoyer de l’argent comme envoyer une photo.</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde disponible</Text>
        <Text style={styles.balanceValue}>
          {balance} {walletCurrency}
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/send")}>
        <Text style={styles.primaryBtnText}>Envoyer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/request")}>
        <Text style={styles.secondaryBtnText}>Demander</Text>
      </TouchableOpacity>

      <Text style={styles.trustLine}>Frais clairs • Sécurité • Zéro surprise</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E1B2E", padding: 20, justifyContent: "center" },
  brand: { color: "#00C2A8", fontSize: 40, fontWeight: "900", marginBottom: 8 },
  tagline: { color: "white", fontSize: 16, opacity: 0.8, marginBottom: 18 },

  balanceCard: { backgroundColor: "rgba(255,255,255,0.08)", padding: 16, borderRadius: 16, marginBottom: 18 },
  balanceLabel: { color: "white", opacity: 0.7 },
  balanceValue: { color: "white", fontSize: 28, fontWeight: "800", marginTop: 6 },

  primaryBtn: { backgroundColor: "#00C2A8", padding: 15, borderRadius: 14, alignItems: "center", marginBottom: 12 },
  primaryBtnText: { color: "#0E1B2E", fontWeight: "900", fontSize: 16 },

  secondaryBtn: { backgroundColor: "rgba(255,255,255,0.12)", padding: 15, borderRadius: 14, alignItems: "center" },
  secondaryBtnText: { color: "white", fontWeight: "800", fontSize: 16 },

  trustLine: { color: "white", opacity: 0.55, marginTop: 16, textAlign: "center" },
});