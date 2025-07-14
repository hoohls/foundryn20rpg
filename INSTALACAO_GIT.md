# Instalação via Git - Sistema N20 RPG

Este guia explica como configurar o sistema para instalação via Git no Foundry VTT.

## 📋 Pré-requisitos

- Git instalado na máquina
- Conta no GitHub
- Foundry VTT instalado
- Conhecimento básico de Git

## 🚀 Configuração do Repositório

### 1. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique em "New repository"
3. Nome do repositório: `sistema-n20-rpg`
4. Descrição: "Sistema N20 RPG para Foundry VTT"
5. Marque como "Public" (para instalação direta)
6. **NÃO** inicialize com README (já temos um)
7. Clique em "Create repository"

### 2. Configurar Git Local

```bash
# Navegar até a pasta do sistema
cd "Sistema N20 RPG"

# Inicializar repositório Git
git init

# Configurar usuário (se não configurado globalmente)
git config user.name "Seu Nome"
git config user.email "seu.email@gmail.com"

# Adicionar arquivos ao staging
git add .

# Primeiro commit
git commit -m "Initial commit - Sistema N20 RPG v2.0.0"

# Adicionar origin remoto (substitua 'seu-usuario' pelo seu username)
git remote add origin https://github.com/seu-usuario/sistema-n20-rpg.git

# Definir branch principal
git branch -M main

# Enviar para o GitHub
git push -u origin main
```

### 3. Atualizar URLs no system.json

Após criar o repositório, edite o arquivo `system.json` e substitua:

```json
{
  "url": "https://github.com/SEU-USUARIO/sistema-n20-rpg",
  "manifest": "https://raw.githubusercontent.com/SEU-USUARIO/sistema-n20-rpg/main/system.json",
  "download": "https://github.com/SEU-USUARIO/sistema-n20-rpg/archive/refs/heads/main.zip"
}
```

Substitua `SEU-USUARIO` pelo seu username do GitHub.

### 4. Fazer Commit das Mudanças

```bash
# Adicionar mudanças
git add system.json

# Commit das atualizações
git commit -m "Update URLs in system.json"

# Enviar para o GitHub
git push
```

## 💡 Instalação no Foundry VTT

### Método 1: Via Manifest URL (Recomendado)

1. Abra o Foundry VTT
2. Vá para "Game Systems"
3. Clique em "Install System"
4. Cole a URL do manifest:
   ```
   https://raw.githubusercontent.com/SEU-USUARIO/sistema-n20-rpg/main/system.json
   ```
5. Clique em "Install"

### Método 2: Via Clone do Repositório

```bash
# Navegar até a pasta systems do Foundry
cd ~/foundrydata/Data/systems

# Ou no Windows:
# cd %LOCALAPPDATA%\FoundryVTT\Data\systems

# Clonar o repositório
git clone https://github.com/SEU-USUARIO/sistema-n20-rpg.git

# Reiniciar o Foundry VTT
```

### Método 3: Download Manual

1. Acesse o repositório no GitHub
2. Clique em "Code" > "Download ZIP"
3. Extraia na pasta `Data/systems/` do Foundry
4. Renomeie a pasta para `sistema-n20-rpg`
5. Reinicie o Foundry VTT

## 🔄 Atualizações do Sistema

### Para Desenvolvedores

```bash
# Fazer mudanças no código
# ...

# Atualizar versão no system.json
# Exemplo: "version": "2.0.1"

# Commit das mudanças
git add .
git commit -m "Update to v2.0.1 - [descrição das mudanças]"

# Criar tag da versão
git tag -a v2.0.1 -m "Version 2.0.1"

# Enviar para o GitHub
git push origin main
git push origin v2.0.1
```

### Para Usuários

O Foundry VTT verificará automaticamente por atualizações usando o manifest URL.

## 🛠️ Solução de Problemas

### Problema: "Sistema não compatível" ou "Aviso de Compatibilidade"
**Causa:** Versão do Foundry VTT incompatível com o manifest usado.

**Solução:**
1. **Verificar versão do Foundry VTT:**
   - No Foundry VTT, vá em "Configuration" → "Software Update"
   - Anote a versão atual (ex: 11.315, 12.331, etc.)

2. **Escolher o manifest correto:**
   - **Foundry VTT v11.300+, v12.x ou v13.x**: Use o manifest principal
     ```
     https://raw.githubusercontent.com/seu-usuario/sistema-n20-rpg/main/system.json
     ```
   - **Foundry VTT v10.291 - v11.299**: Use o manifest legacy
     ```
     https://raw.githubusercontent.com/seu-usuario/sistema-n20-rpg/main/system-legacy.json
     ```

3. **Se ainda não funcionar:**
   - Atualize o Foundry VTT para a versão mais recente
   - Ou use instalação manual (método 3)

### Problema: "Sistema não encontrado"
- Verifique se o URL do manifest está correto
- Certifique-se de que o repositório é público
- Teste o URL do manifest no navegador

### Problema: "Erro de download"
- Verifique se a URL de download está correta
- Certifique-se de que não há caracteres especiais no nome da pasta

### Problema: "Funcionalidades não carregam"
- Verifique se todos os arquivos foram baixados corretamente
- Recarregue a página (F5)
- Verifique o console do navegador (F12) para erros

## 🏷️ Versionamento

### Formato de Versão
- Use versionamento semântico (SemVer): `MAJOR.MINOR.PATCH`
- Exemplo: `2.0.0` → `2.0.1` → `2.1.0` → `3.0.0`

### Quando Incrementar
- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs

## 📝 Melhores Práticas

### Commits
- Use mensagens descritivas
- Commits pequenos e frequentes
- Separe funcionalidades em commits diferentes

### Branches
- `main`: Versão estável
- `develop`: Desenvolvimento ativo
- `feature/nome-da-funcionalidade`: Novas funcionalidades

### Releases
- Crie releases no GitHub para versões importantes
- Inclua changelog detalhado
- Teste completamente antes de fazer release

## 🔗 Links Úteis

- [Foundry VTT System Development](https://foundryvtt.com/article/system-development/)
- [GitHub Desktop](https://desktop.github.com/) - Interface gráfica para Git
- [Git Documentation](https://git-scm.com/doc)
- [Semantic Versioning](https://semver.org/)

---

**Dica**: Mantenha backups locais e teste sempre em um ambiente de desenvolvimento antes de fazer push para o repositório principal! 