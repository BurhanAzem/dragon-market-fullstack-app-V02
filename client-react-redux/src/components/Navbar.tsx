import React, { ReactElement, FC, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  styled,
  useTheme,
} from "@mui/material";

import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks"; 
// ^ If you don't have custom hooks, replace with: import { useDispatch, useSelector } from "react-redux";

// Slices (adjust these imports to match your actual slice filenames)
import { fetchCategories } from "../redux/slices/categorySlice"; 
// ^ Example async thunk in your category slice
import AddSupplierModal from "../modals/AddSupplierModal";

// Models/interfaces
import { ICategory } from "../models/category";
import { IProduct } from "../models/product";
import { IShelf } from "../models/shelf";
import { ISupplier } from "../models/supplier";
import AddDiscountModal from "../modals/AddDiscountModal";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode !== 'dark' ? 'whitesmoke' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// Example styles for text fields, adjust as needed
const textFieldStyle = {
  width: "250px",
  height: '28px',
  border: 'solid 1px gray',
  borderRadius: '4px'
};

const AddProduct: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Load categories via RTK (assuming you have a fetchCategories thunk)
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Pull categories from the store
  const categories: ICategory[] = useAppSelector(
    (state) => state.category.categories
  );
  // If your slice uses something else, adjust accordingly

  // If your product slice tracks loading, you could pull it here
  // For example: const isLoading = useAppSelector((state) => state.product.loading);
  const [isLoading, setIsLoading] = useState(false); // local fallback

  // For suppliers, shelves, etc. 
  // (If you have slices for these, do a similar pattern as categories.)
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [shelfs, setShelfs] = useState<IShelf[]>([]);

  // Track the product form locally
  const [product, setProduct] = useState<IProduct>({
    supplierId: 0,
    shelfId: 0,
    discountId: 0,
    categoryId: 0,
    name: '',
    description: '',
    images: [],
    barCode: 0,
    currentWholeSalePurchasingPrice: 0,
    currentWholeSalSellingPrice: 0,
    currentRetailPurchasingPrice: 0,
    currentRetailSellingPrice: 0,
    quantityOfProductsPresentedForRetail: 0,
    quantityOfProductsPresentedForWholesale: 0,
    minimumQuantityOfProductsPresentedForRetail: 0,
    minimumQuantityOfProductsPresentedForWholesale: 0,
    // discountDto?: { ... } if you have an embedded discount object
  });

  // Local discount modal control
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  // Example: open/close "Add Supplier" modal locally
  const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);

  // Handler for opening discount modal
  const handleOpenDiscountModal = () => {
    setIsDiscountModalOpen(true);
  };

  // Handler for image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      setProduct((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...files],
      }));
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  // For saving your new product - e.g., dispatch an RTK thunk or something
  const handleSaveProduct = () => {
    // dispatch(addProduct(product)) or something similar
    // ...
    console.log("Saving product: ", product);
  };

  // Example UI
  return (
    <>
      {/* If you need to show a discount modal, pass in open + onClose */}
      <AddDiscountModal
        open={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        // Possibly pass in any discount info if needed
      />

      {/* An add supplier modal if needed */}
      <AddSupplierModal
        open={openAddSupplierModal}
        setOpen={setOpenAddSupplierModal}
      />

      {isLoading ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          width='100%'
          height='200px'
        >
          <CircularProgress size='20px' color="inherit" />
        </Box>
      ) : (
        <Grid container direction='column' mb='40px'>
          {/* -- PRODUCT DETAILS -- */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{ fontSize: { sm: '9pt', md: '10pt' }, fontWeight: '600', backgroundColor: '#f7f7f7' }}
              display="flex"
              flexDirection="column"
              justifyContent="start"
              alignItems="start"
              py='12px'
              px='12px'
            >
              Product details
            </Box>

            <Grid
              container
              spacing={0}
              pb={2}
              justifyContent='center'
              alignItems='center'
              sx={{ backgroundColor: 'white' }}
            >
              {/* Name */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ mx: '6px', my: '5px' }}>
                  <DemoItem label="Name">
                    <TextField
                      variant="outlined"
                      size="small"
                      value={product.name}
                      onChange={(e) =>
                        setProduct((prev) => ({ ...prev, name: e.target.value }))
                      }
                      inputProps={{
                        style: {
                          height: '30px',
                          width: '250px',
                          padding: '0 14px',
                        },
                      }}
                    />
                  </DemoItem>
                </Box>
              </Grid>

              {/* BarCode */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ mx: '6px', my: '5px' }}>
                  <DemoItem label="BarCode">
                    <TextField
                      variant="outlined"
                      size="small"
                      value={product.barCode}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          barCode: parseFloat(e.target.value) || 0,
                        }))
                      }
                      inputProps={{
                        style: {
                          height: '30px',
                          width: '250px',
                          padding: '0 14px',
                        },
                      }}
                    />
                  </DemoItem>
                </Box>
              </Grid>
              {/* ... Add more fields as needed ... */}
            </Grid>
          </Grid>

          {/* -- SELECTS (Supplier, Category, Shelf) -- */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              py='12px'
              px='12px'
              sx={{ fontSize: { sm: '9pt', md: '10pt' }, fontWeight: '600', backgroundColor: '#f7f7f7', mt: '15px' }}
            >
              <Box>Select</Box>
            </Box>

            <Grid container spacing={1} pb={2} justifyContent='center' sx={{ backgroundColor: 'white' }}>
              {/* Supplier */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ mx: '6px', my: '20px', display: 'flex' }}>
                  <Autocomplete
                    disablePortal
                    id="supplier-autocomplete"
                    options={suppliers}
                    getOptionLabel={(option) => option.name || "Untitled"} 
                    // adjust field name as needed
                    sx={{
                      width: 250,
                      "& .MuiOutlinedInput-root": {
                        paddingY: "0px!important",
                        marginY: '8px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Supplier" size="small" />
                    )}
                    onChange={(event, value) => {
                      // E.g. store the supplierId
                      setProduct((prev: any) => ({
                        ...prev,
                        supplierId: value?.id || 0,
                      }));
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size='small'
                    sx={{
                      minWidth: '25px',
                      backgroundColor: 'primary.main',
                      fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                      borderRadius: '0px',
                      textTransform: 'inherit',
                      height: '28px',
                      ml: '8px',
                      mt: '11.5px',
                      fontWeight: '600',
                      ":hover": {
                        outlineColor: 'primary.main',
                        backgroundColor: theme.palette.action.hover,
                      }
                    }}
                    onClick={() => setOpenAddSupplierModal(true)}
                  >
                    <AddIcon sx={{ fontSize: { xs: '11pt', sm: '12pt', md: '14pt' } }} />
                  </Button>
                </Box>
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ mx: '6px', my: '20px', display: 'flex' }}>
                  <Autocomplete
                    disablePortal
                    id="category-autocomplete"
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>{option.name}</li>
                    )}
                    sx={{
                      width: 250,
                      "& .MuiOutlinedInput-root": {
                        paddingY: "0px!important",
                        marginY: '8px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Category" size="small" />
                    )}
                    onChange={(event, value) => {
                      setProduct((prev : any) => ({
                        ...prev,
                        categoryId: value?.id || 0
                      }));
                    }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    size='small'
                    sx={{
                      minWidth: '25px',
                      backgroundColor: 'primary.main',
                      fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                      borderRadius: '0px',
                      textTransform: 'inherit',
                      height: '28px',
                      ml: '8px',
                      mt: '11.5px',
                      fontWeight: '600',
                      ":hover": {
                        outlineColor: 'primary.main',
                        backgroundColor: theme.palette.action.hover,
                      }
                    }}
                  >
                    <AddIcon sx={{ fontSize: { xs: '11pt', sm: '12pt', md: '14pt' } }} />
                  </Button>
                </Box>
              </Grid>

              {/* Shelf */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ mx: '6px', my: '20px', display: 'flex' }}>
                  <Autocomplete
                    disablePortal
                    id="shelf-autocomplete"
                    options={shelfs}
                    getOptionLabel={(option) => option.name || "Unnamed shelf"}
                    sx={{
                      width: 250,
                      "& .MuiOutlinedInput-root": {
                        paddingY: "0px!important",
                        marginY: '8px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Shelf" size="small" />
                    )}
                    onChange={(event, value) => {
                      setProduct((prev : any) => ({
                        ...prev,
                        shelfId: value?.id || 0
                      }));
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size='small'
                    sx={{
                      minWidth: '25px',
                      backgroundColor: 'primary.main',
                      fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                      borderRadius: '0px',
                      textTransform: 'inherit',
                      height: '28px',
                      ml: '8px',
                      mt: '11.5px',
                      fontWeight: '600',
                      ":hover": {
                        outlineColor: 'primary.main',
                        backgroundColor: theme.palette.action.hover,
                      }
                    }}
                  >
                    <AddIcon sx={{ fontSize: { xs: '11pt', sm: '12pt', md: '14pt' } }} />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* -- DISCOUNT -- */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              py='12px'
              px='12px'
              sx={{ fontSize: { sm: '9pt', md: '10pt' }, fontWeight: '600', backgroundColor: '#f7f7f7', mt: '15px' }}
            >
              <Box>Discount</Box>
              <Link
                style={{ color: '#16b', fontSize: '12px', cursor: 'pointer' }}
                onClick={handleOpenDiscountModal}
                to={"#"}
              >
                {product.discountDto ? 'Update discount' : 'Add discount'}
              </Link>
            </Box>
            <Grid
              container
              spacing={1}
              p={2}
              justifyContent='center'
              alignItems='center'
              sx={{ backgroundColor: 'white', fontSize: '12px' }}
            >
              <span style={{ marginRight: '20px' }}>
                start at: {product.discountDto?.startDate?.toString() || '-'}
              </span>
              <span style={{ marginRight: '20px' }}>
                end at: {product.discountDto?.endDate?.toString() || '-'}
              </span>
              <span style={{ marginRight: '0px' }}>
                amount: {product.discountDto?.amount?.toString() || '-'}
              </span>
            </Grid>
          </Grid>

          {/* -- IMAGES -- */}
          <Grid item xs={12} sm={8} md={8}>
            <Box
              sx={{ fontSize: { sm: '9pt', md: '10pt' }, fontWeight: '600', backgroundColor: '#f7f7f7', mt: '15px' }}
              display="flex"
              flexDirection="column"
              justifyContent="start"
              alignItems="start"
              py='12px'
              px='12px'
            >
              Upload images
            </Box>
            <Grid
              container
              spacing={1}
              pb={2}
              mb='20px'
              justifyContent='center'
              sx={{ backgroundColor: 'white' }}
            >
              <Grid item xs={12} sm={8} md={8}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box>Upload images for product</Box>
                  <Box
                    sx={{
                      mt: '20px',
                      padding: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.1)',
                      borderRadius: '20px',
                      transition: 'box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow:
                          '0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 40px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                    onClick={handleClick}
                  >
                    <FileUploadIcon sx={{ width: '50px' }} />
                  </Box>
                  <input
                    type="file"
                    id="file-input"
                    style={{ display: 'none' }}
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <Grid container width='400px' spacing={2} sx={{ mt: '20px' }}>
                    {product.images && product.images.length > 0 && (
                      <Grid container spacing={2}>
                        {product.images.map((image, index) => (
                          <Grid item key={index} xs={12} sm={6} md={4}>
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`uploaded ${index}`}
                              style={{ width: '100%', borderRadius: '10px' }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* SAVE BUTTON */}
          <Grid item xs={12} sm={8} md={8} pb='20px' display='flex' justifyContent='end'>
            <Button
              variant="contained"
              color="primary"
              size='small'
              sx={{
                minWidth: '120px',
                backgroundColor: 'primary.main',
                fontSize: { xs: '9pt', sm: '10pt', md: '10pt' },
                borderRadius: '1px',
                textTransform: 'inherit',
                height: '28px',
                ml: '8px',
                fontWeight: '600',
                ":hover": {
                  outlineColor: 'primary.main',
                  backgroundColor: theme.palette.action.hover,
                }
              }}
              onClick={handleSaveProduct}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AddProduct;
