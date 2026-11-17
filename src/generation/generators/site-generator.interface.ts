import { WebsiteSpec } from '../../templates/types/website-spec';

export type GeneratedPage = {
  key: string;
  title: string;
  slug: string;
  enabled: boolean;
  content: string;
};

export interface SiteGenerator {
  readonly templateId: string;
  readonly templateVersion: string;

  generatePages(
    spec: WebsiteSpec,
  ): GeneratedPage[];
}