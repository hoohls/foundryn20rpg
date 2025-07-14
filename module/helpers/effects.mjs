/**
 * Manage Active Effect instances through the Actor Sheet via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner       The owning entity which has the effect
 */
export function onManageActiveEffect(event, owner) {
  event.preventDefault();
  const a = event.currentTarget;
  const li = a.closest("li");
  const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
  
  switch (a.dataset.action) {
    case "create":
      return owner.createEmbeddedDocuments("ActiveEffect", [{
        label: "Novo Efeito",
        icon: "icons/svg/aura.svg",
        origin: owner.uuid,
        "duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
        disabled: li.dataset.effectType === "inactive"
      }]);
    case "edit":
      return effect.sheet.render(true);
    case "delete":
      return effect.delete();
    case "toggle":
      return effect.update({disabled: !effect.disabled});
  }
}

/**
 * Prepare the data structure for Active Effects which are currently applied to an Actor or Item.
 * @param {ActiveEffect[]} effects    The array of Active Effect instances to prepare sheet data for
 * @return {object}                   Data for rendering
 */
export function prepareActiveEffectCategories(effects) {
  // Define effect header categories
  const categories = {
    temporary: {
      type: "temporary",
      label: "Efeitos Temporários",
      effects: []
    },
    passive: {
      type: "passive",
      label: "Efeitos Passivos",
      effects: []
    },
    inactive: {
      type: "inactive",
      label: "Efeitos Inativos",
      effects: []
    }
  };

  // Iterate over active effects, classifying them into categories
  for (let e of effects) {
    if (e.disabled) categories.inactive.effects.push(e);
    else if (e.isTemporary) categories.temporary.effects.push(e);
    else categories.passive.effects.push(e);
  }
  
  return categories;
}

/**
 * Create a macro for an item or active effect
 * @param {Item|ActiveEffect} item
 * @param {string} slot
 */
export function createMacro(item, slot) {
  const command = `game.actors.get("${item.actor.id}").items.get("${item.id}").roll()`;
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  
  if (!macro) {
    macro = Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "sistema-n20-rpg.itemMacro": true }
    });
  }
  
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a contextual damage formula from an item's damage parts
 * @param {Item} item
 * @param {boolean} critical
 * @returns {string}
 */
export function getDamageRollFormula(item, critical = false) {
  const parts = item.system.damage?.parts || [];
  const formula = parts.map(part => {
    let [formula, type] = part;
    if (critical) {
      // Double the dice for critical hits
      formula = formula.replace(/(\d+)d(\d+)/g, (match, count, size) => {
        return `${count * 2}d${size}`;
      });
    }
    return formula;
  }).join(' + ');
  
  return formula || '1d4';
}

/**
 * Apply damage to an actor
 * @param {Actor} actor
 * @param {number} damage
 * @param {string} type
 */
export async function applyDamage(actor, damage, type = 'physical') {
  const currentHP = actor.system.recursos.hp.value;
  const armor = actor.system.combate.armadura || 0;
  
  // Apply armor reduction
  const finalDamage = Math.max(0, damage - armor);
  const newHP = Math.max(0, currentHP - finalDamage);
  
  await actor.update({"system.recursos.hp.value": newHP});
  
  // Create chat message
  const message = `${actor.name} sofreu ${finalDamage} de dano (${damage} - ${armor} armadura)`;
  
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: actor }),
    content: `<div class="damage-applied">${message}</div>`,
    sound: CONFIG.sounds.notification
  });
  
  // Check if actor is defeated
  if (newHP <= 0) {
    ui.notifications.warn(`${actor.name} foi derrotado!`);
    
    // Apply defeated condition
    const defeatedEffect = {
      label: "Derrotado",
      icon: "icons/svg/skull.svg",
      origin: actor.uuid,
      disabled: false,
      changes: []
    };
    
    await actor.createEmbeddedDocuments("ActiveEffect", [defeatedEffect]);
  }
}

/**
 * Apply healing to an actor
 * @param {Actor} actor
 * @param {number} healing
 */
export async function applyHealing(actor, healing) {
  const currentHP = actor.system.recursos.hp.value;
  const maxHP = actor.system.recursos.hp.max;
  const newHP = Math.min(maxHP, currentHP + healing);
  
  await actor.update({"system.recursos.hp.value": newHP});
  
  // Create chat message
  const message = `${actor.name} recuperou ${healing} HP`;
  
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: actor }),
    content: `<div class="healing-applied">${message}</div>`,
    sound: CONFIG.sounds.notification
  });
}

/**
 * Toggle equipment state
 * @param {Actor} actor
 * @param {Item} item
 */
export async function toggleEquipment(actor, item) {
  const equipped = !item.system.equipado;
  await item.update({"system.equipado": equipped});
  
  // Update actor derived data
  actor.prepareData();
  
  const message = equipped ? 
    `${item.name} foi equipado` : 
    `${item.name} foi desequipado`;
  
  ui.notifications.info(message);
}

/**
 * Calculate combat initiative
 * @param {Actor} actor
 * @returns {number}
 */
export function calculateInitiative(actor) {
  const baseInitiative = actor.system.atributos.acao.value;
  const roll = new Roll("1d20 + @init", { init: baseInitiative });
  return roll.evaluate();
}

/**
 * Handle token bar updates
 * @param {Token} token
 * @param {object} updateData
 */
export function updateTokenBars(token, updateData) {
  const actor = token.actor;
  if (!actor) return;
  
  // Update HP bar
  if (updateData.bar1) {
    token.document.update({
      "bar1.value": actor.system.recursos.hp.value,
      "bar1.max": actor.system.recursos.hp.max
    });
  }
  
  // Update MP bar
  if (updateData.bar2) {
    token.document.update({
      "bar2.value": actor.system.recursos.mp.value,
      "bar2.max": actor.system.recursos.mp.max
    });
  }
}

/**
 * Create a spell effect
 * @param {Item} spell
 * @param {Actor} caster
 * @param {Actor[]} targets
 */
export async function createSpellEffect(spell, caster, targets = []) {
  const effectData = {
    label: spell.name,
    icon: spell.img,
    origin: spell.uuid,
    duration: {
      rounds: spell.system.duracao_rounds || 0,
      seconds: spell.system.duracao_segundos || 0
    },
    changes: spell.system.changes || [],
    disabled: false
  };
  
  // Apply to targets or caster
  const actors = targets.length > 0 ? targets : [caster];
  
  for (const actor of actors) {
    await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
  }
}

/**
 * Get encumbrance level
 * @param {Actor} actor
 * @returns {object}
 */
export function getEncumbranceLevel(actor) {
  const system = actor.system;
  const current = system.equipamentos.capacidade.atual;
  const max = system.equipamentos.capacidade.max;
  const percentage = Math.round((current / max) * 100);
  
  let level = 0;
  let color = "green";
  let penalty = 0;
  
  if (percentage > 100) {
    level = 3; // Overloaded
    color = "red";
    penalty = -4;
  } else if (percentage > 75) {
    level = 2; // Heavy
    color = "orange";
    penalty = -2;
  } else if (percentage > 50) {
    level = 1; // Normal
    color = "yellow";
    penalty = -1;
  } else {
    level = 0; // Light
    color = "green";
    penalty = 0;
  }
  
  return {
    level: level,
    percentage: percentage,
    color: color,
    penalty: penalty,
    label: ["Leve", "Normal", "Pesado", "Sobrecarregado"][level]
  };
} 