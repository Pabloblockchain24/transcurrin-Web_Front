/*import styles*/
import "./TransitoMaritimo.css"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, IconButton, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { TablePagination } from '@mui/material';

/*import context*/
import { useIntranet } from "../../../context/IntranetContext"

/*import components*/
import { useEffect, useState } from "react";

/*import utils*/
import { diasEnPuerto } from "../../../utils/calculationsTransito"

function TransitoMaritimo() {

    const { getServices, services } = useIntranet()
    useEffect(() => {
        async function loadServices() {
            await getServices()
        }
        loadServices()
    }, [])


    const transitoMaritimo = services.filter(servicio => {
        return diasEnPuerto(servicio.eta) < 0
    });

    if (transitoMaritimo.length === 0) return (<div className='servicesNotFound'><h1> No hay unidades en tránsito marítimo a la fecha.</h1></div>)

    const columns = [
        { id: 'Carpeta', label: 'CARPETA' },
        { id: 'Nave', label: 'NAVE' },
        { id: 'Unidad', label: 'UNIDAD' },
        { id: 'Eta', label: 'ETA' },
        { id: 'Tipo', label: 'TIPO' },
        { id: 'Demurrage', label: 'DEMURRAGE' },
        { id: 'DiasEnPuerto', label: 'DIAS EN PUERTO' },
    ];

    function createData(Carpeta, Nave, Unidad, Eta, Tipo, Demurrage, DiasEnPuerto) {
        return { Carpeta, Nave, Unidad, Eta, Tipo, Demurrage, DiasEnPuerto };
    }

    const rows = [
    ];

    const [filterValues, setFilterValues] = useState({
        Carpeta: '',
        Nave: '',
        Unidad: '',
        Eta: '',
        Tipo: '',
        Demurrage: '',
        DiasEnPuerto: '',
    });

    const [filterTexts, setFilterTexts] = useState({
        Carpeta: 'Carpeta',
        Nave: 'Nave',
        Unidad: 'Unidad',
        Eta: 'ETA',
        Tipo: 'Tipo',
        Demurrage: 'Demurrage',
        DiasEnPuerto: 'Días en Puerto',
    });



    const uniqueValues = (column) => {
        return [...new Set(rows.map((row) => row[column]))];
    };
    const [openFilter, setOpenFilter] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterColumn, setFilterColumn] = useState('');

    const handleFilterClick = (event, column) => {
        setOpenFilter((prev) => !prev);
        setAnchorEl(anchorEl ? null : event.currentTarget);
        setFilterColumn(column);
    };

    const handleClose = () => {
        setOpenFilter(false);
        setAnchorEl(null);
    };

    const handleColumnFilterChange = (value, column) => {
        let newFilterTexts = { ...filterTexts };
        let newFilterValues = { ...filterValues };
        if (value === 'Todos') {
            newFilterTexts = { ...filterTexts, [column]: column };
            newFilterValues = { ...filterValues, [column]: '' };
        } else {
            newFilterTexts = { ...filterTexts, [column]: value };
            newFilterValues = { ...filterValues, [column]: value };
        }
        setFilterValues(newFilterValues);
        setFilterTexts(newFilterTexts);
        handleClose();
    };

    const filterData = () => {
        let filteredData = [...rows];

        Object.keys(filterValues).forEach((key) => {
            if (filterValues[key]) {
                filteredData = filteredData.filter((row) =>
                    row[key].toLowerCase().includes(filterValues[key].toLowerCase())
                );
            }
        });

        return filteredData;
    };

    const filteredData = filterData();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const slicedRows = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (

        <>
            <TableContainer component={Paper} className='tableTransMar'>
            <Table sx={{ minWidth: 650, '& td, & th': { padding: '0.5rem', textAlign: 'center'  } }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell className='tableCellColumn' key={column.id}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span>{filterTexts[column.id]}</span>
                                        <IconButton
                                            onClick={(e) => handleFilterClick(e, column.id)}
                                            aria-haspopup='true'
                                            aria-controls={openFilter ? 'filter-menu' : undefined}
                                        >
                                            <ArrowDropDownIcon />
                                        </IconButton>
                                    </div>
                                    <Menu
                                        id='filter-menu'
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={openFilter && filterColumn === column.id}
                                        onClose={handleClose}
                                    >
                                        <MenuItem key='todos' onClick={() => handleColumnFilterChange('Todos', column.id)}>
                                            Todos
                                        </MenuItem>


                                        {uniqueValues(column.id).map((option) => (
                                            <MenuItem
                                                key={option}
                                                selected={filterValues[column.id] === option}
                                                onClick={() => handleColumnFilterChange(option, column.id)}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </TableCell>
                            ))}
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {slicedRows.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell className='tableCellRow' key={column.id}>
                                        {row[column.id]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={7} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TableFooter className='tableFooter'>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component='div'
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage='Filas por página'
                    />
                </TableFooter>
            </TableContainer>
        </>

    )
}

export default TransitoMaritimo