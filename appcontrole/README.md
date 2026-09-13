# Minhas Finanças

Aplicação web para acompanhar receitas, contas e compras por mês. O projeto foi desenvolvido para controle financeiro doméstico e migrado do HTML legado para React, Vite e TypeScript, mantendo a persistência local existente.

## Tecnologias

- React e React DOM.
- Vite.
- TypeScript.
- HTML semântico e CSS responsivo.
- ESLint para validação do código.

Não são utilizadas bibliotecas externas de UI, roteamento ou gerenciamento global de estado.

## Funcionalidades

- Dashboard com recebimentos, gastos e saldo disponível.
- Cadastro, edição e exclusão de receitas.
- Cadastro, edição e exclusão de contas, incluindo vencimento, responsável e status.
- Cadastro, edição e exclusão de compras.
- Navegação entre início, receitas, contas, compras e relatórios.
- Seleção entre agosto e setembro de 2026.
- Modo claro e escuro.
- Persistência local no navegador.
- Formatação dos valores em real brasileiro.

## Pré-requisitos

- Node.js instalado.
- npm disponível no PATH.

O ambiente utilizado na validação foi Node.js `v24.18.0` e npm `11.16.0`.

## Executar localmente

```bash
npm install
npm run dev
```

Outros comandos:

```bash
npm run build  # verifica tipos e gera a versão de produção
npm run lint   # executa o ESLint
npm run preview
```

## Organização

- `src/domain/finance`: tipos e cálculos financeiros puros.
- `src/services/storage`: leitura, migração e gravação do `localStorage`.
- `src/components/layout`: estrutura de navegação.
- `src/components/finance`: componentes reutilizáveis de resumo, formulário e listagem.
- `src/App.tsx`: composição da aplicação e coordenação do estado da tela.

O fluxo principal é `App` -> componentes de layout e finanças -> serviço de persistência. As regras de cálculo ficam isoladas em `domain/finance`, sem depender da interface.

## Regras de negócio preservadas

- Os dados são separados nos meses `2026-08` e `2026-09`.
- Dados do formato legado sem `meses` são migrados para setembro de 2026.
- O dashboard considera apenas contas com status `paga` no cálculo de gastos e saldo.
- O relatório mostra o total bruto de todas as contas, incluindo pendentes.
- A moeda usada é o real brasileiro (`BRL`).

## Persistência

Os dados são armazenados localmente no navegador:

- `minhas_financas_v1`: lançamentos agrupados por mês.
- `minhas_financas_mes`: mês atualmente selecionado.

Não existe backend nesta versão. Para sincronização entre dispositivos, a próxima evolução deve substituir o serviço de storage por uma API, mantendo o contrato de `FinanceData`.

## Desenvolvimento

O diretório `appcontrole/` é a aplicação Vite oficial. O [index.html](../index.html) na raiz é a implementação legada mantida como referência durante a migração e não participa do build Vite.

Antes de enviar alterações, execute:

```bash
npm run build
npm run lint
```

O build executa o TypeScript em modo de verificação e depois gera os arquivos de produção com o Vite.

## Melhorias futuras

- Substituir `localStorage` por uma API para sincronização entre dispositivos.
- Persistir a preferência de modo claro/escuro.
- Substituir os diálogos nativos de edição e exclusão por uma interface acessível própria.
- Adicionar testes automatizados para cálculos e migração de dados.
- Permitir novos meses sem alterar o código-fonte.
