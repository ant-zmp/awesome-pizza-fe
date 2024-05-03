import {Route, Routes, useLocation} from "react-router-dom";
import {routes} from "../router/routes";
import {React} from "react";


export function MainBody() {
    const location = useLocation();

    return <div className={"content"}>
        
            <Routes location={location} key={location.pathname}>
                {routes.map((route, index) => {
                    return <Route key={`router${index}`} path={route.to}
                                  element={route.element}>
                        {route.title}
                    </Route>
                })}
            </Routes>
    </div>
}
