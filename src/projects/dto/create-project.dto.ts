import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class TemplateDto {
  @IsString()
  id!: string;

  @IsString()
  version!: string;
}

class BusinessDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  industry!: string;

  @IsString()
  location!: string;
}

class ContactDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

class BrandingDto {
  @IsString()
  logoName!: string;

  @IsString()
  primaryColor!: string;

  @IsString()
  secondaryColor!: string;

  @IsString()
  font!: string;
}

class PageDto {
  @IsString()
  key!: string;

  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

class FeaturesDto {
  @IsOptional()
  @IsBoolean()
  forms?: boolean;

  @IsOptional()
  @IsBoolean()
  booking?: boolean;

  @IsOptional()
  @IsBoolean()
  ecommerce?: boolean;

  @IsOptional()
  @IsBoolean()
  blog?: boolean;

  @IsOptional()
  @IsBoolean()
  analytics?: boolean;
}

class ContentDto {
  @IsArray()
  @IsString({ each: true })
  services!: string[];

  @IsString()
  notes!: string;
}

class PropertyDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  bedrooms?: string;

  @IsOptional()
  @IsString()
  bathrooms?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

class TestimonialDto {
  @IsString()
  name!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  rating?: string;
}

export class TeamMemberDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name!: string;

  @IsString()
  role!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  instagram?: string;
}

export class CreateProjectDto {
  @ValidateNested()
  @Type(() => TemplateDto)
  template!: TemplateDto;

  @IsOptional()
  @IsIn(['FREE', 'STARTER', 'BUSINESS'])
  plan?: 'FREE' | 'STARTER' | 'BUSINESS';

  @ValidateNested()
  @Type(() => BusinessDto)
  business!: BusinessDto;

  @ValidateNested()
  @Type(() => ContactDto)
  contact!: ContactDto;

  @ValidateNested()
  @Type(() => BrandingDto)
  branding!: BrandingDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageDto)
  pages!: PageDto[];

  @ValidateNested()
  @Type(() => FeaturesDto)
  features!: FeaturesDto;

  @ValidateNested()
  @Type(() => ContentDto)
  content!: ContentDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDto)
  properties?: PropertyDto[];
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialDto)
  testimonials?: TestimonialDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  team?: TeamMemberDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addonIds?: string[];

  @IsOptional()
  @IsObject()
  domain?: {
    custom: boolean;
    name?: string;
  };
}