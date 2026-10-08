export const CATEGORY_MAP: Record<string, string> = {
  'bowling-analytics': 'Bowling Analytics',
  'batting-mechanics': 'Batting Mechanics',
  'tactical-theory': 'Tactical Theory',
  'data-science': 'Data Science',
  'equipment-physics': 'Equipment Physics',
};

export const FORMAT_MAP: Record<string, string> = {
  'test-match': 'Test Match',
  't20-ipl': 'T20 & IPL',
  'universal': 'Universal',
};

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/ & /g, '-')
    .replace(/ /g, '-');
}

export function formatToSlug(format: string): string {
  return format
    .toLowerCase()
    .replace(/ & /g, '-')
    .replace(/ /g, '-');
}
