"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconSearch, IconDashboard, IconUser, IconFolder, IconListDetails, IconSettings, IconHome } from "@tabler/icons-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useLanguage } from "@/contexts/language-context"

export function SearchCommand({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const { t } = useLanguage()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const runCommand = React.useCallback((command: () => void) => {
    onOpenChange(false)
    command()
  }, [onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t("sidebar.searchPlaceholder") || "Search..."} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <IconHome className="mr-2 h-4 w-4" />
            <span>{t("sidebar.home")}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <IconDashboard className="mr-2 h-4 w-4" />
            <span>{t("sidebar.dashboard")}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/profile"))}>
            <IconUser className="mr-2 h-4 w-4" />
            <span>{t("sidebar.profile")}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/super-profile"))}>
            <IconSettings className="mr-2 h-4 w-4" />
            <span>{t("sidebar.superProfile")}</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Explore">
          <CommandItem onSelect={() => runCommand(() => router.push("/stores"))}>
            <IconFolder className="mr-2 h-4 w-4" />
            <span>{t("sidebar.browseStores")}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/services"))}>
            <IconListDetails className="mr-2 h-4 w-4" />
            <span>{t("sidebar.browseServices")}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
