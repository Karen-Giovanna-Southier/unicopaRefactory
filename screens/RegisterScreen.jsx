import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import { supabase } from '../assets/supabase';

export default function RegisterScreen({ navigation }) {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleRegister = async () => {
        if (!email || !senha || !confirmarSenha) { Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.'); return; }
        if (!validarEmail(email)) { Alert.alert('Atenção', 'Digite um e-mail válido.'); return; }
        if (senha.length < 6) { Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.'); return; }
        if (senha !== confirmarSenha) { Alert.alert('Atenção', 'As senhas não coincidem.'); return; }
        setCarregando(true);
        const { error } = await supabase.auth.signUp({ email, password: senha, options: { data: { nome } } });
        setCarregando(false);
        if (error) { Alert.alert('Erro', error.message); }
        else {
            Alert.alert('Sucesso', 'Cadastro realizado! Verifique seu e-mail.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        }
    };

    return (
        <ImageBackground style={styles.container} source={require('../assets/bg-overlay.png')}>
            <Image style={styles.logo} source={require('../assets/unicopa.png')} />
            <Text style={styles.titulo}>CADASTRO</Text>
            <View style={styles.form}>
                <Text style={styles.label}>Nome (opcional)</Text>
                <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor="#8fa3b8" value={nome} onChangeText={setNome} />
                <Text style={styles.label}>E-mail</Text>
                <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor="#8fa3b8"
                    value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <Text style={styles.label}>Senha</Text>
                <TextInput style={styles.input} placeholder="Mínimo 6 caracteres" placeholderTextColor="#8fa3b8"
                    value={senha} onChangeText={setSenha} secureTextEntry />
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput style={styles.input} placeholder="Repita a senha" placeholderTextColor="#8fa3b8"
                    value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
                <TouchableOpacity style={styles.botao} onPress={handleRegister} disabled={carregando}>
                    <Text style={styles.botaoTexto}>{carregando ? 'Cadastrando...' : 'Cadastrar'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkTexto}>Já tem conta? Faça login</Text>
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