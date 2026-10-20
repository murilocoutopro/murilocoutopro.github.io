# Fluxos de Cura 2026 — Caucaia

Projeto existente React + Vite + TypeScript. Presencial: 24/10/2026, sábado, 17h, Christ Embassy Caucaia, Rua Tampico, 440.

## GitHub Pages

Destino autorizado: https://murilocoutopro.github.io/. Publicação por GitHub Actions em main. O guia está em docs/GITHUB-PAGES.md. Valores de frontend públicos em config/public-build.json; nenhuma chave administrativa é necessária. Execute node scripts/prepare-public-env.mjs antes do build em uma cópia limpa.

## Estado atual
- Supabase conectado ao projeto existente cxbgtgeetxgbcololdju.
- Tabela privada event_registrations, RLS, idempotência, consentimentos, UTMs e limites persistentes implantados.
- Função register-lead ativa. Formulário → confirmação de persistência → convite do WhatsApp.
- Testes reais com dados sintéticos e navegação ao convite conferidos; registros técnicos removidos.
- Hero com Pastor Joaquim mais visível e fotos preservadas; logo dourada independente do fundo.
- Site: https://fluxos-cura-caucaia-2026.alertteal3.chatgpt.site (acesso privado preservado).

## Executar
npm ci
npm run dev -- --port 5188 --mode production
npm run build
npm run preview

.env.production contém apenas URL e chave publicável. Nunca coloque secret/service_role em variáveis VITE_. Credenciais administrativas ficam exclusivamente no servidor.

Origens padrão exatas: Site hospedado, localhost e 127.0.0.1:5188. ALLOWED_ORIGINS permite substituí-las no servidor. REGISTRATION_RATE_LIMIT_SALT pode substituir o HMAC derivado; sua troca altera a deduplicação por conteúdo. O request_id continua protegido contra conteúdo conflitante.

## Organização
- src/config.ts: evento, imagem e convite centralizados.
- src/components/Brand.tsx: marca dourada; demais componentes preservados.
- src/services/registration.ts e registrationRedirect.ts: confirmação estrita e navegação.
- supabase/functions e migrations: backend implantado, validação compartilhada e estrutura privada.
- supabase/retention-cron.sql: rotina opcional ainda não ativada.
- docs/VALIDACAO.md: evidências e limites atuais.
- docs/CONFIGURAR_SUPABASE.md: referência da configuração; ativação inicial já concluída.
- scripts/prepare-approved-art.ps1: reprodução da edição localizada preservando fotos originais.

Medição opcional permanece dependente de consentimento e IDs configurados. Abertura do convite não comprova entrada no grupo. Nenhuma dependência nova de produção.