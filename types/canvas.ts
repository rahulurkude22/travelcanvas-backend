export interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: Record<string, any>;
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  zoom: number;
  canvasSize: {
    width: number;
    height: number;
  };
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region?: string;
  description?: string;
  cover_image_url?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  currency?: string;
  cost_level: 'budget' | 'moderate' | 'luxury';
  safety_rating?: number;
}

export interface ActivityType {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface EnhancedActivity {
  id?: string;
  activity_type_id: string;
  destination_id?: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  estimated_cost?: number;
  currency?: string;
  rating?: number;
  difficulty_level?: 'easy' | 'moderate' | 'hard';
  booking_required?: boolean;
  booking_url?: string;
  location_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
  notes?: string;
  order_index: number;
}

export interface EnhancedItineraryDay {
  id: string;
  day_number: number;
  title: string;
  description?: string;
  destination_id?: string;
  accommodation_name?: string;
  accommodation_address?: string;
  accommodation_cost?: number;
  transportation_info?: any;
  meals_info?: any;
  day_total_cost?: number;
  activities: EnhancedActivity[];
}

export interface EnhancedItineraryData {
  id?: string;
  title: string;
  description?: string;
  destination: string;
  duration_days: number;
  cover_image_url?: string;
  total_estimated_cost?: number;
  difficulty_level?: 'easy' | 'moderate' | 'hard';
  group_size_min?: number;
  group_size_max?: number;
  age_restriction?: string;
  season_best?: string[];
  includes?: string[];
  excludes?: string[];
  days: EnhancedItineraryDay[];
}

// Legacy types for backward compatibility
export interface Activity {
  id?: string;
  type: string;
  name: string;
  description: string;
  time: string;
  location: string;
  duration: string;
  cost: string;
}

export interface ItineraryDay {
  id: string;
  day_number: number;
  title: string;
  description: string;
  activities: Activity[];
}

export interface ItineraryData {
  title: string;
  destination: string;
  duration_days: number;
  description: string;
  days: ItineraryDay[];
}
