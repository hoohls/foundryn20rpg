/**
 * Sistema N20 RPG - Sistema principal
 * Sistema de RPG baseado no N20 System
 */

// Importar módulos do sistema
import { SistemaN20RPGActor } from "./documents/actor.mjs";
import { SistemaN20RPGItem } from "./documents/item.mjs";
import { SistemaN20RPGActorSheet } from "./sheets/actor-sheet.mjs";
import { SistemaN20RPGItemSheet } from "./sheets/item-sheet.mjs";
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { registerHandlebarsHelpers } from "./helpers/handlebars-helpers.mjs";
import { initializeCampaignTools } from "./helpers/campaign-tools.mjs";

/* -------------------------------------------- */
/*  Inicialização do Sistema                     */
/* -------------------------------------------- */

Hooks.once('init', async function() {
  // Configurar sistema global
  game.sisteman20rpg = {
    SistemaN20RPGActor,
    SistemaN20RPGItem,
    rollItemMacro
  };

  // Configurar Document classes
  CONFIG.Actor.documentClass = SistemaN20RPGActor;
  CONFIG.Item.documentClass = SistemaN20RPGItem;

  // Configurar sheets
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("sistema-n20-rpg", SistemaN20RPGActorSheet, {
    makeDefault: true
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("sistema-n20-rpg", SistemaN20RPGItemSheet, {
    makeDefault: true
  });

  // Carregar templates
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Pronto para usar                             */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Aguardar até que o game esteja pronto
  console.log("Sistema N20 RPG | Sistema carregado e pronto para uso!");
  
  // Registrar helpers do Handlebars
  registerHandlebarsHelpers();
  
  // Inicializar funcionalidades de tokens
  initializeTokenFeatures();
  
  // Inicializar barras de recursos
  initializeResourceBars();
  
  // Configurar hotbar drop
  setupHotbarDrop();
  
  // Inicializar ferramentas de campanha
  initializeCampaignTools();
});

/* -------------------------------------------- */
/*  Funcionalidades de Tokens                    */
/* -------------------------------------------- */

function initializeTokenFeatures() {
  // Configurar barras de token padrão
  CONFIG.Actor.documentClass.prototype.prepareTokenData = function() {
    const data = this.system;
    
    // Configurar barra 1 (HP)
    if (data.recursos?.hp) {
      this.prototypeToken.bar1 = {
        attribute: "recursos.hp",
        label: "HP"
      };
    }
    
    // Configurar barra 2 (MP)
    if (data.recursos?.mp) {
      this.prototypeToken.bar2 = {
        attribute: "recursos.mp",
        label: "MP"
      };
    }
    
    // Configurar disposição baseada no tipo
    if (this.type === 'personagem') {
      this.prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
    } else if (this.type === 'npc') {
      this.prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.NEUTRAL;
    } else if (this.type === 'monstro') {
      this.prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.HOSTILE;
    }
  };
}

/* -------------------------------------------- */
/*  Barras de Recursos                           */
/* -------------------------------------------- */

function initializeResourceBars() {
  // Atualizar barras de recursos dinamicamente
  Hooks.on("renderActorSheet", (sheet, html, data) => {
    updateResourceBars(html, data);
  });
  
  // Atualizar barras quando o ator muda
  Hooks.on("updateActor", (actor, data) => {
    if (actor.sheet?.rendered) {
      updateResourceBarsFromActor(actor);
    }
  });
}

function updateResourceBars(html, data) {
  // Atualizar barra de HP
  const hpBar = html.find('.hp-bar');
  if (hpBar.length > 0) {
    const hpCurrent = data.system.recursos?.hp?.value || 0;
    const hpMax = data.system.recursos?.hp?.max || 1;
    const hpPercent = Math.round((hpCurrent / hpMax) * 100);
    
    hpBar.css('width', `${hpPercent}%`);
    hpBar.attr('title', `${hpCurrent}/${hpMax} HP`);
  }
  
  // Atualizar barra de MP
  const mpBar = html.find('.mp-bar');
  if (mpBar.length > 0) {
    const mpCurrent = data.system.recursos?.mp?.value || 0;
    const mpMax = data.system.recursos?.mp?.max || 1;
    const mpPercent = Math.round((mpCurrent / mpMax) * 100);
    
    mpBar.css('width', `${mpPercent}%`);
    mpBar.attr('title', `${mpCurrent}/${mpMax} MP`);
  }
  
  // Atualizar barra de encumbrance
  const encumbranceBar = html.find('.encumbrance-fill');
  if (encumbranceBar.length > 0 && data.encumbrance) {
    const percent = data.encumbrance.percentage;
    const level = data.encumbrance.level;
    
    encumbranceBar.css('width', `${percent}%`);
    encumbranceBar.removeClass('light normal heavy overloaded');
    encumbranceBar.addClass(['light', 'normal', 'heavy', 'overloaded'][level]);
  }
}

function updateResourceBarsFromActor(actor) {
  const sheet = actor.sheet;
  if (!sheet?.rendered) return;
  
  const html = sheet.element;
  const data = actor.system;
  
  // Simular data object para updateResourceBars
  const mockData = {
    system: data,
    encumbrance: sheet._calculateEncumbrance()
  };
  
  updateResourceBars(html, mockData);
}

/* -------------------------------------------- */
/*  Hotbar Drop                                  */
/* -------------------------------------------- */

function setupHotbarDrop() {
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if (data.type !== "Item") return;
    createItemMacro(data, slot);
    return false;
  });
}

