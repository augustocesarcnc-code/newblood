# Automação VIP

O controlador roda no servidor. Só um `vipUntil` válido, concedido pelo fluxo de
pagamento ou pela criação explícita da demonstração local, permite configurar o
bot. O navegador não escolhe a validade do VIP, as coordenadas nem os resultados.

## Rotinas

- **Autopoção:** vida entre 10% e 90%, consumo de uma poção real, cura até 65 e
  recarga normal de 1,5 segundo. Não compra nem cria poções.
- **Autoalvo:** escolhe alvos vivos alcançáveis no mesmo mapa, dentro da área.
- **Autoataque:** usa o ataque normal e o alcance da arma, com recarga de 900 ms.
- **Habilidades:** escolhe habilidades ofensivas desbloqueadas, respeitando nível, mana e recargas individuais/globais.
- **Autobuff:** renova defesa e fúria desbloqueadas. A habilidade secundária, liberada no nível 3, mantém a
  recuperação de vida e concede defesa por 15 segundos: 20% da defesa equipada,
  mínimo de 3. O mesmo efeito existe no comando manual, para todas as contas.
- **Autohunt:** busca caminho pela grade até o alcance de ataque, sem atravessar
  paredes, jogadores, NPCs, portais ou diagonais com quinas bloqueadas.
- **Autolure:** com autohunt ativo, ao reunir dois ou mais monstros próximos,
  recua em direção ao ponto inicial. A agressividade normal faz o grupo seguir.
  Não permite controlar o número exato de monstros ou puxar através de paredes.
- **Autohunt PvP:** prioriza jogadores elegíveis. Requer PvP ativo no usuário e
  no alvo; zonas seguras continuam protegidas. Não liga o PvP automaticamente.

## Área e interrupções

A posição ao iniciar define a área de caça, com raio entre 3 e 12 casas. Inicie
fora da vila, perto dos monstros. Sem alvo na área, o bot aguarda. A rotina não
viaja entre mapas, percorre uma rota global nem funciona offline.

O bot pausa ao movimentar manualmente, perder conexão SSE, sair da conta,
reiniciar o servidor, morrer, mudar de mapa, entrar em troca ou expirar o VIP.
As preferências persistem; a execução nunca reinicia sozinha. PARAR AUTOMAÇÃO
funciona mesmo quando o VIP acabou. Não há autoequipamento nem venda automática.

## Demonstração

`node jogar.mjs --demo` cria três contas locais, com senha de demonstração,
VIP, nível 15 e recursos de teste em `.data-demo`. A criação é idempotente e não
sobrescreve progresso. Não adiciona endpoint administrativo ao servidor.
O jogo normal continua usando `.data` e personagens novos sem equipamentos.

## Validação

Os testes verificam validação de VIP e configurações, expiração, poções, buff,
alvos PvP, zonas seguras, busca de caminho, lure, pausa manual e desconexão.
A integração usa um servidor e arquivos temporários, sem dados reais.
