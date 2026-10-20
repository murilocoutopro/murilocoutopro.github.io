# Configurar o Supabase — Fluxos de Cura 2026

## O que já foi feito e o que falta

O formulário, a migração SQL e a Edge Function estão prontos no projeto. Foram testados com um PostgreSQL temporário e serviços simulados. **Ainda não houve gravação no seu Supabase, implantação da função ou publicação do site.**

Pelo painel aberto no navegador, foi confirmado um projeto ativo:
- Project reference: `cxbgtgeetxgbcololdju`.
- Project URL: `https://cxbgtgeetxgbcololdju.supabase.co`.
- Região atual: East US / North Virginia, `us-east-1`.
- O painel indicava a branch `main / PRODUCTION`.

Como você pediu aprovação antes de produção, não alterei esse banco nem implantei a função. Os próximos passos ativam o backend; faça-os apenas depois de revisar e aprovar a configuração. Não é necessário instalar um plugin do ChatGPT.

## 1. Escolher o projeto

Você pode utilizar o projeto atual. Não é necessário criar outro nem trocar a região apenas para começar.

Se preferir um projeto exclusivo:
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard).
2. Na sua organização, clique em **New project**.
3. Nomeie como `fluxos-de-cura-2026`.
4. Defina e guarde a senha do banco em um gerenciador de senhas.
5. Para a audiência de Caucaia, selecione **South America — São Paulo (sa-east-1)**, se disponível.
6. Confira o plano e os custos apresentados antes de confirmar. Aguarde o provisionamento.
7. Selecione o novo projeto e utilize a URL/reference dele nos passos abaixo; não misture credenciais de projetos.

O projeto atual está nos Estados Unidos. A região São Paulo é uma alternativa para um projeto novo; mudar a região de um projeto existente exige planejamento/migração. A escolha de região não resolve sozinha todas as exigências de transferência internacional de dados dos demais serviços.

## 2. Encontrar a URL e a chave publicável

No projeto, clique em **Connect**. O diálogo mostra a URL e a chave publicável. Também é possível abrir **Project Settings > API Keys**.

- A URL atual já foi verificada e está em `.env.example`.
- Copie a **Publishable key**, que começa com `sb_publishable_`.
- Não copie `sb_secret_` nem a chave antiga `service_role` para o site.
- Este projeto de frontend recusa chaves secretas e JWTs antigos no campo de chave publicável.
- Não envie senhas ou chaves secretas por mensagem.

A chave publicável pode estar no navegador, mas **não dá acesso aos inscritos**: a tabela terá RLS e nenhum privilégio para visitantes.

## 3. Criar as tabelas e funções do banco

### Pelo painel, sem instalar ferramentas

1. Abra **SQL Editor > New query** no projeto correto.
2. Abra o arquivo do pacote:
   `supabase/migrations/20261019160000_event_registrations.sql`.
3. Copie todo o conteúdo para a nova consulta.
4. Revise e clique em **Run**.
5. A migração usa uma transação: se já houver uma tabela com o mesmo nome, ela falha e não sobrescreve o seu trabalho.
6. Abra **Table Editor**, schema **public**. Devem aparecer:
   - `event_registrations`: inscrições privadas.
   - `registration_rate_limits`: contadores de proteção, sem contatos ou IPs em texto.
7. Confirme que a tabela de inscrições indica **RLS enabled**.
8. Não crie políticas liberando SELECT, INSERT, UPDATE ou DELETE para `anon`/`authenticated`.

A migração também cria funções internas executáveis apenas pelo papel de servidor:
- `consume_registration_rate_limit`.
- `save_event_registration`.
- `purge_expired_event_registrations`.

Os timestamps são gerados no banco, em `timestamptz`. O visitante não define o instante do consentimento.

### Alternativa por CLI

No PowerShell, dentro da pasta do projeto, com Node instalado:

```powershell
npx supabase login
npx supabase link --project-ref cxbgtgeetxgbcololdju
npx supabase db push
```

O login pode abrir uma página de autenticação. Complete você mesmo as solicitações de login e eventual senha do banco. Se usar um projeto novo, substitua a reference pela que o painel mostra.

**Escolha uma rota para aplicar a migração.** Se executou o SQL manualmente, não repita `db push` sem antes reconciliar o histórico. Para registrar essa aplicação manual no histórico da CLI, após verificar que ela terminou integralmente:

```powershell
npx supabase migration repair 20261019160000 --status applied
```

Não use esse comando para ocultar falhas ou marcar uma migração que não foi realmente executada.

## 4. Configurar os segredos da Edge Function

Em **Edge Functions > Secrets**, adicione:

