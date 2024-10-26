export interface Location {
  id: number;
  name: string;
  type: 'winery' | 'brewery' | 'cidery' | 'distillery';
  rating: number;
  address: string;
  lat: number;
  lng: number;
  specialties: string[];
  lake: string | null;
  tags: string[];
  website: string;
  imagePath: string;
}
