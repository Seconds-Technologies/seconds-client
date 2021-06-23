import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiCall } from "../../api";
import { fetchProducts } from "../../store/actions/shopify";
import "./Products.css";

export default function Products() {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);

    const products = useSelector(state => {
        let allProducts = state["shopifyProducts"];
        return allProducts.map(({ title: name, variants, status, image }) => {
            let { price, product_id: id, inventory_quantity: stock } = variants[0];
            let { src: img } = image;
            return { id, img, stock, name, price, status };
        });
    });
    const { isIntegrated } = useSelector(state => state["shopifyUser"]);
    const { user: { email } } = useSelector(state => state["currentUser"]);

    useEffect(() => {
        dispatch(fetchProducts(email));
    }, [isIntegrated, show]);

    const handleDelete = async (email, id) => {
        console.log(email, id);
        try {
            await apiCall("POST", "/api/shopify/delete-product", { email, id });
            setShow(true);
        } catch (e) {
            console.error(e);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 150 },
        {
            field: "product",
            headerName: "Product",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params.row.img} alt="" />
                        {params.row.name}
                    </div>
                );
            }
        },
        { field: "stock", headerName: "Available Stock", width: 200 },
        { field: "status", headerName: "Status", width: 150 },
        { field: "price", headerName: "Price", width: 150 },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={{
                            pathname: `/editProducts/${params.row.id}`,
                            state: { id: params.row.id }
                        }}>
                            <button className="d-flex justify-content-center align-items-center productListEdit">Edit
                            </button>
                        </Link>
                        <DeleteOutline
                            className="productListDelete ms-4"
                            onClick={() => handleDelete(email, params.row.id)}
                        />
                    </>
                );
            }
        }
    ];

    return (
        <div className="productList">
            <h3 className="totalProducts">Your Products</h3>
            <div className="d-flex justify-content-center align-items-center">
                {show && <div
                    className="text-center w-50 alert alert-success alert-dismissible fade show d-flex align-items-center"
                    role="alert">
                    <svg className="bi flex-shrink-0 me-2" width={24} height={24} role="img" aria-label="Success" />
                    <div>
                        Product deleted!
                    </div>
                    <button className="btn-close btn-sm" type="button" data-bs-dismiss="alert" aria-label="Close" />
                </div>}
            </div>
            <DataGrid
                autoHeight
                className="grid"
                rows={products}
                disableSelectionOnClick
                columns={columns}
                pageSize={10}
                checkboxSelection
            />
        </div>
    );
}
