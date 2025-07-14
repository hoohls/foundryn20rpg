# Changelog - Sistema N20 RPG

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planejado
- Sistema de condições visuais
- Editor de mapas integrado
- Sistema de progressão avançado
- Integração com outros módulos
- Ferramentas de automação

## [2.0.0] - 2024-01-XX

### Adicionado
- **Sistema de Tokens Avançado**
  - Barras de status HP/MP nos tokens (similar ao Brawl Bar)
  - Configuração automática de token ao criar atores
  - Atualização em tempo real das barras de status
  - Suporte a drag & drop para hotbar

- **Interface Rica e Melhorada**
  - Design completamente renovado com tema medieval
  - Controles intuitivos com botões +/- para recursos
  - Abas organizadas (Inventário, Magias, Habilidades, Efeitos, Biografia)
  - Barras de progresso visuais para HP, MP e experiência
  - Controles de descanso integrados
  - Sistema de imagem de perfil para personagens

- **Ferramentas Completas de Mestre**
  - **Ferramentas de Mapa**: Configuração de cena, marcadores, efeitos ambientais
  - **Ferramentas de Combate**: Configuração de encontros, aplicação de condições
  - **Ferramentas Narrativas**: Entradas de diário, mensagens narrativas
  - **Gerenciamento de Sessão**: Início/fim de sessão, distribuição de XP
  - **Utilitários**: Encontros aleatórios, geração de tesouro, descanso em massa
  - Interface unificada com janela de toolkit completo

- **Sistema de Efeitos Robusto**
  - Aplicação e gerenciamento de efeitos temporários
  - Integração automática com combate
  - Sistema de encumbrance automático
  - Gestão inteligente de equipamentos
  - Efeitos de magias e habilidades

- **Melhorias no Sistema de Combate**
  - Cálculo automático de iniciativa
  - Aplicação de dano/cura com botões interativos no chat
  - Sistema de descanso (curto e longo)
  - Gerenciamento automático de recursos

- **Handlebars Helpers Expandidos**
  - Helpers matemáticos (add, subtract, multiply, divide)
  - Helpers de comparação (eq, ne, lt, gt, etc.)
  - Helpers de formatação (capitalize, pluralize)
  - Helpers específicos do sistema (colorFromValue, iconFromType)

### Melhorado
- **Documento do Ator**
  - Preparação de dados aprimorada para todos os tipos
  - Métodos de ação integrados (rolagem, ataque, dano, magia)
  - Sistema de experiência e progressão
  - Gerenciamento avançado de recursos

- **Ficha do Ator**
  - Interface completamente redesenhada
  - Melhor organização de dados
  - Controles mais intuitivos
  - Integração com sistema de efeitos

- **Sistema Principal**
  - Integração com hotbar
  - Gerenciamento de configurações
  - Mensagens de chat aprimoradas
  - Sistema de hooks expandido

### Técnico
- Configuração para instalação via Git
- Suporte a hot reload para desenvolvimento
- Estrutura modular aprimorada
- Documentação completa para desenvolvedores

## [1.0.0] - 2023-XX-XX

### Adicionado
- **Sistema Base**
  - Sistema de 4 atributos (Físico, Mental, Social, Ação)
  - Sistema de rolagem 2d6 + atributo vs dificuldade
  - Três tipos de atores (Personagem, NPC, Monstro)
  - Cinco tipos de itens (Arma, Armadura, Magia, Habilidade, Item)

- **Fichas Básicas**
  - Ficha de personagem com abas
  - Ficha simplificada de NPC
  - Ficha de monstro focada em combate
  - Fichas de itens com propriedades específicas

- **Sistema de Combate**
  - Cálculo de defesa (10 + Ação + Armadura)
  - Sistema de dano e proteção
  - Rolagem de ataque e dano

- **Sistema de Magia**
  - 8 escolas de magia
  - Custo em pontos de magia
  - Sistema de componentes

- **Outros Recursos**
  - Sistema de experiência básico
  - Inventário e equipamentos
  - Localização em português brasileiro
  - Tema visual medieval básico

### Técnico
- Estrutura básica do sistema Foundry VTT
- Templates Handlebars
- Estilos CSS básicos
- Manifesto do sistema (system.json)
- Dados do template (template.json)

---

## Tipos de Mudanças

- **Adicionado** para novas funcionalidades
- **Melhorado** para mudanças em funcionalidades existentes
- **Depreciado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para vulnerabilidades de segurança
- **Técnico** para mudanças técnicas internas

## Links de Comparação

- [Unreleased]: https://github.com/seu-usuario/sistema-n20-rpg/compare/v2.0.0...HEAD
- [2.0.0]: https://github.com/seu-usuario/sistema-n20-rpg/compare/v1.0.0...v2.0.0
- [1.0.0]: https://github.com/seu-usuario/sistema-n20-rpg/releases/tag/v1.0.0 