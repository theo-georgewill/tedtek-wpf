export interface SiteSection<TData = unknown> {
  readonly id: string;
  render(data: TData): string;
}