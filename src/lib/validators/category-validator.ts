import { z } from "zod";


export const CATEGORY_NAME_VALIDATOR = z.string().min(1, "category is required").regex(/^[a-zA-Z0-9_]+$/, "category must be alphanumeric with underscores")