# EventBank cards micro-frontend

The card screens of [EventBank](https://github.com/marcelo-roman/eventbank-platform): request a virtual debit card per account, block and unblock it, change its daily limit with a meter of what was spent today, and simulate purchases that follow their saga from waiting for the account to approved, declined or reversed.

It is a [Module Federation](https://module-federation.io) remote of [eventbank-shell](https://github.com/marcelo-roman/eventbank-shell): it exposes `./App`, which the shell mounts at `/cards` and renders with an `auth` prop (the signed-in user and a function that returns a fresh access token) and a `locale` prop (`en` or `pt-BR`; standalone, it follows the browser). Every API call sends that token. It ships with its own query client and styles, and uses the shell's theme for everything shared.

## Running

```bash
pnpm install
pnpm dev          # http://localhost:5178, standalone, API proxied to the gateway on :5100
pnpm build        # dist/remoteEntry.js is what the shell loads
pnpm test
```

Standalone, the app reads an access token from `localStorage["eventbank.devToken"]` and links the theme from the shell dev server at `http://localhost:5173/theme.css`. To run everything together, with sign-in, use [eventbank-platform](https://github.com/marcelo-roman/eventbank-platform).

## License

[MIT](LICENSE)
