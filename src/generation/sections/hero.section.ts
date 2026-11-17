import { Injectable } from '@nestjs/common';

import { SiteSection } from './site-section.interface';

export type HeroSectionData = {
  title: string;
  description: string;
  buttonText?: string;
};

@Injectable()
export class HeroSection
  implements SiteSection<HeroSectionData>
{
  readonly id = 'hero';

  render(data: HeroSectionData): string {
    const buttonText =
      data.buttonText ?? 'Get Started';

    return `<!-- wp:cover {"overlayColor":"primary-dark","minHeight":560,"minHeightUnit":"px","align":"full","style":{"spacing":{"padding":{"top":"5rem","bottom":"5rem","left":"1.5rem","right":"1.5rem"}}}} -->
<div class="wp-block-cover alignfull" style="min-height:560px;padding-top:5rem;padding-right:1.5rem;padding-bottom:5rem;padding-left:1.5rem">

  <span
    aria-hidden="true"
    class="wp-block-cover__background has-primary-dark-background-color has-background-dim-70"
  ></span>

  <div class="wp-block-cover__inner-container">

    <!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"blockGap":"1.5rem"}}} -->
    <div class="wp-block-group">

      <!-- wp:heading {"level":1,"fontSize":"xx-large","textColor":"background"} -->
      <h1 class="wp-block-heading has-background-color has-text-color has-xx-large-font-size">
        ${data.title}
      </h1>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"fontSize":"large","textColor":"background"} -->
      <p class="has-background-color has-text-color has-large-font-size">
        ${data.description}
      </p>
      <!-- /wp:paragraph -->

      <!-- wp:buttons -->
      <div class="wp-block-buttons">

        <!-- wp:button {"backgroundColor":"secondary","textColor":"background"} -->
        <div class="wp-block-button">
          <a class="wp-block-button__link has-background-color has-secondary-background-color has-text-color wp-element-button">
            ${buttonText}
          </a>
        </div>
        <!-- /wp:button -->

      </div>
      <!-- /wp:buttons -->

    </div>
    <!-- /wp:group -->

  </div>
</div>
<!-- /wp:cover -->`;
  }
}