/**
 * Ferramentas de Campanha para o Sistema N20 RPG
 * Funcionalidades específicas para mapas e gerenciamento de campanha
 */

/* -------------------------------------------- */
/*  Ferramentas de Mapa                         */
/* -------------------------------------------- */

/**
 * Configurar cena para o Sistema N20 RPG
 */
export function setupSceneForN20RPG(scene) {
  // Configurar iluminação padrão
  scene.update({
    "environment.globalLight.enabled": true,
    "environment.globalLight.bright": 0.5,
    "environment.globalLight.dim": 1.0,
    "environment.globalLight.color": "#ffffff"
  });
  
  // Configurar grid padrão
  scene.update({
    "grid.type": CONST.GRID_TYPES.SQUARE,
    "grid.size": 50,
    "grid.distance": 1.5,
    "grid.units": "metros"
  });
  
  console.log("Sistema N20 RPG | Cena configurada para N20 RPG");
}

/**
 * Criar marcadores de mapa
 */
export function createMapMarkers(scene) {
  const markers = [
    {
      name: "Ponto de Interesse",
      x: scene.width * 0.5,
      y: scene.height * 0.5,
      icon: "icons/environment/settlement/city.webp",
      type: "poi"
    },
    {
      name: "Local de Descanso",
      x: scene.width * 0.3,
      y: scene.height * 0.7,
      icon: "icons/environment/settlement/camp.webp",
      type: "rest"
    },
    {
      name: "Combate",
      x: scene.width * 0.7,
      y: scene.height * 0.3,
      icon: "icons/weapons/swords/sword-crossed-swords.webp",
      type: "combat"
    }
  ];
  
  markers.forEach(marker => {
    scene.createEmbeddedDocuments("Note", [{
      text: marker.name,
      x: marker.x,
      y: marker.y,
      icon: marker.icon,
      iconSize: 40,
      textAnchor: CONST.TEXT_ANCHOR_POINTS.CENTER,
      fontSize: 16,
      flags: {
        "sistema-n20-rpg": {
          markerType: marker.type
        }
      }
    }]);
  });
}

/**
 * Aplicar efeitos ambientais
 */
export function applyEnvironmentalEffects(scene, effectType) {
  const effects = {
    chuva: {
      weather: "rain",
      visibility: 0.7,
      movement: 0.5,
      message: "A chuva torna o terreno escorregadio e reduz a visibilidade"
    },
    nevoa: {
      weather: "fog",
      visibility: 0.4,
      movement: 0.8,
      message: "A névoa densa dificulta a visão e navegação"
    },
    tempestade: {
      weather: "storm",
      visibility: 0.5,
      movement: 0.3,
      message: "A tempestade traz ventos fortes e chuva intensa"
    },
    calor: {
      weather: "heat",
      visibility: 1.0,
      movement: 0.7,
      message: "O calor intenso causa fadiga mais rapidamente"
    },
    frio: {
      weather: "cold",
      visibility: 0.9,
      movement: 0.6,
      message: "O frio intenso reduz a agilidade e mobilidade"
    }
  };
  
  const effect = effects[effectType];
  if (!effect) return;
  
  // Aplicar efeito visual
  scene.update({
    "environment.globalLight.bright": effect.visibility,
    "flags.sistema-n20-rpg.weather": effect.weather,
    "flags.sistema-n20-rpg.movement": effect.movement
  });
  
  // Notificar jogadores
  ChatMessage.create({
    content: `<div class="environmental-effect">
      <h3>Efeito Ambiental: ${effectType.charAt(0).toUpperCase() + effectType.slice(1)}</h3>
      <p>${effect.message}</p>
      <p><strong>Modificadores:</strong></p>
      <ul>
        <li>Visibilidade: ${Math.round(effect.visibility * 100)}%</li>
        <li>Movimento: ${Math.round(effect.movement * 100)}%</li>
      </ul>
    </div>`,
    whisper: []
  });
}

/* -------------------------------------------- */
/*  Ferramentas de Combate                      */
/* -------------------------------------------- */

/**
 * Configurar encontro de combate
 */
export function setupCombatEncounter(tokens) {
  if (!tokens || tokens.length === 0) {
    ui.notifications.warn("Selecione pelo menos um token para configurar o encontro");
    return;
  }
  
  // Criar ou limpar combate
  if (game.combat) {
    game.combat.delete();
  }
  
  const combat = game.combats.create({
    scene: canvas.scene.id,
    active: true
  });
  
  // Adicionar tokens ao combate
  const combatants = tokens.map(token => ({
    tokenId: token.id,
    sceneId: canvas.scene.id,
    actorId: token.actor.id,
    hidden: token.actor.type === 'monstro' ? true : false
  }));
  
  combat.createEmbeddedDocuments("Combatant", combatants);
  
  // Rolar iniciativa automaticamente
  combat.rollAll();
  
  ui.notifications.info(`Encontro de combate configurado com ${tokens.length} participantes`);
}

