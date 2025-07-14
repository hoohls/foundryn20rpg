// Configuração para desenvolvimento do Sistema N20 RPG
export default {
  // Configurações básicas do sistema
  system: {
    id: 'sistema-n20-rpg',
    title: 'Sistema N20 RPG',
    version: '2.0.0',
    compatibility: {
      minimum: '11',
      verified: '13.346',
      maximum: '13'
    }
  },

  // Configurações de desenvolvimento
  development: {
    // Hot reload para desenvolvimento
    hotReload: {
      enabled: true,
      extensions: ['css', 'html', 'hbs', 'json', 'js', 'mjs'],
      paths: ['css', 'lang', 'templates', 'module']
    },

    // Logging
    logging: {
      level: 'DEBUG',
      enableConsole: true,
      enableFile: false
    },

    // Configurações de teste
    testing: {
      enabled: true,
      autoRun: false,
      coverage: true
    }
  },

  // Configurações de build
  build: {
    // Minificação para produção
    minify: {
      css: true,
      js: false, // Foundry VTT não suporta JS minificado
      html: false
    },

    // Otimizações
    optimize: {
      images: true,
      fonts: true,
      icons: true
    },

    // Arquivos a serem incluídos no build
    include: [
      'system.json',
      'template.json',
      'README.md',
      'LICENSE.txt',
      'CHANGELOG.md',
      'module/**/*',
      'templates/**/*',
      'css/**/*',
      'lang/**/*',
      'assets/**/*'
    ],

    // Arquivos a serem excluídos do build
    exclude: [
      'node_modules/**/*',
      '.git/**/*',
      '.vscode/**/*',
      '**/*.log',
      '**/*.tmp',
      'foundry.config.js',
      'INSTALACAO_GIT.md'
    ]
  },

  // Configurações de deployment
  deployment: {
    // GitHub Pages
    github: {
      enabled: true,
      branch: 'main',
      manifestPath: 'system.json'
    },

    // Configurações de release
    release: {
      // Gerar changelog automaticamente
      changelog: {
        enabled: true,
        format: 'keepachangelog'
      },

      // Criar tag automática
      tagging: {
        enabled: true,
        format: 'v{version}'
      },

      // Atualizar manifest URLs
      manifest: {
        updateUrls: true,
        baseUrl: 'https://github.com/seu-usuario/sistema-n20-rpg'
      }
    }
  },

  // Configurações de qualidade de código
  quality: {
    // Linting
    eslint: {
      enabled: true,
      config: '.eslintrc.js'
    },

    // Formatação
    prettier: {
      enabled: true,
      config: '.prettierrc'
    },

    // Verificação de tipos
    typescript: {
      enabled: false, // Sistema usa JS puro
      strict: false
    }
  },

  // Configurações de dependências
  dependencies: {
    // Foundry VTT
    foundry: {
      version: '11.x',
      api: '11'
    },

    // Módulos recomendados
    modules: {
      recommended: [
        'lib-wrapper',
        'socketlib',
        'dice-so-nice'
      ],
      
      optional: [
        'tokenizer',
        'combat-utility-belt',
        'dfreds-convenient-effects'
      ]
    }
  },

  // Configurações de documentação
  documentation: {
    // Gerar documentação da API
    api: {
      enabled: true,
      format: 'jsdoc',
      output: 'docs/api'
    },

    // Gerar guias de usuário
    guides: {
      enabled: true,
      format: 'markdown',
      output: 'docs/guides'
    }
  }
}; 