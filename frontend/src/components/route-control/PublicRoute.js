import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../hooks/AuthContext';

export default function PublicRoute(props) {
    const { auth, loading } = useContext(AuthContext);
    const { component: Component, ...rest } = props;

    if (loading) {
        return <></>;
    }

    if (!auth) {
        return <Component {...rest} />;
    }

    return <Navigate to='/' replace />;
}