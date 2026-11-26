# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Integração com a maquininha

Configure a integração no `.env`:

```dotenv
VITE_PAYMENT_INTEGRATION_ENABLED=false
```

Com `false` ou sem a variável, o totem mantém o fluxo anterior. A forma de
pagamento selecionada é registrada na recepção, sem cobrança pelo totem e sem
impressão de comprovante de pagamento pela integração. Use `true` para ativar
a integração, inclusive o PIX processado pelo serviço da maquininha. Após
alterar a variável, reinicie o servidor de desenvolvimento ou gere e publique
um novo build de produção (`npm run build`).

Com a integração ativada, o fluxo funciona da seguinte forma.

O botão **Concluir Pagamento** envia `POST /payment` ao PlimpagKioskService,
com valor em centavos, débito = 0, crédito = 1, PIX = 2 e uma parcela.
O acompanhamento consulta `GET /status` a cada 800 ms, sem consultas sobrepostas.
A tela oferece cancelamento, confirmação de cancelamento, código PIX copia e cola
(equivalente ao exemplo) e impressão de comprovante conforme a resposta do serviço.
Após `APPROVED` (direto ou em `transaction.status` quando o fluxo retorna
`FINISHED`), o totem envia automaticamente o comprovante do pagamento para
`POST /api-py/v1/print-payment` da API Python como JSON (`{ "text": "..." }`),
cadastra a recepção e envia o comprovante dela
para a API de impressão. Não é necessário confirmar impressão ou conclusão.
A nota fiscal é solicitada depois da impressão da recepção, para que uma falha
fiscal não impeça o envio do comprovante à impressora.
Falhas de impressão ou de recepção aparecem na tela e permitem retomar sem
cobrar novamente; as etapas confirmadas não se repetem na mesma sessão.
Os dois documentos usam a impressora padrão do Windows, em trabalhos separados,
sem diálogo do navegador. A rota de pagamento é configurável por
`VITE_PAYMENT_RECEIPT_PRINT_URL`; por padrão deriva de `VITE_PRINT_API_URL`,
trocando `/print` por `/print-payment`. Atualize também o `app.py` de
`impressao-totem-py` para disponibilizar essa rota.
Quando a padrão usa o driver Microsoft Print To PDF, os arquivos são salvos
automaticamente em `%USERPROFILE%/Vitae/Comprovantes`, sem a janela Salvar como.
O diretório pode ser alterado por `VITAE_RECEIPTS_DIR` na API Python.
Retornos concluem a recepção sem enviar cobrança.

Configure no `.env` e reinicie/recompile o aplicativo:

```dotenv
VITE_PAYMENT_SERVICE_URL=https://127.0.0.1
```

O endereço padrão é o mesmo do exemplo. O serviço precisa estar instalado,
com a ROOT CA confiável no Windows (`instala_certificado.bat`).
A aplicação envia `POST /activate` ao abrir, com os parâmetros
`VITE_PAYMENT_SITEF_IP`, `VITE_PAYMENT_STORE_ID`, `VITE_PAYMENT_TERMINAL_ID`,
`VITE_PAYMENT_SHOP_CNPJ`, `VITE_PAYMENT_DEV_CNPJ`,
`VITE_PAYMENT_CONFIGURATION_PARAMETERS`, `VITE_PAYMENT_ADDITIONAL_PARAMETERS`
e `VITE_PAYMENT_PINPAD_MESSAGE` do `.env`. IDs e CNPJs são enviados como
texto, preservando zeros iniciais. O pagamento aguarda a ativação.
Em caso de falha, um aviso permite tentar ativar novamente.
O serviço também precisa permitir a origem do totem via CORS.

Falhas na consulta permitem consultar novamente sem reenviar a cobrança.
Quando não é possível confirmar se o envio inicial chegou ao serviço, ou quando
há aprovação com erro, a tela pede auxílio à recepção e bloqueia nova cobrança.
Após aprovação, falhas na conclusão da recepção permitem repetir essa etapa sem
cobrar novamente. Essa proteção vale para a sessão atual: se o navegador for
recarregado ou fechado, a recepção deve conferir a transação antes de reiniciar.
Não há reenvio automático de pagamentos.
