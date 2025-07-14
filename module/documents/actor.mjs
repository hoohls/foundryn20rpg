/**
 * Estender a classe base Actor para criar um ator customizado para o sistema N20 RPG
 */
export class SistemaN20RPGActor extends Actor {

  /**
   * Preparar dados do ator após inicialização
   */
  prepareData() {
    // Chamar o método da classe pai
    super.prepareData();

    const actorData = this;
    const data = actorData.system;
    const flags = actorData.flags.sisteman20rpg || {};

    // Preparar dados específicos do tipo de ator
    if (actorData.type === 'personagem') this._preparePersonagemData(actorData);
    if (actorData.type === 'npc') this._prepareNpcData(actorData);
    if (actorData.type === 'monstro') this._prepareMonstroData(actorData);
  }

  /**
   * Preparar dados de personagem
   */
  _preparePersonagemData(actorData) {
    const data = actorData.system;

    // Calcular modificadores dos atributos
    if (data.atributos) {
      for (let [key, atributo] of Object.entries(data.atributos)) {
        atributo.mod = Math.floor((atributo.valor - 10) / 2);
      }
    }

    // Calcular defesa (10 + Ação + Armadura)
    if (data.combate) {
      const acaoMod = data.atributos?.acao?.mod || 0;
      const armadura = data.combate.armadura || 0;
      data.combate.defesa = 10 + acaoMod + armadura;
    }

    // Calcular proteção (valor da armadura)
    if (data.combate && data.combate.armadura) {
      data.combate.protecao = data.combate.armadura;
    }

    // Calcular pontos de magia se mental > 0
    if (data.atributos?.mental?.valor > 0) {
      data.combate.pm = data.atributos.mental.valor * 2;
    }
  }

  /**
   * Preparar dados de NPC
   */
  _prepareNpcData(actorData) {
    // NPCs seguem as mesmas regras básicas que personagens
    this._preparePersonagemData(actorData);
  }

  /**
   * Preparar dados de monstro
   */
  _prepareMonstroData(actorData) {
    // Monstros seguem as mesmas regras básicas que personagens
    this._preparePersonagemData(actorData);
  }

  /**
   * Rolar atributo (2d6 + atributo vs dificuldade)
   */
  async rollAtributo(atributo, dificuldade = 10) {
    const data = this.system;
    const atributoData = data.atributos[atributo];
    
    if (!atributoData) {
      ui.notifications.error(`Atributo ${atributo} não encontrado!`);
      return;
    }

    const roll = new Roll("2d6 + @mod", {
      mod: atributoData.mod
    });

    await roll.evaluate();

    const success = roll.total >= dificuldade;
    const resultado = success ? "Sucesso" : "Falha";
    const cor = success ? "green" : "red";

    const template = `
      <div class="dice-roll">
        <div class="dice-result">
          <div class="dice-formula">${roll.formula}</div>
          <div class="dice-tooltip" style="display: none;">
            <div class="dice-formula">${roll.formula}</div>
            <div class="dice-total">${roll.total}</div>
          </div>
          <h4 class="dice-total" style="color: ${cor};">${roll.total}</h4>
        </div>
        <div class="dice-interpretation">
          <strong>Teste de ${atributo.toUpperCase()}</strong><br>
          Dificuldade: ${dificuldade}<br>
          <strong style="color: ${cor};">${resultado}</strong>
        </div>
      </div>
    `;

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: template,
      rolls: [roll]
    };

    return ChatMessage.create(chatData);
  }

  /**
   * Rolar dano de arma
   */
  async rollDano(itemId) {
    const item = this.items.get(itemId);
    if (!item) {
      ui.notifications.error("Arma não encontrada!");
      return;
    }

    const dano = item.system.dano || "1d6";
    const roll = new Roll(dano);
    await roll.evaluate();

    const template = `
      <div class="dice-roll">
        <div class="dice-result">
          <div class="dice-formula">${roll.formula}</div>
          <h4 class="dice-total">${roll.total}</h4>
        </div>
        <div class="dice-interpretation">
          <strong>Dano - ${item.name}</strong><br>
          Dano causado: ${roll.total}
        </div>
      </div>
    `;

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: template,
      rolls: [roll]
    };

    return ChatMessage.create(chatData);
  }

  /**
   * Usar magia
   */
  async usarMagia(itemId) {
    const item = this.items.get(itemId);
    if (!item) {
      ui.notifications.error("Magia não encontrada!");
      return;
    }

    const custoMagia = item.system.custo || 1;
    const pmAtual = this.system.combate.pm || 0;

    if (pmAtual < custoMagia) {
      ui.notifications.error("Pontos de magia insuficientes!");
      return;
    }

    // Reduzir pontos de magia
    await this.update({
      "system.combate.pm": pmAtual - custoMagia
    });

    // Criar mensagem no chat
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `
        <div class="spell-cast">
          <strong>${item.name}</strong> foi conjurada!<br>
          <em>${item.system.descricao || ''}</em><br>
          <small>Custo: ${custoMagia} PM</small>
        </div>
      `
    };

    return ChatMessage.create(chatData);
  }

  /**
   * Usar habilidade especial
   */
  async usarHabilidade(itemId) {
    const item = this.items.get(itemId);
    if (!item) {
      ui.notifications.error("Habilidade não encontrada!");
      return;
    }

    // Criar mensagem no chat
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `
        <div class="ability-use">
          <strong>${item.name}</strong> foi usada!<br>
          <em>${item.system.descricao || ''}</em>
        </div>
      `
    };

    return ChatMessage.create(chatData);
  }
} 