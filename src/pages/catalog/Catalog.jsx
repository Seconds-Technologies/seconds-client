import React, { useRef, useMemo, useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { updateCatalog } from '../../store/actions/hubrise';
import SuccessToast from '../../modals/SuccessToast';
import debounce from 'lodash.debounce';

const Catalog = () => {
	const dispatch = useDispatch();
	const [editCellsCommit, setEditCellsCommit] = useState({});
	const [successMessage, setSuccess] = useState('');
	const [newWeights, mergeWeights] = useState([]);
	const { credentials } = useSelector(state => state['hubriseStore']);
	const { email } = useSelector(state => state['currentUser'].user);

	const debounceSave = useRef(
		debounce(
			(email, data) =>
				dispatch(updateCatalog(email, data)).then(catalog => {
					setSuccess('Catalog updated!');
					mergeWeights([]);
					catalog.products.forEach(prod => prod.variants.forEach(({ ref, weight }) => console.table({ ref, weight })));
				}),
			5000
		)
	).current;

	const products = useMemo(() => {
		let result = [];
		let { categories, products } = credentials.catalog;
		products.forEach(product => {
			product.variants.forEach(variant => {
				let record = {
					id: variant.ref,
					variantName: variant.name ? variant.name : 'N/A',
					variantPrice: variant.price ? variant.price : 'N/A',
					weight: variant.weight !== undefined ? variant.weight : 0.5,
					productName: product.name ? product.name : 'N/A',
					description: product.description ? product.description : 'N/A',
					category: categories.find(item => item.categoryId === product.categoryId).name
				};
				result.push(record);
			});
		});
		return result;
	}, []);

	const handleCellEditCommit = React.useCallback(
		async ({ id, field, value }) => {
			debounceSave.cancel();
			mergeWeights(prevState => {
				console.log(prevState);
				let index = prevState.findIndex(item => item.id === id);
				console.table({ INDEX: index });
				index === -1 ? prevState.push({ id, field, value }) : prevState.splice(index, 1, { id, field, value });
				return [...prevState];
			});
			console.log(newWeights);
			// update the data in the database
			debounceSave(email, newWeights);
			setEditCellsCommit({ id, field, value });
		},
		[newWeights]
	);

	const columns = [
		{ field: 'id', headerName: 'SKU Ref', width: 150 },
		{ field: 'variantName', headerName: 'SKU Name', width: 150 },
		{ field: 'productName', headerName: 'Product Name', width: 200 },
		{ field: 'category', headerName: 'Category', width: 150 },
		{ field: 'description', headerName: 'Description', width: 250 },
		{
			field: 'weight',
			headerName: 'Weight (kg)',
			description: 'Click the cell to assign a new weight',
			type: 'number',
			width: 150,
			editable: true,
			preProcessEditCellProps: params => {
				const MIN = 0;
				const MAX = 9999;
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
			<SuccessToast message={successMessage} toggleShow={setSuccess} />
			<div className='d-flex mx-3 justify-content-between'>
				<h3>Your Hubrise Catalog</h3>
				<button
					className='btn btn-primary'
					disabled={!newWeights.length}
					style={{ width: 100 }}
					onClick={() => {
						debounceSave.cancel();
						dispatch(updateCatalog(email, newWeights)).then(catalog => {
							setSuccess('Catalog updated!');
							mergeWeights([]);
							catalog.products.forEach(prod => prod.variants.forEach(({ ref, weight }) => console.table({ ref, weight })));
						});
					}}
				>
					<span className='btn-text'>Save</span>
				</button>
			</div>
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
						Toolbar: GridToolbar
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
