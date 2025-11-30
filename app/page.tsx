"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import JsonToCsvConverter from "@/components/json-to-csv-converter"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {}
      <header className="border-b border-border/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="10" y="30" width="15" height="50" fill="#1e40af" rx="3" />
                <rect x="30" y="20" width="15" height="60" fill="#16a34a" rx="3" />
                <rect x="50" y="25" width="15" height="55" fill="#22c55e" rx="3" />
                <path d="M 5 60 Q 15 70, 20 50" stroke="#2563eb" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Yardim
              </h1>
              <p className="text-xs text-muted-foreground">JSON para CSV</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
              Conversor JSON para CSV
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Converta seus dados JSON para formato CSV de forma instantânea. Com validação completa e suporte a
              estruturas complexas.
            </p>
          </div>

          {}
          <JsonToCsvConverter />

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span> Recursos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground/80">• Aceita JSON simples ou arrays</p>
                <p className="text-sm text-foreground/80">• Suporte a dados aninhados e objetos complexos</p>
                <p className="text-sm text-foreground/80">• Tabela de visualização dos dados convertidos</p>
                <p className="text-sm text-foreground/80">• Download do arquivo CSV com um clique</p>
                <p className="text-sm text-foreground/80">• Trata caracteres especiais corretamente</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">→</span> Formatos Suportados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Objeto Simples:</p>
                  <pre className="text-xs bg-primary/5 p-3 rounded-lg overflow-x-auto text-foreground/70 font-mono border border-border/30">{`{"nome": "João", "idade": 30}`}</pre>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Array de Objetos:</p>
                  <pre className="text-xs bg-primary/5 p-3 rounded-lg overflow-x-auto text-foreground/70 font-mono border border-border/30">{`[
                    {"nome": "João"},
                    {"nome": "Maria"}
                  ]`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Objeto com Array Aninhado:</p>
                  <pre className="text-xs bg-primary/5 p-3 rounded-lg overflow-x-auto text-foreground/70 font-mono border border-border/30">{`{
                    "pessoas": [
                      {"nome": "João"},
                      {"nome": "Maria"}
                    ]
                  }`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Dados Profundamente Aninhados:</p>
                  <pre className="text-xs bg-primary/5 p-3 rounded-lg overflow-x-auto text-foreground/70 font-mono border border-border/30">{`{
                    "pessoas": [{
                      "nome": "João",
                      "endereco": {
                        "cidade": "Curitiba"
                      }
                    }]
                  }`}
                  </pre>  
                </div>
              </CardContent>
            </Card>
          </div>

          <footer className="mt-16 pt-8 border-t border-border/30 text-center">
            <p className="text-sm text-muted-foreground">
              Desenvolvido por <span className="font-semibold text-foreground">Daniel Sousa</span> para Yardim • Prova
              de Conceito
            </p>
          </footer>
        </div>
      </div>
    </main>
  )
}
