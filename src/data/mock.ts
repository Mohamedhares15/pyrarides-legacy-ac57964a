import stableCourtyard from "@/assets/stable-courtyard.jpg";
import horsePortrait from "@/assets/horse-portrait.jpg";
import desertRide from "@/assets/desert-ride.jpg";

export type Stable = {
  id: string;
  name: string;
  location: string;
  description: string;
  commissionRate: number;
  image: string;
  established: string;
};

export const stables: Stable[] = [
  { id: "al-nasr", name: "Al-Nasr Heritage Stables", location: "Giza Plateau · West", description: "A century-old family estate raising purebred Arabians within sight of the Great Pyramid.", commissionRate: 0.12, image: stableCourtyard, established: "1924" },
  { id: "saqqara", name: "Saqqara Royal Equestrian", location: "Saqqara · 30 km", description: "Olympic-grade dressage facility set among palm groves and the Step Pyramid.", commissionRate: 0.15, image: desertRide, established: "1987" },
  { id: "house-of-horus", name: "House of Horus", location: "Giza · East Plateau", description: "Boutique stable specialising in sunrise rides and private desert dinners under the stars.", commissionRate: 0.18, image: horsePortrait, established: "2009" },
];

export type Package = {
  id: string;
  stableId: string;
  name: string;
  tagline: string;
  duration: string;
  minPeople: number;
  maxPeople: number;
  price: number;
  hasFood: boolean;
  hasHorseRide: boolean;
  hasTransportation: boolean;
  hasDancingShow: boolean;
  image: string;
};

export const packages: Package[] = [
  { id: "p1", stableId: "al-nasr", name: "The Sunrise Procession", tagline: "First light at the Great Pyramid", duration: "3 hours", minPeople: 1, maxPeople: 4, price: 480, hasFood: true, hasHorseRide: true, hasTransportation: true, hasDancingShow: false, image: desertRide },
  { id: "p2", stableId: "saqqara", name: "Pharaoh's Banquet", tagline: "Private ride & desert dinner", duration: "5 hours", minPeople: 2, maxPeople: 8, price: 1240, hasFood: true, hasHorseRide: true, hasTransportation: true, hasDancingShow: true, image: stableCourtyard },
  { id: "p3", stableId: "house-of-horus", name: "The Horus Initiation", tagline: "Two-day immersion & training", duration: "2 days", minPeople: 1, maxPeople: 2, price: 2890, hasFood: true, hasHorseRide: true, hasTransportation: true, hasDancingShow: false, image: horsePortrait },
];
