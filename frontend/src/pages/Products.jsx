import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, FormCheck } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { useNavigate, useLocation } from 'react-router-dom';

const Products = ({ searchQuery }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const sectionFromHome = location.state?.section; // Get section state from Home page


  const categories = ['All', ...new Set(products.map(product => product.category))];
  const [availableBrands, setAvailableBrands] = useState([]); // State for brands to display in filter
  const [selectedBrands, setSelectedBrands] = useState([]);


  // Effect to filter products based on selected filters and search query
  useEffect(() => {
    let productsToFilter = products;

    // Apply filter based on section clicked on Home page (placeholder logic)
    if (sectionFromHome) {
      console.log(`Filtering for section: ${sectionFromHome}`);
      // TODO: Add actual filtering logic here based on sectionFromHome (e.g., product.isFeatured)
      // For now, no filtering is applied based on section.
       productsToFilter = productsToFilter.filter(product => {
           // Example placeholder filter: if section is 'electronics', only show electronics
           if (sectionFromHome === 'electronics') return product.category === 'Electronics';
           // Add other section filters here
           return true; // Show all products if no specific section filter matches
       });

       // Reset sectionFromHome state after applying filter once
       // This prevents the filter from being reapplied on subsequent visits or state changes
         navigate(location.pathname, { replace: true, state: {} });
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      productsToFilter = productsToFilter.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      productsToFilter = productsToFilter.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply brand filter
    if (selectedBrands.length > 0) {
        productsToFilter = productsToFilter.filter(product => selectedBrands.includes(product.brand));
    }

    setFilteredProducts(productsToFilter);
  }, [searchQuery, selectedCategory, selectedBrands, sectionFromHome, navigate, location.pathname]); // Keep navigate/location if sectionFromHome logic is needed

   // Effect to update available brands based on category and search query
   useEffect(() => {
       let productsForBrands = products;

       // Apply category filter
       if (selectedCategory !== 'All') {
           productsForBrands = productsForBrands.filter(product => product.category === selectedCategory);
       }

        // Apply search filter (to ensure available brands reflect search)
       if (searchQuery) {
           productsForBrands = productsForBrands.filter(product =>
               product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               product.description.toLowerCase().includes(searchQuery.toLowerCase())
           );
       }

       const brandsForFilter = [...new Set(productsForBrands.map(product => product.brand))].sort();
       setAvailableBrands(brandsForFilter);

        // Remove selected brands that are no longer in the available brands list
       setSelectedBrands(prevSelected => prevSelected.filter(brand => brandsForFilter.includes(brand)));

   }, [selectedCategory, searchQuery, sectionFromHome]); // Depends on category, search, and sectionFromHome


  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    // When category changes, clear selected brands as they might not be relevant
    setSelectedBrands([]);
  };
  
   const handleBrandFilter = (brand) => {
    setSelectedBrands(prevBrands => 
        prevBrands.includes(brand) 
            ? prevBrands.filter(b => b !== brand) 
            : [...prevBrands, brand]
    );
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container className="my-4">
      <Row>
        {/* Left Sidebar for Filters */}
        <Col md={3} className="pe-4 border-end">
          <h5>Filters</h5>

          {/* Category Filter */}
          <div className="mb-4">
            <h6 className="mb-2">Category</h6>
            {categories.map(category => (
              <div key={category} className="form-check small">
                <input
                  className="form-check-input"
                  type="radio"
                  name="categoryFilter"
                  id={`category-${category}`}
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryFilter(category)}
                />
                <label className="form-check-label" htmlFor={`category-${category}`}>
                  {category}
                </label>
              </div>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="mb-4">
              <h6 className="mb-2">Brand</h6>
               {availableBrands.map(brand => (
                <FormCheck
                  key={brand}
                  type="checkbox"
                  id={`brand-${brand}`}
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandFilter(brand)}
                  className="small"
                />
              ))}
          </div>

          {/* Price Filter Placeholder */}
          <div className="mb-4">
            <h6 className="mb-2">Price</h6>
            {/* Add price range filter options here */}
            <p className="small text-muted">Price filter options...</p>
          </div>

          {/* Deals & Discounts Placeholder */}
          <div className="mb-4">
            <h6 className="mb-2">Deals & Discounts</h6>
            {/* Add deals and discounts filter options here */}
             <p className="small text-muted">Deals & Discounts options...</p>
          </div>

           {/* Availability Placeholder */}
           <div className="mb-4">
            <h6>Availability</h6>
            {/* Add availability filter options here */}
             <p className="small text-muted">Availability options...</p>
          </div>

        </Col>

        {/* Right Column for Product Grid */}
        <Col md={9}>
           <h2 className="mb-4">Search Results</h2>
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product.id} sm={6} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }}>
                   <Card.Body className="d-flex flex-column p-3" onClick={() => handleViewDetails(product.id)}>
                      <div style={{ height: '150px', overflow: 'hidden', marginBottom: '10px' }}>
                        <Card.Img
                          variant="top"
                          src={product.image}
                          alt={product.name}
                          style={{ height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <Card.Title className="mb-1 fs-6">{product.name}</Card.Title>
                       {product.brand && <Card.Text className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>by {product.brand}</Card.Text>}

                       {product.rating !== undefined && (
                          <div className="d-flex align-items-center mb-1">
                            <div className="text-warning me-1" style={{ fontSize: '0.9rem' }}>
                              {'★'.repeat(Math.floor(product.rating))}
                              {'☆'.repeat(5 - Math.floor(product.rating))}
                            </div>
                            {/* <small className="text-muted">({product.rating})</small> */}
                          </div>
                       )}

                      {product.price !== undefined && <Card.Text className="h6 mb-1">${product.price.toFixed(2)}</Card.Text>}

                      {product.stock !== undefined && (
                         <small className="text-muted mt-auto">In Stock: {product.stock}</small>
                      )}
                    </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Products; 