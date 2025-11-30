"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ParsedData {
  headers: string[]
  rows: Record<string, unknown>[]
}

export default function CsvPreviewTable({ data }: { data: ParsedData }) {
  const { headers, rows } = data

  const displayRows = rows.slice(0, 50)
  const hasMore = rows.length > 50

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-"
    if (typeof value === "string" && value.startsWith("[")) {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
          return `[${parsed.length} itens]`
        }
      } catch {
        // Se não conseguir parsear, mostra como string
      }
    }
    return String(value)
  }

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/20">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-amber-600 dark:text-amber-400">👁️</span>
          Visualização ({displayRows.length}
          {hasMore ? "+" : ""} linhas)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto border border-border/40 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/5 border-border/20">
                {headers.map((header) => (
                  <TableHead key={header} className="font-semibold text-foreground">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRows.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-accent/50 border-border/20">
                  {headers.map((header) => (
                    <TableCell key={`${idx}-${header}`} className="text-sm text-foreground/80">
                      {formatValue(row[header])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {hasMore && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Mostrando 50 de {rows.length} linhas. Baixe o CSV para ver todos os dados.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
