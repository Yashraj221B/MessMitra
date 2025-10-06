"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("./contexts/AuthContext");
var ProtectedRoute_1 = require("./components/ProtectedRoute");
var Login_1 = require("./pages/Login");
var Dashboard_1 = require("./pages/Dashboard");
var Members_1 = require("./pages/Members");
var MemberProfile_1 = require("./pages/MemberProfile");
var AddMember_1 = require("./pages/AddMember");
var Attendance_1 = require("./pages/Attendance");
var Reports_1 = require("./pages/Reports");
var Settings_1 = require("./pages/Settings");
var Layout_1 = require("./components/Layout");
var react_1 = require("react");
function App() {
    (0, react_1.useEffect)(function () {
        document.title = "MessMitra - Yashraj221B";
    }, []);
    return (<AuthContext_1.AuthProvider>
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          {/* Public Routes */}
          <react_router_dom_1.Route path="/" element={<Login_1.default />}/>

          {/* Protected Routes with Layout */}
          <react_router_dom_1.Route path="/dashboard" element={<ProtectedRoute_1.default>
                <Layout_1.default><Dashboard_1.default /></Layout_1.default>
              </ProtectedRoute_1.default>}/>
          <react_router_dom_1.Route path="/members" element={<ProtectedRoute_1.default>
                <Layout_1.default><Members_1.default /></Layout_1.default>
              </ProtectedRoute_1.default>}/>
          <react_router_dom_1.Route path="/members/add" element={<ProtectedRoute_1.default>
                <Layout_1.default><AddMember_1.default /></Layout_1.default>
              </ProtectedRoute_1.default>}/>
          <react_router_dom_1.Route path="/members/:id" element={<ProtectedRoute_1.default>
                <Layout_1.default><MemberProfile_1.default /></Layout_1.default>
              </ProtectedRoute_1.default>}/>
          <react_router_dom_1.Route path="/attendance" element={<ProtectedRoute_1.default>
                <Layout_1.default><Attendance_1.default /></Layout_1.default>
              </ProtectedRoute_1.default>}/>
          <react_router_dom_1.Route path="/reports" element={<ProtectedRoute_1.default>
                <Layout_1.default><Reports_1.default /></Layout_1.default>
              </ProtectedRoute_1.default>}/>
          <react_router_dom_1.Route path="/settings" element={<ProtectedRoute_1.default>
                <Layout_1.default><Settings_1.default /></Layout_1.default>
              </ProtectedRoute_1.default>}/>

          {/* Catch all - redirect to login */}
          <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/" replace/>}/>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </AuthContext_1.AuthProvider>);
}
exports.default = App;
