# Sistema N20 RPG para Foundry VTT

Um sistema completo e aprimorado para RPG de mesa no Foundry VTT, baseado em 4 atributos principais e sistema de rolagem 2d6 + atributo vs dificuldade. Inclui sistema de tokens avançado, barras de status, ferramentas de mestre e interface rica similar ao Ordem Paranormal.

## 🎲 Características do Sistema

### Atributos Principais
- **Físico**: Força, resistência e capacidade física
- **Mental**: Inteligência, conhecimento e capacidade mágica
- **Social**: Carisma, persuasão e interação social
- **Ação**: Agilidade, destreza e precisão

### Sistema de Rolagem
- **Teste básico**: 2d6 + Atributo vs Dificuldade
- **Combate**: 2d6 + Atributo apropriado vs Defesa do alvo
- **Defesa**: 10 + Ação + Armadura
- **Dano**: Reduzido pela Proteção da armadura

### ⚡ Recursos Avançados

#### Sistema de Tokens
- **Barras de Status**: HP/MP visíveis nos tokens (similar ao Brawl Bar)
- **Drag & Drop**: Arraste itens, magias e habilidades para a hotbar
- **Atualização Automática**: Barras atualizadas em tempo real
- **Configuração Flexível**: Personalize as barras para cada tipo de personagem

#### Interface Rica
- **Design Medieval**: Tema visual inspirado em pergaminhos antigos
- **Controles Intuitivos**: Botões +/- para recursos, controles de descanso
- **Abas Organizadas**: Inventário, magias, habilidades, efeitos e biografia
- **Barras de Progresso**: Visualização clara de HP, MP e experiência

#### Ferramentas de Mestre
- **Ferramentas de Mapa**: Configuração de cena, marcadores, efeitos ambientais
- **Ferramentas de Combate**: Configuração de encontros, aplicação de condições
- **Ferramentas Narrativas**: Entradas de diário, mensagens narrativas
- **Gerenciamento de Sessão**: Início/fim de sessão, distribuição de XP
- **Utilitários**: Encontros aleatórios, geração de tesouro, descanso em massa

#### Sistema de Efeitos
- **Efeitos Temporários**: Aplicação e gerenciamento de efeitos ativos
- **Integração com Combate**: Efeitos aplicados automaticamente
- **Encumbrance**: Sistema de carga automático
- **Gestão de Equipamentos**: Equipar/desequipar com efeitos automáticos

### Recursos do Sistema
- **Pontos de Vida**: Físico + 1d10
- **Pontos de Magia**: Mental × 2 (apenas se Mental > 0)
- **Sistema de Experiência**: Progressão por pontos de experiência
- **Equipamentos**: Armas, armaduras e itens diversos
- **Magias**: Sistema de escolas mágicas com custo em PM
- **Habilidades**: Habilidades especiais ativas e passivas

## 🏗️ Instalação

### Instalação via Manifest (Recomendado)

**Para Foundry VTT v11.300+, v12 e v13:**
1. No Foundry VTT, vá para "Game Systems"
2. Clique em "Install System"
3. Cole o URL do manifest: 
   ```
   https://raw.githubusercontent.com/seu-usuario/sistema-n20-rpg/main/system.json
   ```
4. Clique em "Install"

**Para Foundry VTT v10.291+ (versões mais antigas):**
1. No Foundry VTT, vá para "Game Systems"
2. Clique em "Install System"
3. Cole o URL do manifest alternativo: 
   ```
   https://raw.githubusercontent.com/seu-usuario/sistema-n20-rpg/main/system-legacy.json
   ```
4. Clique em "Install"

