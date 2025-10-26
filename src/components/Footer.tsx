import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="mb-4">About Pet Trader</h3>
            <p className="text-muted-foreground">
              South Africa's trusted marketplace for finding your perfect pet companion.
            </p>
          </div>

          <div>
            <h4 className="mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Browse Pets</li>
              <li className="hover:text-primary cursor-pointer transition-colors">List a Pet</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Adoption Guide</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Safety Tips</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Contact Us</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+27 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@pettrader.co.za</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Cape Town, South Africa</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <div className="bg-secondary hover:bg-primary transition-colors rounded-full p-2 cursor-pointer">
                <Facebook className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="bg-secondary hover:bg-primary transition-colors rounded-full p-2 cursor-pointer">
                <Instagram className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="bg-secondary hover:bg-primary transition-colors rounded-full p-2 cursor-pointer">
                <Twitter className="w-5 h-5 text-secondary-foreground" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; 2025 Pet Trader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
