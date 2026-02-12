import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
export const docPropsSchema = z
  .object({
    premiumProperty: z.boolean().default(false),
    description: z.string().min(1, "Description is required"),
    ExpectedCompletionDate: z.string().optional(),
    location: z.string().min(1, "Location is required"),

    basePrice: z.string().min(1, "Base price is required"),
    completionDate: z.any(),
    propertyType: z.enum(["RESIDENTIAL", "COMMERCIAL", "LAND"]),
    developmentStage: z.enum(["PLANNING", "ONGOING", "COMPLETED"]),
    additionalFees: z.array(
      z.object({
        label: z.string().min(1, "Label is required"),
        amount: z.number().min(0, "Amount must be positive"),
      }),
    ),
  })
  .refine(
    (data) => {
      if (data.developmentStage !== "COMPLETED") {
        return (
          !!data.ExpectedCompletionDate &&
          data.ExpectedCompletionDate.length > 0
        );
      }
      return true;
    },
    {
      message: "Expected completion date is required",
      path: ["ExpectedCompletionDate"],
    },
  );

export type DocPropsFormValues = z.infer<typeof docPropsSchema>;

export const docPropsResolver = zodResolver(docPropsSchema);
