# 📐 LowWireHouse

**LowWireHouse** é uma ferramenta de wireframing de baixa fidelidade poderosa, rápida e inteligente. Projetada para arquitetos de informação e designers UX que precisam focar na estrutura e fluxo, removendo as distrações de cores e alta fidelidade.

![Interface Preview](file:///C:/Users/Pedrosa/.gemini/antigravity/brain/1e9f0529-835f-4b9f-adc6-9770e5a8a458/final_app_state_1775051104907.png)

## ✨ Destaques & Funcionalidades

### 🤖 Magic Build (Gemini AI)
Transforme descrições em estruturas reais instantaneamente.
- **Texto para Wireframe**: Descreva sua interface (ex: "Dashboard com 3 cards e uma tabela") e a IA constrói os elementos no canvas.
- **Suporte Multi-Modelo**: Compatível com Gemini 2.5 Flash, 2.0 e 1.5.
- **Configuração Segura**: Sua API Key é salva localmente apenas no seu navegador.

### 🛠️ Editor Profissional
- **Canvas Infinito**: Manipulação suave com Fabric.js.
- **Grade & Snapping**: Alinhamento automático em grade de 20px.
- **Painel de Propriedades**: Controle total sobre dimensões, tipografia, cores de linha e preenchimento.
- **Gestão de Estado**: Histórico completo de Undo/Redo via Redux.

### ⌨️ Atalhos Rápidos
Produtividade é o foco. Use os atalhos padrões da indústria:
- `Ctrl + C` / `Ctrl + V`: Copiar e Colar.
- `Ctrl + D`: Duplicar elemento.
- `Del`: Deletar seleção.
- `Ctrl + Z` / `Ctrl + Y`: Desfazer e Refazer.

## 🚀 Como Iniciar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/)

### Instalação
1. Clone o repositório.
2. Navegue até a pasta do projeto:
   ```bash
   cd lowwirehouse
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack
- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS v4
- **Estado**: Redux Toolkit + Redux-Undo
- **Canvas**: Fabric.js
- **IA**: Google Gemini (@google/generative-ai)
- **Ícones**: Lucide React

## 💾 Exportação
- **JSON**: Salve o estado do seu projeto para edição posterior.
- **PNG**: Exporte seu wireframe em alta resolução com um clique.

---
Desenvolvido com foco em velocidade e simplicidade. 🚀
