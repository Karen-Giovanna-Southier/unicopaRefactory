import { View, Text, StyleSheet } from 'react-native';
import GameCard from './GameCard';
import { ordenarPorHora } from '../assets/utils';

export default function DiaCard({ title, data, hoje, favoritos, onToggleFavorito }) {

  const jogosOrdenados = ordenarPorHora(data);

  return (
    <View style={[styles.card, hoje && styles.cardHoje]}>
      <View style={styles.headerData}>
        <Text style={styles.data}>{title}</Text>
        {hoje && <Text style={styles.badgeHoje}>HOJE</Text>}
      </View>
      {jogosOrdenados.map(jogo => (
        <GameCard
          key={jogo.id}
          game={jogo}
          favoritado={favoritos?.includes(jogo.id)}
          onToggleFavorito={onToggleFavorito}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 20, backgroundColor: '#0c1b2a', width: 320, borderRadius: 12, padding: 15 },
  cardHoje: { borderWidth: 2, borderColor: '#f2cc2f' },
  headerData: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  data: { color: '#f2cc2f', fontSize: 22, fontWeight: 'bold' },
  badgeHoje: {
    backgroundColor: '#f2cc2f',
    color: '#040b13',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
});