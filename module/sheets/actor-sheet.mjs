/**
 * Estender a classe base ActorSheet para criar uma ficha customizada
 */
export class SistemaN20RPGActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["sistema-n20-rpg", "sheet", "actor"],
      template: "systems/sistema-n20-rpg/templates/actor/actor-sheet.html",
      width: 800,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "principal" }]
    });
  }

  /** @override */
  get template() {
    return `systems/sistema-n20-rpg/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  /** @override */
  getData() {
    // Recuperar dados base
    const context = super.getData();
    
    // Usar uma cópia dos dados do ator para modificação
    const actorData = this.actor.toObject(false);
    
    // Adicionar dados do sistema
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Preparar dados específicos do tipo de ator
    if (actorData.type === 'personagem') {
      this._preparePersonagemData(context);
    } else if (actorData.type === 'npc') {
      this._prepareNpcData(context);
    } else if (actorData.type === 'monstro') {
      this._prepareMonstroData(context);
    }

    // Preparar itens
    this._prepareItems(context);

    return context;
  }

  /**
   * Organizar e classificar itens do ator
   */
  _prepareItems(context) {
    // Inicializar containers
    const armas = [];
    const armaduras = [];
    const magias = [];
    const habilidades = [];
    const itens = [];

    // Iterar sobre os itens do ator
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      
      // Classificar por tipo
      if (i.type === 'arma') {
        armas.push(i);
      } else if (i.type === 'armadura') {
        armaduras.push(i);
      } else if (i.type === 'magia') {
        magias.push(i);
      } else if (i.type === 'habilidade') {
        habilidades.push(i);
      } else if (i.type === 'item') {
        itens.push(i);
      }
    }

    // Assignar a context
    context.armas = armas;
    context.armaduras = armaduras;
    context.magias = magias;
    context.habilidades = habilidades;
    context.itens = itens;
  }

  /**
   * Preparar dados do personagem
   */
  _preparePersonagemData(context) {
    // Preparar dados dos atributos
    for (let [k, v] of Object.entries(context.system.atributos)) {
      v.label = k.charAt(0).toUpperCase() + k.slice(1);
    }
  }

  /**
   * Preparar dados do NPC
   */
  _prepareNpcData(context) {
    // NPCs seguem a mesma estrutura que personagens
    this._preparePersonagemData(context);
  }

  /**
   * Preparar dados do monstro
   */
  _prepareMonstroData(context) {
    // Monstros seguem a mesma estrutura que personagens
    this._preparePersonagemData(context);
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Não fazer nada se a ficha não é editável
    if (!this.isEditable) return;

    // Adicionar ou remover atributos
    html.find('.atributo-roll').click(this._onAtributoRoll.bind(this));

    // Gerenciar itens
    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-edit').click(this._onItemEdit.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));
    html.find('.item-roll').click(this._onItemRoll.bind(this));
    html.find('.item-toggle').click(this._onItemToggle.bind(this));

    // Editar valores inline
    html.find('.inline-edit').change(this._onInlineEdit.bind(this));

    // Arrastar e soltar funcionalidade
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Lidar com rolagem de atributos
   */
  _onAtributoRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const atributo = element.dataset.atributo;
    const dificuldade = parseInt(element.dataset.dificuldade) || 10;
    
    this.actor.rollAtributo(atributo, dificuldade);
  }

  /**
   * Lidar com criação de itens
   */
  _onItemCreate(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const tipo = element.dataset.type;
    const itemData = {
      name: `Novo ${tipo}`,
      type: tipo,
      system: {}
    };
    
    // Adicionar dados específicos do tipo
    if (tipo === 'arma') {
      itemData.system = {
        dano: "1d6",
        alcance: "Corpo a corpo",
        peso: 1,
        preco: 0,
        equipado: false
      };
    } else if (tipo === 'armadura') {
      itemData.system = {
        protecao: 1,
        penalidade: 0,
        peso: 5,
        preco: 0,
        equipado: false
      };
    } else if (tipo === 'magia') {
      itemData.system = {
        custo: 1,
        alcance: "Toque",
        duracao: "Instantânea",
        escola: "Evocação",
        descricao: ""
      };
    } else if (tipo === 'habilidade') {
      itemData.system = {
        tipo: "Passiva",
        usos: 0,
        usosAtual: 0,
        descricao: ""
      };
    } else if (tipo === 'item') {
      itemData.system = {
        quantidade: 1,
        peso: 1,
        preco: 0,
        descricao: ""
      };
    }

    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  /**
   * Lidar com edição de itens
   */
  _onItemEdit(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    item.sheet.render(true);
  }

  /**
   * Lidar com exclusão de itens
   */
  _onItemDelete(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    
    const dialog = new Dialog({
      title: "Confirmar exclusão",
      content: `<p>Tem certeza que deseja excluir <strong>${item.name}</strong>?</p>`,
      buttons: {
        yes: {
          icon: '<i class="fas fa-check"></i>',
          label: "Sim",
          callback: () => item.delete()
        },
        no: {
          icon: '<i class="fas fa-times"></i>',
          label: "Não"
        }
      },
      default: "no"
    });
    
    dialog.render(true);
  }

  /**
   * Lidar com rolagem de itens
   */
  _onItemRoll(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    
    if (item) return item.roll();
  }

  /**
   * Lidar com equipar/desequipar itens
   */
  _onItemToggle(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    
    if (item) return item.toggleEquip();
  }

  /**
   * Lidar com edição inline
   */
  _onInlineEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const field = element.dataset.field;
    const value = element.value;
    
    return this.actor.update({[field]: value});
  }

  /** @override */
  async _updateObject(event, formData) {
    // Atualizar o ator
    return this.object.update(formData);
  }
} 