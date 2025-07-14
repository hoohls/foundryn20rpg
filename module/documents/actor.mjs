/**
 * Estender a classe base Actor para criar um ator customizado para o sistema N20 RPG
 */
export class SistemaN20RPGActor extends Actor {
  
  /** @override */
  prepareData() {
    super.prepareData();
    
    // Prepare common data for all actor types
    this._prepareCommonData();
    
    // Prepare data based on actor type
    if (this.type === 'personagem') {
      this._preparePersonagemData();
    } else if (this.type === 'npc') {
      this._prepareNPCData();
    } else if (this.type === 'monstro') {
      this._prepareMonstroData();
    }
  }
  
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    
    // Prepare token data
    this._prepareTokenData();
  }
  
  /**
   * Prepare common data for all actor types
   */
  _prepareCommonData() {
    const data = this.system;
    
    // Calculate attribute modifiers
    for (let [key, attr] of Object.entries(data.atributos)) {
      attr.mod = Math.floor((attr.value - 10) / 2);
    }
    
    // Calculate defense (10 + Ação + Armadura)
    data.combate.defesa = 10 + data.atributos.acao.value + data.combate.armadura;
    
    // Calculate carrying capacity
    data.equipamentos.capacidade.max = data.atributos.fisico.value * 5;
    data.equipamentos.capacidade.atual = this._calculateCarryingWeight();
    
    // Update equipped items bonuses
    this._updateEquippedItems();
  }
  
  /**
   * Prepare data specific to personagem
   */
  _preparePersonagemData() {
    const data = this.system;
    
    // Calculate HP max if not set
    if (!data.recursos.hp.max) {
      data.recursos.hp.max = data.atributos.fisico.value + 10;
    }
    
    // Calculate MP max
    data.recursos.mp.max = data.atributos.mental.value * 2;
    
    // Ensure HP doesn't exceed maximum
    data.recursos.hp.value = Math.min(data.recursos.hp.value, data.recursos.hp.max);
    data.recursos.mp.value = Math.min(data.recursos.mp.value, data.recursos.mp.max);
    
    // Calculate experience progression
    this._calculateExperienceProgression();
  }
  
  /**
   * Prepare data specific to NPC
   */
  _prepareNPCData() {
    const data = this.system;
    
    // NPCs have simpler resource management
    data.recursos.hp.max = data.recursos.hp.max || (data.atributos.fisico.value + 10);
    data.recursos.mp.max = data.recursos.mp.max || (data.atributos.mental.value * 2);
  }
  
  /**
   * Prepare data specific to monstro
   */
  _prepareMonstroData() {
    const data = this.system;
    
    // Monsters might have different resource calculations
    data.recursos.hp.max = data.recursos.hp.max || (data.atributos.fisico.value + 15);
    data.recursos.mp.max = data.recursos.mp.max || (data.atributos.mental.value * 1.5);
  }
  
  /**
   * Prepare token data for display
   */
  _prepareTokenData() {
    const data = this.system;
    
    // Primary bar (HP)
    this.token.bar1 = {
      value: data.recursos.hp.value,
      max: data.recursos.hp.max,
      type: 'value',
      label: 'HP'
    };
    
    // Secondary bar (MP)
    this.token.bar2 = {
      value: data.recursos.mp.value,
      max: data.recursos.mp.max,
      type: 'value',
      label: 'MP'
    };
    
    // Update token display name
    this.token.name = this.name;
    
    // Set token disposition based on actor type
    if (this.type === 'personagem') {
      this.token.disposition = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
    } else if (this.type === 'npc') {
      this.token.disposition = CONST.TOKEN_DISPOSITIONS.NEUTRAL;
    } else if (this.type === 'monstro') {
      this.token.disposition = CONST.TOKEN_DISPOSITIONS.HOSTILE;
    }
  }
  
  /**
   * Calculate experience progression
   */
  _calculateExperienceProgression() {
    const data = this.system;
    const currentXP = data.experiencia.atual;
    const level = data.experiencia.nivel;
    
    // Calculate XP needed for next level (simple progression)
    const xpForNextLevel = level * 1000;
    data.experiencia.proximo = xpForNextLevel;
    
    // Check if character should level up
    if (currentXP >= xpForNextLevel) {
      data.experiencia.nivel += 1;
      data.experiencia.atual = currentXP - xpForNextLevel;
      
      // Notify about level up
      ui.notifications.info(`${this.name} subiu para o nível ${data.experiencia.nivel}!`);
    }
  }
  
  /**
   * Calculate current carrying weight
   */
  _calculateCarryingWeight() {
    let totalWeight = 0;
    
    for (let item of this.items) {
      if (item.system.peso) {
        totalWeight += item.system.peso * (item.system.quantidade || 1);
      }
    }
    
    return totalWeight;
  }
  
  /**
   * Update bonuses from equipped items
   */
  _updateEquippedItems() {
    const data = this.system;
    
    // Reset bonuses
    data.combate.armadura = 0;
    data.combate.bonus_ataque = 0;
    data.combate.bonus_dano = 0;
    
    // Apply equipment bonuses
    for (let item of this.items) {
      if (item.system.equipado) {
        if (item.type === 'armadura') {
          data.combate.armadura += item.system.defesa || 0;
        } else if (item.type === 'arma') {
          data.combate.bonus_ataque += item.system.bonus_ataque || 0;
          data.combate.bonus_dano += item.system.bonus_dano || 0;
        }
      }
    }
  }
  
  /**
   * Roll attribute test
   */
  async rollAttribute(attributeName) {
    const attribute = this.system.atributos[attributeName];
    if (!attribute) return;
    
    const roll = new Roll("2d6 + @mod", { mod: attribute.value });
    await roll.evaluate();
    
    const flavor = `${game.i18n.localize(`SISTEMA_N20_RPG.Atributos.${attributeName}`)} (${attribute.value})`;
    
    // Determine success/failure
    const difficulty = 12; // Default difficulty
    const success = roll.total >= difficulty;
    const resultText = success ? 
      `<span style="color: green;">Sucesso!</span>` : 
      `<span style="color: red;">Falha!</span>`;
    
    const content = `
      <div class="dice-roll">
        <div class="dice-result">
          <div class="dice-formula">${roll.formula}</div>
          <div class="dice-tooltip">
            <section class="tooltip-part">
              <div class="dice">
                <ol class="dice-rolls">
                  ${roll.terms[0].results.map(r => `<li class="roll die d6">${r.result}</li>`).join('')}
                </ol>
              </div>
            </section>
          </div>
          <h4 class="dice-total">${roll.total}</h4>
        </div>
        <div class="dice-success">${resultText}</div>
      </div>
    `;
    
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: flavor,
      content: content
    });
    
    return roll;
  }
  
  /**
   * Make a weapon attack
   */
  async makeAttack(weaponId) {
    const weapon = this.items.get(weaponId);
    if (!weapon || weapon.type !== 'arma') return;
    
    const attackRoll = new Roll("2d6 + @acao + @bonus", {
      acao: this.system.atributos.acao.value,
      bonus: weapon.system.bonus_ataque || 0
    });
    
    await attackRoll.evaluate();
    
    const flavor = `Ataque com ${weapon.name}`;
    
    const content = `
      <div class="attack-roll">
        <h3>Ataque: ${weapon.name}</h3>
        <div class="dice-result">
          <div class="dice-formula">${attackRoll.formula}</div>
          <h4 class="dice-total">Total: ${attackRoll.total}</h4>
        </div>
        <div class="weapon-info">
          <p><strong>Dano:</strong> ${weapon.system.dano}</p>
          <p><strong>Tipo:</strong> ${weapon.system.tipo}</p>
          <p><strong>Alcance:</strong> ${weapon.system.alcance}</p>
        </div>
      </div>
    `;
    
    await attackRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: flavor,
      content: content
    });
    
    return attackRoll;
  }
  
  /**
   * Roll damage
   */
  async rollDamage(weaponId) {
    const weapon = this.items.get(weaponId);
    if (!weapon || weapon.type !== 'arma') return;
    
    const damageFormula = weapon.system.dano;
    const damageRoll = new Roll(damageFormula);
    await damageRoll.evaluate();
    
    const flavor = `Dano - ${weapon.name}`;
    
    await damageRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: flavor
    });
    
    return damageRoll;
  }
  
  /**
   * Take damage
   */
  async takeDamage(damage) {
    const currentHP = this.system.recursos.hp.value;
    const newHP = Math.max(0, currentHP - damage);
    
    await this.update({"system.recursos.hp.value": newHP});
    
    const message = newHP > 0 ? 
      `${this.name} sofreu ${damage} de dano. HP atual: ${newHP}/${this.system.recursos.hp.max}` :
      `${this.name} foi derrotado!`;
    
    ui.notifications.info(message);
    
    // Create chat message
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<div class="damage-message">${message}</div>`
    });
  }
  
  /**
   * Heal damage
   */
  async heal(amount) {
    const currentHP = this.system.recursos.hp.value;
    const maxHP = this.system.recursos.hp.max;
    const newHP = Math.min(maxHP, currentHP + amount);
    
    await this.update({"system.recursos.hp.value": newHP});
    
    const message = `${this.name} recuperou ${amount} HP. HP atual: ${newHP}/${maxHP}`;
    ui.notifications.info(message);
    
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<div class="heal-message">${message}</div>`
    });
  }
  
  /**
   * Cast a spell
   */
  async castSpell(spellId) {
    const spell = this.items.get(spellId);
    if (!spell || spell.type !== 'magia') return;
    
    const mpCost = spell.system.custo_mp;
    const currentMP = this.system.recursos.mp.value;
    
    if (currentMP < mpCost) {
      ui.notifications.warn(`MP insuficiente para conjurar ${spell.name}`);
      return;
    }
    
    // Reduce MP
    await this.update({"system.recursos.mp.value": currentMP - mpCost});
    
    // Create spell roll if needed
    let roll = null;
    if (spell.system.teste_atributo) {
      roll = await this.rollAttribute(spell.system.teste_atributo);
    }
    
    const content = `
      <div class="spell-cast">
        <h3>Magia: ${spell.name}</h3>
        <p><strong>Escola:</strong> ${spell.system.escola}</p>
        <p><strong>Custo MP:</strong> ${mpCost}</p>
        <p><strong>Alcance:</strong> ${spell.system.alcance}</p>
        <p><strong>Duração:</strong> ${spell.system.duracao}</p>
        <p><strong>Efeito:</strong> ${spell.system.efeito}</p>
        ${roll ? `<p><strong>Resultado do Teste:</strong> ${roll.total}</p>` : ''}
      </div>
    `;
    
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: content
    });
    
    return roll;
  }
  
  /**
   * Use an ability
   */
  async useAbility(abilityId) {
    const ability = this.items.get(abilityId);
    if (!ability || ability.type !== 'habilidade') return;
    
    const usesLeft = ability.system.usos_restantes;
    if (usesLeft <= 0) {
      ui.notifications.warn(`${ability.name} não possui mais usos disponíveis`);
      return;
    }
    
    // Reduce uses
    await ability.update({"system.usos_restantes": usesLeft - 1});
    
    let roll = null;
    if (ability.system.teste_atributo) {
      roll = await this.rollAttribute(ability.system.teste_atributo);
    }
    
    const content = `
      <div class="ability-use">
        <h3>Habilidade: ${ability.name}</h3>
        <p><strong>Efeito:</strong> ${ability.system.efeito}</p>
        <p><strong>Usos Restantes:</strong> ${ability.system.usos_restantes}/${ability.system.usos_max}</p>
        ${roll ? `<p><strong>Resultado do Teste:</strong> ${roll.total}</p>` : ''}
      </div>
    `;
    
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: content
    });
    
    return roll;
  }
  
  /**
   * Rest (restore resources)
   */
  async rest(type = 'short') {
    const updates = {};
    
    if (type === 'short') {
      // Short rest: restore some HP and MP
      const hpRestore = Math.floor(this.system.recursos.hp.max * 0.25);
      const mpRestore = Math.floor(this.system.recursos.mp.max * 0.5);
      
      updates["system.recursos.hp.value"] = Math.min(
        this.system.recursos.hp.max,
        this.system.recursos.hp.value + hpRestore
      );
      
      updates["system.recursos.mp.value"] = Math.min(
        this.system.recursos.mp.max,
        this.system.recursos.mp.value + mpRestore
      );
      
      ui.notifications.info(`${this.name} descansou e recuperou ${hpRestore} HP e ${mpRestore} MP`);
      
    } else if (type === 'long') {
      // Long rest: restore all resources
      updates["system.recursos.hp.value"] = this.system.recursos.hp.max;
      updates["system.recursos.mp.value"] = this.system.recursos.mp.max;
      
      // Restore ability uses
      const abilityUpdates = [];
      for (let ability of this.items.filter(i => i.type === 'habilidade')) {
        abilityUpdates.push({
          _id: ability.id,
          "system.usos_restantes": ability.system.usos_max
        });
      }
      
      if (abilityUpdates.length > 0) {
        await this.updateEmbeddedDocuments("Item", abilityUpdates);
      }
      
      ui.notifications.info(`${this.name} descansou completamente e restaurou todos os recursos`);
    }
    
    await this.update(updates);
  }
} 