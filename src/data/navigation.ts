export type NavigationItem = {
  href: string;
  label: string;
};

export const navigation: NavigationItem[] = [
  { href: "/", label: "Početna" },
  { href: "/programi", label: "Programi" },
  { href: "/kampovi", label: "Kampovi" },
  { href: "/o-akademiji", label: "O akademiji" },
  { href: "/kontakt", label: "Kontakt" },
];
