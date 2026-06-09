import { useState, useEffect } from "react";
import { getCachedEvents, getCachedProducts } from "../../../services/referenceDataService";

export function useReferenceData() {
    const [events, setEvents]     = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const load = async () => {
            const [cachedEvents, cachedProducts] = await Promise.all([
                getCachedEvents(),
                getCachedProducts(),
            ]);
            setEvents(cachedEvents.filter(e => e.is_active));
            setProducts(cachedProducts.filter(p => p.is_active));
        };

        load();
    }, []);

    return { events, products };
}