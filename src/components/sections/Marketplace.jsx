import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, Zap, User, DollarSign, Search, Filter, Tag, PackagePlus, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getStripe } from '../../../frontend/src/lib/stripe';

const ProductCard = ({ product, onPurchase }) => (
  <Card className="glass-effect overflow-hidden hover:shadow-2xl transition-all duration-300 card-interactive flex flex-col">
    <CardHeader className="p-0">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img-replace src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
      </div>
    </CardHeader>
    <CardContent className="p-4 flex-grow">
      <CardTitle className="text-lg font-semibold mb-1 truncate group-hover:text-primary transition-colors">{product.name}</CardTitle>
      <p className="text-sm text-muted-foreground mb-2 truncate">{product.category}</p>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-primary">{product.priceDisplay}</p>
        {product.discount && <span className="text-xs bg-destructive/80 text-destructive-foreground px-2 py-0.5 rounded-full font-semibold">{product.discount} OFF</span>}
      </div>
    </CardContent>
    <CardFooter className="p-4 border-t border-border/20">
      <Button className="w-full neon-glow btn-primary-glow" onClick={() => onPurchase(product)}>
        <CreditCard className="w-4 h-4 mr-2" /> Purchase Now
      </Button>
    </CardFooter>
  </Card>
);

const ListItemModal = ({ isOpen, onOpenChange, setNotifications, currentUser }) => {
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemType, setItemType] = useState('physical');

  const handleListItem = () => {
    if (!itemName || !itemCategory || !itemPrice || !itemDescription) {
      toast({ title: "Missing Fields! 📝", description: "Please fill in all details for your listing.", variant: "destructive" });
      return;
    }
    toast({ title: "Item Listed (Simulated)! 🛍️", description: `${itemName} has been added to your listings (local simulation). Real listing requires backend.` });
    setNotifications(`${currentUser.name} listed "${itemName}" for sale.`, "marketplace");
    onOpenChange(false); 
    setItemName(''); setItemCategory(''); setItemPrice(''); setItemDescription(''); setItemType('physical');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl"><PackagePlus className="w-6 h-6 mr-2 text-primary"/>List a New Item</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin pr-2">
          <div>
            <Label htmlFor="itemName">Item Name</Label>
            <Input id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="E.g. Handcrafted Vase" />
          </div>
          <div>
            <Label htmlFor="itemCategory">Category</Label>
            <Input id="itemCategory" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} placeholder="E.g. Home Decor" />
          </div>
          <div>
            <Label htmlFor="itemPrice">Price (USD)</Label>
            <Input id="itemPrice" type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="E.g. 29.99" />
          </div>
          <div>
            <Label htmlFor="itemDescription">Description</Label>
            <Textarea id="itemDescription" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Describe your item..." className="min-h-[100px]" />
          </div>
           <div>
            <Label htmlFor="itemType">Item Type</Label>
            <select 
              id="itemType" 
              value={itemType} 
              onChange={(e) => setItemType(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background/80 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="physical">Physical Product</option>
              <option value="digital">Digital Asset</option>
              <option value="freelance">Freelance Service</option>
            </select>
          </div>
          <div>
            <Label htmlFor="itemImage">Item Image (Optional)</Label>
            <Button variant="outline" className="w-full mt-1" onClick={() => toast({title: "🚧 Image Upload Not Implemented", description: "Actual image upload needs backend storage."})}>
              Upload Image
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleListItem} className="btn-primary-glow">List Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const Marketplace = ({ setNotifications, currentUser }) => {
  const marketplaces = [
    {
      id: "physical",
      title: "Physical Goods",
      icon: ShoppingCart,
      description: "Discover unique physical products from creators worldwide.",
      color: "text-blue-400",
      sampleProducts: [
        { id: "prod_phys_001", name: "Artisan Leather Wallet", category: "Accessories", priceDisplay: "$49.99", priceId: "price_1PG...", imageUrl: "Handcrafted leather wallet with stitching detail", discount: "15%" },
        { id: "prod_phys_002", name: "Organic Coffee Beans (1kg)", category: "Groceries", priceDisplay: "$22.50", priceId: "price_1PG...", imageUrl: "Bag of freshly roasted organic coffee beans" },
        { id: "prod_phys_003", name: "Smart LED Desk Lamp", category: "Home Office", priceDisplay: "$79.00", priceId: "price_1PG...", imageUrl: "Modern LED desk lamp with adjustable brightness" },
        { id: "prod_phys_004", name: "Yoga Mat Premium", category: "Fitness", priceDisplay: "$35.00", priceId: "price_1PG...", imageUrl: "Eco-friendly premium yoga mat rolled up" },
      ]
    },
    {
      id: "digital",
      title: "Digital Assets",
      icon: Zap,
      description: "Software, e-books, design templates, and online courses.",
      color: "text-purple-400",
      sampleProducts: [
        { id: "prod_digi_001", name: "Pro Video Editing Suite", category: "Software", priceDisplay: "$199.00", priceId: "price_1PG...", imageUrl: "Screenshot of video editing software interface" },
        { id: "prod_digi_002", name: "Ultimate UI/UX Kit", category: "Design Assets", priceDisplay: "$89.00", priceId: "price_1PG...", imageUrl: "Preview of a comprehensive UI kit for designers", discount: "20%" },
        { id: "prod_digi_003", name: "Ebook: Mastering Python", category: "Education", priceDisplay: "$19.99", priceId: "price_1PG...", imageUrl: "Cover of an ebook about Python programming" },
        { id: "prod_digi_004", name: "Stock Photo Bundle", category: "Photography", priceDisplay: "$59.00", priceId: "price_1PG...", imageUrl: "Collage of high-quality stock photos" },
      ]
    },
    {
      id: "freelance",
      title: "Freelance Services",
      icon: User,
      description: "Hire talented freelancers for your projects or offer your skills.",
      color: "text-green-400",
      sampleProducts: [
        { id: "serv_free_001", name: "Custom Logo Design", category: "Graphic Design", priceDisplay: "$150.00", priceId: "price_1PG...", imageUrl: "Portfolio of modern and creative logo designs" },
        { id: "serv_free_002", name: "React Web Development", category: "Programming", priceDisplay: "$75/hour", priceId: "price_1PG...", imageUrl: "Laptop screen showing React code editor" },
        { id: "serv_free_003", name: "SEO Content Writing (5 Articles)", category: "Writing", priceDisplay: "$250.00", priceId: "price_1PG...", imageUrl: "Person writing on a laptop with SEO keywords highlighted" },
        { id: "serv_free_004", name: "Social Media Management", category: "Marketing", priceDisplay: "$300/month", priceId: "price_1PG...", imageUrl: "Dashboard showing social media analytics and engagement" },
      ]
    }
  ];

  const [activeMarketplace, setActiveMarketplace] = useState(marketplaces[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListItemModalOpen, setIsListItemModalOpen] = useState(false);

  const handleMarketplaceClick = (marketplace) => {
    setActiveMarketplace(marketplace);
    setSearchTerm(''); 
    setNotifications(`Exploring ${marketplace.title} marketplace.`, "marketplace");
  };

  const handlePurchase = async (product) => {
    // TODO: Integrate Stripe.js for real payment flow
    try {
      // Example: Call backend to create payment intent (amount should be fetched from product info)
      const res = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000, currency: 'usd' }) // Replace with real amount
      });
      const data = await res.json();
      if (data.clientSecret) {
        const stripe = await getStripe();
        const { error } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: { /* TODO: collect card details using Stripe Elements */ },
          },
        });
        if (error) {
          toast({ title: 'Payment Error', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'Payment Success', description: 'Your payment was successful!', variant: 'default' });
        }
      } else {
        toast({ title: 'Payment Error', description: data.error || 'Could not create payment intent.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network Error', description: 'Could not connect to payment API.', variant: 'destructive' });
    }
  };
  
  const handleGenericClick = (featureName) => {
    toast({ title: `🚧 ${featureName} Coming Soon!`, description: "This feature is under development. Check back later! 🚀" });
    setNotifications(`${featureName} interaction attempted.`, "system");
  };

  const filteredProducts = activeMarketplace.sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <ListItemModal isOpen={isListItemModalOpen} onOpenChange={setIsListItemModalOpen} setNotifications={setNotifications} currentUser={currentUser} />
      <div className="text-center space-y-2">
        <motion.h1 
          className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          RG Fling Marketplace
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover products, assets, and services. Secure payments via Stripe.
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 sticky top-16 lg:top-0 bg-background/80 backdrop-blur-md z-30 py-4 px-1 -mx-1 rounded-b-lg shadow-sm">
        {marketplaces.map((market) => (
          <Button
            key={market.id}
            variant={activeMarketplace.id === market.id ? "default" : "outline"}
            className={`flex-1 md:flex-none rounded-lg ${activeMarketplace.id === market.id ? 'btn-primary-glow shadow-md' : 'hover:bg-accent/70'}`}
            onClick={() => handleMarketplaceClick(market)}
          >
            <market.icon className={`w-5 h-5 mr-2 ${market.color}`} />
            {market.title}
          </Button>
        ))}
      </div>
      
      <div className="glass-effect rounded-xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder={`Search in ${activeMarketplace.title}...`}
              className="pl-11 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => handleGenericClick("Marketplace Filters")} className="rounded-lg">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
          <Button className="neon-glow btn-primary-glow rounded-lg" onClick={() => setIsListItemModalOpen(true)}>
            <Tag className="w-4 h-4 mr-2" /> List an Item
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMarketplace.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-1 flex items-center">
              <activeMarketplace.icon className={`w-7 h-7 mr-3 ${activeMarketplace.color}`} />
              {activeMarketplace.title}
            </h2>
            <p className="text-muted-foreground mb-6">{activeMarketplace.description}</p>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <ProductCard product={product} onPurchase={handlePurchase} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          <span>Secure Payments & Fees</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-1 text-base">Transaction Fees</h4>
            <p className="text-muted-foreground">A competitive 3% fee is applied to all sales and transactions on the platform. This helps us maintain and improve RG Fling for everyone.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-base">Payment Processing</h4>
            <p className="text-muted-foreground">Secure payments are processed via Stripe. We do not store your credit card information. RGX Coins are used for platform-specific rewards and activities.</p>
          </div>
        </div>
         <Button variant="link" className="mt-4 text-primary" onClick={() => handleGenericClick("Payment System Details")}>Learn more about payments & security</Button>
      </div>
    </div>
  );
};

export default Marketplace;
