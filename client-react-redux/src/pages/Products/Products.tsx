import React, { ReactElement, FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Pagination,
  PaginationItem,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import Settings from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/Searchbar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { fetchProducts } from "../../redux/slices/productSlice";
import { IProduct } from "../../models/product";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode !== 'dark' ? 'whitesmoke' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Products: FC = (): ReactElement => {
  const navigate = useNavigate();
  const theme = useTheme();

  // RTK hooks
  const dispatch = useAppDispatch();

  // Pulling state from our product slice
  const products = useAppSelector((state) => state.product.products);
  const isLoading = useAppSelector((state) => state.product.loading);
  const totalPages = useAppSelector((state) => state.product.totalPages);

  // Local states for search/pagination inputs
  const [productName, setProductName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [selfCode, setSelfCode] = useState("");
  const [pageSize, setPageSize] = useState(10);
  // local pageNumber to keep track (you could also rely on your slice state)
  const [pageNumber, setPageNumber] = useState(1);

  // Track which rows are checked
  const [checkedRows, setCheckedRows] = useState<number[]>([]);

  // Build an object to pass to fetchProducts (our async thunk)
  const query = {
    productName,
    categoryName,
    selfCode,
    supplierName,
    pageNumber,
    pageSize,
  };

  // On component mount or when query changes, fetch products
  useEffect(() => {
    dispatch(fetchProducts(query));
  }, [
    dispatch,
    productName,
    categoryName,
    supplierName,
    selfCode,
    pageNumber,
    pageSize
  ]);

  // Handler to toggle a single product row in "checkedRows"
  const RowToCheckedList = (row: IProduct) => {
    setCheckedRows((prev) => {
      const isChecked = prev.includes(row.barCode);
      return isChecked
        ? prev.filter((code) => code !== row.barCode)
        : [...prev, row.barCode];
    });
  };

  // Handler to check/uncheck ALL products
  const allRowsToCheckedList = () => {
    setCheckedRows((prev) => {
      const allBarCodes = products.map((p) => p.barCode);
      const alreadyAllChecked = allBarCodes.every((c) => prev.includes(c));
      return alreadyAllChecked ? [] : allBarCodes;
    });
  };

  // Handler for manual pagination changes (MUI <Pagination />)
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
    dispatch(fetchProducts({ ...query, pageNumber: value }));
  };

  // Handler for refresh button
  const handleRefresh = () => {
    dispatch(fetchProducts(query));
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        border: 'solid 1px #d9d8d8',
        backgroundColor: '#f7f7f7',
        pt: '15px'
      }}
    >
      <Grid container spacing={2} py='0px' pl='16px'>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="start"
          alignItems="center"
          width="100%"
          py='12px'
          px='12px'
        >
          {/* Top row: Title & Buttons */}
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            width="100%"
          >
            <Box>Products</Box>
            <Box display='flex'>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleRefresh}
                sx={{
                  minWidth: '10px',
                  backgroundColor: 'common.white',
                  fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                  borderRadius: '1px',
                  border: 'solid 1px',
                  textTransform: 'inherit',
                  height: '28px',
                  ml: '5px',
                  fontWeight: '600',
                  ":hover": {
                    outlineColor: 'primary.main',
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                <ReplayIcon sx={{ fontSize: { xs: '11pt', sm: '12pt', md: '14pt' } }} />
              </Button>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size='small'
                disabled={checkedRows.length === 0}
                sx={{
                  minWidth: '80px',
                  backgroundColor:
                    checkedRows.length !== 0 ? 'common.white' : '#eef0f2',
                  fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                  borderRadius: '1px',
                  border: 'solid 1px',
                  textTransform: 'inherit',
                  height: '28px',
                  fontWeight: '600',
                  ml: '8px',
                  ":hover": {
                    outlineColor: 'primary.main',
                    backgroundColor:
                      checkedRows.length !== 0
                        ? theme.palette.action.hover
                        : '#eef0f2',
                  }
                }}
                // TODO: Implement a delete handler that calls an async thunk to remove selected products
              >
                <DeleteIcon sx={{ fontSize: { xs: '11pt', sm: '12pt', md: '14pt' } }} />
                Delete
              </Button>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size='small'
                sx={{
                  minWidth: '120px',
                  backgroundColor: 'primary.main',
                  fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
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
                onClick={() => navigate('addProduct', { replace: false })}
              >
                <AddIcon sx={{ fontSize: { xs: '11pt', sm: '12pt', md: '14pt' } }} />
                New product
              </Button>
            </Box>
          </Box>

          {/* Search & Pagination */}
          <Box
            display='flex'
            justifyContent='space-between'
            mt='20px'
            width="100%"
          >
            <Box>
              <SearchBar
                searchPlaceholder="Search about product"
                productName={productName}
                setProductName={setProductName}
              />
            </Box>
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePageChange}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    style={{
                      backgroundColor: 'transparent',
                      fontWeight: '600'
                    }}
                  />
                )}
              />
              <Settings
                sx={{
                  m: 'auto',
                  pl: '4px',
                  width: 15,
                  height: 15,
                  cursor: 'pointer'
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Table */}
        <Grid item xs={12}>
          {isLoading ? (
            <Paper sx={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size='20px' color="inherit" />
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                        fontWeight: '600',
                        p: 0
                      }}
                    >
                      <Checkbox
                        sx={{
                          '& .MuiSvgIcon-root': {
                            width: '16px',
                            height: '16px',
                          },
                        }}
                        onChange={allRowsToCheckedList}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                        fontWeight: '600',
                        p: 0
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                        fontWeight: '600',
                        p: 0
                      }}
                    >
                      BarCode
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                        fontWeight: '600',
                        p: 0
                      }}
                    >
                      Category Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                        fontWeight: '600',
                        p: 0
                      }}
                    >
                      Retail Qty
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                        fontWeight: '600',
                        p: 0
                      }}
                    >
                      Wholesale Qty
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: '7pt', sm: '8pt', md: '9pt' },
                        fontWeight: '600',
                        p: 0
                      }}
                    >
                      Retail Price
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {products.map((row) => (
                    <TableRow key={row.barCode}>
                      <TableCell
                        sx={{
                          fontSize: { xs: '6pt', sm: '7pt', md: '8pt' },
                          fontWeight: 500,
                          p: 0
                        }}
                      >
                        <Checkbox
                          sx={{
                            '& .MuiSvgIcon-root': {
                              width: '16px',
                              height: '16px',
                            },
                          }}
                          checked={checkedRows.includes(row.barCode)}
                          onChange={() => RowToCheckedList(row)}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: '6pt', sm: '7pt', md: '8pt' },
                          fontWeight: 500,
                          p: 0
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: '6pt', sm: '7pt', md: '8pt' },
                          fontWeight: 500,
                          p: 0
                        }}
                      >
                        {row.barCode}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: '6pt', sm: '7pt', md: '8pt' },
                          fontWeight: 500,
                          p: 0
                        }}
                      >
                        {row.categoryDto ? row.categoryDto.name : ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: '6pt', sm: '7pt', md: '8pt' },
                          fontWeight: 500,
                          p: 0
                        }}
                      >
                        {row.quantityOfProductsPresentedForRetail}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: '6pt', sm: '7pt', md: '8pt' },
                          fontWeight: 500,
                          p: 0
                        }}
                      >
                        {row.quantityOfProductsPresentedForWholesale}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: '6pt', sm: '7pt', md: '8pt' },
                          fontWeight: 500,
                          p: 0
                        }}
                      >
                        {row.currentRetailSellingPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Products;
