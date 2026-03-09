# Matrix Reports API

API REST em NestJS para gerenciamento de relatórios de energia com paginação, filtros e endpoints de health check.

## 🚀 Tecnologias

- **NestJS** 10.x
- **TypeScript** 5.x
- **Swagger/OpenAPI** para documentação
- **class-validator** e **class-transformer** para validação de DTOs
- **Jest** para testes unitários

## 📋 Pré-requisitos

- Node.js 18+ ou 20+
- npm ou yarn

## 🔧 Instalação

```bash
# Clone o repositório
cd /root/projects/back/matrix.reports.api

# Instale as dependências
npm install
```

## ▶️ Executando a aplicação

```bash
# Desenvolvimento (watch mode)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A aplicação estará rodando em:
- **API**: http://localhost:8080
- **Swagger**: http://localhost:8080/api/docs

### 🌐 CORS para front local

Por padrão, a API permite as seguintes origens locais:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:4200`
- `http://127.0.0.1:4200`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

Para customizar, configure a variável de ambiente `CORS_ORIGINS` (separada por vírgula):

```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:5173 npm run start:dev
```

## 📚 Endpoints

### Health Endpoints

#### 1. GET /billing/check-billing
Verifica o status do processo de faturamento.

**Response:**
```json
{
  "isBillingRunning": true,
  "currentReferenceDate": "02/2026",
  "lastBillingEventAt": "2026-02-04T10:30:00.000Z",
  "message": "Billing process is active with reports being generated"
}
```

**Exemplo de request:**
```bash
curl http://localhost:3000/billing/check-billing
```

---

#### 2. GET /health/check-generation-reports
Verifica o status da geração de relatórios.

**Response:**
```json
{
  "isGeneratingReports": true,
  "generatingCount": 5,
  "queuedToGenerate": 31,
  "currentReferenceDate": "02/2026"
}
```

**Exemplo de request:**
```bash
curl http://localhost:3000/health/check-generation-reports
```

---

### Reports Endpoints

#### 3. GET /reports/resume-reports
Retorna estatísticas resumidas dos relatórios. Aceita filtro opcional por `referenceDate` via query string (formato `YYYY-MM-DD`, dia ignorado).

**Response:**
```json
{
  "sentReportsPercentage": 4.6,
  "reportsToGenerate": 31,
  "reportsPendingCorrection": 12,
  "reportsReadyToSend": 1801,
  "reportsSent": 90
}
```

**Exemplo de request:**
```bash
curl http://localhost:3000/reports/resume-reports
```

**Exemplo com filtro:**
```bash
curl "http://localhost:3000/reports/resume-reports?referenceDate=2025-12-01"
```

---

#### 4. GET /reports
Lista relatórios com paginação e filtros.

**Query Parameters:**

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `page` | number | Número da página (min: 1) | `1` |
| `pageSize` | number | Itens por página (min: 1, max: 100) | `10` |
| `search` | string | Busca por UC, meterPoint ou nickname | `SP-001` |
| `status` | string[] | Filtro por status (múltiplos permitidos) | `SENT,READY_TO_SEND` |
| `referenceMonth` | number | Mês de referência (1-12) | `2` |
| `referenceYear` | number | Ano de referência | `2026` |
| `economicGroup` | string | Grupo econômico | `Grupo A` |
| `sortBy` | string | Campo de ordenação: `id`, `referenceDate`, `nickname`, `status` | `id` |
| `sortOrder` | string | Ordem: `asc` ou `desc` | `desc` |

**Status disponíveis:**
- `READY_TO_GENERATE`
- `GENERATING_REPORT`
- `INFORMATION_PENDING`
- `NEEDS_ANALYSIS`
- `ERROR_PROCESSING`
- `READY_TO_SEND`
- `SENT`
- `ERROR_SEND`

**Response:**
```json
{
  "response": {
    "records": [
      {
        "id": 1,
        "uc": "UC-SP-000001",
        "meterPoint": "MP-00000001",
        "nickname": "Unidade Centro 1",
        "referenceDate": "02/2026",
        "economicGroup": "Grupo Econômico A",
        "status": "READY_TO_SEND",
        "url": "https://api.matrixenergia.com/reports/1"
      }
    ]
  },
  "paging": {
    "page": 1,
    "pageSize": 10,
    "totalPages": 20,
    "totalItems": 200
  }
}
```

**Exemplos de requests:**

```bash
# Lista básica (página 1, 10 itens)
curl "http://localhost:3000/reports"

# Página 2 com 25 itens
curl "http://localhost:3000/reports?page=2&pageSize=25"

# Busca por texto
curl "http://localhost:3000/reports?search=Centro"

# Filtro por status único
curl "http://localhost:3000/reports?status=SENT"

# Filtro por múltiplos status (array)
curl "http://localhost:3000/reports?status=SENT&status=READY_TO_SEND"

# Filtro por múltiplos status (CSV)
curl "http://localhost:3000/reports?status=SENT,READY_TO_SEND"

# Filtro por mês e ano
curl "http://localhost:3000/reports?referenceMonth=2&referenceYear=2026"

# Filtro por grupo econômico
curl "http://localhost:3000/reports?economicGroup=Grupo%20A"

# Ordenação por nickname ascendente
curl "http://localhost:3000/reports?sortBy=nickname&sortOrder=asc"

# Combinação de filtros
curl "http://localhost:3000/reports?search=SP&status=SENT&referenceMonth=2&page=1&pageSize=20&sortBy=id&sortOrder=desc"
```

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes em watch mode
npm run test:watch

