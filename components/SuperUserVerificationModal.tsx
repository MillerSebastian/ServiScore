"use client"

import React, { useMemo, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { BadgeCheck, IdCard, Store, Users, ArrowLeft, ArrowRight } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFinished: () => void
  currentEmail?: string
}

export default function SuperUserVerificationModal({ open, onOpenChange, onFinished, currentEmail }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [userType, setUserType] = useState<"persona" | "empresa">("persona")
  const [hasStore, setHasStore] = useState<"si" | "no">("no")

  const steps = useMemo(
    () => [
      { key: 1, title: "Identidad básica", icon: IdCard },
      { key: 2, title: "Actividad / tienda", icon: Store },
      { key: 3, title: "Evidencia y confianza", icon: Users },
    ],
    [],
  )

  const next = () => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))

  const finish = () => {
    onFinished()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setStep(1) }}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[900px] max-h-[70vh] overflow-y-auto p-0">
        <div className="flex flex-col">
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xl font-bold">
                <BadgeCheck className="h-5 w-5 text-blue-600" />
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
                          ? "bg-blue-600 text-white border-blue-600"
                          : completed
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-muted text-muted-foreground border-border")
                      }
                    >
                      {s.key}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className={active || completed ? "h-4 w-4 text-blue-600" : "h-4 w-4 text-muted-foreground"} />
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
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input id="fullName" placeholder="Tu nombre y apellido" className="mt-2" />
                  </div>
                  <div>
                    <Label>Tipo de usuario</Label>
                    <RadioGroup
                      value={userType}
                      onValueChange={(v) => setUserType(v as "persona" | "empresa")}
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
                    <Input id="docType" placeholder="DNI, Cédula, Pasaporte" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="docNumber">Número de documento</Label>
                    <Input id="docNumber" placeholder="00000000" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="+57 300 000 0000" className="mt-2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Foto del documento (frontal)</Label>
                    <Input type="file" accept="image/*" className="mt-2" />
                  </div>
                  <div>
                    <Label>Selfie con documento (opcional)</Label>
                    <Input type="file" accept="image/*" className="mt-2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" value={currentEmail || ""} disabled className="mt-2" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>¿Tienes una tienda o negocio físico/digital?</Label>
                  <RadioGroup
                    value={hasStore}
                    onValueChange={(v) => setHasStore(v as "si" | "no")}
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

                {hasStore === "no" && (
                  <div className="space-y-4">
                    <div>
                      <Label>Categorías de servicios</Label>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["Hogar", "Tecnología", "Educación", "Bienestar", "Transporte", "Otros"].map((c) => (
                          <label key={c} className="flex items-center gap-2 rounded-md border p-3">
                            <Checkbox />
                            <span className="text-sm">{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Descripción breve</Label>
                      <Textarea placeholder="¿Qué ofreces?" className="mt-2" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Ciudad</Label>
                        <Input placeholder="Ciudad" className="mt-2" />
                      </div>
                      <div>
                        <Label>País</Label>
                        <Input placeholder="País" className="mt-2" />
                      </div>
                    </div>
                    <div>
                      <Label>Redes sociales (opcional)</Label>
                      <Input placeholder="@usuario o URL" className="mt-2" />
                    </div>
                  </div>
                )}

                {hasStore === "si" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre comercial</Label>
                        <Input placeholder="Mi Tienda" className="mt-2" />
                      </div>
                      <div>
                        <Label>Tipo de negocio</Label>
                        <Input placeholder="Categoría" className="mt-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Dirección</Label>
                        <Input placeholder="Calle 123" className="mt-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="solo-online" />
                        <Label htmlFor="solo-online">Solo online</Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Ciudad</Label>
                        <Input placeholder="Ciudad" className="mt-2" />
                      </div>
                      <div>
                        <Label>País</Label>
                        <Input placeholder="País" className="mt-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Horarios</Label>
                        <Input placeholder="Lun - Vie 9:00 - 18:00" className="mt-2" />
                      </div>
                      <div>
                        <Label>Teléfono de la tienda</Label>
                        <Input placeholder="+57 300 000 0000" className="mt-2" />
                      </div>
                    </div>
                    <div>
                      <Label>Redes sociales / Web</Label>
                      <Input placeholder="URL o @usuario" className="mt-2" />
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
                      <div className="mb-2 text-sm text-muted-foreground">Fachada del local</div>
                      <Input type="file" accept="image/*" className="mt-2" />
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="mb-2 text-sm text-muted-foreground">Interior del local</div>
                      <Input type="file" accept="image/*" className="mt-2" />
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="mb-2 text-sm text-muted-foreground">Servicio en acción</div>
                      <Input type="file" accept="image/*" className="mt-2" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Confirmación por clientes (3)</Label>
                  <div className="mt-2 space-y-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-md border p-4">
                        <div>
                          <Label>Nombre</Label>
                          <Input placeholder="Nombre del cliente" className="mt-2" />
                        </div>
                        <div>
                          <Label>Teléfono o correo</Label>
                          <Input placeholder="Contacto" className="mt-2" />
                        </div>
                        <div>
                          <Label>Relación</Label>
                          <Input placeholder="Cliente" className="mt-2" />
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
              {step === 2 && (hasStore === "si" ? <span>Estado: Tienda en revisión</span> : <span>Estado: Servicios en revisión</span>)}
              {step === 3 && <span>Estado: Confirmaciones en progreso</span>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-transparent" onClick={back} disabled={step === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
              </Button>
              {step < 3 ? (
                <Button onClick={next}>
                  Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="bg-blue-600 text-white hover:bg-blue-600/90" onClick={finish}>
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
