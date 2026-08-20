import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_PRODUC_URI;

export const grainsApi = createApi({
  reducerPath: "grainsApi",
  keepUnusedDataFor: 60 * 15,

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),

  endpoints: (builder) => ({
    // Get all categories
    getGrainCategories: builder.query({
      query: () => "/api/grains/categories",
    }),

    // Get all products
    getGrainProducts: builder.query({
      query: () => "/api/grains/products",
    }),

    // Get featured products
    getFeaturedGrainProducts: builder.query({
      query: () => "/api/grains/products/featured",
    }),

    // Get products belonging to one category
    getProductsByCategory: builder.query({
      query: (categorySlug) =>
        `/api/grains/categories/${categorySlug}/products`,
    }),

    // Get the complete Grains catalogue
    getGrainCatalogue: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        try {
          // 1. Fetch categories, products and featured products
          const [categoriesResult, productsResult, featuredResult] =
            await Promise.all([
              baseQuery("/api/grains/categories"),
              baseQuery("/api/grains/products"),
              baseQuery("/api/grains/products/featured"),
            ]);

          // If the main API requests fail, return null.
          // DataProvider can then use the existing static fallback.
          if (
            categoriesResult.error ||
            productsResult.error ||
            featuredResult.error
          ) {
            return {
              data: null,
            };
          }

          const catsData = categoriesResult.data;
          const prodsData = productsResult.data;
          const featData = featuredResult.data;

          const list = (value) =>
            Array.isArray(value) ? value : [];

          const getCategoryName = (category) =>
            category?.name ||
            category?.title ||
            category?.categoryName ||
            "";

          const getCategorySlug = (category) =>
            category?.slug ||
            category?.categorySlug ||
            category?.id ||
            "";

          const getProductName = (product) =>
            product?.name ||
            product?.title ||
            product?.productName ||
            "";

          const matchProductCategory = (
            product,
            categorySlug,
            categoryName
          ) => {
            const value = (
              product?.category_slug ||
              product?.categorySlug ||
              product?.category ||
              product?.categoryName ||
              ""
            ).toLowerCase();

            return (
              value === categorySlug.toLowerCase() ||
              value === categoryName.toLowerCase()
            );
          };

          const cats = list(
            catsData?.data ??
              catsData?.categories ??
              catsData
          );

          const prods = list(
            prodsData?.data ??
              prodsData?.products ??
              prodsData
          );

          const featuredProducts = list(
            featData?.data ??
              featData?.products ??
              featData
          );

          // Same fallback condition as the previous Grains data loader.
          if (!cats.length && !prods.length) {
            return {
              data: null,
            };
          }

          // 2. Build category → product menu
          const categoryMenu = await Promise.all(
            cats.map(async (category) => {
              const categoryName =
                getCategoryName(category);

              const categorySlug =
                getCategorySlug(category);

              let products;

              try {
                const result = await baseQuery(
                  `/api/grains/categories/${categorySlug}/products`
                );

                if (result.error) {
                  throw new Error("Category API failed");
                }

                const categoryData = result.data;

                products = list(
                  categoryData?.data ??
                    categoryData?.products ??
                    categoryData
                );
              } catch {
                // Same fallback logic as the previous Grains data loader.
                products = prods.filter((product) =>
                  matchProductCategory(
                    product,
                    categorySlug,
                    categoryName
                  )
                );
              }

              return {
                title: categoryName,

                dropdownClass: categoryName
                  .toLowerCase()
                  .includes("flour")
                  ? "flour-dropdown"
                  : undefined,

                links: products
                  .map((product) => ({
                    name: getProductName(product),
                    slug: product?.slug || "",
                  }))
                  .filter((link) => link.name),
              };
            })
          );

          // 3. Return exactly the same structure
          // that your existing DataProvider expects.
          return {
            data: {
              allProducts: prods,
              featuredProducts,
              categoryMenu,
            },
          };
        } catch (error) {
          console.warn(
            "Grains catalogue API unavailable:",
            error
          );

          return {
            data: null,
          };
        }
      },
    }),
  }),
});

export const {
  useGetGrainCategoriesQuery,
  useGetGrainProductsQuery,
  useGetFeaturedGrainProductsQuery,
  useGetProductsByCategoryQuery,
  useGetGrainCatalogueQuery,
} = grainsApi;
