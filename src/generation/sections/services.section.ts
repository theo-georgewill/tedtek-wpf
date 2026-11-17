import { Injectable } from '@nestjs/common';

import { SiteSection } from './site-section.interface';

export type ServicesSectionData = {
  services: string[];
};

@Injectable()
export class ServicesSection
  implements SiteSection<ServicesSectionData>
{
  readonly id = 'services';

  render(data: ServicesSectionData): string {
    const services =
      data.services.length > 0
        ? data.services
        : [
            'Property Sales',
            'Property Management',
            'Real Estate Consulting',
          ];

    const serviceCards = services
      .map(
        (service) => `
        <!-- wp:group {"backgroundColor":"background","style":{"border":{"radius":"12px"},"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem","left":"1.5rem","right":"1.5rem"}}},"layout":{"type":"constrained"}} -->
        <div class="wp-block-group has-background-background-color has-background" style="border-radius:12px;padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">

          <!-- wp:heading {"level":3,"fontSize":"large"} -->
          <h3 class="wp-block-heading has-large-font-size">
            ${service}
          </h3>
          <!-- /wp:heading -->

          <!-- wp:paragraph {"textColor":"muted"} -->
          <p class="has-muted-color has-text-color">
            Professional solutions tailored to your property needs.
          </p>
          <!-- /wp:paragraph -->

        </div>
        <!-- /wp:group -->`,
      )
      .join('\n');

    return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"5rem","bottom":"5rem","left":"1.5rem","right":"1.5rem"}}}} -->
<div class="wp-block-group alignfull" style="padding-top:5rem;padding-right:1.5rem;padding-bottom:5rem;padding-left:1.5rem">

  <!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"0.75rem"}}} -->
  <div class="wp-block-group alignwide">

    <!-- wp:paragraph {"textColor":"primary","fontSize":"small"} -->
    <p class="has-primary-color has-text-color has-small-font-size">
      WHAT WE DO
    </p>
    <!-- /wp:paragraph -->

    <!-- wp:heading {"level":2,"fontSize":"x-large"} -->
    <h2 class="wp-block-heading has-x-large-font-size">
      Our Services
    </h2>
    <!-- /wp:heading -->

  </div>
  <!-- /wp:group -->

  <!-- wp:columns {"align":"wide","style":{"spacing":{"margin":{"top":"2rem"}}}} -->
  <div class="wp-block-columns alignwide" style="margin-top:2rem">

    ${serviceCards}

  </div>
  <!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
  }
}