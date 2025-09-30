# Lune Admin - PWA (Progressive Web App)

O Lune Admin foi configurado como uma Progressive Web App (PWA), permitindo que os usuários instalem o aplicativo diretamente em seus dispositivos móveis e desktop.

## 🚀 Funcionalidades PWA Implementadas

### ✅ Manifest.json
- Configuração completa do manifest com metadados da aplicação
- Ícones em múltiplos tamanhos (144x144, 192x192, 256x256, 384x384, 512x512)
- Suporte a shortcuts para acesso rápido a funcionalidades principais
- Configuração de cores de tema e orientação

### ✅ Service Worker
- Cache automático de recursos estáticos
- Funcionalidade offline com página de fallback
- Estratégias de cache otimizadas para performance
- Recarregamento automático quando a conexão é restaurada

### ✅ Instalação PWA
- Prompt automático de instalação (aparece após 3 segundos)
- Detecção inteligente de quando mostrar o prompt
- Suporte para iOS e Android
- Hook personalizado `usePWA` para gerenciar estado da instalação

### ✅ Página Offline
- Página personalizada para quando o usuário está offline
- Interface amigável com opções de recarregamento
- Botão para voltar ao início da aplicação

## 📱 Como Instalar

### Desktop (Chrome/Edge)
1. Acesse a aplicação no navegador
2. Aguarde o prompt de instalação aparecer (ou clique no ícone de instalação na barra de endereços)
3. Clique em "Instalar" quando solicitado

### Mobile (Android)
1. Acesse a aplicação no Chrome
2. Toque no menu (três pontos) e selecione "Adicionar à tela inicial"
3. Confirme a instalação

### Mobile (iOS)
1. Acesse a aplicação no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"

## 🔧 Configurações Técnicas

### Arquivos Gerados
- `public/sw.js` - Service Worker principal
- `public/workbox-*.js` - Bibliotecas do Workbox
- `public/manifest.json` - Manifest da PWA
- `public/fallback-*.js` - Scripts de fallback

### Configurações do Next.js
- PWA habilitado apenas em produção
- Cache agressivo para navegação frontend
- Minificação SWC habilitada
- Fallback para página offline configurado

### Hook usePWA
```typescript
const { isInstalled, isInstallable, installApp } = usePWA();
```

## 🎯 Funcionalidades Offline

- Cache automático de páginas visitadas
- Funcionalidades básicas disponíveis offline
- Sincronização automática quando a conexão é restaurada
- Página de fallback personalizada para navegação offline

## 🚀 Build e Deploy

Para gerar a versão PWA:

```bash
npm run build
```

Os arquivos PWA serão gerados automaticamente no diretório `public/`.

## 📊 Monitoramento

O service worker inclui logs detalhados para monitoramento:
- Registro de cache hits/misses
- Detecção de atualizações
- Status de instalação

## 🔄 Atualizações

A PWA detecta automaticamente atualizações e:
- Notifica o usuário sobre novas versões
- Permite atualização com um clique
- Mantém dados locais durante atualizações

## 🛠️ Desenvolvimento

Para desenvolvimento local, a PWA está desabilitada por padrão. Para testar:

1. Execute `npm run build`
2. Execute `npm run start`
3. Acesse `http://localhost:3000`

A PWA estará ativa e funcional nesta configuração.
