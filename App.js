import { StyleSheet, Text, Image, ImageBackground, SectionList } from 'react-native';
import { formatarData, agruparPorData } from './assets/utils';
import DiaCard from './components/DiaCard';
import dados from './assets/dados.json';

export default function App() {

  const jogos = dados.jogos

  const jogosAgrupados = agruparPorData(jogos);

  const jogosTratados = Object.keys(jogosAgrupados).map(data => ({
    title: formatarData(data),
    data: jogosAgrupados[data]
  }));

  return (
    <ImageBackground style={styles.container}
      source={require('./assets/bg-overlay.png')}>

      <Image style={styles.logo}
        source={require('./assets/unicopa.png')}
      />

      <Text style={styles.title}>CALENDÁRIO</Text>

      <SectionList
        sections={jogosTratados}
        keyExtractor={(item, index) => item + index}
        renderItem={() => null}
        renderSectionHeader={({ section }) => (
          <DiaCard title={section.title} data={section.data} />
        )}
      />

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#040b13',
    alignItems: 'center',
  },
  logo: {
    marginTop: 20,
    width: 200,
    height: 50,
    resizeMode: 'contain'
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
});