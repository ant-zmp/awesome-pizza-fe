import {Home} from "../pages/Home";
import Menu from "../pages/Menu";
import TrackOrder from "../pages/TrackOrder";
import ManageOrder from "../pages/ManageOrder";

export const routes = [
    {to: "/", title:"Home Page",  component:Home, element:<Home/>},
    {to: "/menu", title:"Menu",  component:Menu, element:<Menu/>},
    {to: "/tracking", title:"Track Order", component:TrackOrder, element:<TrackOrder/>},
    {to: "/tracking/:id", title:"Track Order", component:TrackOrder, element:<TrackOrder/>},
    {to: "/admin", title:"Manage Next Order", component:ManageOrder, element:<ManageOrder/>}
]