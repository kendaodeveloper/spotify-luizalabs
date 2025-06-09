# spotify-luizalabs

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Creating a new project

```
npx create-react-app spotify-luizalabs
```

## Spotify App Setup

Before running the app, you need to register it on the Spotify Developer Dashboard and configure your environment variables.

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Log in with your Spotify account.
3. Click **Create an App** and fill in the required details.
4. In the app settings, add the following **Redirect URI** (callback URL): http://127.0.0.1:3000/callback
5. Save your changes.
6. Copy the **Client ID** from the dashboard.
7. Add the following line to the `.env` file: **REACT_APP_CLIENT_ID=value**.

## Available Scripts

In the project directory, you can run:

### `npm install`

Before running any scripts, install the project dependencies.\
This command downloads and installs all required packages listed in package.json.

### `npm start`

Runs the app in the development mode.\
Open [http://127.0.0.1:3000](http://127.0.0.1:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

**Important:** Use `127.0.0.1` instead of `localhost`, because `127.0.0.1` is the callback address registered in the Spotify Developer Dashboard. Using `localhost` will cause issues with OAuth redirects and storage access.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

The deployment section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run lint`

Runs ESLint to analyze all files in the project for code style errors and potential issues.

It's useful for checking code quality before committing to the repository.

### `npm run lint:fix`

Runs ESLint in the same way as npm run lint, but also attempts to automatically fix any issues that are fixable.

It's a quick way to align the code with the style rules defined for the project.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Requisitos

### Requisitos obrigatórios
- [X] Seguimentação de commits
- [X] Lint
- [X] Autenticação via Spotify
- [X] Listar artistas
- [X] Listar albuns de um artista
- [X] Utilizar paginação (scroll infinito ou não)
- [ ] Funcionamento offline
- [X] Testes unitários
- [ ] Deploy da aplicação

### Bônus
- [ ] Testes E2E
- [ ] Integração com Sentry
- [ ] CI/CD
- [ ] Responsividade (celular e tablet)
- [ ] Qualidade de código (Sonarqube)
- [ ] PWA
