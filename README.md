# spotify-luizalabs

Aplicação em ReactJS que autentica e realiza buscas nas APIs do Spotify.

---

## Escolhas Técnicas e Arquiteturais

Essa aplicação foi desenvolvida com foco em simplicidade, escalabilidade e boas práticas modernas de desenvolvimento front-end.

### Tecnologias e bibliotecas utilizadas

- React 19: Biblioteca principal para construção da interface.
- React Router: Navegação baseada em rotas SPA.
- TypeScript: Tipagem estática para maior confiabilidade e manutenibilidade do código.
- Jest + React Testing Library: Testes unitários do funcionamento dos componentes.
- ESLint + Prettier: Padronização de código e detecção de problemas de estilo.
- SonarCloud: Análise estática contínua do código, garantindo qualidade e segurança.
- Sentry: Monitoramento de erros em tempo real.
- Workbox + Service Worker: Implementação de PWA com suporte offline.
- CI/CD: Execução automática dos testes e deploy contínuo via Vercel.

### Organização e padrões arquiteturais

A arquitetura do projeto foi baseada em separação por domínios de responsabilidade (Separation of Concerns), tornando o código mais modular, testável e de fácil manutenção:

```
src/
├── api/              # Comunicação com APIs externas e DTOs
├── assets/           # Arquivos estáticos (imagens, fontes, etc.)
├── components/       # Componentes de UI reutilizáveis e desacoplados
├── context/          # React Context API para estado global
├── hooks/            # Hooks customizados com lógicas reutilizáveis
├── pages/            # Páginas da aplicação ligadas às rotas
├── utils/            # Utilitários e funções auxiliares
```

---

## Validar a aplicação

Para testar a aplicação já publicada, você precisa usar o seu próprio **Client ID** do Spotify. Para isso, siga os seguintes passos:

1.  Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) com o seu login e crie um novo app.
2.  Dê um nome e uma descrição para o seu app.
3.  Adicione a seguinte **Redirect URI**:
    ```
    https://spotify-luizalabs-eight.vercel.app/callback
    ```
4.  Seleciona a opção de utilizar as **Web APIs** do Spotify.
5.  Salve as configurações do seu app e copie o seu **Client ID**.
6.  Acesse a URL abaixo, substituindo `SEU_CLIENT_ID` pelo ID que você copiou:
    ```
    https://spotify-luizalabs-eight.vercel.app/login?client_id=SEU_CLIENT_ID
    ```
7. Pronto! Agora a aplicação vai funcionar corretamente com o login de seu usuário.

---

## Ambiente Local

Com o Node.js 18 (ou superior) instalado, siga os passos abaixo para rodar o projeto em sua máquina.

### 1. Cadastro no Spotify Developer

* Da mesma forma que foi cadastrado um app pra ser utilizado no site publicado, cadastre um novo app (ou reutilize o que foi criado) para ser utilizado no ambiente local, setando o valor de **Redirect URI** para:
```
http://127.0.0.1:3000/callback
```

### 2. Configuração do Ambiente

* Clone este repositório.
* Altere o arquivo `.env` setando o seu Client ID:
    ```
    REACT_APP_CLIENT_ID=COLE_SEU_CLIENT_ID_AQUI
    ```
* PS: O Client ID também pode ser passado via parâmetro de URL, conforme foi feito no site publicado.

### 3. Rodando o Projeto

* Instale as dependências:
    ```sh
    npm install
    ```
* Inicie o servidor de desenvolvimento:
    ```sh
    npm start
    ```
* Abra [http://127.0.0.1:3000](http://127.0.0.1:3000) no seu navegador.

**Importante**: Use sempre `127.0.0.1` ao invés de `localhost`, pois este foi o endereço registrado como Redirect URI no Spotify para o ambiente de desenvolvimento.

---

## Outros Scripts

* `npm test`: Executa os testes unitários.
* `npm run build`: Compila a aplicação para produção na pasta `build`.
* `npx serve -s build`: Roda a aplicação considerando a compilação.
* `npm run lint`: Analisa o código em busca de erros de estilo e potenciais problemas.
* `npm run lint:fix`: Tenta corrigir automaticamente os problemas encontrados pelo linter.

---

## Requisitos do Desafio

### Requisitos obrigatórios

- [X] Seguimentação de commits
- [X] Lint
- [X] Autenticação via Spotify
- [X] Listar artistas
- [X] Listar albuns de um artista
- [X] Utilizar paginação (scroll infinito ou não)
- [X] Funcionamento offline (testado no Google Chrome)
- [X] Testes unitários
- [X] Deploy da aplicação (automático via [Vercel](https://vercel.com/kendaodevelopers-projects/spotify-luizalabs))

### Bônus

- [ ] Testes E2E
- [X] Integração com Sentry
- [X] CI/CD
- [X] Responsividade (celular e tablet)
- [X] Qualidade de código (automático via [SonarQube](https://sonarcloud.io/project/overview?id=kendaodeveloper_spotify-luizalabs))
- [X] PWA

---

## Autor

Projeto desenvolvido por Kenneth Gottschalk de Azevedo.
