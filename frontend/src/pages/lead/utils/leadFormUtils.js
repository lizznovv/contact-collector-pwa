export function buildPayload(form) {
    return {
        full_name:   form.full_name,
        phone:       form.phone,
        email:       form.email,
        company:     form.company,
        position:    form.position,
        event_id:    form.event_id,
        product:     form.product_ids,
    };
}

export function getEventName(events, eventId) {
    return events.find(e => e.id === eventId)?.name ?? eventId;
}


export function getProductName(products, productId) {
    return products.find(p => p.id === productId)?.name ?? productId;
}

export function isFormValid(form) {
    return Boolean(
        form.full_name &&
        form.phone &&
        form.email &&
        form.company &&
        form.event_id &&
        form.product_ids?.length > 0
    );
}

export function mapLeadToForm(lead) {
    return {
        id:          lead.id,
        full_name:   lead.full_name  ?? "",
        phone:       lead.phone      ?? "",
        email:       lead.email      ?? "",
        company:     lead.company    ?? "",
        position:    lead.position   ?? "",
        event_id:    lead.event_id   ?? null,
        product_ids: lead.products
            ? lead.products.map(p => p.id ?? p)
            : (lead.product_ids ?? lead.product ?? []),
    };
}