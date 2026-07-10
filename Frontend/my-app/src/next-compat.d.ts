declare module "next/link" {
  const Link: React.ComponentType<{
    href: string | { pathname: string; query?: any };
    children: React.ReactNode;
    [key: string]: any;
  }>;
  export default Link;
}

declare module "next/navigation" {
  export function usePathname(): string;
  export function useRouter(): {
    push(url: string): void;
    replace(url: string): void;
    back(): void;
    forward(): void;
    refresh(): void;
    prefetch(): void;
  };
  export function useSearchParams(): URLSearchParams;
}
