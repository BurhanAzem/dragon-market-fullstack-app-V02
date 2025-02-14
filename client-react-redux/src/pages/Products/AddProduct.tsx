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
  useTheme
} from "@mui/material";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchCategories } from "../../redux/slices/categorySlice"; // <--- Adjust import to your actual path
// import { ICategory } from "../../models/category";
// import { IProduct } from "../../models/product";
import AddSupplierModal from "../../modals/AddSupplierModal";
import { ICategory } from "../../models/category";
// import AddDiscountModal from "../../modals/AddDiscountModal"; // if needed

// Models for other domain objects
import { ISupplier } from "../../models/supplier";
import { IShelf } from "../../models/shelf";
import { IProduct } from "../../models/product";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode !== 'dark' ? 'whitesmoke' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const textFieldStyle = {
  width: "250px",
  height: '28px',
  border: 'solid 1px gray',
  borderRadius: '4px'
};

const AddProduct: FC = (): ReactElement => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  // Example local states for suppliers/shelfs (if these come from an API, 
  // you'd create slices or fetch them similarly to categories).
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [shelfs, setShelfs] = useState<IShelf[]>([]);

  // Pull categories from Redux (via your categorySlice)
  const categories = useSelector((state: RootState) => state.category.categories);
  const categoryLoading = useSelector((state: RootState) => state.category.loading);
  const categoryError = useSelector((state: RootState) => state.category.error);

  // If your product slice tracks loading, retrieve it similarly
  // const isLoading = useSelector((state: RootState) => state.product.loading);
  // For now, a local fallback:
  const [isLoading, setIsLoading] = useState(false);

  // Local add supplier modal
  const [open, setOpen] = useState<boolean>(false);

  // Product state
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
  });

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handler for uploading images
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setProduct((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...files],
      }));
    }
  };

  // Helper to programmatically trigger file input
  const handleClick = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  // Just an example save
  const handleSaveProduct = () => {
    // dispatch(addProduct(product)) if you have an async thunk or slice action
    console.log("Saving product:", product);
  };

  return (
    <>
      {/* Example: If you had a discount modal, you'd render it here
          <AddDiscountModal open={isDiscountModalOpen} onClose={...} />
      */}
      <AddSupplierModal open={open} setOpen={setOpen} />

      {/* If we are loading categories or there's an error */}
      {categoryLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
          <CircularProgress size="20px" />
        </Box>
      )}
      {categoryError && (
        <Box color="error.main" textAlign="center" mt={2}>
          Error loading categories: {categoryError}
        </Box>
      )}

      {/* If not loading or error, show the form */}
      {!categoryLoading && !categoryError && (
        <Grid container direction="column" mb="40px">
          {/* Product Details */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{ fontSize: { sm: '9pt', md: '10pt' }, fontWeight: '600', backgroundColor: '#f7f7f7' }}
              display="flex"
              flexDirection="column"
              justifyContent="start"
              alignItems="start"
              py="12px"
              px="12px"
            >
              Product details
            </Box>

            <Grid
              container
              spacing={0}
              pb={2}
              justifyContent="center"
              alignItems="center"
              sx={{ backgroundColor: 'white' }}
            >
              {/* Example: Name */}
              <Grid item xs={12} sm={8} md={4}>
                <Box sx={{ mx: '6px', my: '5px' }}>
                  <DemoItem sx={{ padding: '0px' }} label="Name">
                    <TextField
                      variant="outlined"
                      size="small"
                      value={product.name}
                      onChange={(e) =>
                        setProduct((prev: any) => ({ ...prev, name: e.target.value }))
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

              {/* Example: BarCode */}
              <Grid item xs={12} sm={8} md={4}>
                <Box sx={{ mx: '6px', my: '5px' }}>
                  <DemoItem sx={{ padding: '0px' }} label="BarCode">
                    <TextField
                      variant="outlined"
                      size="small"
                      value={product.barCode}
                      onChange={(e) =>
                        setProduct((prev: any) => ({
                          ...prev,
                          barCode: parseFloat(e.target.value) || 0
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
            </Grid>
          </Grid>

          {/* SELECT (Supplier, Category, Shelf) */}
          <Grid item xs={12} sm={6} md={3} mt="15px">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              py="12px"
              px="12px"
              sx={{ fontSize: { sm: '9pt', md: '10pt' }, fontWeight: '600', backgroundColor: '#f7f7f7' }}
            >
              <Box>Select</Box>
            </Box>

            <Grid container spacing={1} pb={2} justifyContent="center" sx={{ backgroundColor: 'white' }}>
              {/* Supplier */}
              <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                <Box sx={{ mx: '6px', my: '20px', display: 'flex' }}>
                  <Autocomplete
                    disablePortal
                    id="supplier-autocomplete"
                    options={suppliers}
                    getOptionLabel={(option) => option.name || "Unnamed"}
                    sx={{
                      width: 'auto',
                      "& .MuiOutlinedInput-root": {
                        paddingY: "0px!important",
                        marginY: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Supplier" size="small" />
                    )}
                    onChange={(event, newValue) => {
                      // Set product.supplierId
                      // (assumes each supplier has an 'id')
                      setProduct((prev: any) => ({
                        ...prev,
                        supplierId: newValue?.id || 0,
                      }));
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{
                      minWidth: '25px',
                      backgroundColor: 'primary.main',
                      fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                      borderRadius: '0px',
                      textTransform: 'inherit',
                      height: '28px',
                      ml: '8px',
                      fontWeight: '600',
                      mt: '11.5px',
                      ":hover": {
                        outlineColor: 'primary.main',
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    onClick={() => setOpen(true)} // open AddSupplierModal
                  >
                    <AddIcon sx={{ fontSize: { xs: '11pt', sm: '12pt', md: '14pt' } }} />
                  </Button>
                </Box>
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                <Box sx={{ mx: '6px', my: '20px', display: 'flex' }}>
                  <Autocomplete
                    disablePortal
                    id="category-autocomplete"
                    options={categories}
                    getOptionLabel={(option: ICategory) => option.name}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    sx={{
                      width: 'auto',
                      "& .MuiOutlinedInput-root": {
                        paddingY: "0px!important",
                        marginY: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Category" size="small" />
                    )}
                    onChange={(event, newValue) => {
                      setProduct((prev: any) => ({
                        ...prev,
                        categoryId: newValue?.id || 0,
                      }));
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
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
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: { xs: '11pt', sm: '12pt', md: '14pt' } }} />
                  </Button>
                </Box>
              </Grid>

              {/* Shelf */}
              <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                <Box sx={{ mx: '6px', my: '20px', display: 'flex' }}>
                  <Autocomplete
                    disablePortal
                    id="shelf-autocomplete"
                    options={shelfs}
                    getOptionLabel={(option) => option.name || "Unnamed"}
                    sx={{
                      width: 'auto',
                      "& .MuiOutlinedInput-root": {
                        paddingY: "0px!important",
                        marginY: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Shelf" size="small" />
                    )}
                    onChange={(event, newValue) => {
                      setProduct((prev: any) => ({
                        ...prev,
                        shelfId: newValue?.id || 0,
                      }));
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
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
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: { xs: '11pt', sm: '12pt', md: '14pt' } }} />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* PRICE & QUANTITY (example) */}
          <Grid item xs={12} sm={6} md={3} mt="15px">
            <Box
              sx={{ fontSize: { sm: '9pt', md: '10pt' }, fontWeight: '600', backgroundColor: '#f7f7f7' }}
              display="flex"
              flexDirection="column"
              justifyContent="start"
              alignItems="start"
              py="12px"
              px="12px"
            >
              Price and Quantity
            </Box>
            <Grid
              container
              spacing={1}
              pb={2}
              justifyContent="center"
              sx={{ backgroundColor: 'white' }}
            >
              {/* Example: Current Wholesale Selling Price */}
              <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                <Box sx={{ mx: '6px', my: '5px' }}>
                  <DemoItem label="Current wholesale selling price">
                    <TextField
                      variant="outlined"
                      size="small"
                      value={product.currentWholeSalSellingPrice}
                      onChange={(e) =>
                        setProduct((prev: any) => ({
                          ...prev,
                          currentWholeSalSellingPrice: parseFloat(e.target.value) || 0,
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
              {/* Add more fields as needed */}
            </Grid>
          </Grid>

          {/* DISCOUNT SECTION: omitted for now, or you can adapt your discount logic here */}

          {/* IMAGES */}
          <Grid item xs={12} sm={8} md={8} mt="15px">
            <Box
              sx={{ fontSize: { sm: '9pt', md: '10pt' }, fontWeight: '600', backgroundColor: '#f7f7f7' }}
              display="flex"
              flexDirection="column"
              py="12px"
              px="12px"
            >
              Upload images
            </Box>
            <Grid
              container
              spacing={1}
              pb={2}
              mb="20px"
              justifyContent="center"
              sx={{ backgroundColor: 'white' }}
            >
              <Grid item xs={12} sm={8} md={8} display="flex" flexDirection="column" alignItems="center">
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
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 40px rgba(0, 0, 0, 0.2)',
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
                {/* Preview uploaded images */}
                {product.images && product.images.length > 0 && (
                  <Grid container width="400px" spacing={2} sx={{ mt: '20px' }}>
                    {product.images.map((image: Blob | MediaSource, index: React.Key | null | undefined) => (
                      <Grid item key={index} xs={8} sm={6} md={4}>
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
            </Grid>
          </Grid>

          {/* SAVE BUTTON */}
          <Grid item xs={12} sm={8} md={8} pb="20px" display="flex" justifyContent="end">
            <Button
              variant="contained"
              color="primary"
              size="small"
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
                },
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
