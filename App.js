import { StyleSheet, Text, Image, ImageBackground, SectionList, TouchableOpacity, ScrollView, View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { formatarData, agruparPorData, jogoHoje } from './assets/utils';
import DiaCard from './components/DiaCard';
import ImportarJogos from './components/ImportarJogos';
import { supabase } from './assets/supabase';

export default function App() {

  const navigation = useNavigation();
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [grupoAtivo, setGrupoAtivo] = useState('TODOS');
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    buscarJogos();
    buscarFavoritos();
  }, []);

  const buscarJogos = async () => {
    setCarregando(true);
    const { data, error } = await supabase.from('jogos').select('*');
    setCarregando(false);
    if (!error && data) setJogos(data);
  };

  const buscarFavoritos = async () => {
    const { data, error } = await supabase.from('favoritos').select('jogo_id');
    if (!error && data) setFavoritos(data.map(f => f.jogo_id));
  };

  const toggleFavorito = async (jogoId) => {
    if (favoritos.includes(jogoId)) {
      await supabase.from('favoritos').delete().eq('jogo_id', jogoId);
      setFavoritos(prev => prev.filter(id => id !== jogoId));
    } else {
      await supabase.from('favoritos').insert({ jogo_id: jogoId });
      setFavoritos(prev => [...prev, jogoId]);
    }
  };

  const grupos = ['TODOS', ...new Set(jogos.filter(j => j.grupo).map(j => j.grupo))].sort();

  const jogosFiltrados = grupoAtivo === 'TODOS'
    ? jogos
    : jogos.filter(j => j.grupo === grupoAtivo);

  const jogosAgrupados = agruparPorData(jogosFiltrados);

  const jogosTratados = Object.keys(jogosAgrupados).sort().map(data => ({
    title: formatarData(data),
    data: jogosAgrupados[data],
    hoje: jogoHoje(data),
  }));

  return (
    <ImageBackground style={styles.container} source={require('./assets/bg-overlay.png')}>

      <Image style={styles.logo} source={require('./assets/unicopa.png')} />
      <Text style={styles.title}>CALENDÁRIO</Text>

      <ImportarJogos onImportar={buscarJogos} />

      {carregando ? (
        <ActivityIndicator color="#f2cc2f" size="large" style={{ marginTop: 40 }} />
      ) : jogos.length === 0 ? (
        <View style={styles.cardVazio}>
          <Text style={styles.cardVazioTexto}>⚽ Nenhum jogo carregado</Text>
          <Text style={styles.cardVazioSub}>Use o botão acima para importar os jogos.</Text>
        </View>
      ) : (
        <>
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
              <DiaCard
                title={section.title}
                data={section.data}
                hoje={section.hoje}
                favoritos={favoritos}
                onToggleFavorito={toggleFavorito}
              />
            )}
          />
        </>
      )}

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBotao} onPress={() => navigation.navigate('Palpites')}>
          <Text style={styles.navTexto}>⚽ Palpites</Text>
        </TouchableOpacity>
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { height: '100%', width: '100%', backgroundColor: '#040b13', alignItems: 'center' },
  logo: { marginTop: 20, width: 200, height: 50, resizeMode: 'contain' },
  title: { marginTop: 10, fontSize: 28, fontWeight: '700', color: 'white' },
  cardVazio: {
    marginTop: 60,
    backgroundColor: '#0c1b2a',
    width: 320,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e2d3d',
  },
  cardVazioTexto: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardVazioSub: { color: '#8fa3b8', fontSize: 13, textAlign: 'center' },
  filtros: { marginTop: 12, marginBottom: 4, maxHeight: 50 },
  filtrosContent: { paddingHorizontal: 16, gap: 8 },
  filtroBotao: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e2d3d',
    backgroundColor: '#0c1b2a',
  },
  filtroBotaoAtivo: { backgroundColor: '#f2cc2f', borderColor: '#f2cc2f' },
  filtroTexto: { color: '#8fa3b8', fontSize: 12, fontWeight: '600' },
  filtroTextoAtivo: { color: '#040b13' },
  navBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#0c1b2a',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e2d3d',
  },
  navBotao: {
    backgroundColor: '#f2cc2f',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  navTexto: { color: '#040b13', fontWeight: '700', fontSize: 14 },
});