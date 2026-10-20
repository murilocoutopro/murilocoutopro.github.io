# Testemunhos em vídeo — revisão local

A seção substitui somente “Uma mensagem que inspira fé”. O restante da página e o fluxo formulário → Supabase → WhatsApp foram preservados.

## Editar os conteúdos

Abra `src/data/testimonials.ts` e adicione os registros reais em `approvedTestimonials`:

- `id`: único e estável.
- `name` e `description`: nome e resumo autorizados, sem promessas médicas garantidas.
- `youtubeUrl`: link HTTPS real do Shorts; watch, youtu.be e embed também são aceitos.
- `thumbnailUrl`: reservado para futuras capas; o player atual utiliza a prévia nativa do YouTube.
- `context`: texto complementar opcional.
- `publicationAuthorized: true`: apenas depois de confirmar autorização de uso e divulgação do material e dos dados do participante.
- `isDemo`: omitir ou definir false nos registros definitivos.

Não há URLs de vídeo fictícias nos dados. Os três exemplos têm nomes explicitamente fictícios, descrições genéricas e a tarja “EXEMPLO DEMONSTRATIVO — NÃO PUBLICAR”. Só aparecem no servidor de desenvolvimento; Vite elimina seus registros do bundle de produção. Registros reais sem autorização ou link válido são ocultados. Sem conteúdo elegível, a seção inteira é ocultada no build de produção.

## Reprodução e privacidade

A pedido do responsável, o slide atual carrega diretamente o player nativo do YouTube com loading=lazy, youtube-nocookie, autoplay=0, playsinline e controles visíveis. Um aviso de privacidade acompanha o player. A conexão com Google/YouTube ocorre quando o iframe carrega, sem etapa adicional de permissão. Apenas um vídeo é incorporado por vez.

Mudar o slide desmonta imediatamente o iframe anterior. Não há avanço automático. “Desativar YouTube” remove o player. As teclas esquerda/direita, Home e End funcionam quando o carrossel está focado; não capturam as teclas do player. Swipe funciona sobre o texto; o iframe mantém seus próprios gestos e controles.

## Verificado

- TypeScript e build de produção sem erros.
- Conversão/validação de URLs e bloqueio de origens arbitrárias.
- Registros demonstrativos excluídos de produção; autorização exigida para registros reais.
- Botões, indicadores, loop, teclado e abertura do formulário existente no navegador.
- Player nativo 9:16, carregamento lazy e sem autoplay.

## Pendente

Os três links fornecidos foram cadastrados: Natália, Stefanny e Samira. Os players carregaram no navegador e trocar o slide remove o iframe anterior. A reprodução de Samira foi confirmada pelo controle Pausar vídeo. Resumos revisados a partir das informações fornecidas pelo responsável. Gestos touch em aparelho físico não foram exercitados.

Esta revisão não foi publicada em produção.
