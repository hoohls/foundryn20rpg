/**
 * Estender a classe base ItemSheet para criar uma ficha customizada de item
 */
export class SistemaN20RPGItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["sistema-n20-rpg", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/sistema-n20-rpg/templates/item";
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /** @override */
  getData() {
    // Recuperar dados base
    const context = super.getData();

    // Usar uma cópia dos dados do item para modificação
    const itemData = this.item.toObject(false);

    // Adicionar dados do sistema
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Preparar dados específicos do tipo de item
    if (itemData.type === 'arma') {
      this._prepareArmaData(context);
    } else if (itemData.type === 'armadura') {
      this._prepareArmaduraData(context);
    } else if (itemData.type === 'magia') {
      this._prepareMagiaData(context);
    } else if (itemData.type === 'habilidade') {
      this._prepareHabilidadeData(context);
    } else if (itemData.type === 'item') {
      this._prepareItemData(context);
    }

    return context;
  }

  /**
   * Preparar dados específicos de arma
   */
  _prepareArmaData(context) {
    // Opções para tipo de alcance
    context.alcanceOptions = [
      { value: "Corpo a corpo", label: "Corpo a corpo" },
      { value: "Distância", label: "Distância" },
      { value: "Arremesso", label: "Arremesso" }
    ];
  }

  /**
   * Preparar dados específicos de armadura
   */
  _prepareArmaduraData(context) {
    // Opções para tipo de armadura
    context.tipoArmaduraOptions = [
      { value: "Leve", label: "Leve" },
      { value: "Média", label: "Média" },
      { value: "Pesada", label: "Pesada" },
      { value: "Escudo", label: "Escudo" }
    ];
  }

  /**
   * Preparar dados específicos de magia
   */
  _prepareMagiaData(context) {
    // Opções para escola de magia
    context.escolaOptions = [
      { value: "Evocação", label: "Evocação" },
      { value: "Encantamento", label: "Encantamento" },
      { value: "Ilusão", label: "Ilusão" },
      { value: "Necromancia", label: "Necromancia" },
      { value: "Transmutação", label: "Transmutação" },
      { value: "Adivinhação", label: "Adivinhação" },
      { value: "Conjuração", label: "Conjuração" },
      { value: "Abjuração", label: "Abjuração" }
    ];

    // Opções para duração
    context.duracaoOptions = [
      { value: "Instantânea", label: "Instantânea" },
      { value: "Concentração", label: "Concentração" },
      { value: "1 rodada", label: "1 rodada" },
      { value: "1 minuto", label: "1 minuto" },
      { value: "10 minutos", label: "10 minutos" },
      { value: "1 hora", label: "1 hora" },
      { value: "8 horas", label: "8 horas" },
      { value: "24 horas", label: "24 horas" },
      { value: "Permanente", label: "Permanente" }
    ];

    // Opções para alcance
    context.alcanceMagiaOptions = [
      { value: "Toque", label: "Toque" },
      { value: "Pessoal", label: "Pessoal" },
      { value: "Curto (9m)", label: "Curto (9m)" },
      { value: "Médio (18m)", label: "Médio (18m)" },
      { value: "Longo (36m)", label: "Longo (36m)" },
      { value: "Linha de visão", label: "Linha de visão" }
    ];
  }

  /**
   * Preparar dados específicos de habilidade
   */
  _prepareHabilidadeData(context) {
    // Opções para tipo de habilidade
    context.tipoHabilidadeOptions = [
      { value: "Passiva", label: "Passiva" },
      { value: "Ativa", label: "Ativa" },
      { value: "Reação", label: "Reação" },
      { value: "Movimento", label: "Movimento" }
    ];
  }

  /**
   * Preparar dados específicos de item genérico
   */
  _prepareItemData(context) {
    // Opções para tipo de item
    context.tipoItemOptions = [
      { value: "Equipamento", label: "Equipamento" },
      { value: "Consumível", label: "Consumível" },
      { value: "Tesouro", label: "Tesouro" },
      { value: "Ferramenta", label: "Ferramenta" },
      { value: "Outro", label: "Outro" }
    ];
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Não fazer nada se a ficha não é editável
    if (!this.isEditable) return;

    // Ouvintes específicos por tipo de item
    if (this.item.type === 'arma') {
      // Botão para testar rolagem de dano
      html.find('.test-damage').click(this._onTestDamage.bind(this));
    }

    if (this.item.type === 'magia') {
      // Botão para testar magia
      html.find('.test-spell').click(this._onTestSpell.bind(this));
    }

    if (this.item.type === 'habilidade') {
      // Botão para resetar usos
      html.find('.reset-uses').click(this._onResetUses.bind(this));
    }

    // Editor de texto rico
    html.find('.editor-content').each((i, div) => {
      const editor = new foundry.applications.fields.HTMLField({
        name: div.dataset.field,
        value: div.innerHTML,
        label: div.dataset.label
      });
      editor.render(true);
    });
  }

  /**
   * Testar rolagem de dano da arma
   */
  _onTestDamage(event) {
    event.preventDefault();
    const dano = this.item.system.dano || "1d6";
    
    const roll = new Roll(dano);
    roll.evaluate();
    
    ui.notifications.info(`Teste de dano: ${dano} = ${roll.total}`);
  }

  /**
   * Testar magia (mostrar no chat)
   */
  _onTestSpell(event) {
    event.preventDefault();
    
    const chatData = {
      user: game.user.id,
      content: `
        <div class="spell-test">
          <h3>${this.item.name}</h3>
          <p><strong>Escola:</strong> ${this.item.system.escola}</p>
          <p><strong>Custo:</strong> ${this.item.system.custo} PM</p>
          <p><strong>Alcance:</strong> ${this.item.system.alcance}</p>
          <p><strong>Duração:</strong> ${this.item.system.duracao}</p>
          <p><strong>Descrição:</strong> ${this.item.system.descricao}</p>
        </div>
      `
    };
    
    ChatMessage.create(chatData);
  }

  /**
   * Resetar usos da habilidade
   */
  _onResetUses(event) {
    event.preventDefault();
    
    this.item.update({
      "system.usosAtual": this.item.system.usos
    });
    
    ui.notifications.info(`Usos de ${this.item.name} foram resetados.`);
  }

  /** @override */
  async _updateObject(event, formData) {
    // Atualizar o item
    return this.object.update(formData);
  }
} 