/**
 * Registrar helpers customizados do Handlebars para o sistema N20 RPG
 */

export function registerHandlebarsHelpers() {
  // Helpers matemáticos
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
  
  // Helpers de comparação
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
  
  // Helpers lógicos
  Handlebars.registerHelper('and', function(a, b) {
    return a && b;
  });
  
  Handlebars.registerHelper('or', function(a, b) {
    return a || b;
  });
  
  Handlebars.registerHelper('not', function(value) {
    return !value;
  });
  
  // Helpers de formatação
  Handlebars.registerHelper('capitalize', function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  
  Handlebars.registerHelper('formatNumber', function(value, decimals = 0) {
    return Number(value).toFixed(decimals);
  });
  
  Handlebars.registerHelper('percentage', function(current, max) {
    return Math.round((current / max) * 100);
  });
  
  // Helpers de iteração
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
  
  // Helpers de controle
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
  
  // Helpers específicos do sistema
  Handlebars.registerHelper('attributeModifier', function(value) {
    return Math.floor((value - 10) / 2);
  });
  
  Handlebars.registerHelper('difficultyColor', function(difficulty) {
    if (difficulty <= 10) return 'green';
    if (difficulty <= 15) return 'yellow';
    if (difficulty <= 20) return 'orange';
    return 'red';
  });
  
  Handlebars.registerHelper('hpColor', function(current, max) {
    const percentage = (current / max) * 100;
    if (percentage > 75) return 'green';
    if (percentage > 50) return 'yellow';
    if (percentage > 25) return 'orange';
    return 'red';
  });
  
  Handlebars.registerHelper('mpColor', function(current, max) {
    const percentage = (current / max) * 100;
    if (percentage > 50) return 'blue';
    if (percentage > 25) return 'purple';
    return 'red';
  });
  
  Handlebars.registerHelper('encumbranceColor', function(level) {
    const colors = ['green', 'yellow', 'orange', 'red'];
    return colors[level] || 'green';
  });
  
  Handlebars.registerHelper('schoolColor', function(school) {
    const colors = {
      'abjuracao': '#4CAF50',
      'adivinhacao': '#2196F3',
      'conjuracao': '#FF9800',
      'encantamento': '#E91E63',
      'evocacao': '#F44336',
      'ilusao': '#9C27B0',
      'necromancia': '#424242',
      'transmutacao': '#795548'
    };
    return colors[school.toLowerCase()] || '#757575';
  });
  
  Handlebars.registerHelper('abilityTypeColor', function(type) {
    const colors = {
      'passiva': '#4CAF50',
      'ativa': '#2196F3',
      'reacao': '#FF9800',
      'especial': '#E91E63'
    };
    return colors[type.toLowerCase()] || '#757575';
  });
  
  Handlebars.registerHelper('weaponTypeIcon', function(type) {
    const icons = {
      'corpo a corpo': 'fas fa-sword',
      'distancia': 'fas fa-bow-arrow',
      'arremesso': 'fas fa-hand-paper',
      'munição': 'fas fa-bullets'
    };
    return icons[type.toLowerCase()] || 'fas fa-question';
  });
  
  Handlebars.registerHelper('armorTypeIcon', function(type) {
    const icons = {
      'leve': 'fas fa-shirt',
      'pesada': 'fas fa-shield-alt',
      'escudo': 'fas fa-shield'
    };
    return icons[type.toLowerCase()] || 'fas fa-question';
  });
  
  Handlebars.registerHelper('formatCurrency', function(value) {
    return `${value} mo`;
  });
  
  Handlebars.registerHelper('formatWeight', function(value) {
    return `${value} kg`;
  });
  
  Handlebars.registerHelper('formatDistance', function(value) {
    return `${value} m`;
  });
  
  Handlebars.registerHelper('formatDuration', function(value) {
    if (value === 'instantanea') return 'Instantânea';
    if (value === 'concentracao') return 'Concentração';
    if (value === 'permanente') return 'Permanente';
    return value;
  });
  
  Handlebars.registerHelper('formatRange', function(value) {
    if (value === 'toque') return 'Toque';
    if (value === 'pessoal') return 'Pessoal';
    if (value === 'visao') return 'Visão';
    return `${value} m`;
  });
  
  Handlebars.registerHelper('isEquipped', function(item) {
    return item.system.equipado ? 'equipped' : '';
  });
  
  Handlebars.registerHelper('hasUses', function(item) {
    return item.system.usos_max > 0;
  });
  
  Handlebars.registerHelper('usesRemaining', function(item) {
    return item.system.usos_restantes || 0;
  });
  
  Handlebars.registerHelper('usesMax', function(item) {
    return item.system.usos_max || 0;
  });
  
  Handlebars.registerHelper('canUse', function(item) {
    return !item.system.usos_max || item.system.usos_restantes > 0;
  });
  
  Handlebars.registerHelper('spellLevel', function(level) {
    const levels = {
      0: 'Truque',
      1: '1º Nível',
      2: '2º Nível',
      3: '3º Nível',
      4: '4º Nível',
      5: '5º Nível',
      6: '6º Nível',
      7: '7º Nível',
      8: '8º Nível',
      9: '9º Nível'
    };
    return levels[level] || `${level}º Nível`;
  });
  
  Handlebars.registerHelper('attributeName', function(attr) {
    const names = {
      'fisico': 'Físico',
      'mental': 'Mental',
      'social': 'Social',
      'acao': 'Ação'
    };
    return names[attr] || attr;
  });
  
  Handlebars.registerHelper('combatStatName', function(stat) {
    const names = {
      'defesa': 'Defesa',
      'armadura': 'Armadura',
      'iniciativa': 'Iniciativa',
      'velocidade': 'Velocidade'
    };
    return names[stat] || stat;
  });
  
  Handlebars.registerHelper('resourceName', function(resource) {
    const names = {
      'hp': 'Pontos de Vida',
      'mp': 'Pontos de Magia'
    };
    return names[resource] || resource;
  });
  
  Handlebars.registerHelper('itemQuantity', function(item) {
    return item.system.quantidade || 1;
  });
  
  Handlebars.registerHelper('itemWeight', function(item) {
    const quantity = item.system.quantidade || 1;
    const weight = item.system.peso || 0;
    return weight * quantity;
  });
  
  Handlebars.registerHelper('itemValue', function(item) {
    const quantity = item.system.quantidade || 1;
    const value = item.system.preco || 0;
    return value * quantity;
  });
  
  Handlebars.registerHelper('damageDice', function(damage) {
    // Extrair dados de dano (ex: "1d6+2" -> "1d6")
    const match = damage.match(/(\d+d\d+)/);
    return match ? match[1] : damage;
  });
  
  Handlebars.registerHelper('damageBonus', function(damage) {
    // Extrair bônus de dano (ex: "1d6+2" -> "+2")
    const match = damage.match(/([+-]\d+)/);
    return match ? match[1] : '';
  });
  
  Handlebars.registerHelper('rollFormula', function(formula) {
    // Limpar fórmula para exibição
    return formula.replace(/\s+/g, '');
  });
  
  Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });
  
  console.log("Sistema N20 RPG | Helpers do Handlebars registrados");
} 