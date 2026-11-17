import { Injectable } from '@nestjs/common';
import { Plan } from '@prisma/client';
import {
  TemplateSectionId,
  WebsiteSpec,
} from './types/website-spec';

export type TemplateSectionDefinition = {
  variants: string[];
  defaultVariant: string;
};

export type TemplateNiche =
  | 'business'
  | 'real-estate';

export type TemplateDefinition = {
  id: string;
  version: string;
  name: string;
  niche: TemplateNiche;
  industries: string[];
  plans: Record<Plan, string[]>;
  features: string[];
  sections: Partial<
    Record<TemplateSectionId, TemplateSectionDefinition>
  >;
};

@Injectable()
export class TemplatesService {
  private readonly templates: TemplateDefinition[] = [
    {
      id: 'business-modern',
      version: '1.0.0',
      name: 'Business Modern',
      niche: 'business',

      industries: [
        'generic',
        'agency',
        'consulting',
        'professional-services',
      ],

      plans: {
        FREE: ['home'],
        STARTER: ['home', 'about', 'services', 'contact'],
        BUSINESS: ['home', 'about', 'services', 'contact', 'blog'],
      },

      features: [
        'forms',
        'booking',
        'ecommerce',
        'blog',
        'analytics',
      ],

      sections: {
        hero: {
          variants: ['center'],
          defaultVariant: 'center',
        },
      },
    },

    {
      id: 'property-1.0.0',
      version: '1.0.0',
      name: 'Real Estate Modern',
      niche: 'real-estate',

      industries: ['real-estate'],

      plans: {
        FREE: ['home'],
        STARTER: ['home', 'about', 'properties', 'contact'],
        BUSINESS: ['home', 'about', 'properties', 'contact', 'blog'],
      },

      features: [
        'forms',
        'booking',
        'blog',
        'analytics',
      ],

      sections: {
        hero: {
          variants: ['center'],
          defaultVariant: 'center',
        },

        properties: {
          variants: ['slider'],
          defaultVariant: 'slider',
        },

        features: {
          variants: ['four-column'],
          defaultVariant: 'four-column',
        },

        testimonials: {
          variants: ['carousel'],
          defaultVariant: 'carousel',
        },

        about: {
          variants: ['image-left'],
          defaultVariant: 'image-left',
        },

        cta: {
          variants: ['center'],
          defaultVariant: 'center',
        },

        team: {
          variants: ['three-column'],
          defaultVariant: 'three-column',
        },
      },
    },
  ];

  list() {
    return this.templates;
  }

  findOne(id: string) {
    return this.templates.find((template) => template.id === id) ?? null;
  }

  resolve(id: string, version: string) {
    return (
      this.templates.find(
        (template) => template.id === id && template.version === version,
      ) ?? null
    );
  }

  maxPagesForPlan(template: TemplateDefinition, plan: Plan) {
    return template.plans[plan].length;
  }

  supportsSection(
    template: TemplateDefinition,
    section: TemplateSectionId,
  ) {
    return section in template.sections;
  }

  supportsVariant(
    template: TemplateDefinition,
    section: TemplateSectionId,
    variant: string,
  ) {
    const definition = template.sections[section];

    if (!definition) {
      return false;
    }

    return definition.variants.includes(variant);
  }

  defaultVariant(
    template: TemplateDefinition,
    section: TemplateSectionId,
  ) {
    return template.sections[section]?.defaultVariant ?? null;
  }

  buildDefaultWebsiteSpec(
    template: TemplateDefinition,
  ): WebsiteSpec {
    const homepage = Object.entries(template.sections).reduce(
      (sections, [sectionId, definition]) => {
        if (!definition) {
          return sections;
        }

        sections[sectionId as TemplateSectionId] = {
          enabled: true,
          variant: definition.defaultVariant,
        };

        return sections;
      },
      {} as NonNullable<WebsiteSpec['homepage']>,
    );

    return {
      template: {
        id: template.id,
        version: template.version,
      },

      business: {
        name: '',
        description: '',
        industry: '',
        location: '',
      },

      contact: {
        fullName: '',
        email: '',
        phone: '',
      },

      branding: {
        logoName: '',
        primaryColor: '',
        secondaryColor: '',
        font: '',
      },

      pages: [],

      features: {
        forms: false,
        booking: false,
        ecommerce: false,
        blog: false,
        analytics: false,
      },

      content: {
        services: [],
        notes: '',
      },

      homepage,
    };
  }
}