| Nome | Valor |
|---|---|
| `ALLOWED_ORIGINS` | Origens exatas permitidas, separadas por vírgula. Para teste: `http://127.0.0.1:5188,http://localhost:5188`. |
| `REGISTRATION_RATE_LIMIT_SALT` | Um valor aleatório longo, com pelo menos 32 caracteres. |
| `TURNSTILE_SECRET_KEY` | Opcional; secret key do widget Turnstile, somente se ativar o CAPTCHA. |

Para gerar o salt localmente, você pode executar:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Cole o resultado **somente no campo do segredo**. Não o coloque em arquivos públicos. Mantenha esse salt estável durante a campanha; ele é usado em hashes de deduplicação e limitação.

A função lê automaticamente `SUPABASE_URL` e a chave administrativa de `SUPABASE_SECRET_KEYS`, com suporte à variável legada `SUPABASE_SERVICE_ROLE_KEY` fornecida pelo ambiente hospedado. Não é preciso copiá-las para o frontend. O prefixo `SUPABASE_` é reservado pelo serviço; não tente cadastrar segredos customizados com esse prefixo.

Quando o endereço final do site estiver aprovado, acrescente sua origem HTTPS exata a `ALLOWED_ORIGINS`. Não inclua caminhos, barra final ou `*`. Exemplo: origem é `https://dominio.com`, não `https://dominio.com/inscricao`.

CORS restringe navegadores, mas não autentica visitantes nem impede sozinho chamadas automatizadas. A função também aplica honeypot e limites persistentes: 400 tentativas por 10 minutos na campanha e 5 por 10 minutos por contato telefônico pseudonimizado. Não há coleta de IP. Para maior proteção em tráfego público, configure o Turnstile.

## 5. Implantar a função, após aprovação

A rota recomendada é a CLI, pois o código contém três arquivos:

- `supabase/functions/register-lead/index.ts`.
- `supabase/functions/register-lead/handler.ts`.
- `supabase/functions/_shared/validation.ts`.

Com o projeto já vinculado:

```powershell
npx supabase functions deploy register-lead --no-verify-jwt
```

Isso **implanta um endpoint no Supabase**; não publica a landing page. A configuração `verify_jwt = false` já está no arquivo `supabase/config.toml`: o visitante não precisa criar conta. As proteções de origem, campos, consentimento, tamanho de requisição e rate limit continuam no código. As funções internas do banco continuam indisponíveis ao público.

Se usar o editor do Dashboard, mantenha os mesmos nomes/caminhos dos arquivos e a mesma configuração pública de JWT. Não cole apenas o index ignorando os imports. Se o editor não permitir essa estrutura, use a CLI.

## 6. Conectar a landing page

Na pasta principal, copie `.env.example` para `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://cxbgtgeetxgbcololdju.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_TURNSTILE_SITE_KEY=
```

Preencha a chave publicável real. A chave Turnstile é opcional. Valores com prefixo `VITE_` entram no bundle público; nunca use uma chave privilegiada.

Depois reinicie o servidor de desenvolvimento:

```powershell
npm ci
npm run dev -- --port 5188
```

A função não exige login do visitante. A chamada usa fetch para `/functions/v1/register-lead`. O frontend **não escreve diretamente na tabela**.

Sem configuração, o formulário informa indisponibilidade, preserva os campos e **não mostra inscrição concluída nem abre o grupo**.

## 7. Turnstile opcional

1. No painel Cloudflare, abra **Turnstile > Add widget**.
2. Cadastre o hostname do domínio e os hostnames de desenvolvimento permitidos.
3. Coloque a **Site key** no `VITE_TURNSTILE_SITE_KEY` do site.
4. Coloque a **Secret key** apenas no segredo `TURNSTILE_SECRET_KEY` da função.
5. Refaça o build/reinicie o Vite após mudar a chave pública.
6. Teste o desafio. O servidor valida token, hostname e action `event_registration`.
7. Token inválido, expirado ou indisponível impede salvar/redirecionar. Um erro solicita novo desafio no retry.

Não configure somente um lado: uma chave secreta no servidor sem widget no site bloqueará os envios. A integração do Turnstile foi preparada e coberta por verificação de código, mas ainda precisa de um teste com chaves reais.

## 8. Teste real obrigatório antes de anúncios

1. Confirme migração, função implantada, origens e env do site.
2. Abra a landing page de teste.
3. Confira que os dois consentimentos começam desmarcados.
4. Envie vazio, e-mail inválido e telefone incompleto: devem aparecer erros.
5. Faça uma inscrição de teste autorizada usando um contato de teste sob seu controle.
6. Em **Table Editor > event_registrations**, confira nome, e-mail, telefone `+55...`, UTMs, consentimento, versão do aviso e timestamp.
7. Só após a confirmação do servidor, a página deve mostrar **Inscrição recebida** e tentar abrir o grupo:
   `https://chat.whatsapp.com/GTjgkweL5UR7KAAdaO2DDe`.
