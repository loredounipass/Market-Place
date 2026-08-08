const useCartDrawer = ({ items = [] }) => {



    // CALCULA EL TOTAL DEL CARRITO BASADO EN LOS ITEMS Y SU CANTIDAD
    const total = items.reduce((s, it) => s + (parseFloat(it.price || 0) * (it.qty || 1)), 0);

    return {
        total
    };
};

export default useCartDrawer;
