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
- **Movimentação e ordenação:** alteração de status e reordenação dos cartões com Angular CDK, preservando a posição escolhida após recarregar a página.
- **Comentários por tarefa:** modal para consultar a descrição completa, adicionar comentários válidos e removê-los, com persistência ao fechar o modal.
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
- **Organização por feature:** componentes, serviços e contratos de formulário de tarefas reunidos em `features/tasks`, com modelos de domínio e utilitários independentes.
- **Formulários reativos:** uso de `FormGroup`, `FormControl` e `Validators`, com feedback de validação e botão de envio desabilitado para formulários inválidos.
- **Programação reativa:** combinação de `BehaviorSubject`, `map` e `AsyncPipe` para conectar o estado à interface. A persistência ocorre nas alterações do serviço, independentemente de assinaturas dos observables.
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

A incorporação de fontes externas durante o build está desativada em `angular.json`, permitindo compilar sem acessar o Google Fonts. A fonte Archivo é carregada pelo navegador em tempo de execução; se estiver indisponível, a interface usa `sans-serif`. As otimizações de scripts e estilos continuam ativas. A configuração do PostCSS também habilita a compilação do Tailwind para transformar seletores CSS aninhados antes da otimização do Angular.

Para compilar em modo de desenvolvimento, execute:

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
│   ├── domain/
│   │   └── tasks/
│   │       ├── enums/task-status.enum.ts
│   │       ├── interfaces/comment.interface.ts
│   │       ├── types/task-status.ts
│   │       └── task.interface.ts
│   ├── features/
│   │   └── tasks/
│   │       ├── components/
│   │       │   ├── main-content/
│   │       │   ├── welcome-section/
│   │       │   ├── task-list-section/
│   │       │   ├── task-card/
│   │       │   ├── task-form-modal/
│   │       │   └── task-comments-modal/
│   │       ├── interfaces/
│   │       │   ├── task-form-controls.interface.ts
│   │       │   └── task-form-modal-data.interface.ts
│   │       └── services/
│   │           ├── task.service.ts
│   │           ├── task.service.spec.ts
│   │           └── modal-controller.service.ts
│   ├── layout/
│   │   └── header/
│   ├── shared/
│   │   └── utils/generate-unique-id-with-timestamp.ts
│   ├── app.component.*
│   ├── app.config.ts
│   └── app.routes.ts               # Rotas, atualmente sem definições
├── index.html
├── main.ts
└── styles.css
angular.json
.postcssrc.json
```

Os arquivos de template, estilos e testes de cada componente ficam junto ao seu TypeScript. Os nomes dos componentes, serviços e contratos foram preservados na migração.

### Responsabilidades e dependências

- **`features/tasks`:** contém a funcionalidade de tarefas, incluindo boas-vindas com criação de tarefa, quadro, cartões, modais, serviços e contratos dos formulários. Pode importar `domain` e `shared`.
- **`domain/tasks`:** contém os modelos e status do negócio. Não importa componentes, serviços da feature ou Angular.
- **`shared`:** contém utilitários genéricos, sem dependências de features ou modelos específicos de tarefas.
- **`layout`:** contém a estrutura visual global. O cabeçalho não depende da feature de tarefas.
- **`AppComponent`:** compõe o cabeçalho e o conteúdo da feature.

Não há pasta `core` porque a aplicação ainda não possui infraestrutura global que precise dela. O uso de `providedIn: 'root'` mantém uma instância do serviço no injetor raiz e não determina em qual pasta o arquivo deve ficar.

## Organização e fluxo de dados

O [`TaskService`](src/app/features/tasks/services/task.service.ts) mantém uma lista de tarefas por status em `BehaviorSubject`s privados. Os componentes recebem os dados por observables, consumidos no template com `AsyncPipe`. As emissões passam por `structuredClone` para proteger o estado interno. O serviço lê e grava os dados nas mesmas chaves `to-do`, `doing` e `done` do `localStorage`, preservando a compatibilidade com as tarefas já salvas. Cada alteração grava o estado sem depender de assinantes; dados armazenados com formato inválido são desconsiderados. Se a leitura ou gravação falhar, a aplicação continua com o estado disponível em memória e registra o erro no console.

O [`ModalControllerService`](src/app/features/tasks/services/modal-controller.service.ts) centraliza a abertura dos diálogos com Angular CDK. O mesmo componente de formulário atende à criação e à edição, recebendo o modo de operação e os valores iniciais por injeção de dados. Ao fechar o formulário com dados válidos, o componente que abriu o modal solicita a atualização ao serviço de tarefas.

O [`TaskListSectionComponent`](src/app/features/tasks/components/task-list-section/task-list-section.component.ts) conecta as três colunas com as diretivas do CDK. Ao soltar um cartão, identifica a coluna e o índice de destino e solicita a atualização ao serviço. O serviço concentra a movimentação, a reordenação e a persistência, evitando modificar apenas a cópia exibida no template.

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

Os testes usam Karma e Jasmine. Para executá-los, é necessário ter o Google Chrome instalado ou indicar um executável Chromium compatível pela variável de ambiente `CHROME_BIN`.

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

No Windows com Microsoft Edge, por exemplo, execute no PowerShell:

```powershell
$env:CHROME_BIN = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm test -- --watch=false --browsers=ChromeHeadless
```

A suíte cobre composição da interface, validação e retorno do formulário, inclusão e remoção de comentários, integração dos cartões com os diálogos e o serviço, criação e exclusão de tarefas, edição, movimentação entre status, ordenação dentro da coluna e persistência após recriar o serviço. Também verifica isolamento de cópias, tratamento de dados armazenados inválidos e funcionamento em memória quando a gravação falha.

Não há configuração de testes de ponta a ponta no repositório.

## Escopo e limitações

O Go Task foi desenvolvido para praticar Angular em uma aplicação local de gerenciamento de tarefas. A versão final possui as seguintes características e limitações:

- **Elementos ilustrativos:** o perfil exibido, os botões de notificações e saída e o texto de tempo dos comentários são estáticos. Não há autenticação, notificações ou cálculo do horário dos comentários.
- **Movimentação dos cartões:** a interface utiliza arrastar e soltar, sem um controle alternativo para alterar o status pelo teclado.
- **Exclusão de tarefas:** a remoção é imediata, sem confirmação ou opção de desfazer.
