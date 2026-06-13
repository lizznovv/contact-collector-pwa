
export default function LeadFormFields({
    form,
    errors,
    events,
    products,
    isEditing,
    onFieldChange,
    onEventsChange,
    onProductsChange
}) {

    const getEventName =
        (eventId) => events.find(
            (e) => e.id === eventId)?.name ?? eventId;
    const getProductName =
        (productId) => products.find(
            (p) => p.id === productId)?.name ?? productId;

    return (
        <>
            <Field label="ФИО" error={errors.full_name}>
                <input
                    type="text"
                    name="full_name"
                    placeholder="ФИО"
                    value={form.full_name}
                    onChange={onFieldChange}
                    disabled={!isEditing}
                />
            </Field>

            <Field label="Телефон" error={errors.phone}>
                <input
                    type="text"
                    name="phone"
                    placeholder="+7 (___) ___-__-__"
                    value={form.phone}
                    onChange={onFieldChange}
                    disabled={!isEditing}
                />
            </Field>

            <Field label="Email" error={errors.email}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={onFieldChange}
                    disabled={!isEditing}
                />
            </Field>

            <Field label="Компания">
                <input
                    type="text"
                    name="company"
                    placeholder="Компания"
                    value={form.company}
                    onChange={onFieldChange}
                    disabled={!isEditing}
                />
            </Field>

            <Field label="Должность">
                <input
                    type="text"
                    name="position"
                    placeholder="Должность (опционально)"
                    value={form.position}
                    onChange={onFieldChange}
                    disabled={!isEditing}
                />
            </Field>

            <Field label="Комментарий">
                <textarea
                    name="comment"
                    placeholder="Комментарий (опционально)"
                    value={form.position}
                    onChange={onFieldChange}
                    disabled={!isEditing}
                    rows={4}
                    className="form-textarea"
                    style={{
                        width: "100%",
                        resize: "vertical",
                        minHeight: "100px",
                        padding: "12px 14px",
                        boxSizing: "border-box"
                    }}
                />
            </Field>

            <Field label="События" error={errors.event_id}>
                {isEditing ? (
                    <select
                        name="event_id"
                        value={form.event_id ?? ""}
                        onChange={onEventsChange}
                        style={{ width: "100%", minHeight: 50, padding: 8 }}
                    >
                        <option value="">— выберите событие —</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p style={{ margin: 0 }}>
                        {form.event_id ? getEventName(form.event_id) : "—"}
                    </p>
                )}
            </Field>

            <Field label="Продукты" error={errors.product}>
                {isEditing ? (
                    <div className="products-chips-container">
                        {products.map((product) => {
                            const isSelected = form.product_ids?.some(
                                (id) => String(id) === String(product.id)
                            );

                            return (
                                <button
                                    key={product.id}
                                    type="button"
                                    className={`product-chip ${isSelected ? 'active' : ''}`}
                                    onClick={() => {
                                        let updatedIds;
                                        if (isSelected) {
                                            updatedIds = form.product_ids.filter(
                                                (id) => String(id) !== String(product.id)
                                            );
                                        } else {
                                            updatedIds = [...(form.product_ids || []), product.id];
                                        }

                                        // ИМИТИРУЕМ СТРУКТУРУ SELECT MULTIPLE ДЛЯ ВАШЕГО ХУКА:
                                        onProductsChange({
                                            target: {
                                                name: 'product_ids',
                                                // Создаем фейковый массив выбранных опций, который требует хук
                                                selectedOptions: updatedIds.map(id => ({ value: String(id) }))
                                            }
                                        });
                                    }}
                                >
                                    {product.name}
                                    {isSelected && <span className="chip-icon">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <p style={{ margin: 0, fontWeight: 500, color: "var(--text-primary)" }}>
                        {form.product_ids?.length > 0
                            ? form.product_ids.map(getProductName).join(", ")
                            : "—"}
                    </p>
                )}
            </Field>
        </>
    );
}

function Field({ label, error, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>{label}</label>
            {children}
            {error && <p style={{ color: "red", margin: "4px 0 0", fontSize: 13 }}>{error}</p>}
        </div>
    );
}
