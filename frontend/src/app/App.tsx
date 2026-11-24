import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { LeaveTrackerLayout } from "@/layouts/LeaveTrackerLayout";
import { publicRouteElements } from "@/routes/public-routes";
import { adminRouteElements } from "@/routes/admin-routes";
import { Skeleton } from "@/components/ui/Skeleton";

const Login = lazy(() => import("@/pages/admin/Login"));
const ChangePassword = lazy(() => import("@/pages/admin/ChangePassword"));
const LeaveLogin = lazy(() => import("@/pages/leave/Login"));
const LeaveDashboard = lazy(() => import("@/pages/leave/Dashboard"));
const LeaveRecords = lazy(() => import("@/pages/leave/Leaves"));
const LeaveTypes = lazy(() => import("@/pages/leave/Types"));
const LeaveEmployees = lazy(() => import("@/pages/leave/Employees"));
const LeaveSummary = lazy(() => import("@/pages/leave/Summary"));

function AuthFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-navy-50">
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AuthFallback />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/admin/change-password"
        element={
          <Suspense fallback={<AuthFallback />}>
            <ChangePassword />
          </Suspense>
        }
      />
      <Route path="/admin" element={<AdminLayout />}>
        {adminRouteElements}
      </Route>
      <Route
        path="/leave/tracker"
        element={
          <Suspense fallback={<AuthFallback />}>
            <LeaveLogin />
          </Suspense>
        }
      />
      <Route element={<LeaveTrackerLayout />}>
        <Route path="/leave/tracker/dashboard" element={<LeaveDashboard />} />
        <Route path="/leave/tracker/leaves" element={<LeaveRecords />} />
        <Route path="/leave/tracker/types" element={<LeaveTypes />} />
        <Route path="/leave/tracker/employees" element={<LeaveEmployees />} />
        <Route path="/leave/tracker/summary" element={<LeaveSummary />} />
      </Route>
      <Route path="/" element={<PublicLayout />}>
        {publicRouteElements}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
