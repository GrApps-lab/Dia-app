# Dia a Dia

App de finanças, receitas e dicas do dia a dia.

## Como colocar isso no ar (passo a passo, sem precisar programar)

### 1. Criar conta no GitHub
- Vá em [github.com](https://github.com) e crie uma conta grátis.
- Clique em "New repository", dê um nome (ex: `diaadia-app`) e crie.
- Na página do repositório vazio, clique em "uploading an existing file" e arraste **todos os arquivos e pastas** deste projeto pra lá. Confirme o upload (commit).

### 2. Criar conta na Vercel
- Vá em [vercel.com](https://vercel.com) e crie uma conta grátis usando login do GitHub (é o mais fácil).
- Clique em "Add New" → "Project".
- Selecione o repositório `diaadia-app` que você acabou de criar.
- Não precisa mexer em nada nas configurações — a Vercel reconhece projetos Vite automaticamente.

### 3. Configurar a chave da IA (pra busca de receitas funcionar)
Antes de clicar em "Deploy", adicione uma variável de ambiente:
- Nome: `ANTHROPIC_API_KEY`
- Valor: sua chave da API da Anthropic

Pra conseguir essa chave: crie uma conta em [console.anthropic.com](https://console.anthropic.com), vá em "API Keys" e gere uma. **Atenção**: essa é uma conta separada da assinatura do Claude — o uso da API é cobrado à parte, por uso (bem barato pra um volume pequeno de buscas, mas vale acompanhar o consumo lá no console).

Se você pular esse passo, o app inteiro funciona normalmente — só a busca de receita com IA não vai funcionar até você configurar a chave.

### 4. Publicar
- Clique em "Deploy".
- Em menos de 2 minutos você terá um link tipo `diaadia-app.vercel.app` — esse é o link que você pode compartilhar com todo mundo.

### Como cada pessoa recebe acesso
- Alguém paga o Pix pra você (`renancasa9z@gmail.com`) através da Kiwify (ou de onde você estiver vendendo).
- Você manda o link do app (`diaadia-app.vercel.app`) pra essa pessoa.
- Ela abre, vê a tela de entrada, clica em "Já fiz o Pix, liberar acesso" — o acesso fica salvo no navegador dela.

### Limitações importantes de saber
- Os dados (saldo, acesso liberado) ficam salvos **no navegador de cada pessoa**, não num banco de dados central. Se a pessoa trocar de celular ou limpar os dados do navegador, perde o acesso salvo e precisa confirmar de novo.
- Não existe verificação automática de pagamento — a liberação de acesso dentro do app é manual (a pessoa clica dizendo que pagou). Quem garante que só quem pagou de verdade recebe o link é o processo de venda na Kiwify, não o app em si.

### Atualizações depois do deploy
Toda vez que você quiser mudar algo no app, é só editar os arquivos no GitHub (ou pedir pra eu gerar uma nova versão) e a Vercel publica a atualização sozinha em 1-2 minutos.