/* -------------------------------------------- */
/*  Macros de Itens                              */
/* -------------------------------------------- */

/**
 * Criar macro para um item
 */
async function createItemMacro(data, slot) {
  if (!data.uuid) return;
  
  const item = await Item.fromDropData(data);
  if (!item) return;
  
  const command = `game.sisteman20rpg.rollItemMacro("${item.name}");`;
  
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "sistema-n20-rpg.itemMacro": true }
    });
  }
  
  game.user.assignHotbarMacro(macro, slot);
}

/**
 * Executar macro de item
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  
  if (!actor) {
    return ui.notifications.warn("Você deve selecionar um personagem para usar este macro!");
  }
  
  const item = actor.items.find(i => i.name === itemName);
  if (!item) {
    return ui.notifications.warn(`${actor.name} não possui um item chamado ${itemName}`);
  }
  
  // Executar ação baseada no tipo do item
  if (item.type === "arma") {
    return actor.makeAttack(item.id);
  } else if (item.type === "magia") {
    return actor.castSpell(item.id);
  } else if (item.type === "habilidade") {
    return actor.useAbility(item.id);
  } else {
    return item.roll();
  }
}

/* -------------------------------------------- */
/*  Funcionalidades de Combate                   */
/* -------------------------------------------- */

// Configurar iniciativa
Hooks.on("preCreateCombatant", (combat, combatantData) => {
  const actor = game.actors.get(combatantData.actorId);
  if (!actor) return;
  
  // Calcular iniciativa baseada no atributo Ação
  const initiative = actor.system.atributos?.acao?.value || 10;
  combatantData.initiative = initiative + (Math.random() * 10); // Adicionar variação
});

// Aplicar dano automático
Hooks.on("targetToken", (user, token, targeted) => {
  if (targeted && game.combat?.current) {
    const actor = token.actor;
    if (actor) {
      // Preparar token para receber dano
      game.user.targets.add(token);
    }
  }
});

/* -------------------------------------------- */
/*  Chat Messages                                */
/* -------------------------------------------- */

// Melhorar mensagens de chat
Hooks.on("renderChatMessage", (message, html, data) => {
  // Adicionar botões de aplicar dano
  if (message.isRoll && message.flavor?.includes("Dano")) {
    const damageButton = $(`<button class="apply-damage" data-damage="${message.roll.total}">Aplicar Dano</button>`);
    html.find('.dice-result').append(damageButton);
    
    damageButton.click(() => {
      const damage = parseInt(damageButton.data('damage'));
      applyDamageToTargets(damage);
    });
  }
  
  // Adicionar botões de cura
  if (message.content?.includes("recuperou") && message.content?.includes("HP")) {
    const healMatch = message.content.match(/recuperou (\d+) HP/);
    if (healMatch) {
      const healing = parseInt(healMatch[1]);
      const healButton = $(`<button class="apply-healing" data-healing="${healing}">Aplicar Cura</button>`);
      html.find('.heal-message').append(healButton);
      
      healButton.click(() => {
        applyHealingToTargets(healing);
      });
    }
  }
});

