export class BullResponseDto {
  id: number;
  earTag: string;
  name: string;
  useType: string;
  origin: string;
  coat: string;
  breed: string;
  ageMonths: number;
  standoutFeature: string | null;
  stats: {
    growth: number;
    calvingEase: number;
    reproduction: number;
    moderation: number;
    carcass: number;
  };
  bullScore: number;
  isFavorite?: boolean;
}
