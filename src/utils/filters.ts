import { CrudFilters, LogicalFilter } from "@refinedev/core";
import dayjs from "../libs/dayjs";

type Operator = LogicalFilter["operator"];

/**
 * Filters that will be applied to the query params.
 * The key is the operator and the value is an array of fields.
 * For default, the field is not specified will be filtered it `eq` operator.
 * @example: { contains: ["title", "description"] }
 */
export const applyFilters = (
  params: Record<string, any>,
  filters: Partial<Record<Operator, string[]>>
) => {
  const refineFilters: CrudFilters = [];

  Object.keys(filters).forEach((key) => {
    const fields = filters[key as Operator];

    if (fields) {
      fields.forEach((field) => {
        let value = params[field];
        if (!value) return;
        delete params[field];

        if (Array.isArray(value)) {
          if (value.length > 0 && dayjs.isDayjs(value[0])) {
            refineFilters.push({
              field,
              operator: "gte",
              value: value[0].toISOString(),
            });
            refineFilters.push({
              field,
              operator: "lte",
              value: value[1].toISOString(),
            });

            return;
          }
        }

        if (dayjs.isDayjs(value)) {
          value = value.toISOString();
        }

        refineFilters.push({
          field,
          operator: key as Operator,
          value,
        });
      });
    }
  });

  Object.keys(params).forEach((key) => {
    if (params[key]) {
      refineFilters.push({
        field: key,
        operator: "eq",
        value: params[key],
      });
    }
  });

  return refineFilters;
};
