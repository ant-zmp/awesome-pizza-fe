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
        <div key={"product-" + product.id} className="d-flex flex-row justify-content-evenly p-1 m-1"
             style={{border: "1px solid", borderRadius: "10px", borderColor: "rgb(200,200,200)"}}
        >
            <div className={"d-flex flex-column justify-content-center"
                }
                     style={{border:"1px", borderRadius:"5px", marginRight:"4px"}}>
                    {loadingImg ? <ProgressSpinner/> : imgData &&
                        <img className={"rounded-4"} height={120} src={imgData} alt={product.name}/>
                    }
            </div>
            <br/>
            <div className="d-flex flex-column align-items-start w-75">
                <div className="flex-row"><h3><b>{product.name}</b></h3></div>
                <div className="product-price">${product.price}</div>
                <div className="flex-row "><i>{product.description}</i></div>
                <div >
                    {product.ingredients.map(
                        ingredient => <Chip label={ingredient} className={"m-1"}/>
                    )}
                </div>
                {/*<Rating value={data.rating} readOnly cancel={false}></Rating>*/}
                {/*<i className="pi pi-tag product-category-icon"></i><span*/}
                {/*className="product-category">{product.productType.name}</span>*/}
            </div>
            <div className={"d-flex flex-column justify-content-end"}>
                <div>
                    <div className={"d-flex flex-row justify-content-around align-items-center"}>
                        <Button label="-"
                                style={{borderRadius: "50%", height:"30px", width:"30px", backgroundColor:"#bf2727", borderStyle:"hidden"}}
                                onClick={onRemove}
                                disabled={!product.quantity}
                        />
                        <div>{product.quantity || 0}</div>
                        <Button label="+"
                                style={{borderRadius: "50%", height:"30px", width:"30px", backgroundColor:"#459e0d", borderStyle:"hidden"}}
                                onClick={onAdd}/>
                    </div>
                    <div>Total price: ${(product.quantity * product.price) || 0}</div>
                </div>
            </div>
            <div className="flex-column">
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