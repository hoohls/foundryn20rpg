# Sistema N20 RPG para Foundry VTT

Um sistema simples e intuitivo para jogar RPG de mesa no Foundry VTT, baseado em 4 atributos principais e sistema de rolagem 2d6 + atributo vs dificuldade.

## Características do Sistema

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

### Recursos do Sistema
- **Pontos de Vida**: Físico + 1d10
- **Pontos de Magia**: Mental × 2 (apenas se Mental > 0)
- **Sistema de Experiência**: Progressão por pontos de experiência
- **Equipamentos**: Armas, armaduras e itens diversos
- **Magias**: Sistema de escolas mágicas com custo em PM
- **Habilidades**: Habilidades especiais ativas e passivas

## Tipos de Personagem

### Personagem
- Ficha completa com todas as funcionalidades
- Biografia detalhada
- Sistema de progressão
- Inventário completo

### NPC (Non-Player Character)
- Ficha simplificada para mestres
- Informações de comportamento e importância
- Equipamentos básicos

### Monstro
- Ficha focada em combate
- Tipos de criaturas e instintos
- Nível de desafio (ND)
- Habilidades especiais

## Itens Disponíveis

### Armas
- Dano configurável
- Alcance (corpo a corpo, distância, arremesso)
- Propriedades especiais
- Sistema de durabilidade

### Armaduras
- Proteção e penalidades
- Diferentes tipos e categorias
- Equipamento automático

### Magias
- 8 escolas de magia
- Custo em pontos de magia
- Alcance e duração configuráveis
- Sistema de componentes

### Habilidades
- Passivas e ativas
- Limitação de usos
- Pré-requisitos
- Fonte da habilidade

### Itens Diversos
- Equipamentos gerais
- Consumíveis
- Ferramentas
- Tesouros

## Instalação

### Instalação Manual
1. Baixe todos os arquivos deste repositório
2. Crie uma pasta `sistema-n20-rpg` em `Data/systems/` do seu Foundry VTT
3. Copie todos os arquivos para esta pasta
4. Reinicie o Foundry VTT
5. Crie um novo mundo e selecione "Sistema N20 RPG" como sistema

### Instalação via Manifest (Recomendado)
1. No Foundry VTT, vá para "Game Systems"
2. Clique em "Install System"
3. Cole o URL do manifest: `[URL_DO_MANIFEST]`
4. Clique em "Install"

## Como Usar

### Criando Personagens
1. Crie um novo ator do tipo "Personagem"
2. Preencha as informações básicas (nome, raça, classe, etc.)
3. Distribua os pontos de atributo conforme desejar
4. Adicione equipamentos, magias e habilidades
5. Complete a biografia e personalidade

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

## Estrutura do Sistema

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
│       └── templates.mjs   # Helpers do Handlebars
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

## Contribuindo

Este sistema foi desenvolvido para ser simples e funcional. Se você quiser contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua funcionalidade
3. Implemente as melhorias
4. Teste no Foundry VTT
5. Envie um pull request

## Suporte

Para dúvidas, problemas ou sugestões:
- Crie uma issue no GitHub
- Contate o desenvolvedor

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE.txt para mais detalhes.

## Créditos

Desenvolvido para a comunidade brasileira de RPG de mesa, compatível com Foundry VTT v11+.

---

**Sistema N20 RPG** - Simplicidade e diversão para suas mesas de RPG! 