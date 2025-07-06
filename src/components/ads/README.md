# Google AdSense Integration

## Configuração dos Anúncios do Google

### 1. Configuração do Publisher ID
No arquivo `index.html`, substitua `YOUR_PUBLISHER_ID` pelo seu ID real do Google AdSense:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-SEU_ID_REAL"
     crossorigin="anonymous"></script>
```

### 2. Configuração dos Ad Slots
Nos componentes de anúncios, substitua os slots pelos seus IDs reais:

**AdBanner.tsx:**
- small: `'1234567890'` → Seu slot real
- medium: `'1234567891'` → Seu slot real  
- large: `'1234567892'` → Seu slot real

**AdSidebar.tsx:**
- slot: `'1234567893'` → Seu slot real

**AdSquare.tsx:**
- small: `'1234567894'` → Seu slot real
- medium: `'1234567895'` → Seu slot real
- large: `'1234567896'` → Seu slot real

**GoogleAd.tsx:**
- Substitua `ca-pub-YOUR_PUBLISHER_ID` pelo seu Publisher ID real

### 3. Componentes de Anúncios Disponíveis

#### AdBanner
Banner horizontal para cabeçalhos e meio de conteúdo:
```tsx
<AdBanner size="small" />   // 320x100
<AdBanner size="medium" />  // 728x90
<AdBanner size="large" />   // 970x250
```

#### AdSidebar  
Anúncio lateral vertical:
```tsx
<AdSidebar />  // 300x600
```

#### AdSquare
Anúncios quadrados:
```tsx
<AdSquare size="small" />   // 200x200
<AdSquare size="medium" />  // 300x250
<AdSquare size="large" />   // 336x280
```

### 4. Localizações dos Anúncios

**Página Inicial (Index.tsx):**
- Banner grande após calculadora de calorias
- Anúncio quadrado grande após blog motivacional

**Dashboard:**
- Sidebar com anúncio vertical (desktop)
- Banner médio no final

**Receitas:**
- Banner médio após barra de pesquisa
- Anúncio quadrado grande no meio da grid (se mais de 6 receitas)

**Planos:**
- Banner médio após cabeçalho
- Anúncios quadrados grandes entre as tabs
- Banner grande no final

### 5. Responsividade
Todos os anúncios são configurados com `data-full-width-responsive="true"` para melhor adaptação mobile.

### 6. Observações Importantes
- Os anúncios incluem placeholder visual durante desenvolvimento
- Substitua todos os IDs de exemplo pelos IDs reais do Google AdSense
- Teste a responsividade em diferentes dispositivos
- Considere as políticas do Google AdSense para posicionamento