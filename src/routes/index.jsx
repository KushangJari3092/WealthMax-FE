/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Routes as ReactRoutes, Route, Navigate } from "react-router-dom";
import LandingPage from "../components/landing page";
import Login from "../components/auth/Login";
import Layout from "../components/common/Layout";
import Signup from "../components/auth/Signup";
import AuthLayout from "../components/auth/AuthLayout";
import Dashboard from "../components/dashboard";
import Cookies from "js-cookie";
import WatchList from "../components/watchlist";
import StockDetails from "../components/stockDetails";
import BankDetails from "../components/bank/BankDetails";
import AddBank from "../components/bank/AddBank";
import CapitalDetails from "../components/capital";
import OrderHistory from "../components/orderHistory";
import MyPortfolio from "../components/portfolio";
import Reports from "../components/reports";
import { useSelector } from "react-redux";
export default function Routes() {
  const token = useSelector((state) => state.auth?.token);
  const token2 = Cookies.get('token');
  console.log("token2",token2);
  console.log("token",token);
  
  const ProtectedRoute = ({ children }) => {
    
    return token || token2 ? children : <Navigate to="/login" replace />;
  };
  const PublicRoute = ({ children }) => {

    return token || token2 ? <Navigate to="/" replace /> : children;
  };
  return (
    <ReactRoutes>
      <Route
        path="/"
        element={
          <Layout>
            <LandingPage />
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketDetails/:symbol"
        element={
          <ProtectedRoute>
            <Layout>
              <StockDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <Layout>
              <WatchList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <Layout>
              <MyPortfolio />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Layout>
              <OrderHistory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bank-details"
        element={
          <ProtectedRoute>
            <Layout>
              <BankDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/capital"
        element={
          <ProtectedRoute>
            <Layout>
              <CapitalDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-bank"
        element={
          <ProtectedRoute>
            <Layout>
              <AddBank />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <AuthLayout>
              <Signup />
            </AuthLayout>
          </PublicRoute>
        }
      />
    </ReactRoutes>
  );
}
