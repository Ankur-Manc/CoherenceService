// Amazon filters JavaScript implementation

// Amazon filter parameter mappings
const AMAZON_FILTER_IDS = {
  BRAND: 'p_123',
  PRICE_LOW: 'low-price',
  PRICE_HIGH: 'high-price',
  GENDER_MALE: '121075132011',
  GENDER_FEMALE: '121075131011',
  PRODUCT_JEANS: '21512907011',
  PRODUCT_SHIRTS: '7141123011',
  CUSTOMER_REVIEWS: 'p_72'
};

const CUSTOMER_REVIEW_IDS = {
  5: '2661617011',
  4: '2661618011',
  3: '2661619011',
  2: '2661620011',
  1: '2661621011'
};

// Brand filter factory function
export function createBrandFilter(brandId, name, selected = false) {
  return {
    id: `${AMAZON_FILTER_IDS.BRAND}:${brandId}`,
    brandId,
    name,
    selected,
    parameterFormat: `p_123:${brandId}` // e.g. p_123:310579
  };
}

// Price range filter factory function
export function createPriceRangeFilter(lowPrice, highPrice, selected = false) {
  return {
    id: `price_${lowPrice}_${highPrice}`,
    lowPrice,
    highPrice,
    selected,
    parameterFormat: `&ref=is_r_p_36_0_0&low-price=${lowPrice}&high-price=${highPrice}` // e.g. &ref=is_r_p_36_0_0&low-price=18&high-price=175
  };
}

// Gender filter factory function
export function createGenderFilter(gender, productType, selected = false) {
  // Valid gender values: 'male' | 'female'
  // Valid productType values: 'jeans' | 'shirts'
  const genderId = gender === 'male' ? AMAZON_FILTER_IDS.GENDER_MALE : AMAZON_FILTER_IDS.GENDER_FEMALE;
  const productId = productType === 'jeans' ? AMAZON_FILTER_IDS.PRODUCT_JEANS : AMAZON_FILTER_IDS.PRODUCT_SHIRTS;
  
  return {
    id: `${gender}_${productType}`,
    gender,
    productType,
    genderId,
    productId,
    selected,
    parameterFormat: `n:${productId},p_n_feature_thirty-two_browse-bin:${genderId}`
    // Male Jeans: n:21512907011,p_n_feature_thirty-two_browse-bin:121075132011
    // Male Shirts: n:7141123011,p_n_feature_thirty-two_browse-bin:121075132011
    // Female Jeans: n:21512907011,p_n_feature_thirty-two_browse-bin:121075131011
    // Female Shirts: n:7141123011,p_n_feature_thirty-two_browse-bin:121075131011
  };
}

// Customer review filter factory function
export function createCustomerReviewFilter(stars, selected = false) {
  // Valid stars values: 1 | 2 | 3 | 4 | 5
  const reviewId = CUSTOMER_REVIEW_IDS[stars];
  return {
    id: `reviews_${stars}_star`,
    stars,
    reviewId,
    selected,
    parameterFormat: `&rh=${AMAZON_FILTER_IDS.CUSTOMER_REVIEWS}:${reviewId}`
    // 5 star: &rh=p_72:2661617011
    // 4 stars: &rh=p_72:2661618011
    // 3 stars: &rh=p_72:2661619011
    // 2 stars: &rh=p_72:2661620011
    // 1 star: &rh=p_72:2661621011
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