# Rodar testes com coverage
npm run test:cov
```

**Testes implementados:**
- ✅ Paginação (totalPages, totalItems, páginas vazias)
- ✅ Filtros por status (único e múltiplos)
- ✅ Busca por search (UC, meterPoint, nickname)
- ✅ Filtros por referenceMonth e referenceYear
- ✅ Filtros por economicGroup
- ✅ Ordenação (id, nickname, referenceDate, status)
- ✅ Cálculo do resume-reports
- ✅ Health checks (billing e generation)

## 📁 Estrutura do Projeto

```
matrix.reports.api/
├── src/
│   ├── common/
│   │   ├── dto/
│   │   │   ├── pagination-query.dto.ts
│   │   │   └── paging-response.dto.ts
│   │   ├── enums/
│   │   │   └── report-status.enum.ts
│   │   └── interfaces/
│   │       └── report.interface.ts
│   ├── health/
│   │   ├── controllers/
│   │   │   └── health.controller.ts
│   │   ├── dto/
│   │   │   ├── check-billing-response.dto.ts
│   │   │   └── check-generation-reports-response.dto.ts
│   │   ├── services/
│   │   │   ├── health.service.ts
│   │   │   └── health.service.spec.ts
│   │   └── health.module.ts
│   ├── reports/
│   │   ├── controllers/
│   │   │   └── reports.controller.ts
│   │   ├── dto/
│   │   │   ├── reports-query.dto.ts
│   │   │   ├── reports-response.dto.ts
│   │   │   └── resume-reports-response.dto.ts
│   │   ├── repositories/
│   │   │   └── reports.repository.ts  ← MIGRAR PARA DB AQUI
│   │   ├── services/
│   │   │   ├── reports.service.ts
│   │   │   └── reports.service.spec.ts
│   │   └── reports.module.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🔄 Migração para Banco de Dados

Atualmente, a aplicação usa um **repositório in-memory** com 200 registros mock gerados automaticamente.

Para migrar para um banco de dados real:

1. **Instale um ORM** (TypeORM, Prisma, ou Mongoose):
```bash
# TypeORM + PostgreSQL
npm install @nestjs/typeorm typeorm pg

# Prisma
npm install @prisma/client
npm install -D prisma
```

2. **Substitua o arquivo**:
   - `src/reports/repositories/reports.repository.ts`

3. **Mantenha a mesma interface**:
   - `findAll()`: retorna todos os reports
   - `findById(id)`: busca por ID
   - `count()`: total de registros

4. **Atualize o módulo** para injetar a entidade/modelo do banco.

**Exemplo com TypeORM:**
```typescript
@Injectable()
export class ReportsRepository {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
  ) {}

  async findAll(): Promise<Report[]> {
    return this.reportRepo.find();
  }

  async findById(id: number): Promise<Report | undefined> {
    return this.reportRepo.findOne({ where: { id } });
  }

  async count(): Promise<number> {
    return this.reportRepo.count();
  }
}
```

## 🔍 Validações Implementadas

- ✅ `page` >= 1
- ✅ `pageSize` entre 1 e 100
- ✅ `referenceMonth` entre 1 e 12
- ✅ `referenceYear` entre 2000 e 2100
- ✅ `status` aceita múltiplos valores (array ou CSV)
- ✅ Validação global com `class-validator`
- ✅ Transformação automática de tipos com `class-transformer`

## 📊 Dados Mock

O repositório in-memory gera automaticamente 200 registros com:
- UCs de diferentes regiões (SP, RJ, MG, etc.)
- Meter Points únicos
- Nicknames variados (Unidade, Filial, Centro, etc.)
- Referências dos últimos 12 meses
- 5 grupos econômicos
- Distribuição realista de status (63% READY_TO_SEND, 15% READY_TO_GENERATE, 4% SENT, etc.)

## 🛠️ Personalização

### Alterar a porta
```bash
PORT=4000 npm run start:dev
```

### Desabilitar CORS
Em `src/main.ts`, remova ou comente:
```typescript
app.enableCors();
```

## 📖 Documentação Swagger

Acesse http://localhost:3000/api/docs para ver a documentação interativa completa com:
- Schemas de todas as DTOs
- Exemplos de request/response
- Teste de endpoints diretamente no navegador
- Descrição detalhada de cada parâmetro

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é privado e de uso interno.

---

**Desenvolvido com ❤️ usando NestJS**
