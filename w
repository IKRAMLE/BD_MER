import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Bell, Search, ChevronLeft, ChevronRight, 
  Compass, TrendingUp, User, Heart, Calendar, 
  Plus, LogOut, Package, ArrowUpDown, Edit, Trash 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';

const mockProductService = {
  getUserProducts: () => {
    const productsJSON = localStorage.getItem('userProducts');
    return productsJSON ? JSON.parse(productsJSON) : [];
  },
  
  addProduct: (productData) => {
    const products = mockProductService.getUserProducts();
    const newProduct = {
      id: uuidv4(),
      ...productData,
      price: parseFloat(productData.price)
    };
    
    const updatedProducts = [...products, newProduct];
    localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
    return newProduct;
  },
  
  updateProduct: (productId, productData) => {
    const products = mockProductService.getUserProducts();
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          ...productData,
          price: parseFloat(productData.price)
        };
      }
      return product;
    });
    
    localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
    return updatedProducts.find(p => p.id === productId);
  },
  
  deleteProduct: (productId) => {
    const products = mockProductService.getUserProducts();
    const updatedProducts = products.filter(product => product.id !== productId);
    localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
    return true;
  }
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("/dashboard");
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'wheelchair',
    price: '',
    availability: 'available',
    condition: 'new',
    location: '',
    imageUrl: ''
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const menuItems = [
    { icon: Compass, text: "Dashboard", path: "/dashboard" },
    { icon: TrendingUp, text: "My Equipment", path: "/my-equipment" },
    { icon: User, text: "Profile", path: "/profile" },
    { icon: Heart, text: "Favorites", path: "/favorites" },
    { icon: Calendar, text: "Bookings", path: "/bookings" },
  ];

  useEffect(() => {
    setActiveMenuItem(location.pathname);
    
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
      
      const loadProducts = async () => {
        try {
          const userProducts = mockProductService.getUserProducts();
          setProducts(userProducts);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load products",
            variant: "destructive",
          });
        }
      };
      
      loadProducts();
    } else {
      navigate('/login');
      toast({
        title: "Authentication required",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      });
    }
    
    if (searchParams.get('action') === 'add') {
      setIsAddDialogOpen(true);
    }
  }, [navigate, toast, searchParams, location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setActiveMenuItem(path);
  };

  const handleAddEquipment = () => {
    setIsAddDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = mockProductService.addProduct(formData);
      setProducts([...products, newProduct]);
      setFormData({
        name: '',
        description: '',
        category: 'wheelchair',
        price: '',
        availability: 'available',
        condition: 'new',
        location: '',
        imageUrl: ''
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const updatedProduct = mockProductService.updateProduct(selectedProduct.id, formData);
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      mockProductService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      availability: product.availability,
      condition: product.condition,
      location: product.location,
      imageUrl: product.imageUrl
    });
    setIsEditDialogOpen(true);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  if (!isLoggedIn || !userData) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex h-screen bg-medical-50 overflow-hidden">
      <div 
        className={`bg-gradient-to-b from-medical-800 to-medical-900 text-white transition-all duration-300 fixed h-full z-40 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-medical-700 px-4">
          <h1 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>MediShare</h1>
          {!isSidebarOpen && <Compass size={28} />}
        </div>
        
        <nav className="flex flex-col p-3 space-y-1 mt-4">
          {menuItems.map((item) => (
            <div
              key={item.text}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                activeMenuItem === item.path 
                  ? "bg-medical-700 text-white" 
                  : "text-medical-100 hover:bg-medical-700/50"
              }`}
              onClick={() => handleMenuClick(item.path)}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className={`${!isSidebarOpen && "hidden"} whitespace-nowrap`}>{item.text}</span>
            </div>
          ))}
          
          <div 
            className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer text-medical-100 hover:bg-medical-700/50 mt-2"
            onClick={handleAddEquipment}
          >
            <Plus size={20} className="flex-shrink-0" />
            <span className={`${!isSidebarOpen && "hidden"}`}>Add Equipment</span>
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-medical-700">
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-3 text-red-400 hover:text-red-300 p-3 rounded-lg w-full hover:bg-medical-700/50"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`${!isSidebarOpen && "hidden"}`}>Log Out</span>
          </button>
          
          {isSidebarOpen && (
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-medical-700 flex items-center justify-center overflow-hidden">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold">{userData?.email?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userData?.email}</span>
                <span className="text-xs text-medical-200">User</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 rounded-full hover:bg-medical-50 transition-colors" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
            </button>
            <h2 className="text-xl font-medium text-medical-900">Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-medical-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment..."
                className="bg-medical-50 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-medical-500 border-none text-sm"
              />
            </div>
            
            <button className="relative p-2 rounded-full hover:bg-medical-50">
              <Bell size={22} className="text-medical-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="w-9 h-9 rounded-full bg-medical-700 flex items-center justify-center text-white cursor-pointer shadow-sm">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-base font-bold">{userData?.email?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-medical-900">My Equipment</h1>
              <p className="text-medical-500 mt-1">Manage your medical equipment listings</p>
            </div>
            
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-medical-600 hover:bg-medical-700"
            >
              <Plus size={18} className="mr-1" />
              Add New Equipment
            </Button>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-medical-300" />
              <h3 className="text-xl font-medium text-medical-800 mb-2">No equipment found</h3>
              <p className="text-medical-500 mb-6 max-w-md mx-auto">You haven't added any medical equipment yet. Add your first item to start renting it out.</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-medical-600 hover:bg-medical-700"
              >
                <Plus size={18} className="mr-1" />
                Add Your First Equipment
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 overflow-hidden bg-medical-100">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-medical-100 text-medical-300">
                        <Package size={48} />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-lg text-medical-900 line-clamp-1">{product.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.availability === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.availability === 'available' ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    
                    <p className="text-medical-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-medical-900 font-bold">
                        {product.price} MAD<span className="text-xs font-normal text-medical-500">/day</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditDialog(product)}
                          className="p-2 rounded-lg text-medical-600 hover:bg-medical-50"
                        >
                          <Edit size={18} />
                        </button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="p-2 rounded-lg text-red-500 hover:bg-red-50">
                              <Trash size={18} />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Medical Equipment</DialogTitle>
            <DialogDescription>
              Enter the details of the medical equipment you want to share.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select 
                name="category" 
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheelchair">Wheelchair</SelectItem>
                  <SelectItem value="hospital_bed">Hospital Bed</SelectItem>
                  <SelectItem value="oxygen">Oxygen Equipment</SelectItem>
                  <SelectItem value="mobility">Mobility Aid</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price (MAD/day)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">Condition</Label>
              <Select 
                name="condition" 
                value={formData.condition}
                onValueChange={(value) => handleSelectChange('condition', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like_new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availability" className="text-right">Availability</Label>
              <Select 
                name="availability" 
                value={formData.availability}
                onValueChange={(value) => handleSelectChange('availability', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddProduct} className="bg-medical-600 hover:bg-medical-700">Add Equipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Medical Equipment</DialogTitle>
            <DialogDescription>
              Update the details of your medical equipment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">Category</Label>
              <Select 
                name="category" 
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheelchair">Wheelchair</SelectItem>
                  <SelectItem value="hospital_bed">Hospital Bed</SelectItem>
                  <SelectItem value="oxygen">Oxygen Equipment</SelectItem>
                  <SelectItem value="mobility">Mobility Aid</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">Price (MAD/day)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-condition" className="text-right">Condition</Label>
              <Select 
                name="condition" 
                value={formData.condition}
                onValueChange={(value) => handleSelectChange('condition', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like_new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-availability" className="text-right">Availability</Label>
              <Select 
                name="availability" 
                value={formData.availability}
                onValueChange={(value) => handleSelectChange('availability', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">Location</Label>
              <Input
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-imageUrl" className="text-right">Image URL</Label>
              <Input
                id="edit-imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditProduct} className="bg-medical-600 hover:bg-medical-700">Update Equipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
                 















// tableau

 {/* Equipment List Section */}
 <div className="bg-white rounded-xl shadow-sm p-6">
 <h2 className="text-xl font-semibold text-[#084b88] mb-4">Your Equipment</h2>
 
 <div className="overflow-x-auto">
   <table className="w-full">
     <thead>
       <tr className="text-left border-b border-[#e0f0fe]">
         <th className="pb-3 text-sm font-medium text-[#108de4]">Name</th>
         <th className="pb-3 text-sm font-medium text-[#108de4]">Status</th>
         <th className="pb-3 text-sm font-medium text-[#108de4]">Price</th>
         <th className="pb-3 text-sm font-medium text-[#108de4]">Actions</th>
       </tr>
     </thead>
     <tbody>
       {equipment.map((item) => (
         <tr key={item.id} className="border-b border-[#e0f0fe]">
           <td className="py-4 text-[#084b88]">{item.name}</td>
           <td className="py-4">
             <span className={`px-3 py-1 rounded-full text-xs ${
               item.status === 'active' 
                 ? 'bg-green-100 text-green-600' 
                 : 'bg-[#f1efee] text-[#958a80]'
             }`}>
               {item.status}
             </span>
           </td>
           <td className="py-4 text-[#084b88]">{item.price} DH</td>
           <td className="py-4">
             <button className="text-[#0070cc] hover:text-[#108de4] mr-3">
               <Settings size={16} />
             </button>
             <button className="text-red-400 hover:text-red-500">
               <LogOut size={16} />
             </button>
           </td>
         </tr>
       ))}
     </tbody>
   </table>
 </div>
</div>


//chart



 {/* Stats Overview */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
   <div className="rounded-full p-3 bg-[#e0f0fe] text-[#0070cc] mr-4">
     <Package size={24} />
   </div>
   <div>
     <p className="text-sm text-[#108de4]">Total Equipment</p>
     <p className="text-2xl font-semibold text-[#084b88]">{stats.totalEquipment}</p>
   </div>
 </div>
 
 <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
   <div className="rounded-full p-3 bg-green-100 text-green-600 mr-4">
     <TrendingUp size={24} />
   </div>
   <div>
     <p className="text-sm text-[#108de4]">Active Listings</p>
     <p className="text-2xl font-semibold text-[#084b88]">{stats.active}</p>
   </div>
 </div>
 
 <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
   <div className="rounded-full p-3 bg-[#f1efee] text-[#958a80] mr-4">
     <Bookmark size={24} />
   </div>
   <div>
     <p className="text-sm text-[#108de4]">Pending Requests</p>
     <p className="text-2xl font-semibold text-[#084b88]">{stats.pending}</p>
   </div>
 </div>
 
 <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
   <div className="rounded-full p-3 bg-[#bae0fd] text-[#0070cc] mr-4">
     <PieChart size={24} />
   </div>
   <div>
     <p className="text-sm text-[#108de4]">Total Revenue</p>
     <p className="text-2xl font-semibold text-[#084b88]">{stats.revenue} DH</p>
   </div>
 </div>
</div>