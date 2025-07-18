// Types for Amazon filters
export interface Brand {
  id: string;
  name: string;
  selected: boolean;
}

export interface PriceRange {
  lowPrice: number;
  highPrice: number;
  selected: boolean;
}

export type Gender = 'male' | 'female';
export type ProductType = 'jeans' | 'shirts';
export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface GenderFilter {
  gender: Gender;
  productType: ProductType;
  selected: boolean;
}

export interface CustomerReviewFilter {
  stars: StarRating;
  selected: boolean;
}

export interface AmazonFilters {
  brands: Brand[];
  priceRange: PriceRange | null;
  genderFilter: GenderFilter | null;
  customerReviews: CustomerReviewFilter[];
}

// URL parameter generation class
export class AmazonUrlGenerator {
  private static readonly GENDER_PRODUCT_MAPPINGS = {
    male: {
      jeans: 'n:21512907011,p_n_feature_thirty-two_browse-bin:121075132011',
      shirts: 'n:7141123011,p_n_feature_thirty-two_browse-bin:121075132011'
    },
    female: {
      jeans: 'n:21512907011,p_n_feature_thirty-two_browse-bin:121075131011',
      shirts: 'n:7141123011,p_n_feature_thirty-two_browse-bin:121075131011'
    }
  };

  private static readonly STAR_RATING_MAPPINGS = {
    5: 'p_72:2661617011',
    4: 'p_72:2661618011',
    3: 'p_72:2661619011',
    2: 'p_72:2661620011',
    1: 'p_72:2661621011'
  };

  static generateUrl(baseUrl: string, filters: AmazonFilters): string {
    const params = new URLSearchParams();
    const rhParams: string[] = [];

    // Handle brands
    const selectedBrands = filters.brands.filter(brand => brand.selected);
    if (selectedBrands.length > 0) {
      const brandIds = selectedBrands.map(brand => brand.id).join('|');
      params.append('rnid', '85457740011');
      params.append('p_123', brandIds);
    }

    // Handle price range
    if (filters.priceRange?.selected) {
      params.append('ref', 'is_r_p_36_0_0');
      params.append('low-price', filters.priceRange.lowPrice.toString());
      params.append('high-price', filters.priceRange.highPrice.toString());
    }

    // Handle gender filter
    if (filters.genderFilter?.selected) {
      const genderMapping = this.GENDER_PRODUCT_MAPPINGS[filters.genderFilter.gender];
      const productMapping = genderMapping[filters.genderFilter.productType];
      rhParams.push(productMapping);
    }

    // Handle customer reviews
    const selectedReviews = filters.customerReviews.filter(review => review.selected);
    selectedReviews.forEach(review => {
      rhParams.push(this.STAR_RATING_MAPPINGS[review.stars]);
    });

    // Add rh parameter if there are any rh params
    if (rhParams.length > 0) {
      params.append('rh', rhParams.join(','));
    }

    // Construct final URL
    const paramString = params.toString();
    return paramString ? `${baseUrl}?${paramString}` : baseUrl;
  }

  static createEmptyFilters(): AmazonFilters {
    return {
      brands: [],
      priceRange: null,
      genderFilter: null,
      customerReviews: [
        { stars: 5, selected: false },
        { stars: 4, selected: false },
        { stars: 3, selected: false },
        { stars: 2, selected: false },
        { stars: 1, selected: false }
      ]
    };
  }

  static addBrand(filters: AmazonFilters, brand: Brand): AmazonFilters {
    return {
      ...filters,
      brands: [...filters.brands, brand]
    };
  }

  static toggleBrand(filters: AmazonFilters, brandId: string): AmazonFilters {
    return {
      ...filters,
      brands: filters.brands.map(brand =>
        brand.id === brandId ? { ...brand, selected: !brand.selected } : brand
      )
    };
  }

  static setPriceRange(filters: AmazonFilters, lowPrice: number, highPrice: number, selected: boolean = true): AmazonFilters {
    return {
      ...filters,
      priceRange: { lowPrice, highPrice, selected }
    };
  }

  static setGenderFilter(filters: AmazonFilters, gender: Gender, productType: ProductType, selected: boolean = true): AmazonFilters {
    return {
      ...filters,
      genderFilter: { gender, productType, selected }
    };
  }

  static toggleCustomerReview(filters: AmazonFilters, stars: StarRating): AmazonFilters {
    return {
      ...filters,
      customerReviews: filters.customerReviews.map(review =>
        review.stars === stars ? { ...review, selected: !review.selected } : review
      )
    };
  }
}

// Example usage:
export function exampleUsage() {
  // Create empty filters
  let filters = AmazonUrlGenerator.createEmptyFilters();

  // Add some brands
  filters = AmazonUrlGenerator.addBrand(filters, {
    id: '310579',
    name: 'Nike',
    selected: true
  });

  filters = AmazonUrlGenerator.addBrand(filters, {
    id: '304802',
    name: 'Adidas',
    selected: true
  });

  // Set price range
  filters = AmazonUrlGenerator.setPriceRange(filters, 18, 175);

  // Set gender filter
  filters = AmazonUrlGenerator.setGenderFilter(filters, 'male', 'jeans');

  // Select 4 and 5 star reviews
  filters = AmazonUrlGenerator.toggleCustomerReview(filters, 4);
  filters = AmazonUrlGenerator.toggleCustomerReview(filters, 5);

  // Generate URL
  const baseUrl = 'https://www.amazon.com/s';
  const finalUrl = AmazonUrlGenerator.generateUrl(baseUrl, filters);
  
  console.log('Generated URL:', finalUrl);
  // Output: https://www.amazon.com/s?rnid=85457740011&p_123=310579%7C304802&ref=is_r_p_36_0_0&low-price=18&high-price=175&rh=n%3A21512907011%2Cp_n_feature_thirty-two_browse-bin%3A121075132011%2Cp_72%3A2661618011%2Cp_72%3A2661617011

  return { filters, finalUrl };
}
