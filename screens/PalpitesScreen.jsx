import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../assets/supabase';

export default function PalpitesScreen({ navigation }) {

    const [jogos, setJogos] = useState([]);
    const [palpites, setPalpites] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        buscarUsuario();
    }, []);

    const buscarUsuario = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
            buscarJogos();
            buscarPalpites(user.id);
        }
    };

    const buscarJogos = async () => {
        setCarregando(true);
        const { data, error } = await supabase
            .from('jogos')
            .select('*')
            .eq('fase', 'Fase de grupos')
            .order('data_brasilia')
            .order('hora_brasilia');
        setCarregando(false);
        if (!error && data) setJogos(data);
    };

    const buscarPalpites = async (uid) => {
        const { data, error } = await supabase
            .from('palpites')
            .select('*')
            .eq('user_id', uid);
        if (!error && data) {
            const mapa = {};
            data.forEach(p => {
                mapa[p.jogo_id] = { casa: String(p.gols_casa), fora: String(p.gols_fora), confirmado: p.confirmado };
            });
            setPalpites(mapa);
        }
    };

    const jogoEncerrado = (jogo) => {
        const agora = new Date();
        const dataJogo = new Date(`${jogo.data_brasilia}T${jogo.hora_brasilia}:00`);
        return agora > dataJogo;
    };

    const atualizarPalpite = (jogoId, campo, valor) => {
        setPalpites(prev => ({ ...prev, [jogoId]: { ...prev[jogoId], [campo]: valor } }));
    };

    const handleSalvar = async () => {
        setSalvando(true);
        const preenchidos = jogos.filter(j =>
            palpites[j.id]?.casa !== undefined &&
            palpites[j.id]?.casa !== '' &&
            palpites[j.id]?.fora !== '' &&
            !jogoEncerrado(j)
        );
        if (preenchidos.length === 0) {
            Alert.alert('Atenção', 'Preencha pelo menos um palpite antes do jogo começar.');
            setSalvando(false);
            return;
        }
        for (const jogo of preenchidos) {
            const p = palpites[jogo.id];
            await supabase.from('palpites').upsert({
                jogo_id: jogo.id,
                user_id: userId,
                gols_casa: parseInt(p.casa),
                gols_fora: parseInt(p.fora),
                confirmado: false,
            }, { onConflict: 'jogo_id,user_id' });
        }
        setSalvando(false);
        navigation.navigate('MeusPalpites');
    };

    const renderJogo = ({ item }) => {
        const encerrado = jogoEncerrado(item);
        const palpite = palpites[item.id] || {};
        return (
            <View style={[styles.jogoCard, encerrado && styles.jogoEncerrado]}>
                <Text style={styles.jogoInfo}>{item.data_brasilia} • {item.hora_brasilia}</Text>
                <Text style={styles.jogoTimes}>{item.sigla_casa} x {item.sigla_fora}</Text>
                {encerrado ? (
                    <Text style={styles.encerradoTexto}>🔒 Jogo encerrado</Text>
                ) : (
                    <View style={styles.placarRow}>
                        <TextInput style={styles.placarInput} placeholder="0" placeholderTextColor="#8fa3b8"
                            keyboardType="numeric" maxLength={2} value={palpite.casa || ''}
                            onChangeText={v => atualizarPalpite(item.id, 'casa', v)} />
                        <Text style={styles.placarX}>x</Text>
                        <TextInput style={styles.placarInput} placeholder="0" placeholderTextColor="#8fa3b8"
                            keyboardType="numeric" maxLength={2} value={palpite.fora || ''}
                            onChangeText={v => atualizarPalpite(item.id, 'fora', v)} />
                    </View>
                )}
            </View>
        );
    };

    return (
        <ImageBackground style={styles.container} source={require('../assets/bg-overlay.png')}>
            <Text style={styles.titulo}>PALPITES</Text>
            {carregando ? (
                <ActivityIndicator color="#f2cc2f" size="large" style={{ marginTop: 40 }} />
            ) : (
                <FlatList data={jogos} keyExtractor={item => String(item.id)}
                    renderItem={renderJogo} contentContainerStyle={styles.lista} />
            )}
            <TouchableOpacity style={styles.botao} onPress={handleSalvar} disabled={salvando}>
                {salvando ? <ActivityIndicator color="#040b13" /> : <Text style={styles.botaoTexto}>Revisar Palpites</Text>}
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#040b13', alignItems: 'center' },
    titulo: { marginTop: 20, fontSize: 24, fontWeight: '700', color: 'white', marginBottom: 10 },
    lista: { paddingBottom: 100, paddingHorizontal: 20 },
    jogoCard: { backgroundColor: '#0c1b2a', borderRadius: 12, padding: 15, marginBottom: 12, width: 320, borderWidth: 1, borderColor: '#1e2d3d' },
    jogoEncerrado: { opacity: 0.5 },
    jogoInfo: { color: '#8fa3b8', fontSize: 11, marginBottom: 4 },
    jogoTimes: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    placarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    placarInput: { backgroundColor: '#1e2d3d', color: 'white', borderRadius: 8, padding: 10, width: 50, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
    placarX: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    encerradoTexto: { color: '#8fa3b8', fontSize: 12, fontStyle: 'italic' },
    botao: { position: 'absolute', bottom: 20, backgroundColor: '#f2cc2f', borderRadius: 10, paddingHorizontal: 40, paddingVertical: 14 },
    botaoTexto: { color: '#040b13', fontWeight: '700', fontSize: 16 },
});