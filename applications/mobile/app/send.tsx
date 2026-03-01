import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useWalletStore } from "../store/transactions";

export default function SendScreen() {
  const addTx = useWalletStore((s) => s.addTx);
  const updateStatus = useWalletStore((s) => s.updateStatus);
  const debit = useWalletStore((s) => s.debit);
  const balance = useWalletStore((s) => s.balance);
  const walletCurrency = useWalletStore((s) => s.walletCurrency);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const amountNum = useMemo(() => Math.round(Number(amount || 0)), [amount]);

  const fee = useMemo(() => {
    if (!amountNum) return 0;
    return Math.max(Math.round(amountNum * 0.01), 25);
  }, [amountNum]);

  const total = useMemo(() => (amountNum ? amountNum + fee : 0), [amountNum, fee]);

  const canPay = total > 0 && balance >= total;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Envoyer</Text>
      <Text style={styles.subtitle}>destinataire → montant → confirmer</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde</Text>
        <Text style={styles.balanceValue}>
          {balance} {walletCurrency}
        </Text>
      </View>

      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Destinataire</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom ou numéro"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={recipient}
            onChangeText={setRecipient}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !recipient && styles.btnDisabled]}
            disabled={!recipient}
            onPress={() => setStep(2)}
          >
            <Text style={styles.primaryBtnText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Montant</Text>
          <Text style={styles.small}>À : {recipient}</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 5000"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !amountNum && styles.btnDisabled]}
            disabled={!amountNum}
            onPress={() => setStep(3)}
          >
            <Text style={styles.primaryBtnText}>Voir les frais</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={() => setStep(1)}>
            <Text style={styles.linkText}>← Changer de destinataire</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Confirmation</Text>
          <Text style={styles.small}>À : {recipient}</Text>

          <View style={styles.row}>
            <Text style={styles.small}>Montant</Text>
            <Text style={styles.value}>
              {amountNum} {walletCurrency}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.small}>Frais</Text>
            <Text style={styles.value}>
              {fee} {walletCurrency}
            </Text>
          </View>

          <View style={styles.sep} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {total} {walletCurrency}
            </Text>
          </View>

          {!canPay && total > 0 && (
            <Text style={styles.warn}>
              Solde insuffisant. Il manque {Math.max(0, total - balance)} {walletCurrency}.
            </Text>
          )}

          <TouchableOpacity
            style={[styles.primaryBtn, !canPay && styles.btnDisabled]}
            disabled={!canPay}
            onPress={() => {
              debit(total);

              const id = addTx({
                label: `→ ${recipient}`,
                amount: amountNum,
                fee,
                currency: walletCurrency,
                status: "En cours",
              });

              setTimeout(() => updateStatus(id, "Envoyé"), 1000);

              Alert.alert("Envoyé", "Transfert en cours (statut mis à jour).");
              router.back();
            }}
          >
            <Text style={styles.primaryBtnText}>Envoyer maintenant</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={() => setStep(2)}>
            <Text style={styles.linkText}>← Modifier le montant</Text>
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

  balanceCard: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, marginBottom: 14 },
  balanceLabel: { color: "white", opacity: 0.7 },
  balanceValue: { color: "white", fontSize: 20, fontWeight: "900", marginTop: 6 },

  card: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 18, padding: 16 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "800", marginBottom: 12 },
  small: { color: "white", opacity: 0.75, marginBottom: 10 },

  input: { borderRadius: 14, padding: 14, backgroundColor: "rgba(0,0,0,0.25)", color: "white", fontSize: 18, marginBottom: 12 },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  value: { color: "white", fontWeight: "800" },
  sep: { height: 1, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 12 },
  totalLabel: { color: "white", fontSize: 16, fontWeight: "900" },
  totalValue: { color: "white", fontSize: 16, fontWeight: "900" },

  warn: { color: "white", opacity: 0.75, marginTop: 10 },

  primaryBtn: { backgroundColor: "#00C2A8", paddingVertical: 14, borderRadius: 14, alignItems: "center", marginTop: 12 },
  primaryBtnText: { color: "#0E1B2E", fontWeight: "900", fontSize: 16 },
  btnDisabled: { opacity: 0.4 },

  linkBtn: { marginTop: 12, alignItems: "center" },
  linkText: { color: "white", opacity: 0.7 },
});