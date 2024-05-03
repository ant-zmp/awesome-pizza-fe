import React, {useRef, useState} from 'react';
import {Steps} from "primereact/steps";
import {ListBox} from "primereact/listbox";
import {Button} from "primereact/button";
import axios from "axios";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import {Field, Form} from "react-final-form";
import {classNames} from "primereact/utils";
import {InputTextarea} from "primereact/inputtextarea";

function OrderViewer({order, adminView, fetchOrder}) {

    const [dialogVisible, setDialogVisible] = useState(false);

    const toast = useRef(null);

    const stepItems = [
        {
            id: "PLACED",
            label: "Placed"
        },
        {
            id: "IN_PROGRESS",
            label: "Preparation"
        },
        {
            id: "DISPATCHED",
            label: "Delivered"
        },
        {
            id: "COMPLETED",
            label: "Completed",
        }
    ]

    const getIndex = () => {
        return stepItems.map(i => i.id).indexOf(order.status);
    }

    const itemTemplate = (item) => {
        return <div>{item.quantity} x ${item.price} - <b>{item.name}</b> = ${item.price * item.quantity}</div>
    }

    const renderRow = (label, data) => {
        return (
            <div className="d-flex flex-row col-12 border-bottom-1 border-right-1 p-0"
                 style={{textAlign: "left", borderColor: "#CCCCCC"}}>
                <div data-pr-tooltip={"label-" + label} className={"col-3 text-uppercase"}
                     style={{backgroundColor: "#F2F1EF", padding: "0.5rem", minWidth: "90px"}}><i>{label}</i></div>
                <div data-pr-tooltip={"label-tt-" + label} className={"col-9 p-2"}
                     style={{padding: "0.5rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                    <i>{data || "-"}</i></div>
            </div>)
    }

    const renderAdminButton = () => {
        let label = "PLACED" === order.status ? "Accept order" : "Send for delivery";
        let msg = "PLACED" === order.status ? "Order accepted" : "Order sent for delivery";

        return <div>
            {order.status !== "DISPATCHED" &&
                <Button label={label} onClick={() => {
                    axios.put("http://localhost:8080/admin/order/" + order.id + "/change-status")
                        .then(res => showInfo(msg))
                        .catch(err => showError(err.response.data.message))
                        .finally(() => fetchOrder());
                }}/>}

            <Button label={"Deny order"} onClick={openDialog}/>
        </div>
    }

    const renderCustomerButton = () => {
        if ("DISPATCHED" === order.status) {
            return <Button label={"Confirm delivery"} onClick={() => {
                axios.put("http://localhost:8080/customer/order/" + order.id + "/confirm-delivery")
                    .then(res => showInfo("Delivery confirmed."))
                    .catch(err => showError(err.response.data.message))
                    .finally(() => fetchOrder());
            }}/>
        }
    }

    const showError = (detail) => {
        toast.current.show({severity: 'error', summary: 'Error', detail: detail, life: 3000})
    }

    const showInfo = (detail) => {
        toast.current.show({severity: "success", summary: 'Success', detail: detail, life: 3000})
    }

    const openDialog = () => setDialogVisible(true);
    const closeDialog = () => setDialogVisible(false);
    const validate = (data) => {
        let errors = {};

        if (!data.reason) {
            errors.reason = 'Reason is required.';
        }

        return errors;
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    const confirmDenial = (data) => {
        axios.put("http://localhost:8080/admin/order/" + order.id + "/deny", null, {params: {"reason": data.reason}})
            .then(res => showInfo("Delivery confirmed."))
            .catch(err => showError(err.response.data.message))
            .finally(() => fetchOrder());
    }

    return (<div ref={toast}>
            <Toast ref={toast}/>
            <h1> Order <b>{order.orderCode}</b></h1>
            <br/>
            <h2>Status:</h2>
            {order.status !== "CANCELLED" ?
                <Steps model={stepItems} activeIndex={getIndex()}/> :
                <div className={"d-flex flex-column align-items-center"}>
                    <h3 className={"d-flex flex-row"} style={{color: "#d50d0d"}}>CANCELLED</h3>
                    <div className={"d-flex flex-row"}><b>Reason:</b> {order.reason}</div>
                </div>}
            <br/>
            <h2>Order review:</h2>
            <ListBox options={order.productQuantity} itemTemplate={itemTemplate}/>
            <h3><b>Total:</b> ${order.totalPrice}</h3>
            <div className={"grid fluid m-0 border-top-1 border-left-1"} style={{borderColor: "#CCCCCC"}}>
                {!adminView && renderRow("Orders in line before this one", order.inLineBefore)}
                {renderRow("Order Date", order.orderDate)}
                {renderRow("Address", order.address)}
                {renderRow("Notes", order.notes)}
                {order.reason && renderRow("Order Code", order.reason)}
            </div>
            <br/>
            {!["COMPLETED", "CANCELLED"].includes(order.status) && adminView && renderAdminButton()}
            {!adminView && renderCustomerButton()}

            <Dialog onHide={closeDialog} visible={dialogVisible} header={"Order review"} closable={true}>
                <p>Are you sure to deny this order?</p>

                <Form onSubmit={confirmDenial} initialValues={{"address": null}} validate={validate}
                      render={({handleSubmit}) => (
                          <form onSubmit={handleSubmit} onReset={closeDialog} className="p-fluid">
                              <Field name="reason" render={({input, meta}) => (
                                  <div className="field">
                                    <span className="p-float-label">
                                        <InputTextarea id="reason" {...input} autoFocus
                                                       className={classNames({'p-invalid': isFormFieldValid(meta)})}/>
                                        <label htmlFor="reason"
                                               className={classNames({'p-error': isFormFieldValid(meta)})}>Reason*</label>
                                    </span>
                                      {getFormErrorMessage(meta)}
                                  </div>
                              )}/>
                              <Button type={"submit"} className="mt-2">Confirm order</Button>
                          </form>
                      )}/>
            </Dialog>
        </div>

    )
}

export default OrderViewer
