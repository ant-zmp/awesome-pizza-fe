import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import axios from "axios";
import {Carousel} from "primereact/carousel";
import {DataScroller} from 'primereact/datascroller';
import {Button} from "primereact/button";
import {Dialog} from 'primereact/dialog';
import {ListBox} from "primereact/listbox";
import ProductTypeRenderer from "../components/ProductTypeRenderer";
import ProductListItem from "../components/ProductListItem";
import {Field, Form} from 'react-final-form';
import {classNames} from 'primereact/utils';
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {Toast} from "primereact/toast";
import {useNavigate} from "react-router-dom";

function Menu() {

    let navigate = useNavigate();
    const toast = useRef(null);

    const [productTypes, setProductTypes] = useState([])
    const [selectedType, setSelectedType] = useState(null);

    const [products, setProducts] = useState([])

    const [cart, setCart] = useState({})
    const [dialogVisible, setDialogVisible] = useState(false);

    const [order, setOrder] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/customer/product-types")
            .then(res => setProductTypes(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (selectedType) {
            axios.get("http://localhost:8080/customer/products/" + selectedType)
                .then(res => {
                    setProducts(res.data.content);
                })
                .catch(err => console.log(err));
        } else {
            setProducts([]);
        }
    }, [selectedType])

    const selectType = (productType) => {
        setSelectedType(productType.id);
    }

    const itemTemplate = (product) => {
        product.quantity = cart[product.id]?.quantity;
        return <ProductListItem product={product} onAdd={() => onAdd(product)} onRemove={() => onRemove(product)}/>
    }

    const cartItemTemplate = (cartItem) => {
        return <div>{cartItem.quantity} x ${cartItem.product.price} - {cartItem.product.name} =
            ${cartItem.product.price * cartItem.quantity}</div>
    }

    const onAdd = (product) => {
        let newCart = {...cart};

        if (Object.keys(newCart).includes(product.id)) {
            newCart[product.id].quantity++;
        } else {
            newCart[product.id] = {product: {"name": product.name, "price": product.price}, quantity: 1}
        }

        setCart(newCart);
    }

    const onRemove = (product) => {
        let newCart = {...cart};
        if (Object.keys(newCart).includes(product.id)) {
            if (newCart[product.id].quantity > 1) {
                newCart[product.id].quantity--;
            } else {
                delete newCart[product.id];
            }
        }
        setCart(newCart);
    }

    const openDialog = () => setDialogVisible(true);
    const closeDialog = () => setDialogVisible(false);
    const calculateTotal = () => {
        let calculation = 0;
        let arr = Object.values(cart)
        if (arr.length > 0) {
            arr.forEach(item => calculation = calculation + (item.product.price * item.quantity))
        }

        return <span>{calculation}</span>
    }

    const validate = (data) => {
        let errors = {};

        if (!data.address) {
            errors.address = 'Address is required.';
        }

        return errors;
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);

    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };


    const confirmOrder = (data) => {
        let productMap = {};
        Object.keys(cart).forEach(key => productMap[key] = cart[key].quantity);
        let requestBody = {
            address: data.address,
            productQuantity: productMap,
            notes: data.notes

        }
        axios.post("http://localhost:8080/customer", requestBody)
            .then(res => {
                setOrder(res.data);
                reserCart()
                closeDialog();

            })
            .catch(err => {
                showError(err.response.data.message)
            })

    }

    const showError = (detail) => {
        toast.current.show({severity: 'error', summary: 'Error', detail: detail, life: 3000})
    }

    const reserCart = () => {
        setCart({});
    }

    const gotoTrackingPage = () => {
        navigate("/tracking/" + order.orderCode);
    }

    return (
        <motion.div
            initial={{width: 0}}
            animate={{width: "100%", transition: {bounce: 0, duration: 0.2}}}
            exit={{width: 0, transition: {bounce: 0, duration: 0.2}}}>

            <h1 className="menuTitle">Order</h1>

            {order ?
                <div>
                    <h2>Order confirmed!</h2>
                    <h2> Your order code is <b>{order.orderCode}</b>.</h2>
                    <Button onClick={gotoTrackingPage} label={"Check your order status"}/>
                </div> : <div>
                    <Toast ref={toast}/>
                    <Carousel value={productTypes} numVisible={3} numScroll={3}
                              itemTemplate={(i) => ProductTypeRenderer(i, () => selectType(i))}
                              header={<h5>Categories:</h5>}/>
                    <div className="d-flex flex-column h-100">
                        <div>

                            {
                                products.length > 0 &&

                                <DataScroller value={products} itemTemplate={itemTemplate} rows={5} scrollHeight="500px"
                                />}
                        </div>
                        <div className={"d-flex flex-row justify-content-end m-4"}>
                            <motion.button whileHover={{scale: 1.1}} onClick={openDialog} className={"rounded-4"}
                                           style={{backgroundColor:"#3d7ac1", color:"white", borderStyle:"hidden", padding:"10px"}}
                                    disabled={Object.values(cart).length === 0}>
                                Review order
                            </motion.button>
                        </div>
                    </div>
                    <Dialog onHide={closeDialog} visible={dialogVisible} header={"Order review"}
                            closable={true} className={"h-50 w-50"} resizable={false}>
                        <h5><b>Products:</b></h5>
                        <ListBox className={"overflow-y-auto"} options={Object.values(cart)}
                                 itemTemplate={cartItemTemplate}
                                 style={{height: "40%"}}
                        />
                        <div className={"d-flex justify-content-end"}
                             style={{marginRight: "5px"}}>Total: <b>${calculateTotal()}</b></div>

                        <Form onSubmit={confirmOrder} initialValues={{"address": null}} validate={validate}
                              render={({handleSubmit}) => (
                                  <form onSubmit={handleSubmit} onReset={closeDialog} className="p-fluid">
                                      <h6><b>Your address:</b></h6>
                                      <Field name="address" render={({input, meta}) => (
                                          <div className="field">
                                                  <span className="p-float-label">
                                        <InputText id="address" {...input} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid(meta)})}/>
                                        <label htmlFor="address"
                                               className={classNames({'p-error': isFormFieldValid(meta)})}></label>
                                    </span>
                                              {getFormErrorMessage(meta)}
                                          </div>
                                      )}/>
                                      <div className={"m-4"}/>
                                      <h6><b>Additional notes:</b></h6>
                                      <Field name="notes" render={({input}) => (
                                          <div className="field">
                                                  <span className="p-float-label">
                                        <InputTextarea id="notes" {...input} autoFocus/>
                                                      {/*<label htmlFor="notes"></label>*/}
                                    </span>
                                          </div>
                                      )}/>
                                      <br/>
                                      <div className={"d-flex flex-row justify-content-end"} style={{marginTop:"6px"}}>
                                          <motion.button whileHover={{scale: 1.05}}  type={"submit"} className="m-1 p-1 rounded-4 w-25"
                                                  style={{backgroundColor: "#459e0d", color:"white", borderStyle: "hidden"}}>Confirm order
                                          </motion.button>
                                          <motion.button whileHover={{scale: 1.05}} type={"reset"} className="m-1 p-1 rounded-4 w-25"
                                                  style={{backgroundColor: "#bf2727", color:"white", borderStyle: "hidden"}}>Go back
                                          </motion.button>
                                      </div>
                                  </form>
                              )}/>

                    </Dialog>

                </div>}
        </motion.div>
    )

}

export default Menu;