### Instalação via Git
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/sistema-n20-rpg.git
   ```
2. Copie a pasta para `Data/systems/` do seu Foundry VTT
3. Reinicie o Foundry VTT
4. Crie um novo mundo e selecione "Sistema N20 RPG" como sistema

### Instalação Manual
1. Baixe o arquivo ZIP: [Download](https://github.com/seu-usuario/sistema-n20-rpg/archive/refs/heads/main.zip)
2. Extraia na pasta `Data/systems/` do seu Foundry VTT
3. Renomeie a pasta para `sistema-n20-rpg`
4. Reinicie o Foundry VTT

## 🎮 Como Usar

### Criando Personagens
1. Crie um novo ator do tipo "Personagem"
2. Preencha as informações básicas (nome, raça, classe, etc.)
3. Distribua os pontos de atributo conforme desejar
4. Adicione equipamentos, magias e habilidades
5. Complete a biografia e personalidade

### Usando Tokens
- Configure as barras de status nos tokens (HP/MP)
- Use drag & drop para adicionar itens à hotbar
- Monitore status em tempo real durante o combate

### Ferramentas de Mestre
- Acesse o menu "Ferramentas de Campanha" no painel lateral
- Configure mapas com efeitos ambientais
- Gerencie encontros e combates
- Aplique efeitos e condições em massa

### Realizando Testes
- Clique nos botões de dados ao lado dos atributos
- Use os botões de teste rápido para dificuldades pré-definidas
- O sistema calculará automaticamente o resultado

### Combate
- Use as armas para atacar (botão de ataque)
- Role dano com o botão específico
- O sistema calcula automaticamente defesa e proteção

### Magias
- Clique no ícone de magia para conjurar
- O sistema reduz automaticamente os pontos de magia
- Informações aparecem no chat

## 📁 Estrutura do Sistema

```
sistema-n20-rpg/
├── system.json              # Manifesto do sistema
├── template.json            # Estrutura dos dados
├── README.md               # Este arquivo
├── LICENSE.txt             # Licença
├── module/
│   ├── sistema-n20-rpg.mjs # Arquivo principal
│   ├── documents/
│   │   ├── actor.mjs       # Classe do ator
│   │   └── item.mjs        # Classe do item
│   ├── sheets/
│   │   ├── actor-sheet.mjs # Ficha do ator
│   │   └── item-sheet.mjs  # Ficha do item
│   └── helpers/
│       ├── effects.mjs     # Sistema de efeitos
│       ├── handlebars-helpers.mjs # Helpers do Handlebars
│       └── campaign-tools.mjs # Ferramentas de campanha
├── templates/
│   ├── actor/              # Templates dos atores
│   │   ├── actor-personagem-sheet.html
│   │   ├── actor-npc-sheet.html
│   │   ├── actor-monstro-sheet.html
│   │   └── parts/          # Templates parciais
│   └── item/               # Templates dos itens
├── css/
│   └── sistema-n20-rpg.css # Estilos do sistema
└── lang/
    └── pt-BR.json          # Traduções em português
```

## 🚀 Novas Funcionalidades (v2.0.0)

### Sistema de Tokens
- Barras de status HP/MP nos tokens
- Drag & drop para hotbar
- Atualização em tempo real
- Configuração personalizada

### Interface Aprimorada
- Design medieval renovado
- Controles intuitivos para recursos
- Abas organizadas e funcionais
- Barras de progresso visuais

### Ferramentas de Mestre
- Kit completo de ferramentas de campanha
- Configuração avançada de mapas
- Gerenciamento de combate e encontros
- Ferramentas narrativas e de sessão

### Sistema de Efeitos
- Efeitos temporários e permanentes
- Integração com combate
- Gestão automática de equipamentos
- Sistema de encumbrance

## 🤝 Contribuindo

Este sistema foi desenvolvido para ser completo e funcional. Se você quiser contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua funcionalidade
3. Implemente as melhorias
4. Teste no Foundry VTT
5. Envie um pull request

## 📞 Suporte

### Problemas de Compatibilidade
Se você está vendo erros de compatibilidade, consulte: **[COMPATIBILIDADE.md](COMPATIBILIDADE.md)**

### Outros Problemas
Para dúvidas, problemas ou sugestões:
- Crie uma issue no GitHub
- Contate o desenvolvedor
- Participe da comunidade no Discord

## 📜 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE.txt para mais detalhes.

## 🎯 Roadmap

- [ ] Sistema de condições visuais
- [ ] Editor de mapas integrado
- [ ] Sistema de progressão avançado
- [ ] Integração com outros módulos
- [ ] Ferramentas de automação

## 🏆 Créditos

Desenvolvido para a comunidade brasileira de RPG de mesa, compatível com Foundry VTT v11+.

**Agradecimentos especiais:**
- Comunidade Foundry VTT Brasil
- Desenvolvedores do sistema Ordem Paranormal
- Beta testers e colaboradores

---

**Sistema N20 RPG** - A evolução completa para suas mesas de RPG! 🎲⚔️ 