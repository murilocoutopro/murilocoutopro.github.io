# Atualização autorizada — 20/10/2026

O responsável confirmou a renomeação para murilocoutopro.github.io e autorizou o envio/publicação. A origem nova foi aplicada na função register-lead e o preflight retornou 204 para o domínio GitHub e o domínio antigo. O workflow foi liberado para publicar em main. A configuração de Pages e o resultado do primeiro deploy devem ser verificados no GitHub; não presuma que a publicação terminou apenas porque os arquivos foram enviados.

---

## Registro da preparação anterior (etapas de bloqueio abaixo são históricas)

# Publicação no GitHub Pages — conferência antes de ativar

## Estado desta entrega

Projeto React 19 + Vite 6 + TypeScript preservado. Nenhuma atualização foi publicada no GitHub Pages. O site já publicado no ChatGPT Sites continua ativo.

A conta conectada é **murilocoutopro**. O repositório encontrado foi **murilocoutopro/murilocouto.github.io**. Para usar base `/`, renomeie-o para **murilocoutopro.github.io**, como escolhido na conferência. O destino será https://murilocoutopro.github.io/.

O acesso de leitura pela conexão funcionou, mas o Git local não tem credencial de envio. O ZIP contém o projeto completo, sem histórico Git, node_modules, dist, arquivos .env de execução ou metadados de hospedagem do ChatGPT. Não foi enviado código incompleto ao repositório.

## 1. Renomear o repositório

1. Abra https://github.com/murilocoutopro/murilocouto.github.io/settings.
2. Em General, altere Repository name para `murilocoutopro.github.io` e clique Rename.
3. O endereço do repositório passa a ser https://github.com/murilocoutopro/murilocoutopro.github.io.
4. Não crie outro repositório e não compre domínio para este teste.

## 2. Enviar pelo GitHub Desktop

1. Instale o GitHub Desktop de https://desktop.github.com/ e entre na conta murilocoutopro.
2. Escolha File > Clone repository > URL.
3. Informe https://github.com/murilocoutopro/murilocoutopro.github.io e escolha uma pasta vazia.
4. Extraia o ZIP desta entrega em outra pasta.
5. Copie o CONTEÚDO da pasta do projeto extraído para a pasta clonada: package.json deve ficar na raiz, junto com index.html, src, public, supabase, centros-de-cura, scripts, config e .github.
6. Preserve a pasta .git criada pelo GitHub Desktop. Não copie node_modules, dist, .env.production ou arquivos de credenciais.
7. No GitHub Desktop, confira os arquivos, escreva `Preparar Fluxos de Cura para GitHub Pages` em Summary e clique Commit to main.
8. Clique Push origin (ou Publish branch, se esse for o botão exibido).
9. Abra a aba Actions no repositório. O workflow deve instalar com npm ci, validar o TypeScript, gerar o build e salvar o artefato.
10. O job deploy permanecerá SKIPPED enquanto PAGES_DEPLOY_APPROVED não for exatamente `true`. Não habilite essa variável ainda.

## 3. Variáveis públicas do build

`config/public-build.json` contém somente a URL pública do projeto e a chave `sb_publishable_` já usada no site. Elas são públicas por definição e também aparecem no JavaScript do navegador. Nenhuma chave service_role, sb_secret_, senha de banco ou token GitHub deve ser colocada nesse arquivo ou em variáveis VITE_.

O workflow permite substituí-las em Settings > Secrets and variables > Actions > Variables > New repository variable:

- VITE_SUPABASE_URL: copie o valor de config/public-build.json.
- VITE_SUPABASE_PUBLISHABLE_KEY: copie o valor publicável do mesmo arquivo.
- VITE_TURNSTILE_SITE_KEY: opcional; só configurar junto com domínio autorizado e configuração correspondente no backend. Atualmente está desativado.

