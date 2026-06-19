import { View, Text, StyleSheet } from 'react-native';
import GameCard from './GameCard';
import { ordenarPorHora } from '../assets/utils';

export default function DiaCard({ title, data,hoje }) {

  const jogosOrdenados = ordenarPorHora(data);

  console.log('hoje', hoje);

  return (
    <View style={styles.card}>
      <Text style={styles.data,hoje && styles.hoje}>{title} - {hoje ? 'sim': 'não'}</Text>
      {jogosOrdenados.map(jogo => <GameCard key={jogo.id} game={jogo} hoje={hoje} />)}
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
    marginBottom: 10
  },
  hoje:{
    backgroundColor: '#009C3B',
  }
});