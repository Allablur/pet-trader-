import { Search, MapPin, DollarSign, Dog, Cat, Bird, Fish, Heart, Shield, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface LandingPageProps {
  onNavigate: (page: string, petId?: number) => void;
}

const featuredPets = [
  {
    id: 1,
    name: "Max",
    breed: "Golden Retriever",
    age: "3 months",
    price: "R 8,500",
    location: "Cape Town, Western Cape",
    image: "https://images.unsplash.com/photo-1754499265678-8d5572e61fb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZ29sZGVuJTIwcmV0cmlldmVyJTIwcHVwcHl8ZW58MXx8fHwxNzU5ODU3MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    type: "dog",
    featured: true,
  },
  {
    id: 2,
    name: "Luna",
    breed: "Persian Cat",
    age: "1 year",
    price: "R 5,000",
    location: "Johannesburg, Gauteng",
    image: "https://images.unsplash.com/photo-1653460876011-c53972ced1c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzaWFuJTIwY2F0JTIwcGV0fGVufDF8fHx8MTc1OTkyMTAxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    type: "cat",
  },
  {
    id: 3,
    name: "Rio",
    breed: "Macaw Parrot",
    age: "2 years",
    price: "R 12,000",
    location: "Durban, KwaZulu-Natal",
    image: "https://images.unsplash.com/photo-1700048802079-ec47d07f7919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJyb3QlMjBiaXJkJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU5ODQzNDcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    type: "bird",
  },
  {
    id: 4,
    name: "Snowball",
    breed: "Holland Lop Rabbit",
    age: "6 months",
    price: "R 1,800",
    location: "Pretoria, Gauteng",
    image: "https://images.unsplash.com/photo-1652567954502-6c6877f94b9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjByYWJiaXQlMjBidW5ueXxlbnwxfHx8fDE3NTk4MjA5NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    type: "other",
  },
  {
    id: 5,
    name: "Buddy",
    breed: "Beagle",
    age: "2 years",
    price: "R 6,500",
    location: "Port Elizabeth, Eastern Cape",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFnbGUlMjBkb2clMjBoYXBweXxlbnwxfHx8fDE3NTk4NTk1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    type: "dog",
  },
  {
    id: 6,
    name: "Whiskers",
    breed: "Tabby Cat",
    age: "4 months",
    price: "Free Adoption",
    location: "Bloemfontein, Free State",
    image: "https://images.unsplash.com/photo-1673339361347-06ce4ba6e1a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjB0YWJieSUyMGNhdHxlbnwxfHx8fDE3NTk5MjEwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    type: "cat",
    featured: true,
  },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/30 to-accent/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl mb-6">Find Your Perfect Pet Companion</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with loving pets across South Africa. Buy, sell, or adopt your new best friend today.
            </p>
            <Button size="lg" className="rounded-full px-8">
              Browse Pets
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Pet Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">
                    <div className="flex items-center gap-2">
                      <Dog className="w-4 h-4" />
                      Dogs
                    </div>
                  </SelectItem>
                  <SelectItem value="cat">
                    <div className="flex items-center gap-2">
                      <Cat className="w-4 h-4" />
                      Cats
                    </div>
                  </SelectItem>
                  <SelectItem value="bird">
                    <div className="flex items-center gap-2">
                      <Bird className="w-4 h-4" />
                      Birds
                    </div>
                  </SelectItem>
                  <SelectItem value="fish">
                    <div className="flex items-center gap-2">
                      <Fish className="w-4 h-4" />
                      Fish
                    </div>
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="western-cape">Western Cape</SelectItem>
                  <SelectItem value="gauteng">Gauteng</SelectItem>
                  <SelectItem value="kwazulu-natal">KwaZulu-Natal</SelectItem>
                  <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                  <SelectItem value="free-state">Free State</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Adoption</SelectItem>
                  <SelectItem value="0-2000">R 0 - R 2,000</SelectItem>
                  <SelectItem value="2000-5000">R 2,000 - R 5,000</SelectItem>
                  <SelectItem value="5000-10000">R 5,000 - R 10,000</SelectItem>
                  <SelectItem value="10000+">R 10,000+</SelectItem>
                </SelectContent>
              </Select>

              <Button className="rounded-full">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Featured Pets Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-4">Featured Pets</h2>
          <p className="text-muted-foreground">
            Meet some of our adorable pets waiting for their forever homes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPets.map((pet) => (
            <Card 
              key={pet.id} 
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onNavigate("pet-details", pet.id)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {pet.featured && (
                  <Badge className="absolute top-3 right-3 bg-primary">
                    Featured
                  </Badge>
                )}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 left-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="mb-2">{pet.name}</h3>
                <p className="text-muted-foreground mb-3">{pet.breed}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Age: {pet.age}</span>
                  <span className="text-primary">{pet.price}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{pet.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="rounded-full">
            View All Pets
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="mb-3">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Verified sellers and buyers for your peace of mind
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="mb-3">Ethical Adoption</h3>
              <p className="text-muted-foreground">
                Supporting responsible pet ownership across South Africa
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="mb-3">Trusted Community</h3>
              <p className="text-muted-foreground">
                Join thousands of happy pet owners nationwide
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
