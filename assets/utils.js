export function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}`;
}

export function agruparPorData(jogos) {
  return jogos.reduce((acc, jogo) => {
    const data = jogo.data_brasilia;
    if (!acc[data]) acc[data] = [];
    acc[data].push(jogo);
    return acc;
  }, {});
}
export function ordenarPorHora(jogos) {
  return [...jogos].sort((a, b) =>
    a.hora_brasilia.localeCompare(b.hora_brasilia)
  );
}
export function jogoHoje(data) {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return data === `${ano}-${mes}-${dia}`;
}