import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {ProgressSpinner} from "primereact/progressspinner";
import OrderViewer from "../components/OrderViewer";
import {motion} from "framer-motion";
import {Toast} from "primereact/toast";

function ManageOrder() {

    const toast = useRef(null);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [])

    const fetchOrder = () => {
        setLoading(true)
        axios.get("http://localhost:8080/admin/order/find-next")
            .then(res => setOrder(res.data))
            .catch(err => {
                setOrder(null);
                showError(err.response.data.message)
            })
            .finally(() => setLoading(false));
    }

    const showError = (detail) => {
        toast.current.show({severity: 'error', summary: 'Error', detail: detail, life: 3000})
    }


    return (<motion.div
        initial={{width: 0}}
        animate={{width: "100%", transition: {bounce: 0, duration: 0.2}}}
        exit={{width: 0, transition: {bounce: 0, duration: 0.2}}}
        className={"d-flex flex-column align-items-center"}
    >
        <Toast ref={toast}/>
        <h1>Next Order</h1>
        {loading && <ProgressSpinner/>}
        {!loading && order && <OrderViewer order={order} adminView={true} fetchOrder={fetchOrder}/>}
        {!loading && !order && <h2>There are no orders to evade.</h2>}

    </motion.div>);
}

export default ManageOrder;