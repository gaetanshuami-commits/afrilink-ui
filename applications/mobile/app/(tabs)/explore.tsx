import { StyleSheet, Text, View } from "react-native";
import { useWalletStore } from "../../store/transactions";

function formatTime(ts: number) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function HistoryScreen() {
  const txs = useWalletStore((s) => s.txs);
  const walletCurrency = useWalletStore((s) => s.walletCurrency);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique</Text>
      <Text style={styles.subtitle}>⏳ en cours • ✔ envoyé • ✔✔ reçu</Text>

      {txs.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Aucune transaction pour le moment.</Text>
        </View>
      ) : (
        txs.map((tx) => (
          <View key={tx.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>{tx.label}</Text>
              <Text style={styles.amount}>
                {tx.amount} {tx.currency ?? walletCurrency}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.meta}>Frais : {tx.fee} {tx.currency ?? walletCurrency}</Text>
              <Text style={styles.meta}>{formatTime(tx.createdAt)}</Text>
            </View>

            <Text style={styles.status}>
              {tx.status === "En cours"
                ? "⏳ En cours"
                : tx.status === "Envoyé"
                ? "✔ Envoyé"
                : "✔✔ Reçu"}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E1B2E", padding: 20, paddingTop: 60 },
  title: { color: "#00C2A8", fontSize: 28, fontWeight: "900", marginBottom: 6 },
  subtitle: { color: "white", opacity: 0.7, marginBottom: 16 },

  emptyCard: { backgroundColor: "rgba(255,255,255,0.08)", padding: 16, borderRadius: 16 },
  emptyText: { color: "white", opacity: 0.8 },

  card: { backgroundColor: "rgba(255,255,255,0.08)", padding: 14, borderRadius: 16, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { color: "white", fontWeight: "800" },
  amount: { color: "white", fontWeight: "800" },
  meta: { color: "white", opacity: 0.7 },
  status: { color: "white", opacity: 0.8, marginTop: 4 },
});