/**
 * Aplicar condições de combate
 */
export function applyCombatCondition(actor, condition) {
  const conditions = {
    caido: {
      name: "Caído",
      icon: "icons/svg/falling.svg",
      changes: [
        {
          key: "system.combate.defesa",
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: -2
        }
      ]
    },
    atordoado: {
      name: "Atordoado",
      icon: "icons/svg/daze.svg",
      changes: [
        {
          key: "system.atributos.acao.value",
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: -4
        }
      ]
    },
    envenenado: {
      name: "Envenenado",
      icon: "icons/svg/poison.svg",
      changes: [
        {
          key: "system.atributos.fisico.value",
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: -2
        }
      ]
    },
    amaldicoado: {
      name: "Amaldiçoado",
      icon: "icons/svg/curse.svg",
      changes: [
        {
          key: "system.atributos.mental.value",
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: -2
        }
      ]
    },
    inspirado: {
      name: "Inspirado",
      icon: "icons/svg/aura.svg",
      changes: [
        {
          key: "system.atributos.social.value",
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 2
        }
      ]
    }
  };
  
  const conditionData = conditions[condition];
  if (!conditionData) return;
  
  actor.createEmbeddedDocuments("ActiveEffect", [{
    label: conditionData.name,
    icon: conditionData.icon,
    changes: conditionData.changes,
    origin: actor.uuid,
    disabled: false,
    duration: {
      rounds: 10
    }
  }]);
  
  ui.notifications.info(`${conditionData.name} aplicado a ${actor.name}`);
}

/* -------------------------------------------- */
/*  Ferramentas de Narrativa                    */
/* -------------------------------------------- */

/**
 * Criar entrada no diário
 */
export function createJournalEntry(title, content, isPrivate = false) {
  const entry = JournalEntry.create({
    name: title,
    content: content,
    permission: isPrivate ? {} : { default: CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER },
    flags: {
      "sistema-n20-rpg": {
        entryType: "narrative",
        timestamp: new Date().toISOString()
      }
    }
  });
  
  ui.notifications.info(`Entrada do diário "${title}" criada`);
  return entry;
}

/**
 * Enviar mensagem narrativa
 */
export function sendNarrativeMessage(content, isWhisper = false) {
  const messageData = {
    content: `<div class="narrative-message">
      <h3>Narrativa</h3>
      <p>${content}</p>
    </div>`,
    speaker: { alias: "Narrador" },
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    sound: CONFIG.sounds.notification
  };
  
  if (isWhisper) {
    messageData.whisper = game.users.filter(u => u.isGM).map(u => u.id);
  }
  
  ChatMessage.create(messageData);
}

/**
 * Criar ponto de save
 */
export function createSavePoint(name, description = "") {
  const saveData = {
    name: name,
    description: description,
    timestamp: new Date().toISOString(),
    scene: canvas.scene.id,
    actors: game.actors.map(actor => ({
      id: actor.id,
      data: actor.toObject()
    })),
    combat: game.combat ? game.combat.toObject() : null
  };
  
  game.settings.set("sistema-n20-rpg", `savepoint-${Date.now()}`, saveData);
  
  ui.notifications.info(`Ponto de save "${name}" criado`);
}

/* -------------------------------------------- */
/*  Ferramentas de Sessão                       */
/* -------------------------------------------- */

/**
 * Iniciar sessão
 */
export function startSession() {
  const startTime = new Date().toISOString();
  
  game.settings.set("sistema-n20-rpg", "sessionStart", startTime);
  
  // Mensagem de boas-vindas
  ChatMessage.create({
    content: `<div class="session-start">
      <h2>🎲 Sessão Iniciada</h2>
      <p>Bem-vindos à aventura! Que os dados estejam a vosso favor.</p>
      <p><strong>Data:</strong> ${new Date().toLocaleString()}</p>
    </div>`,
    whisper: []
  });
  
  // Restaurar recursos dos personagens
  game.actors.forEach(actor => {
    if (actor.type === 'personagem' && actor.hasPlayerOwner) {
      actor.rest('long');
    }
  });
}