8. Se a navegação automática for bloqueada, use **Entrar no grupo**.
9. Confira que a autorização futura corresponde à escolha feita, inclusive quando desmarcada.
10. Para testar repetição, use o mesmo envio/mesma requisição: a função não deve inserir uma linha duplicada.
11. Teste falha de API/internet. O formulário deve manter os campos, permitir nova tentativa e não exibir sucesso falso.
12. Faça a conferência final em aparelhos reais, inclusive dentro do Instagram e Facebook. Não houve acesso a esses navegadores internos nesta sessão.
13. A inscrição no banco não comprova entrada efetiva no grupo do WhatsApp.

Não use a chave administrativa para testar leitura pública. Utilize a chave **publicável**: SELECT/UPDATE/DELETE na tabela e RPCs internas precisam falhar para visitantes, mesmo se a chave estiver visível no navegador.

## 9. Visualizar os inscritos e os resultados

No painel, use **Table Editor > event_registrations**, ordenado por `created_at` decrescente. Filtros por `utm_campaign`, `utm_content` e `utm_source` mostram campanha e criativo. A coluna `future_communications_opt_in` distingue quem autorizou comunicações futuras.

No SQL Editor, somente na sua sessão administrativa, exemplos:

```sql
select count(*) as total_inscricoes
from public.event_registrations
where campaign = 'fluxos2026_presencial';

select full_name, email, phone,
       created_at at time zone 'America/Sao_Paulo' as horario_brasilia,
       utm_source, utm_campaign, utm_content,
       future_communications_opt_in
from public.event_registrations
order by created_at desc;
```

Essas consultas não devem virar uma listagem pública no site. Restrinja o acesso ao projeto às pessoas que realmente precisam organizar o evento.

## 10. Privacidade, retenção e atendimento

O formulário trata o contexto religioso como potencialmente sensível. O responsável pela igreja deve revisar o aviso, a finalidade, o contato de atendimento, contratos dos prestadores e salvaguardas de transferência internacional antes de ativar a coleta. O texto não é uma certificação de conformidade jurídica.

O aviso propõe:
- Sem autorização futura: eliminar até 90 dias depois do evento.
- Com autorização futura: uso por até um ano, ou revogação anterior.
- Sem coleta de saúde, diagnóstico, senha ou documento.

A função privada `purge_expired_event_registrations` foi incluída na migração, mas a rotina automática **não foi ativada**. Depois de aprovar a política, habilite `pg_cron` em Database > Extensions e revise `supabase/retention-cron.sql` antes de executá-lo. Ele agenda uma limpeza diária e elimina definitivamente os registros expirados. Confirme o sucesso do agendamento e acompanhe a rotina; enquanto ele não estiver ativo, a responsabilidade de eliminar os dados no prazo é manual.

Pedidos de exclusão/revogação devem ser atendidos por uma pessoa autorizada na administração. Não exponha um endpoint de exclusão pública por e-mail/telefone. Revogar mensagens futuras e eliminar a inscrição são solicitações distintas.

Se alterar a versão/texto de consentimento, atualize `PRIVACY_VERSION` no arquivo compartilhado e crie uma nova migração para a constraint do banco. Preserve o histórico da versão apresentada.

## 11. Publicar o site, somente após aprovação

Após validar a gravação real:
1. Configure as variáveis públicas no provedor de hospedagem.
2. Execute `npm run check` e `npm run build`.
3. Publique a pasta `dist`.
4. Atualize `ALLOWED_ORIGINS` na função com a origem HTTPS aprovada.
5. Confira SEO/Open Graph no domínio final e repita uma inscrição real de teste.

Chaves de servidor não devem estar no `dist`, no Git, no HTML, em imagens ou em ferramentas de análise. Não coloque contatos pessoais nas UTMs.

Eventos opcionais: `registration_started`, `registration_submitted`, `registration_saved`, `whatsapp_redirect`. Enviam posição do botão e UTMs, não o conteúdo do formulário. Dependem do consentimento de medição separado.

## Referências oficiais consultadas

- [Supabase: regiões disponíveis](https://supabase.com/docs/guides/platform/regions)
- [Supabase: chaves de API](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase: segredos das funções](https://supabase.com/docs/guides/functions/secrets)
- [Supabase: configuração das funções](https://supabase.com/docs/guides/functions/function-configuration)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Cloudflare: validação de tokens Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [LGPD: texto compilado, especialmente artigos 5º e 11](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm)

