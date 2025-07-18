// Amazon filters JavaScript implementation

// Brand filter factory function
export function createBrandFilter(id, name, selected = false) {
  return {
    id,
    name,
    selected
  };
}

// Price range filter factory function
export function createPriceRangeFilter(lowPrice, highPrice, selected = false) {
  return {
    lowPrice,
    highPrice,
    selected
  };
}

// Gender filter factory function
export function createGenderFilter(gender, productType, selected = false) {
  // Valid gender values: 'male' | 'female'
  // Valid productType values: 'jeans' | 'shirts'
  return {
    gender,
    productType,
    selected
  };
}

// Customer review filter factory function
export function createCustomerReviewFilter(stars, selected = false) {
  // Valid stars values: 1 | 2 | 3 | 4 | 5
  return {
    stars,
    selected
  };
}

// Amazon filters factory function
export function createAmazonFilters(brands = [], priceRange = null, genderFilter = null, customerReviews = []) {
  return {
    brands,
    priceRange,
    genderFilter,
    customerReviews
  };
}

// Constants for valid values
export const VALID_GENDERS = ['male', 'female'];
export const VALID_PRODUCT_TYPES = ['jeans', 'shirts'];
export const VALID_STAR_RATINGS = [1, 2, 3, 4, 5];

// Helper validation functions
export function isValidGender(gender) {
  return VALID_GENDERS.includes(gender);
}

export function isValidProductType(productType) {
  return VALID_PRODUCT_TYPES.includes(productType);
}

export function isValidStarRating(stars) {
  return VALID_STAR_RATINGS.includes(stars);
}