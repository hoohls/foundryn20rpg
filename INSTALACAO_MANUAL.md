# 🔧 Instalação Manual - Sistema N20 RPG

## 🚨 Erro de Download?

Se você viu o erro **"Not Found"** ao tentar instalar via URL, é porque o GitHub ainda não está configurado. Use a **instalação manual** abaixo:

## 📥 Instalação Manual (Recomendada)

### Passo 1: Localizar a pasta do Foundry VTT

**Windows:**
```
C:\Users\[SeuUsuario]\AppData\Local\FoundryVTT\Data\systems\
```

**Mac:**
```
~/Library/Application Support/FoundryVTT/Data/systems/
```

**Linux:**
```
~/.local/share/FoundryVTT/Data/systems/
```

### Passo 2: Criar a pasta do sistema

1. Navegue até a pasta `systems/` do Foundry VTT
2. Crie uma nova pasta chamada `sistema-n20-rpg`

### Passo 3: Copiar os arquivos

1. Copie **TODOS** os arquivos do projeto para a pasta `sistema-n20-rpg`
2. **IMPORTANTE**: Substitua o arquivo `system.json` pelo `system-local.json` (e renomeie para `system.json`)

### Passo 4: Estrutura final

Sua pasta deve ficar assim:
```
sistema-n20-rpg/
├── system.json              # (copiado de system-local.json)
├── template.json
├── module/
│   ├── sistema-n20-rpg.mjs
│   ├── documents/
│   ├── sheets/
│   └── helpers/
├── templates/
├── css/
├── lang/
├── LICENSE.txt
├── README.md
└── [outros arquivos...]
```

### Passo 5: Reiniciar o Foundry VTT

1. Feche completamente o Foundry VTT
2. Abra novamente
3. Vá em **"Game Systems"**
4. Procure por **"Sistema N20 RPG"**
5. Crie um novo mundo usando este sistema

## 🎯 Comandos Rápidos (Terminal)

Se você tem experiência com terminal:

```bash
# Navegar para a pasta do sistema
cd "Sistema N20 RPG"

# Copiar system-local.json para system.json
cp system-local.json system.json

# Copiar todos os arquivos para a pasta do Foundry VTT
# (ajuste o caminho conforme seu sistema)

# Mac:
cp -r . ~/Library/Application\ Support/FoundryVTT/Data/systems/sistema-n20-rpg/

# Windows (PowerShell):
# Copy-Item -Path * -Destination "C:\Users\$env:USERNAME\AppData\Local\FoundryVTT\Data\systems\sistema-n20-rpg\" -Recurse

# Linux:
# cp -r . ~/.local/share/FoundryVTT/Data/systems/sistema-n20-rpg/
```

## 🔄 Configurar GitHub (Opcional)

Para habilitar instalação via URL no futuro:

### 1. Criar repositório no GitHub
1. Vá para https://github.com
2. Clique em "New repository"
3. Nome: `sistema-n20-rpg`
4. Marque como "Public"
5. Clique em "Create repository"

### 2. Configurar Git local
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/sistema-n20-rpg.git
git push -u origin main
```

### 3. Atualizar system.json
Substitua `seu-usuario` pelo seu username real do GitHub nos arquivos:
- `system.json`
- `system-legacy.json`
- `README.md`
- `INSTALACAO_GIT.md`

## ✅ Verificar Instalação

1. Abra o Foundry VTT
2. Vá para **"Game Systems"**
3. Procure por **"Sistema N20 RPG"**
4. Se aparecer, a instalação foi bem-sucedida!

## 🆘 Ainda com problemas?

1. **Verifique as permissões** da pasta
2. **Confirme que todos os arquivos** foram copiados
3. **Verifique o console** (F12) para erros específicos
4. **Teste criar um mundo** com o sistema

## 🎮 Próximos Passos

Após instalar com sucesso:
1. Crie um novo mundo
2. Selecione "Sistema N20 RPG"
3. Crie seu primeiro personagem
4. Explore as ferramentas de mestre
5. Configure os tokens com barras de status

---

**Dica:** A instalação manual é mais confiável que a instalação via URL até o GitHub estar configurado! 