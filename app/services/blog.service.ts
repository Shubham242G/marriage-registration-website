import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const prefix = "/blog";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface IBlog {
  _id?: string;
  bannerImage: string;
  Date: string;
  categoryId: string;
  createdBy: string;
  bannerTitle: string;
  slug: string;
  description: string;
}

export interface GeneralApiResponse<T = unknown> {
  message: string;
  data: T;
}

export interface GeneralApiResponsePagination<T = unknown> {
  message: string;
  data: T[];
  total: number;
}

// ─── Default pagination ───────────────────────────────────────────────────────
const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 };

// ─── Raw API functions ────────────────────────────────────────────────────────
export const blogApi = {
  getAll: async (
    pagination: PaginationState = DEFAULT_PAGINATION,
    searchObj: Record<string, string> = {}
  ): Promise<GeneralApiResponsePagination<IBlog>> => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();
    const res = await fetch(`${BASE_URL}${prefix}/?${query}`);
    if (!res.ok) throw new Error("Failed to fetch blogs");
    return res.json();
  },

  getById: async (id: string): Promise<GeneralApiResponse<IBlog>> => {
    const res = await fetch(`${BASE_URL}${prefix}/getById/${id}`);
    if (!res.ok) throw new Error("Blog not found");
    return res.json();
  },

  getBySlug: async (slug: string): Promise<GeneralApiResponse<IBlog>> => {
    const res = await fetch(`${BASE_URL}${prefix}/getBySlug/${slug}`);
    if (!res.ok) throw new Error("Blog not found");
    return res.json();
  },

  add: async (obj: Partial<IBlog>): Promise<GeneralApiResponse<IBlog>> => {
    const res = await fetch(`${BASE_URL}${prefix}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });
    if (!res.ok) throw new Error("Failed to add blog");
    return res.json();
  },

  updateById: async (
    id: string,
    obj: Partial<IBlog>
  ): Promise<GeneralApiResponse> => {
    const res = await fetch(`${BASE_URL}${prefix}/updateById/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });
    if (!res.ok) throw new Error("Failed to update blog");
    return res.json();
  },

  deleteById: async (id: string): Promise<GeneralApiResponse> => {
    const res = await fetch(`${BASE_URL}${prefix}/deleteById/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete blog");
    return res.json();
  },
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

/** Fetch all blogs with optional pagination + search */
export const useBlogs = (
  pagination: PaginationState = DEFAULT_PAGINATION,
  searchObj: Record<string, string> = {}
) => {
  return useQuery({
    queryKey: ["blogs", pagination, searchObj],
    queryFn: () => blogApi.getAll(pagination, searchObj),
    initialData: {
      message: "",
      data: [],
      total: 0,
    } as GeneralApiResponsePagination<IBlog>,
  });
};

/** Fetch single blog by ID */
export const useBlogById = (id: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogApi.getById(id),
    enabled: !!id,
  });
};

/** Fetch single blog by slug */
export const useBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["blog-slug", slug],
    queryFn: () => blogApi.getBySlug(slug),
    enabled: !!slug,
  });
};

/** Add a blog */
export const useAddBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

/** Update a blog by ID */
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, obj }: { id: string; obj: Partial<IBlog> }) =>
      blogApi.updateById(id, obj),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

/** Delete a blog by ID */
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};