As variáveis são opcionais, pois o arquivo público fornece os valores já verificados. Os scripts rejeitam chave secreta/JWT no lugar da chave publicável. Nenhum segredo administrativo é necessário para publicar o frontend. GITHUB_TOKEN é gerado automaticamente pelo GitHub; não crie nem coloque um PAT no código.

## 4. Supabase: pendência obrigatória antes de publicar

A função ativa register-lead autoriza o domínio antigo e localhost:5188. O novo domínio https://murilocoutopro.github.io deve ser incluído nas origens autorizadas. O código local já contém essa origem, mantendo todas as anteriores.

A aplicação desse ajuste na função ativa foi BLOQUEADA pela revisão automática: substituiria imediatamente uma função de produção antes da conferência solicitada. Nenhum ajuste foi aplicado no servidor nesta entrega. Autorize explicitamente a atualização da origem no Supabase após revisar os testes. Se existir ALLOWED_ORIGINS configurada no servidor, essa variável também deve incluir a origem nova e preservar as anteriores.

Não recrie tabela, políticas, banco ou chaves. Não execute de novo as migrações de criação no projeto existente. O backend continua no Supabase, não no GitHub Pages.

## 5. Conferência com o responsável — PARE AQUI antes de publicar

- Página principal: design, data 24/10 às 17h e endereço corretos.
- Centros de Cura: 23, 24 e 25/10 às 14h, dublado no Loveworld Brasil; acesso direto e atualização funcionam.
- Formulário abre, valida os campos, salva uma inscrição de teste autorizada e só depois redireciona ao grupo configurado.
- Confirme no Supabase a persistência dessa inscrição e remova o registro de teste depois.
- Testemunhos: Natália em MP4, Samira e Stefanny no YouTube.
- Links de WhatsApp, Instagram, localização e navegação conferidos.
- Novo domínio autorizado na função Supabase. Sem isso, o formulário no GitHub será bloqueado por CORS.

Os testes automatizados locais passaram, mas isso NÃO equivale a um teste completo do formulário no domínio GitHub ainda não publicado. O acesso real pelo GitHub só poderá ser conferido após ativação autorizada; caso necessário, faça uma publicação técnica autorizada e valide antes de divulgar o link em anúncios.

## 6. Ativar somente após sua confirmação

1. Settings > Pages > Build and deployment > Source: GitHub Actions.
2. Se desejar uma segunda barreira, Settings > Environments > github-pages > Required reviewers: adicione o responsável, se disponível no plano.
3. Só após a confirmação conjunta, crie a variável de repositório PAGES_DEPLOY_APPROVED com valor `true`.
4. Actions > Build and publish GitHub Pages > Run workflow > main > Run workflow.
5. Aguarde build e deploy concluírem com sucesso. O endereço esperado é https://murilocoutopro.github.io/; ele não foi confirmado como publicado nesta entrega.
6. Depois de ativado, novos pushes em main farão build e deploy automaticamente. PRs e prepare-github-pages apenas validam.
7. Para impedir futuras publicações, remova PAGES_DEPLOY_APPROVED ou altere-a para `false`. Isso não retira do ar uma versão já publicada.

## Rotas e arquivos

Vite tem base `/` e duas entradas HTML. O build gera `dist/index.html` e `dist/centros-de-cura/index.html`. O GitHub Pages serve o arquivo do diretório na rota `/centros-de-cura/`, com 200; um acesso sem barra pode receber redirecionamento para a mesma página. Não há dependência de fallback 404.

Metadados de compartilhamento são adaptados ao domínio GitHub apenas quando GITHUB_ACTIONS=true, preservando a configuração da hospedagem anterior em builds locais.

## Executar localmente

Requer Node.js 22 e npm:

    npm ci
    node scripts/prepare-public-env.mjs
    npm run check
    npm run build
    node scripts/verify-pages.mjs
    npm run preview -- --host 127.0.0.1 --port 5188

A prévia local usa localhost:5188, já autorizado no backend. Não publique o arquivo .env.production.local gerado. O teste de build não envia inscrições reais.
