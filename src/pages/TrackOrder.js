import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {Button} from "primereact/button";
import {motion} from "framer-motion";
import axios from "axios";
import {Toast} from "primereact/toast";
import OrderViewer from "../components/OrderViewer";
import {Field, Form} from "react-final-form";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";

function TrackOrder() {

    let {id} = useParams();
    const toast = useRef(null);

    const [orderCode, setOrderCode] = useState(id);
    const [order, setOrder] = useState();

    const clearOrderCode = () => setOrderCode(null);

    useEffect(() => {
        fetchOrder();
    }, [orderCode]);

    const fetchOrder = () => {
        if (orderCode) {
            axios.get("http://localhost:8080/customer/order/" + orderCode)
                .then(res => setOrder(res.data))
                .catch(err => {
                    console.log(err)
                    showError(err.response.data.message)
                })
        } else {
            setOrder(null);
            setOrderCode(null)
        }
    }

    const showError = (detail) => {
        toast.current.show({severity: 'error', summary: 'Error', detail: detail, life: 3000})
    }

    const searchOrder = (data) => {
        setOrderCode(data.orderCode);
    }

    const validate = (data) => {
        let errors = {};

        if (!data.orderCode) {
            errors.orderCode = 'A code is required.';
        } else if (!/^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/.test(data.orderCode)) {
            errors.orderCode = 'Invalid order code.';
        }

        return errors;
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);

    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };


    return (<motion.div
        initial={{width: 0}}
        animate={{width: "100%", transition: {bounce: 0, duration: 0.2}}}
        exit={{width: 0, transition: {bounce: 0, duration: 0.2}}}>
            <Toast ref={toast}/>
            <div className={"d-flex flex-row align-items-center justify-content-center p-4"}>
                <h2>Order Code:</h2>
                {orderCode && order ?
                    <div className={"d-flex m-2 align-items-center"}>
                        <h2 className={"p-2"}><b>{orderCode}</b></h2>
                        <Button className={"rounded-4 h-25"} label={"Clear"} onClick={clearOrderCode} style={{backgroundColor:"#3d7ac1"}}/>
                    </div> :

                    <Form onSubmit={searchOrder} initialValues={{"address": null}} validate={validate}
                          render={({handleSubmit}) => (
                              <form onSubmit={handleSubmit} className="d-flex flex-row m-2 align-items-center">
                                  <Field name="orderCode" render={({input, meta}) => (
                                      <div>
                                         <span className="flex-column p-float-label">
                                             <InputText id="orderCode" {...input} autoFocus
                                                        className={classNames({'p-invalid': isFormFieldValid(meta)})}/>
                                             <label htmlFor="orderCode"
                                                    className={classNames({'p-error': isFormFieldValid(meta)})}>Order Code*</label>
                                         </span>
                                          {getFormErrorMessage(meta)}
                                      </div>
                                  )}/>
                                  <Button type={"submit"} className="flex-column mt-2 rounded-4"
                                          style={{width: "100%", height: "auto", marginLeft:"4px", backgroundColor:"#3d7ac1"}}>Confirm
                                      order</Button>
                              </form>
                          )}/>

                }
            </div>
            {order &&
                <div className={"d-flex flex-column align-items-center"}><OrderViewer adminView={false} order={order} fetchOrder={fetchOrder}/>
                </div>}
    </motion.div>)
}

export default TrackOrder