import { Injectable } from '@nestjs/common';

import { SiteSection } from './site-section.interface';

export type AboutSectionData = {
  businessName: string;
  location: string;
  description: string;
};

@Injectable()
export class AboutSection
  implements SiteSection<AboutSectionData>
{
  readonly id = 'about';

  render(data: AboutSectionData): string {
    return `<!-- wp:group {"align":"full","backgroundColor":"surface","style":{"spacing":{"padding":{"top":"5rem","bottom":"5rem","left":"1.5rem","right":"1.5rem"}}}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="padding-top:5rem;padding-right:1.5rem;padding-bottom:5rem;padding-left:1.5rem">

  <!-- wp:columns {"align":"wide","verticalAlignment":"center"} -->
  <div class="wp-block-columns alignwide are-vertically-aligned-center">

    <!-- wp:column {"verticalAlignment":"center"} -->
    <div class="wp-block-column is-vertically-aligned-center">

      <!-- wp:paragraph {"textColor":"primary","fontSize":"small"} -->
      <p class="has-primary-color has-text-color has-small-font-size">
        ABOUT US
      </p>
      <!-- /wp:paragraph -->

      <!-- wp:heading {"level":2,"fontSize":"x-large"} -->
      <h2 class="wp-block-heading has-x-large-font-size">
        About ${data.businessName}
      </h2>
      <!-- /wp:heading -->

    </div>
    <!-- /wp:column -->

    <!-- wp:column {"verticalAlignment":"center"} -->
    <div class="wp-block-column is-vertically-aligned-center">

      <!-- wp:paragraph -->
      <p>
        ${data.description}
      </p>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph {"textColor":"muted"} -->
      <p class="has-muted-color has-text-color">
        Based in ${data.location}, ${data.businessName} is committed
        to providing excellent service and helping clients make
        confident property decisions.
      </p>
      <!-- /wp:paragraph -->

    </div>
    <!-- /wp:column -->

  </div>
  <!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
  }
}