import { ArrowLeft, Heart, Share2, MapPin, Calendar, Syringe, User, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface PetDetailsPageProps {
  petId: number;
  onNavigate: (page: string) => void;
}

const petDetails = {
  1: {
    name: "Max",
    breed: "Golden Retriever",
    age: "3 months",
    price: "R 8,500",
    location: "Cape Town, Western Cape",
    images: [
      "https://images.unsplash.com/photo-1754499265678-8d5572e61fb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZ29sZGVuJTIwcmV0cmlldmVyJTIwcHVwcHl8ZW58MXx8fHwxNzU5ODU3MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Meet Max, an adorable Golden Retriever puppy with a playful and friendly personality. He loves to play fetch and is great with children. Max has been raised in a loving home and is ready to join his forever family.",
    gender: "Male",
    color: "Golden",
    weight: "8 kg",
    vaccinated: "Yes - Up to date",
    microchipped: "Yes",
    trained: "Basic training",
    seller: {
      name: "Sarah Johnson",
      phone: "+27 123 456 789",
      email: "sarah.j@email.com",
      location: "Cape Town, Western Cape",
    },
  },
};

export function PetDetailsPage({ petId, onNavigate }: PetDetailsPageProps) {
  const pet = petDetails[petId as keyof typeof petDetails] || petDetails[1];

  return (
    <div className="min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 rounded-full"
          onClick={() => onNavigate("landing")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
              <img
                src={pet.images[0]}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="secondary" className="rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4">About {pet.name}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {pet.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Pet Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Breed</p>
                      <p>{pet.breed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Age</p>
                      <p>{pet.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Gender</p>
                      <p>{pet.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Color</p>
                      <p>{pet.color}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Weight</p>
                      <p>{pet.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Vaccinated</p>
                      <div className="flex items-center gap-2">
                        <Syringe className="w-4 h-4 text-secondary" />
                        <p>{pet.vaccinated}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Microchipped</p>
                      <Badge variant="secondary">{pet.microchipped}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Training</p>
                      <p>{pet.trained}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Seller Info */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl text-primary">{pet.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{pet.location}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mb-6">
                  <h4 className="mb-4">Seller Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary rounded-full w-10 h-10 flex items-center justify-center">
                        <User className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p>{pet.seller.name}</p>
                        <p className="text-sm text-muted-foreground">Verified Seller</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{pet.seller.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{pet.seller.email}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <Button className="w-full rounded-full" size="lg">
                    Message Seller
                  </Button>
                  <Button 
                    className="w-full rounded-full" 
                    size="lg"
                    variant="outline"
                  >
                    Adopt Now
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By contacting the seller, you agree to our Terms of Service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
