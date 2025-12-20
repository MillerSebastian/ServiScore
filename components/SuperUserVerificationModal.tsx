"use client"

import React, { useMemo, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { BadgeCheck, IdCard, Store, Users, ArrowLeft, ArrowRight, Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { authService } from "@/lib/services/auth.service"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFinished: () => void
  currentEmail?: string
}

export default function SuperUserVerificationModal({ open, onOpenChange, onFinished, currentEmail }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState({
    fullName: "",
    userType: "persona",
    docType: "",
    docNumber: "",
    phone: "",
    hasStore: "no",
    storeCategories: [] as string[],
    storeDescription: "",
    city: "",
    country: "",
    socialMedia: "",
    // Store specific
    storeName: "",
    storeType: "",
    storeAddress: "",
    storeOnlineOnly: false,
    storeHours: "",
    storePhone: "",
    // URLs
    docFrontUrl: "",
    selfieUrl: "",
    facadeUrl: "",
    interiorUrl: "",
    serviceUrl: "",
    // Confirmations
    confirmations: [
      { name: "", contact: "", relation: "" },
      { name: "", contact: "", relation: "" },
      { name: "", contact: "", relation: "" }
    ]
  })

  const steps = useMemo(
    () => [
      { key: 1, title: "Identidad básica", icon: IdCard },
      { key: 2, title: "Actividad / tienda", icon: Store },
      { key: 3, title: "Evidencia y confianza", icon: Users },
    ],
    [],
  )

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConfirmationChange = (index: number, field: string, value: string) => {
    const newConfirmations = [...formData.confirmations]
    newConfirmations[index] = { ...newConfirmations[index], [field]: value }
    setFormData(prev => ({ ...prev, confirmations: newConfirmations }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, folder: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(prev => ({ ...prev, [fieldName]: true }))
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      setFormData(prev => ({ ...prev, [fieldName]: data.secure_url }))
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }))
    }
  }

  const next = () => {
    // Basic validation per step could go here
    if (step === 1 && (!formData.fullName || !formData.docNumber || !formData.phone)) {
      toast.error("Please fill in required fields")
      return
    }
    setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))
  }

  const back = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))

  const finish = async () => {
    try {
      setLoading(true)
      const uid = auth.currentUser?.uid
      if (!uid) {
        toast.error("User not found")
        return
      }

      await authService.submitVerification(uid, formData)

      toast.success("Verification submitted successfully!", {
        description: "You have been upgraded to Provider status."
      })
      onFinished()
    } catch (error) {
      console.error("Verification failed", error)
      toast.error("Failed to submit verification")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setStep(1) }}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[900px] max-h-[70vh] overflow-y-auto p-0">
        <div className="flex flex-col">
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xl font-bold">
                <BadgeCheck className="h-5 w-5 text-primary" />
                <span>Convertirme en Super Usuario</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {steps.map((s, idx) => {
                const Icon = s.icon
                const active = step === (s.key as 1 | 2 | 3)
                const completed = (s.key as number) < step
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <div
                      className={
                        "flex items-center justify-center h-8 w-8 rounded-full border text-sm " +
                        (active
                          ? "bg-primary text-primary-foreground border-primary"
                          : completed
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-muted text-muted-foreground border-border")
                      }
                    >
                      {s.key}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className={active || completed ? "h-4 w-4 text-primary" : "h-4 w-4 text-muted-foreground"} />
                      <span className={active ? "text-sm font-semibold" : "text-sm text-muted-foreground"}>{s.title}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="px-6 py-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nombre completo *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Tu nombre y apellido" className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Tipo de usuario</Label>
                    <RadioGroup
                      value={formData.userType}
                      onValueChange={(v) => handleInputChange('userType', v)}
                      className="mt-2 grid grid-cols-2 gap-3"
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="persona" id="persona" />
                        <Label htmlFor="persona">Persona natural</Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="empresa" id="empresa" />
                        <Label htmlFor="empresa">Negocio / Empresa</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="docType">Tipo de documento</Label>
                    <Input
                      id="docType"
                      value={formData.docType}
                      onChange={(e) => handleInputChange('docType', e.target.value)}
                      placeholder="DNI, Cédula, Pasaporte" className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="docNumber">Número de documento *</Label>
                    <Input
                      id="docNumber"
                      value={formData.docNumber}
                      onChange={(e) => handleInputChange('docNumber', e.target.value)}
                      placeholder="00000000" className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+57 300 000 0000" className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Foto del documento (frontal)</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="file" accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'docFrontUrl', 'verification')}
                        disabled={uploading['docFrontUrl']}
                      />
                      {uploading['docFrontUrl'] && <Loader2 className="animate-spin h-4 w-4" />}
                      {formData.docFrontUrl && <CheckIcon />}
                    </div>
                  </div>
                  <div>
                    <Label>Selfie con documento (opcional)</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="file" accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'selfieUrl', 'verification')}
                        disabled={uploading['selfieUrl']}
                      />
                      {uploading['selfieUrl'] && <Loader2 className="animate-spin h-4 w-4" />}
                      {formData.selfieUrl && <CheckIcon />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" value={currentEmail || ""} disabled className="mt-2 bg-muted" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>¿Tienes una tienda o negocio físico/digital?</Label>
                  <RadioGroup
                    value={formData.hasStore}
                    onValueChange={(v) => handleInputChange('hasStore', v)}
                    className="mt-2 grid grid-cols-2 gap-3"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="si" id="tienda-si" />
                      <Label htmlFor="tienda-si">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="no" id="tienda-no" />
                      <Label htmlFor="tienda-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.hasStore === "no" && (
                  <div className="space-y-4">
                    <div>
                      <Label>Categorías de servicios</Label>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["Hogar", "Tecnología", "Educación", "Bienestar", "Transporte", "Otros"].map((c) => (
                          <label key={c} className="flex items-center gap-2 rounded-md border p-3">
                            <Checkbox
                              checked={formData.storeCategories.includes(c)}
                              onCheckedChange={(checked) => {
                                if (checked) handleInputChange('storeCategories', [...formData.storeCategories, c])
                                else handleInputChange('storeCategories', formData.storeCategories.filter(cat => cat !== c))
                              }}
                            />
                            <span className="text-sm">{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Descripción breve</Label>
                      <Textarea
                        placeholder="¿Qué ofreces?" className="mt-2"
                        value={formData.storeDescription}
                        onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Ciudad</Label>
                        <Input
                          placeholder="Ciudad" className="mt-2"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>País</Label>
                        <Input
                          placeholder="País" className="mt-2"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.hasStore === "si" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre comercial</Label>
                        <Input
                          placeholder="Mi Tienda" className="mt-2"
                          value={formData.storeName}
                          onChange={(e) => handleInputChange('storeName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Tipo de negocio</Label>
                        <Input
                          placeholder="Categoría" className="mt-2"
                          value={formData.storeType}
                          onChange={(e) => handleInputChange('storeType', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Dirección</Label>
                        <Input
                          placeholder="Calle 123" className="mt-2"
                          value={formData.storeAddress}
                          onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-8">
                        <Checkbox
                          id="solo-online"
                          checked={formData.storeOnlineOnly}
                          onCheckedChange={(c) => handleInputChange('storeOnlineOnly', c)}
                        />
                        <Label htmlFor="solo-online">Solo online</Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Ciudad</Label>
                        <Input
                          placeholder="Ciudad" className="mt-2"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>País</Label>
                        <Input
                          placeholder="País" className="mt-2"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Horarios</Label>
                        <Input
                          placeholder="Lun - Vie 9:00 - 18:00" className="mt-2"
                          value={formData.storeHours}
                          onChange={(e) => handleInputChange('storeHours', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Teléfono de la tienda</Label>
                        <Input
                          placeholder="+57 300 000 0000" className="mt-2"
                          value={formData.storePhone}
                          onChange={(e) => handleInputChange('storePhone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Evidencia visual</Label>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-md border p-4">
                      <div className="mb-2 text-sm text-muted-foreground">Fachada del local / Logo</div>
                      <Input
                        type="file" accept="image/*" className="mt-2"
                        onChange={(e) => handleFileUpload(e, 'facadeUrl', 'verification')}
                        disabled={uploading['facadeUrl']}
                      />
                      {uploading['facadeUrl'] && <Loader2 className="animate-spin h-4 w-4 mt-2" />}
                      {formData.facadeUrl && <img src={formData.facadeUrl} className="mt-2 h-20 w-full object-cover rounded" />}

                    </div>
                    <div className="rounded-md border p-4">
                      <div className="mb-2 text-sm text-muted-foreground">Interior / Espacio de trabajo</div>
                      <Input
                        type="file" accept="image/*" className="mt-2"
                        onChange={(e) => handleFileUpload(e, 'interiorUrl', 'verification')}
                        disabled={uploading['interiorUrl']}
                      />
                      {uploading['interiorUrl'] && <Loader2 className="animate-spin h-4 w-4 mt-2" />}
                      {formData.interiorUrl && <img src={formData.interiorUrl} className="mt-2 h-20 w-full object-cover rounded" />}
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="mb-2 text-sm text-muted-foreground">Servicio en acción</div>
                      <Input
                        type="file" accept="image/*" className="mt-2"
                        onChange={(e) => handleFileUpload(e, 'serviceUrl', 'verification')}
                        disabled={uploading['serviceUrl']}
                      />
                      {uploading['serviceUrl'] && <Loader2 className="animate-spin h-4 w-4 mt-2" />}
                      {formData.serviceUrl && <img src={formData.serviceUrl} className="mt-2 h-20 w-full object-cover rounded" />}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Confirmación por clientes (3) - Opcional</Label>
                  <div className="mt-2 space-y-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-md border p-4">
                        <div>
                          <Label>Nombre</Label>
                          <Input
                            placeholder="Nombre del cliente" className="mt-2"
                            value={formData.confirmations[i].name}
                            onChange={(e) => handleConfirmationChange(i, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Teléfono o correo</Label>
                          <Input
                            placeholder="Contacto" className="mt-2"
                            value={formData.confirmations[i].contact}
                            onChange={(e) => handleConfirmationChange(i, 'contact', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Relación</Label>
                          <Input
                            placeholder="Cliente" className="mt-2"
                            value={formData.confirmations[i].relation}
                            onChange={(e) => handleConfirmationChange(i, 'relation', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {step === 1 && <span>Estado: Identidad en revisión</span>}
              {step === 2 && (formData.hasStore === "si" ? <span>Estado: Tienda en revisión</span> : <span>Estado: Servicios en revisión</span>)}
              {step === 3 && <span>Estado: Confirmaciones en progreso</span>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-transparent" onClick={back} disabled={step === 1 || loading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
              </Button>
              {step < 3 ? (
                <Button onClick={next} disabled={loading}>
                  Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={finish} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar solicitud
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CheckIcon() {
  return (
    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white">
      <BadgeCheck className="h-4 w-4" />
    </div>
  )
}
