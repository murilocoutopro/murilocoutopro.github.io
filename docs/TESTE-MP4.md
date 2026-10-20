# Teste local — MP4 no carrossel (19/10/2026)

Teste inicial realizado sem publicação. Após aprovação do responsável, a configuração escolhida para publicação mantém Natália em MP4 e Stefanny/Samira no YouTube. As evidências abaixo descrevem o teste inicial dos três MP4.

## Configuração

Em src/data/testimonials.ts, cada registro aceita videoSource: 'mp4' ou 'youtube'.
mp4Url contém a URL pública fornecida. youtubeUrl foi preservado para voltar à integração anterior alterando apenas videoSource.
Nomes, ordem, resumos, layout e demais seções preservados. Não houve alteração de bucket, permissões, tabela, função ou formulário.

## Player

HTML5 com controls, playsInline e preload=metadata; sem autoplay ou loop. Apenas o slide atual contém um vídeo. A troca desmonta o player anterior e sua limpeza executa pause, remove src e load para cancelar o carregamento. Estado de carregamento e erro com tentativa novamente. A resolução não foi alterada; object-fit:contain mantém a imagem inteira em 9:16.
preload=metadata é uma indicação ao navegador, não uma garantia de quantidade exata de bytes transferidos.

## Evidências

- TypeScript e build aprovados; testes de conversão de URLs e exclusão de demonstrações aprovados.
- As três URLs responderam 206 a Range bytes=0-1023, com Content-Type video/mp4.
- Tamanhos: Natália 29.047.355 bytes; Samira 25.700.231; Stefanny 30.038.910.
- Chrome desktop: metadados e reprodução confirmados nos três arquivos; todos 720x1280.
- Durações: Natália 81,41s; Stefanny 145,82s; Samira 239,26s.
- Play/pause confirmados; áudio/mute e avanço por teclado confirmados. Mudança de slide durante reprodução: somente um vídeo permaneceu no DOM e o novo iniciou pausado em zero.
- MP4: ftyp/moov no início dos três arquivos; avc1 identificado nos três. mp4a identificado nos primeiros trechos de Natália e Stefanny; codec de áudio de Samira não analisado integralmente. Reprodução funcionou no Chrome.
- Viewport 390px sem transbordamento horizontal. Isso não equivale a teste em iPhone/Android físicos.
- Android, Safari/iPhone e navegadores internos Instagram/Facebook não foram testados em aparelhos reais.
- Preview da rede local respondeu 200: http://192.168.1.47:5193/#sobre. Requer a mesma rede e acesso permitido pelo firewall. Esse endereço se destina ao teste dos vídeos; a origem da rede local não foi adicionada às origens autorizadas do backend de inscrição.

## Desempenho e limites

Sondagens HTTP de 1KB, em paralelo: Natália 4041ms, Samira 1573ms, Stefanny 1871ms. Uma segunda requisição de 1MB para Natália respondeu em 470ms. São amostras isoladas com condições de cache distintas, não tempos de início de reprodução nem benchmark comparativo com YouTube.
Bundle JS gzip: 79,57KB antes, 80,01KB agora. Nenhuma dependência adicionada. Não houve teste prolongado nem simulação de rede lenta; não se pode concluir ausência de travamentos em uso real.

## Custos

Os três arquivos somam aproximadamente 84,79MB. Mil transferências completas de cada um somariam aproximadamente 84,79GB, antes de considerar cache, reproduções parciais e requisições repetidas. Storage e tráfego contam no plano Supabase; cotas e excedentes devem ser conferidos no painel. YouTube mantém a entrega do vídeo fora do tráfego do projeto Supabase. Não foi medida superioridade de velocidade.
Fontes: https://supabase.com/docs/guides/storage/serving/downloads e https://supabase.com/docs/guides/platform/manage-your-usage/egress.
