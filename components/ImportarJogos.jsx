import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../assets/supabase';
import dados from '../assets/dados.json';

export default function ImportarJogos() {

  const [status, setStatus] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleImportar = async () => {
    setCarregando(true);
    setStatus('');

    const jogos = dados.jogos.map(j => ({
      id: j.id,
      fase: j.fase,
      grupo: j.grupo,
      data_brasilia: j.data_brasilia,
      hora_brasilia: j.hora_brasilia,
      time_casa: j.time_casa,
      sigla_casa: j.sigla_casa,
      time_fora: j.time_fora,
      sigla_fora: j.sigla_fora,
      confronto: j.confronto,
      estadio: j.estadio,
      cidade: j.cidade,
      pais: j.pais,
    }));

    const { error } = await supabase
      .from('jogos')
      .upsert(jogos, { onConflict: 'id' });

    setCarregando(false);

    if (error) {
      setStatus('Erro ao importar: ' + error.message);
    } else {
      setStatus('✅ ' + jogos.length + ' jogos importados com sucesso!');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={handleImportar} disabled={carregando}>
        {carregando
          ? <ActivityIndicator color="#040b13" />
          : <Text style={styles.botaoTexto}>Importar Jogos para o Banco</Text>
        }
      </TouchableOpacity>
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
  },
  botao: {
    backgroundColor: '#f2cc2f',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  botaoTexto: {
    color: '#040b13',
    fontWeight: '700',
    fontSize: 14,
  },
  status: {
    color: 'white',
    marginTop: 10,
    fontSize: 13,
    textAlign: 'center',
  },
});