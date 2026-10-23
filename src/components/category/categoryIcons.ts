import {
  Car,
  CircleEllipsis,
  Clapperboard,
  HandHeart,
  HeartPulse,
  House,
  Plane,
  ShoppingBag,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps the approved Lucide identifiers in src/data/category-icons.json to the
 * icon components (decision D-21). Only these icons are bundled. A test checks
 * that every identifier in the registry has an entry here.
 */
export const CATEGORY_ICONS: Readonly<Record<string, LucideIcon>> = {
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  house: House,
  car: Car,
  clapperboard: Clapperboard,
  'heart-pulse': HeartPulse,
  plane: Plane,
  'hand-heart': HandHeart,
  'circle-ellipsis': CircleEllipsis,
};
