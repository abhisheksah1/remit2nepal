import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { publicRouteElements } from "@/routes/public-routes";
import { adminRouteElements } from "@/routes/admin-routes";
import { Skeleton } from "@/components/ui/Skeleton";

const Login = lazy(() => import("@/pages/admin/Login"));
const ChangePassword = lazy(() => import("@/pages/admin/ChangePassword"));

function Fallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/change-password" element={<ChangePassword />} />
        <Route path="/admin" element={<AdminLayout />}>
          {adminRouteElements}
        </Route>
        <Route path="/" element={<PublicLayout />}>
          {publicRouteElements}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
