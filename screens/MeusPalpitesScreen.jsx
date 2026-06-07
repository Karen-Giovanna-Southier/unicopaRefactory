import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../assets/supabase';

export default function MeusPalpitesScreen({ navigation }) {

    const [palpites, setPalpites] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState('todos');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        buscarUsuario();
    }, []);

    const buscarUsuario = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) { setUserId(user.id); buscarPalpites(user.id); }
    };

    const buscarPalpites = async (uid) => {
        setCarregando(true);
        const { data, error } = await supabase
            .from('palpites')
            .select('*, jogos(*)')
            .eq('user_id', uid);
        setCarregando(false);
        if (!error && data) setPalpites(data);
    };

    const jogoEncerrado = (jogo) => {
        if (!jogo) return false;
        const agora = new Date();
        const dataJogo = new Date(`${jogo.data_brasilia}T${jogo.hora_brasilia}:00`);
        return agora > dataJogo;
    };

    const handleConfirmar = async (palpiteId) => {
        Alert.alert('Confirmar palpite?', 'Após confirmar não será possível alterar.', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Confirmar', onPress: async () => {
                    await supabase.from('palpites').update({ confirmado: true }).eq('id', palpiteId);
                    buscarPalpites(userId);
                    Alert.alert('✅ Palpite confirmado!');
                }
            }
        ]);
    };

    const palpitesFiltrados = palpites.filter(p => {
        if (filtro === 'confirmados') return p.confirmado;
        if (filtro === 'pendentes') return !p.confirmado;
        return true;
    });

    const renderPalpite = ({ item }) => {
        const jogo = item.jogos;
        const encerrado = jogoEncerrado(jogo);
        return (
            <View style={[styles.card, encerrado && styles.cardEncerrado]}>
                <Text style={styles.cardData}>{jogo?.data_brasilia} • {jogo?.hora_brasilia}</Text>
                <Text style={styles.cardTimes}>{jogo?.sigla_casa} x {jogo?.sigla_fora}</Text>
                <Text style={styles.cardPlacar}>Palpite: {item.gols_casa} x {item.gols_fora}</Text>
                {item.confirmado
                    ? <Text style={styles.badgeConfirmado}>✅ Confirmado</Text>
                    : encerrado
                        ? <Text style={styles.badgeEncerrado}>🔒 Encerrado</Text>
                        : (
                            <TouchableOpacity style={styles.botaoConfirmar} onPress={() => handleConfirmar(item.id)}>
                                <Text style={styles.botaoConfirmarTexto}>Confirmar</Text>
                            </TouchableOpacity>
                        )
                }
            </View>
        );
    };

    return (
        <ImageBackground style={styles.container} source={require('../assets/bg-overlay.png')}>
            <Text style={styles.titulo}>MEUS PALPITES</Text>
            <View style={styles.filtros}>
                {['todos', 'pendentes', 'confirmados'].map(f => (
                    <TouchableOpacity key={f}
                        style={[styles.filtroBotao, filtro === f && styles.filtroBotaoAtivo]}
                        onPress={() => setFiltro(f)}>
                        <Text style={[styles.filtroTexto, filtro === f && styles.filtroTextoAtivo]}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {carregando ? (
                <ActivityIndicator color="#f2cc2f" size="large" style={{ marginTop: 40 }} />
            ) : palpitesFiltrados.length === 0 ? (
                <View style={styles.vazio}>
                    <Text style={styles.vazioTexto}>Você ainda não cadastrou palpites</Text>
                </View>
            ) : (
                <FlatList data={palpitesFiltrados} keyExtractor={item => String(item.id)}
                    renderItem={renderPalpite} contentContainerStyle={styles.lista} />
            )}
            <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#040b13', alignItems: 'center' },
    titulo: { marginTop: 20, fontSize: 24, fontWeight: '700', color: 'white', marginBottom: 10 },
    filtros: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    filtroBotao: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#1e2d3d', backgroundColor: '#0c1b2a' },
    filtroBotaoAtivo: { backgroundColor: '#f2cc2f', borderColor: '#f2cc2f' },
    filtroTexto: { color: '#8fa3b8', fontSize: 12 },
    filtroTextoAtivo: { color: '#040b13', fontWeight: '700' },
    lista: { paddingBottom: 80, paddingHorizontal: 20 },
    card: { backgroundColor: '#0c1b2a', borderRadius: 12, padding: 15, marginBottom: 12, width: 320, borderWidth: 1, borderColor: '#1e2d3d' },
    cardEncerrado: { borderColor: '#8fa3b8', opacity: 0.7 },
    cardData: { color: '#8fa3b8', fontSize: 11, marginBottom: 4 },
    cardTimes: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    cardPlacar: { color: '#f2cc2f', fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
    badgeConfirmado: { color: '#009C3B', fontSize: 12 },
    badgeEncerrado: { color: '#8fa3b8', fontSize: 12 },
    botaoConfirmar: { backgroundColor: '#009C3B', borderRadius: 8, padding: 8, alignItems: 'center', marginTop: 4 },
    botaoConfirmarTexto: { color: 'white', fontWeight: '700', fontSize: 13 },
    vazio: { marginTop: 60, alignItems: 'center' },
    vazioTexto: { color: '#8fa3b8', fontSize: 16 },
    botaoVoltar: { position: 'absolute', bottom: 20 },
    botaoVoltarTexto: { color: '#8fa3b8', fontSize: 14 },
});