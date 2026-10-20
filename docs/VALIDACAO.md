# Validação — 19/10/2026

## Backend real
- Projeto existente cxbgtgeetxgbcololdju conectado; nenhuma nova conta/projeto.
- Migração event_registrations aplicada. Tabelas de leads e limites com RLS e sem leitura/escrita para anon/authenticated.
- Edge Function register-lead ativa: validação, honeypot, limites persistentes, origens explícitas, sem dados pessoais na resposta.
- Segredos administrativos somente no ambiente nativo do Supabase. HMAC derivado no servidor quando não há salt customizado.
- POST real HTTP 200, saved:true e recibo correspondente; linha, +55, consentimento e UTMs conferidos no banco.
- Chrome mobile: formulário enviado, gravação confirmada e navegação ao convite WhatsApp configurado.
- Preflight permitido: 204; origem não permitida: 403.
- Dois cadastros técnicos removidos pelos IDs/e-mails exatos; nenhum lead real alterado.
- Auditoria: somente avisos informativos de RLS sem políticas, intencional para tabelas privadas.

## Frontend e imagem
- TypeScript e build aprovados; testes existentes de falhas, validação, permissões, idempotência e redirect após saved aprovados.
- Conferidos desktop, largura 849 px da anotação e mobile 390 px, sem overflow horizontal.
- Logo dourada extraída da arte aprovada e aplicada independentemente no cabeçalho/rodapé.
- Logo embutida removida por edição localizada do fundo; fotografias originais preservadas fora dessa região.
- Gradiente deslocado para baixo para revelar o Pastor Joaquim.

## Limites
- Abrir convite não confirma adesão ao grupo; ela é concluída no WhatsApp.
- Turnstile opcional sem chaves reais. Aparelhos físicos e navegadores internos Instagram/Facebook não exercitados.
- Rotina automática de retenção ainda não ativada.
- Acesso privado do Site preservado.