import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { projectId } from "../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface ListingFormProps {
  onNavigate: (page: string) => void;
  accessToken: string | null;
  currentUser: any;
}

export function ListingForm({ onNavigate, accessToken, currentUser }: ListingFormProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    category: "",
    age: "",
    price: "",
    location: "",
    description: "",
    healthInfo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = () => {
    // Mock image upload - in real app would handle file upload
    const mockImage = "https://images.unsplash.com/photo-1754499265678-8d5572e61fb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZ29sZGVuJTIwcmV0cmlldmVyJTIwcHVwcHl8ZW58MXx8fHwxNzU5ODU3MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080";
    if (uploadedImages.length < 5) {
      setUploadedImages([...uploadedImages, mockImage]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      toast.error("Please sign in to create a listing");
      onNavigate("auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const petData = {
        ...formData,
        image: uploadedImages[0] || null,
        images: uploadedImages,
        category: formData.category || 'dog',
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5abd33b1/pets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(petData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create listing');
      }

      const data = await response.json();
      console.log('Pet listing created:', data);
      
      toast.success("Listing published successfully!");
      onNavigate("landing");
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || "Failed to publish listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6 rounded-full"
          onClick={() => onNavigate("landing")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>List Your Pet</CardTitle>
            <p className="text-muted-foreground">
              Fill in the details below to create a listing for your pet
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <Label>Pet Photos</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload up to 5 photos of your pet
                </p>
                <div className="grid grid-cols-5 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={image} alt={`Pet ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 5 && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 bg-muted/30"
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Max" 
                    required 
                    className="rounded-full"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Pet Type *</Label>
                  <Select 
                    required
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger id="type" className="rounded-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="fish">Fish</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="breed">Breed *</Label>
                  <Input 
                    id="breed" 
                    placeholder="e.g., Golden Retriever" 
                    required 
                    className="rounded-full"
                    value={formData.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input 
                    id="age" 
                    placeholder="e.g., 3 months" 
                    required 
                    className="rounded-full"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select required>
                    <SelectTrigger id="gender" className="rounded-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" placeholder="e.g., Golden" className="rounded-full" />
                </div>
              </div>

              {/* Health & Training */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vaccinated">Vaccinated</Label>
                  <Select>
                    <SelectTrigger id="vaccinated" className="rounded-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes - Up to date</SelectItem>
                      <SelectItem value="partial">Partially</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="microchipped">Microchipped</Label>
                  <Select>
                    <SelectTrigger id="microchipped" className="rounded-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="trained">Training Level</Label>
                  <Select>
                    <SelectTrigger id="trained" className="rounded-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No training</SelectItem>
                      <SelectItem value="basic">Basic training</SelectItem>
                      <SelectItem value="advanced">Advanced training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (R) *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="e.g., 5000 (or 0 for free adoption)" 
                    required 
                    className="rounded-full"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g., Cape Town, Western Cape" 
                    required 
                    className="rounded-full"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell potential buyers about your pet's personality, behavior, and any special requirements..." 
                  required 
                  className="rounded-lg min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="healthInfo">Health Information</Label>
                <Textarea 
                  id="healthInfo" 
                  placeholder="Include vaccination records, medical history, and any health concerns..." 
                  className="rounded-lg min-h-[100px]"
                  value={formData.healthInfo}
                  onChange={(e) => handleInputChange('healthInfo', e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-full"
                  onClick={() => onNavigate("landing")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 rounded-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
