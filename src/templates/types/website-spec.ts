export type TemplateSectionId =
  | 'hero'
  | 'properties'
  | 'features'
  | 'testimonials'
  | 'about'
  | 'cta'
  | 'team';

export type WebsiteSectionSpec = {
  enabled?: boolean;
  variant?: string;
};

export type WebsiteHomepageSpec =
  Partial<Record<TemplateSectionId, WebsiteSectionSpec>>;

export type WebsiteBusinessSpec = {
  name: string;
  description?: string;
  industry?: string;
  location?: string;
};

export type WebsiteContactSpec = {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
};

export type WebsiteBrandingSpec = {
  logoName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  font?: string;
};

export type WebsitePageSpec = {
  key: string;
  title: string;
  slug: string;
  enabled?: boolean;
};

export type WebsiteFeaturesSpec = {
  forms?: boolean;
  booking?: boolean;
  ecommerce?: boolean;
  blog?: boolean;
  analytics?: boolean;
};

export type WebsiteContentSpec = {
  services?: string[];
  notes?: string;
};

export type WebsitePropertySpec = {
  title: string;
  description?: string;
  price?: string;
  address?: string;
  city?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
};

export type WebsiteTestimonialSpec = {
  name: string;
  content: string;
  role?: string;
  rating?: string;
};

export type WebsiteTeamMemberSpec = {
  id?: string;
  name: string;
  role: string;
  description?: string;
  image?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
};

export type WebsiteDomainSpec = {
  custom: boolean;
  name?: string;
};

export type WebsiteSpec = {
  template: {
    id: string;
    version: string;
  };

  business: WebsiteBusinessSpec;

  contact: WebsiteContactSpec;

  branding: WebsiteBrandingSpec;

  pages: WebsitePageSpec[];

  features: WebsiteFeaturesSpec;

  content: WebsiteContentSpec;

  homepage?: WebsiteHomepageSpec;

  properties?: WebsitePropertySpec[];

  testimonials?: WebsiteTestimonialSpec[];

  team?: WebsiteTeamMemberSpec[];

  domain?: WebsiteDomainSpec;
};