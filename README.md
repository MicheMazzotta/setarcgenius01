# SetArchiGenius Studio

**O agente de IA especializado em Arquitetura e Cenografia Brasileira.**

Gera prompts otimizados para Gemini, Midjourney, DALL-E 3, Ideogram, Leonardo AI e Kling Video.  
Lê plantas baixas (PDF, DXF, DWG) e gera briefing arquitetônico técnico automaticamente.

---

## Deploy

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Chave da API da Anthropic: [console.anthropic.com](https://console.anthropic.com)

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/setarchigenius.git
cd setarchigenius
```

### 2. Deploy no Vercel
```bash
npm i -g vercel
vercel --prod
```

### 3. Configure a variável de ambiente
No painel do Vercel:  
`Settings → Environment Variables → Add`

| Nome | Valor |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |

Após salvar, faça um novo deploy:
```bash
vercel --prod
```

---

## Estrutura
```
setarchigenius/
├── public/
│   └── index.html      # App completo (single-file)
├── api/
│   └── claude.js       # Proxy seguro para a API da Anthropic
├── vercel.json          # Configuração do Vercel
└── .gitignore
```

---

## Planos

| Plano | Preço | Recursos |
|-------|-------|----------|
| **Free** | Gratuito | 3 prompts/dia |
| **Anual** | R$297/ano (10× R$29,70) | Prompts ilimitados + imagens com suas APIs |

Código de ativação para testes internos: `SAG-ANUAL-2025`

---

© 2025 SetArchiGenius Studio
