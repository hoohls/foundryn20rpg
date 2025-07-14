// Importar documentos
import { SistemaN20RPGActor } from "./documents/actor.mjs";
import { SistemaN20RPGItem } from "./documents/item.mjs";

// Importar fichas de atores
import { SistemaN20RPGActorSheet } from "./sheets/actor-sheet.mjs";
import { SistemaN20RPGItemSheet } from "./sheets/item-sheet.mjs";

// Importar helpers do Handlebars
import * as helpers from "./helpers/templates.mjs";

/**
 * Inicializar o sistema Sistema N20 RPG
 */
Hooks.once('init', async function() {
  
  // Adicionar namespace do sistema
  game.sisteman20rpg = {
    SistemaN20RPGActor,
    SistemaN20RPGItem,
    rollItemMacro
  };

  // Definir classes customizadas
  CONFIG.Actor.documentClass = SistemaN20RPGActor;
  CONFIG.Item.documentClass = SistemaN20RPGItem;

  // Registrar fichas de atores
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("sistema-n20-rpg", SistemaN20RPGActorSheet, {
    makeDefault: true
  });

  // Registrar fichas de itens
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("sistema-n20-rpg", SistemaN20RPGItemSheet, {
    makeDefault: true
  });

  // Registrar helpers do Handlebars
  helpers.registerHelpers();

  // Preload template paths
  return loadTemplates([
    // Fichas de atores
    "systems/sistema-n20-rpg/templates/actor/parts/actor-atributos.html",
    "systems/sistema-n20-rpg/templates/actor/parts/actor-combate.html",
    "systems/sistema-n20-rpg/templates/actor/parts/actor-habilidades.html",
    "systems/sistema-n20-rpg/templates/actor/parts/actor-magias.html",
    "systems/sistema-n20-rpg/templates/actor/parts/actor-equipamentos.html",
    "systems/sistema-n20-rpg/templates/actor/parts/actor-historia.html",
    // Fichas de itens
    "systems/sistema-n20-rpg/templates/item/parts/item-description.html"
  ]);
});

/**
 * Hooks para deixar o sistema pronto
 */
Hooks.once("ready", async function() {
  // Aguardar que o sistema esteja totalmente carregado
  console.log("Sistema N20 RPG | Sistema inicializado");
});

/**
 * Macro para rolar itens
 */
async function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Seu personagem não possui um item chamado ${itemName}`);

  return item.roll();
}

/**
 * Criar macro quando um item é arrastado para a hotbar
 */
Hooks.on("hotbarDrop", (bar, data, slot) => {
  if (data.type !== "Item") return;
  createItemMacro(data, slot);
  return false;
});

/**
 * Criar uma macro para um item
 */
async function createItemMacro(data, slot) {
  const item = await Item.fromDropData(data);
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
  return false;
} 