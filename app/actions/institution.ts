"use server";

import actionWrapper from "../lib/actionWrapper";
import { searchInstitutionOptions } from "../lib/institution";
import { parseOrThrow } from "../lib/validator/global";
import { SearchInstitutionForm, SearchInstitutionValidator } from "../lib/validator/institution";

export const searchInstitutions = actionWrapper(async (formData: SearchInstitutionForm) => {
  const { query, kind } = parseOrThrow(SearchInstitutionValidator, formData);
  return searchInstitutionOptions(query, kind);
});
