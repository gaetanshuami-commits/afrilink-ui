import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useWalletStore } from "../store/transactions";

export default function RequestScreen() {
  const addTx = useWalletStore((s) => s.addTx);
  const walletCurrency = useWalletStore((s) => s.walletCurrency);

  const [step, setStep] = useState<1 | 2>(1);
  const [fromWho, setFromWho] = useState("");
  const [amount, setAmount] = useState("");

  const amountNum = useMemo(() => Math.round(Number(amount || 0)), [amount]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demander</Text>
      <Text style={styles.subtitle}>2 étapes : personne → montant</Text>

      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>À qui tu demandes ?</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom ou numéro"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={fromWho}
            onChangeText={setFromWho}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !fromWho && styles.btnDisabled]}
            disabled={!fromWho}
            onPress={() => setStep(2)}
          >
            <Text style={styles.primaryBtnText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Montant demandé</Text>
          <Text style={styles.small}>À : {fromWho}</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 8000"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !amountNum && styles.btnDisabled]}
            disabled={!amountNum}
            onPress={() => {
              addTx({
                label: `← Demande à ${fromWho}`,
                amount: amountNum,
                fee: 0,
                currency: walletCurrency,
                status: "En cours",
              });

              Alert.alert("Demande envoyée", "La demande apparaît dans l'historique.");
              router.back();
            }}
          >
            <Text style={styles.primaryBtnText}>Envoyer la demande</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={() => setStep(1)}>
            <Text style={styles.linkText}>← Modifier</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E1B2E", padding: 20, paddingTop: 60 },
  title: { color: "#00C2A8", fontSize: 28, fontWeight: "900" },
  subtitle: { color: "white", opacity: 0.7, marginTop: 6, marginBottom: 14 },

  card: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 18, padding: 16 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "800", marginBottom: 12 },
  small: { color: "white", opacity: 0.75, marginBottom: 10 },

  input: { borderRadius: 14, padding: 14, backgroundColor: "rgba(0,0,0,0.25)", color: "white", fontSize: 18, marginBottom: 12 },

  primaryBtn: { backgroundColor: "#00C2A8", paddingVertical: 14, borderRadius: 14, alignItems: "center", marginTop: 8 },
  primaryBtnText: { color: "#0E1B2E", fontWeight: "900", fontSize: 16 },
  btnDisabled: { opacity: 0.4 },

  linkBtn: { marginTop: 12, alignItems: "center" },
  linkText: { color: "white", opacity: 0.7 },
});