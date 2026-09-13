# Minhas Finanças

Aplicação web para controle financeiro doméstico. O sistema permite acompanhar receitas, contas e compras organizadas por mês, com resumo financeiro e persistência local no navegador.

A aplicação foi migrada de HTML, CSS e JavaScript para React, Vite e TypeScript, preservando as funcionalidades existentes.

## Tecnologias

- React 19
- React DOM
- Vite
- TypeScript
- HTML semântico
- CSS responsivo
- ESLint

O projeto não utiliza bibliotecas externas de UI, roteamento ou gerenciamento global de estado.

## Funcionalidades

- Dashboard com receitas, gastos e saldo disponível.
- Cadastro, edição e exclusão de receitas.
- Cadastro, edição e exclusão de contas.
- Controle de vencimento, responsável e status das contas.
- Cadastro, edição e exclusão de compras.
- Navegação entre Início, Receitas, Contas, Compras e Relatórios.
- Seleção de mês.
- Modo claro e escuro.
- Layout responsivo para desktop e dispositivos móveis.
- Formatação de valores em real brasileiro.
- Persistência dos dados usando `localStorage`.
- Migração automática do formato antigo de dados.

## Pré-requisitos

- Node.js instalado.
- npm disponível no PATH.

Ambiente utilizado na validação:

```text
Node.js v24.18.0
npm 11.16.0
```

## Como acessar o projeto

No PowerShell ou Prompt de Comando do Windows:

```powershell
Set-Location f:\Appcontrole\appcontrole
npm install
npm run dev
```

Depois, abra no navegador:

```text
http://localhost:5173/
```

Também é possível usar o endereço exibido pelo Vite no terminal, normalmente `http://127.0.0.1:5173/`.

## Comandos disponíveis

Execute os comandos dentro de `f:\Appcontrole\appcontrole`:

```powershell
npm run dev       # inicia o servidor de desenvolvimento
npm run build     # verifica os tipos e gera o build de produção
npm run preview   # visualiza localmente o build gerado
npm run lint      # executa o ESLint
```

## Estrutura do projeto

```text
appcontrole/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── finance/
│   │   │   ├── SummaryCard.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   └── TransactionList.tsx
│   │   └── layout/
│   │       └── Sidebar.tsx
│   ├── domain/
│   │   └── finance/
│   │       ├── calculations.ts
│   │       └── types.ts
│   ├── services/
│   │   └── storage/
│   │       └── financeStorage.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Responsabilidades principais

- `components`: componentes visuais reutilizáveis.
- `domain/finance`: tipos e regras de cálculo financeiro.
- `services/storage`: leitura, migração e gravação no `localStorage`.
- `App.tsx`: coordenação do estado e composição das telas.
- `App.css` e `index.css`: estilos da aplicação e regras responsivas.

## Arquitetura

O fluxo principal da aplicação é:

```text
App
├── Sidebar
├── Dashboard
│   ├── SummaryCard
│   └── TransactionList
├── TransactionForm
├── TransactionList
└── Reports
```

O estado financeiro é mantido no `App.tsx`. Os cálculos ficam isolados no domínio financeiro e a persistência é acessada exclusivamente pelo serviço de storage.

## Regras importantes

- Os dados atuais são organizados nos meses `2026-08` e `2026-09`.
- Dados legados sem a propriedade `meses` são migrados para setembro de 2026.
- O dashboard considera apenas contas pagas no cálculo de gastos e saldo.
- O relatório apresenta o total bruto de contas, incluindo contas pendentes.
- Os dados ficam armazenados apenas no navegador atual; não existe backend.

## Validação

Antes de considerar uma alteração concluída, execute:

```powershell
npm run build
npm run lint
```

A aplicação também deve ser verificada no navegador em desktop e mobile, incluindo navegação, formulários, edição, exclusão, troca de mês e modo escuro.

## Arquivos legados e limpeza

O arquivo `index.html` na raiz contém a implementação original e permanece como referência durante a migração. Ele não participa do build da aplicação Vite.

Os seguintes arquivos do template Vite não possuem referências no código atual e são candidatos a remoção futura:

- `appcontrole/src/assets/hero.png`
- `appcontrole/src/assets/react.svg`
- `appcontrole/src/assets/vite.svg`
- `appcontrole/public/icons.svg`

Eles foram preservados nesta etapa para evitar exclusões sem autorização. O `appcontrole/public/favicon.svg` é utilizado pelo `appcontrole/index.html` e deve ser mantido.

## Melhorias futuras

- Substituir `localStorage` por uma API para sincronização entre dispositivos.
- Persistir a preferência de tema.
- Substituir `prompt`, `confirm` e `alert` por diálogos acessíveis próprios.
- Adicionar testes automatizados para cálculos e migração.
- Permitir o cadastro de novos meses sem alterar o código-fonte.

A documentação detalhada da aplicação está em [appcontrole/README.md](appcontrole/README.md).
