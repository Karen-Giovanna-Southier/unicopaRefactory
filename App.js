import { StyleSheet, Text, Image, ImageBackground, SectionList, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { formatarData, agruparPorData, ehHoje } from './assets/utils';
import DiaCard from './components/DiaCard';
import dados from './assets/dados.json';

export default function App() {

  const jogos = dados.jogos;
  const [grupoAtivo, setGrupoAtivo] = useState('TODOS');

  const grupos = ['TODOS', ...new Set(jogos.filter(j => j.grupo).map(j => j.grupo))].sort();

  const jogosFiltrados = grupoAtivo === 'TODOS'
    ? jogos
    : jogos.filter(j => j.grupo === grupoAtivo);

  const jogosAgrupados = agruparPorData(jogosFiltrados);

  const jogosTratados = Object.keys(jogosAgrupados).sort().map(data => ({
    title: formatarData(data),
    data: jogosAgrupados[data],
    hoje: ehHoje(data),
  }));

  return (
    <ImageBackground style={styles.container}
      source={require('./assets/bg-overlay.png')}>

      <Image style={styles.logo}
        source={require('./assets/unicopa.png')}
      />

      <Text style={styles.title}>CALENDÁRIO</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtros}
        contentContainerStyle={styles.filtrosContent}>
        {grupos.map(grupo => (
          <TouchableOpacity
            key={grupo}
            style={[styles.filtroBotao, grupoAtivo === grupo && styles.filtroBotaoAtivo]}
            onPress={() => setGrupoAtivo(grupo)}
          >
            <Text style={[styles.filtroTexto, grupoAtivo === grupo && styles.filtroTextoAtivo]}>
              {grupo === 'TODOS' ? 'Todos' : `Grupo ${grupo}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionList
        sections={jogosTratados}
        keyExtractor={(item, index) => item + index}
        renderItem={() => null}
        renderSectionHeader={({ section }) => (
          <DiaCard title={section.title} data={section.data} hoje={section.hoje} />
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
  filtros: {
    marginTop: 12,
    marginBottom: 4,
    maxHeight: 40,
  },
  filtrosContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filtroBotao: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e2d3d',
    backgroundColor: '#0c1b2a',
  },
  filtroBotaoAtivo: {
    backgroundColor: '#f2cc2f',
    borderColor: '#f2cc2f',
  },
  filtroTexto: {
    color: '#8fa3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  filtroTextoAtivo: {
    color: '#040b13',
  },
});