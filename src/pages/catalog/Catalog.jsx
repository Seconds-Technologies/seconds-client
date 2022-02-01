import React, { useRef, useMemo, useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { updateCatalog } from '../../store/actions/hubrise';
import SuccessToast from '../../modals/SuccessToast';
import debounce from "lodash.debounce";

const Catalog = () => {
	const dispatch = useDispatch()
	const [editCellsCommit, setEditCellsCommit] = useState({});
	const [successMessage, setSuccess] = useState("");
	const { credentials } = useSelector(state => state['hubriseStore']);
	const { email } = useSelector(state => state['currentUser'].user);

	const debounceSave = useRef(debounce((email, model) => dispatch(updateCatalog(email, model)).then(() => setSuccess("Catalog updated!")), 5000)).current;

	const products = useMemo(() => {
		let result = [];
		let { categories, products } = credentials.catalog;
		products.forEach(product => {
			product.variants.forEach(variant => {
				let record = {
					id: variant.ref,
					variantName: variant.name ? variant.name : "N/A",
					variantPrice: variant.price ? variant.price : "N/A",
					weight: variant.weight ? variant.weight : "CLICK TO ASSIGN WEIGHT",
					productName: product.name ? product.name : "N/A",
					description: product.description ? product.description : "N/A",
					category: categories.find(item => item.categoryId === product.categoryId).name
				};
				result.push(record);
			});
		});
		return result;
	}, []);

	const handleCellEditCommit = React.useCallback(async (params) => {
		debounceSave.cancel()
		console.log(params)
		const { id, field, value } = params;
		// update the data in the database
		debounceSave(email, { id, field, value })
		setEditCellsCommit({ id, field, value });
	}, []);

	const columns = [
		{ field: 'id', headerName: 'SKU Ref', width: 150 },
		{ field: 'variantName', headerName: 'SKU Name', width: 150 },
		{ field: 'productName', headerName: 'Product Name', width: 200 },
		{ field: 'category', headerName: 'Category', width: 150 },
		{ field: 'description', headerName: 'Description', width: 250 },
		{
			field: 'weight',
			headerName: 'Weight (kg)',
			type: 'number',
			width: 200,
			editable: true,
			preProcessEditCellProps: (params) => {
				const MIN = 0
				const MAX = 9999
				const hasError = params.props.value > MAX || params.props.value < MIN;
				return { ...params.props, error: hasError };
			}
		}
	];

	useEffect(() => {
		return () => debounceSave.cancel();
	}, [debounceSave]);

	return (
		<div className='page-container d-flex flex-column bg-light px-2 py-4'>
			<SuccessToast message={successMessage} toggleShow={setSuccess}/>
			<h3 className='ms-3'>Your Hubrise Catalog</h3>
			{credentials.catalog && (
				<DataGrid
					sortingOrder={['desc', 'asc']}
					sortModel={[
						{
							field: 'id',
							sort: 'asc'
						}
					]}
					autoHeight={false}
					className='mt-3 mx-3'
					rows={products}
					columns={columns}
					components={{
						Toolbar: GridToolbar,
					}}
					disableSelectionOnClick
					checkboxSelection
					autoPageSize
					pagination
					onCellEditCommit={handleCellEditCommit}
					experimentalFeatures={{ preventCommitWhileValidating: true }}
				/>
			)}
		</div>
	);
};

export default Catalog;
