'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/utils/format'

interface CVGenerationStepProps {
  onComplete: () => void
  profileData: any
}

const CV_TEMPLATES = [
  {
    id: 'template_a',
    name: 'Template A - Modern',
    description: 'Design modern dengan warna yang eye-catching',
    preview: 'bg-gradient-to-br from-primary/20 to-primary/5',
  },
  {
    id: 'template_b',
    name: 'Template B - Professional',
    description: 'Design professional yang elegan',
    preview: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5',
  },
]

export function CVGenerationStep({
  onComplete,
  profileData,
}: CVGenerationStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template_a')
  const [isGenerating, setIsGenerating] = useState(false)

  const profile = profileData?.profile
  const experiences = profileData?.experiences || []

  const handleGenerateCV = async () => {
    setIsGenerating(true)

    try {
      // TODO: Implement actual CV generation with PDF library
      // For now, just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success('CV berhasil dibuat! (Feature ini akan segera diluncurkan)')
    } catch (error) {
      toast.error('Gagal membuat CV')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Generate CV</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih template CV dan download CV Anda
        </p>
      </div>

      {/* CV Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview Data CV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personal Info */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Data Pribadi</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama:</span>
                <span className="font-medium">{profile?.full_name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telepon:</span>
                <span className="font-medium">{profile?.phone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alamat:</span>
                <span className="max-w-xs truncate text-right font-medium">
                  {profile?.address || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Pendidikan</h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium">
                {profile?.education_level?.toUpperCase() || '-'} -{' '}
                {profile?.major || '-'}
              </p>
              <p className="text-muted-foreground">
                {profile?.institution || '-'} ({profile?.graduation_year || '-'})
              </p>
              {profile?.gpa && (
                <p className="text-muted-foreground">IPK: {profile.gpa}</p>
              )}
            </div>
          </div>

          {/* Skills */}
          {profile?.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Experiences */}
          {experiences.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">
                Pengalaman Kerja ({experiences.length})
              </h3>
              <div className="space-y-2">
                {experiences.slice(0, 2).map((exp: any, index: number) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{exp.position}</p>
                    <p className="text-muted-foreground">{exp.company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(exp.start_date)} -{' '}
                      {exp.is_current
                        ? 'Sekarang'
                        : exp.end_date
                          ? formatDate(exp.end_date)
                          : '-'}
                    </p>
                  </div>
                ))}
                {experiences.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{experiences.length - 2} pengalaman lainnya
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Data CV Anda sudah lengkap dan siap untuk di-generate</span>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <div className="space-y-4">
        <Label>Pilih Template CV</Label>
        <RadioGroup
          value={selectedTemplate}
          onValueChange={setSelectedTemplate}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {CV_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value={template.id}
                      id={template.id}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={template.id} className="cursor-pointer">
                        {template.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                      <div className={`h-20 rounded ${template.preview}`}>
                        <div className="flex h-full items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleGenerateCV}
          disabled={isGenerating}
          variant="outline"
          className="flex-1"
        >
          {isGenerating ? (
            'Membuat CV...'
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate & Download CV
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Anda bisa skip langkah ini dan generate CV nanti dari dashboard
      </p>
    </div>
  )
}
