interface ColumnsConfig {
  default?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6;

const GRID_BASE_CLASS_MAP: Record<ColumnCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const GRID_SM_CLASS_MAP: Record<ColumnCount, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

const GRID_MD_CLASS_MAP: Record<ColumnCount, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const GRID_LG_CLASS_MAP: Record<ColumnCount, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const MASONRY_BASE_CLASS_MAP: Record<ColumnCount, string> = {
  1: "columns-1",
  2: "columns-2",
  3: "columns-3",
  4: "columns-4",
  5: "columns-5",
  6: "columns-6",
};

const MASONRY_SM_CLASS_MAP: Record<ColumnCount, string> = {
  1: "sm:columns-1",
  2: "sm:columns-2",
  3: "sm:columns-3",
  4: "sm:columns-4",
  5: "sm:columns-5",
  6: "sm:columns-6",
};

const MASONRY_MD_CLASS_MAP: Record<ColumnCount, string> = {
  1: "md:columns-1",
  2: "md:columns-2",
  3: "md:columns-3",
  4: "md:columns-4",
  5: "md:columns-5",
  6: "md:columns-6",
};

const MASONRY_LG_CLASS_MAP: Record<ColumnCount, string> = {
  1: "lg:columns-1",
  2: "lg:columns-2",
  3: "lg:columns-3",
  4: "lg:columns-4",
  5: "lg:columns-5",
  6: "lg:columns-6",
};

function normalizeColumnCount(count: number | undefined, fallback: number): ColumnCount {
  if (!count) return fallback as ColumnCount;
  const rounded = Math.round(count);
  if (rounded < 1) return 1;
  if (rounded > 6) return 6;
  return rounded as ColumnCount;
}

export function getResponsiveColumnClasses(columns: ColumnsConfig = {}) {
  const defaultCount = normalizeColumnCount(columns.default, 1);
  const smCount = normalizeColumnCount(columns.sm ?? columns.default, defaultCount);
  const mdCount = normalizeColumnCount(columns.md ?? columns.sm ?? columns.default, defaultCount);
  const lgCount = normalizeColumnCount(
    columns.lg ?? columns.md ?? columns.sm ?? columns.default,
    defaultCount,
  );

  return {
    gridClassNames: [
      GRID_BASE_CLASS_MAP[defaultCount],
      GRID_SM_CLASS_MAP[smCount],
      GRID_MD_CLASS_MAP[mdCount],
      GRID_LG_CLASS_MAP[lgCount],
    ].join(" "),
    masonryClassNames: [
      MASONRY_BASE_CLASS_MAP[defaultCount],
      MASONRY_SM_CLASS_MAP[smCount],
      MASONRY_MD_CLASS_MAP[mdCount],
      MASONRY_LG_CLASS_MAP[lgCount],
    ].join(" "),
  };
}
