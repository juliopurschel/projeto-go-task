# Go Task

Gerenciador de tarefas em formato Kanban, desenvolvido com **Angular 19**, **TypeScript** e **Tailwind CSS 4** para praticar a construção de interfaces e a organização de uma aplicação front-end.

Este projeto faz parte do meu aprendizado em Angular e do meu portfólio. O objetivo é aplicar conceitos do framework em uma experiência de uso completa: criar uma tarefa, acompanhar seu andamento e organizar o trabalho em um quadro visual.

O projeto está concluído dentro do seu escopo de estudo, sem previsão de novas funcionalidades ou continuidade de desenvolvimento.

## Conteúdo

- [Sobre a aplicação](#sobre-a-aplicação)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Conceitos praticados](#conceitos-praticados)
- [Como executar](#como-executar)
- [Como usar](#como-usar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Organização e fluxo de dados](#organização-e-fluxo-de-dados)
- [Scripts disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [Escopo e limitações](#escopo-e-limitações)

## Sobre a aplicação

O Go Task organiza as tarefas em três etapas:

| Coluna | Finalidade | Status no código |
| --- | --- | --- |
| A fazer | Tarefas que ainda precisam ser iniciadas | `to-do` |
| Fazendo | Tarefas em andamento | `doing` |
| Feito | Tarefas concluídas | `done` |

A aplicação funciona no navegador, com armazenamento de tarefas no `localStorage`. Não exige cadastro, configuração de API ou banco de dados. As informações ficam vinculadas ao navegador e à origem em que a aplicação é acessada; limpar os dados do site remove as tarefas salvas.

## Funcionalidades

- **Criação de tarefas:** formulário em modal com nome e descrição.
- **Validação de formulário:** os dois campos são obrigatórios e exigem pelo menos 10 caracteres.
- **Edição de tarefas:** atualização do nome e da descrição em um formulário preenchido com os dados atuais.
- **Exclusão de tarefas:** remoção de um cartão do quadro.
- **Movimentação entre etapas:** alteração de status ao arrastar e soltar os cartões com Angular CDK.
- **Comentários por tarefa:** modal para consultar a descrição completa, adicionar comentários e removê-los. A persistência de novos comentários possui uma limitação descrita ao final deste documento.
- **Contadores por coluna:** exibição da quantidade de tarefas em cada etapa.
- **Estado vazio:** mensagem quando nenhuma tarefa foi cadastrada.
- **Adaptação de layout:** seção de boas-vindas ajustada por breakpoint e rolagem horizontal do quadro em telas menores.

## Tecnologias

Versões de referência declaradas no `package.json`; as versões resolvidas estão registradas no `package-lock.json`.

| Tecnologia | Versão / linha | Uso no projeto |
| --- | --- | --- |
| Angular | 19.2 | Componentes, templates, injeção de dependências e inicialização da aplicação |
| TypeScript | 5.7 | Tipagem dos dados e implementação das regras da aplicação |
| Angular CDK | 19.2 | Diálogos e drag and drop |
| Angular Reactive Forms | 19.2 | Controle e validação dos formulários |
| RxJS | 7.8 | Estado das listas com `BehaviorSubject` e exposição de observables |
| Tailwind CSS | 4.1 | Estilização com classes utilitárias |
| PostCSS | 8.5 | Integração do Tailwind ao processamento de CSS |
| Jasmine e Karma | 5.6 / 6.4 | Estrutura de testes unitários |
| Angular CLI | 19.2 | Servidor de desenvolvimento, build e execução dos testes |

## Conceitos praticados

- **Componentes standalone:** composição da interface com dependências declaradas em `imports`, sem um `AppModule`.
- **Templates modernos:** uso de `@if`, `@for` e `@let` para exibição condicional, listas e variáveis de template.
- **Comunicação entre componentes:** recebimento de tarefas com `@Input({ required: true })`.
- **Injeção de dependências:** acesso aos serviços com `inject()` e disponibilização com `providedIn: 'root'`.
- **Separação de responsabilidades:** componentes para interação e apresentação; serviços para tarefas e abertura de modais.
- **Formulários reativos:** uso de `FormGroup`, `FormControl` e `Validators`, com feedback de validação e botão de envio desabilitado para formulários inválidos.
- **Programação reativa:** combinação de `BehaviorSubject`, `map`, `tap` e `AsyncPipe` para conectar o estado à interface e ao armazenamento local.
- **Modelagem de dados:** interfaces para tarefas, comentários e formulários; enum e tipo para os status permitidos.
- **Interação com o DOM:** uso de `ViewChild` e `ElementRef` para devolver o foco ao campo após adicionar um comentário.

## Como executar

### Pré-requisitos

- Node.js **22.x**, como ambiente de referência para executar o projeto.
- npm disponível no ambiente.
- Navegador com suporte a `localStorage` e `structuredClone`.
- Acesso à internet para instalar as dependências e carregar a fonte Archivo, utilizada via Google Fonts.

### Instalação e desenvolvimento

Após clonar ou baixar este repositório, acesse a pasta do projeto e instale as dependências:

```bash
cd projeto-go-task
npm ci
npm start
```

O comando `npm ci` instala as versões registradas no arquivo de lock. Depois que o servidor iniciar, acesse [http://localhost:4200](http://localhost:4200). Alterações nos arquivos de origem são refletidas automaticamente no navegador.

Não é necessário criar um arquivo `.env` ou configurar credenciais.

### Build de produção

```bash
npm run build
```

Os arquivos para hospedagem estática são gerados em `dist/projeto-go-task/browser/`.

O build de produção tenta incorporar o CSS da fonte externa. Se o ambiente bloquear o acesso a `fonts.googleapis.com`, essa etapa pode falhar. Para verificar a compilação em modo de desenvolvimento, sem essa otimização, execute:

```bash
npm run build -- --configuration development
```

## Como usar

1. Clique em **Criar uma tarefa**.
2. Preencha nome e descrição com pelo menos 10 caracteres em cada campo e envie o formulário.
3. A tarefa será criada na coluna **A fazer**.
4. Arraste o cartão para **Fazendo** ou **Feito** conforme o andamento do trabalho.
5. Use **Editar** para alterar os dados ou **Comentários** para abrir os detalhes e as anotações da tarefa.
6. Clique no ícone de lixeira do cartão para excluí-lo. Atualmente, essa ação acontece sem confirmação.

## Estrutura do projeto

```text
public/
├── images/                         # Ícones e ilustrações SVG
└── favicon.ico
src/
├── app/
│   ├── components/
│   │   ├── header/                 # Identidade visual e perfil ilustrativo
│   │   ├── main-content/           # Composição da área principal
│   │   ├── welcome-section/        # Boas-vindas e ação de criar tarefa
│   │   ├── task-list-section/      # Colunas Kanban e drag and drop
│   │   ├── task-card/              # Resumo e ações de uma tarefa
│   │   ├── task-form-modal/        # Formulário de criação e edição
│   │   └── task-comments-modal/    # Detalhes e comentários
│   ├── enums/                      # Valores dos status
│   ├── interfaces/                 # Contratos de tarefas, comentários e formulários
│   ├── services/                   # Estado das tarefas e controle dos modais
│   ├── types/                      # Tipo dos status permitidos
│   ├── utils/                      # Geração de identificadores
│   ├── app.component.*             # Componente raiz
│   ├── app.config.ts               # Providers da aplicação
│   └── app.routes.ts               # Rotas, atualmente sem definições
├── index.html                      # Documento HTML de entrada
├── main.ts                         # Inicialização com bootstrapApplication
└── styles.css                      # Fonte, Tailwind e estilos globais
angular.json                        # Configurações de execução, build e testes
.postcssrc.json                     # Plugin do Tailwind para PostCSS
```

## Organização e fluxo de dados

O [`TaskService`](src/app/services/task.service.ts) mantém uma lista de tarefas por status em `BehaviorSubject`s privados. Os componentes recebem os dados por observables, consumidos no template com `AsyncPipe`. As emissões passam por `structuredClone`, e o serviço lê e grava os dados nas chaves `to-do`, `doing` e `done` do `localStorage`.

O [`ModalControllerService`](src/app/services/modal-controller.service.ts) centraliza a abertura dos diálogos com Angular CDK. O mesmo componente de formulário atende à criação e à edição, recebendo o modo de operação e os valores iniciais por injeção de dados. Ao fechar o formulário com dados válidos, o componente que abriu o modal solicita a atualização ao serviço de tarefas.

O [`TaskListSectionComponent`](src/app/components/task-list-section/task-list-section.component.ts) conecta as três colunas com as diretivas do CDK. Ao soltar um cartão, identifica a coluna de destino e solicita a atualização do status no serviço.

Uma tarefa reúne `id`, `name`, `description`, `status` e uma lista de `comments`. Cada comentário possui `id` e `description`. Os identificadores são gerados localmente a partir de timestamp e de uma parte aleatória.

## Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run build -- --configuration development` | Compila com a configuração de desenvolvimento |
| `npm run watch` | Recompila ao detectar alterações, usando a configuração de desenvolvimento |
| `npm test` | Executa os testes com Karma e Jasmine em modo de observação |
| `npm test -- --watch=false --browsers=ChromeHeadless` | Executa os testes uma vez em um Chrome sem interface gráfica |
| `npm run ng -- <comando>` | Executa um comando do Angular CLI instalado no projeto |

## Testes

O projeto possui arquivos `*.spec.ts` junto aos componentes, com testes iniciais de criação e verificações do componente raiz. Para executá-los, é necessário ter o Google Chrome instalado ou indicar um executável compatível pela variável de ambiente `CHROME_BIN`.

A suíte contém testes iniciais que não refletem integralmente a implementação: existe uma expectativa do template inicial do Angular CLI no `AppComponent`, e os testes dos cartões e modais não fornecem todos os dados de entrada e as dependências exigidas pelos componentes. Não há testes específicos dos fluxos de negócio e da persistência, nem configuração de testes de ponta a ponta no repositório.

## Escopo e limitações

O Go Task foi desenvolvido para praticar Angular em uma aplicação local de gerenciamento de tarefas. A versão final possui as seguintes características e limitações:

- **Persistência dos comentários:** ao adicionar um comentário, o modal não sinaliza a alteração ao fechamento. Isso pode impedir que novos comentários sejam salvos ao fechar e reabrir o modal ou recarregar a página. A remoção sinaliza a mudança.
- **Ordenação dos cartões:** a posição escolhida no arraste não é preservada pelo serviço; a atualização reinsere a tarefa no final da lista de destino, inclusive em movimentos dentro da mesma coluna.
- **Elementos ilustrativos:** o perfil exibido, os botões de notificações e saída e o texto de tempo dos comentários são estáticos. Não há autenticação, notificações ou cálculo do horário dos comentários.
- **Movimentação dos cartões:** a interface utiliza arrastar e soltar, sem um controle alternativo para alterar o status pelo teclado.
- **Exclusão de tarefas:** a remoção é imediata, sem confirmação ou opção de desfazer.
