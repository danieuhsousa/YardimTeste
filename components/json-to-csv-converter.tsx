"use client"

import { useState } from "react"
import { AlertCircle, Copy, Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import CsvPreviewTable from "./csv-preview-table"

interface ParsedData {
  headers: string[]
  rows: Record<string, unknown>[]
}

interface ValidationError {
  type: "empty" | "invalid-json" | "no-data"
  message: string
}

const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
  let result: Record<string, any> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const newKey = prefix ? `${prefix}_${key}` : key

      if (value === null || value === undefined) {
        result[newKey] = ""
      } else if (Array.isArray(value)) {
        result[newKey] = JSON.stringify(value)
      } else if (typeof value === "object") {
        const flattened = flattenObject(value, newKey)
        result = { ...result, ...flattened }
      } else {
        result[newKey] = value
      }
    }
  }

  return result
}

const normalizeData = (parsed: any): any[] => {
  if (Array.isArray(parsed)) {
    return parsed
  } else if (typeof parsed === "object" && parsed !== null) {
    const arrays: { key: string; items: any[] }[] = []
    const scalars: Record<string, any> = {}

    for (const key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        if (Array.isArray(parsed[key])) {
          arrays.push({ key, items: parsed[key] })
        } else {
          scalars[key] = parsed[key]
        }
      }
    }

    if (arrays.length > 0) {
      const primaryArray = arrays[0]
      return primaryArray.items.map((item) => ({
        ...scalars,
        [primaryArray.key]: item,
      }))
    }

    return [parsed]
  }
  return []
}

const SAMPLE_JSON = `{
  "pessoas": [
    {
      "nome": "João Silva",
      "idade": 32,
      "endereco": {
        "rua": "Rua das Flores",
        "numero": 120,
        "bairro": "Centro",
        "cidade": "Curitiba",
        "estado": "PR",
        "cep": "80010-000"
      },
      "contato": {
        "email": "joao.silva@example.com",
        "telefone": "(41) 99999-1234",
        "whatsapp": "(41) 98888-5678"
      }
    },
    {
      "nome": "Maria Oliveira",
      "idade": 27,
      "endereco": {
        "rua": "Avenida Brasil",
        "numero": 450,
        "bairro": "Jardim América",
        "cidade": "São Paulo",
        "estado": "SP",
        "cep": "01430-000"
      },
      "contato": {
        "email": "maria.oliveira@example.com",
        "telefone": "(11) 98877-4455",
        "whatsapp": "(11) 97766-3344"
      }
    },
    {
      "nome": "Carlos Pereira",
      "idade": 40,
      "endereco": {
        "rua": "Rua Rio Branco",
        "numero": 89,
        "bairro": "Boa Vista",
        "cidade": "Porto Alegre",
        "estado": "RS",
        "cep": "90520-001"
      },
      "contato": {
        "email": "carlos.pereira@example.com",
        "telefone": "(51) 99777-2233",
        "whatsapp": "(51) 99666-1122"
      }
    }
  ]
}`

export default function JsonToCsvConverter() {
  const [jsonInput, setJsonInput] = useState("")
  const [csvOutput, setCsvOutput] = useState("")
  const [error, setError] = useState<ValidationError | null>(null)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const validateAndParse = (input: string): { valid: boolean; data?: ParsedData; error?: ValidationError } => {
    if (!input.trim()) {
      return {
        valid: false,
        error: { type: "empty", message: "Entrada JSON vazia. Por favor, cole seus dados JSON." },
      }
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(input)
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Erro desconhecido"
      return {
        valid: false,
        error: {
          type: "invalid-json",
          message: `JSON inválido: ${errorMsg}`,
        },
      }
    }

    const normalizedData = normalizeData(parsed)

    if (normalizedData.length === 0) {
      return {
        valid: false,
        error: {
          type: "no-data",
          message: "Nenhum dado encontrado. Forneça um objeto ou array de objetos.",
        },
      }
    }

    const flattenedRows = normalizedData.map((obj) => flattenObject(obj))

    const headersSet = new Set<string>()
    flattenedRows.forEach((obj) => {
      Object.keys(obj).forEach((key) => headersSet.add(key))
    })

    const headers = Array.from(headersSet).sort()

    return {
      valid: true,
      data: { headers, rows: flattenedRows },
    }
  }

  const convertToCSV = (data: ParsedData): string => {
    const { headers, rows } = data

    const escapeCSVValue = (value: unknown): string => {
      if (value === null || value === undefined) return ""

      const stringValue = String(value)

      if (stringValue.includes('"') || stringValue.includes(";") || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }

      return stringValue
    }

    const headerRow = headers.map((h) => escapeCSVValue(h)).join(";")
    const dataRows = rows.map((row) => {
      return headers.map((header) => escapeCSVValue(row[header])).join(";")
    })

    return [headerRow, ...dataRows].join("\n")
  }

  const handleConvert = () => {
    setError(null)
    setParsedData(null)
    setCsvOutput("")
    setCopied(false)
    setDownloaded(false)

    const result = validateAndParse(jsonInput)

    if (!result.valid) {
      setError(result.error || { type: "invalid-json", message: "Erro desconhecido ocorreu" })
      return
    }

    const csv = convertToCSV(result.data!)
    setCsvOutput(csv)
    setParsedData(result.data!)
    setError(null)
  }

  const handleClear = () => {
    setJsonInput("")
    setCsvOutput("")
    setParsedData(null)
    setError(null)
    setCopied(false)
    setDownloaded(false)
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(csvOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Falha ao copiar:", err)
    }
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" })
    element.href = URL.createObjectURL(file)
    element.download = `dados-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  const handleLoadExample = () => {
    setJsonInput(SAMPLE_JSON)
    setError(null)
    setParsedData(null)
    setCsvOutput("")
  }

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm lg:col-span-1 flex flex-col">
          <CardHeader className="border-b border-border/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-400">📋</span> Exemplo Válido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 flex-1 flex flex-col">
            <p className="text-xs text-muted-foreground">Exemplo de JSON com dados aninhados:</p>
            <div className="flex-1 bg-background/50 rounded-lg p-3 border border-border/20 overflow-auto">
              <pre className="font-mono text-xs text-foreground/70 whitespace-pre-wrap break-words">
                {`{
  "pessoas": [
    {
      "nome": "João",
      "idade": 32,
      "endereco": {
        "cidade": "Curitiba"
      },
      "contato": {
        "email": "joao@..."
      }
    },
    ...
  ]
}`}
              </pre>
            </div>
            <Button
              onClick={handleLoadExample}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              Carregar Exemplo
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">{"{ }"}</span> Entrada JSON
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Textarea
                placeholder='Cole seu JSON aqui... {"nome": "João", "idade": 30}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="font-mono text-sm h-64 resize-none bg-background/50"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleConvert}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  Converter
                </Button>
                <Button onClick={handleClear} variant="outline" size="icon" className="hover:bg-accent bg-transparent">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">📊</span> Saída CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Textarea
                placeholder="Sua saída CSV aparecerá aqui..."
                value={csvOutput}
                readOnly
                className="font-mono text-sm h-64 resize-none bg-muted/50 text-muted-foreground"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyToClipboard}
                  disabled={!csvOutput}
                  variant="outline"
                  className="flex-1 hover:bg-accent bg-transparent"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!csvOutput}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloaded ? "Baixado!" : "Baixar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>Erro:</strong> {error.message}
          </AlertDescription>
        </Alert>
      )}

      {parsedData && !error && <CsvPreviewTable data={parsedData} />}
    </div>
  )
}
