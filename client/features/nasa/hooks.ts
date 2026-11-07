import type {
  ApodPicture,
  CachedTranslation,
  ExplainApodInput,
} from "@shared/schemas/nasa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const nasaKeys = {
  pictures: ["nasa", "pictures"] as const,
};

/** Load random APOD pictures from the server */
export function useNasaPictures(count = 9) {
  return useQuery({
    queryKey: nasaKeys.pictures,
    queryFn: () => api<ApodPicture[]>(`/api/nasa/pictures?count=${count}`),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

/** Request or retrieve a Hebrew translation for a specific APOD date */
export function useExplainNasa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ExplainApodInput) =>
      api<CachedTranslation>("/api/nasa/explain", {
        method: "POST",
        body: input,
      }),
    onSuccess: (translation) => {
      // In-place cache update so the specific card immediately displays the Hebrew translation
      queryClient.setQueryData<ApodPicture[]>(nasaKeys.pictures, (old) => {
        if (!old) return old;
        return old.map((pic) =>
          pic.date === translation.date ? { ...pic, translation } : pic,
        );
      });
    },
  });
}
