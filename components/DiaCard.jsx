import { View, Text, StyleSheet } from 'react-native';
import GameCard from './GameCard';
import { ordenarPorHora } from '../assets/utils';

export default function DiaCard({ title, data, hoje }) {

  const jogosOrdenados = ordenarPorHora(data);

  console.log('hoje', hoje);

  return (
    <View style={[styles.card, hoje && styles.cardHoje]}>
      <Text style={styles.data}>{title}</Text>
      {jogosOrdenados.map(jogo => <GameCard key={jogo.id} game={jogo} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    backgroundColor: '#0c1b2a',
    width: 320,
    borderRadius: 12,
    padding: 15,
  },
  data: {
    color: '#f2cc2f',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardHoje: {
    borderWidth: 2,
    borderColor: '#f2cc2f',
  },
});