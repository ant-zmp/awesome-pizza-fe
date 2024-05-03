import {Card} from "primereact/card";
import PropTypes from "prop-types";

export function Page (props) {
    return <div className={"grid"}>
        <div className={"col-12"}>
            <Card title={props.title}
                subTitle={props.subtitle}
                // header={<div className={"card-header"}></div>}
            >
                {props.children}
            </Card>
        </div>
    </div>
}

Page.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string
}