/**
 * Finalizar sessão
 */
export function endSession() {
  const startTime = game.settings.get("sistema-n20-rpg", "sessionStart");
  const endTime = new Date().toISOString();
  
  const duration = startTime ? 
    Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60)) : 
    0;
  
  // Calcular XP da sessão
  const sessionXP = calculateSessionXP();
  
  ChatMessage.create({
    content: `<div class="session-end">
      <h2>🏁 Sessão Finalizada</h2>
      <p>Obrigado pela aventura!</p>
      <p><strong>Duração:</strong> ${duration} minutos</p>
      <p><strong>XP Ganho:</strong> ${sessionXP} pontos</p>
    </div>`,
    whisper: []
  });
  
  // Distribuir XP
  distributeSessionXP(sessionXP);
  
  game.settings.set("sistema-n20-rpg", "sessionStart", null);
}

/**
 * Calcular XP da sessão
 */
function calculateSessionXP() {
  const baseXP = 100;
  const combatXP = game.combat ? 50 : 0;
  const narrativeXP = game.messages.filter(m => 
    m.content.includes("narrative-message")
  ).length * 10;
  
  return baseXP + combatXP + narrativeXP;
}

/**
 * Distribuir XP da sessão
 */
function distributeSessionXP(xp) {
  const players = game.actors.filter(actor => 
    actor.type === 'personagem' && actor.hasPlayerOwner
  );
  
  players.forEach(player => {
    const currentXP = player.system.experiencia.atual;
    player.update({
      "system.experiencia.atual": currentXP + xp
    });
  });
}

/* -------------------------------------------- */
/*  Ferramentas de Utilitário                   */
/* -------------------------------------------- */

/**
 * Rolar na tabela de encontros aleatórios
 */
export function rollRandomEncounter() {
  const encounters = [
    { name: "Bandidos", difficulty: "Fácil", description: "2d4 bandidos armados" },
    { name: "Lobos", difficulty: "Médio", description: "1d6 lobos famintos" },
    { name: "Mercador", difficulty: "Social", description: "Mercador perdido com bens valiosos" },
    { name: "Ruínas Antigas", difficulty: "Exploração", description: "Estrutura misteriosa com segredos" },
    { name: "Ponte Quebrada", difficulty: "Obstáculo", description: "Ponte danificada sobre um rio" },
    { name: "Tempestade", difficulty: "Ambiental", description: "Chuva forte e ventos intensos" }
  ];
  
  const roll = new Roll("1d6");
  roll.evaluate();
  
  const encounter = encounters[roll.total - 1];
  
  ChatMessage.create({
    content: `<div class="random-encounter">
      <h3>🎲 Encontro Aleatório</h3>
      <p><strong>Resultado:</strong> ${encounter.name}</p>
      <p><strong>Dificuldade:</strong> ${encounter.difficulty}</p>
      <p><strong>Descrição:</strong> ${encounter.description}</p>
    </div>`,
    rolls: [roll]
  });
}

/**
 * Gerar tesouro aleatório
 */
export function generateRandomTreasure() {
  const treasures = [
    { name: "Moedas de Ouro", amount: "2d6 × 10", type: "dinheiro" },
    { name: "Gema Preciosa", amount: "1", value: "1d6 × 100 mo", type: "gema" },
    { name: "Pergaminho Mágico", amount: "1", type: "magia" },
    { name: "Poção de Cura", amount: "1d3", type: "poção" },
    { name: "Arma Mágica", amount: "1", type: "arma" },
    { name: "Armadura Mágica", amount: "1", type: "armadura" }
  ];
  
  const roll = new Roll("1d6");
  roll.evaluate();
  
  const treasure = treasures[roll.total - 1];
  
  ChatMessage.create({
    content: `<div class="random-treasure">
      <h3>💎 Tesouro Encontrado</h3>
      <p><strong>Item:</strong> ${treasure.name}</p>
      <p><strong>Quantidade:</strong> ${treasure.amount}</p>
      ${treasure.value ? `<p><strong>Valor:</strong> ${treasure.value}</p>` : ''}
      <p><strong>Tipo:</strong> ${treasure.type}</p>
    </div>`,
    rolls: [roll]
  });
}

/**
 * Aplicar descanso em massa
 */
export function applyMassRest(type = 'short') {
  const actors = canvas.tokens.controlled.map(token => token.actor);
  
  if (actors.length === 0) {
    ui.notifications.warn("Selecione pelo menos um token para aplicar descanso");
    return;
  }
  
  actors.forEach(actor => {
    if (actor.type === 'personagem') {
      actor.rest(type);
    }
  });
  
  const restType = type === 'short' ? 'Curto' : 'Longo';
  ui.notifications.info(`Descanso ${restType} aplicado a ${actors.length} personagens`);
}

