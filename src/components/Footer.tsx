
const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Integrations</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Guides</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Support Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">API Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-brand transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-brand font-bold text-xl">UpgradeForLess</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} UpgradeForLess. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
