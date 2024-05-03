import React, {useEffect, useState} from "react";
import axios from 'axios';
import PreviewUnavailable from "../assets/preview-unavailable.png";
import "../styles/ProductTypeRendered.css"
import {ProgressSpinner} from "primereact/progressspinner";
import PropTypes from "prop-types";

function ProductTypeRenderer(productType, onClick) {

    useEffect(() => {
        if (productType) {
            loadImage()
        }
    }, [productType]);

    const [loadingImg, setLoadingImg] = useState(true)
    const [imgData, setImgData] = useState();

    const loadImage = () => {
        if (productType.imageId) {
            axios.get("http://localhost:8080/image/" + productType.imageId, {responseType: "blob"})
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
        <div className="product-item" onClick={onClick}>
            <div className="product-item-content">
                {/*<div className={"flex flex-row"}>*/}
                {/*    </div>*/}
                <div className="mb-3 img-container">
                    {loadingImg ? <ProgressSpinner/> : imgData &&
                        <img src={imgData} alt={productType.name} className={"product-image"}/>
                    }
                    <button className={"img-button"} onClick={onClick}>
                        <h4 className="mb-1">{productType.name}</h4>
                        <h6 className="mt-0 mb-3">Items: {productType.count}</h6>
                    </button>
                </div>

            </div>
        </div>)
        ;
}

export default ProductTypeRenderer;

ProductTypeRenderer.propTypes = {
    productType: PropTypes.object.isRequired,
    onClick: PropTypes.func
}