import React, {useEffect, useState} from "react";
import axios from 'axios';
import PreviewUnavailable from "../assets/preview-unavailable.png";
import PropTypes from "prop-types";

import {Button} from "primereact/button";
import {Chip} from "primereact/chip";
import {ProgressSpinner} from "primereact/progressspinner";

function ProductListItem({product, onAdd, onRemove}) {

    useEffect(() => {
        if (product) {
            loadImage()
        }
    }, [product]);

    const [loadingImg, setLoadingImg] = useState(true)
    const [imgData, setImgData] = useState();

    const loadImage = () => {
        if (product.imageId) {
            axios.get("http://localhost:8080/image/" + product.imageId, {responseType: "blob"})
                .then(res => {
                        setImgData(URL.createObjectURL(res.data));
                    }
                ).catch(err => {
                console.error(err)
                setImgData(PreviewUnavailable)
            }).finally(() => setLoadingImg(false));
        } else {
            setImgData(PreviewUnavailable);
            setLoadingImg(false);
        }
    }

    return (
        <div key={"product-"+product.id} className="d-flex flex-row justify-content-around">
                <div className={"flex-column"}>
                    {loadingImg ? <ProgressSpinner/> : imgData &&
                        <img height={150} src={imgData} alt={product.name}/>
                    }
                </div>
                <div className="d-flex flex-column align-items-center">
                    <div className="flex-row"><b>{product.name}</b></div>
                    <div className="flex-row "><i>{product.description}</i></div>
                    <div className={"flex-row "}>
                        {product.ingredients.map(
                            ingredient => <Chip label={ingredient} className={"m-1"}/>
                        )}
                    </div>
                    {/*<Rating value={data.rating} readOnly cancel={false}></Rating>*/}
                    {/*<i className="pi pi-tag product-category-icon"></i><span*/}
                    {/*className="product-category">{product.productType.name}</span>*/}
                </div>
                <div className="flex-column">
                    <div className="product-price">${product.price}</div>
                        <div>{product.quantity}</div>
                        <Button label="-" onClick={onRemove}/>
                        <Button label="+" onClick={onAdd}/>
                        <div>Total price: ${(product.quantity * product.price) || 0}</div>
                </div>
        </div>
    )
}

export default ProductListItem;

ProductListItem.propTypes = {
    product: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
}