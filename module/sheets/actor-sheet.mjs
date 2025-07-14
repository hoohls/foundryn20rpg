import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";

/**
 * Estender a classe base ActorSheet para criar uma ficha customizada
 */
export class SistemaN20RPGActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["sistema-n20-rpg", "sheet", "actor"],
      template: "systems/sistema-n20-rpg/templates/actor/actor-sheet.html",
      width: 750,
      height: 650,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "atributos" }],
      dragDrop: [
        {dragSelector: ".item-list .item", dropSelector: null},
        {dragSelector: ".token-image", dropSelector: null}
      ],
      resizable: true
    });
  }

  /** @override */
  get template() {
    return `systems/sistema-n20-rpg/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items
    if (actorData.type == 'personagem') {
      this._preparePersonagemData(context);
    }

    // Prepare NPC data
    if (actorData.type == 'npc') {
      this._prepareNPCData(context);
    }

    // Prepare monster data
    if (actorData.type == 'monstro') {
      this._prepareMonstroData(context);
    }

    // Prepare items
    this._prepareItems(context);

    // Add roll data for TinyMCE editors
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    // Add user permissions
    context.isGM = game.user.isGM;
    context.canEdit = this.actor.isOwner;

    // Add token data
    context.hasToken = this.actor.isToken;
    context.token = this.actor.token;

    return context;
  }

  /**
   * Organize and classify Items for Character sheets
   */
  _preparePersonagemData(context) {
    // Initialize containers
    const equipamentos = [];
    const magias = [];
    const habilidades = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      
      // Append to equipment
      if (i.type === 'arma' || i.type === 'armadura' || i.type === 'item') {
        equipamentos.push(i);
      }
      // Append to spells
      else if (i.type === 'magia') {
        magias.push(i);
      }
      // Append to abilities
      else if (i.type === 'habilidade') {
        habilidades.push(i);
      }
    }

    // Sort items by name
    equipamentos.sort((a, b) => a.name.localeCompare(b.name));
    magias.sort((a, b) => a.name.localeCompare(b.name));
    habilidades.sort((a, b) => a.name.localeCompare(b.name));

    // Assign and return
    context.equipamentos = equipamentos;
    context.magias = magias;
    context.habilidades = habilidades;

    // Calculate encumbrance
    context.encumbrance = this._calculateEncumbrance();
  }

  /**
   * Organize and classify Items for NPC sheets
   */
  _prepareNPCData(context) {
    // NPCs have simplified item management
    this._preparePersonagemData(context);
  }

  /**
   * Organize and classify Items for Monster sheets
   */
  _prepareMonstroData(context) {
    // Monsters have simplified item management
    this._preparePersonagemData(context);
  }

  /**
   * Organize and classify Items for all sheets
   */
  _prepareItems(context) {
    // Initialize containers
    const gear = [];
    const features = [];
    const spells = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      
      // Append to gear
      if (i.type === 'arma' || i.type === 'armadura' || i.type === 'item') {
        gear.push(i);
      }
      // Append to features
      else if (i.type === 'habilidade') {
        features.push(i);
      }
      // Append to spells
      else if (i.type === 'magia') {
        spells.push(i);
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
  }

  /**
   * Calculate encumbrance
   */
  _calculateEncumbrance() {
    const system = this.actor.system;
    const capacity = system.equipamentos.capacidade;
    const current = capacity.atual;
    const max = capacity.max;
    
    let level = 0;
    let percentage = Math.round((current / max) * 100);
    
    if (percentage > 100) level = 3; // Overloaded
    else if (percentage > 75) level = 2; // Heavy
    else if (percentage > 50) level = 1; // Normal
    else level = 0; // Light
    
    return {
      current: current,
      max: max,
      percentage: percentage,
      level: level,
      label: ["Leve", "Normal", "Pesado", "Sobrecarregado"][level]
    };
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("item-id"));
      item.sheet.render(true);
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("item-id"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities
    html.find('.rollable').click(this._onRoll.bind(this));

    // Attribute rolls
    html.find('.attribute-roll').click(this._onAttributeRoll.bind(this));

    // Damage rolls
    html.find('.damage-roll').click(this._onDamageRoll.bind(this));

    // Weapon attacks
    html.find('.weapon-attack').click(this._onWeaponAttack.bind(this));

    // Spell casting
    html.find('.spell-cast').click(this._onSpellCast.bind(this));

    // Ability usage
    html.find('.ability-use').click(this._onAbilityUse.bind(this));

    // Rest buttons
    html.find('.short-rest').click(this._onShortRest.bind(this));
    html.find('.long-rest').click(this._onLongRest.bind(this));

    // Equipment toggle
    html.find('.item-toggle').click(this._onItemToggle.bind(this));

    // Token management
    html.find('.token-config').click(this._onTokenConfig.bind(this));

    // HP/MP management
    html.find('.resource-control').click(this._onResourceControl.bind(this));

    // Drag events for macro creation
    html.find('.item').each((i, li) => {
      if (li.classList.contains("inventory-header")) return;
      li.setAttribute("draggable", true);
      li.addEventListener("dragstart", ev => this._onDragStart(ev), false);
    });

    // Context menu for items
    html.find('.item').contextmenu(this._onItemContext.bind(this));
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = duplicate(header.dataset);
    const name = `Novo ${type}`;
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    
    delete itemData.system["type"];
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  /**
   * Handle attribute rolls
   */
  _onAttributeRoll(event) {
    event.preventDefault();
    const attribute = event.currentTarget.dataset.attribute;
    this.actor.rollAttribute(attribute);
  }

  /**
   * Handle damage rolls
   */
  _onDamageRoll(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    this.actor.rollDamage(itemId);
  }

  /**
   * Handle weapon attacks
   */
  _onWeaponAttack(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    this.actor.makeAttack(itemId);
  }

  /**
   * Handle spell casting
   */
  _onSpellCast(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    this.actor.castSpell(itemId);
  }

  /**
   * Handle ability usage
   */
  _onAbilityUse(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    this.actor.useAbility(itemId);
  }

  /**
   * Handle short rest
   */
  _onShortRest(event) {
    event.preventDefault();
    this.actor.rest('short');
  }

  /**
   * Handle long rest
   */
  _onLongRest(event) {
    event.preventDefault();
    this.actor.rest('long');
  }

  /**
   * Handle item toggle (equip/unequip)
   */
  async _onItemToggle(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    
    if (item) {
      const equipped = !item.system.equipado;
      await item.update({"system.equipado": equipped});
      
      // Update actor data
      this.actor.prepareData();
      this.render(false);
    }
  }

  /**
   * Handle token configuration
   */
  _onTokenConfig(event) {
    event.preventDefault();
    const token = this.actor.token;
    if (token) {
      token.sheet.render(true);
    } else {
      const tokenData = this.actor.prototypeToken;
      new TokenConfig(tokenData, {
        actor: this.actor,
        configureDefault: true
      }).render(true);
    }
  }

  /**
   * Handle resource control (HP/MP adjustment)
   */
  async _onResourceControl(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const resource = button.dataset.resource;
    const action = button.dataset.action;
    const amount = parseInt(button.dataset.amount) || 1;
    
    const current = this.actor.system.recursos[resource].value;
    const max = this.actor.system.recursos[resource].max;
    
    let newValue;
    if (action === 'increase') {
      newValue = Math.min(max, current + amount);
    } else if (action === 'decrease') {
      newValue = Math.max(0, current - amount);
    } else if (action === 'set-max') {
      newValue = max;
    } else if (action === 'set-zero') {
      newValue = 0;
    }
    
    await this.actor.update({[`system.recursos.${resource}.value`]: newValue});
  }

  /**
   * Handle item context menu
   */
  _onItemContext(event) {
    event.preventDefault();
    const itemId = event.currentTarget.dataset.itemId;
    const item = this.actor.items.get(itemId);
    
    if (!item) return;
    
    const contextMenu = [
      {
        name: "Editar",
        icon: '<i class="fas fa-edit"></i>',
        callback: () => item.sheet.render(true)
      },
      {
        name: "Duplicar",
        icon: '<i class="fas fa-copy"></i>',
        callback: () => item.clone({name: `${item.name} (cópia)`}, {save: true})
      },
      {
        name: "Deletar",
        icon: '<i class="fas fa-trash"></i>',
        callback: () => item.delete()
      }
    ];
    
    if (item.type === 'arma' || item.type === 'armadura') {
      const equipLabel = item.system.equipado ? "Desequipar" : "Equipar";
      contextMenu.unshift({
        name: equipLabel,
        icon: '<i class="fas fa-shield-alt"></i>',
        callback: () => item.update({"system.equipado": !item.system.equipado})
      });
    }
    
    new ContextMenu($(event.currentTarget), contextMenu);
  }

  /**
   * Handle drag start for macro creation
   */
  _onDragStart(event) {
    const li = event.currentTarget;
    if (event.target.classList.contains("content-link")) return;
    
    let dragData = null;
    
    // Owned Items
    if (li.dataset.itemId) {
      const item = this.actor.items.get(li.dataset.itemId);
      dragData = item.toDragData();
    }
    
    // Active Effects
    if (li.dataset.effectId) {
      const effect = this.actor.effects.get(li.dataset.effectId);
      dragData = effect.toDragData();
    }
    
    if (!dragData) return;
    
    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /** @override */
  _updateObject(event, formData) {
    // Handle special form data
    if (formData['system.recursos.hp.value']) {
      formData['system.recursos.hp.value'] = Math.max(0, Math.min(
        formData['system.recursos.hp.value'],
        this.actor.system.recursos.hp.max
      ));
    }
    
    if (formData['system.recursos.mp.value']) {
      formData['system.recursos.mp.value'] = Math.max(0, Math.min(
        formData['system.recursos.mp.value'],
        this.actor.system.recursos.mp.max
      ));
    }
    
    // Update the Actor
    return this.object.update(formData);
  }
} 