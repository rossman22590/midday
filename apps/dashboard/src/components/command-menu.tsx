"use client";

import { signOutAction } from "@/actions/sign-out-action";
import { useMenuStore } from "@/store/menu";
import { Button } from "@midday/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@midday/ui/command";
import { Icons } from "@midday/ui/icons";
import { DialogProps } from "@radix-ui/react-alert-dialog";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const navigation = [
  {
    name: "Overview",
    path: "/",
    icon: Icons.Overview,
  },
  {
    name: "Inbound",
    path: "/inbound",
    icon: Icons.Inbox2,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: () => <Icons.Transactions size={20} />,
  },
  {
    name: "Invoices",
    path: "/invoices",
    icon: Icons.Invoice,
  },
  {
    name: "Tracker",
    path: "/tracker",
    icon: Icons.Tracker,
  },
  {
    name: "Vault",
    path: "/vault",
    icon: Icons.Files,
  },
  {
    name: "Exports",
    path: "/vault/exports",
    icon: Icons.DriveFileMove,
  },
  {
    name: "Apps",
    path: "/apps",
    icon: Icons.Apps,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Icons.Settings,
  },
];

const settings = [
  {
    name: "Account",
    path: "/account",
    icon: Icons.Person,
  },
  {
    name: "Team",
    path: "/account/teams",
    icon: Icons.Peolple,
  },
  {
    name: "Security",
    path: "/account/security",
    icon: Icons.Security,
  },
  {
    name: "Notifications",
    path: "/settings/notifications",
    icon: Icons.Notifications,
  },
  {
    name: "Bank Accounts",
    path: "/settings/connected",
    icon: Icons.AccountBalance,
  },
];

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const { toggleCustomizing } = useMenuStore();

  const handleSignOut = async () => {
    signOutAction();
    router.refresh();
  };

  useHotkeys("ctrl+k", () => setOpen((open) => !open));
  useHotkeys("meta+k", () => setOpen((open) => !open));

  useHotkeys("meta+s", (evt) => {
    evt.preventDefault();
    router.push("/settings");
  });

  useHotkeys("ctrl+m", (evt) => {
    evt.preventDefault();
    router.push("/settings/members");
  });

  useHotkeys("meta+m", (evt) => {
    evt.preventDefault();
    router.push("/settings/members");
  });

  useHotkeys("ctrl+t", (evt) => {
    evt.preventDefault();
    router.push("/account/teams");
  });

  useHotkeys("ctrl+a", (evt) => {
    evt.preventDefault();
    router.push("/apps");
  });

  useHotkeys("ctrl+meta+p", (evt) => {
    evt.preventDefault();
    router.push("/account");
  });

  useHotkeys("shift+meta+p", (evt) => {
    evt.preventDefault();
    router.push("/account");
  });

  useHotkeys("ctrl+meta+q", (evt) => {
    evt.preventDefault();
    handleSignOut();
  });

  useHotkeys("shift+meta+q", (evt) => {
    evt.preventDefault();
    handleSignOut();
  });

  useHotkeys("ctrl+f", (evt) => {
    evt.preventDefault();
    router.push(`${pathname}?feedback`);
  });

  useHotkeys("meta+f", (evt) => {
    evt.preventDefault();
    router.push(`${pathname}?feedback`);
  });

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 border-0 p-0 hover:bg-transparent font-normal"
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search for or jump to</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navigation.map(({ path, icon: Icon, name }) => (
              <CommandItem
                key={path}
                onSelect={() => {
                  router.push(path);
                  setOpen(false);
                }}
              >
                <div className="flex space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings">
            {settings.map(({ path, icon: Icon, name }) => (
              <CommandItem
                key={path}
                onSelect={() => {
                  router.push(path);
                  setOpen(false);
                }}
              >
                <div className="flex space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Appearance">
            <CommandItem onSelect={() => runCommand(() => toggleCustomizing())}>
              <Icons.DashboardCustomize className="mr-2 h-4 w-4" />
              Customize menu
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
