# 🔧 Solução Rápida - Erro de Compatibilidade

Se você está vendo o aviso **"O Sistema no URL fornecido não é compatível com a versão atual do Foundry Virtual Tabletop"**, siga estas etapas:

## 🔍 Passo 1: Verificar sua versão do Foundry VTT

1. Abra o Foundry VTT
2. Vá em **"Configuration"** → **"Software Update"**
3. Anote a versão atual (exemplo: `11.315`, `12.331`, etc.)

## 🎯 Passo 2: Escolher o manifest correto

### Se sua versão for 11.300 ou superior (incluindo v12):
```
https://raw.githubusercontent.com/seu-usuario/sistema-n20-rpg/main/system.json
```

### Se sua versão for entre 10.291 e 11.299:
```
https://raw.githubusercontent.com/seu-usuario/sistema-n20-rpg/main/system-legacy.json
```

## 📥 Passo 3: Instalar com o manifest correto

1. No Foundry VTT, vá para **"Game Systems"**
2. Clique em **"Install System"**
3. Cole o URL do manifest apropriado para sua versão
4. Clique em **"Install"**

## ⚠️ Se ainda não funcionar:

### Opção 1: Atualizar o Foundry VTT
- Atualize para a versão mais recente do Foundry VTT
- Use o manifest principal

### Opção 2: Instalação Manual
1. Baixe o ZIP: https://github.com/seu-usuario/sistema-n20-rpg/archive/refs/heads/main.zip
2. Extraia na pasta `Data/systems/` do Foundry VTT
3. Renomeie a pasta para `sistema-n20-rpg`
4. Reinicie o Foundry VTT

## 🎮 Versões Suportadas

| Versão Foundry VTT | Manifest | Status |
|-------------------|----------|--------|
| v10.291 - v11.299 | system-legacy.json | ✅ Compatível |
| v11.300+ | system.json | ✅ Recomendado |
| v12.x | system.json | ✅ Compatível |

## 🆘 Ainda com problemas?

1. **Verifique o console do navegador (F12)** para erros
2. **Recarregue a página (F5)**
3. **Tente instalação manual**
4. **Crie uma issue no GitHub** com:
   - Sua versão do Foundry VTT
   - Manifest usado
   - Capturas de tela do erro

---

**Dica:** Sempre use o manifest principal (`system.json`) a menos que você tenha uma versão muito antiga do Foundry VTT! 