function applyDamageToTargets(damage) {
  const targets = Array.from(game.user.targets);
  if (targets.length === 0) {
    return ui.notifications.warn("Nenhum alvo selecionado!");
  }
  
  targets.forEach(token => {
    const actor = token.actor;
    if (actor) {
      actor.takeDamage(damage);
    }
  });
}

function applyHealingToTargets(healing) {
  const targets = Array.from(game.user.targets);
  if (targets.length === 0) {
    return ui.notifications.warn("Nenhum alvo selecionado!");
  }
  
  targets.forEach(token => {
    const actor = token.actor;
    if (actor) {
      actor.heal(healing);
    }
  });
}

/* -------------------------------------------- */
/*  Configurações do Sistema                     */
/* -------------------------------------------- */

Hooks.once("setup", function() {
  // Configurar settings do sistema
  game.settings.register("sistema-n20-rpg", "enableAutoCalculations", {
    name: "Habilitar Cálculos Automáticos",
    hint: "Calcular automaticamente valores derivados como defesa, HP máximo, etc.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
  
  game.settings.register("sistema-n20-rpg", "enableTokenBars", {
    name: "Habilitar Barras de Token",
    hint: "Mostrar barras de HP e MP nos tokens automaticamente",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
  
  game.settings.register("sistema-n20-rpg", "defaultDifficulty", {
    name: "Dificuldade Padrão",
    hint: "Dificuldade padrão para testes de atributos",
    scope: "world",
    config: true,
    type: Number,
    default: 12,
    range: {
      min: 5,
      max: 20,
      step: 1
    }
  });
});

/* -------------------------------------------- */
/*  Helpers Globais                              */
/* -------------------------------------------- */

// Registrar helpers do Handlebars
function registerHandlebarsHelpers() {
  Handlebars.registerHelper('multiply', function(a, b) {
    return a * b;
  });
  
  Handlebars.registerHelper('divide', function(a, b) {
    return a / b;
  });
  
  Handlebars.registerHelper('add', function(a, b) {
    return a + b;
  });
  
  Handlebars.registerHelper('subtract', function(a, b) {
    return a - b;
  });
  
  Handlebars.registerHelper('max', function(a, b) {
    return Math.max(a, b);
  });
  
  Handlebars.registerHelper('min', function(a, b) {
    return Math.min(a, b);
  });
  
  Handlebars.registerHelper('round', function(value) {
    return Math.round(value);
  });
  
  Handlebars.registerHelper('floor', function(value) {
    return Math.floor(value);
  });
  
  Handlebars.registerHelper('ceil', function(value) {
    return Math.ceil(value);
  });
  
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });
  
  Handlebars.registerHelper('ne', function(a, b) {
    return a !== b;
  });
  
  Handlebars.registerHelper('lt', function(a, b) {
    return a < b;
  });
  
  Handlebars.registerHelper('gt', function(a, b) {
    return a > b;
  });
  
  Handlebars.registerHelper('lte', function(a, b) {
    return a <= b;
  });
  
  Handlebars.registerHelper('gte', function(a, b) {
    return a >= b;
  });
  
  Handlebars.registerHelper('and', function(a, b) {
    return a && b;
  });
  
  Handlebars.registerHelper('or', function(a, b) {
    return a || b;
  });
  
  Handlebars.registerHelper('not', function(value) {
    return !value;
  });
  
  Handlebars.registerHelper('capitalize', function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  
  Handlebars.registerHelper('formatNumber', function(value, decimals = 0) {
    return Number(value).toFixed(decimals);
  });
  
  Handlebars.registerHelper('percentage', function(current, max) {
    return Math.round((current / max) * 100);
  });
  
  Handlebars.registerHelper('times', function(n, block) {
    let result = '';
    for (let i = 0; i < n; i++) {
      result += block.fn(i);
    }
    return result;
  });
  
  Handlebars.registerHelper('range', function(start, end, block) {
    let result = '';
    for (let i = start; i <= end; i++) {
      result += block.fn(i);
    }
    return result;
  });
  
  Handlebars.registerHelper('switch', function(value, options) {
    this.switch_value = value;
    this.switch_break = false;
    return options.fn(this);
  });
  
  Handlebars.registerHelper('case', function(value, options) {
    if (value === this.switch_value) {
      this.switch_break = true;
      return options.fn(this);
    }
  });
  
  Handlebars.registerHelper('default', function(options) {
    if (!this.switch_break) {
      return options.fn(this);
    }
  });
} 