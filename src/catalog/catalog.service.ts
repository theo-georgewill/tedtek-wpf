import { BadRequestException, Injectable } from '@nestjs/common';

export type CatalogAddon = {
  id: string;
  name: string;
  description: string;
  type: 'PAGE' | 'DOMAIN' | 'FEATURE';
  price: number;
  currency: 'NGN';
};

@Injectable()
export class CatalogService {
  private readonly addons: CatalogAddon[] = [
    {
      id: 'extra-pages',
      name: 'Extra pages',
      description: 'Add pages beyond the free one-page website.',
      type: 'PAGE',
      price: 5000,
      currency: 'NGN',
    },
    {
      id: 'custom-domain',
      name: 'Custom domain',
      description: 'Connect a custom domain to the website.',
      type: 'DOMAIN',
      price: 15000,
      currency: 'NGN',
    },
    {
      id: 'booking',
      name: 'Online booking',
      description: 'Add booking and appointment functionality.',
      type: 'FEATURE',
      price: 25000,
      currency: 'NGN',
    },
    {
      id: 'ecommerce',
      name: 'Ecommerce',
      description: 'Add ecommerce capabilities with WooCommerce.',
      type: 'FEATURE',
      price: 40000,
      currency: 'NGN',
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Add a full blog section.',
      type: 'FEATURE',
      price: 10000,
      currency: 'NGN',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Add website analytics configuration.',
      type: 'FEATURE',
      price: 10000,
      currency: 'NGN',
    },
  ];

  getCatalog() {
    return {
      website: {
        id: 'free-website',
        name: 'Free one-page website',
        price: 0,
        currency: 'NGN',
      },
      addons: this.addons.filter((addon) => addon.id !== 'extra-pages'),
      pageAddon: this.addons.find((addon) => addon.id === 'extra-pages'),
    };
  }

  resolveAddons(ids: string[]) {
    const uniqueIds = [...new Set(ids)];
    const addons = uniqueIds.map((id) => this.addons.find((addon) => addon.id === id));

    if (addons.some((addon) => !addon)) {
      throw new BadRequestException('One or more add-ons are not available');
    }

    return addons.filter((addon): addon is CatalogAddon => Boolean(addon));
  }
}