/* -------------------------------------------- */
/*  Interface de Ferramentas                    */
/* -------------------------------------------- */

/**
 * Criar janela de ferramentas do mestre
 */
export function createGMToolsWindow() {
  const dialog = new Dialog({
    title: "Ferramentas do Mestre - Sistema N20 RPG",
    content: `
      <div class="gm-tools">
        <h3>Ferramentas de Mapa</h3>
        <div class="tool-group">
          <button id="setup-scene" class="tool-button">Configurar Cena</button>
          <button id="create-markers" class="tool-button">Criar Marcadores</button>
          <button id="weather-rain" class="tool-button">Aplicar Chuva</button>
          <button id="weather-fog" class="tool-button">Aplicar Névoa</button>
        </div>
        
        <h3>Ferramentas de Combate</h3>
        <div class="tool-group">
          <button id="setup-combat" class="tool-button">Configurar Encontro</button>
          <button id="apply-fallen" class="tool-button">Aplicar Caído</button>
          <button id="apply-stunned" class="tool-button">Aplicar Atordoado</button>
          <button id="apply-poisoned" class="tool-button">Aplicar Envenenado</button>
        </div>
        
        <h3>Ferramentas de Sessão</h3>
        <div class="tool-group">
          <button id="start-session" class="tool-button">Iniciar Sessão</button>
          <button id="end-session" class="tool-button">Finalizar Sessão</button>
          <button id="mass-rest" class="tool-button">Descanso em Massa</button>
        </div>
        
        <h3>Ferramentas de Utilitário</h3>
        <div class="tool-group">
          <button id="random-encounter" class="tool-button">Encontro Aleatório</button>
          <button id="random-treasure" class="tool-button">Tesouro Aleatório</button>
          <button id="create-savepoint" class="tool-button">Criar Save Point</button>
        </div>
      </div>
    `,
    buttons: {
      close: {
        label: "Fechar",
        callback: () => {}
      }
    },
    render: (html) => {
      // Mapa
      html.find('#setup-scene').click(() => setupSceneForN20RPG(canvas.scene));
      html.find('#create-markers').click(() => createMapMarkers(canvas.scene));
      html.find('#weather-rain').click(() => applyEnvironmentalEffects(canvas.scene, 'chuva'));
      html.find('#weather-fog').click(() => applyEnvironmentalEffects(canvas.scene, 'nevoa'));
      
      // Combate
      html.find('#setup-combat').click(() => setupCombatEncounter(canvas.tokens.controlled));
      html.find('#apply-fallen').click(() => {
        canvas.tokens.controlled.forEach(token => 
          applyCombatCondition(token.actor, 'caido')
        );
      });
      html.find('#apply-stunned').click(() => {
        canvas.tokens.controlled.forEach(token => 
          applyCombatCondition(token.actor, 'atordoado')
        );
      });
      html.find('#apply-poisoned').click(() => {
        canvas.tokens.controlled.forEach(token => 
          applyCombatCondition(token.actor, 'envenenado')
        );
      });
      
      // Sessão
      html.find('#start-session').click(() => startSession());
      html.find('#end-session').click(() => endSession());
      html.find('#mass-rest').click(() => applyMassRest('long'));
      
      // Utilitário
      html.find('#random-encounter').click(() => rollRandomEncounter());
      html.find('#random-treasure').click(() => generateRandomTreasure());
      html.find('#create-savepoint').click(() => {
        const name = prompt("Nome do Save Point:");
        if (name) createSavePoint(name);
      });
    }
  });
  
  dialog.render(true);
}

/* -------------------------------------------- */
/*  Inicialização                                */
/* -------------------------------------------- */

/**
 * Inicializar ferramentas de campanha
 */
export function initializeCampaignTools() {
  // Adicionar botão de ferramentas do mestre
  Hooks.on("getSceneControlButtons", (controls) => {
    if (!game.user.isGM) return;
    
    const tokenControls = controls.find(c => c.name === "token");
    if (tokenControls) {
      tokenControls.tools.push({
        name: "gm-tools",
        title: "Ferramentas do Mestre",
        icon: "fas fa-cogs",
        button: true,
        onClick: () => createGMToolsWindow()
      });
    }
  });
  
  console.log("Sistema N20 RPG | Ferramentas de Campanha inicializadas");
} 