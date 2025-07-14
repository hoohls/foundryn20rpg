/**
 * Estender a classe base Item para criar um item customizado para o sistema N20 RPG
 */
export class SistemaN20RPGItem extends Item {

  /**
   * Preparar dados do item após inicialização
   */
  prepareData() {
    // Chamar o método da classe pai
    super.prepareData();

    const itemData = this;
    const data = itemData.system;

    // Preparar dados específicos do tipo de item
    if (itemData.type === 'arma') this._prepareArmaData(itemData);
    if (itemData.type === 'armadura') this._prepareArmaduraData(itemData);
    if (itemData.type === 'magia') this._prepareMagiaData(itemData);
    if (itemData.type === 'habilidade') this._prepareHabilidadeData(itemData);
    if (itemData.type === 'item') this._prepareItemData(itemData);
  }

  /**
   * Preparar dados de arma
   */
  _prepareArmaData(itemData) {
    const data = itemData.system;
    
    // Garantir que armas tenham valores padrão
    if (!data.dano) data.dano = "1d6";
    if (!data.alcance) data.alcance = "Corpo a corpo";
    if (!data.peso) data.peso = 1;
    if (!data.preco) data.preco = 0;
  }

  /**
   * Preparar dados de armadura
   */
  _prepareArmaduraData(itemData) {
    const data = itemData.system;
    
    // Garantir que armaduras tenham valores padrão
    if (!data.protecao) data.protecao = 1;
    if (!data.penalidade) data.penalidade = 0;
    if (!data.peso) data.peso = 5;
    if (!data.preco) data.preco = 0;
  }

  /**
   * Preparar dados de magia
   */
  _prepareMagiaData(itemData) {
    const data = itemData.system;
    
    // Garantir que magias tenham valores padrão
    if (!data.custo) data.custo = 1;
    if (!data.alcance) data.alcance = "Toque";
    if (!data.duracao) data.duracao = "Instantânea";
    if (!data.escola) data.escola = "Evocação";
  }

  /**
   * Preparar dados de habilidade
   */
  _prepareHabilidadeData(itemData) {
    const data = itemData.system;
    
    // Garantir que habilidades tenham valores padrão
    if (!data.tipo) data.tipo = "Passiva";
    if (!data.usos) data.usos = 0; // 0 = ilimitado
    if (!data.usosAtual) data.usosAtual = data.usos;
  }

  /**
   * Preparar dados de item genérico
   */
  _prepareItemData(itemData) {
    const data = itemData.system;
    
    // Garantir que itens tenham valores padrão
    if (!data.quantidade) data.quantidade = 1;
    if (!data.peso) data.peso = 1;
    if (!data.preco) data.preco = 0;
  }

  /**
   * Usar/Rolar item
   */
  async roll() {
    const item = this;
    const actor = this.actor;
    
    if (!actor) {
      ui.notifications.error("Este item não está associado a um ator!");
      return;
    }

    // Chamar método específico baseado no tipo
    switch (item.type) {
      case 'arma':
        return this._rollArma();
      case 'magia':
        return actor.usarMagia(item.id);
      case 'habilidade':
        return actor.usarHabilidade(item.id);
      default:
        return this._mostrarItem();
    }
  }

  /**
   * Rolar ataque com arma
   */
  async _rollArma() {
    const item = this;
    const actor = this.actor;
    
    // Determinar atributo baseado no tipo de arma
    let atributo = 'fisico'; // padrão para armas corpo a corpo
    
    if (item.system.alcance && item.system.alcance.toLowerCase().includes('distância')) {
      atributo = 'acao';
    }

    // Criar botões para o chat
    const buttons = `
      <div class="weapon-buttons">
        <button onclick="game.actors.get('${actor.id}').rollAtributo('${atributo}', 10)">
          Atacar (${atributo.toUpperCase()})
        </button>
        <button onclick="game.actors.get('${actor.id}').rollDano('${item.id}')">
          Dano (${item.system.dano})
        </button>
      </div>
    `;

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: `
        <div class="weapon-attack">
          <strong>${item.name}</strong><br>
          <em>Dano: ${item.system.dano}</em><br>
          <em>Alcance: ${item.system.alcance}</em><br>
          ${buttons}
        </div>
      `
    };

    return ChatMessage.create(chatData);
  }

  /**
   * Mostrar item no chat
   */
  async _mostrarItem() {
    const item = this;
    const actor = this.actor;

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: `
        <div class="item-display">
          <strong>${item.name}</strong><br>
          <em>${item.system.descricao || 'Sem descrição'}</em>
        </div>
      `
    };

    return ChatMessage.create(chatData);
  }

  /**
   * Método para equipar/desequipar item
   */
  async toggleEquip() {
    const item = this;
    const equipado = item.system.equipado || false;
    
    await item.update({
      "system.equipado": !equipado
    });
    
    const status = !equipado ? "equipado" : "desequipado";
    ui.notifications.info(`${item.name} foi ${status}.`);
  }
} 