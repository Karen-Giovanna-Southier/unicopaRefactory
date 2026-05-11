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