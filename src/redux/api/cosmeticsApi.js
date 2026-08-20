import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

const list = (value) => (Array.isArray(value) ? value : []);

const normalizeCategories = (data) =>
  list(Array.isArray(data) ? data : data?.data ?? data?.categories ?? []);

const normalizeProducts = (data) =>
  list(Array.isArray(data) ? data : data?.data ?? data?.products ?? []);

const normalizeProduct = (data) =>
  Array.isArray(data) ? data[0] ?? null : data?.data ?? data ?? null;

export const cosmeticsApi = createApi({
  reducerPath: "cosmeticsApi",
  keepUnusedDataFor: 60 * 15,

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),

  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/api/categories",
      transformResponse: normalizeCategories,
    }),

    getCategoryProducts: builder.query({
      query: (slug) => `/api/categories/${slug}/products`,
      transformResponse: normalizeProducts,
    }),

    getProduct: builder.query({
      query: (slug) => `/api/products/${slug}`,
      transformResponse: normalizeProduct,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryProductsQuery,
  useGetProductQuery,
} = cosmeticsApi;
