/**
 * Definir helpers customizados do Handlebars
 */
export function registerHelpers() {
  
  // Ajudar a concatenar strings
  Handlebars.registerHelper('concat', function() {
    let outStr = '';
    for (let arg in arguments) {
      if (typeof arguments[arg] !== 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  // Ajudar a fazer comparações condicionais
  Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });

  // Ajudar a fazer comparações condicionais com maior que
  Handlebars.registerHelper('ifGreater', function(arg1, arg2, options) {
    return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
  });

  // Ajudar a fazer comparações condicionais com menor que
  Handlebars.registerHelper('ifLess', function(arg1, arg2, options) {
    return (arg1 < arg2) ? options.fn(this) : options.inverse(this);
  });

  // Ajudar a calcular valores
  Handlebars.registerHelper('add', function(a, b) {
    return a + b;
  });

  Handlebars.registerHelper('subtract', function(a, b) {
    return a - b;
  });

  Handlebars.registerHelper('multiply', function(a, b) {
    return a * b;
  });

  Handlebars.registerHelper('divide', function(a, b) {
    return Math.floor(a / b);
  });

  // Ajudar a formatar números com sinal
  Handlebars.registerHelper('numberFormat', function(value) {
    const num = parseInt(value) || 0;
    return num >= 0 ? `+${num}` : `${num}`;
  });

  // Ajudar a verificar se um item está equipado
  Handlebars.registerHelper('isEquipped', function(item) {
    return item.system.equipado ? 'equipado' : '';
  });

  // Ajudar a mostrar apenas o primeiro nome
  Handlebars.registerHelper('firstName', function(fullName) {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  });

  // Ajudar a capitalizar strings
  Handlebars.registerHelper('capitalize', function(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // Ajudar a truncar texto
  Handlebars.registerHelper('truncate', function(str, length) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  });

  // Ajudar a verificar se um valor existe
  Handlebars.registerHelper('exists', function(value, options) {
    return value ? options.fn(this) : options.inverse(this);
  });

  // Ajudar para loops com índices
  Handlebars.registerHelper('times', function(n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i) {
      accum += block.fn(i);
    }
    return accum;
  });

  // Ajudar para mostrar barras de progresso
  Handlebars.registerHelper('progressBar', function(current, max, options) {
    const percentage = Math.round((current / max) * 100);
    const color = percentage > 75 ? 'green' : percentage > 25 ? 'yellow' : 'red';
    return new Handlebars.SafeString(`
      <div class="progress-bar" style="width: 100%; background: #ddd; border-radius: 3px;">
        <div class="progress-fill" style="width: ${percentage}%; background: ${color}; height: 20px; border-radius: 3px; text-align: center; line-height: 20px; color: white; font-size: 12px;">
          ${current}/${max}
        </div>
      </div>
    `);
  });

  // Ajudar para mostrar círculos de atributos
  Handlebars.registerHelper('attributeCircle', function(value, mod, options) {
    const modText = mod >= 0 ? `+${mod}` : `${mod}`;
    return new Handlebars.SafeString(`
      <div class="attribute-circle" style="width: 80px; height: 80px; border: 3px solid #8B4513; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f5f5dc;">
        <div class="attribute-value" style="font-size: 24px; font-weight: bold; color: #8B4513;">${value}</div>
        <div class="attribute-mod" style="font-size: 12px; color: #654321;">Mod: ${modText}</div>
      </div>
    `);
  });

  // Ajudar para mostrar status de equipamento
  Handlebars.registerHelper('equipmentStatus', function(equipped, options) {
    const icon = equipped ? '✓' : '○';
    const color = equipped ? 'green' : 'gray';
    const title = equipped ? 'Equipado' : 'Não equipado';
    return new Handlebars.SafeString(`
      <span class="equipment-status" style="color: ${color}; font-weight: bold;" title="${title}">${icon}</span>
    `);
  });

  // Ajudar para mostrar moedas formatadas
  Handlebars.registerHelper('formatMoney', function(copper) {
    if (!copper || copper === 0) return '0 pc';
    
    const ouro = Math.floor(copper / 100);
    const prata = Math.floor((copper % 100) / 10);
    const cobre = copper % 10;
    
    let result = [];
    if (ouro > 0) result.push(`${ouro} po`);
    if (prata > 0) result.push(`${prata} pp`);
    if (cobre > 0) result.push(`${cobre} pc`);
    
    return result.join(', ');
  });

  // Ajudar para mostrar peso total
  Handlebars.registerHelper('totalWeight', function(items) {
    if (!items || items.length === 0) return '0 kg';
    
    const total = items.reduce((sum, item) => {
      const peso = item.system.peso || 0;
      const quantidade = item.system.quantidade || 1;
      return sum + (peso * quantidade);
    }, 0);
    
    return `${total} kg`;
  });

  // Ajudar para mostrar nível de dificuldade
  Handlebars.registerHelper('difficultyLabel', function(difficulty) {
    if (difficulty <= 8) return 'Fácil';
    if (difficulty <= 12) return 'Médio';
    if (difficulty <= 16) return 'Difícil';
    return 'Extremo';
  });

  // Ajudar para mostrar cor baseada no valor
  Handlebars.registerHelper('valueColor', function(current, max) {
    const percentage = (current / max) * 100;
    if (percentage > 75) return 'green';
    if (percentage > 50) return 'yellow';
    if (percentage > 25) return 'orange';
    return 'red';
  });
} 