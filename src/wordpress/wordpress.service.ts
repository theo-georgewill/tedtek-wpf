import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class WordpressService {
  private readonly baseUrl =
    process.env.WORDPRESS_URL ?? 'http://localhost:8080';

  private readonly apiKey = process.env.WORDPRESS_API_KEY;

  async health() {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/tedtek/v1/health`,
      );

      if (!response.ok) {
        throw new BadGatewayException(
          `WordPress health check failed with status ${response.status}`,
        );
      }

      const data = await response.json();

      return {
        status: 'ok',
        connected: true,
        mode: 'wordpress',
        wordpress: data,
      };
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new BadGatewayException(
        'Unable to connect to WordPress.',
      );
    }
  }

  async configureSite(data: {
    business: {
      name: string;
      description?: string;
    };
    websiteSpec?: unknown;
  }) {
    return this.post('/site/configure', data);
  }

  async syncPages(data: {
    pages: Array<{
      key: string;
      title: string;
      slug: string;
      enabled: boolean;
      content: string;
    }>;
  }) {
    return this.post('/pages/sync', data);
  }

  async syncProperties(data: {
    properties: Array<{
      title: string;
      description?: string;
      price?: string;
      address?: string;
      city?: string;
      bedrooms?: string;
      bathrooms?: string;
      status?: string;
    }>;
  }) {
    return this.post('/properties/sync', data);
  }

  async syncTestimonials(data: {
    testimonials: Array<{
      name: string;
      content: string;
      role?: string;
      rating?: string;
    }>;
  }) {
    return this.post('/testimonials/sync', data);
  }
  
  async syncTeam(data: {
    team: Array<{
      id?: string;
      name: string;
      role: string;
      description?: string;
      image?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      instagram?: string;
    }>;
  }) {
    return this.post('/team/sync', data);
  }
  
  private async post<TResponse>(
    endpoint: string,
    body: unknown,
  ): Promise<TResponse> {
    if (!this.apiKey) {
      throw new InternalServerErrorException(
        'WORDPRESS_API_KEY is not configured.',
      );
    }

    let response: Response;

    try {
      response = await fetch(
        `${this.baseUrl}/wp-json/tedtek/v1${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tedtek-Key': this.apiKey,
          },
          body: JSON.stringify(body),
        },
      );
    } catch {
      throw new BadGatewayException(
        'Unable to connect to WordPress.',
      );
    }

    const responseBody = await response.json();

    if (!response.ok) {
      throw new BadGatewayException({
        message: 'WordPress request failed.',
        status: response.status,
        response: responseBody,
      });
    }

    return responseBody as TResponse;
  }
}