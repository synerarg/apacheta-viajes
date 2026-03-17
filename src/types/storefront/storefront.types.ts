export interface StorefrontPackageItem {
  id: string
  slug: string
  category: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  durationDays: number
  departureLabel?: string
}

export interface StorefrontExperienceItem {
  id: string
  slug: string
  category: string
  categorySlug?: string
  name: string
  description: string
  image: string
  price: number
  currency: string
}

export interface StorefrontExperienceCategoryItem {
  id: string
  name: string
  image: string
  href: string
}

export interface StorefrontHotelItem {
  id: string
  name: string
  location: string
  image: string
  stars: number
  href: string
}

export interface StorefrontMetricItem {
  value: string
  label: string
}

export interface StorefrontEmisivoDestinationItem {
  id: string
  slug: string
  name: string
  description: string
  image: string
  country: string
  href: string
}
