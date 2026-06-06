import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import { supabase } from '../assets/supabase';

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleLogin = async () => {
        if (!email || !senha) { Alert.alert('Atenção', 'Preencha todos os campos.'); return; }
        if (!validarEmail(email)) { Alert.alert('Atenção', 'Digite um e-mail válido.'); return; }
        setCarregando(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        setCarregando(false);
        if (error) { Alert.alert('Erro', 'E-mail ou senha incorretos.'); }
        else { navigation.replace('Home'); }
    };

    return (
        <ImageBackground style={styles.container} source={require('../assets/bg-overlay.png')}>
            <Image style={styles.logo} source={require('../assets/unicopa.png')} />
            <Text style={styles.titulo}>LOGIN</Text>
            <View style={styles.form}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor="#8fa3b8"
                    value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <Text style={styles.label}>Senha</Text>
                <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#8fa3b8"
                    value={senha} onChangeText={setSenha} secureTextEntry />
                <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={carregando}>
                    <Text style={styles.botaoTexto}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkTexto}>Não tem conta? Cadastre-se</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#040b13', alignItems: 'center', justifyContent: 'center' },
    logo: { width: 200, height: 50, resizeMode: 'contain', marginBottom: 20 },
    titulo: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 30 },
    form: { width: 320 },
    label: { color: '#8fa3b8', fontSize: 13, marginBottom: 6 },
    input: { backgroundColor: '#0c1b2a', color: 'white', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#1e2d3d', fontSize: 15 },
    botao: { backgroundColor: '#f2cc2f', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 16 },
    botaoTexto: { color: '#040b13', fontWeight: '700', fontSize: 16 },
    linkTexto: { color: '#8fa3b8', textAlign: 'center', fontSize: 13 },
});